import { PaginationBar } from "@/components/layout/pagination/pagination-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGroupHook } from "@/hooks/use-group";
import { useQueryParams } from "@/hooks/use-query-params";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import GroupCard from "./components/group-card";
import type { TGroup } from "@/schema/group.schema";

const getFilterValue = (id: string, filters: { id: string; value: unknown }[]) =>
  filters.find((f) => f.id === id)?.value ?? null;

export default function GroupPage() {
  const {
    currentPage,
    pageSize,
    sortBy,
    isAsc,
    filter,
    setFilter,
    setSort,
    setPage,
    setPageSize,
  } = useQueryParams({
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
    if (isPending)
      return (
        <div className="flex justify-center py-10 text-muted-foreground">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          Đang tải danh sách nhóm...
        </div>
      );
    if (error)
      return (
        <div className="py-10 text-center text-destructive">
          Đã xảy ra lỗi khi tải dữ liệu nhóm.
        </div>
      );
    if (!groups.length)
      return (
        <div className="py-10 text-center text-muted-foreground">
          Không có nhóm nào phù hợp.
        </div>
      );

    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group: TGroup) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    );
  }, [isPending, error, groups]);

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white text-foreground min-h-screen">
      {/* Background decorative effect */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)_/_12%)_0,_transparent_55%)]"
        aria-hidden="true"
      />

      {/* Header Section */}
      <header className="sticky top-0 z-20 bg-background/70 backdrop-blur-sm border-b">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <h1 className="text-xl font-semibold text-primary drop-shadow-sm">
            Danh sách nhóm sinh viên
          </h1>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {/* Filter: Status */}
            <select
              className="rounded-md border bg-white px-2 py-1"
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

            {/* Filter: Type */}
            <select
              className="rounded-md border bg-white px-2 py-1"
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

            {/* Sort */}
            <div className="flex items-center gap-2">
              <select
                className="rounded-md border bg-white px-2 py-1"
                value={sortBy}
                onChange={(e) => setSort(e.target.value, isAsc)}
              >
                <option value="id">Theo ID</option>
                <option value="title">Theo Tên nhóm</option>
                <option value="createdAt">Theo Ngày tạo</option>
              </select>
              <Button variant="outline" size="sm" onClick={() => setSort(sortBy, !isAsc)}>
                {isAsc ? "↑" : "↓"}
              </Button>
            </div>

            {/* Search */}
            <Input
              type="text"
              placeholder="Tìm nhóm..."
              className="w-40 sm:w-56"
              value={q}
              onChange={(e) => {
                setFilter("q", e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </header>

      {/* Content Section */}
      <main className="mx-auto w-full max-w-6xl px-6 py-8">{listSection}</main>

      {/* Pagination */}
      <footer className="bg-background/95 supports-[backdrop-filter]:bg-background/75 fixed inset-x-0 bottom-0 z-20 border-t backdrop-blur-sm">
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
      </footer>
    </div>
  );
}
