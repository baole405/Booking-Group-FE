import { Button } from "@/components/ui/button";
import { useState } from "react";

// Fake data for demo
const projects = [
  {
    id: 1,
    group: "Nhóm 1",
    projectName: "Hệ thống quản lý sinh viên",
    status: "Đang thực hiện",
    teacher: "Trần Thị B",
    members: ["Lê Văn C", "Nguyễn Thị F"],
    startDate: "2025-01-10",
    endDate: "2025-06-10",
  },
  {
    id: 2,
    group: "Nhóm 2",
    projectName: "Ứng dụng AI trong giáo dục",
    status: "Đã hoàn thành",
    teacher: "Nguyễn Văn D",
    members: ["Phạm Văn G", "Trần Thị H"],
    startDate: "2024-09-01",
    endDate: "2025-03-01",
  },
  {
    id: 3,
    group: "Nhóm 3",
    projectName: "Phân tích dữ liệu lớn",
    status: "Chờ duyệt",
    teacher: "Phạm Thị E",
    members: ["Nguyễn Văn I", "Lê Thị K"],
    startDate: "2025-02-15",
    endDate: "",
  },
];

export default function ListProjectScreen() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("");

  // Lọc dữ liệu
  const filteredProjects = projects.filter((p) => {
    const matchSearch = p.projectName.includes(search) || p.group.includes(search);
    const matchStatus = statusFilter ? p.status === statusFilter : true;
    const matchTeacher = teacherFilter ? p.teacher === teacherFilter : true;
    return matchSearch && matchStatus && matchTeacher;
  });

  // Lấy danh sách trạng thái, giảng viên duy nhất
  const statuses = Array.from(new Set(projects.map((p) => p.status)));
  const teachers = Array.from(new Set(projects.map((p) => p.teacher)));

  return (
    <div className="rounded bg-white p-6 shadow">
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          className="w-full rounded border px-3 py-2 md:w-64"
          placeholder="Tìm kiếm project hoặc nhóm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          <select className="rounded border px-2 py-2" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Tất cả trạng thái</option>
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
          <select className="rounded border px-2 py-2" value={teacherFilter} onChange={(e) => setTeacherFilter(e.target.value)}>
            <option value="">Tất cả giảng viên</option>
            {teachers.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border px-4 py-2">Tên nhóm</th>
              <th className="border px-4 py-2">Tên project</th>
              <th className="border px-4 py-2">Trạng thái</th>
              <th className="border px-4 py-2">Giảng viên hướng dẫn</th>
              <th className="border px-4 py-2">Thành viên</th>
              <th className="border px-4 py-2">Ngày bắt đầu</th>
              <th className="border px-4 py-2">Ngày kết thúc</th>
              <th className="border px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr key={project.id} className="text-center">
                <td className="border px-4 py-2">{project.group}</td>
                <td className="border px-4 py-2">{project.projectName}</td>
                <td className="border px-4 py-2">{project.status}</td>
                <td className="border px-4 py-2">{project.teacher}</td>
                <td className="border px-4 py-2">{project.members.join(", ")}</td>
                <td className="border px-4 py-2">{project.startDate}</td>
                <td className="border px-4 py-2">{project.endDate || "-"}</td>
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
