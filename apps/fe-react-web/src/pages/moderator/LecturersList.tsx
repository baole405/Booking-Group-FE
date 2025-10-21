import LecturerProfileModal from "@/components/dialog/LecturerProfileModal";
import { useUserHook } from "@/hooks/use-user";
import type { TUserListResponse } from "@/schema/user.schema";
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
  const { data, isLoading, error } = useUserList({
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
  // const totalElements = paginationData?.totalElements || 0;
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Render nội dung bảng giảng viên
  let tableContent;
  if (isLoading) {
    tableContent = (
      <tr>
        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
          Đang tải danh sách giảng viên...
        </td>
      </tr>
    );
  } else if (error) {
    tableContent = (
      <tr>
        <td colSpan={6} className="px-6 py-12 text-center text-red-500">
          Lỗi: {error instanceof Error ? error.message : "Không thể tải danh sách"}
        </td>
      </tr>
    );
  } else if (lecturers.length > 0) {
    tableContent = lecturers.map((lecturer, index) => (
      <tr key={lecturer.id} className="transition-colors duration-200 hover:bg-gray-50">
        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{startIndex + index + 1}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">{lecturer.fullName}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="font-mono text-sm text-gray-900">{lecturer.studentCode || "N/A"}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-600">{lecturer.email}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
            {lecturer.major?.name || "Chưa có"}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <button
            onClick={() => handleViewLecturer(lecturer.id)}
            className="inline-flex items-center rounded-full p-2 text-gray-400 transition-colors duration-200 hover:bg-blue-50 hover:text-blue-600"
            title="Xem chi tiết giảng viên"
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
    ));
  } else {
    tableContent = (
      <tr>
        <td colSpan={6} className="px-6 py-12 text-center">
          <div className="text-gray-500">
            <p className="text-lg">Không tìm thấy giảng viên nào</p>
            <p className="mt-1 text-sm">Thử thay đổi từ khóa tìm kiếm</p>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <h1 className="text-2xl font-bold text-gray-900">Danh sách giảng viên</h1>

            {/* Search Filters */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="Tìm theo tên giảng viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Tìm theo mã giảng viên..."
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
                  <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Mã số giảng viên</th>
                  <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Khoa</th>
                  <th className="px-6 py-4 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">{tableContent}</tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between rounded-lg border-t border-gray-200 bg-white px-4 py-3 shadow-sm sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Trước
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Sau
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Hiển thị <span className="font-medium">{startIndex + 1}</span> đến{" "}
                  <span className="font-medium">{Math.min(endIndex, lecturers.length)}</span> trong tổng số{" "}
                  <span className="font-medium">{lecturers.length}</span> giảng viên
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span>Trước</span>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium ${
                        currentPage === page
                          ? "z-10 border-blue-500 bg-blue-50 text-blue-600"
                          : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span>Sau</span>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="mt-4 text-center text-sm text-gray-500">Tổng cộng: {lecturers.length} giảng viên</div>
      </div>

      {/* Modal */}
      {selectedLecturerId && <LecturerProfileModal open={isModalOpen} onClose={handleCloseModal} lecturerId={selectedLecturerId} />}
    </div>
  );
};

export default LecturersList;
