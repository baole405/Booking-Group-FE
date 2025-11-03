import { CreateSemesterDialog } from "@/components/dialog/CreateSemesterDialog";
import { SemesterDetailDialog } from "@/components/dialog/SemesterDetailDialog";
import { AdminErrorState, AdminFilterBar, AdminLayout, AdminLoadingState, AdminTableContainer } from "@/components/layout/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSemesterHook } from "@/hooks/use-semester";
import type { TSemester } from "@/schema/semester.schema";
import { Calendar, Eye, RefreshCw, Search } from "lucide-react";
import { useState } from "react";

export default function ListSemesterScreen() {
  const { useSemesterList } = useSemesterHook();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedSemester, setSelectedSemester] = useState<TSemester | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { data: semesterListResponse, isLoading, error, refetch } = useSemesterList();

  // Safely handle semesters data
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

  const handleDetailClick = (semester: TSemester) => {
    setSelectedSemester(semester);
    setIsDetailOpen(true);
  };

  const getStatusBadge = (semester: TSemester) => {
    if (semester.isComplete) {
      return <Badge className="border-blue-200 bg-blue-100 text-blue-800">Đã hoàn thành</Badge>;
    }
    return semester.active ? (
      <Badge className="border-green-200 bg-green-100 text-green-800">Đang hoạt động</Badge>
    ) : (
      <Badge className="border-gray-200 bg-gray-100 text-gray-800">Ngưng hoạt động</Badge>
    );
  };

  return (
    <AdminLayout
      title="Quản lý học kỳ"
      description="Quản lý thông tin các học kỳ trong hệ thống"
      headerActions={
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`mr-1 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Tải lại
          </Button>
          <CreateSemesterDialog />
        </div>
      }
    >
      {/* Filter Section */}
      <AdminFilterBar>
        <div className="flex flex-1 items-center space-x-4">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Tìm kiếm học kỳ..."
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(value: "all" | "active" | "inactive") => {
              setStatusFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Đang hoạt động</SelectItem>
              <SelectItem value="inactive">Ngưng hoạt động</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </AdminFilterBar>

      {/* Content */}
      <AdminTableContainer>
        {isLoading && <AdminLoadingState />}

        {error && <AdminErrorState title="Lỗi tải dữ liệu" message={error.message} onRetry={() => refetch()} />}

        {!isLoading && !error && paginatedSemesters.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Calendar className="mb-4 h-12 w-12 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">Không có dữ liệu</h3>
            <p className="mt-1 text-sm text-gray-500">Không tìm thấy học kỳ nào phù hợp với bộ lọc</p>
            <div className="mt-4">
              <CreateSemesterDialog />
            </div>
          </div>
        )}

        {!isLoading && !error && paginatedSemesters.length > 0 && (
          <>
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="w-20 text-center">ID</TableHead>
                  <TableHead>Tên học kỳ</TableHead>
                  <TableHead className="w-32 text-center">Trạng thái</TableHead>
                  <TableHead className="w-32 text-center">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSemesters.map((semester) => (
                  <TableRow key={semester.id} className="hover:bg-gray-50/50">
                    <TableCell className="text-center font-mono text-sm text-gray-500">{semester.id}</TableCell>
                    <TableCell className="font-medium">{semester.name}</TableCell>
                    <TableCell className="text-center">{getStatusBadge(semester)}</TableCell>
                    <TableCell className="text-center">
                      <Button size="sm" variant="outline" onClick={() => handleDetailClick(semester)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="border-t bg-gray-50/50 px-6 py-4">
                <div className="flex items-center justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={page === 1 ? undefined : () => setPage((prev) => Math.max(prev - 1, 1))}
                          aria-disabled={page === 1}
                          className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      <span className="px-4 py-2 text-sm text-gray-600">
                        Trang {page} / {totalPages}
                      </span>
                      <PaginationItem>
                        <PaginationNext
                          onClick={page >= totalPages ? undefined : () => setPage((prev) => Math.min(prev + 1, totalPages))}
                          aria-disabled={page >= totalPages}
                          className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            )}
          </>
        )}
      </AdminTableContainer>

      <SemesterDetailDialog semester={selectedSemester} open={isDetailOpen} onOpenChange={setIsDetailOpen} allSemesters={semesters} />
    </AdminLayout>
  );
}
