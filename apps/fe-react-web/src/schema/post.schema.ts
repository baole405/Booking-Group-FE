import { boolean, z } from "zod";
import { TypePostSchema } from "./common/type-post.schema";
import { UserSchema } from "./user.schema";
import { GroupSchema } from "./group.schema";

export const PostSchema = z.object({
  id: z.number(),
  userResponse: UserSchema.nullable(),
  groupResponse: GroupSchema.nullable(),
  content: z.string().max(500),
  type: TypePostSchema,
  createdAt: z.string().datetime(),
  action: boolean().optional(),
});
export const CreatePostSchema = z.object({
  postType: TypePostSchema,
  content: z.string().min(1, "Content is required").max(500, "Content must be at most 500 characters"),
});
export const UpdatePostSchema = z.object({
  postType: TypePostSchema,
  content: z.string().min(1, "Content is required").max(500, "Content must be at most 500 characters"),
});


export type TPost = z.infer<typeof PostSchema>;
export type TCreatePost = z.infer<typeof CreatePostSchema>;
export type TUpdatePost = z.infer<typeof UpdatePostSchema>;
