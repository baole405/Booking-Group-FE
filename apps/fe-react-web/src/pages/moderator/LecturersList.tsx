import { AdminErrorState, AdminFilterBar, AdminLayout, AdminLoadingState, AdminTableContainer } from "@/components/layout/AdminLayout";
import LecturerProfileModal from "@/components/dialog/LecturerProfileModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useUserHook } from "@/hooks/use-user";
import type { TUserListResponse } from "@/schema/user.schema";
import { Eye, RefreshCw, Search, Users } from "lucide-react";
import React, { useMemo, useState } from "react";

const LecturersList: React.FC = () => {
  const { useUserList } = useUserHook();
  const [currentPage, setCurrentPage] = useState<number>(0); // backend page 0-index
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchByCode, setSearchByCode] = useState<string>("");
  const [selectedLecturerId, setSelectedLecturerId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  const handleViewLecturer = (lecturerId: number) => {
    setSelectedLecturerId(lecturerId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLecturerId(null);
  };

  // Gộp search
  const searchQuery = useMemo(() => {
    if (searchTerm || searchByCode) {
      return `${searchTerm} ${searchByCode}`.trim();
    }
    return undefined;
  }, [searchTerm, searchByCode]);

  // Gọi API lấy danh sách giảng viên
  const { data, isLoading, error, refetch } = useUserList({
    page: currentPage,
    size: itemsPerPage,
    role: "LECTURER",
    search: searchQuery,
  });

  React.useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, searchByCode]);

  // Lấy dữ liệu từ API response
  const paginationData = data?.data as TUserListResponse | undefined;
  const lecturers = useMemo(() => paginationData?.content || [], [paginationData]);
  const totalPages = paginationData?.totalPages || 0;



  return (
    <AdminLayout
      title="Danh sách giảng viên"
      description="Quản lý thông tin giảng viên trong hệ thống"
      headerActions={
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`mr-1 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Tải lại
          </Button>
        </div>
      }
    >
      {/* Filter Section */}
      <AdminFilterBar>
        <div className="flex flex-1 items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Tìm theo tên giảng viên..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Tìm theo mã giảng viên..."
              className="pl-9"
              value={searchByCode}
              onChange={(e) => setSearchByCode(e.target.value)}
            />
          </div>
        </div>
      </AdminFilterBar>

      {/* Content */}
      <AdminTableContainer>
        {isLoading && <AdminLoadingState />}

        {error && (
          <AdminErrorState
            title="Lỗi tải dữ liệu"
            message={error instanceof Error ? error.message : "Không thể tải danh sách giảng viên"}
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !error && lecturers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Không có dữ liệu</h3>
            <p className="mt-1 text-sm text-gray-500">Không tìm thấy giảng viên nào phù hợp với bộ lọc</p>
          </div>
        )}

        {!isLoading && !error && lecturers.length > 0 && (
          <>
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="w-16 text-center">STT</TableHead>
                  <TableHead>Họ và tên</TableHead>
                  <TableHead>Mã giảng viên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="w-32 text-center">Chuyên ngành</TableHead>
                  <TableHead className="w-24 text-center">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lecturers.map((lecturer, index) => (
                  <TableRow key={lecturer.id} className="hover:bg-gray-50/50">
                    <TableCell className="text-center font-mono text-sm text-gray-500">
                      {currentPage * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell className="font-medium">{lecturer.fullName}</TableCell>
                    <TableCell className="font-mono text-sm">{lecturer.studentCode || "N/A"}</TableCell>
                    <TableCell className="text-gray-600">{lecturer.email}</TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                        {lecturer.major?.name || "Chưa có"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewLecturer(lecturer.id)}
                        title="Xem chi tiết giảng viên"
                      >
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
                          onClick={currentPage === 0 ? undefined : () => setCurrentPage(prev => Math.max(prev - 1, 0))}
                          aria-disabled={currentPage === 0}
                          className={currentPage === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      <span className="px-4 py-2 text-sm text-gray-600">
                        Trang {currentPage + 1} / {totalPages}
                      </span>
                      <PaginationItem>
                        <PaginationNext
                          onClick={currentPage >= totalPages - 1 ? undefined : () => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
                          aria-disabled={currentPage >= totalPages - 1}
                          className={currentPage >= totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="border-t bg-gray-50/50 px-6 py-3">
              <p className="text-center text-sm text-gray-600">
                Tổng cộng: <span className="font-medium">{lecturers.length}</span> giảng viên
              </p>
            </div>
          </>
        )}
      </AdminTableContainer>

      {/* Modal */}
      {selectedLecturerId && <LecturerProfileModal open={isModalOpen} onClose={handleCloseModal} lecturerId={selectedLecturerId} />}
    </AdminLayout>
  );
};

export default LecturersList;
