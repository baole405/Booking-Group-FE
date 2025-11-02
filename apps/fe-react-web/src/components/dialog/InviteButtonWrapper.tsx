import { InviteButton } from "@/components/dialog/InviteButton";
import { useGroupHook } from "@/hooks/use-group";
import { useUserHook } from "@/hooks/use-user";
import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

interface InviteButtonWrapperProps {
  targetUserId: number;
  targetUserName: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showIcon?: boolean;
  showText?: boolean;
}

/**
 * Wrapper component cho InviteButton
 * Chỉ hiển thị nút mời khi:
 * 1. User hiện tại là LEADER của một nhóm
 * 2. Không phải đang xem profile chính mình
 * 3. Người được mời là STUDENT
 * 4. Người được mời CHƯA CÓ NHÓM
 */
export function InviteButtonWrapper({ targetUserId, targetUserName, ...buttonProps }: InviteButtonWrapperProps) {
  const currentUserId = useSelector((s: RootState) => s.user.userId);

  // Lấy thông tin nhóm của user hiện tại
  const { useMyGroup, useGetGroupLeader, useGroupByUserId } = useGroupHook();
  const { data: myGroupData } = useMyGroup();
  const myGroup = myGroupData?.data?.data;

  // Lấy leader của nhóm
  const { data: leaderData } = useGetGroupLeader(myGroup?.id ?? 0);
  const leader = leaderData?.data?.data;

  // Lấy thông tin user được mời để check role
  const { useUserById } = useUserHook();
  const { data: targetUserData } = useUserById(targetUserId);
  const targetUser = targetUserData?.data;

  // Check xem target user có nhóm chưa
  const { data: targetGroupData } = useGroupByUserId(targetUserId);
  const targetHasGroup = !!targetGroupData?.data?.data;

  // Check điều kiện
  const isLeader = currentUserId === leader?.id;
  const isSelf = currentUserId === targetUserId;
  const isTargetStudent = targetUser?.role === "STUDENT";

  // Chỉ hiển thị nút mời nếu:
  // - User hiện tại là leader
  // - Không phải xem chính mình
  // - Có nhóm để mời
  // - Người được mời là student
  // - Người được mời chưa có nhóm
  if (!isLeader || isSelf || !myGroup || !isTargetStudent || targetHasGroup) {
    return null;
  }

  return <InviteButton userId={targetUserId} userName={targetUserName} {...buttonProps} />;
}
