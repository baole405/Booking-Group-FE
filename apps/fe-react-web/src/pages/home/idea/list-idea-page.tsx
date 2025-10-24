// src/pages/ideas/idea-list-page.tsx
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import IdeaCard from "./components/idea-card"; // <- đường dẫn tới IdeaCard của bạn
import { useIdeaHook } from "@/hooks/use-idea";
import type { TTypeIdeas } from "@/schema/common/type-ideas.schema";

export default function IdeaListPage() {
  const { useGetAllIdeas } = useIdeaHook();

  const { data, isPending, error } = useGetAllIdeas();

  // Tùy vào BaseResponse của bạn:
  // - AxiosResponse<BaseResponse<TIdea[]>> => data?.data?.data
  // - Nếu ideaApi.getAllIdeas() đã .then(res => res.data) thì chỉ cần data?.data
  const ideas = useMemo(() => (data?.data?.data ?? []) as any[], [data]);

  // State cho filter và search
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<TTypeIdeas | "ALL">("ALL");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [dateRange, setDateRange] = useState<"ALL" | "TODAY" | "WEEK" | "MONTH" | "YEAR">("ALL");

  // Logic filter và search
  const filteredAndSortedIdeas = useMemo(() => {
    let filtered = [...ideas]; // Create a copy to avoid mutating original

    // Filter theo status
    if (filterStatus !== "ALL") {
      filtered = filtered.filter((idea: any) => idea.status === filterStatus);
    }

    // Filter theo thời gian
    if (dateRange !== "ALL") {
      const now = new Date();
      const filterDate = new Date();

      switch (dateRange) {
        case "TODAY":
          filterDate.setHours(0, 0, 0, 0);
          break;
        case "WEEK":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "MONTH":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "YEAR":
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter((idea: any) => {
        const ideaDate = new Date(idea.createdAt);
        return ideaDate >= filterDate;
      });
    }

    // Search theo title, description, author name, group title
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((idea: any) =>
        idea.title?.toLowerCase().includes(term) ||
        idea.description?.toLowerCase().includes(term) ||
        idea.author?.fullName?.toLowerCase().includes(term) ||
        idea.group?.title?.toLowerCase().includes(term)
      );
    }

    // Sort theo ngày tạo
    filtered.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "ASC" ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  }, [ideas, searchTerm, filterStatus, sortOrder, dateRange]);

  const listSection = useMemo(() => {
    if (isPending) {
      return (
        <div className="text-muted-foreground flex justify-center py-10">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Đang tải danh sách ý tưởng...
        </div>
      );
    }
    if (error) {
      return <div className="text-destructive py-10 text-center">Đã xảy ra lỗi khi tải dữ liệu ý tưởng.</div>;
    }
    if (!filteredAndSortedIdeas.length) {
      const hasFilters = searchTerm.trim() || filterStatus !== "ALL";
      return (
        <div className="text-muted-foreground py-10 text-center">
          {hasFilters ? "Không tìm thấy ý tưởng nào phù hợp với bộ lọc." : "Chưa có ý tưởng nào."}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        <div className="text-sm text-muted-foreground">
          Hiển thị {filteredAndSortedIdeas.length} ý tưởng
        </div>
        {filteredAndSortedIdeas.map((idea: any, index: number) => (
          <div key={idea.id ?? index} className="w-full">
            <IdeaCard idea={idea} />
          </div>
        ))}
      </div>
    );
  }, [isPending, error, filteredAndSortedIdeas, searchTerm, filterStatus]);

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      {/* Hiệu ứng nền (giữ style tương tự GroupPage nếu bạn thích) */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)_/_12%)_0,_transparent_55%)]"
        aria-hidden="true"
      />

      {/* Header với controls */}
      <div className="mx-auto w-full max-w-6xl px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h1 className="text-xl font-semibold text-primary">Danh sách ý tưởng</h1>
        </div>

        {/* Filter và Search Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Tìm ý tưởng theo tiêu đề, mô tả hoặc tác giả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as TTypeIdeas | "ALL")}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả</SelectItem>
                <SelectItem value="DRAFT">Bản nháp</SelectItem>
                <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                <SelectItem value="REJECTED">Từ chối</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={(v) => setDateRange(v as "ALL" | "TODAY" | "WEEK" | "MONTH" | "YEAR")}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả</SelectItem>
                <SelectItem value="TODAY">Hôm nay</SelectItem>
                <SelectItem value="WEEK">Tuần này</SelectItem>
                <SelectItem value="MONTH">Tháng này</SelectItem>
                <SelectItem value="YEAR">Năm nay</SelectItem>
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

      {/* Main content */}
      <div className="mx-auto w-full max-w-6xl px-6 py-8 pb-16">
        {listSection}
      </div>
    </div>
  );
}
