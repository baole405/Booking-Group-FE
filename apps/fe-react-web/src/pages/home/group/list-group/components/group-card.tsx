import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { TGroup } from "@/schema/group.schema";
import { GraduationCap, User, Users } from "lucide-react";
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

  const teamSizeText = "Team size: 1";

  return (
    <Card className="flex flex-col gap-4 p-4 md:flex-row md:items-start">
      <div className="bg-muted/40 text-muted-foreground grid hidden h-[120px] w-[180px] shrink-0 place-items-center rounded-md border md:block">
        No image available
      </div>

      {/* Nội dung bên phải */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-foreground text-xl leading-tight font-semibold md:text-2xl">{group.title}</h3>

            {/* Tags / Chips */}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="font-normal">
                ID: {group.id}
              </Badge>
              <Badge variant={group.type === "PUBLIC" ? "outline" : "secondary"}>{group.type === "PUBLIC" ? "Công khai" : "Riêng tư"}</Badge>
              <Badge variant={group.status === "ACTIVE" ? "default" : "destructive"}>
                {group.status === "ACTIVE" ? "Đang hoạt động" : "Ngưng hoạt động"}
              </Badge>
              {/* Team size (tạm thời text cứng) */}
              <Badge variant="secondary" className="gap-1">
                <Users className="h-3.5 w-3.5" />
                {teamSizeText}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="link" className="text-primary px-0" onClick={handleViewDetail}>
              Xem chi tiết →
            </Button>
          </div>
        </div>

        {/* Info hàng 2 */}
        <div className="text-foreground/80 mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            <span className="font-medium">Leader:</span>
            <span className="ml-1">{group.leader ? group.leader.fullName : "Chưa có"}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <GraduationCap className="h-4 w-4" />
            <span className="font-medium">Giảng viên hướng dẫn:</span>
            <span className="ml-1">{group.checkpointTeacher ? group.checkpointTeacher.fullName : "Chưa có"}</span>
          </div>

          {/* Ví dụ ngày tháng nếu sau này có */}
          {/* <div className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" />
            <span className="font-medium">Bắt đầu - Kết thúc:</span>
            <span className="ml-1">08/10/2025 - 08/12/2025</span>
          </div> */}
        </div>

        <Separator className="my-3" />

        {/* Description: gọn gàng, dễ đọc */}
        <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed md:line-clamp-3">{group.description || "Chưa có mô tả."}</p>
      </div>
    </Card>
  );
}

export default GroupCard;
