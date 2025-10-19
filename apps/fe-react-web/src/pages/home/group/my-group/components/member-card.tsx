import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Crown, User, UserMinus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type MemberCardProps = {
  user: {
    id: number;
    fullName: string;
    studentCode?: string | null;
    avatarUrl?: string | null;
  };
  isLeader: boolean;
  isCurrentUser?: boolean;
  onViewProfile?: (id: number) => void;
  onKick?: (id: number) => void;
  onTransferLeader?: (id: number) => void;
};

const getInitials = (name?: string | null) =>
  (name ?? "")
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

export function MemberCard({
  user,
  isLeader,
  isCurrentUser,
  onViewProfile,
  onKick,
  onTransferLeader,
}: MemberCardProps) {
  // ⚙️ State cho hai hộp thoại xác nhận
  const [openKickDialog, setOpenKickDialog] = useState(false);
  const [openTransferDialog, setOpenTransferDialog] = useState(false);

  return (
    <div className="rounded-lg border bg-muted/20 p-3 transition-colors hover:bg-muted/40">
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={user.avatarUrl ?? undefined} alt={user.fullName} />
          <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="truncate font-medium">{user.fullName}</div>
          <div className="text-muted-foreground mt-1 text-xs">
            {user.studentCode?.trim() || "—"}
          </div>
        </div>

        {/* Menu hành động */}
        {!isCurrentUser && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* Xem hồ sơ */}
              <DropdownMenuItem onClick={() => onViewProfile?.(user.id)}>
                <User className="mr-2 h-4 w-4" />
                Xem hồ sơ
              </DropdownMenuItem>

              {isLeader && (
                <>
                  {/* Mở xác nhận xóa */}
                  <DropdownMenuItem onClick={() => setOpenKickDialog(true)}>
                    <UserMinus className="mr-2 h-4 w-4 text-red-500" />
                    Xóa khỏi nhóm
                  </DropdownMenuItem>

                  {/* Mở xác nhận chỉ định leader */}
                  <DropdownMenuItem onClick={() => setOpenTransferDialog(true)}>
                    <Crown className="mr-2 h-4 w-4 text-yellow-500" />
                    Chỉ định làm trưởng nhóm
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* ⚠️ Hộp thoại xác nhận xóa */}
      <AlertDialog open={openKickDialog} onOpenChange={setOpenKickDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Xác nhận xóa thành viên khỏi nhóm
            </AlertDialogTitle>
            <p className="text-sm text-muted-foreground">
              Bạn có chắc muốn xóa <b>{user.fullName}</b> khỏi nhóm không?
              <br />
              Hành động này không thể hoàn tác.
            </p>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await onKick?.(user.id);
                setOpenKickDialog(false);
              }}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Xác nhận xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ⚠️ Hộp thoại xác nhận chuyển leader */}
      <AlertDialog open={openTransferDialog} onOpenChange={setOpenTransferDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Xác nhận chỉ định trưởng nhóm
            </AlertDialogTitle>
            <p className="text-sm text-muted-foreground">
              Bạn có chắc muốn chuyển quyền trưởng nhóm cho{" "}
              <b>{user.fullName}</b> không?
              <br />
              Sau khi xác nhận, bạn sẽ mất quyền leader.
            </p>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await onTransferLeader?.(user.id);
                setOpenTransferDialog(false);
              }}
              className="bg-yellow-500 text-white hover:bg-yellow-600"
            >
              Xác nhận chỉ định
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
