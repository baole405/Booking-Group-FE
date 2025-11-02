import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useGroupHook } from "@/hooks/use-group";
import { useUserHook } from "@/hooks/use-user";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type AddMemberDialogProps = {
  groupId: number;
  groupName: string;
  children: React.ReactNode;
};

export function AddMemberDialog({ groupId, groupName, children }: AddMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { useUsersNoGroup } = useUserHook();
  const { useAddMemberToGroup } = useGroupHook();

  const { data: usersNoGroupRes, isPending: isLoadingUsers } = useUsersNoGroup();
  const users = usersNoGroupRes?.data?.filter((user) => user.role === "STUDENT") ?? [];

  const { mutate: addMember, isPending: isAdding } = useAddMemberToGroup();

  const handleAddMember = () => {
    if (!selectedUserId) {
      toast.warning("Vui lòng chọn một sinh viên để thêm.");
      return;
    }
    const selectedUser = users.find((u) => u.id.toString() === selectedUserId);
    if (!selectedUser) {
      toast.error("Không tìm thấy thông tin sinh viên đã chọn.");
      return;
    }

    addMember(
      { groupId, userId: selectedUser.id },
      {
        onSuccess: () => {
          toast.success(`Đã thêm "${selectedUser.fullName}" vào nhóm "${groupName}".`);
          setSelectedUserId(null);
          setOpen(false);
        },
        onError: (error: unknown) => {
          console.error("Failed to add member:", error);
          const err = error as { response?: { data?: { message?: string } } };
          toast.error(err?.response?.data?.message || "Thêm thành viên thất bại. Vui lòng thử lại.");
        },
      },
    );
  };

  const userOptions = users.map((user) => ({
    value: user.id.toString(),
    label: user.fullName,
    data: user,
  }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm thành viên vào nhóm</DialogTitle>
          <DialogDescription>Chọn một sinh viên chưa có nhóm để thêm vào "{groupName}".</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoadingUsers ? (
            <div className="text-muted-foreground flex items-center justify-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Đang tải danh sách sinh viên...</span>
            </div>
          ) : (
            <Combobox
              options={userOptions}
              onSelect={(_value, data) => {
                setSelectedUserId(data.id.toString());
              }}
              selectedValue={selectedUserId ?? undefined}
              placeholder="Tìm và chọn sinh viên..."
              searchPlaceholder="Nhập tên hoặc email..."
              emptyPlaceholder="Không tìm thấy sinh viên nào."
            />
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isAdding}>
            Hủy
          </Button>
          <Button onClick={handleAddMember} disabled={isAdding || !selectedUserId}>
            {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
