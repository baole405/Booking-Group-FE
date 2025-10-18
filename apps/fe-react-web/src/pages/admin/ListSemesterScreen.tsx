import { CreateSemesterDialog } from "@/components/dialog/CreateSemesterDialog";
import { SemesterDetailDialog } from "@/components/dialog/SemesterDetailDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSemesterHook } from "@/hooks/use-semester";
import type { TSemester } from "@/schema/semester.schema";
import { useEffect, useState } from "react";

export default function ListSemesterScreen() {
  const { useSemesterList } = useSemesterHook();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedSemester, setSelectedSemester] = useState<TSemester | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { data: semesterListResponse, isLoading, error, refetch } = useSemesterList();

  // Safely handle semesters data (add a default value if data doesn't exist yet)
  const semesters: TSemester[] = semesterListResponse?.data?.data ?? [];

  // Client-side filtering
  const filteredSemesters = semesters
    .filter((semester) => {
      const matchesSearch = semester.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || (statusFilter === "active" && semester.active) || (statusFilter === "inactive" && !semester.active);
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => (b.id ?? 0) - (a.id ?? 0));

  // Client-side pagination
  const totalPages = Math.ceil(filteredSemesters.length / itemsPerPage);
  const paginatedSemesters = filteredSemesters.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handlePreviousPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  };

  useEffect(() => {
    console.log("Fetched Semester List:", semesterListResponse); // Debugging
  }, [semesterListResponse]);

  useEffect(() => {
    console.log("Filtered Semesters:", filteredSemesters); // Debugging
  }, [filteredSemesters]);

  return (
    <div className="rounded bg-white p-6 shadow">
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          className="w-full rounded border px-3 py-2 md:w-64"
          placeholder="Tìm kiếm học kỳ..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset to first page on search
          }}
        />
        <div className="flex items-center gap-2">
          <select
            className="rounded border px-2 py-2"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as "all" | "active" | "inactive");
              setPage(1); // Reset to first page on filter change
            }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Ngưng hoạt động</option>
          </select>
          <Button size="sm" onClick={() => refetch()} disabled={isLoading}>
            {isLoading ? "Đang tải..." : "Tải lại"}
          </Button>
          <CreateSemesterDialog />
        </div>
      </div>

      {isLoading && (
        <div className="py-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
          <p className="mt-2">Đang tải dữ liệu...</p>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          <p className="font-bold">Lỗi</p>
          <p>{error.message}</p>
        </div>
      )}

      {!isLoading && !error && paginatedSemesters.length === 0 && <div className="py-8 text-center text-gray-500">Không có dữ liệu học kỳ</div>}

      {!isLoading && !error && paginatedSemesters.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="border px-4 py-2">Tên học kỳ</th>
                <th className="border px-4 py-2">Trạng thái</th>
                <th className="border px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSemesters.map((semester) => (
                <tr key={semester.id} className="text-center">
                  <td className="border px-4 py-2">{semester.name}</td>
                  <td className="border px-4 py-2">
                    <Badge variant={semester.active ? "default" : "destructive"}>{semester.active ? "Active" : "Inactive"}</Badge>
                  </td>
                  <td className="border px-4 py-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedSemester(semester);
                        setIsDetailOpen(true);
                      }}
                    >
                      Chi tiết
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button size="sm" variant="outline" onClick={handlePreviousPage} disabled={page === 1}>
            Trang trước
          </Button>
          <span className="mx-2">
            {page}/{totalPages}
          </span>
          <Button size="sm" variant="outline" onClick={handleNextPage} disabled={page === totalPages}>
            Trang sau
          </Button>
        </div>
      )}
      <SemesterDetailDialog semester={selectedSemester} open={isDetailOpen} onOpenChange={setIsDetailOpen} />
    </div>
  );
}
