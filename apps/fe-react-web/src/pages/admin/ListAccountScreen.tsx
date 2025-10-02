import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

// Fake data for demo
const users = [
  {
    id: 1,
    username: "admin01",
    name: "Nguyễn Văn A",
    email: "admin01@example.com",
    role: "Admin",
    is_active: true,
  },
  {
    id: 2,
    username: "lecture01",
    name: "Trần Thị B",
    email: "lecture01@example.com",
    role: "Giảng viên",
    is_active: false,
  },
  {
    id: 3,
    username: "student01",
    name: "Lê Văn C",
    email: "student01@example.com",
    role: "Sinh viên",
    is_active: true,
  },
];

export default function ListAccountScreen() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Filter logic (simple demo)
  const filteredUsers = users.filter((u) => {
    const matchSearch = u.username.includes(search) || u.name.includes(search) || u.email.includes(search);
    const matchRole = roleFilter ? u.role === roleFilter : true;
    let matchStatus = true;
    if (statusFilter) {
      if (statusFilter === "active") matchStatus = u.is_active;
      else matchStatus = !u.is_active;
    }
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div className="rounded bg-white p-6 shadow">
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          className="w-full rounded border px-3 py-2 md:w-64"
          placeholder="Tìm kiếm tài khoản..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          <select className="rounded border px-2 py-2" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">Tất cả vai trò</option>
            <option value="Admin">Admin</option>
            <option value="Giảng viên">Giảng viên</option>
            <option value="Sinh viên">Sinh viên</option>
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
              <th className="border px-4 py-2">Tên đăng nhập</th>
              <th className="border px-4 py-2">Họ tên</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Vai trò</th>
              <th className="border px-4 py-2">Trạng thái</th>
              <th className="border px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="text-center">
                <td className="border px-4 py-2">{user.username}</td>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.role}</td>
                <td className="border px-4 py-2">
                  <Switch checked={user.is_active} />
                </td>
                <td className="flex justify-center gap-2 border px-4 py-2">
                  <Button size="sm" variant="outline">
                    Sửa
                  </Button>
                  <Button size="sm" variant="destructive">
                    Xóa
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
