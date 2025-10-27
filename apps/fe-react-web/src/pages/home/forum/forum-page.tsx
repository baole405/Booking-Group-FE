// src/pages/forum/forum-page.tsx
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
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
import { useGroupHook } from "@/hooks/use-group";
import { toast } from "sonner";
import type { TTypePost } from "@/schema/common/type-post.schema";
import type { TPost } from "@/schema/post.schema";
import type { RootState } from "@/redux/store";

export default function ForumPage() {
  const { useGetAllPosts, useCreatePost } = usePostHook();
  const { useMyGroup, useGetGroupLeader } = useGroupHook();
  const { data, isPending, error, refetch } = useGetAllPosts();
  const { data: myGroupData } = useMyGroup();
  const createPost = useCreatePost();

  // Lấy thông tin user từ Redux
  const userRole = useSelector((state: RootState) => state.user.role);
  const currentEmail = useSelector((state: RootState) => state.user.user?.email);

  const posts = useMemo(() => data?.data?.data ?? [], [data]);
  const myGroup = myGroupData?.data?.data;

  // Lấy thông tin leader nếu có group
  const { data: leaderData } = useGetGroupLeader(myGroup?.id || 0);
  const leader = leaderData?.data?.data;

  // Trạng thái cho dialog
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");

  // Trạng thái cho filter và search
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "FIND_GROUP" | "FIND_MEMBER" | "SHARING">("ALL");
  const [sortOrder, setSortOrder] = useState<"DESC" | "ASC">("DESC"); // DESC = mới nhất trước

  // Logic xác định loại bài đăng và khả năng đăng bài
  const getPostConfig = () => {
    // Nếu là giảng viên -> type SHARING
    if (userRole === "LECTURER") {
      return {
        canPost: true,
        postType: "SHARING" as TTypePost,
        buttonText: "Chia sẻ"
      };
    }

    // Nếu là student
    if (userRole === "STUDENT") {
      // Nếu chưa có nhóm -> type FIND_GROUP
      if (!myGroup) {
        return {
          canPost: true,
          postType: "FIND_GROUP" as TTypePost,
          buttonText: "Tìm nhóm"
        };
      }

      // Kiểm tra xem user có phải leader không
      const isLeader = leader?.email === currentEmail;

      // Nếu có nhóm và là leader -> type FIND_MEMBER
      if (isLeader) {
        return {
          canPost: true,
          postType: "FIND_MEMBER" as TTypePost,
          buttonText: "Tìm thành viên"
        };
      }

      // Nếu có nhóm nhưng không phải leader -> không được đăng bài
      return {
        canPost: false,
        postType: null,
        buttonText: ""
      };
    }

    // Default - không được đăng bài
    return {
      canPost: false,
      postType: null,
      buttonText: ""
    };
  };

  const postConfig = getPostConfig();

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
    if (!content || !postConfig.postType) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      await createPost.mutateAsync({ content, postType: postConfig.postType });
      toast.success("Đã tạo bài đăng thành công!");
      setOpen(false);
      setContent("");
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

          {postConfig.canPost && (
            <Button onClick={() => setOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" /> {postConfig.buttonText}
            </Button>
          )}
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
                <SelectItem value="SHARING">Chia sẻ</SelectItem>
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
            <DialogTitle>{postConfig.buttonText}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {/* Hiển thị thông tin loại bài đăng */}
            <div className="text-sm text-muted-foreground">
              Loại bài đăng: <span className="font-medium">
                {postConfig.postType === "FIND_GROUP" && "Tìm nhóm"}
                {postConfig.postType === "FIND_MEMBER" && "Tìm thành viên"}
                {postConfig.postType === "SHARING" && "Chia sẻ"}
              </span>
            </div>

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
                postConfig.buttonText
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
