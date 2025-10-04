import { z } from "zod";

export const RoleSchema = z.enum(["STUDENT", "ADMIN", "MODERATOR", "LECTURER"]);

export type TRole = z.infer<typeof RoleSchema>;
