import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { TGroup } from "@/schema/group.schema";
import { CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";

type GroupCardProps = {
  group: TGroup;
  mode?: "STUDENT";
};

function GroupCard({ group }: GroupCardProps) {
  const navigate = useNavigate();

  const handleViewDetail = () => {
    navigate(`/student/groups/${group.id}`);
  };


  return (
    <Card className="flex flex-col gap-4 p-4 md:flex-row md:items-start hover:shadow-md transition-shadow">
      {/* Placeholder ảnh (nếu sau này có thể thêm field imageUrl) */}
      <div className="bg-muted/40 text-muted-foreground grid hidden h-[120px] w-[180px] shrink-0 place-items-center rounded-md border md:block">
        No image available
      </div>

      {/* Nội dung chính */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-foreground text-xl leading-tight font-semibold md:text-2xl">
              {group.title}
            </h3>

            {/* Thẻ thông tin */}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="font-normal">
                ID: {group.id ?? "N/A"}
              </Badge>

              {/* Loại nhóm (Công khai / Riêng tư) */}
              <Badge
                variant={group.type === "PUBLIC" ? "outline" : "secondary"}
              >
                {group.type === "PUBLIC" ? "Công khai" : "Riêng tư"}
              </Badge>

              {/* Trạng thái nhóm */}
              {group.status === "ACTIVE" && (
                <Badge variant="default">Đang hoạt động</Badge>
              )}

              {group.status === "LOCKED" && (
                <Badge variant="destructive">Đã khóa</Badge>
              )}

              {group.status === "FORMING" && (
                <Badge variant="secondary">Đang hình thành</Badge>
              )}

            </div>
          </div>

          <Button
            variant="link"
            className="text-primary px-0 self-start"
            onClick={handleViewDetail}
          >
            Xem chi tiết →
          </Button>
        </div>

        {/* Thông tin bổ sung */}
        <div className="text-foreground/80 mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" />
            <span className="font-medium">Ngày tạo:</span>
            <span className="ml-1">
              {new Date(group.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-medium">Học kỳ:</span>
            <span className="ml-1">
              {group.semester?.name ?? "Không rõ"}
            </span>
          </div>
        </div>

        <Separator className="my-3" />

        {/* Mô tả nhóm */}
        <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed md:line-clamp-3">
          {group.description || "Chưa có mô tả."}
        </p>
      </div>
    </Card>
  );
}

export default GroupCard;
