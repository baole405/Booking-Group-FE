import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { STATUS_BADGE_VARIANT, STATUS_LABEL } from "@/schema/common/type-ideas.schema";
import type { TIdea } from "@/schema/ideas.schema";
import { CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";

type IdeaCardProps = {
  idea: TIdea;
  mode?: "STUDENT";
};

function IdeaCard({ idea }: IdeaCardProps) {
  const createdAt = new Date(idea.createdAt);
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col gap-4 p-4 md:flex-row md:items-start hover:shadow-md transition-shadow">
      <div className="flex-1">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-foreground text-xl leading-tight font-semibold md:text-2xl">
              {idea.title}
            </h3>

            {/* Thẻ thông tin */}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {/* ID */}
              <Badge variant="secondary" className="font-normal">ID: {idea.id}</Badge>

              {/* Trạng thái */}
              <Badge variant={STATUS_BADGE_VARIANT[idea.status]}>
                {STATUS_LABEL[idea.status]}
              </Badge>

              {/* Tác giả */}
              <Badge variant="outline" className="font-normal">
                Tác giả: {idea.author.fullName}
              </Badge>
              <Badge variant="outline" className="font-normal">
                Vai trò: {idea.author.role}
              </Badge>

              {/* Nhóm (nếu có) */}
              {idea.group?.title ? (
                <Badge variant="outline" className="font-normal">
                  Nhóm:{" "}
                  <button
                    type="button"
                    onClick={() => navigate(`/student/groups/${idea.group!.id}`)}
                    className="ml-1 underline hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary rounded-sm"
                    title="Xem chi tiết nhóm"
                  >
                    {idea.group.title}
                  </button>
                </Badge>
              ) : (
                <Badge variant="outline" className="font-normal">Nhóm: —</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Thông tin bổ sung */}
        <div className="text-foreground/80 mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" />
            <span className="font-medium">Ngày tạo:</span>
            <span className="ml-1">
              {Number.isNaN(createdAt.getTime())
                ? "Không rõ"
                : createdAt.toLocaleDateString("vi-VN")}
            </span>
          </div>
        </div>

        <Separator className="my-3" />

        {/* Mô tả */}
        <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed md:line-clamp-3">
          {idea.description || "Chưa có mô tả."}
        </p>
      </div>
    </Card>
  );
}

export default IdeaCard;
