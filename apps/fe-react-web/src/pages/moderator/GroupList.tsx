import GroupCreateModal from "@/components/dialog/GroupCreateModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGroupHook } from "@/hooks/use-group";
import { useSemesterList } from "@/hooks/use-semester";
import type { TGroup } from "@/schema/group.schema";
import { Eye, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

export default function GroupList() {
  const navigate = useNavigate();
  const { useGroupList } = useGroupHook();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<number | undefined>();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const itemsPerPage = 10;
  const { data: semesters, isLoading: loadingSemester } = useSemesterList();

  // ✅ chọn mặc định kỳ đầu tiên khi có dữ liệu
  useEffect(() => {
    if (!loadingSemester && semesters && semesters.length > 0 && !selectedSemester) {
      setSelectedSemester(semesters[0].id);
    }
  }, [loadingSemester, semesters, selectedSemester]);

  // ✅ gọi hook danh sách nhóm
  const {
    data: groupResponse,
    isLoading,
    error,
  } = useGroupList(
    {
      page: currentPage,
      size: itemsPerPage,
      sort: "id",
      dir: "asc",
      q: searchTerm,
      type: null,
      status: null,
    },
    Boolean(selectedSemester), // chỉ gọi API khi có kỳ được chọn
  );

  const groupData = groupResponse?.data?.data;
  const groups: TGroup[] = Array.isArray(groupData?.content) ? groupData.content : [];

  const totalPages = groupData?.totalPages ?? 1;
  const totalElements = groupData?.totalElements ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header & Filter */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            {/* Select semester */}
            <select
              className="rounded-md border px-2 py-1 text-sm"
              value={selectedSemester ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedSemester(val ? Number(val) : undefined);
                setCurrentPage(1);
              }}
              disabled={loadingSemester}
            >
              {loadingSemester ? (
                <option>Đang tải...</option>
              ) : (
                <>
                  <option value="">-- Tất cả học kỳ --</option>
                  {semesters?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </>
              )}
            </select>

            {/* Search */}
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Tìm kiếm nhóm..."
                className="w-56 pl-9"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* Create button */}
          <Button
            size="sm"
            onClick={() => setIsCreateDialogOpen(true)}
            disabled={!selectedSemester}
            title={!selectedSemester ? "Vui lòng chọn học kỳ trước" : "Tạo nhóm rỗng"}
          >
            <Plus className="mr-1 size-4" /> Tạo nhóm
          </Button>
        </div>

        {/* Table section */}
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead className="w-12 text-center">#</TableHead>
                <TableHead>Tên nhóm</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Học kỳ</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={8} className="py-6 text-center text-gray-500">
                    Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              )}

              {error && (
                <TableRow>
                  <TableCell colSpan={8} className="py-6 text-center text-red-500">
                    Lỗi tải dữ liệu nhóm
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && !error && groups.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-6 text-center text-gray-500">
                    Không tìm thấy nhóm nào
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                !error &&
                groups.map((group, idx) => (
                  <TableRow key={group.id} className="hover:bg-gray-50">
                    <TableCell className="text-center">{(currentPage - 1) * itemsPerPage + idx + 1}</TableCell>
                    <TableCell className="font-medium">{group.title}</TableCell>
                    <TableCell className="max-w-[220px] truncate">{group.description}</TableCell>
                    <TableCell>{group.semester?.name ?? ""}</TableCell>
                    <TableCell>{getTypeLabel(group.type)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(group.status)}>{getStatusLabel(group.status)}</Badge>
                    </TableCell>
                    <TableCell>{group.createdAt ? new Date(group.createdAt).toLocaleDateString("vi-VN") : ""}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="outline" size="icon" onClick={() => navigate(`/moderator/home/groups/${group.id}`)}>
                        <Eye className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
              Trước
            </Button>
            <span className="text-sm text-gray-600">
              Trang {currentPage} / {totalPages} ({totalElements} nhóm)
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Sau
            </Button>
          </div>
        )}

        {/* Create Modal */}
        {selectedSemester && (
          <GroupCreateModal open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} semesterId={selectedSemester} />
        )}
      </div>
    </div>
  );
}
