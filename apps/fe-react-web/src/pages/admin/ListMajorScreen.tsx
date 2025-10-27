import { AdminErrorState, AdminFilterBar, AdminLayout, AdminLoadingState, AdminTableContainer } from "@/components/layout/AdminLayout";
import { CreateMajorDialog } from "@/components/dialog/CreateMajorDialog";
import { MajorDetailDialog } from "@/components/dialog/MajorDetailDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useMajorHook } from "@/hooks/use-major";
import type { TMajor } from "@/schema/major.schema";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, GraduationCap, RefreshCw, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ListMajorScreen() {
  const { useMajorList, useDeleteMajor } = useMajorHook();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [page, setPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [majorToDelete, setMajorToDelete] = useState<TMajor | null>(null);
  const [selectedMajor, setSelectedMajor] = useState<TMajor | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const itemsPerPage = 10;

  const { data: majorListResponse, isLoading, error, refetch } = useMajorList();
  const { mutate: deleteMajor, isPending: isDeleting } = useDeleteMajor();

  // Safely handle majors data
  const majors: TMajor[] = majorListResponse?.data?.data ?? [];

  // Client-side filtering
  const filteredMajors = majors
    .filter((major) => {
      const matchesSearch = major.name.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || (statusFilter === "active" && major.active) || (statusFilter === "inactive" && !major.active);
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => b.id - a.id);

  // Client-side pagination
  const totalPages = Math.ceil(filteredMajors.length / itemsPerPage);
  const paginatedMajors = filteredMajors.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleDeleteClick = (major: TMajor) => {
    setMajorToDelete(major);
    setDeleteDialogOpen(true);
  };

  const handleDetailClick = (major: TMajor) => {
    setSelectedMajor(major);
    setIsDetailOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!majorToDelete) return;

    deleteMajor(majorToDelete.id, {
      onSuccess: () => {
        toast.success(`Đã xóa ngành học "${majorToDelete.name}" thành công!`);
        queryClient.invalidateQueries({ queryKey: ["majorList"] });
        refetch();
        setDeleteDialogOpen(false);
        setMajorToDelete(null);
      },
      onError: (error: Error) => {
        toast.error(`Xóa ngành học thất bại: ${error.message}`);
      },
    });
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <AdminLayout
      title="Quản lý ngành học"
      description="Quản lý thông tin các ngành học trong hệ thống"
      headerActions={
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`mr-1 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Tải lại
          </Button>
          <CreateMajorDialog />
        </div>
      }
    >
      {/* Filter Section */}
      <AdminFilterBar>
        <div className="flex flex-1 items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Tìm kiếm ngành học..."
              className="pl-9"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <Select value={statusFilter} onValueChange={(value: "all" | "active" | "inactive") => {
            setStatusFilter(value);
            setPage(1);
          }}>
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
        {isLoading && <AdminLoadingState />}

        {error && (
          <AdminErrorState
            title="Lỗi tải dữ liệu"
            message={error.message}
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !error && paginatedMajors.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <GraduationCap className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Không có dữ liệu</h3>
            <p className="mt-1 text-sm text-gray-500">Không tìm thấy ngành học nào phù hợp với bộ lọc</p>
            <CreateMajorDialog />
          </div>
        )}

        {!isLoading && !error && paginatedMajors.length > 0 && (
          <>
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="w-20 text-center">ID</TableHead>
                  <TableHead>Tên ngành học</TableHead>
                  <TableHead className="w-32 text-center">Trạng thái</TableHead>
                  <TableHead className="w-40 text-center">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedMajors.map((major) => (
                  <TableRow key={major.id} className="hover:bg-gray-50/50">
                    <TableCell className="text-center font-mono text-sm text-gray-500">
                      {major.id}
                    </TableCell>
                    <TableCell className="font-medium">{major.name}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={getStatusColor(major.active)}>
                        {major.active ? "Hoạt động" : "Tạm khóa"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleDetailClick(major)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteClick(major)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
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
            )}
          </>
        )}
      </AdminTableContainer>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa ngành học</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa ngành học <strong>"{majorToDelete?.name}"</strong>? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>



      {/* Major Detail Dialog */}
      <MajorDetailDialog major={selectedMajor} open={isDetailOpen} onOpenChange={setIsDetailOpen} onUpdateSuccess={refetch} />
    </AdminLayout>
  );
}
