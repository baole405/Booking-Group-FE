import z from "zod";
import { PostSchema } from "./post.schema";
import { UserSchema } from "./user.schema";

export const CommentSchema = z.object({
  id: z.number(),
  user: UserSchema,                // người viết comment
  post: PostSchema,       // bài post được comment
  content: z.string().max(500),
  createdAt: z.string().datetime(),
});

export const UpdateCommentSchema = z.object({
  postId: z.number(),
  content: z
    .string()
    .min(1, "Content is required")
    .max(500, "Content must be at most 500 characters"),
});

export const CreateCommentSchema = z.object({
  postId: z.number(),
  content: z.string().min(1, "Content is required").max(500, "Content must be at most 500 characters"),
});

export type TComment = z.infer<typeof CommentSchema>;
export type TUpdateComment = z.infer<typeof UpdateCommentSchema>;
export type TCreateComment = z.infer<typeof CreateCommentSchema>;
