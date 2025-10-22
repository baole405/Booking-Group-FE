// src/pages/forum/forum-page.tsx
import { useState } from "react";
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
      <div className="mx-auto w-full max-w-6xl px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-semibold text-primary">Bài đăng diễn đàn</h1>

        <div className="flex items-center gap-2">
          <div className="w-64">
            <Input type="text" placeholder="Tìm bài viết..." />
          </div>
          <Button onClick={() => setOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" /> Tạo bài đăng
          </Button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((p: TPost) => (
              <ForumCard key={p.id} post={p} />
            ))}
          </div>
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
