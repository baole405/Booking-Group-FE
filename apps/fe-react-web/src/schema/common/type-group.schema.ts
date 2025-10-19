import z from "zod";

export const TypeGroupSchema = z.enum(["PUBLIC", "PRIVATE"]);
export const StatusGroupSchema = z.enum(["ACTIVE", "LOCKED", "FORMING"]);


export type TTypeGroup = z.TypeOf<typeof TypeGroupSchema>;
export type TStatusGroup = z.TypeOf<typeof StatusGroupSchema>;
