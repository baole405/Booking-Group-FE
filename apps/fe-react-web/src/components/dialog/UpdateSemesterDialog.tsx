import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useSemesterHook } from "@/hooks/use-semester";
import type { TSemester } from "@/schema/semester.schema";
import { UpdateSemesterSchema } from "@/schema/semester.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface UpdateSemesterDialogProps {
  semester: TSemester;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateSuccess: () => void; // Add a callback for successful update
}

type TUpdateSemesterSchema = z.infer<typeof UpdateSemesterSchema>;

export function UpdateSemesterDialog({ semester, open, onOpenChange, onUpdateSuccess }: UpdateSemesterDialogProps) {
  const { useUpdateSemester } = useSemesterHook();
  const { mutate: updateSemester, isPending } = useUpdateSemester();
  const queryClient = useQueryClient();

  const form = useForm<TUpdateSemesterSchema>({
    resolver: zodResolver(UpdateSemesterSchema),
    defaultValues: {
      name: "",
      active: true,
    },
  });

  useEffect(() => {
    if (semester) {
      form.reset({ name: semester.name, active: semester.active });
    }
  }, [semester, form]);

  const onSubmit = (data: TUpdateSemesterSchema) => {
    if (!semester?.id) return;

    updateSemester(
      { id: semester.id, data },
      {
        onSuccess: () => {
          toast.success("Cập nhật học kỳ thành công!");
          queryClient.invalidateQueries({ queryKey: ["semesterList"] });
          onOpenChange(false); // Close the update dialog
          onUpdateSuccess(); // Call the success callback
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
          <DialogTitle>Cập nhật học kỳ</DialogTitle>
          <DialogDescription>Chỉnh sửa thông tin học kỳ.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên học kỳ</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., SPRING2025" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Trạng thái</FormLabel>
                    <p className="text-muted-foreground text-sm">{field.value ? "Học kỳ đang hoạt động" : "Học kỳ đã ngưng hoạt động"}</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
