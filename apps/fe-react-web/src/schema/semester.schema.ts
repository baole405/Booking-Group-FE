import z from "zod";

export const SemesterSchema = z.object({
  id: z.union([z.number(), z.null(), z.undefined()]),
  name: z.string(),
  active: z.boolean(),
  isComplete: z.boolean().optional(),
});

export const CreateSemesterSchema = z.object({
  name: z.string(),
  active: z.boolean(),
});
export const UpdateSemesterSchema = z.object({
  name: z.string().min(1, "Tên học kỳ không được để trống"),
  active: z.boolean(),
});
export type TSemester = z.TypeOf<typeof SemesterSchema>;
export type TCreateSemester = z.TypeOf<typeof CreateSemesterSchema>;
export type TUpdateSemester = z.TypeOf<typeof UpdateSemesterSchema>;
