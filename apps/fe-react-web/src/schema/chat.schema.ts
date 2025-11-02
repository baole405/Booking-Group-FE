import { z } from "zod";

// Schema cho tin nhắn chat (theo response thực tế từ BE)
export const MessageSchema = z.object({
  id: z.number(),
  groupId: z.number(),
  groupTitle: z.string().optional(),
  fromUserId: z.number(),
  fromUserName: z.string(),
  fromUserAvatar: z.string().nullable().optional(),
  content: z.string(),
  messageType: z.enum(["TEXT", "IMAGE", "FILE"]).optional().default("TEXT"),
  replyToMessageId: z.string().nullable().optional(),
  replyToContent: z.string().nullable().optional(),
  isEdited: z.boolean().optional().default(false),
  createdAt: z.string().or(z.date()),
  editedAt: z.string().or(z.date()).nullable().optional(),
});

// Schema để gửi tin nhắn mới
export const CreateMessageSchema = z.object({
  groupId: z.number(),
  content: z.string().min(1, "Nội dung tin nhắn không được rỗng"),
  messageType: z.enum(["TEXT", "IMAGE", "FILE"]).optional(),
  replyToMessageId: z.string().nullable().optional(),
}); // Type exports
export type TMessage = z.infer<typeof MessageSchema>;
export type TCreateMessage = z.infer<typeof CreateMessageSchema>;
