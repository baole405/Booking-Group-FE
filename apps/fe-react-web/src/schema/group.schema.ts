import z from "zod";
import { StatusGroupSchema, TypeGroupSchema } from "./common/type-group.schema";
import { UserSchema } from "./user.schema";

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
  leader: UserSchema.nullable(),
  type: TypeGroupSchema,
  status: StatusGroupSchema,
  checkpointTeacher: UserSchema.nullable(),
  createdAt: z.date(),
});

export type TGroup = z.TypeOf<typeof GroupSchema>;
