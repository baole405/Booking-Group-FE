import z from "zod";
import { StatusGroupSchema, TypeGroupSchema } from "./common/type-group.schema";
import { SemesterSchema } from "./semester.schema";

export interface UseGroupParams {
  page?: number;
  size?: number;
  sort?: string;
  dir?: string;
  q?: string;
  type?: string | null;
  status?: string | null;
}

export const GroupSchema = z.object({
  id: z.union([z.number(), z.null(), z.undefined()]),
  title: z.string(),
  description: z.string(),
  semester: SemesterSchema,
  type: TypeGroupSchema,
  status: StatusGroupSchema,
  createdAt: z.date(),
});

export const UpdateInformationGroupSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  description: z.string().optional(),
});


export type TGroup = z.TypeOf<typeof GroupSchema>;
export type TUpdateInformationGroup = z.TypeOf<typeof UpdateInformationGroupSchema>;

