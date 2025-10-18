import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSemesterHook } from "@/hooks/use-semester";
import type { TSemester } from "@/schema/semester.schema";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { UpdateSemesterDialog } from "./UpdateSemesterDialog";

interface SemesterDetailDialogProps {
  semester: TSemester | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SemesterDetailDialog({ semester, open, onOpenChange }: SemesterDetailDialogProps) {
  const { useUpdateStatusSemester } = useSemesterHook();
  const queryClient = useQueryClient();
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const { mutate: updateStatus, isPending } = useUpdateStatusSemester();

  const handleUpdateStatus = () => {
    if (!semester?.id) return;

    updateStatus(semester.id, {
      onSuccess: () => {
        toast.success("Cập nhật trạng thái học kỳ thành công!");
        queryClient.invalidateQueries({ queryKey: ["semesterList"] });
        onOpenChange(false); // Close dialog on success
      },
      onError: (error: Error) => {
        const axiosError = error as AxiosError<{ message: string }>;
        const errorMessage = axiosError.response?.data?.message || "Cập nhật thất bại!";
        toast.error(errorMessage);
      },
    });
  };

  if (!semester) {
    return null;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chi tiết học kỳ</DialogTitle>
            <DialogDescription>Xem thông tin chi tiết và quản lý học kỳ.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-semibold">ID</span>
              <span className="col-span-3">{semester.id}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-semibold">Tên</span>
              <span className="col-span-3">{semester.name}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-semibold">Trạng thái</span>
              <div className="col-span-3">
                <Badge variant={semester.active ? "default" : "destructive"}>{semester.active ? "Đang hoạt động" : "Ngưng hoạt động"}</Badge>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setIsUpdateOpen(true)} variant="default">
              Cập nhật
            </Button>
            <Button onClick={handleUpdateStatus} disabled={isPending} variant="outline">
              {isPending ? "Đang cập nhật..." : "Thay đổi trạng thái"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {semester && (
        <UpdateSemesterDialog
          semester={semester}
          open={isUpdateOpen}
          onOpenChange={setIsUpdateOpen}
          onUpdateSuccess={() => onOpenChange(false)} // Close the detail dialog on successful update
        />
      )}
    </>
  );
}
