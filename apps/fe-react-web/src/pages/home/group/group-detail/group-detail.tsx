import type { RootState } from "@/redux/store";
import { Loader2, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { useGroupHook } from "@/hooks/use-group";
import { useTeacherCheckpointsHook } from "@/hooks/use-teacher-checkpoints";
import type { TGroup, TJoinGroup } from "@/schema/group.schema";
import type { TCheckPointsRequest } from "@/schema/teacher-checkpoints.schema";
import type { TUser } from "@/schema/user.schema";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import GroupContent from "./components/group-content";
import { MemberCard } from "./components/member-card";

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

  // Lấy role của user hiện tại
  const userRole = useSelector((state: RootState) => state.user.role);
  const isStudent = userRole === "STUDENT";
  const isLecturer = userRole === "LECTURER";

  const { useGroupMembers, useGroupById, useMyGroup, useJoinGroup, useGetMyJoinRequests, useGetGroupLeader } = useGroupHook();

  const { useMyRequestTeacherCheckpoint, useApprovedGroups } = useTeacherCheckpointsHook();

  // ───────────────────── Fetch Hooks ─────────────────────
  // STUDENT: lấy đầy đủ thông tin để tham gia nhóm
  // LECTURER: chỉ lấy thông tin nhóm để xem
  const { data: myGroupRes, isPending: isMyGroupPending } = useMyGroup();
  const myGroup = isStudent ? (myGroupRes?.data?.data ?? null) : null;

  const { data: groupRes, isPending: isGroupPending, error: groupError } = useGroupById(groupId);
  const group = groupRes?.data?.data ?? null;

  // Lấy danh sách các nhóm đã được chấp nhận (có teacher info)
  const { data: approvedGroupsRes } = useApprovedGroups();

  const approvedGroups = useMemo(() => {
    return approvedGroupsRes?.data?.data ?? [];
  }, [approvedGroupsRes]);

  // Tìm thông tin teacher từ approved groups
  const groupWithTeacher = useMemo(() => {
    if (!approvedGroups || approvedGroups.length === 0) return null;
    // approvedGroups có thể là TGroup[] hoặc TCheckPointsRequest[]
    // Cần check cả g.id và g.group?.id
    const found = approvedGroups.find((g: TGroup | TCheckPointsRequest) => {
      const checkpointItem = g as TCheckPointsRequest;
      const groupItem = g as TGroup;
      if (checkpointItem.group?.id === groupId) return true;
      if (groupItem.id === groupId) return true;
      return false;
    });
    return found;
  }, [approvedGroups, groupId]);

  // Extract teacher từ structure
  const checkpointTeacher = useMemo(() => {
    if (!groupWithTeacher) return null;
    // Type guard: check if it's TCheckPointsRequest
    if ("teacher" in groupWithTeacher && "group" in groupWithTeacher) {
      const checkpointItem = groupWithTeacher as unknown as TCheckPointsRequest;
      return checkpointItem.teacher;
    }
    return null;
  }, [groupWithTeacher]);

  // Fallback: thử lấy từ myRequest nếu đang xem nhóm của mình
  const { currentRequest } = useMyRequestTeacherCheckpoint(groupId);
  const myGroupTeacher = currentRequest?.status === "ACCEPTED" ? currentRequest?.teacher : null;

  // Ưu tiên teacher từ approved groups, fallback về myRequest
  const finalTeacher = checkpointTeacher || myGroupTeacher;

  const { data: groupMembersRes, isPending: isMembersPending, error: membersError } = useGroupMembers(groupId);

  const { data: leaderRes } = useGetGroupLeader(groupId);
  const leader = leaderRes?.data?.data ?? null;

  const { data: myReqRes, isPending: isReqLoading, refetch: refetchReqs } = useGetMyJoinRequests();

  const { mutateAsync: joinGroupAsync, isPending: isJoining } = useJoinGroup();

  // ───────────────────── Derived State ─────────────────────
  const members: TUser[] = groupMembersRes?.data?.data ?? [];
  const memberCount = members.length;
  const groupType = group?.type?.toUpperCase() ?? "";
  const isPublic = groupType === "PUBLIC";

  const myRequests = useMemo(() => {
    return isStudent ? (myReqRes?.data?.data ?? []) : [];
  }, [isStudent, myReqRes]);

  // Điều kiện hiển thị nút tham gia - chỉ STUDENT được tham gia
  const canShowJoinButton =
    isStudent && // chỉ student mới được tham gia
    !isMyGroupPending &&
    !myGroup && // chưa có nhóm
    !isMembersPending &&
    !!group &&
    memberCount < MEMBER_THRESHOLD;

  const hasPendingRequest = useMemo(
    () => !!(myRequests as TJoinGroup[]).find((r) => Number(r.toGroup?.id) === groupId && String(r.status).toUpperCase() === "PENDING"),
    [groupId, myRequests],
  );

  // ───────────────────── Auto Redirect - chỉ áp dụng cho STUDENT ─────────────────────
  useEffect(() => {
    if (isStudent && !isMyGroupPending && myGroup && groupId === myGroup.id) {
      navigate("/student/mygroup", { replace: true });
    }
  }, [isStudent, isMyGroupPending, myGroup, groupId, navigate]);

  // ───────────────────── UI: Action Button Meta ─────────────────────
  const actionMeta = useMemo(() => {
    if (!canShowJoinButton) return null;

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
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const msg = error?.response?.data?.message ?? (isPublic ? "Không thể tham gia nhóm." : "Không thể gửi yêu cầu.");
      toast.error(msg);
    }
  };

  // ───────────────────── Header ─────────────────────
  const header = (
    <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">
            Nhóm #{group?.id} — {group?.title}
          </h1>
          {isLecturer && (
            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
              Xem với quyền Giảng viên
            </Badge>
          )}
        </div>

        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
          {group?.semester && <Badge variant="secondary">Học kỳ: {group.semester?.name ?? group.semester?.id ?? "?"}</Badge>}
          {group?.type && <Badge variant="outline">Loại: {group.type}</Badge>}
          {group?.status && <Badge className={statusClass(String(group.status))}>Trạng thái: {String(group.status)}</Badge>}
          {/* Hiển thị thông tin giáo viên chấm checkpoint */}
          {finalTeacher ? (
            <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
              GV chấm: {finalTeacher.fullName}
            </Badge>
          ) : (
            <Badge variant="outline" className="border-gray-200 bg-gray-50 text-gray-600">
              Chưa có GV chấm
            </Badge>
          )}
        </div>
      </div>

      {isStudent && hasPendingRequest && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">Đã gửi yêu cầu</span>}
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
          <Button size="sm" onClick={handleJoin} disabled={isJoining || actionMeta.disabled}>
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

      {isStudent && hasPendingRequest && (
        <p className="text-muted-foreground mb-2 text-xs">Bạn đã gửi yêu cầu tham gia nhóm này. Vui lòng chờ xét duyệt.</p>
      )}

      {isLecturer && (
        <p className="mb-2 rounded border bg-blue-50 p-2 text-xs text-blue-600">
          <strong>Chế độ xem Giảng viên:</strong> Bạn đang xem thông tin nhóm với quyền chỉ đọc.
        </p>
      )}

      {isMembersPending && (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Loader2 className="h-4 w-4 animate-spin" /> Đang tải danh sách thành viên...
        </div>
      )}

      {!isMembersPending && membersError && <div className="text-destructive text-sm">Không tải được danh sách thành viên.</div>}

      {!isMembersPending && !membersError && !members.length && <div className="text-muted-foreground text-sm">Chưa có thành viên nào.</div>}

      {!isMembersPending && !membersError && members.length > 0 && (
        <div className="grid grid-cols-1 gap-3">
          {members.map((m) => {
            const isThisUserTheLeader = m.email === leader?.email;
            return <MemberCard key={m.id} user={m} isThisUserTheLeader={isThisUserTheLeader} />;
          })}
        </div>
      )}
    </Card>
  );

  // ───────────────────── Popups ─────────────────────
  const joinedPopup = (
    <AlertDialog open={popupJoined} onOpenChange={setPopupJoined}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <span role="img" aria-label="celebration">
              🎉
            </span>{" "}
            Tham gia nhóm thành công!
          </AlertDialogTitle>
          <p className="text-muted-foreground mt-1 text-sm">Bạn đã là thành viên của nhóm.</p>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => navigate("/student/mygroup", { replace: true })}>Xem nhóm của tôi</AlertDialogAction>
          <AlertDialogAction onClick={() => navigate("/groups", { replace: true })} className="bg-muted text-foreground hover:bg-muted/80">
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
          <p className="text-muted-foreground mt-1 text-sm">Yêu cầu của bạn đang chờ xét duyệt.</p>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => navigate("/student/join-requests", { replace: true })}>Xem yêu cầu đã gửi</AlertDialogAction>
          <AlertDialogAction onClick={() => navigate("/groups", { replace: true })} className="bg-muted text-foreground hover:bg-muted/80">
            Xem nhóm khác
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  // ───────────────────── Render ─────────────────────
  if (isGroupPending)
    return (
      <div className="text-muted-foreground flex min-h-screen items-center justify-center">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang tải nhóm...
      </div>
    );

  if (groupError || !group) return <div className="text-destructive flex min-h-screen items-center justify-center">Không tìm thấy nhóm.</div>;

  const minimalGroup = {
    id: group.id ?? 0,
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
