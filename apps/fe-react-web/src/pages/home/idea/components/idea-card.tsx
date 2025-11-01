import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { STATUS_BADGE_VARIANT, STATUS_LABEL } from "@/schema/common/type-ideas.schema";
import type { TIdea } from "@/schema/ideas.schema";
import { AlertCircle, CalendarDays, User, Users } from "lucide-react";
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

  // Color coding based on status
  const getCardBackgroundColor = () => {
    switch (idea.status) {
      case "APPROVED":
        return "bg-green-50 border-green-200";
      case "REJECTED":
        return "bg-red-50 border-red-200";
      case "PROPOSED":
        return "bg-orange-50 border-orange-200";
      default:
        return "bg-background border-border";
    }
  };

  const getBorderColor = () => {
    switch (idea.status) {
      case "APPROVED":
        return "border-l-green-500";
      case "REJECTED":
        return "border-l-red-500";
      case "PROPOSED":
        return "border-l-orange-500";
      default:
        return "border-l-primary";
    }
  };

  return (
    <Card className={`group border-l-4 transition-all duration-200 hover:shadow-lg ${getBorderColor()} ${getCardBackgroundColor()}`}>
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge variant={STATUS_BADGE_VARIANT[idea.status]} className="text-xs font-semibold">
                {STATUS_LABEL[idea.status]}
              </Badge>
              <Badge variant="outline" className="text-xs">
                ID: {idea.id}
              </Badge>
            </div>
            <h3 className="text-foreground group-hover:text-primary text-xl leading-tight font-bold transition-colors">{idea.title}</h3>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Author and Group Info */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-sm">
            <User className="text-primary h-4 w-4" />
            <span className="text-foreground font-medium">{idea.author.fullName}</span>
            <Badge variant="secondary" className="text-xs">
              {idea.author.role}
            </Badge>
          </div>

          {idea.group?.title && (
            <>
              <span className="text-muted-foreground hidden sm:inline">•</span>
              <div className="flex items-center gap-2 text-sm">
                <Users className="text-primary h-4 w-4" />
                <span className="text-muted-foreground">Nhóm:</span>
                <button
                  type="button"
                  onClick={() => navigate(`/student/groups/${idea.group.id}`)}
                  className="text-primary focus:ring-primary rounded-sm font-semibold hover:underline focus:ring-2 focus:ring-offset-2 focus:outline-none"
                  title="Xem chi tiết nhóm"
                >
                  {idea.group.title}
                </button>
              </div>
            </>
          )}
        </div>

        <Separator />

        {/* Description */}
        <div className="space-y-2">
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <CalendarDays className="h-4 w-4" />
            <span className="font-medium">Đăng ngày:</span>
            <span>{formatDate(createdAt)}</span>
            <span className="text-xs opacity-75">lúc {formatTime(createdAt)}</span>
          </div>

          {idea.description && (
            <div className="mt-3">
              <p className="text-foreground/90 text-sm leading-relaxed whitespace-pre-wrap">{idea.description}</p>
            </div>
          )}
        </div>

        {/* Rejection Reason Alert */}
        {idea.status === "REJECTED" && idea.rejectionReason && (
          <>
            <Separator />
            <Alert variant="destructive" className="border-red-300 bg-red-100">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong className="font-semibold">Lý do từ chối:</strong>
                <p className="mt-1">{idea.rejectionReason}</p>
              </AlertDescription>
            </Alert>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default IdeaCard;
