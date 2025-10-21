// src/pages/forum/forum-detail.tsx
import { useParams, useNavigate } from "react-router-dom";
import { usePostHook } from "@/hooks/use-post";
import { Button } from "@/components/ui/button";
import { Loader2, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForumDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { useGetPostById } = usePostHook();
  const { data, isPending, error } = useGetPostById(Number(id));

  const post = data?.data?.data;
  const createdAt = post ? new Date(post.createdAt) : null;

  if (isPending)
    return (
      <div className="flex items-center justify-center min-h-screen text-muted-foreground">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Đang tải bài viết...
      </div>
    );

  if (error || !post)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-destructive">
        <p className="text-lg font-medium mb-2">Không thể tải bài đăng.</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          ← Quay lại
        </Button>
      </div>
    );

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Hiệu ứng nền */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)_/_12%)_0,_transparent_55%)]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-4xl p-6 space-y-6">
        {/* Header: Tác giả */}
        <div className="flex items-center gap-4 border-b pb-4">
          <img
            src={post.user.avatarUrl ?? "/avatars/default.png"}
            alt={post.user.fullName}
            className="h-16 w-16 rounded-full border object-cover"
          />
          <div>
            <h3 className="text-lg font-semibold">{post.user.fullName}</h3>
            <p className="text-sm text-muted-foreground">
              {post.user.major?.name ?? "Không rõ ngành"}
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <CalendarDays size={14} />
              {createdAt?.toLocaleDateString("vi-VN")}
            </div>
          </div>
        </div>

        {/* Nội dung chính */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-primary">
              {post.group.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {post.type === "FIND_GROUP" ? "Tìm nhóm" : "Tìm thành viên"}
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm leading-relaxed text-foreground/90">
              {post.content}
            </p>
          </CardContent>
        </Card>

        {/* Thông tin nhóm liên quan */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-primary/90">
              Thông tin nhóm
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>
              <span className="font-medium">Tên nhóm:</span> {post.group.title}
            </p>
            <p>
              <span className="font-medium">Mô tả:</span> {post.group.description}
            </p>
            <p>
              <span className="font-medium">Trạng thái:</span> {post.group.status}
            </p>
            <p>
              <span className="font-medium">Loại:</span> {post.group.type}
            </p>
            <p>
              <span className="font-medium">Kỳ học:</span>{" "}
              {post.group.semester?.name ?? "Không rõ"}
            </p>
          </CardContent>
        </Card>

        {/* Nút quay lại */}
        <div className="pt-4">
          <Button variant="outline" onClick={() => navigate(-1)}>
            ← Quay lại danh sách
          </Button>
        </div>
      </div>
    </div>
  );
}
