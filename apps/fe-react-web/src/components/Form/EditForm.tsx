import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMajorHook } from "@/hooks/use-major";
import { useUserHook } from "@/hooks/use-user";
import type { TMajor } from "@/schema/major.schema";
import type { TUpdateUserSchema, TUser } from "@/schema/user.schema";
import { UpdateUserSchema } from "@/schema/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface EditFormProps {
  user: TUser;
  onSuccess?: () => void;
}

export function EditForm({ user, onSuccess }: EditFormProps) {
  const { useMajorList } = useMajorHook();
  const { data: majorsResponse } = useMajorList();
  const majors = majorsResponse?.data?.data;
  const { useUpdateUser } = useUserHook();
  const { mutate: updateUser, isPending: isSubmitting } = useUpdateUser(user.id);

  const form = useForm<TUpdateUserSchema>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      cvUrl: user.cvUrl || "",
      avatarUrl: user.avatarUrl || "",
      major: user.major ?? undefined,
    },
  });

  const { isDirty } = form.formState;

  async function onSubmit(data: TUpdateUserSchema) {
    updateUser(data, {
      onSuccess: () => {
        toast.success("Cập nhật thông tin thành công");
        onSuccess?.();
        form.reset(data); // Reset form to new values to clear dirty state
      },
      onError: (error) => {
        console.error("Error updating user:", error);
        toast.error("Có lỗi xảy ra khi cập nhật thông tin");
      },
    });
  }

  useEffect(() => {
    // Reset form when user changes
    form.reset({
      cvUrl: user.cvUrl || "",
      avatarUrl: user.avatarUrl || "",
      major: user.major ?? undefined,
    });
  }, [user, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="avatarUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ảnh đại diện</FormLabel>
              <FormControl>
                <Input placeholder="Nhập đường dẫn ảnh đại diện" {...field} value={field.value || ""} />
              </FormControl>
              <FormDescription>Đường dẫn đến ảnh đại diện của bạn (URL)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cvUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CV</FormLabel>
              <FormControl>
                <Input placeholder="Nhập đường dẫn CV" {...field} value={field.value || ""} />
              </FormControl>
              <FormDescription>Đường dẫn đến CV của bạn (URL)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="major"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chuyên ngành</FormLabel>
              <Select
                onValueChange={(value) => {
                  const major = majors?.find((m: TMajor) => m.code === value);
                  if (major) {
                    field.onChange(major);
                  }
                }}
                value={field.value?.code}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chuyên ngành" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {majors?.map((major: TMajor) => (
                    <SelectItem key={major.code} value={major.code}>
                      {major.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Chuyên ngành của bạn</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={!isDirty || isSubmitting}>
          {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
        </Button>
      </form>
    </Form>
  );
}
