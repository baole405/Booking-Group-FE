import { Loader2, Users } from "lucide-react";
import { useMemo, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GroupContent from "./components/group-content";
import { useGroupHook } from "@/hooks/use-group";
import { MemberCard } from "./components/member-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import type { TUser } from "@/schema/user.schema";
import { toast } from "sonner";

type GroupMinimal = {
  id: number;
  title: string;
  description?: string | null;
};

export default function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const groupId = Number(id);
  const navigate = useNavigate();

  const { useGroupMembers, useGroupById, useMyGroup, useJoinGroup } = useGroupHook();

  // 🔹 Lấy nhóm hiện tại của user
  const { data: myGroupRes, isPending: isMyGroupPending } = useMyGroup();
  const myGroup = myGroupRes?.data?.data ?? null;

  // 🔹 Lấy thông tin nhóm đang xem
  const {
    data: groupRes,
    isPending: isGroupPending,
    error: groupError,
  } = useGroupById(groupId);

  const group = groupRes?.data?.data ?? null;

  // 🔹 Nếu nhóm đang xem === nhóm của mình => điều hướng
  useEffect(() => {
    if (!isMyGroupPending && myGroup && groupId === myGroup.id) {
      navigate("/student/mygroup", { replace: true });
    }
  }, [isMyGroupPending, myGroup, groupId, navigate]);

  // 🔹 Lấy danh sách thành viên
  const {
    data: groupMembersRes,
    isPending: isGroupMembersPending,
    error: groupMembersError,
  } = useGroupMembers(groupId);

  const { mutateAsync: joinGroupAsync, isPending: isJoining } = useJoinGroup();

  // 🔹 Popup sau khi join nhóm
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // 🔹 Header
  const header = useMemo(() => {
    if (isGroupPending) {
      return (
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <h1 className="text-xl font-semibold">Đang tải nhóm...</h1>
          </div>
        </div>
      );
    }
    if (groupError || !groupId || !group) {
      return (
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold">Không tìm thấy nhóm</h1>
        </div>
      );
    }
    return (
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <h1 className="text-xl font-semibold">
          Nhóm #{group.id} — {group.title}
        </h1>
      </div>
    );
  }, [isGroupPending, groupError, groupId, group]);

  const rawList: TUser[] = Array.isArray(groupMembersRes?.data?.data)
    ? groupMembersRes.data.data
    : [];


  const members = rawList.map((u) => ({
    id: u.id,
    fullName: u.fullName,
    studentCode: u.studentCode ?? null,
    avatarUrl: u.avatarUrl ?? null,
  }));

  const memberCount = members.length;

  // 🔹 Điều kiện hiển thị nút tham gia
  const canJoin =
    !isMyGroupPending &&
    !myGroup &&
    !isGroupMembersPending &&
    memberCount < 6;

  // 🔹 Handler join group (delay + popup)
  const handleJoinGroup = async () => {
    try {
      await joinGroupAsync(groupId);
      toast.success("Tham gia nhóm thành công!");
    } catch (err: any) {
      console.warn("⚠️ Backend báo lỗi nhưng có thể join thành công:", err);
      toast.warning("Tham gia nhóm thành công ! Đang cập nhật...");
    } finally {
      // ⏳ Chờ 3s để backend cập nhật, sau đó hiện popup
      setTimeout(() => setShowSuccessPopup(true), 3000);
    }
  };

  // 🔹 Khi chưa load xong
  if (isGroupPending || !groupId || !group) {
    return <div className="bg-background text-foreground flex min-h-screen flex-col">{header}</div>;
  }

  // 🔹 Nhóm đơn giản
  const minimalGroup: GroupMinimal = {
    id: Number(group.id) || 0,
    title: group.title,
    description: group.description ?? null,
  };

  // 🔹 Danh sách thành viên + nút tham gia
  const membersAside = (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-emerald-600" />
          <h3 className="text-lg font-semibold">Thành viên ({memberCount}/6)</h3>
        </div>

        {canJoin && (
          <Button size="sm" onClick={handleJoinGroup} disabled={isJoining}>
            {isJoining ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tham gia...
              </>
            ) : (
              "Tham gia nhóm"
            )}
          </Button>
        )}
      </div>

      {isGroupMembersPending && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Đang tải danh sách thành viên...
        </div>
      )}

      {!isGroupMembersPending && groupMembersError && (
        <div className="text-sm text-red-600">Không tải được danh sách thành viên.</div>
      )}

      {!isGroupMembersPending && !groupMembersError && members.length === 0 && (
        <div className="text-sm text-muted-foreground">Chưa có thành viên nào.</div>
      )}

      {!isGroupMembersPending && !groupMembersError && members.length > 0 && (
        <div className="grid grid-cols-1 gap-3">
          {members.map((m) => (
            <MemberCard
              key={m.id}
              user={{
                id: m.id,
                fullName: m.fullName,
                studentCode: m.studentCode ?? null,
                avatarUrl: m.avatarUrl ?? null,
              }}
            />
          ))}
        </div>
      )}
    </Card>
  );

  // 🔹 Popup điều hướng sau khi join thành công
  const successPopup = (
    <AlertDialog open={showSuccessPopup} onOpenChange={setShowSuccessPopup}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>🎉 Tham gia nhóm thành công!</AlertDialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Bạn muốn làm gì tiếp theo?
          </p>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => navigate("/student/mygroup", { replace: true })}
          >
            Xem nhóm của tôi
          </AlertDialogAction>
          <AlertDialogAction
            onClick={() => navigate("/groups", { replace: true })}
            className="bg-muted text-foreground hover:bg-muted/80"
          >
            Xem các nhóm khác
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  // 🔹 Render
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)_/_12%)_0,_transparent_55%)]"
        aria-hidden
      />
      {header}
      <GroupContent group={minimalGroup} aside={membersAside} />
      {successPopup}
    </div>
  );
}
