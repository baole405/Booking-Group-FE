import z from "zod";
import { StatusInviteSchema } from "./common/status-invite.schema";
import { GroupSchema } from "./group.schema";
import { UserSchema } from "./user.schema";

// Schema cho một lời mời
export const InviteSchema = z.object({
  id: z.number(),
  fromUser: UserSchema,
  toUser: UserSchema,
  group: GroupSchema,
  message: z.string().nullable().optional(),
  status: StatusInviteSchema,
  createdAt: z.string().transform((val) => new Date(val)),
  updatedAt: z.string().transform((val) => new Date(val)),
});

// Schema cho tạo lời mời mới
export const CreateInviteSchema = z.object({
  groupId: z.number(),
  inviteeId: z.number(),
});

// Schema cho phản hồi lời mời
export const RespondInviteSchema = z.object({
  status: z.enum(["ACCEPTED", "DECLINED"]),
});

// Schema cho pagination response của lời mời
export const InviteListSchema = z.object({
  received: z.object({
    content: z.array(InviteSchema),
    pageNumber: z.number(),
    totalPages: z.number(),
    totalElements: z.number().optional(),
  }),
  sent: z.object({
    content: z.array(InviteSchema),
    pageNumber: z.number(),
    totalPages: z.number(),
    totalElements: z.number().optional(),
  }),
});

// Query params cho lấy danh sách lời mời
export interface UseInviteParams {
  status?: z.infer<typeof StatusInviteSchema>;
  receivedPage?: number;
  receivedSize?: number;
  sentPage?: number;
  sentSize?: number;
}

// Type exports
export type TInvite = z.infer<typeof InviteSchema>;
export type TCreateInvite = z.infer<typeof CreateInviteSchema>;
export type TRespondInvite = z.infer<typeof RespondInviteSchema>;
export type TInviteList = z.infer<typeof InviteListSchema>;
