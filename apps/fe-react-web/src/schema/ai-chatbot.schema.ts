export type AiChatRole = "assistant" | "user" | (string & {});

export type AiChatMessageResponse = {
  role: AiChatRole;
  content: string;
  createdAt: string;
};

export type AiChatGroupAttachment = {
  id: number;
  title: string;
  description?: string | null;
};

export type AiChatTeacherAttachment = {
  id: number;
  fullName: string;
  email: string;
  role?: string;
};

export type AiChatMemberAttachment = {
  id: number;
  fullName?: string;
  email?: string;
  role?: string;
};

export type AiChatGroupStatusAttachment = {
  id?: number;
  title?: string;
  status?: string;
  memberCount?: number;
  majorCount?: number;
  membershipRole?: string;
  isDiverse?: boolean;
  memberCountValid?: boolean;
};

export type AiChatAttachments = {
  groups?: AiChatGroupAttachment[];
  teachers?: AiChatTeacherAttachment[];
  members?: AiChatMemberAttachment[];
  myGroup?: AiChatGroupStatusAttachment | null;
  memberCount?: number;
  majorCount?: number;
  isDiverse?: boolean;
  memberCountValid?: boolean;
  status?: string;
  membershipRole?: string;
  groupId?: number;
  groupTitle?: string;
  [key: string]: unknown;
};

export type AiChatbotAnswerResponse = {
  answer: string;
  attachments?: AiChatAttachments | null;
};
