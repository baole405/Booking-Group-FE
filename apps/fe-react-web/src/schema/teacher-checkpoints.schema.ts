
import z from "zod";
import { GroupSchema } from "./group.schema";
import { UserSchema } from "./user.schema";
import { TypeStatusRequestSchema } from "./common/type-request-teacher.schema";

export const CheckPointsRequestSchema = z.object({
  id: z.union([z.number(), z.null(), z.undefined()]),
  group: GroupSchema,
  teacher: UserSchema,
  status: TypeStatusRequestSchema,
});
export const CheckPointsRequestCreateSchema = z.object({
  requestId: z.number(),
  teacher: UserSchema,
  group: GroupSchema,
  status: TypeStatusRequestSchema,
  message: z.string().nullable(),
});
export type TCheckPointsRequest = z.infer<typeof CheckPointsRequestSchema>;
export type TCheckPointsRequestCreate = z.infer<typeof CheckPointsRequestCreateSchema>;

