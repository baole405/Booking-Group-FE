import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { usePostHook } from "@/hooks/use-post.tsx";
import type { TPost } from "@/schema/post.schema";
import { Calendar, Loader2, MessageSquare, Plus, Search, User, Users } from "lucide-react";
import { useState } from "react";

// ───────────────────── Helper Functions ─────────────────────
const getTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    FIND_GROUP: "Tìm nhóm",
    FIND_MEMBER: "Tìm thành viên",
  };
  return map[type] || type;
};

const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case "FIND_GROUP":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "FIND_MEMBER":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function Forum() {
  const { useGetAllPosts, useGetPostsByType, useDeletePost, useCreatePost } = usePostHook();
  const deletePostMutation = useDeletePost();
  const createPostMutation = useCreatePost();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ACTIVE");
  const [selectedPost, setSelectedPost] = useState<TPost | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form state for creating post
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostType, setNewPostType] = useState<"FIND_GROUP" | "FIND_MEMBER">("FIND_GROUP");

  // Fetch posts based on filter type
  const { data: allPostsRes, isPending: isAllPending, error: allError, refetch: refetchAll } = useGetAllPosts();
  const { data: findGroupRes, isPending: isGroupPending, error: groupError, refetch: refetchGroup } = useGetPostsByType("FIND_GROUP");
  const { data: findMemberRes, isPending: isMemberPending, error: memberError, refetch: refetchMember } = useGetPostsByType("FIND_MEMBER");

  // Select appropriate data based on filter type
  let postsRes, isPending, error;
  if (filterType === "FIND_GROUP") {
    postsRes = findGroupRes;
    isPending = isGroupPending;
    error = groupError;
  } else if (filterType === "FIND_MEMBER") {
    postsRes = findMemberRes;
    isPending = isMemberPending;
    error = memberError;
  } else {
    postsRes = allPostsRes;
    isPending = isAllPending;
    error = allError;
  }

  // ───────────────────── Process Data ─────────────────────
  const posts: TPost[] = postsRes?.data?.data ?? [];

  const filteredPosts = posts.filter((post) => {
    // Filter by status (active/deleted)
    if (filterStatus === "ACTIVE" && post.active === false) {
      return false;
    }
    if (filterStatus === "DELETED" && post.active !== false) {
      return false;
    }

    // Filter by search term (content, user name, group title)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchContent = post.content?.toLowerCase().includes(searchLower);
      const matchUserName = post.userResponse?.fullName?.toLowerCase().includes(searchLower);
      const matchGroupTitle = post.groupResponse?.title?.toLowerCase().includes(searchLower);

      return matchContent || matchUserName || matchGroupTitle;
    }

    return true;
  });

  // ───────────────────── Handlers ─────────────────────
  const handleDeletePost = async (postId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      return;
    }

    try {
      await deletePostMutation.mutateAsync(postId);
      setIsDetailOpen(false);
      // Refetch all APIs to update data
      refetchAll();
      refetchGroup();
      refetchMember();
      alert("Xóa bài viết thành công!");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Có lỗi xảy ra khi xóa bài viết!");
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      alert("Vui lòng nhập nội dung bài viết!");
      return;
    }

    try {
      const payload = {
        postType: newPostType,
        content: newPostContent.trim(),
      };
      console.log("Creating post with payload:", payload);

      await createPostMutation.mutateAsync(payload);
      setIsCreateOpen(false);
      setNewPostContent("");
      setNewPostType("FIND_GROUP");
      // Switch to deleted filter to show new post (since backend returns active: false)
      setFilterStatus("DELETED");
      // Refetch all APIs to update data
      refetchAll();
      refetchGroup();
      refetchMember();
      alert("Tạo bài viết thành công!");
    } catch (error: unknown) {
      console.error("Create error:", error);
      const errorResponse = error as { response?: { data?: { message?: string } } };
      console.error("Error response:", errorResponse?.response?.data);
      alert(`Có lỗi xảy ra khi tạo bài viết! ${errorResponse?.response?.data?.message || ""}`);
    }
  };

  // ───────────────────── Loading State ─────────────────────
  if (isPending) {
    return (
      <div className="text-muted-foreground flex min-h-screen items-center justify-center">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang tải danh sách bài viết...
      </div>
    );
  }

  // ───────────────────── Error State ─────────────────────
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-destructive mb-4 text-xl font-bold">Không tải được danh sách bài viết!</h2>
          <p className="text-muted-foreground text-sm">{error.message}</p>
        </Card>
      </div>
    );
  }

  // ───────────────────── Render Main ─────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="mx-auto max-w-7xl">
        {/* Header with Search and Filter */}
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Diễn đàn</h1>
            <p className="mt-1 text-xs text-gray-600">Quản lý các bài viết tìm nhóm và tìm thành viên</p>
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute top-1/2 left-2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 w-full pl-8 text-sm md:w-[250px]"
              />
            </div>

            {/* Status Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-8 w-full text-sm md:w-[150px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                <SelectItem value="DELETED">Đã xóa</SelectItem>
                <SelectItem value="ALL">Tất cả</SelectItem>
              </SelectContent>
            </Select>

            {/* Type Filter */}
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="h-8 w-full text-sm md:w-[180px]">
                <SelectValue placeholder="Lọc theo loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả</SelectItem>
                <SelectItem value="FIND_GROUP">Tìm nhóm</SelectItem>
                <SelectItem value="FIND_MEMBER">Tìm thành viên</SelectItem>
              </SelectContent>
            </Select>

            {/* Create Post Button */}
            <Button onClick={() => setIsCreateOpen(true)} className="h-8 gap-1 text-sm" size="sm">
              <Plus className="h-4 w-4" />
              Tạo bài viết
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-4">
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-blue-100 p-2">
                <MessageSquare className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Tổng bài viết</p>
                <p className="text-lg font-bold text-gray-900">{posts.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-3">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-green-100 p-2">
                <Users className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Tìm nhóm</p>
                <p className="text-lg font-bold text-gray-900">{posts.filter((p) => p.type === "FIND_GROUP").length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-3">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-purple-100 p-2">
                <User className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Tìm thành viên</p>
                <p className="text-lg font-bold text-gray-900">{posts.filter((p) => p.type === "FIND_MEMBER").length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-3">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-red-100 p-2">
                <MessageSquare className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Đã xóa</p>
                <p className="text-lg font-bold text-gray-900">{posts.filter((p) => p.active === false).length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Posts List */}
        {filteredPosts.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageSquare className="mx-auto mb-3 h-10 w-10 text-gray-400" />
            <h3 className="text-base font-semibold text-gray-900">Không tìm thấy bài viết nào</h3>
            <p className="mt-1 text-xs text-gray-600">
              {searchTerm || filterType !== "ALL" ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm" : "Chưa có bài viết nào trong hệ thống"}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="flex h-full flex-col transition-shadow hover:shadow-md">
                <CardHeader className="p-3 pb-2">
                  <div className="mb-2 flex items-center gap-2">
                    {/* User Avatar */}
                    {post.userResponse?.avatarUrl ? (
                      <img src={post.userResponse.avatarUrl} alt={post.userResponse.fullName} className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-xs font-bold text-white">
                        {post.userResponse?.fullName?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}

                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-xs font-semibold text-gray-900">{post.userResponse?.fullName || "Unknown"}</p>
                      <p className="truncate text-[10px] text-gray-500">{post.userResponse?.studentCode || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Badge className={`text-[10px] ${getTypeBadgeColor(post.type)}`}>{getTypeLabel(post.type)}</Badge>
                    <Badge variant="secondary" className="text-[10px]">
                      #{post.id}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col p-3 pt-0">
                  {/* Post Content */}
                  <p className="line-clamp-3 flex-1 text-xs leading-relaxed text-gray-700">{post.content}</p>

                  {/* Created Date */}
                  <p className="mt-2 text-[10px] text-gray-500">{post.createdAt ? new Date(post.createdAt).toLocaleDateString("vi-VN") : "N/A"}</p>

                  {/* Group Info (if exists) */}
                  {post.groupResponse && (
                    <div className="mt-2 rounded border bg-gray-50 p-2">
                      <div className="flex items-start gap-1.5">
                        <Users className="mt-0.5 h-3 w-3 flex-shrink-0 text-gray-600" />
                        <div className="flex-1 overflow-hidden">
                          <p className="truncate text-[10px] font-medium text-gray-900">{post.groupResponse.title}</p>
                          {post.groupResponse.description && (
                            <p className="line-clamp-1 text-[10px] text-gray-600">{post.groupResponse.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-full text-xs"
                      onClick={() => {
                        setSelectedPost(post);
                        setIsDetailOpen(true);
                      }}
                    >
                      Xem
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-full text-xs text-red-600 hover:bg-red-50"
                      onClick={() => handleDeletePost(post.id)}
                      disabled={deletePostMutation.isPending || post.active === false}
                    >
                      {(() => {
                        if (deletePostMutation.isPending) return "...";
                        if (post.active === false) return "Đã xóa";
                        return "Xóa";
                      })()}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
            {selectedPost && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Chi tiết bài viết</DialogTitle>
                  <DialogDescription className="text-sm text-gray-600">Xem thông tin chi tiết của bài viết</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  {/* User Info */}
                  <div className="rounded-lg border bg-gray-50 p-4">
                    <div className="flex items-center gap-3">
                      {selectedPost.userResponse?.avatarUrl ? (
                        <img
                          src={selectedPost.userResponse.avatarUrl}
                          alt={selectedPost.userResponse.fullName}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-lg font-bold text-white">
                          {selectedPost.userResponse?.fullName?.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{selectedPost.userResponse?.fullName || "Unknown User"}</p>
                        <p className="text-sm text-gray-600">{selectedPost.userResponse?.studentCode || "N/A"}</p>
                        <p className="text-xs text-gray-500">{selectedPost.userResponse?.email || "N/A"}</p>
                      </div>
                      <Badge className={getTypeBadgeColor(selectedPost.type)}>{getTypeLabel(selectedPost.type)}</Badge>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div>
                    <h3 className="mb-2 font-semibold text-gray-900">Nội dung bài viết:</h3>
                    <Separator className="mb-3" />
                    <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700">{selectedPost.content}</p>
                  </div>

                  {/* Group Info */}
                  {selectedPost.groupResponse && (
                    <div>
                      <h3 className="mb-2 font-semibold text-gray-900">Thông tin nhóm:</h3>
                      <Separator className="mb-3" />
                      <div className="rounded-lg border bg-gradient-to-r from-blue-50 to-purple-50 p-4">
                        <div className="mb-3 flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-gray-900">{selectedPost.groupResponse.title}</h4>
                            <p className="mt-1 text-sm text-gray-700">{selectedPost.groupResponse.description || "Chưa có mô tả"}</p>
                          </div>
                          <Badge variant="outline" className="ml-2">
                            #{selectedPost.groupResponse.id}
                          </Badge>
                        </div>
                        {selectedPost.groupResponse.semester && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{selectedPost.groupResponse.semester.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Created Date */}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      Đăng ngày:{" "}
                      {selectedPost.createdAt
                        ? new Date(selectedPost.createdAt).toLocaleDateString("vi-VN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 border-t pt-4">
                  <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                    Đóng
                  </Button>
                  <Button
                    variant="destructive"
                    className="text-sm"
                    onClick={() => selectedPost && handleDeletePost(selectedPost.id)}
                    disabled={deletePostMutation.isPending || selectedPost?.active === false}
                  >
                    {(() => {
                      if (deletePostMutation.isPending) return "Đang xóa...";
                      if (selectedPost?.active === false) return "Đã xóa";
                      return "Xóa bài viết";
                    })()}
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Create Post Dialog */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Tạo bài viết mới</DialogTitle>
              <DialogDescription>Tạo bài viết tìm nhóm hoặc tìm thành viên cho diễn đàn</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Post Type */}
              <div className="space-y-2">
                <Label htmlFor="postType" className="text-sm font-medium">
                  Loại bài viết
                </Label>
                <Select value={newPostType} onValueChange={(value: "FIND_GROUP" | "FIND_MEMBER") => setNewPostType(value)}>
                  <SelectTrigger id="postType">
                    <SelectValue placeholder="Chọn loại bài viết" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FIND_GROUP">Tìm nhóm</SelectItem>
                    <SelectItem value="FIND_MEMBER">Tìm thành viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Post Content */}
              <div className="space-y-2">
                <Label htmlFor="postContent" className="text-sm font-medium">
                  Nội dung bài viết
                </Label>
                <Textarea
                  id="postContent"
                  placeholder="Nhập nội dung bài viết (tối đa 500 ký tự)..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="min-h-[200px] resize-none"
                  maxLength={500}
                />
                <p className="text-right text-xs text-gray-500">{newPostContent.length}/500 ký tự</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 border-t pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateOpen(false);
                  setNewPostContent("");
                  setNewPostType("FIND_GROUP");
                }}
              >
                Hủy
              </Button>
              <Button onClick={handleCreatePost} disabled={createPostMutation.isPending || !newPostContent.trim()}>
                {createPostMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  "Tạo bài viết"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
