import z from "zod";

export const StatusJoinGroupSchema = z.enum(["PENDING", "APPROVED", "REJECTED"]);
export type TStatusJoinGroup = z.TypeOf<typeof StatusJoinGroupSchema>;
