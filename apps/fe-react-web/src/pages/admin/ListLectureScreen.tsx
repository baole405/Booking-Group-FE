import { Button } from "@/components/ui/button";
import { useState } from "react";

// Fake data for demo
const lectures = [
  {
    id: 1,
    name: "Trần Thị B",
    email: "lecture01@example.com",
    major: "Công nghệ thông tin",
    groupCount: 3,
    is_active: true,
  },
  {
    id: 2,
    name: "Nguyễn Văn D",
    email: "lecture02@example.com",
    major: "Khoa học máy tính",
    groupCount: 2,
    is_active: false,
  },
  {
    id: 3,
    name: "Phạm Thị E",
    email: "lecture03@example.com",
    major: "Hệ thống thông tin",
    groupCount: 1,
    is_active: true,
  },
];

export default function ListLectureScreen() {
  const [search, setSearch] = useState("");
  const [majorFilter, setMajorFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Lọc dữ liệu
  const filteredLectures = lectures.filter((l) => {
    const matchSearch = l.name.includes(search) || l.email.includes(search);
    const matchMajor = majorFilter ? l.major === majorFilter : true;
    let matchStatus = true;
    if (statusFilter) {
      if (statusFilter === "active") matchStatus = l.is_active;
      else matchStatus = !l.is_active;
    }
    return matchSearch && matchMajor && matchStatus;
  });

  // Lấy danh sách chuyên ngành duy nhất
  const majors = Array.from(new Set(lectures.map((l) => l.major)));

  return (
    <div className="rounded bg-white p-6 shadow">
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          className="w-full rounded border px-3 py-2 md:w-64"
          placeholder="Tìm kiếm giảng viên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          <select className="rounded border px-2 py-2" value={majorFilter} onChange={(e) => setMajorFilter(e.target.value)}>
            <option value="">Tất cả chuyên ngành</option>
            {majors.map((major) => (
              <option key={major} value={major}>
                {major}
              </option>
            ))}
          </select>
          <select className="rounded border px-2 py-2" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Ngưng hoạt động</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-4 py-2">Họ tên</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Chuyên ngành</th>
              <th className="border px-4 py-2">Số nhóm phụ trách</th>
              <th className="border px-4 py-2">Trạng thái</th>
              <th className="border px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredLectures.map((lecture) => (
              <tr key={lecture.id} className="text-center">
                <td className="border px-4 py-2">{lecture.name}</td>
                <td className="border px-4 py-2">{lecture.email}</td>
                <td className="border px-4 py-2">{lecture.major}</td>
                <td className="border px-4 py-2">{lecture.groupCount}</td>
                <td className="border px-4 py-2">
                  <span className={lecture.is_active ? "text-green-600" : "text-gray-400"}>{lecture.is_active ? "Active" : "Inactive"}</span>
                </td>
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
