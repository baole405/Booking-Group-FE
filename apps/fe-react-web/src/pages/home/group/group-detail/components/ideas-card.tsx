import { Badge } from "@/components/ui/badge";
import type { TIdea } from "@/schema/ideas.schema";
import { STATUS_LABEL } from "@/schema/common/type-ideas.schema";
import { CalendarDays, UserRound } from "lucide-react";

type IdeaCardProps = {
  idea: TIdea;
  onClick?: (id: number) => void;
  className?: string;
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case "DRAFT":
      return "bg-gray-200 text-gray-800";
    case "PENDING":
      return "bg-yellow-200 text-yellow-800";
    case "APPROVED":
      return "bg-green-200 text-green-800";
    case "REJECTED":
      return "bg-red-200 text-red-800";
    default:
      return "bg-muted text-foreground";
  }
};

export function IdeaCard({ idea, onClick, className = "" }: IdeaCardProps) {
  return (
    <div
      onClick={() => onClick?.(idea.id)}
      className={`rounded-lg border p-4 relative group transition-colors hover:bg-muted/20 ${onClick ? "cursor-pointer" : ""
        } ${className}`}
    >
      {/* Header */}
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0 flex-1 pr-2">
          <div className="font-medium">{idea.title}</div>

          {/* Tác giả & thời gian tạo */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <span className="inline-flex items-center gap-1">
              <UserRound className="h-4 w-4" />
              {idea.author?.fullName ?? "Không rõ tác giả"}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              {idea.createdAt
                ? new Date(idea.createdAt).toLocaleString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
                : "Không rõ thời gian"}
            </span>
          </div>

          {/* Mô tả */}
          <div className="text-sm text-muted-foreground mt-1">
            {idea.description || "—"}
          </div>
        </div>

        {/* Trạng thái */}
        <Badge className={`${getStatusColor(idea.status)} text-xs shrink-0 ml-2`}>
          {STATUS_LABEL[idea.status] || idea.status}
        </Badge>
      </div>
    </div>
  );
}
