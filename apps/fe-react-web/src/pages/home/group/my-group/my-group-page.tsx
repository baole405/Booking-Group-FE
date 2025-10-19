import { Loader2, Users, LogOut } from "lucide-react";
import { useMemo, useEffect } from "react";
import GroupContent from "./components/group-content";
import { useGroupHook } from "@/hooks/use-group";
import { MemberCard } from "./components/member-card";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useQueryClient } from "@tanstack/react-query";
import type { TUser } from "@/schema/user.schema";
import { useNavigate } from "react-router-dom";

type GroupMinimal = {
  id: number;
  title: string;
  description?: string | null;
};

export default function MyGroupPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { useGroupMembers, useMyGroup, useLeaveMyGroup } = useGroupHook();

  // 🔹 Lấy thông tin nhóm hiện tại
  const {
    data: groupRes,
    isPending: isGroupPending,
    error: groupError,
  } = useMyGroup();

  const group = groupRes?.data?.data ?? null;
  const groupId = group?.id ?? 0;

  // 🔹 Lấy danh sách thành viên trong nhóm hiện tại
  const {
    data: groupMembersRes,
    isPending: isGroupMembersPending,
    refetch,
  } = useGroupMembers(groupId);

  // 🔁 Tự động refetch sau mỗi 20 giây để cập nhật danh sách
  useEffect(() => {
    if (!groupId) return;
    const interval = setInterval(() => {
      refetch();
    }, 20000); // 20s
    return () => clearInterval(interval);
  }, [groupId, refetch]);

  const { mutateAsync: leaveAsync, isPending: isLeaving } = useLeaveMyGroup();

  // 🔹 Header hiển thị trạng thái nhóm
  const header = useMemo(() => {
    if (isGroupPending) {
      return (
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <h1 className="text-xl font-semibold">Đang tải nhóm của bạn...</h1>
          </div>
        </div>
      );
    }

    if (groupError || !groupId) {
      return (
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold">Bạn chưa tham gia nhóm nào</h1>
        </div>
      );
    }

    return (
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <h1 className="text-xl font-semibold">
          Nhóm #{group?.id} — {group?.title}
        </h1>
      </div>
    );
  }, [isGroupPending, groupError, groupId, group?.id, group?.title]);

  // 🔹 Nếu chưa có nhóm hoặc đang loading
  if (isGroupPending || !groupId || !group) {
    return (
      <div className="bg-background text-foreground flex min-h-screen flex-col">
        {header}
      </div>
    );
  }

  const rawList: TUser[] = Array.isArray(groupMembersRes?.data?.data)
    ? groupMembersRes.data.data
    : [];


  const members = rawList.map((u) => ({
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    studentCode: u.studentCode ?? null,
    avatarUrl: u.avatarUrl ?? null,
  }));

  // 🔹 Xác định leader (dựa theo email đầu tiên)
  let currentEmail: string | null = null;
  try {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (typeof parsed === "object" && parsed) {
        currentEmail = parsed?.email ?? parsed?.user?.email ?? null;
      }
    }
  } catch (e) {
    console.error("⚠️ Lỗi parse localStorage:", e);
  }

  const leader = members[0];
  const isLeader = leader?.email === currentEmail;

  // 🔹 Nhóm rút gọn
  const minimalGroup: GroupMinimal = {
    id: group.id as number,
    title: group.title,
    description: group.description ?? null,
  };

  // 🔹 Danh sách thành viên + nút rời nhóm (nếu không phải leader)
  const membersAside = (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-emerald-600" />
          <h3 className="text-lg font-semibold">
            Thành viên ({members.length})
          </h3>
        </div>
      </div>

      {/* Member có nút rời nhóm */}
      {!isLeader && (
        <div className="mb-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                disabled={isLeaving || isGroupMembersPending}
              >
                {isLeaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang rời...
                  </>
                ) : (
                  <>
                    <LogOut className="mr-2 h-4 w-4" />
                    Rời khỏi nhóm
                  </>
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận rời nhóm?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isLeaving}>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    await leaveAsync();
                    await qc.invalidateQueries({ queryKey: ["myGroup"] });
                    setTimeout(
                      () => navigate("/groups", { replace: true }),
                      1000
                    );
                  }}
                  disabled={isLeaving}
                >
                  {isLeaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Xác nhận"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {/* Danh sách thành viên */}
      {!isGroupMembersPending && members.length > 0 && (
        <div className="grid grid-cols-1 gap-3">
          {members.map((m) => (
            <MemberCard key={m.id} user={m} />
          ))}
        </div>
      )}
    </Card>
  );

  // 🔹 Render chính
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)_/_12%)_0,_transparent_55%)]"
        aria-hidden
      />
      {header}
      <GroupContent
        group={minimalGroup}
        aside={membersAside}
        isLeader={isLeader}
      />
    </div>
  );
}
