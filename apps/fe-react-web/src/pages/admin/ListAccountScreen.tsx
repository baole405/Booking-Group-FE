import { UserDetailDialog } from "@/components/dialog/UserDetailDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUserHook } from "@/hooks/use-user";
import type { TUser } from "@/schema/user.schema";
import { useState } from "react";

export default function ListAccountScreen() {
  const { useUserList, useMyProfile } = useUserHook();
  const { data: profile } = useMyProfile();
  const user = profile?.data;

  // State for filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  // Using the user list hook with params
  const {
    data: userListResponse,
    isLoading: loading,
    error,
    refetch,
  } = useUserList({
    page: page,
    size: 10,
    role: (roleFilter as TUser["role"]) || undefined,
    q: search,
    isActive: statusFilter ? statusFilter === "active" : undefined,
  });

  // Safely handle user data
  const rawContent = userListResponse?.data?.content ?? [];
  const users: TUser[] =
    Array.isArray(rawContent) && rawContent.length > 0 && Array.isArray(rawContent[0])
      ? (rawContent as unknown as TUser[][]).flat()
      : (rawContent as unknown as TUser[]);
  const totalPages = userListResponse?.data?.totalPages ?? 1;

  // Handle pagination button clicks
  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleUserClick = (id: number) => {
    setSelectedUserId(id); // Set the selected user ID
  };

  const handleDialogClose = () => {
    setSelectedUserId(null);
    refetch(); // Refetch the list when the dialog is closed to see updated data
  };

  return (
    <div className="rounded bg-white p-6 shadow">
      {/* Filter and Search Section */}
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
            <option value="STUDENT">Sinh viên</option>
            <option value="LECTURER">Giảng viên</option>
            <option value="MODERATOR">Moderator</option>
            <option value="ADMIN">Admin</option>
          </select>
          <select className="rounded border px-2 py-2" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Ngưng hoạt động</option>
          </select>
          <Button size="sm" onClick={() => refetch()} disabled={loading}>
            Tải lại
          </Button>
        </div>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div className="py-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="mt-2">Đang tải dữ liệu...</p>
        </div>
      )}

      {/* Error Handling */}
      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          <p className="font-bold">Lỗi</p>
          <p>{error.message}</p>
          <Button size="sm" variant="outline" onClick={() => refetch()} className="mt-2">
            Thử lại
          </Button>
        </div>
      )}

      {/* No Data */}
      {!loading && !error && (!users || users.length === 0) && <div className="py-8 text-center text-gray-500">Không có dữ liệu người dùng</div>}

      {/* Users Table */}
      {!loading && !error && users && users.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="border px-4 py-2">Mã SV</th>
                <th className="border px-4 py-2">Họ tên</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Vai trò</th>
                <th className="border px-4 py-2">Trạng thái</th>
                <th className="border px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userItem: TUser) => (
                <tr key={userItem.id} className="text-center hover:bg-gray-50">
                  <td className="border px-4 py-2">{userItem.studentCode || "-"}</td>
                  <td className="border px-4 py-2">{userItem.fullName}</td>
                  <td className="border px-4 py-2">{userItem.email}</td>
                  <td className="border px-4 py-2">{userItem.role}</td>
                  <td className="border px-4 py-2">
                    <Badge variant={userItem.isActive ? "default" : "destructive"}>{userItem.isActive ? "Active" : "Inactive"}</Badge>
                  </td>
                  <td className="border px-4 py-2">
                    <Button size="sm" variant="outline" onClick={() => handleUserClick(userItem.id)}>
                      Xem
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <Button size="sm" variant="outline" onClick={handlePreviousPage} disabled={page === 1}>
          Trang trước
        </Button>
        <span className="mx-2">
          {page}/{totalPages}
        </span>
        <Button size="sm" variant="outline" onClick={handleNextPage} disabled={page === totalPages}>
          Trang sau
        </Button>
      </div>

      {/* User Detail Modal */}
      {selectedUserId && (
        <UserDetailDialog
          userId={selectedUserId}
          open={!!selectedUserId}
          onOpenChange={(open) => !open && handleDialogClose()}
          currentUserRole={user?.role}
        />
      )}
    </div>
  );
}
