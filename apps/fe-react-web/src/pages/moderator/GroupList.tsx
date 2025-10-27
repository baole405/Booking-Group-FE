import { AdminErrorState, AdminFilterBar, AdminLayout, AdminLoadingState, AdminTableContainer } from "@/components/layout/AdminLayout";
import GroupCreateModal from "@/components/dialog/GroupCreateModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDebounce } from "@/hooks/use-debounce";
import { useGroupHook } from "@/hooks/use-group";
import { useSemesterHook } from "@/hooks/use-semester";
import type { TGroup } from "@/schema/group.schema";
import { Eye, Plus, RefreshCw, Search, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// 🟣 Helper
const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-800 border-green-200";
    case "FORMING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "LOCKED":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "";
  }
};

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    ACTIVE: "Hoạt động",
    FORMING: "Đang hình thành",
    LOCKED: "Đã khóa",
  };
  return map[status] || status;
};

const getTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    PUBLIC: "Nhóm công khai",
    PRIVATE: "Nhóm riêng tư",
  };
  return map[type] || type;
};

// 🟢 Component chính
export default function GroupList() {
  const navigate = useNavigate();
  const { useGroupList } = useGroupHook();
  const { useSemesterList } = useSemesterHook();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const itemsPerPage = 10;

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // 🟣 Gọi API danh sách nhóm
  const {
    data: groupResponse,
    isLoading,
    error,
    refetch,
  } = useGroupList({
    page: currentPage,
    size: itemsPerPage,
    sort: "id",
    dir: "asc",
    q: debouncedSearchTerm,
    semesterId: selectedSemester ? Number(selectedSemester) : null,
    type: null,
    status: null,
  });

  const { data: semesterResponse } = useSemesterList();
  const semesters = semesterResponse?.data?.data ?? [];

  const groupData = groupResponse?.data?.data;
  const groups: TGroup[] = Array.isArray(groupData?.content) ? groupData.content : [];
  const totalPages = groupData?.totalPages ?? 1;

  return (
    <AdminLayout
      title="Quản lý nhóm sinh viên"
      description="Quản lý và theo dõi các nhóm sinh viên trong hệ thống"
      headerActions={
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`mr-1 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Tải lại
          </Button>
          <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-1 h-4 w-4" />
            Tạo nhóm
          </Button>
        </div>
      }
    >
      {/* Filter Section */}
      <AdminFilterBar>
        <div className="flex flex-1 items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Tìm kiếm nhóm..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <Select
            value={selectedSemester ?? "all"}
            onValueChange={(value) => {
              setSelectedSemester(value === "all" ? null : value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Lọc theo học kỳ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả học kỳ</SelectItem>
              {semesters
                .filter((semester) => semester.id)
                .map((semester) => (
                  <SelectItem key={semester.id} value={String(semester.id)}>
                    {semester.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </AdminFilterBar>

      {/* Content */}
      <AdminTableContainer>
        {isLoading && <AdminLoadingState />}

        {error && (
          <AdminErrorState
            title="Lỗi tải dữ liệu"
            message="Không thể tải danh sách nhóm. Vui lòng thử lại."
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !error && groups.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Không có nhóm nào</h3>
            <p className="mt-1 text-sm text-gray-500">Không tìm thấy nhóm nào phù hợp với bộ lọc</p>
            <Button className="mt-4" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="mr-1 h-4 w-4" />
              Tạo nhóm đầu tiên
            </Button>
          </div>
        )}

        {!isLoading && !error && groups.length > 0 && (
          <>
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead>Tên nhóm</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Học kỳ</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-center w-24">Thao tác</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {groups.map((group, idx) => (
                  <TableRow key={group.id} className="hover:bg-gray-50/50">
                    <TableCell className="text-center text-sm text-gray-500">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </TableCell>
                    <TableCell className="font-medium">{group.title}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm text-gray-600">
                      {group.description || "-"}
                    </TableCell>
                    <TableCell className="text-sm">{group.semester?.name ?? "-"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium">
                        {getTypeLabel(group.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(group.status)}>
                        {getStatusLabel(group.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {group.createdAt ? new Date(group.createdAt).toLocaleDateString("vi-VN") : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/moderator/groups/${group.id}`)}
                      >
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
                        onClick={currentPage === 1 ? undefined : () => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        aria-disabled={currentPage === 1}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    <span className="px-4 py-2 text-sm text-gray-600">
                      Trang {currentPage} / {totalPages}
                    </span>
                    <PaginationItem>
                      <PaginationNext
                        onClick={currentPage >= totalPages ? undefined : () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        aria-disabled={currentPage >= totalPages}
                        className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </>
        )}
      </AdminTableContainer>

      {/* Create Group Modal */}
      <GroupCreateModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          setCurrentPage(1);
          refetch();
        }}
        semesterId={selectedSemester ? Number(selectedSemester) : 1}
      />
    </AdminLayout>
  );
}
