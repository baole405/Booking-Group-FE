import { Button } from "@/components/ui/button";
import { useGroupHook } from "@/hooks/use-group";
import { useInviteHook } from "@/hooks/use-invite";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

interface InviteButtonProps {
  userId: number;
  userName: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showIcon?: boolean;
  showText?: boolean;
}

export function InviteButton({
  userId,
  userName,
  variant = "default",
  size = "default",
  className = "",
  showIcon = true,
  showText = true,
}: InviteButtonProps) {
  const { useCreateInvite } = useInviteHook();
  const { useMyGroup } = useGroupHook();
  const { mutate: sendInvite, isPending } = useCreateInvite();
  const { data: myGroupRes } = useMyGroup();
  const myGroup = myGroupRes?.data?.data;

  const handleSendInvite = () => {
    if (!myGroup?.id) {
      toast.error("Bạn chưa có nhóm để mời thành viên");
      return;
    }

    sendInvite(
      {
        groupId: myGroup.id,
        inviteeId: userId,
      },
      {
        onSuccess: () => {
          toast.success(`Đã gửi lời mời đến ${userName}`);
        },
        onError: () => {
          // Reload để đảm bảo data được cập nhật nếu BE đã thực thi
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        },
      },
    );
  };

  return (
    <Button variant={variant} size={size} className={className} onClick={handleSendInvite} disabled={isPending}>
      {showIcon && <UserPlus className="h-4 w-4" />}
      {showText && <span>{showIcon ? " Mời vào nhóm" : "Mời vào nhóm"}</span>}
    </Button>
  );
}
