import z from "zod";
import { RoleSchema } from "./common/role.schema";
import { MajorSchema } from "./major.schema";

export const UserSchema = z.object({
  id: z.number(),
  studentCode: z.string().nullable(),
  fullName: z.string(),
  email: z.string().email(),
  cvUrl: z.string().url().nullable(),
  avatarUrl: z.string().url().nullable(),
  major: MajorSchema.nullable(),
  role: RoleSchema,
  isActive: z.boolean(),
});
export const UpdateUserSchema = z.object({
  cvUrl: z.string().url("Đường dẫn CV không hợp lệ").min(1, "CV không được để trống"),
  avatarUrl: z.string().url("Đường dẫn ảnh đại diện không hợp lệ").min(1, "Ảnh đại diện không được để trống"),
  major: MajorSchema.refine((val) => val != null, { message: "Vui lòng chọn chuyên ngành" }),
});

export type TUser = z.TypeOf<typeof UserSchema>;
export type TUpdateUserSchema = z.TypeOf<typeof UpdateUserSchema>;
