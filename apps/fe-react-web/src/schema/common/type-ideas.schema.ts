import { z } from "zod";
import type { ComponentProps } from "react";
import type { Badge } from "@/components/ui/badge"; // TYPE-ONLY

export const TypeIdeasSchema = z.enum(["DRAFT", "PENDING", "APPROVED", "REJECTED"]);
export type TTypeIdeas = z.infer<typeof TypeIdeasSchema>;

export const STATUS_LABEL: Record<TTypeIdeas, string> = {
  DRAFT: "Bản nháp",
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
};

export const STATUS_BADGE_VARIANT: Record<
  TTypeIdeas,
  ComponentProps<typeof Badge>["variant"]
> = {
  DRAFT: "outline",
  PENDING: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
};
