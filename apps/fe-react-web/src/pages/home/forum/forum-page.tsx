// src/pages/forum/forum-page.tsx
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import ForumCard from "./components/forum-card";
import { usePostHook } from "@/hooks/use-post";

export default function ForumPage() {
  const { useGetAllPosts } = usePostHook();
  const { data, isPending, error } = useGetAllPosts();

  // Lấy mảng dữ liệu thực hoặc mock
  const posts = data?.data?.data ?? [];

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)_/_12%)_0,_transparent_55%)]"
        aria-hidden="true"
      />

      {/* Header */}
      <div className="mx-auto w-full max-w-6xl px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-primary">Bài đăng diễn đàn</h1>
        <div className="w-64">
          <Input type="text" placeholder="Tìm bài viết..." />
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
            {posts.map((p: any) => (
              <ForumCard key={p.id} post={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
