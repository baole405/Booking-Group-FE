import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { TGroup } from "@/schema/group.schema";
import { CalendarDays, Globe2, Lock, Users } from "lucide-react";
import { useRoleNavigate } from "@/hooks/useRoleNavigate";
import { Button } from "@/components/ui/button";

/** Màu nền gradient theo loại nhóm */
const gradientByType: Record<string, string> = {
  PUBLIC: "from-emerald-50 to-emerald-100/60 dark:from-emerald-950/60 dark:to-emerald-900/30",
  PRIVATE: "from-sky-50 to-sky-100/60 dark:from-sky-950/60 dark:to-sky-900/30",
};

/** Màu sắc trạng thái nhóm */
const statusStyle: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-800 border-emerald-200",
  LOCKED: "bg-rose-100 text-rose-800 border-rose-200",
  FORMING: "bg-amber-100 text-amber-800 border-amber-200",
};

/** Nhãn trạng thái hiển thị */
const getStatusLabel = (status?: string) => {
  switch (status) {
    case "ACTIVE":
      return "Đang hoạt động";
    case "LOCKED":
      return "Đã khóa";
    case "FORMING":
      return "Đang hình thành";
    default:
      return "Không xác định";
  }
};

export default function GroupCard({ group }: { group: TGroup }) {
const roleNavigate = useRoleNavigate();
const handleViewDetail = () => roleNavigate(`/groups/${group.id}`);

  const gradient = gradientByType[group.type] ?? "from-muted to-background";

  return (
    <Card
      className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border p-5 shadow-sm
        bg-gradient-to-br ${gradient} transition-all hover:-translate-y-0.5 hover:shadow-lg`}
    >
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          {/* Tiêu đề nhóm */}
          <h6 className="truncate font-semibold leading-tight tracking-tight text-foreground ">
            {group.title}
          </h6>

          {/* Badge Info */}
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <Badge variant="secondary" className="font-normal">
              ID: {group.id ?? "N/A"}
            </Badge>

            {/* Loại nhóm có icon */}
            <Badge
              variant={group.type === "PUBLIC" ? "outline" : "secondary"}
              className="flex items-center gap-1 capitalize"
            >
              {group.type === "PUBLIC" ? (
                <>
                  <Globe2 className="h-3.5 w-3.5" /> Công khai
                </>
              ) : (
                <>
                  <Lock className="h-3.5 w-3.5" /> Riêng tư
                </>
              )}
            </Badge>

            <Badge
              className={`capitalize ${statusStyle[group.status] || "bg-muted text-muted-foreground"}`}
            >
              {getStatusLabel(group.status)}
            </Badge>
          </div>
        </div>

        <Button
          variant="link"
          className="px-0 text-primary hover:underline"
          onClick={handleViewDetail}
        >
          Xem chi tiết →
        </Button>
      </div>

      {/* Thông tin thêm */}
      <div className="text-foreground/80 mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <div className="flex items-center gap-1.5">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Ngày tạo:</span>
          <span className="ml-1">
            {new Date(group.createdAt).toLocaleDateString("vi-VN")}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Học kỳ:</span>
          <span className="ml-1">{group.semester?.name ?? "Không rõ"}</span>
        </div>
      </div>

      <Separator className="my-3" />

      {/* Mô tả */}
      <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
        {group.description || "Chưa có mô tả."}
      </p>
    </Card>
  );
}
