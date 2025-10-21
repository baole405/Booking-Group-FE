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
import type { TGroup, TJoinGroup } from "@/schema/group.schema";

type GroupMinimal = {
  id: number;
  title: string;
  description?: string | null;
};

// ✅ Rule: chỉ hiển thị nút khi memberCount > THRESHOLD
const THRESHOLD = 6;

export default function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const groupId = Number(id);
  const navigate = useNavigate();

  const {
    useGroupMembers,
    useGroupById,
    useMyGroup,
    useJoinGroup,
    useGetMyJoinRequests, // ⬅️ lấy yêu cầu đã gửi
  } = useGroupHook();

  // ───────────────────── My Group ─────────────────────
  const { data: myGroupRes, isPending: isMyGroupPending } = useMyGroup();
  const myGroup = myGroupRes?.data?.data ?? null;

  // ───────────────────── Current Group (by id) ─────────────────────
  const { data: groupRes, isPending: isGroupPending, error: groupError } = useGroupById(groupId);
  const group = groupRes?.data?.data ?? null;

  // Nếu nhóm đang xem === nhóm của mình ⇒ redirect
  useEffect(() => {
    if (!isMyGroupPending && myGroup && groupId === myGroup.id) {
      navigate("/student/mygroup", { replace: true });
    }
  }, [isMyGroupPending, myGroup, groupId, navigate]);

  // ───────────────────── Members ─────────────────────
  const {
    data: groupMembersRes,
    isPending: isGroupMembersPending,
    error: groupMembersError,
  } = useGroupMembers(groupId);

  // ───────────────────── My Join Requests ─────────────────────
  const {
    data: myReqRes,
    isPending: isReqLoading,
    refetch: refetchMyReqs,
  } = useGetMyJoinRequests();

  const myRequests: TJoinGroup[] = Array.isArray(myReqRes?.data?.data) ? myReqRes.data.data : [];

  const { mutateAsync: joinGroupAsync, isPending: isJoining } = useJoinGroup();

  // Popups
  const [showJoinedPopup, setShowJoinedPopup] = useState(false); // sau khi join ngay (PUBLIC)
  const [showRequestedPopup, setShowRequestedPopup] = useState(false); // sau khi gửi request (PRIVATE)

  // ───────────────────── Members mapping ─────────────────────
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

  // ───────────────────── Join/Request Logic ─────────────────────
  // FE rule: chỉ SV chưa có nhóm & memberCount > THRESHOLD mới thấy nút
  const groupType = String((group as TGroup)?.type ?? "").toUpperCase();
  const isPublic = groupType === "PUBLIC";

  const canInteract =
    !isMyGroupPending && !myGroup && !isGroupMembersPending && memberCount > THRESHOLD;

  // Đã gửi yêu cầu cho nhóm này?
  const hasPendingRequest = useMemo(() => {
    if (!groupId || !myRequests.length) return false;
    return myRequests.some(
      (r) =>
        Number(r?.toGroup?.id) === groupId &&
        String(r?.status).toUpperCase() === "PENDING"
    );
  }, [groupId, myRequests]);

  type ActionMeta =
    | {
      label: string;
      submittingLabel: string;
      title: string;
      disabled: boolean;
    }
    | null;

  // Chuẩn hóa metadata cho nút để tránh nested ternary
  const actionMeta: ActionMeta = (() => {
    if (!canInteract) return null;
    if (isReqLoading || hasPendingRequest) {
      return {
        label: "Đang chờ xét duyệt",
        submittingLabel: "Đang gửi...",
        title: "Đang chờ xét duyệt",
        disabled: true,
      };
    }
    if (isPublic) {
      return {
        label: "Tham gia nhóm",
        submittingLabel: "Đang tham gia...",
        title: "Tham gia nhóm",
        disabled: false,
      };
    }
    // PRIVATE (và các type khác) → gửi yêu cầu
    return {
      label: "Gửi yêu cầu tham gia",
      submittingLabel: "Đang gửi yêu cầu...",
      title: "Gửi yêu cầu tham gia",
      disabled: false,
    };
  })();

  // ───────────────────── Header ─────────────────────
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
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">
            Nhóm #{group.id} — {group.title}
          </h1>

          {/* ✅ Badge: đã gửi yêu cầu */}
          {hasPendingRequest && (
            <span className="text-xs rounded-full bg-amber-500/15 text-amber-700 px-2 py-0.5">
              đã gửi yêu cầu
            </span>
          )}
        </div>
      </div>
    );
  }, [isGroupPending, groupError, groupId, group, hasPendingRequest]);

  // ───────────────────── Handler (xử lý exception đúng) ─────────────────────
  const handleJoinOrRequest = async () => {
    try {
      await joinGroupAsync(groupId); // BE quyết định join ngay hay tạo request

      if (isPublic) {
        toast.success("Tham gia nhóm thành công!");
        setShowJoinedPopup(true);
      } else {
        toast.success("Đã gửi yêu cầu tham gia nhóm!");
        setShowRequestedPopup(true);
        await refetchMyReqs(); // ⬅️ cập nhật lại danh sách yêu cầu để khóa nút + hiện badge
      }
    } catch (err: any) {
      const beMsg =
        err?.response?.data?.message ??
        (isPublic ? "Không thể tham gia nhóm." : "Không thể gửi yêu cầu tham gia.");
      toast.error(beMsg);
    }
  };

  // ───────────────────── Guards ─────────────────────
  if (isGroupPending || !groupId || !group) {
    return <div className="bg-background text-foreground flex min-h-screen flex-col">{header}</div>;
  }

  // ───────────────────── Minimal group ─────────────────────
  const minimalGroup: GroupMinimal = {
    id: Number(group.id) || 0,
    title: group.title,
    description: group.description ?? null,
  };

  // ───────────────────── Aside (members + action) ─────────────────────
  const membersAside = (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-emerald-600" />
          <h3 className="text-lg font-semibold">
            Thành viên ({memberCount}/{THRESHOLD})
          </h3>
        </div>

        {actionMeta && (
          <Button
            size="sm"
            onClick={handleJoinOrRequest}
            disabled={isJoining || actionMeta.disabled}
            title={actionMeta.title}
          >
            {isJoining ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {actionMeta.submittingLabel}
              </>
            ) : (
              actionMeta.label
            )}
          </Button>
        )}
      </div>

      {/* Gợi ý cho người dùng khi đã gửi request */}
      {hasPendingRequest && (
        <div className="mb-2 text-xs text-muted-foreground">
          Bạn đã gửi yêu cầu tham gia nhóm này. Vui lòng chờ trưởng nhóm xét duyệt.
        </div>
      )}

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

  // ───────────────────── Popups ─────────────────────
  const joinedPopup = (
    <AlertDialog open={showJoinedPopup} onOpenChange={setShowJoinedPopup}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>🎉 Tham gia nhóm thành công!</AlertDialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Bạn đã là thành viên của nhóm.
          </p>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => navigate("/student/mygroup", { replace: true })}>
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

  const requestedPopup = (
    <AlertDialog open={showRequestedPopup} onOpenChange={setShowRequestedPopup}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle> Đã gửi yêu cầu tham gia nhóm!</AlertDialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Yêu cầu của bạn đang chờ trưởng nhóm xét duyệt.
          </p>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => navigate("/student/join-requests", { replace: true })}>
            Xem yêu cầu đã gửi
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

  // ───────────────────── Render ─────────────────────
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)_/_12%)_0,_transparent_55%)]"
        aria-hidden
      />
      {header}
      <GroupContent group={minimalGroup} aside={membersAside} />
      {joinedPopup}
      {requestedPopup}
    </div>
  );
}
