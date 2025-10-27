import z from "zod";
import { StatusJoinGroupSchema } from "./common/status-join-group.schema";
import { StatusGroupSchema, TypeGroupSchema } from "./common/type-group.schema";
import { SemesterSchema } from "./semester.schema";
import { UserSchema } from "./user.schema";

export interface UseGroupParams {
  page?: number;
  size?: number;
  sort?: string;
  dir?: string;
  q?: string;
  type?: string | null;
  status?: string | null;
  semesterId?: number | null;
}

export const GroupSchema = z.object({
  id: z.union([z.number(), z.null(), z.undefined()]),
  title: z.string(),
  description: z.string(),
  semester: SemesterSchema,
  type: TypeGroupSchema,
  status: StatusGroupSchema,
  createdAt: z.date(),
});

export const UpdateInformationGroupSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  description: z.string().optional(),
});

export const JoinGroupScema = z.object({
  id: z.number(),
  fromUser: UserSchema,
  toGroup: GroupSchema,
  status: StatusJoinGroupSchema,
  active: z.boolean(),
});

export const VoteChoiceSchema = z.object({
  id: z.number(),
  vote: z.object({
    id: z.number(),
    group: GroupSchema,
    targetUser: UserSchema,
    topic: z.string(),
    status: z.string(),
    closedAt: z.string().transform((val) => new Date(val)), // parse ISO string → Date
    active: z.boolean(),
  }),
  user: UserSchema, // người đã vote
  choiceValue: z.string(), // "YES" | "NO" | v.v.
  active: z.boolean(),
});

export const VoteByGroupSchema = z.object({
  id: z.number(),
  group: GroupSchema,
  targetUser: UserSchema,
  topic: z.string(),
  status: z.string(),
  closedAt: z.string().transform((val) => new Date(val)), // parse ISO string → Date
  active: z.boolean(),
});

// Type inference
export type TVoteChoice = z.infer<typeof VoteChoiceSchema>;
export type TGroup = z.TypeOf<typeof GroupSchema>;
export type TUpdateInformationGroup = z.TypeOf<typeof UpdateInformationGroupSchema>;
export type TJoinGroup = z.TypeOf<typeof JoinGroupScema>;
export type TVote = z.TypeOf<typeof VoteChoiceSchema>;
export type TVoteByGroup = z.TypeOf<typeof VoteByGroupSchema>;
