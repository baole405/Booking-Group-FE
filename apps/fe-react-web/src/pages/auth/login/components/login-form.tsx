import Loading from "@/assets/loading/loading";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { handleApiError } from "@/lib/error";
import { cn } from "@/lib/utils";
import { setUser } from "@/redux/User/user-slice";
import { LoginSchema, type TLoginRequest } from "@/schema/auth.schema";
import { RoleSchema } from "@/schema/role.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { jwtDecode } from "jwt-decode";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const { loginMutation } = useAuth();
  const dispatch = useDispatch();

  const form = useForm<TLoginRequest>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: TLoginRequest) => {
    if (loginMutation.isPending) return;

    try {
      const result = await loginMutation.mutateAsync(data);
      console.log("Login successful:", result.data);

      const accessToken = result.data.data.token;
      const role = (jwtDecode(accessToken) as any).role;

      if (RoleSchema.safeParse(role).error) {
        throw {
          response: {
            status: 403,
            data: {
              status: 403,
              message: "Tài khoản không có quyền truy cập.",
              data: "Bạn không có quyền truy cập vào tài nguyên này.",
            },
          },
        };
      }

      dispatch(setUser(result.data.data));
    } catch (error) {
      handleApiError(error);
    }
  };

  const RandomIllustration = useMemo(() => <Loading className="h-auto w-full" />, []);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="overflow-hidden p-0">
        <div className="grid gap-25 p-0 md:grid-cols-2">
          <Form {...form}>
            <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <div className="flex flex-col gap-6">
                <Loading className="h-12 w-12" />
                <div className="flex flex-col items-start text-left">
                  <p className="text-4xl font-bold">Đăng nhập</p>
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Nhập email" disabled={loginMutation.isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Nhập mật khẩu" disabled={loginMutation.isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={loginMutation.isPending} size="lg">
                  {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>
              </div>
            </form>
          </Form>

          <div className="flex items-center justify-center p-6">{RandomIllustration}</div>
        </div>
      </div>
    </div>
  );
}
