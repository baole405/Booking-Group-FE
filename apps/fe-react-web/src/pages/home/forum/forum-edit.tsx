import { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader2, ArrowLeft } from "lucide-react";

import { useRoleNavigate } from "@/hooks/useRoleNavigate";

import { usePostHook } from "@/hooks/use-post";
import { useGroupHook } from "@/hooks/use-group";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { RootState } from "@/redux/store";
import type { TUpdatePost } from "@/schema/post.schema";

export default function ForumEdit() {
  const { id } = useParams();
  const postId = Number(id);
  const roleNavigate = useRoleNavigate();  // Lấy email hiện tại từ Redux
  const currentEmail = useSelector((s: RootState) => s.user.user?.email) ?? "";

  // Post data
  const { useGetPostById, useUpdatePost } = usePostHook();
  const { data, isPending, error } = useGetPostById(postId);
  const post = data?.data?.data;

  // Group hook để lấy leader
  const { useGetGroupLeader } = useGroupHook();
  const { data: leaderData } = useGetGroupLeader(post?.groupResponse?.id ?? 0);

  // Update mutation
  const { mutate: updatePost, isPending: updating } = useUpdatePost();

  // Form state
  const [content, setContent] = useState("");

  useEffect(() => {
    if (post?.content) {
      setContent(post.content);
    }
  }, [post]);

  // Quyền update
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

  const canUpdate = (isFindGroup && isOwnerOfFindGroup) || (isFindMember && isLeaderOfGroup);

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
    console.log("Content:", content);
    console.log("Post:", post);

    if (!content.trim() || !post) {
      console.log("Validation failed - content or post is empty");
      return;
    }

    const updateData: TUpdatePost = {
      postType: post.type,
      content: content.trim()
    };

    console.log("Sending update request with data:", { id: postId, data: updateData });

    updatePost(
      { id: postId, data: updateData },
      {
        onSuccess: () => {
          console.log("Update successful");
          roleNavigate(`/forum/${postId}`);
        },
        onError: (error) => {
          console.error("Update error:", error);
        }
      }
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
        <Button variant="outline" onClick={() => window.history.back()}>
          ← Quay lại
        </Button>
      </div>
    );

  if (!canUpdate)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-destructive">
        <p className="text-lg font-medium mb-2">Bạn không có quyền chỉnh sửa bài đăng này.</p>
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

      <div className="mx-auto max-w-4xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Quay lại
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Chỉnh sửa bài đăng</h1>
            <div className="flex items-center gap-2">
              <Badge variant={isFindGroup ? "default" : "secondary"}>
                {isFindGroup ? "Tìm nhóm" : "Tìm thành viên"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {isFindGroup
                  ? post.userResponse?.fullName ?? "Người dùng ẩn danh"
                  : post.groupResponse?.title ?? "Nhóm chưa đặt tên"}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Nội dung bài đăng</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Nội dung <span className="text-destructive">*</span>
                </label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  placeholder="Nhập nội dung bài đăng..."
                  className="resize-none"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {content.length}/500 ký tự
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={updating || !content.trim()}>
                  {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Cập nhật bài đăng
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                  disabled={updating}
                >
                  Hủy
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Xem trước</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {content || "Nội dung sẽ hiển thị ở đây..."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
