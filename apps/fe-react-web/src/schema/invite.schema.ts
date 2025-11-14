import z from "zod";
import { StatusInviteSchema } from "./common/status-invite.schema";
import { GroupSchema } from "./group.schema";
import { UserSchema } from "./user.schema";

// Schema cho một lời mời
export const InviteSchema = z.object({
  id: z.number(),
  inviter: UserSchema,
  invitee: UserSchema,
  group: GroupSchema,
  status: StatusInviteSchema,
  createdAt: z.string().transform((val) => new Date(val)),
  respondedAt: z
    .string()
    .nullable()
    .transform((val) => (val ? new Date(val) : null)),
  active: z.boolean(),
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

// Schema cho pagination content
const PaginationSchema = z.object({
  content: z.array(InviteSchema),
  page: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
  first: z.boolean(),
  last: z.boolean(),
  sort: z.string(),
});

// Schema cho response của API /invites/my
export const InviteListSchema = z.object({
  received: PaginationSchema,
  sent: PaginationSchema,
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
