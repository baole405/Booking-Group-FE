import { z } from "zod";

export const TypeStatusRequestSchema = z.enum(["PENDING", "ACCEPTED", "REJECTED"]);

export type TTypeStatusRequest = z.infer<typeof TypeStatusRequestSchema>;
