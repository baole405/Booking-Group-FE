import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader2, CalendarDays, Pencil } from "lucide-react";

import { usePostHook } from "@/hooks/use-post";
import { useCommentHook } from "@/hooks/use-comment";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { RootState } from "@/redux/store";

export default function ForumDetail() {
  const { id } = useParams();
  const postId = Number(id);
  const navigate = useNavigate();

  // Lấy email hiện tại từ Redux (sửa selector nếu cấu trúc khác)
  const currentEmail = useSelector((s: RootState) => s.user.user?.email) ?? "";

  // Post detail
  const { useGetPostById } = usePostHook();
  const { data, isPending, error } = useGetPostById(postId);
  const post = data?.data?.data;
  const createdAt = post ? new Date(post.createdAt) : null;

  // Comments theo post
  const { useGetCommentsByPost, useCreateComment } = useCommentHook();
  const {
    data: cmtRes,
    isPending: isCmtPending,
    error: cmtError,
  } = useGetCommentsByPost(postId);
  const comments = cmtRes?.data?.data ?? [];

  // Tạo comment
  const [content, setContent] = useState("");
  const { mutate: createComment, isPending: sendingCmt } = useCreateComment();

  // Quyền update
  const user = post?.userResponse;
  const group = post?.groupResponse;
  const isFindGroup = post?.type === "FIND_GROUP";
  const isFindMember = post?.type === "FIND_MEMBER";

  // Chủ bài viết (FIND_GROUP)
  const isOwnerOfFindGroup = useMemo(
    () => !!currentEmail && !!user?.email && user.email === currentEmail,
    [currentEmail, user?.email]
  );

  // Leader/Owner của group (FIND_MEMBER) — dùng any để tránh TS error vì backend không trả đủ field trong type
  const isLeaderOfGroup = useMemo(() => {
    if (!currentEmail || !group) return false;

    const g: any = group ?? {};

    const directLeaderMatch =
      g?.leader?.email === currentEmail ||
      g?.owner?.email === currentEmail ||
      g?.createdBy?.email === currentEmail ||
      g?.leaderEmail === currentEmail;

    const membersLeaderMatch = Array.isArray(g?.members)
      ? g.members.some(
          (m: any) =>
            m?.email === currentEmail &&
            ["LEADER", "OWNER", "ADMIN"].includes(String(m?.role).toUpperCase())
        )
      : false;

    return !!(directLeaderMatch || membersLeaderMatch);
  }, [currentEmail, group]);

  const canUpdate =
    (isFindGroup && isOwnerOfFindGroup) ||
    (isFindMember && isLeaderOfGroup);

  // Submit comment
  const handleCreateComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    createComment(
      { postId, content: content.trim() },
      { onSuccess: () => setContent("") }
    );
  };

  // UI states
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
      {/* hiệu ứng nền nhẹ */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)_/_12%)_0,_transparent_55%)]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-4xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b pb-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-primary">
              {isFindGroup
                ? post.userResponse?.fullName ?? "Người dùng ẩn danh"
                : post.groupResponse?.title ?? "Nhóm chưa đặt tên"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isFindGroup
                ? post.userResponse?.major?.name ?? "Không rõ ngành"
                : post.groupResponse?.semester?.name ?? "Không rõ kỳ học"}
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays size={14} />
              {createdAt?.toLocaleDateString("vi-VN")}
            </div>
          </div>

          {canUpdate && (
            <Button
              onClick={() => navigate(`/forum/${postId}/edit`)}
              className="gap-2"
              variant="secondary"
            >
              <Pencil className="h-4 w-4" />
              Cập nhật
            </Button>
          )}
        </div>

        {/* Nội dung bài đăng */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-primary">
              {isFindGroup ? "Bài đăng tìm nhóm" : "Bài đăng tìm thành viên"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-foreground/90">
              {post.content ?? "Không có nội dung."}
            </p>
          </CardContent>
        </Card>

        {/* Thông tin nhóm (khi FIND_MEMBER) */}
        {isFindMember && post.groupResponse && (
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-primary/90">
                Thông tin nhóm
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>
                <span className="font-medium">Tên nhóm:</span>{" "}
                {post.groupResponse.title ?? "Không rõ"}
              </p>
              <p>
                <span className="font-medium">Mô tả:</span>{" "}
                {post.groupResponse.description ?? "Không có mô tả"}
              </p>
              <p>
                <span className="font-medium">Trạng thái:</span>{" "}
                {post.groupResponse.status ?? "Không rõ"}
              </p>
              <p>
                <span className="font-medium">Loại:</span>{" "}
                {post.groupResponse.type ?? "Không rõ"}
              </p>
              <p>
                <span className="font-medium">Kỳ học:</span>{" "}
                {post.groupResponse.semester?.name ?? "Không rõ"}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Bình luận */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-primary/90">
              Bình luận ({isCmtPending ? "…" : comments.length})
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* list */}
            {isCmtPending && (
              <div className="flex items-center text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tải bình luận…
              </div>
            )}
            {cmtError && (
              <p className="text-sm text-destructive">Không thể tải bình luận.</p>
            )}
            {!isCmtPending && !cmtError && comments.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Chưa có bình luận nào.
              </p>
            )}

            {!isCmtPending &&
              !cmtError &&
              comments.map((c: any) => {
                const author = c.user;
                const when = new Date(c.createdAt);
                return (
                  <div
                    key={c.id}
                    className="flex items-start gap-3 rounded-md border p-3"
                  >
                    <img
                      src={
                        author?.avatarUrl ||
                        "https://ui-avatars.com/api/?name=U&background=eee"
                      }
                      alt={author?.fullName || "User"}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {author?.fullName || "Ẩn danh"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {when.toLocaleString("vi-VN")}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/90">{c.content}</p>
                    </div>
                  </div>
                );
              })}

            {/* form tạo comment */}
            <form onSubmit={handleCreateComment} className="space-y-2">
              <label className="text-sm font-medium">Viết bình luận</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                className="w-full rounded-md border bg-background p-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Nhập nội dung bình luận…"
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={sendingCmt}>
                  {sendingCmt && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Gửi bình luận
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Back */}
        <div className="pt-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            ← Quay lại danh sách
          </Button>
        </div>
      </div>
    </div>
  );
}
