import z from "zod";

export const MajorSchema = z.object({
  code: z.string(),
  name: z.string(),
});
export type TMajor = z.TypeOf<typeof MajorSchema>;
