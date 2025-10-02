import { Button } from "@/components/ui/button";
import { useState } from "react";

// Fake data for demo
const students = [
  {
    id: 1,
    name: "Lê Văn C",
    mssv: "SV001",
    email: "student01@example.com",
    major: "Công nghệ thông tin",
    enrollment: "Đang học",
  },
  {
    id: 2,
    name: "Nguyễn Thị F",
    mssv: "SV002",
    email: "student02@example.com",
    major: "Khoa học máy tính",
    enrollment: "Tạm dừng",
  },
  {
    id: 3,
    name: "Phạm Văn G",
    mssv: "SV003",
    email: "student03@example.com",
    major: "Hệ thống thông tin",
    enrollment: "Đang học",
  },
];

export default function ListStudentScreen() {
  const [search, setSearch] = useState("");
  const [majorFilter, setMajorFilter] = useState("");
  const [enrollmentFilter, setEnrollmentFilter] = useState("");

  // Lọc dữ liệu
  const filteredStudents = students.filter((s) => {
    const matchSearch = s.name.includes(search) || s.mssv.includes(search) || s.email.includes(search);
    const matchMajor = majorFilter ? s.major === majorFilter : true;
    const matchEnrollment = enrollmentFilter ? s.enrollment === enrollmentFilter : true;
    return matchSearch && matchMajor && matchEnrollment;
  });

  // Lấy danh sách ngành duy nhất
  const majors = Array.from(new Set(students.map((s) => s.major)));
  // Lấy danh sách enrollment duy nhất
  const enrollments = Array.from(new Set(students.map((s) => s.enrollment)));

  return (
    <div className="rounded bg-white p-6 shadow">
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          className="w-full rounded border px-3 py-2 md:w-64"
          placeholder="Tìm kiếm sinh viên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          <select className="rounded border px-2 py-2" value={majorFilter} onChange={(e) => setMajorFilter(e.target.value)}>
            <option value="">Tất cả ngành</option>
            {majors.map((major) => (
              <option key={major} value={major}>
                {major}
              </option>
            ))}
          </select>
          <select className="rounded border px-2 py-2" value={enrollmentFilter} onChange={(e) => setEnrollmentFilter(e.target.value)}>
            <option value="">Tất cả tình trạng</option>
            {enrollments.map((en) => (
              <option key={en} value={en}>
                {en}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-4 py-2">Họ tên</th>
              <th className="border px-4 py-2">MSSV</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Ngành học</th>
              <th className="border px-4 py-2">Tình trạng</th>
              <th className="border px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className="text-center">
                <td className="border px-4 py-2">{student.name}</td>
                <td className="border px-4 py-2">{student.mssv}</td>
                <td className="border px-4 py-2">{student.email}</td>
                <td className="border px-4 py-2">{student.major}</td>
                <td className="border px-4 py-2">{student.enrollment}</td>
                <td className="flex justify-center gap-2 border px-4 py-2">
                  <Button size="sm" variant="outline">
                    Chi tiết
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination placeholder */}
      <div className="mt-4 flex justify-end">
        <Button size="sm" variant="outline">
          Trang trước
        </Button>
        <span className="mx-2">1/1</span>
        <Button size="sm" variant="outline">
          Trang sau
        </Button>
      </div>
    </div>
  );
}
