import React, { useMemo, useState } from "react";

// Định nghĩa kiểu dữ liệu giảng viên
interface Lecturer {
  id: number;
  name: string;
  lecturerCode: string;
  email: string;
  department: string;
  title: string;
}

// Dữ liệu mẫu giảng viên
const lecturersData: Lecturer[] = [
  {
    id: 1,
    name: "Nguyễn Văn Mentor",
    lecturerCode: "GV001",
    email: "mentor1@fpt.edu.vn",
    department: "Software Engineering",
    title: "ThS.",
  },
  {
    id: 2,
    name: "Lê Thị Teacher",
    lecturerCode: "GV002",
    email: "teacher2@fpt.edu.vn",
    department: "Artificial Intelligence",
    title: "TS.",
  },
  {
    id: 3,
    name: "Trần Văn An",
    lecturerCode: "GV003",
    email: "antv@fpt.edu.vn",
    department: "Internet of Things",
    title: "ThS.",
  },
  {
    id: 4,
    name: "Phạm Thị Bình",
    lecturerCode: "GV004",
    email: "binhpt@fpt.edu.vn",
    department: "Software Engineering",
    title: "PGS.TS",
  },
  {
    id: 5,
    name: "Hoàng Văn Cường",
    lecturerCode: "GV005",
    email: "cuonghv@fpt.edu.vn",
    department: "Artificial Intelligence",
    title: "TS.",
  },
  {
    id: 6,
    name: "Vũ Thị Dung",
    lecturerCode: "GV006",
    email: "dungvt@fpt.edu.vn",
    department: "Software Engineering",
    title: "ThS.",
  },
  {
    id: 7,
    name: "Đặng Văn Em",
    lecturerCode: "GV007",
    email: "emdv@fpt.edu.vn",
    department: "Internet of Things",
    title: "PGS.TS",
  },
  {
    id: 8,
    name: "Bùi Thị Phương",
    lecturerCode: "GV008",
    email: "phuongbt@fpt.edu.vn",
    department: "Artificial Intelligence",
    title: "TS.",
  },
  {
    id: 9,
    name: "Dương Văn Giang",
    lecturerCode: "GV009",
    email: "giangdv@fpt.edu.vn",
    department: "Software Engineering",
    title: "ThS.",
  },
  {
    id: 10,
    name: "Lý Thị Hoa",
    lecturerCode: "GV010",
    email: "hoalt@fpt.edu.vn",
    department: "Internet of Things",
    title: "TS.",
  },
  {
    id: 11,
    name: "Phan Văn Inh",
    lecturerCode: "GV011",
    email: "inhpv@fpt.edu.vn",
    department: "Artificial Intelligence",
    title: "PGS.TS",
  },
  {
    id: 12,
    name: "Ngô Thị Khánh",
    lecturerCode: "GV012",
    email: "khanhnt@fpt.edu.vn",
    department: "Software Engineering",
    title: "ThS.",
  },
  {
    id: 13,
    name: "Trịnh Văn Long",
    lecturerCode: "GV013",
    email: "longtv@fpt.edu.vn",
    department: "Internet of Things",
    title: "TS.",
  },
  {
    id: 14,
    name: "Cao Thị Mai",
    lecturerCode: "GV014",
    email: "maict@fpt.edu.vn",
    department: "Artificial Intelligence",
    title: "PGS.TS",
  },
  {
    id: 15,
    name: "Lương Văn Nam",
    lecturerCode: "GV015",
    email: "namlv@fpt.edu.vn",
    department: "Software Engineering",
    title: "ThS.",
  },
];

const LecturersList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchByCode, setSearchByCode] = useState<string>("");

  const itemsPerPage = 10;

  // Lọc danh sách giảng viên theo từ khóa tìm kiếm
  const filteredLecturers = useMemo(() => {
    return lecturersData.filter((lecturer) => {
      const matchName = lecturer.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCode = lecturer.lecturerCode.toLowerCase().includes(searchByCode.toLowerCase());
      return matchName && matchCode;
    });
  }, [searchTerm, searchByCode]);

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredLecturers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLecturers = filteredLecturers.slice(startIndex, endIndex);

  // Reset trang khi tìm kiếm
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, searchByCode]);

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
              <tbody className="divide-y divide-gray-200 bg-white">
                {currentLecturers.length > 0 ? (
                  currentLecturers.map((lecturer, index) => (
                    <tr key={lecturer.id} className="transition-colors duration-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{startIndex + index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{lecturer.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-mono text-sm text-gray-900">{lecturer.lecturerCode}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{lecturer.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                          {lecturer.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() =>
                            alert(
                              `Chi tiết giảng viên:\n\nTên: ${lecturer.name}\nMã GV: ${lecturer.lecturerCode}\nEmail: ${lecturer.email}\nKhoa: ${lecturer.department}\nHọc hàm/học vị: ${lecturer.title}`,
                            )
                          }
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <p className="text-lg">Không tìm thấy giảng viên nào</p>
                        <p className="mt-1 text-sm">Thử thay đổi từ khóa tìm kiếm</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
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
                  <span className="font-medium">{Math.min(endIndex, filteredLecturers.length)}</span> trong tổng số{" "}
                  <span className="font-medium">{filteredLecturers.length}</span> giảng viên
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
        <div className="mt-4 text-center text-sm text-gray-500">Tổng cộng: {filteredLecturers.length} giảng viên</div>
      </div>
    </div>
  );
};

export default LecturersList;
