import { z } from "zod";

export const RoleSchema = z.enum(["Student", "Admin", "Moderator", "Lecture"]);

export type TRole = z.infer<typeof RoleSchema>;
