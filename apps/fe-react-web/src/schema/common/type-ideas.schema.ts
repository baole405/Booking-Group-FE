import { z } from "zod";

// Enum mô tả trạng thái hoặc loại ý tưởng
export const TypeIdeasSchema = z.enum(["DRAFT", "PENDING", "APPROVED", "REJECTED"]);

// Type inference để dùng trong code TypeScript
export type TTypeIdeas = z.infer<typeof TypeIdeasSchema>;
