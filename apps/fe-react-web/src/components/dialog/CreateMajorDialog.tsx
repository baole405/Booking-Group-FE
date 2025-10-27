import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMajorHook } from "@/hooks/use-major";
import { CreateMajorSchema } from "@/schema/major.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type TCreateMajorSchema = z.infer<typeof CreateMajorSchema>;

export function CreateMajorDialog() {
  const [open, setOpen] = useState(false);
  const { useCreateMajor } = useMajorHook();
  const { mutate: createMajor, isPending } = useCreateMajor();
  const queryClient = useQueryClient();

  const form = useForm<TCreateMajorSchema>({
    resolver: zodResolver(CreateMajorSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: TCreateMajorSchema) => {
    createMajor(data, {
      onSuccess: () => {
        toast.success("Tạo ngành học thành công!");
        queryClient.invalidateQueries({ queryKey: ["majorList"] });
        form.reset();
        setOpen(false);
      },
      onError: (error: Error) => {
        const axiosError = error as AxiosError<{ message: string }>;
        const errorMessage = axiosError.response?.data?.message || "Tạo ngành học thất bại!";
        toast.error(errorMessage);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Tạo ngành học mới</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tạo ngành học mới</DialogTitle>
          <DialogDescription>Điền thông tin để tạo ngành học mới.</DialogDescription>
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
                {isPending ? "Đang tạo..." : "Tạo"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
