import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSemesterHook } from "@/hooks/use-semester.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const SEMESTER_TYPES = ["SPRING", "FALL", "SUMMER"] as const;

const CreateSemesterSchema = z.object({
  semesterType: z.string().min(1, "Vui lòng chọn kỳ học"),
  year: z
    .string()
    .min(4, "Năm phải có 4 chữ số")
    .max(4, "Năm phải có 4 chữ số")
    .regex(/^\d{4}$/, "Năm phải là số có 4 chữ số")
    .refine((val) => {
      const year = parseInt(val);
      const currentYear = new Date().getFullYear();
      return year >= 2020 && year <= currentYear + 10;
    }, "Năm phải từ 2020 đến 10 năm sau hiện tại"),
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
      semesterType: undefined,
      year: new Date().getFullYear().toString(),
    },
  });

  const onSubmit = (data: TCreateSemesterSchema) => {
    // Ghép semesterType + year thành name (VD: SPRING2025)
    const semesterName = `${data.semesterType}${data.year}`;

    createSemester(
      { name: semesterName },
      {
        onSuccess: () => {
          toast.success(`Tạo học kỳ ${semesterName} thành công!`);
          queryClient.invalidateQueries({ queryKey: ["semesterList"] });
          form.reset({
            semesterType: undefined,
            year: new Date().getFullYear().toString(),
          });
          setOpen(false);
        },
        onError: (error: unknown) => {
          const err = error as { response?: { data?: { message?: string } } };
          const errorMessage = err?.response?.data?.message || "Tạo học kỳ thất bại!";
          toast.error(errorMessage);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Tạo học kỳ mới</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tạo học kỳ mới</DialogTitle>
          <DialogDescription>Chọn kỳ học và năm để tạo học kỳ. Format: SPRING/FALL/SUMMER + Năm (VD: SPRING2025)</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            {/* Semester Type Dropdown */}
            <FormField
              control={form.control}
              name="semesterType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kỳ học *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn kỳ học" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SEMESTER_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Year Input */}
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Năm *</FormLabel>
                  <FormControl>
                    <Input placeholder="VD: 2025" maxLength={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preview */}
            {form.watch("semesterType") && form.watch("year") && (
              <div className="bg-muted rounded-md p-3">
                <p className="text-muted-foreground text-sm">Tên học kỳ sẽ tạo:</p>
                <p className="text-primary font-mono text-lg font-semibold">
                  {form.watch("semesterType")}
                  {form.watch("year")}
                </p>
              </div>
            )}

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Đang tạo..." : "Tạo học kỳ"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
