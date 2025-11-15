import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { STATUS_LABEL } from "@/schema/common/type-ideas.schema";
import type { TIdea } from "@/schema/ideas.schema";
import { AlertCircle, CalendarDays, Loader2, UserRound } from "lucide-react";

type IdeaCardProps = {
  idea: TIdea;
  onClick?: (id: number) => void;
  className?: string;
  isLecturer?: boolean;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
  processingState?: "approve" | "reject" | null;
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case "DRAFT":
      return "bg-gray-200 text-gray-800";
    case "PROPOSED":
      return "bg-orange-200 text-orange-800";
    case "APPROVED":
      return "bg-green-200 text-green-800";
    case "REJECTED":
      return "bg-red-200 text-red-800";
    default:
      return "bg-muted text-foreground";
  }
};

const getCardBackgroundColor = (status: string): string => {
  switch (status) {
    case "APPROVED":
      return "bg-green-50 border-green-200";
    case "REJECTED":
      return "bg-red-50 border-red-200";
    case "PROPOSED":
      return "bg-orange-50 border-orange-200";
    default:
      return "bg-background";
  }
};

export function IdeaCard({ idea, onClick, className = "", isLecturer = false, onApprove, onReject, processingState = null }: IdeaCardProps) {
  const cardBgClass = getCardBackgroundColor(idea.status);
  const canModerate = isLecturer && idea.status === "PROPOSED";

  return (
    <div
      onClick={() => onClick?.(idea.id)}
      className={`group relative rounded-lg border p-4 transition-colors hover:shadow-md ${cardBgClass} ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 pr-2">
          <div className="font-medium">{idea.title}</div>
          <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
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
          <div className="text-muted-foreground mt-1 text-sm">{idea.description || "-"}</div>
        </div>
        <Badge className={`${getStatusColor(idea.status)} ml-2 shrink-0 text-xs`}>{STATUS_LABEL[idea.status] || idea.status}</Badge>
      </div>

      {canModerate && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button size="sm" className="min-w-[120px] flex-1" onClick={() => onApprove?.(idea.id)} disabled={!onApprove || processingState !== null}>
            {processingState === "approve" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang duyệt...
              </>
            ) : (
              "Phê duyệt"
            )}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="min-w-[120px] flex-1"
            onClick={() => onReject?.(idea.id)}
            disabled={!onReject || processingState !== null}
          >
            {processingState === "reject" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang từ chối...
              </>
            ) : (
              "Từ chối"
            )}
          </Button>
        </div>
      )}

      {idea.status === "REJECTED" && idea.rejectionReason && (
        <div className="mt-3 border-t border-red-200 pt-3">
          <div className="flex items-start gap-2 rounded-md bg-red-100 p-3 text-red-800">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="mb-1 text-xs font-semibold">Lý do từ chối:</p>
              <p className="text-sm">{idea.rejectionReason}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
