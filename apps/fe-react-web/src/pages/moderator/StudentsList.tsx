import StudentProfileModal from "@/components/dialog/StudentProfileModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserHook } from "@/hooks/use-user";
import type { TUserListResponse } from "@/schema/user.schema";
import React, { useMemo, useState } from "react";

const StudentsList: React.FC = () => {
  const { useUserList, useUsersNoGroup } = useUserHook();
  const [currentPage, setCurrentPage] = useState<number>(0); // Backend bắt đầu từ 0
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchByCode, setSearchByCode] = useState<string>("");
  const [filterGroup, setFilterGroup] = useState<string>("ALL"); // ALL, NO_GROUP
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewStudent = (studentId: number) => {
    setSelectedStudentId(studentId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudentId(null);
  };

  const itemsPerPage = 10;

  // Tạo search query từ cả 2 fields
  const searchQuery = useMemo(() => {
    if (searchTerm || searchByCode) {
      return `${searchTerm} ${searchByCode}`.trim();
    }
    return undefined;
  }, [searchTerm, searchByCode]);

  // Gọi API tùy theo filter
  const {
    data: allStudentsData,
    isLoading: isLoadingAll,
    error: errorAll,
  } = useUserList({
    page: currentPage,
    size: itemsPerPage,
    role: "STUDENT",
    search: searchQuery,
  });

  const { data: noGroupData, isLoading: isLoadingNoGroup, error: errorNoGroup } = useUsersNoGroup();

  // Chọn data source theo filter
  const isLoading = filterGroup === "NO_GROUP" ? isLoadingNoGroup : isLoadingAll;
  const error = filterGroup === "NO_GROUP" ? errorNoGroup : errorAll;

  // Reset trang khi tìm kiếm hoặc đổi filter
  React.useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, searchByCode, filterGroup]);

  // Lấy dữ liệu từ API response
  const paginationData =
    filterGroup === "NO_GROUP"
      ? undefined // No-group API không có pagination
      : (allStudentsData?.data as TUserListResponse | undefined);

  const students = useMemo(() => {
    if (filterGroup === "NO_GROUP") {
      // Lọc STUDENT từ noGroupData (backend trả tất cả role)
      const noGroupUsers = noGroupData?.data || [];
      return noGroupUsers.filter((user) => user.role === "STUDENT");
    }
    return paginationData?.content || [];
  }, [filterGroup, noGroupData, paginationData]);

  // Lọc local nếu cần (vì backend có thể không hỗ trợ search cả 2 field riêng biệt)
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchName = !searchTerm || student.fullName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCode = !searchByCode || student.studentCode?.toLowerCase().includes(searchByCode.toLowerCase());
      return matchName && matchCode;
    });
  }, [students, searchTerm, searchByCode]);

  // Pagination cho NO_GROUP mode (client-side)
  const totalElements = filterGroup === "NO_GROUP" ? filteredStudents.length : paginationData?.totalElements || 0;
  const totalPages = filterGroup === "NO_GROUP" ? Math.ceil(filteredStudents.length / itemsPerPage) || 0 : paginationData?.totalPages || 0;

  const startIndex = currentPage * itemsPerPage;
  const endIndex = (currentPage + 1) * itemsPerPage;

  // Slice data cho NO_GROUP mode, ALL mode đã có pagination từ backend
  const currentStudents = filterGroup === "NO_GROUP" ? filteredStudents.slice(startIndex, endIndex) : filteredStudents;

  // Debug pagination
  console.log("StudentsList Debug:", {
    filterGroup,
    studentsLength: students.length,
    filteredStudentsLength: filteredStudents.length,
    totalElements,
    totalPages,
    currentPage,
    currentStudentsLength: currentStudents.length,
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Đang tải danh sách sinh viên...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-lg text-red-500">Lỗi: {error instanceof Error ? error.message : "Không thể tải danh sách"}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <h1 className="text-2xl font-bold text-gray-900">Danh sách sinh viên</h1>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Select value={filterGroup} onValueChange={setFilterGroup}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Chọn trạng thái nhóm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tất cả sinh viên</SelectItem>
                  <SelectItem value="NO_GROUP">Chưa có nhóm</SelectItem>
                </SelectContent>
              </Select>
              <input
                type="text"
                placeholder="Tìm theo tên sinh viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Tìm theo mã sinh viên..."
                value={searchByCode}
                onChange={(e) => setSearchByCode(e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">STT</th>
                  <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Họ và tên</th>
                  <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Mã số sinh viên</th>
                  <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Ngành học</th>
                  <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentStudents.length > 0 ? (
                  currentStudents.map((student, index) => (
                    <tr key={student.id} className="transition-colors duration-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{startIndex + index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{student.fullName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-mono text-sm text-gray-900">{student.studentCode || "N/A"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{student.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          {student.major?.name || "Chưa có"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewStudent(student.id)}
                          className="inline-flex items-center rounded-full p-2 text-gray-400 transition-colors duration-200 hover:bg-blue-50 hover:text-blue-600"
                          title="Xem chi tiết sinh viên"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <p className="text-lg">Không tìm thấy sinh viên nào</p>
                        <p className="mt-1 text-sm">Thử thay đổi từ khóa tìm kiếm</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination - Luôn hiển thị info, chỉ ẩn buttons khi chỉ có 1 trang */}
        {totalElements > 0 && (
          <div className="mt-6 flex items-center justify-between rounded-lg border-t border-gray-200 bg-white px-4 py-3 shadow-sm sm:px-6">
            {totalPages > 1 && (
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Trước
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Sau
                </button>
              </div>
            )}
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị <span className="font-medium">{Math.min(startIndex + 1, totalElements)}</span> đến{" "}
                  <span className="font-medium">{Math.min(endIndex, totalElements)}</span> trong tổng số{" "}
                  <span className="font-medium">{totalElements}</span> sinh viên
                </p>
              </div>
              {totalPages > 1 && (
                <div>
                  <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                      className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span>Trước</span>
                    </button>

                    <span className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
                      Trang {currentPage + 1} / {totalPages}
                    </span>

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                      disabled={currentPage === totalPages - 1}
                      className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span>Sau</span>
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedStudentId && <StudentProfileModal open={isModalOpen} onClose={handleCloseModal} studentId={selectedStudentId} />}
    </div>
  );
};

export default StudentsList;
