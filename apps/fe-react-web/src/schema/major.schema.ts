import z from "zod";

export const MajorSchema = z.object({
  id: z.number(),
  name: z.string(),
  active: z.boolean(),
});
export const CreateMajorSchema = z.object({
  name: z.string().min(1, "Name is required"),
});
export const UpdateMajorSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export type TCreateMajor = z.TypeOf<typeof CreateMajorSchema>;
export type TUpdateMajor = z.TypeOf<typeof UpdateMajorSchema>;
export type TMajor = z.TypeOf<typeof MajorSchema>;
