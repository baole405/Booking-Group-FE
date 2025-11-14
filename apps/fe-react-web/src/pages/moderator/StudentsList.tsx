import StudentProfileModal from "@/components/dialog/StudentProfileModal";
import { AdminErrorState, AdminFilterBar, AdminLayout, AdminLoadingState, AdminTableContainer } from "@/components/layout/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUserHook } from "@/hooks/use-user";
import type { TUserListResponse } from "@/schema/user.schema";
import { Eye, RefreshCw, Search, Users } from "lucide-react";
import React, { useMemo, useState } from "react";

// Custom hook để tách logic phức tạp
const useStudentsData = (currentPage: number, itemsPerPage: number, searchQuery: string | undefined, filterGroup: string) => {
  const { useUserList, useUsersNoGroup } = useUserHook();

  const {
    data: allStudentsData,
    isLoading: isLoadingAll,
    error: errorAll,
    refetch: refetchAll,
  } = useUserList({
    page: currentPage,
    size: itemsPerPage,
    role: "STUDENT",
    search: searchQuery,
  });

  const { data: noGroupData, isLoading: isLoadingNoGroup, error: errorNoGroup, refetch: refetchNoGroup } = useUsersNoGroup();

  const isLoading = filterGroup === "NO_GROUP" ? isLoadingNoGroup : isLoadingAll;
  const error = filterGroup === "NO_GROUP" ? errorNoGroup : errorAll;

  const paginationData = filterGroup === "NO_GROUP" ? undefined : (allStudentsData?.data as TUserListResponse | undefined);

  const students = useMemo(() => {
    if (filterGroup === "NO_GROUP") {
      const noGroupUsers = noGroupData?.data || [];
      return noGroupUsers.filter((user) => user.role === "STUDENT");
    }
    return paginationData?.content || [];
  }, [filterGroup, noGroupData, paginationData]);

  const handleRefresh = () => {
    if (filterGroup === "NO_GROUP") {
      refetchNoGroup();
    } else {
      refetchAll();
    }
  };

  return { students, isLoading, error, paginationData, handleRefresh };
};

const useStudentsFilter = (
  students: TUser[],
  searchTerm: string,
  searchByCode: string,
  currentPage: number,
  itemsPerPage: number,
  filterGroup: string,
  paginationData: TUserListResponse | undefined,
) => {
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchName = !searchTerm || student.fullName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCode = !searchByCode || student.studentCode?.toLowerCase().includes(searchByCode.toLowerCase());
      return matchName && matchCode;
    });
  }, [students, searchTerm, searchByCode]);

  const totalElements = filterGroup === "NO_GROUP" ? filteredStudents.length : paginationData?.totalElements || 0;
  const totalPages = filterGroup === "NO_GROUP" ? Math.ceil(filteredStudents.length / itemsPerPage) || 0 : paginationData?.totalPages || 0;

  const startIndex = currentPage * itemsPerPage;
  const currentStudents = filterGroup === "NO_GROUP" ? filteredStudents.slice(startIndex, startIndex + itemsPerPage) : filteredStudents;

  return { filteredStudents, totalElements, totalPages, startIndex, currentStudents };
};

const StudentsList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchByCode, setSearchByCode] = useState<string>("");
  const [filterGroup, setFilterGroup] = useState<string>("ALL");
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 10;

  // Tạo search query từ cả 2 fields
  const searchQuery = useMemo(() => {
    if (searchTerm || searchByCode) {
      return `${searchTerm} ${searchByCode}`.trim();
    }
    return undefined;
  }, [searchTerm, searchByCode]);

  // Reset trang khi tìm kiếm hoặc đổi filter
  React.useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, searchByCode, filterGroup]);

  // Sử dụng custom hooks
  const { students, isLoading, error, paginationData, handleRefresh } = useStudentsData(currentPage, itemsPerPage, searchQuery, filterGroup);
  const { totalElements, totalPages, startIndex, currentStudents } = useStudentsFilter(
    students,
    searchTerm,
    searchByCode,
    currentPage,
    itemsPerPage,
    filterGroup,
    paginationData,
  );

  const handleViewStudent = (studentId: number) => {
    setSelectedStudentId(studentId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudentId(null);
  };

  return (
    <AdminLayout
      title="Danh sách sinh viên"
      description="Quản lý thông tin sinh viên trong hệ thống"
      headerActions={
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`mr-1 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Tải lại
          </Button>
        </div>
      }
    >
      {/* Filter Section */}
      <AdminFilterBar>
        <div className="flex flex-1 items-center space-x-4">
          <Select value={filterGroup} onValueChange={setFilterGroup}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Trạng thái nhóm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả sinh viên</SelectItem>
              <SelectItem value="NO_GROUP">Chưa có nhóm</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative max-w-sm flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Tìm theo tên sinh viên..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          <div className="relative max-w-sm flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Tìm theo mã sinh viên..." className="pl-9" value={searchByCode} onChange={(e) => setSearchByCode(e.target.value)} />
          </div>
        </div>
      </AdminFilterBar>

      {/* Content */}
      <AdminTableContainer>
        {isLoading && <AdminLoadingState />}

        {error && (
          <AdminErrorState
            title="Lỗi tải dữ liệu"
            message={error instanceof Error ? error.message : "Không thể tải danh sách sinh viên"}
            onRetry={handleRefresh}
          />
        )}

        {!isLoading && !error && currentStudents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="mb-4 h-12 w-12 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">Không có dữ liệu</h3>
            <p className="mt-1 text-sm text-gray-500">Không tìm thấy sinh viên nào phù hợp với bộ lọc</p>
          </div>
        )}

        {!isLoading && !error && currentStudents.length > 0 && (
          <>
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="w-16 text-center">STT</TableHead>
                  <TableHead>Họ và tên</TableHead>
                  <TableHead>Mã sinh viên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="w-32 text-center">Chuyên ngành</TableHead>
                  <TableHead className="w-24 text-center">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentStudents.map((student, index) => (
                  <TableRow key={student.id} className="hover:bg-gray-50/50">
                    <TableCell className="text-center font-mono text-sm text-gray-500">{startIndex + index + 1}</TableCell>
                    <TableCell className="font-medium">{student.fullName}</TableCell>
                    <TableCell className="font-mono text-sm">{student.studentCode || "N/A"}</TableCell>
                    <TableCell className="text-gray-600">{student.email}</TableCell>
                    <TableCell className="text-center">
                      <Badge className="border-blue-200 bg-blue-100 text-blue-800">{student.major?.name || "Chưa có"}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button size="sm" variant="outline" onClick={() => handleViewStudent(student.id)} title="Xem chi tiết sinh viên">
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
                          onClick={currentPage === 0 ? undefined : () => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                          aria-disabled={currentPage === 0}
                          className={currentPage === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      <span className="px-4 py-2 text-sm text-gray-600">
                        Trang {currentPage + 1} / {totalPages}
                      </span>
                      <PaginationItem>
                        <PaginationNext
                          onClick={currentPage >= totalPages - 1 ? undefined : () => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
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
            {totalElements > 0 && (
              <div className="border-t bg-gray-50/50 px-6 py-3">
                <p className="text-center text-sm text-gray-600">
                  Tổng cộng: <span className="font-medium">{totalElements}</span> sinh viên
                </p>
              </div>
            )}
          </>
        )}
      </AdminTableContainer>

      {/* Modal */}
      {selectedStudentId && <StudentProfileModal open={isModalOpen} onClose={handleCloseModal} studentId={selectedStudentId} />}
    </AdminLayout>
  );
};

export default StudentsList;
