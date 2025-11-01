import z from "zod";

export const StatusInviteSchema = z.enum(["PENDING", "ACCEPTED", "DECLINED"]);
export type TStatusInvite = z.TypeOf<typeof StatusInviteSchema>;
