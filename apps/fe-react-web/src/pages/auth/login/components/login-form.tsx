import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

// Illustrations + Logo
import LoginFormIllustration1 from "@/assets/illustration/login-form-illustration-1";
import LoginFormIllustration2 from "@/assets/illustration/login-form-illustration-2";
import LoginFormIllustration3 from "@/assets/illustration/login-form-illustration-3";
import LoginFormIllustration4 from "@/assets/illustration/login-form-illustration-4";
import Logo from "@/assets/Logo.svg";

export function LoginForm() {
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const RandomIllustration = useMemo<React.ComponentType<{ className?: string }>>(() => {
    const illustrations: React.ComponentType<{ className?: string }>[] = [
      LoginFormIllustration1,
      LoginFormIllustration2,
      LoginFormIllustration3,
      LoginFormIllustration4,
    ];

    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const randomIndex = array[0] % illustrations.length;

    return illustrations[randomIndex];
  }, []);

  return (
    <div className="bg-muted/30 flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-4xl shadow-xl">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2">
            {/* Form */}
            <Form {...form}>
              <form className="space-y-6 p-6 md:p-8">
                <img src={Logo} alt="Logo" className="size-18" />
                <div className="flex flex-col items-start text-left">
                  <p className="text-4xl font-bold">Đăng nhập</p>
                </div>

                {/* Username */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên đăng nhập</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Nhập tên đăng nhập" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Nhập mật khẩu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" size="lg">
                  Đăng nhập
                </Button>
              </form>
            </Form>

            {/* Illustration */}
            <div className="bg-muted/20 flex items-center justify-center p-6">
              <RandomIllustration className="max-h-[400px] w-auto" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
