import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTeacherCheckpointsHook } from "@/hooks/use-teacher-checkpoints";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AssignTeacherDialogProps {
  groupId: number;
  groupName: string;
  currentGroupStatus?: string;
  children?: React.ReactNode;
}

export const AssignTeacherDialog: React.FC<AssignTeacherDialogProps> = ({ groupId, groupName, currentGroupStatus, children }) => {
  const [open, setOpen] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  const queryClient = useQueryClient();

  const { useTeacherList, useAssignTeacherToGroup } = useTeacherCheckpointsHook();

  const { data: teachersData, isLoading: isLoadingTeachers } = useTeacherList();
  const { mutate: assignTeacher, isPending: isAssigning } = useAssignTeacherToGroup();

  const teachers = teachersData?.data?.data || [];

  const handleAssignTeacher = () => {
    if (!selectedTeacherId) {
      toast.error("Vui lòng chọn giảng viên");
      return;
    }

    const teacherId = parseInt(selectedTeacherId);

    assignTeacher(
      { groupId, teacherId },
      {
        onSuccess: (response) => {
          if (response.data?.status === 200) {
            toast.success("Đã gán giảng viên thành công!");
            queryClient.invalidateQueries({ queryKey: ["groupById", groupId] });
            queryClient.invalidateQueries({ queryKey: ["rejectedGroups"] });
            queryClient.invalidateQueries({ queryKey: ["groupMembers", groupId] });
            setOpen(false);
            setSelectedTeacherId("");
          } else {
            toast.error(response.data?.message || "Không thể gán giảng viên");
          }
        },
        onError: (error: unknown) => {
          const axiosError = error as {
            response?: { data?: { message?: string } };
            message?: string;
          };
          const errorMessage = axiosError?.response?.data?.message || axiosError?.message || "Không thể gán giảng viên cho nhóm";
          toast.error(errorMessage);
        },
      },
    );
  };

  const getDialogDescription = () => {
    return `Chọn giảng viên để gán trực tiếp cho nhóm "${groupName}". Hệ thống sẽ tự động cân bằng số lượng nhóm giữa các giảng viên trong cùng học kỳ.`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            Assign Teacher
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Gán giảng viên cho nhóm</DialogTitle>
          <DialogDescription className="space-y-2">{getDialogDescription()}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Group Info */}
          <div className="space-y-2">
            <Label>Nhóm</Label>
            <div className="rounded-md border px-3 py-2 text-sm">
              <p className="font-medium">{groupName}</p>
              {currentGroupStatus && <p className="text-muted-foreground mt-1 text-xs">Trạng thái: {currentGroupStatus}</p>}
            </div>
          </div>

          {/* Teacher Selection */}
          <div className="space-y-2">
            <Label htmlFor="teacher">
              Chọn giảng viên <span className="text-red-500">*</span>
            </Label>
            {isLoadingTeachers && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2 text-sm">Đang tải danh sách giảng viên...</span>
              </div>
            )}

            {!isLoadingTeachers && teachers.length === 0 && (
              <div className="text-muted-foreground rounded-md border border-dashed px-3 py-4 text-center text-sm">Không có giảng viên</div>
            )}

            {!isLoadingTeachers && teachers.length > 0 && (
              <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}>
                <SelectTrigger id="teacher">
                  <SelectValue placeholder="Chọn giảng viên" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id.toString()}>
                      <div className="flex flex-col">
                        <span className="font-medium">{teacher.fullName}</span>
                        <span className="text-muted-foreground text-xs">{teacher.email}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Info box */}
          <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
            <p className="font-medium">
              <span role="img" aria-label="Info">
                ℹ️
              </span>{" "}
              Lưu ý:
            </p>
            <p className="mt-1">
              Hệ thống sẽ <strong>gán trực tiếp</strong> giảng viên cho nhóm mà không cần chờ phê duyệt. Số lượng nhóm sẽ được tự động cân bằng giữa
              các giảng viên trong cùng học kỳ.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              setSelectedTeacherId("");
            }}
          >
            Hủy
          </Button>
          <Button onClick={handleAssignTeacher} disabled={!selectedTeacherId || isAssigning || isLoadingTeachers}>
            {isAssigning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang gán...
              </>
            ) : (
              "Gán giảng viên"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
