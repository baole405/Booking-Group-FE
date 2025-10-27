import { z } from "zod";

export const TypePostSchema = z.enum(["FIND_GROUP", "FIND_MEMBER", "SHARING"]);

export type TTypePost = z.infer<typeof TypePostSchema>;
