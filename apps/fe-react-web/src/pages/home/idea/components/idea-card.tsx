import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { STATUS_BADGE_VARIANT, STATUS_LABEL } from "@/schema/common/type-ideas.schema";
import type { TIdea } from "@/schema/ideas.schema";
import { CalendarDays, User, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

type IdeaCardProps = {
  idea: TIdea;
  mode?: "STUDENT";
};

function IdeaCard({ idea }: IdeaCardProps) {
  const createdAt = new Date(idea.createdAt);
  const navigate = useNavigate();

  const formatDate = (date: Date) => {
    if (Number.isNaN(date.getTime())) return "Không rõ";
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20 hover:border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={STATUS_BADGE_VARIANT[idea.status]} className="text-xs">
                {STATUS_LABEL[idea.status]}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                ID: {idea.id}
              </Badge>
            </div>
            <h3 className="text-lg font-semibold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {idea.title}
            </h3>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Author and Group Info */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span className="font-medium">{idea.author.fullName}</span>
            <Badge variant="outline" className="text-xs">
              {idea.author.role}
            </Badge>
          </div>

          {idea.group?.title && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Nhóm:</span>
              <button
                type="button"
                onClick={() => navigate(`/student/groups/${idea.group.id}`)}
                className="font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-sm"
                title="Xem chi tiết nhóm"
              >
                {idea.group.title}
              </button>
            </div>
          )}
        </div>

        <Separator className="my-3" />

        {/* Date and Description */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span className="font-medium">Đăng ngày:</span>
            <span>{formatDate(createdAt)}</span>
            <span className="text-xs">lúc {formatTime(createdAt)}</span>
          </div>

          <div className="text-sm text-muted-foreground leading-relaxed">
            <p className="line-clamp-3">
              {idea.description || "Chưa có mô tả chi tiết cho ý tưởng này."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default IdeaCard;
