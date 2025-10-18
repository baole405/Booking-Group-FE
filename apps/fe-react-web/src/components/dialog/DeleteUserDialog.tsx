import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUserHook } from "@/hooks/use-user";
import type { RootState } from "@/redux/store";
import type { TUser } from "@/schema/user.schema";
import { useSelector } from "react-redux";
import { toast } from "sonner";

interface DeleteUserDialogProps {
  user: TUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function DeleteUserDialog({ user, open, onOpenChange, onSuccess }: DeleteUserDialogProps) {
  const { role: currentUserRole } = useSelector((state: RootState) => state.user);
  const { useUpdateStatus } = useUserHook();
  const { mutate: deleteUser, isPending } = useUpdateStatus(user.id);

  // Chỉ cho phép admin xóa người dùng
  const canDelete = currentUserRole === "ADMIN";

  const handleDelete = async () => {
    if (!canDelete) return;

    try {
      await deleteUser();
      toast.success("Xóa người dùng thành công");
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Có lỗi xảy ra khi xóa người dùng");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xóa người dùng</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa người dùng này?
            <div className="mt-4 rounded-lg border p-4">
              <div className="grid gap-2">
                <div>
                  <span className="font-medium">Họ và tên:</span> {user.fullName}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {user.email}
                </div>
                <div>
                  <span className="font-medium">MSSV:</span> {user.studentCode || "Không có"}
                </div>
                <div>
                  <span className="font-medium">Vai trò:</span> {user.role}
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={!canDelete || isPending}>
            {isPending ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
