// src/pages/forum/forum-page.tsx
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import ForumCard from "./components/forum-card";
import { usePostHook } from "@/hooks/use-post";
import { toast } from "sonner";
import type { TTypePost } from "@/schema/common/type-post.schema";
import type { TPost } from "@/schema/post.schema";

export default function ForumPage() {
  const { useGetAllPosts, useCreatePost } = usePostHook();
  const { data, isPending, error, refetch } = useGetAllPosts();
  const createPost = useCreatePost();

  const posts = data?.data?.data ?? [];

  // Trạng thái cho dialog
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const [type, setType] = useState<"FIND_GROUP" | "FIND_MEMBER" | "">("");

  // Trạng thái cho filter và search
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "FIND_GROUP" | "FIND_MEMBER">("ALL");
  const [sortOrder, setSortOrder] = useState<"DESC" | "ASC">("DESC"); // DESC = mới nhất trước

  // Xử lý filter, search và sort
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = [...posts];

    // Filter theo loại bài đăng
    if (filterType !== "ALL") {
      filtered = filtered.filter(post => post.type === filterType);
    }

    // Search theo nội dung hoặc tên người/nhóm đăng
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(post => {
        const content = post.content?.toLowerCase() || "";
        const userName = post.userResponse?.fullName?.toLowerCase() || "";
        const groupName = post.groupResponse?.title?.toLowerCase() || "";
        return content.includes(term) || userName.includes(term) || groupName.includes(term);
      });
    }

    // Sort theo ngày đăng
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "DESC" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [posts, filterType, searchTerm, sortOrder]);

  const handleSubmit = async () => {
    if (!content || !type) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      await createPost.mutateAsync({ content, postType: type });
      toast.success("Đã tạo bài đăng thành công!");
      setOpen(false);
      setContent("");
      setType("");
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Không thể tạo bài đăng.");
    }
  };

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)_/_12%)_0,_transparent_55%)]"
        aria-hidden="true"
      />

      {/* Header */}
      <div className="mx-auto w-full max-w-6xl px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h1 className="text-xl font-semibold text-primary">Bài đăng diễn đàn</h1>

          <Button onClick={() => setOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Tạo bài đăng
          </Button>
        </div>

        {/* Filter và Search Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Tìm bài viết theo nội dung hoặc người đăng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <Select value={filterType} onValueChange={(v) => setFilterType(v as "ALL" | "FIND_GROUP" | "FIND_MEMBER")}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Loại bài đăng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả</SelectItem>
                <SelectItem value="FIND_GROUP">Tìm nhóm</SelectItem>
                <SelectItem value="FIND_MEMBER">Tìm thành viên</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as "DESC" | "ASC")}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DESC">Mới nhất</SelectItem>
                <SelectItem value="ASC">Cũ nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Nội dung */}
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        {isPending && (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang tải bài viết...
          </div>
        )}

        {error && (
          <div className="text-center text-destructive py-10">
            Lỗi khi tải dữ liệu.
          </div>
        )}

        {!isPending && !error && (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              Hiển thị {filteredAndSortedPosts.length} trong tổng số {posts.length} bài đăng
            </div>

            {filteredAndSortedPosts.length === 0 ? (
              <div className="text-center text-muted-foreground py-16">
                {searchTerm || filterType !== "ALL"
                  ? "Không tìm thấy bài viết nào phù hợp với bộ lọc."
                  : "Chưa có bài viết nào."
                }
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredAndSortedPosts.map((p: TPost) => (
                  <ForumCard key={p.id} post={p} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Dialog tạo bài đăng */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo bài đăng mới</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <Select value={type} onValueChange={(v) => setType(v as TTypePost)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại bài đăng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FIND_GROUP">Tìm nhóm</SelectItem>
                <SelectItem value="FIND_MEMBER">Tìm thành viên</SelectItem>
              </SelectContent>
            </Select>

            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung bài đăng..."
              className="min-h-[120px]"
            />
          </div>

          <DialogFooter>
            <Button
              onClick={handleSubmit}
              disabled={createPost.isPending}
              className="w-full"
            >
              {createPost.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Đang tạo...
                </>
              ) : (
                "Đăng bài"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
