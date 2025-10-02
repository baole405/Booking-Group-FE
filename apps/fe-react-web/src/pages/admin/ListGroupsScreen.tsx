import { Button } from "@/components/ui/button";
import { useState } from "react";

// Fake data for demo
const groups = [
  {
    id: 1,
    name: "Nhóm 1",
    topic: "Hệ thống quản lý sinh viên",
    status: "Đang hoạt động",
    memberCount: 5,
    teacher: "Trần Thị B",
    class: "CNTT2022",
  },
  {
    id: 2,
    name: "Nhóm 2",
    topic: "Ứng dụng AI trong giáo dục",
    status: "Chờ duyệt",
    memberCount: 4,
    teacher: "Nguyễn Văn D",
    class: "KTPM2022",
  },
  {
    id: 3,
    name: "Nhóm 3",
    topic: "Phân tích dữ liệu lớn",
    status: "Đã hoàn thành",
    memberCount: 6,
    teacher: "Phạm Thị E",
    class: "HTTT2022",
  },
];

export default function ListGroupsScreen() {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("");

  // Lọc dữ liệu
  const filteredGroups = groups.filter((g) => {
    const matchSearch = g.name.includes(search) || g.topic.includes(search);
    const matchClass = classFilter ? g.class === classFilter : true;
    const matchStatus = statusFilter ? g.status === statusFilter : true;
    const matchTeacher = teacherFilter ? g.teacher === teacherFilter : true;
    return matchSearch && matchClass && matchStatus && matchTeacher;
  });

  // Lấy danh sách lớp, trạng thái, giảng viên duy nhất
  const classes = Array.from(new Set(groups.map((g) => g.class)));
  const statuses = Array.from(new Set(groups.map((g) => g.status)));
  const teachers = Array.from(new Set(groups.map((g) => g.teacher)));

  return (
    <div className="rounded bg-white p-6 shadow">
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          className="w-full rounded border px-3 py-2 md:w-64"
          placeholder="Tìm kiếm nhóm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          <select className="rounded border px-2 py-2" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
            <option value="">Tất cả lớp</option>
            {classes.map((cl) => (
              <option key={cl} value={cl}>
                {cl}
              </option>
            ))}
          </select>
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
              <th className="border px-4 py-2">Đề tài</th>
              <th className="border px-4 py-2">Trạng thái</th>
              <th className="border px-4 py-2">Số thành viên</th>
              <th className="border px-4 py-2">Giảng viên phụ trách</th>
              <th className="border px-4 py-2">Lớp</th>
              <th className="border px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredGroups.map((group) => (
              <tr key={group.id} className="text-center">
                <td className="border px-4 py-2">{group.name}</td>
                <td className="border px-4 py-2">{group.topic}</td>
                <td className="border px-4 py-2">{group.status}</td>
                <td className="border px-4 py-2">{group.memberCount}</td>
                <td className="border px-4 py-2">{group.teacher}</td>
                <td className="border px-4 py-2">{group.class}</td>
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
