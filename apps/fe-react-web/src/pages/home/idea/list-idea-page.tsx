// src/pages/ideas/idea-list-page.tsx
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIdeaHook } from "@/hooks/use-idea";
import type { TTypeIdeas } from "@/schema/common/type-ideas.schema";
import type { TIdea } from "@/schema/ideas.schema";
import { Filter, Lightbulb, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import IdeaCard from "./components/idea-card"; // <- đường dẫn tới IdeaCard của bạn

export default function IdeaListPage() {
  const { useGetAllIdeas } = useIdeaHook();

  const { data, isPending, error } = useGetAllIdeas();

  // Tùy vào BaseResponse của bạn:
  // - AxiosResponse<BaseResponse<TIdea[]>> => data?.data?.data
  // - Nếu ideaApi.getAllIdeas() đã .then(res => res.data) thì chỉ cần data?.data
  const ideas = useMemo(() => (data?.data?.data ?? []) as TIdea[], [data]);

  // State cho filter và search
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<TTypeIdeas | "ALL">("ALL");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [dateRange, setDateRange] = useState<"ALL" | "TODAY" | "WEEK" | "MONTH" | "YEAR">("ALL");

  // Logic filter và search
  const filteredAndSortedIdeas = useMemo(() => {
    let filtered = [...ideas]; // Create a copy to avoid mutating original

    // Filter chỉ hiển thị:
    // - Ý tưởng của LECTURER (bất kể status)
    // - Ý tưởng của STUDENT đã APPROVED
    filtered = filtered.filter((idea: TIdea) => {
      const isLecturer = idea.author?.role === "LECTURER";
      const isApprovedStudent = idea.author?.role === "STUDENT" && idea.status === "APPROVED";
      return isLecturer || isApprovedStudent;
    });

    // Filter theo status
    if (filterStatus !== "ALL") {
      filtered = filtered.filter((idea: TIdea) => idea.status === filterStatus);
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

      filtered = filtered.filter((idea: TIdea) => {
        const ideaDate = new Date(idea.createdAt);
        return ideaDate >= filterDate;
      });
    }

    // Search theo title, description, author name, group title
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (idea: TIdea) =>
          idea.title?.toLowerCase().includes(term) ||
          idea.description?.toLowerCase().includes(term) ||
          idea.author?.fullName?.toLowerCase().includes(term) ||
          idea.group?.title?.toLowerCase().includes(term),
      );
    }

    // Sort theo ngày tạo
    filtered.sort((a: TIdea, b: TIdea) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "ASC" ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  }, [ideas, searchTerm, filterStatus, sortOrder, dateRange]);

  // Stats - chỉ tính trên ý tưởng được hiển thị (LECTURER + APPROVED STUDENT)
  const stats = useMemo(() => {
    const displayedIdeas = ideas.filter((idea: TIdea) => {
      const isLecturer = idea.author?.role === "LECTURER";
      const isApprovedStudent = idea.author?.role === "STUDENT" && idea.status === "APPROVED";
      return isLecturer || isApprovedStudent;
    });

    const total = displayedIdeas.length;
    const approved = displayedIdeas.filter((i: TIdea) => i.status === "APPROVED").length;
    const proposed = displayedIdeas.filter((i: TIdea) => i.status === "PROPOSED").length;
    const rejected = displayedIdeas.filter((i: TIdea) => i.status === "REJECTED").length;
    return { total, approved, proposed, rejected };
  }, [ideas]);

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
      const hasFilters = searchTerm.trim() || filterStatus !== "ALL" || dateRange !== "ALL";
      return (
        <Card className="p-8 text-center">
          <Lightbulb className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <p className="text-muted-foreground">{hasFilters ? "Không tìm thấy ý tưởng nào phù hợp với bộ lọc." : "Chưa có ý tưởng nào."}</p>
        </Card>
      );
    }

    return (
      <div className="space-y-4">
        {filteredAndSortedIdeas.map((idea: TIdea, index: number) => (
          <IdeaCard key={idea.id ?? index} idea={idea} />
        ))}
      </div>
    );
  }, [isPending, error, filteredAndSortedIdeas, searchTerm, filterStatus, dateRange]);

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Hiệu ứng nền */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)_/_12%)_0,_transparent_55%)]"
        aria-hidden="true"
      />

      {/* Header */}
      <div className="from-primary/10 via-primary/5 to-background mx-auto w-full max-w-6xl border-b bg-gradient-to-r px-6 py-6 backdrop-blur">
        <div className="mb-4 flex items-center gap-3">
          <Lightbulb className="text-primary h-8 w-8" />
          <div>
            <h1 className="text-foreground text-2xl font-bold">Danh sách ý tưởng</h1>
            <p className="text-muted-foreground text-sm">Khám phá và theo dõi các ý tưởng dự án</p>
          </div>
        </div>

        {/* Stats Cards */}
        {!isPending && (
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Card className="to-background border-blue-200 bg-gradient-to-br from-blue-50 p-3">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-muted-foreground text-xs">Tổng số ý tưởng</div>
            </Card>
            <Card className="to-background border-green-200 bg-gradient-to-br from-green-50 p-3">
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <div className="text-muted-foreground text-xs">Đã duyệt</div>
            </Card>
            <Card className="to-background border-orange-200 bg-gradient-to-br from-orange-50 p-3">
              <div className="text-2xl font-bold text-orange-600">{stats.proposed}</div>
              <div className="text-muted-foreground text-xs">Đang đề xuất</div>
            </Card>
            <Card className="to-background border-red-200 bg-gradient-to-br from-red-50 p-3">
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <div className="text-muted-foreground text-xs">Từ chối</div>
            </Card>
          </div>
        )}
      </div>

      {/* Filter và Search Controls */}
      <div className="bg-muted/30 mx-auto w-full max-w-6xl px-6 py-4">
        <div className="mb-3 flex items-center gap-2">
          <Filter className="text-muted-foreground h-4 w-4" />
          <span className="text-muted-foreground text-sm font-medium">Bộ lọc và tìm kiếm</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
          <Input
            type="text"
            placeholder="Tìm kiếm theo tiêu đề, mô tả, tác giả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />

          <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as TTypeIdeas | "ALL")}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả</SelectItem>
              <SelectItem value="PROPOSED">Đề xuất</SelectItem>
              <SelectItem value="PENDING">Chờ duyệt</SelectItem>
              <SelectItem value="APPROVED">Đã duyệt</SelectItem>
              <SelectItem value="REJECTED">Từ chối</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateRange} onValueChange={(v) => setDateRange(v as "ALL" | "TODAY" | "WEEK" | "MONTH" | "YEAR")}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Tất cả" />
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
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Mới nhất" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DESC">Mới nhất</SelectItem>
              <SelectItem value="ASC">Cũ nhất</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Result count */}
        <div className="text-muted-foreground mt-3 text-sm">
          Hiển thị <strong className="text-foreground">{filteredAndSortedIdeas.length}</strong> / {stats.total} ý tưởng
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto w-full max-w-6xl px-6 py-6 pb-16">{listSection}</div>
    </div>
  );
}
