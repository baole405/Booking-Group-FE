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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSemesterHook } from "@/hooks/use-semester";
import type { TSemester } from "@/schema/semester.schema";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Edit2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { UpdateSemesterDialog } from "./UpdateSemesterDialog";

interface SemesterDetailDialogProps {
  semester: TSemester | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allSemesters?: TSemester[];
}

export function SemesterDetailDialog({ semester, open, onOpenChange, allSemesters = [] }: SemesterDetailDialogProps) {
  const { useUpdateStatusSemester, useCompleteSemester } = useSemesterHook();
  const queryClient = useQueryClient();
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"activate" | "deactivate" | "complete" | null>(null);
  const [localCompleted, setLocalCompleted] = useState(false);

  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateStatusSemester();
  const { mutate: completeSemester, isPending: isCompleting } = useCompleteSemester();

  const isPending = isUpdatingStatus || isCompleting;

  // Check if there's already an active semester (and it's not the current one)
  const hasActiveSemester = allSemesters.some((s) => s.active && s.id !== semester?.id);

  // Use local state to track completed status for immediate UI update
  const isCompleted = semester?.isComplete || localCompleted;

  const handleConfirmAction = () => {
    if (!semester?.id || !confirmAction) return;

    if (confirmAction === "complete") {
      // Use dedicated complete endpoint
      completeSemester(semester.id, {
        onSuccess: () => {
          toast.success("Đã hoàn thành học kỳ!");
          queryClient.invalidateQueries({ queryKey: ["semesterList"] });
          setConfirmAction(null);
          setLocalCompleted(true); // Update local state to hide buttons immediately
        },
        onError: (error: Error) => {
          const axiosError = error as AxiosError<{ message: string }>;
          const errorMessage = axiosError.response?.data?.message || "Cập nhật thất bại!";
          toast.error(errorMessage);
          setConfirmAction(null);
        },
      });
    } else {
      // activate or deactivate
      updateStatus(semester.id, {
        onSuccess: () => {
          const newStatus = !semester.active;
          toast.success(`Đã ${newStatus ? "kích hoạt" : "ngưng hoạt động"} học kỳ thành công!`);
          queryClient.invalidateQueries({ queryKey: ["semesterList"] });
          setConfirmAction(null);
          onOpenChange(false);
        },
        onError: (error: Error) => {
          const axiosError = error as AxiosError<{ message: string }>;
          const errorMessage = axiosError.response?.data?.message || "Cập nhật thất bại!";
          toast.error(errorMessage);
          setConfirmAction(null);
        },
      });
    }
  };

  const getStatusBadge = () => {
    if (isCompleted) {
      return <Badge className="border-blue-200 bg-blue-100 text-blue-800">Đã hoàn thành</Badge>;
    }
    if (semester?.active) {
      return <Badge className="border-green-200 bg-green-100 text-green-800">Đang hoạt động</Badge>;
    }
    return <Badge className="border-gray-200 bg-gray-100 text-gray-800">Ngưng hoạt động</Badge>;
  };

  const getActionButtons = () => {
    // If completed, no actions
    if (isCompleted) {
      return <div className="text-sm text-gray-500 italic">Học kỳ đã hoàn thành, không thể thay đổi trạng thái</div>;
    }

    // If active, show Complete and Deactivate buttons
    if (semester?.active) {
      return (
        <div className="flex gap-2">
          <Button
            onClick={() => setConfirmAction("complete")}
            disabled={isPending}
            variant="default"
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Hoàn thành
          </Button>
          <Button onClick={() => setConfirmAction("deactivate")} disabled={isPending} variant="destructive" size="sm">
            Ngưng hoạt động
          </Button>
        </div>
      );
    }

    // If inactive, show Activate button (only if no other active semester)
    if (hasActiveSemester) {
      return (
        <Button disabled variant="outline" size="sm" className="cursor-not-allowed">
          Kích hoạt (Đã có HK active)
        </Button>
      );
    }

    return (
      <Button onClick={() => setConfirmAction("activate")} disabled={isPending} variant="default" size="sm">
        Kích hoạt
      </Button>
    );
  };

  const getConfirmMessage = () => {
    if (confirmAction === "complete") {
      return {
        title: "Hoàn thành học kỳ?",
        description: `Học kỳ "${semester?.name}" sẽ được đánh dấu là đã hoàn thành và không thể thay đổi trạng thái sau này. Bạn có chắc chắn muốn tiếp tục?`,
      };
    }
    if (confirmAction === "activate") {
      return {
        title: "Kích hoạt học kỳ?",
        description: `Bạn có chắc chắn muốn kích hoạt học kỳ "${semester?.name}"? Chỉ có một học kỳ hoạt động tại một thời điểm.`,
      };
    }
    if (confirmAction === "deactivate") {
      return {
        title: "Ngưng hoạt động học kỳ?",
        description: `Bạn có chắc chắn muốn ngưng hoạt động học kỳ "${semester?.name}"? Học kỳ này sẽ được chuyển sang trạng thái ngưng hoạt động.`,
      };
    }
    return { title: "", description: "" };
  };

  if (!semester) {
    return null;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chi tiết học kỳ</DialogTitle>
            <DialogDescription>Xem và quản lý thông tin học kỳ.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-right">
                <span className="text-sm font-medium text-gray-500">ID</span>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-gray-900">{semester.id}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-right">
                <span className="text-sm font-medium text-gray-500">Tên học kỳ</span>
              </div>
              <div className="col-span-2">
                <span className="text-sm font-medium text-gray-900">{semester.name}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-right">
                <span className="text-sm font-medium text-gray-500">Trạng thái</span>
              </div>
              <div className="col-span-2">{getStatusBadge()}</div>
            </div>

            {!semester.active && hasActiveSemester && !isCompleted && (
              <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
                <p className="text-sm text-amber-800">
                  <span role="img" aria-label="warning">
                    ⚠️
                  </span>{" "}
                  Không thể kích hoạt vì đã có học kỳ khác đang hoạt động. Vui lòng ngưng hoạt động học kỳ hiện tại trước.
                </p>
              </div>
            )}

            {isCompleted && (
              <div className="rounded-md border border-blue-200 bg-blue-50 p-3">
                <p className="text-center text-sm text-blue-800">
                  <span role="img" aria-label="info">
                    ℹ️
                  </span>{" "}
                  Học kỳ đã hoàn thành. Không thể chỉnh sửa hoặc thay đổi trạng thái.
                </p>
              </div>
            )}
          </div>

          {!isCompleted && (
            <DialogFooter className="flex flex-col gap-4 sm:flex-row sm:justify-between">
              <Button onClick={() => setIsUpdateOpen(true)} variant="outline" size="sm">
                <Edit2 className="mr-2 h-4 w-4" />
                Chỉnh sửa tên
              </Button>
              <div className="flex justify-end gap-2">{getActionButtons()}</div>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{getConfirmMessage().title}</AlertDialogTitle>
            <AlertDialogDescription>{getConfirmMessage().description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction} disabled={isPending}>
              {isPending ? "Đang xử lý..." : "Xác nhận"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Update Name Dialog */}
      {semester && (
        <UpdateSemesterDialog
          semester={semester}
          open={isUpdateOpen}
          onOpenChange={setIsUpdateOpen}
          onUpdateSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["semesterList"] });
          }}
        />
      )}
    </>
  );
}
