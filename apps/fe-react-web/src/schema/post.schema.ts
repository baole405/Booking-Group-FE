import { z } from "zod";
import { TypePostSchema } from "./common/type-post.schema";
import { UserSchema } from "./user.schema";

export const PostSchema = z.object({
  id: z.string(),
  user: UserSchema,
  group: UserSchema,
  content: z.string().max(500),
  type: TypePostSchema,
  createdAt: z.string().datetime(),
});

export type TPost = z.infer<typeof PostSchema>;
