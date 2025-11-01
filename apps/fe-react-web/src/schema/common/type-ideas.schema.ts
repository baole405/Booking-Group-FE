import type { Badge } from "@/components/ui/badge"; // TYPE-ONLY
import type { ComponentProps } from "react";
import { z } from "zod";

export const TypeIdeasSchema = z.enum(["DRAFT", "PROPOSED", "APPROVED", "REJECTED"]);
export type TTypeIdeas = z.infer<typeof TypeIdeasSchema>;

export const STATUS_LABEL: Record<TTypeIdeas, string> = {
  DRAFT: "Bản nháp",
  PROPOSED: "Đã nộp",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
};

export const STATUS_BADGE_VARIANT: Record<TTypeIdeas, ComponentProps<typeof Badge>["variant"]> = {
  DRAFT: "outline",
  PROPOSED: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
};
