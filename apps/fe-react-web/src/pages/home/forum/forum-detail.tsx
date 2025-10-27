import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader2, CalendarDays, Pencil, Edit3, Trash2 } from "lucide-react";

import { useRoleNavigate } from "@/hooks/useRoleNavigate";

import { usePostHook } from "@/hooks/use-post";
import { useCommentHook } from "@/hooks/use-comment";
import { useGroupHook } from "@/hooks/use-group";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import type { RootState } from "@/redux/store";

export default function ForumDetail() {
  const { id } = useParams();
  const postId = Number(id);
  const roleNavigate = useRoleNavigate();

  // Lấy email hiện tại từ Redux (sửa selector nếu cấu trúc khác)
  const currentEmail = useSelector((s: RootState) => s.user.user?.email) ?? "";

  // Post detail
  const { useGetPostById } = usePostHook();
  const { data, isPending, error } = useGetPostById(postId);
  const post = data?.data?.data;
  const createdAt = post ? new Date(post.createdAt) : null;

  // Comments theo post
  const { useGetCommentsByPost, useCreateComment, useUpdateComment, useDeleteComment } = useCommentHook();
  const {
    data: cmtRes,
    isPending: isCmtPending,
    error: cmtError,
  } = useGetCommentsByPost(postId);
  const comments = cmtRes?.data?.data ?? [];

  // Group hook để lấy leader
  const { useGetGroupLeader } = useGroupHook();
  const { data: leaderData } = useGetGroupLeader(post?.groupResponse?.id ?? 0);

  // Mutations cho comment
  const { mutate: createComment, isPending: sendingCmt } = useCreateComment();
  const { mutate: updateComment, isPending: updatingCmt } = useUpdateComment();
  const { mutate: deleteComment } = useDeleteComment();

  // State cho comment editing
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  // Tạo comment
  const [content, setContent] = useState("");

  // Quyền update post
  const user = post?.userResponse;
  const isFindGroup = post?.type === "FIND_GROUP";
  const isFindMember = post?.type === "FIND_MEMBER";

  // Chủ bài viết (FIND_GROUP) - check email trực tiếp
  const isOwnerOfFindGroup = useMemo(
    () => !!currentEmail && !!user?.email && user.email === currentEmail,
    [currentEmail, user?.email]
  );

  // Leader của group (FIND_MEMBER) - lấy từ useGetGroupLeader
  const isLeaderOfGroup = useMemo(() => {
    if (!currentEmail || !leaderData?.data?.data) return false;
    const leader = leaderData.data.data;
    return leader.email === currentEmail;
  }, [currentEmail, leaderData]);

  const canUpdatePost =
    (isFindGroup && isOwnerOfFindGroup) ||
    (isFindMember && isLeaderOfGroup);

  // Quyền update/delete comment - chỉ chủ comment mới được
  const canModifyComment = (commentUserEmail: string) =>
    !!currentEmail && commentUserEmail === currentEmail;

  // Submit comment
  const handleCreateComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    createComment(
      { postId, content: content.trim() },
      { onSuccess: () => setContent("") }
    );
  };

  // Handle update comment
  const handleUpdateComment = (commentId: number, newContent: string) => {
    updateComment(
      { id: commentId, data: { postId, content: newContent } },
      {
        onSuccess: () => {
          setEditingCommentId(null);
          setEditContent("");
        }
      }
    );
  };

  // Handle delete comment
  const handleDeleteComment = (commentId: number) => {
    if (window.confirm("Bạn có chắc muốn xóa bình luận này?")) {
      deleteComment(commentId);
    }
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
        <Button variant="outline" onClick={() => window.history.back()}>
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

      <div className="mx-auto max-w-7xl p-6 space-y-6">
        {/* Header với thông tin cơ bản */}
        <div className="flex items-start justify-between border-b pb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge variant={isFindGroup ? "default" : "secondary"} className="text-xs">
                {isFindGroup ? "Tìm nhóm" : "Tìm thành viên"}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarDays size={14} />
                {createdAt?.toLocaleDateString("vi-VN")}
              </div>
            </div>
            <h2
              className={`text-xl font-semibold text-primary ${isFindGroup && post.userResponse?.id ? "cursor-pointer hover:underline transition-colors" : ""}`}
              onClick={() => isFindGroup && post.userResponse?.id && roleNavigate(`/profile/${post.userResponse.id}`)}
            >
              {isFindGroup
                ? post.userResponse?.fullName ?? "Người dùng ẩn danh"
                : post.groupResponse?.title ?? "Nhóm chưa đặt tên"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isFindGroup
                ? post.userResponse?.major?.name ?? "Không rõ ngành"
                : post.groupResponse?.semester?.name ?? "Không rõ kỳ học"}
            </p>
          </div>

          {canUpdatePost && (
            <Button
              onClick={() => roleNavigate(`/forum/${postId}/edit`)}
              className="gap-2"
              variant="secondary"
            >
              <Pencil className="h-4 w-4" />
              Cập nhật
            </Button>
          )}
        </div>

        {/* Layout chính với grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cột trái: Thông tin post */}
          <div className="lg:col-span-2 space-y-4">
            {/* Nội dung bài đăng */}
            <Card className="border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-primary">
                  Nội dung bài đăng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                  {post.content ?? "Không có nội dung."}
                </p>
              </CardContent>
            </Card>

            {/* Thông tin nhóm (khi FIND_MEMBER) */}
            {isFindMember && post.groupResponse && (
              <Card className="border shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-primary/90">
                    Thông tin nhóm
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Tên nhóm:</span>
                      <p className="font-medium">{post.groupResponse.title ?? "Không rõ"}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Trạng thái:</span>
                      <p className="font-medium">{post.groupResponse.status ?? "Không rõ"}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Loại:</span>
                      <p className="font-medium">{post.groupResponse.type ?? "Không rõ"}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Kỳ học:</span>
                      <p className="font-medium">{post.groupResponse.semester?.name ?? "Không rõ"}</p>
                    </div>
                  </div>
                  {post.groupResponse.description && (
                    <div>
                      <span className="font-medium text-muted-foreground text-sm">Mô tả:</span>
                      <p className="text-sm mt-1 leading-relaxed">{post.groupResponse.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Cột phải: Bình luận */}
          <div className="lg:col-span-1">
            <Card className="border shadow-sm sticky top-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-primary/90">
                  Bình luận ({isCmtPending ? "…" : comments.length})
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                {/* List comments */}
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
                    const canEdit = canModifyComment(author?.email);

                    return (
                      <div
                        key={c.id}
                        className="group flex gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <img
                          src={
                            author?.avatarUrl ||
                            "https://ui-avatars.com/api/?name=U&background=eee"
                          }
                          alt={author?.fullName || "User"}
                          className="h-8 w-8 rounded-full object-cover flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => author?.id && roleNavigate(`/profile/${author.id}`)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span
                              className="text-sm font-medium truncate cursor-pointer hover:text-primary hover:underline transition-colors"
                              onClick={() => author?.id && roleNavigate(`/profile/${author.id}`)}
                            >
                              {author?.fullName || "Ẩn danh"}
                            </span>
                            {canEdit && (
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => {
                                    setEditingCommentId(c.id);
                                    setEditContent(c.content);
                                  }}
                                >
                                  <Edit3 className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteComment(c.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                          {editingCommentId === c.id ? (
                            <div className="space-y-2">
                              <Textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                rows={2}
                                className="text-sm"
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    handleUpdateComment(c.id, editContent.trim());
                                  }}
                                  disabled={updatingCmt}
                                >
                                  Lưu
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingCommentId(null)}
                                >
                                  Hủy
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="text-sm text-foreground/90 leading-relaxed">{c.content}</p>
                              <span className="text-xs text-muted-foreground">
                                {when.toLocaleString("vi-VN")}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}

                {/* Form tạo comment */}
                <div className="border-t pt-4">
                  <form onSubmit={handleCreateComment} className="space-y-3">
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={3}
                      placeholder="Viết bình luận của bạn…"
                      className="text-sm"
                    />
                    <Button type="submit" disabled={sendingCmt} className="w-full">
                      {sendingCmt && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Gửi bình luận
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Back */}
        <div className="pt-4">
          <Button variant="outline" onClick={() => window.history.back()}>
            ← Quay lại danh sách
          </Button>
        </div>
      </div>
    </div>
  );
}
