import { z } from "zod";
import { TypeIdeasSchema } from "./common/type-ideas.schema";

export const AuthorSchema = z.object({
  id: z.number(),
  fullName: z.string(),
  email: z.string().email(),
  role: z.string(),
});

export const GroupInfoSchema = z.object({
  id: z.number(),
  title: z.string(),
});

export const IdeaSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  author: AuthorSchema,
  group: GroupInfoSchema,
  status: TypeIdeasSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  rejectionReason: z.string().optional().nullable(),
});

export const CreateIdeaSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export const UpdateIdeaSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export const RejectIdeaSchema = z.object({
  reason: z.string().min(1, "Lý do từ chối không được để trống"),
});

// Type inference (nếu bạn dùng TypeScript)
export type TAuthor = z.infer<typeof AuthorSchema>;
export type TGroupInfo = z.infer<typeof GroupInfoSchema>;
export type TIdea = z.infer<typeof IdeaSchema>;
export type TCreateIdea = z.infer<typeof CreateIdeaSchema>;
export type TUpdateIdea = z.infer<typeof UpdateIdeaSchema>;
export type TRejectIdea = z.infer<typeof RejectIdeaSchema>;
