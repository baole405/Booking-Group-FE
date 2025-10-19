import { PaginationBar } from "@/components/layout/pagination/pagination-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGroupHook } from "@/hooks/use-group";
import { useQueryParams } from "@/hooks/use-query-params";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import GroupCard from "./components/group-card";

const getFilterValue = (id: string, filters: { id: string; value: unknown }[]) => filters.find((f) => f.id === id)?.value ?? null;

export default function GroupPage() {
  const { currentPage, pageSize, sortBy, isAsc, filter, setFilter, setSort, setPage, setPageSize } = useQueryParams({
    defaultSortBy: "id",
    defaultIsAsc: true,
    defaultFilter: [
      { id: "q", value: "" },
      { id: "status", value: "All" },
      { id: "type", value: "All" },
    ],
  });

  const q = String(getFilterValue("q", filter) ?? "");
  const statusRaw = getFilterValue("status", filter);
  const typeRaw = getFilterValue("type", filter);

  const status = statusRaw === "All" ? undefined : (statusRaw as string | undefined);
  const type = typeRaw === "All" ? undefined : (typeRaw as string | undefined);

  const { useGroupList } = useGroupHook();
  const { data, isPending, error } = useGroupList({
    page: currentPage,
    size: pageSize,
    sort: sortBy,
    dir: isAsc ? "asc" : "desc",
    q,
    status,
    type,
  });

  const payload = data?.data?.data;
  const groups = payload?.content ?? [];
  const totalPages = Math.max(1, payload?.totalPages ?? 1);
  const totalElements = payload?.totalElements ?? 0;

  const listSection = useMemo(() => {
    if (isPending) {
      return (
        <div className="text-muted-foreground flex justify-center py-10">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Đang tải danh sách nhóm...
        </div>
      );
    }
    if (error) {
      return <div className="text-destructive py-10 text-center">Đã xảy ra lỗi khi tải dữ liệu nhóm.</div>;
    }
    if (!groups.length) {
      return <div className="text-muted-foreground py-10 text-center">Không có nhóm nào phù hợp.</div>;
    }

    return (
      <div className="flex flex-col gap-4">
        {groups.map((group: any, index: number) => (
          <div key={group.id ?? index} className="w-full">
            <GroupCard group={group} />
          </div>
        ))}
      </div>
    );
  }, [isPending, error, groups]);

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      {/* Hiệu ứng nền */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)_/_12%)_0,_transparent_55%)]"
        aria-hidden="true"
      />

      {/* Header */}
      <div className="mx-auto w-full max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between"></div>

        {/* Toolbar: Filters + Sort + Search (search nằm cuối) */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {/* Status */}
          <select
            className="h-9 rounded-md border bg-transparent px-2 text-sm"
            value={(statusRaw as string) ?? "All"}
            onChange={(e) => {
              setFilter("status", e.target.value);
              setPage(1);
            }}
          >
            <option value="All">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang hoạt động</option>
            <option value="LOCKED">Đã khóa</option>
            <option value="FORMING">Đang hình thành</option>
          </select>

          {/* Type */}
          <select
            className="h-9 rounded-md border bg-transparent px-2 text-sm"
            value={(typeRaw as string) ?? "All"}
            onChange={(e) => {
              setFilter("type", e.target.value);
              setPage(1);
            }}
          >
            <option value="All">Tất cả loại</option>
            <option value="PUBLIC">Công khai</option>
            <option value="PRIVATE">Riêng tư</option>
          </select>

          {/* Sort + dir */}
          <div className="flex items-center gap-2">
            <select className="h-9 rounded-md border bg-transparent px-2 text-sm" value={sortBy} onChange={(e) => setSort(e.target.value, isAsc)}>
              <option value="id">Sắp xếp theo: ID</option>
              <option value="title">Sắp xếp theo: Tên nhóm</option>
              <option value="createdAt">Sắp xếp theo: Ngày tạo</option>
            </select>
            <Button variant="outline" onClick={() => setSort(sortBy, !isAsc)}>
              {isAsc ? "Tăng dần" : "Giảm dần"}
            </Button>
          </div>

          {/* Search (đặt cuối cùng) */}
          <div className="ml-auto w-full sm:w-64">
            <Input
              type="text"
              placeholder="Nhập tên nhóm..."
              className="text-foreground border-input focus-visible:ring-primary border bg-white shadow-sm"
              value={q}
              onChange={(e) => {
                setFilter("q", e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* Main content (không còn sidebar) */}
      <div className="mx-auto w-full max-w-6xl px-6 py-8 pb-24">{listSection}</div>

      {/* PaginationBar cố định dưới cuối trang */}
      <div className="bg-background/95 supports-[backdrop-filter]:bg-background/75 fixed inset-x-0 bottom-0 z-20 border-t backdrop-blur">
        <div className="mx-auto w-full max-w-6xl px-6">
          <PaginationBar
            total={totalElements}
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={(p) => setPage(p)}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setPage(1);
            }}
          />
        </div>
      </div>
    </div>
  );
}
