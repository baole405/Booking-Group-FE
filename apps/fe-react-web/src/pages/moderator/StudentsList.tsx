import React, { useMemo, useState } from "react";

// Định nghĩa kiểu dữ liệu sinh viên
interface Student {
  id: number;
  name: string;
  studentCode: string;
  email: string;
  major: string;
  year: string;
}

// Dữ liệu mẫu sinh viên
const studentsData: Student[] = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    studentCode: "SE170001",
    email: "anngse170001@fpt.edu.vn",
    major: "Software Engineering",
    year: "K17",
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    studentCode: "SE170002",
    email: "binhttse170002@fpt.edu.vn",
    major: "Software Engineering",
    year: "K17",
  },
  {
    id: 3,
    name: "Lê Văn Cường",
    studentCode: "AI170003",
    email: "cuonglvai170003@fpt.edu.vn",
    major: "Artificial Intelligence",
    year: "K17",
  },
  {
    id: 4,
    name: "Phạm Thị Dung",
    studentCode: "IoT170004",
    email: "dungptiot170004@fpt.edu.vn",
    major: "Internet of Things",
    year: "K17",
  },
  {
    id: 5,
    name: "Hoàng Văn Em",
    studentCode: "SE180005",
    email: "emhvse180005@fpt.edu.vn",
    major: "Software Engineering",
    year: "K18",
  },
  {
    id: 6,
    name: "Vũ Thị Phương",
    studentCode: "AI180006",
    email: "phuongvtai180006@fpt.edu.vn",
    major: "Artificial Intelligence",
    year: "K18",
  },
  {
    id: 7,
    name: "Đặng Văn Giang",
    studentCode: "IoT180007",
    email: "giangdviot180007@fpt.edu.vn",
    major: "Internet of Things",
    year: "K18",
  },
  {
    id: 8,
    name: "Bùi Thị Hoa",
    studentCode: "SE180008",
    email: "hoabtse180008@fpt.edu.vn",
    major: "Software Engineering",
    year: "K18",
  },
  {
    id: 9,
    name: "Dương Văn Inh",
    studentCode: "AI190009",
    email: "inhdvai190009@fpt.edu.vn",
    major: "Artificial Intelligence",
    year: "K19",
  },
  {
    id: 10,
    name: "Lý Thị Khánh",
    studentCode: "SE190010",
    email: "khanhltse190010@fpt.edu.vn",
    major: "Software Engineering",
    year: "K19",
  },
  {
    id: 11,
    name: "Phan Văn Long",
    studentCode: "IoT190011",
    email: "longpviot190011@fpt.edu.vn",
    major: "Internet of Things",
    year: "K19",
  },
  {
    id: 12,
    name: "Ngô Thị Mai",
    studentCode: "SE190012",
    email: "maintse190012@fpt.edu.vn",
    major: "Software Engineering",
    year: "K19",
  },
  {
    id: 13,
    name: "Trịnh Văn Nam",
    studentCode: "AI200013",
    email: "namtvai200013@fpt.edu.vn",
    major: "Artificial Intelligence",
    year: "K20",
  },
  {
    id: 14,
    name: "Cao Thị Oanh",
    studentCode: "SE200014",
    email: "oanhctse200014@fpt.edu.vn",
    major: "Software Engineering",
    year: "K20",
  },
  {
    id: 15,
    name: "Lương Văn Phúc",
    studentCode: "IoT200015",
    email: "phuclviot200015@fpt.edu.vn",
    major: "Internet of Things",
    year: "K20",
  },
];

const StudentsList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchByCode, setSearchByCode] = useState<string>("");

  const itemsPerPage = 10;

  // Lọc danh sách sinh viên theo từ khóa tìm kiếm
  const filteredStudents = useMemo(() => {
    return studentsData.filter((student) => {
      const matchName = student.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCode = student.studentCode.toLowerCase().includes(searchByCode.toLowerCase());
      return matchName && matchCode;
    });
  }, [searchTerm, searchByCode]);

  // Tính toán phân trang
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

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
            <h1 className="text-2xl font-bold text-gray-900">Danh sách sinh viên</h1>

            {/* Search Filters */}
            <div className="flex flex-col gap-3 sm:flex-row">
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
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-mono text-sm text-gray-900">{student.studentCode}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{student.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          {student.major}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() =>
                            alert(
                              `Chi tiết sinh viên:\n\nTên: ${student.name}\nMã SV: ${student.studentCode}\nEmail: ${student.email}\nNgành: ${student.major}\nKhóa: ${student.year}`,
                            )
                          }
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
                  <span className="font-medium">{Math.min(endIndex, filteredStudents.length)}</span> trong tổng số{" "}
                  <span className="font-medium">{filteredStudents.length}</span> sinh viên
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
      </div>
    </div>
  );
};

export default StudentsList;
