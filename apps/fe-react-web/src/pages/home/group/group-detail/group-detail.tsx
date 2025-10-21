import { useMemo, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Users } from "lucide-react";
import { toast } from "sonner";

import { useGroupHook } from "@/hooks/use-group";
import type { TJoinGroup } from "@/schema/group.schema";
import type { TUser } from "@/schema/user.schema";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { MemberCard } from "./components/member-card";
import GroupContent from "./components/group-content";

// ───────────────────── Constants ─────────────────────
const MEMBER_THRESHOLD = 6;

const statusClass = (status?: string) => {
  switch (status?.toUpperCase()) {
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "LOCKED":
      return "bg-rose-100 text-rose-800 border-rose-200";
    case "FORMING":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export default function GroupDetail() {
  const { id } = useParams();
  const groupId = Number(id);
  const navigate = useNavigate();

  const {
    useGroupMembers,
    useGroupById,
    useMyGroup,
    useJoinGroup,
    useGetMyJoinRequests,
  } = useGroupHook();

  // ───────────────────── Fetch Hooks ─────────────────────
  const { data: myGroupRes, isPending: isMyGroupPending } = useMyGroup();
  const myGroup = myGroupRes?.data?.data ?? null;

  const { data: groupRes, isPending: isGroupPending, error: groupError } = useGroupById(groupId);
  const group = groupRes?.data?.data ?? null;

  const { data: groupMembersRes, isPending: isMembersPending, error: membersError } =
    useGroupMembers(groupId);

  const { data: myReqRes, isPending: isReqLoading, refetch: refetchReqs } = useGetMyJoinRequests();
  const myRequests: TJoinGroup[] = myReqRes?.data?.data ?? [];

  const { mutateAsync: joinGroupAsync, isPending: isJoining } = useJoinGroup();

  // ───────────────────── Derived State ─────────────────────
  const members: TUser[] = groupMembersRes?.data?.data ?? [];
  const memberCount = members.length;
  const groupType = group?.type?.toUpperCase() ?? "";
  const isPublic = groupType === "PUBLIC";

  // Điều kiện hiển thị nút tham gia
  const canShowJoinButton =
    !isMyGroupPending &&
    !myGroup && // chưa có nhóm
    !isMembersPending &&
    !!group &&
    memberCount < MEMBER_THRESHOLD;

  const hasPendingRequest = useMemo(
    () =>
      !!myRequests.find(
        (r) =>
          Number(r.toGroup?.id) === groupId &&
          String(r.status).toUpperCase() === "PENDING"
      ),
    [groupId, myRequests]
  );

  // ───────────────────── Auto Redirect ─────────────────────
  useEffect(() => {
    if (!isMyGroupPending && myGroup && groupId === myGroup.id) {
      navigate("/student/mygroup", { replace: true });
    }
  }, [isMyGroupPending, myGroup, groupId, navigate]);

  // ───────────────────── UI: Action Button Meta ─────────────────────
  const actionMeta = useMemo(() => {
    if (!canShowJoinButton)
      return null;

    if (isReqLoading || hasPendingRequest) {
      return {
        label: "Đang chờ xét duyệt",
        loadingLabel: "Đang gửi...",
        disabled: true,
      };
    }

    return isPublic
      ? {
        label: "Tham gia nhóm",
        loadingLabel: "Đang tham gia...",
        disabled: false,
      }
      : {
        label: "Gửi yêu cầu tham gia",
        loadingLabel: "Đang gửi yêu cầu...",
        disabled: false,
      };
  }, [canShowJoinButton, isReqLoading, hasPendingRequest, isPublic]);

  // ───────────────────── Actions ─────────────────────
  const [popupJoined, setPopupJoined] = useState(false);
  const [popupRequested, setPopupRequested] = useState(false);

  const handleJoin = async () => {
    try {
      await joinGroupAsync(groupId);
      if (isPublic) {
        toast.success("Tham gia nhóm thành công!");
        setPopupJoined(true);
      } else {
        toast.success("Đã gửi yêu cầu tham gia nhóm!");
        setPopupRequested(true);
        await refetchReqs();
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        (isPublic ? "Không thể tham gia nhóm." : "Không thể gửi yêu cầu.");
      toast.error(msg);
    }
  };

  // ───────────────────── Header ─────────────────────
  const header = (
    <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
      <div>
        <h1 className="text-xl font-semibold">
          Nhóm #{group?.id} — {group?.title}
        </h1>

        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
          {group?.semester && (
            <Badge variant="secondary">
              Học kỳ: {group.semester?.name ?? group.semester?.id ?? "?"}
            </Badge>
          )}
          {group?.type && <Badge variant="outline">Loại: {group.type}</Badge>}
          {group?.status && (
            <Badge className={statusClass(String(group.status))}>
              Trạng thái: {String(group.status)}
            </Badge>
          )}
        </div>
      </div>

      {hasPendingRequest && (
        <span className="text-xs rounded-full bg-amber-100 text-amber-700 px-2 py-0.5">
          Đã gửi yêu cầu
        </span>
      )}
    </div>
  );

  // ───────────────────── Aside (Members + Join) ─────────────────────
  const membersAside = (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-emerald-600" />
          <h3 className="text-lg font-semibold">
            Thành viên ({memberCount}/{MEMBER_THRESHOLD})
          </h3>
        </div>

        {actionMeta && (
          <Button
            size="sm"
            onClick={handleJoin}
            disabled={isJoining || actionMeta.disabled}
          >
            {isJoining ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {actionMeta.loadingLabel}
              </>
            ) : (
              actionMeta.label
            )}
          </Button>
        )}
      </div>

      {hasPendingRequest && (
        <p className="mb-2 text-xs text-muted-foreground">
          Bạn đã gửi yêu cầu tham gia nhóm này. Vui lòng chờ xét duyệt.
        </p>
      )}

      {isMembersPending && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Đang tải danh sách thành viên...
        </div>
      )}

      {!isMembersPending && membersError && (
        <div className="text-sm text-destructive">Không tải được danh sách thành viên.</div>
      )}

      {!isMembersPending && !membersError && !members.length && (
        <div className="text-sm text-muted-foreground">Chưa có thành viên nào.</div>
      )}

      {!isMembersPending && !membersError && members.length > 0 && (
        <div className="grid grid-cols-1 gap-3">
          {members.map((m) => (
            <MemberCard key={m.id} user={m} />
          ))}
        </div>
      )}
    </Card>
  );

  // ───────────────────── Popups ─────────────────────
  const joinedPopup = (
    <AlertDialog open={popupJoined} onOpenChange={setPopupJoined}>
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
            Xem nhóm khác
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  const requestedPopup = (
    <AlertDialog open={popupRequested} onOpenChange={setPopupRequested}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Đã gửi yêu cầu tham gia nhóm!</AlertDialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Yêu cầu của bạn đang chờ xét duyệt.
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
            Xem nhóm khác
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  // ───────────────────── Render ─────────────────────
  if (isGroupPending)
    return (
      <div className="flex items-center justify-center min-h-screen text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang tải nhóm...
      </div>
    );

  if (groupError || !group)
    return (
      <div className="flex items-center justify-center min-h-screen text-destructive">
        Không tìm thấy nhóm.
      </div>
    );

  const minimalGroup = {
    id: group.id!,
    title: group.title,
    description: group.description ?? null,
  };

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
