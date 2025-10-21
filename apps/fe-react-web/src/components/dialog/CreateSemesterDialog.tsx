import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSemesterHook } from "@/hooks/use-semester.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const CreateSemesterSchema = z.object({
  name: z.string().min(1, "Tên học kỳ không được để trống"),
});

type TCreateSemesterSchema = z.infer<typeof CreateSemesterSchema>;

export function CreateSemesterDialog() {
  const [open, setOpen] = useState(false);
  const { useCreateSemester } = useSemesterHook();
  const { mutate: createSemester, isPending } = useCreateSemester();
  const queryClient = useQueryClient();

  const form = useForm<TCreateSemesterSchema>({
    resolver: zodResolver(CreateSemesterSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: TCreateSemesterSchema) => {
    createSemester(data, {
      onSuccess: () => {
        toast.success("Tạo học kỳ thành công!");
        queryClient.invalidateQueries({ queryKey: ["semesterList"] });
        form.reset();
        setOpen(false); // Close the dialog on success
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || "Tạo học kỳ thất bại!";
        toast.error(errorMessage);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Tạo học kỳ mới</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tạo học kỳ mới</DialogTitle>
          <DialogDescription>Nhập tên cho học kỳ mới. Tên phải là duy nhất.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên học kỳ</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: SPRING2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Đang tạo..." : "Tạo"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
