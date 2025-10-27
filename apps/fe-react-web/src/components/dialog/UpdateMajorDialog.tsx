import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMajorHook } from "@/hooks/use-major";
import type { TMajor } from "@/schema/major.schema";
import { UpdateMajorSchema } from "@/schema/major.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface UpdateMajorDialogProps {
  major: TMajor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateSuccess?: () => void;
}

type TUpdateMajorSchema = z.infer<typeof UpdateMajorSchema>;

export function UpdateMajorDialog({ major, open, onOpenChange, onUpdateSuccess }: UpdateMajorDialogProps) {
  const { useUpdateMajor } = useMajorHook();
  const { mutate: updateMajor, isPending } = useUpdateMajor();
  const queryClient = useQueryClient();

  const form = useForm<TUpdateMajorSchema>({
    resolver: zodResolver(UpdateMajorSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (major) {
      form.reset({ name: major.name });
    }
  }, [major, form]);

  const onSubmit = (data: TUpdateMajorSchema) => {
    if (!major?.id) return;

    updateMajor(
      { id: major.id, data },
      {
        onSuccess: () => {
          toast.success("Cập nhật ngành học thành công!");
          queryClient.invalidateQueries({ queryKey: ["majorList"] });
          onUpdateSuccess?.();
          onOpenChange(false);
        },
        onError: (error: Error) => {
          const axiosError = error as AxiosError<{ message: string }>;
          const errorMessage = axiosError.response?.data?.message || "Cập nhật thất bại!";
          toast.error(errorMessage);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cập nhật ngành học</DialogTitle>
          <DialogDescription>Chỉnh sửa thông tin ngành học.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên ngành học</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Công nghệ thông tin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Đang cập nhật..." : "Lưu"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
