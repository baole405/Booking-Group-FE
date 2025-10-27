import { AdminErrorState, AdminFilterBar, AdminLayout, AdminLoadingState, AdminTableContainer } from "@/components/layout/AdminLayout";
import { UserDetailDialog } from "@/components/dialog/UserDetailDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useUserHook } from "@/hooks/use-user";
import type { TUser } from "@/schema/user.schema";
import { Eye, RefreshCw, Search, Users } from "lucide-react";
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

  const handleUserClick = (id: number) => {
    setSelectedUserId(id);
  };

  const handleDialogClose = () => {
    setSelectedUserId(null);
    refetch();
  };

  const getRoleLabel = (role: string) => {
    const map: Record<string, string> = {
      STUDENT: "Sinh viên",
      LECTURER: "Giảng viên",
      MODERATOR: "Điều hành viên",
      ADMIN: "Quản trị viên",
    };
    return map[role] || role;
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <AdminLayout
      title="Quản lý tài khoản"
      description="Quản lý thông tin tài khoản người dùng trong hệ thống"
      headerActions={
        <Button size="sm" onClick={() => refetch()} disabled={loading}>
          <RefreshCw className={`mr-1 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Tải lại
        </Button>
      }
    >
      {/* Filter Section */}
      <AdminFilterBar>
        <div className="flex flex-1 items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Tìm kiếm tài khoản..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={roleFilter || "all"} onValueChange={(value) => setRoleFilter(value === "all" ? "" : value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả vai trò</SelectItem>
              <SelectItem value="STUDENT">Sinh viên</SelectItem>
              <SelectItem value="LECTURER">Giảng viên</SelectItem>
              <SelectItem value="MODERATOR">Điều hành viên</SelectItem>
              <SelectItem value="ADMIN">Quản trị viên</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value === "all" ? "" : value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Đang hoạt động</SelectItem>
              <SelectItem value="inactive">Ngưng hoạt động</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </AdminFilterBar>

      {/* Content */}
      <AdminTableContainer>
        {loading && <AdminLoadingState />}

        {error && (
          <AdminErrorState
            title="Lỗi tải dữ liệu"
            message={error.message}
            onRetry={() => refetch()}
          />
        )}

        {!loading && !error && (!users || users.length === 0) && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Không có dữ liệu</h3>
            <p className="mt-1 text-sm text-gray-500">Không tìm thấy tài khoản nào phù hợp với bộ lọc</p>
          </div>
        )}

        {!loading && !error && users && users.length > 0 && (
          <>
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead>Mã SV</TableHead>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-center w-24">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((userItem: TUser, index) => (
                  <TableRow key={userItem.id} className="hover:bg-gray-50/50">
                    <TableCell className="text-center text-sm text-gray-500">
                      {(page - 1) * 10 + index + 1}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {userItem.studentCode || "-"}
                    </TableCell>
                    <TableCell className="font-medium">{userItem.fullName}</TableCell>
                    <TableCell className="text-sm text-gray-600">{userItem.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        {getRoleLabel(userItem.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(userItem.isActive)}>
                        {userItem.isActive ? "Hoạt động" : "Tạm khóa"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button size="sm" variant="outline" onClick={() => handleUserClick(userItem.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="border-t bg-gray-50/50 px-6 py-4">
              <div className="flex items-center justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={page === 1 ? undefined : () => setPage(prev => Math.max(prev - 1, 1))}
                        aria-disabled={page === 1}
                        className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    <span className="px-4 py-2 text-sm text-gray-600">
                      Trang {page} / {totalPages}
                    </span>
                    <PaginationItem>
                      <PaginationNext
                        onClick={page >= totalPages ? undefined : () => setPage(prev => Math.min(prev + 1, totalPages))}
                        aria-disabled={page >= totalPages}
                        className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </>
        )}
      </AdminTableContainer>

      {/* User Detail Modal */}
      {selectedUserId && (
        <UserDetailDialog
          userId={selectedUserId}
          open={!!selectedUserId}
          onOpenChange={(open) => !open && handleDialogClose()}
          currentUserRole={user?.role}
        />
      )}
    </AdminLayout>
  );
}
