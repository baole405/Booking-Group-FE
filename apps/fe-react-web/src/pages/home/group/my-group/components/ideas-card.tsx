// components/idea-card.tsx
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { TIdea } from "@/schema/ideas.schema";
import { CalendarDays, UserRound } from "lucide-react";

type IdeaCardProps = {
  idea: TIdea;
  onClick?: (id: number) => void;
  className?: string;
};

const getInitials = (name?: string) =>
  (name ?? "")
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

const formatDate = (iso?: string, locale = "vi-VN") => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
};

const statusLabel: Record<TIdea["status"], string> = {
  DRAFT: "Nháp",
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Từ chối",
};

const statusClass: Record<TIdea["status"], string> = {
  DRAFT: "bg-amber-100 text-amber-800 border-amber-200",
  PENDING: "bg-blue-100 text-blue-800 border-blue-200",
  APPROVED: "bg-emerald-100 text-emerald-800 border-emerald-200",
  REJECTED: "bg-rose-100 text-rose-800 border-rose-200",
};

export function IdeaCard({ idea, onClick, className = "" }: IdeaCardProps) {
  const initials = getInitials(idea.author?.fullName);

  return (
    <Card className={`p-4 transition-shadow hover:shadow-sm ${onClick ? "cursor-pointer" : ""} ${className}`} onClick={() => onClick?.(idea.id)}>
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold">{idea.title}</h3>
          <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              {formatDate(idea.createdAt)}
            </span>
            {idea.group?.title && (
              <>
                <span>•</span>
                <span className="truncate">Nhóm: {idea.group.title}</span>
              </>
            )}
          </div>
        </div>

        <Badge variant="secondary" className={`shrink-0 ${statusClass[idea.status]}`}>
          {statusLabel[idea.status]}
        </Badge>
      </div>

      <Separator className="my-3" />

      {/* Author (chỉ initials, không ảnh) */}
      <div className="mb-3 flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{initials || <UserRound className="h-4 w-4" />}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{idea.author?.fullName ?? "—"}</div>
          <div className="text-muted-foreground truncate text-xs">{idea.author?.email ?? "—"}</div>
        </div>
      </div>

      {/* Description */}
      <p className="text-foreground/80 line-clamp-4 text-sm leading-relaxed">{idea.description || "Chưa có mô tả."}</p>
    </Card>
  );
}
