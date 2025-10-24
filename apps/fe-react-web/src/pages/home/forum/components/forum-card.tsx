import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import type { TPost } from "@/schema/post.schema";

interface ForumCardProps {
  post: TPost;
}

export default function ForumCard({ post }: ForumCardProps) {
  const navigate = useNavigate();
  const createdAt = new Date(post.createdAt);

  // ✅ Dữ liệu người đăng và nhóm
  const user = post.userResponse;
  const group = post.groupResponse;

  const isFindGroup = post.type === "FIND_GROUP";   // bài đăng tìm nhóm (có user)
  const isFindMember = post.type === "FIND_MEMBER"; // bài đăng tìm thành viên (có group)

  return (
    <Card className="overflow-hidden rounded-xl border shadow-sm hover:shadow-md transition-shadow">
      {/* Header - Thông tin người/nhóm đăng */}
      <CardHeader className="border-b bg-muted/30 px-4 py-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {isFindGroup && user && (
              <div>
                <h3 className="font-semibold">{user.fullName ?? "Người dùng ẩn danh"}</h3>
                <p className="text-xs text-muted-foreground">
                  {user.major?.name ?? "Chưa có ngành"}
                </p>
              </div>
            )}

            {isFindMember && group && (
              <div>
                <h3 className="font-semibold">{group.title ?? "Nhóm chưa đặt tên"}</h3>
                <p className="text-xs text-muted-foreground">
                  {group.semester?.name ?? "Không rõ kỳ học"}
                </p>
              </div>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/student/forum/${post.id}`)}
            className="ml-3"
          >
            Xem chi tiết
          </Button>
        </div>
      </CardHeader>

      {/* Content - Loại bài đăng, nội dung và thời gian */}
      <CardContent className="px-4 py-3 space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant={isFindGroup ? "outline" : "secondary"}>
            {isFindGroup ? "Tìm nhóm" : "Tìm thành viên"}
          </Badge>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays size={14} />
            {createdAt.toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3">
          {post.content}
        </p>
      </CardContent>
    </Card>
  );
}
