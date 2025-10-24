import { CalendarDays, MoreVertical, Pencil, Trash2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TIdea } from "@/schema/ideas.schema";
import { STATUS_LABEL } from "@/schema/common/type-ideas.schema";

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

type IdeaCardProps = {
  idea: TIdea;
  isLeader?: boolean;
  onEdit?: (idea: TIdea) => void;
  onDelete?: (id: number) => void;
};

export function IdeaCard({ idea, isLeader, onEdit, onDelete }: IdeaCardProps) {
  const canEdit = !!isLeader && (idea.status === "DRAFT" || idea.status === "REJECTED");

  return (
    <div className="rounded-lg border p-4 relative group transition-colors hover:bg-muted/20">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="min-w-0">
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
        <Badge className={`${getStatusColor(idea.status)} text-xs`}>
          {STATUS_LABEL[idea.status] || idea.status}
        </Badge>
      </div>

      {/* Menu hành động (chỉ leader thấy menu) */}
      {isLeader && (
        <div className="absolute top-12 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canEdit && (
                <DropdownMenuItem onClick={() => onEdit?.(idea)}>
                  <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="text-red-500 focus:text-red-600"
                onClick={() => onDelete?.(idea.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Xóa ý tưởng
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}

type IdeasListProps = {
  ideas: TIdea[];
  isLoading?: boolean;
  isError?: boolean;
  isLeader?: boolean;
  emptyText?: string;
  onEdit?: (idea: TIdea) => void;
  onDelete?: (id: number) => void;
};

export function IdeasList({
  ideas,
  isLoading,
  isError,
  isLeader,
  emptyText = "Chưa có ý tưởng nào.",
  onEdit,
  onDelete,
}: IdeasListProps) {
  if (isLoading) {
    return (
      <div className="text-muted-foreground text-sm">Đang tải ý tưởng...</div>
    );
  }

  if (isError) {
    return <div className="text-destructive text-sm">Không thể tải danh sách ý tưởng.</div>;
  }

  if (!ideas?.length) {
    return <div className="text-muted-foreground text-sm">{emptyText}</div>;
  }

  return (
    <div className="grid gap-4">
      {ideas.map((idea) => (
        <IdeaCard
          key={idea.id}
          idea={idea}
          isLeader={isLeader}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
