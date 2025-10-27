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
import { useMajorHook } from "@/hooks/use-major";
import type { TMajor } from "@/schema/major.schema";
import { useQueryClient } from "@tanstack/react-query";
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

  const handlePreviousPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  };

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
        // Invalidate và refetch để đảm bảo dữ liệu được cập nhật
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

  return (
    <div className="rounded bg-white p-6 shadow">
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Quản lý Ngành học</h1>
      </div>

      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          className="w-full rounded border px-3 py-2 md:w-64"
          placeholder="Tìm kiếm ngành học..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset to first page on search
          }}
        />
        <div className="flex items-center gap-2">
          <select
            className="rounded border px-2 py-2"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as "all" | "active" | "inactive");
              setPage(1); // Reset to first page on filter change
            }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Ngưng hoạt động</option>
          </select>
          <Button size="sm" onClick={() => refetch()} disabled={isLoading}>
            {isLoading ? "Đang tải..." : "Tải lại"}
          </Button>
          <CreateMajorDialog />
        </div>
      </div>

      {isLoading && (
        <div className="py-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
          <p className="mt-2">Đang tải dữ liệu...</p>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          <p className="font-bold">Lỗi</p>
          <p>{error.message}</p>
        </div>
      )}

      {!isLoading && !error && paginatedMajors.length === 0 && <div className="py-8 text-center text-gray-500">Không có dữ liệu ngành học</div>}

      {!isLoading && !error && paginatedMajors.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Tên ngành học</th>
                <th className="border px-4 py-2">Trạng thái</th>
                <th className="border px-4 py-2">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedMajors.map((major) => (
                <tr key={major.id} className="text-center">
                  <td className="border px-4 py-2">{major.id}</td>
                  <td className="border px-4 py-2">{major.name}</td>
                  <td className="border px-4 py-2">
                    <Badge variant={major.active ? "default" : "destructive"}>{major.active ? "Đang hoạt động" : "Ngưng hoạt động"}</Badge>
                  </td>
                  <td className="border px-4 py-2">
                    <div className="flex justify-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleDetailClick(major)}>
                        Chi tiết
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteClick(major)}>
                        Xóa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button size="sm" variant="outline" onClick={handlePreviousPage} disabled={page === 1}>
            Trang trước
          </Button>
          <span className="mx-2">
            Trang {page}/{totalPages}
          </span>
          <Button size="sm" variant="outline" onClick={handleNextPage} disabled={page === totalPages}>
            Trang sau
          </Button>
        </div>
      )}

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
    </div>
  );
}
