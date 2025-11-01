import { useQueryClient } from "@tanstack/react-query";
import { Loader2, MessageCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useGroupHook } from "@/hooks/use-group";
import { useTeacherCheckpointsHook } from "@/hooks/use-teacher-checkpoints";
import { useUserHook } from "@/hooks/use-user";
import type { TVoteByGroup, TVoteChoice } from "@/schema/group.schema";
import type { TUser } from "@/schema/user.schema";

import GroupContent from "./components/group-content";
import MembersAside from "./components/MembersAside";
import VotesPanel from "./components/VotesPanel";

type GroupMinimal = {
  id: number;
  title: string;
  description?: string | null;
  status?: "ACTIVE" | "DONE" | string;
};

const statusClass = (s?: string) => {
  switch (s) {
    case "ACTIVE":
      return "bg-emerald-200 text-emerald-800";
    case "DONE":
      return "bg-gray-200 text-gray-800";
    default:
      return "bg-muted text-foreground";
  }
};

export default function MyGroupPage() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const qc = useQueryClient();

  // State cho dialog chọn giáo viên
  const [showTeacherDialog, setShowTeacherDialog] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);

  const {
    useGroupMembers,
    useMyGroup,
    useLeaveMyGroup,
    useRemoveUserFromGroup,
    useGetGroupLeader,
    useTransferLeader,
    useFinalizeGroup,
    useChangeGroupType,

    // Vote hooks
    useVoteByGroupId,
    useVotesByVoteId,
    useChoiceVote,
  } = useGroupHook();

  // Teacher checkpoint hooks
  const { useTeacherList, useRequestTeacherCheckpoint, useMyRequestTeacherCheckpoint } = useTeacherCheckpointsHook();
  const { data: teacherListRes, isPending: isTeacherListPending } = useTeacherList();
  const { mutateAsync: requestTeacherAsync, isPending: isRequestingTeacher } = useRequestTeacherCheckpoint();

  // current user (để check hasVoted)
  const { useMyProfile } = useUserHook();
  const { data: myProfileRes } = useMyProfile();
  const myProfile = myProfileRes?.data ?? null;
  const currentEmail: string | null = (myProfile?.email as string | undefined) ?? null;

  // mutations
  const { mutateAsync: removeUserAsync, isPending: isRemoving } = useRemoveUserFromGroup();
  const { mutateAsync: transferLeaderAsync, isPending: isTransferring } = useTransferLeader();
  const { mutateAsync: leaveAsync, isPending: isLeaving } = useLeaveMyGroup();
  const { mutateAsync: finalizeGroupAsync, isPending: isFinalizing } = useFinalizeGroup();
  const { mutateAsync: changeGroupTypeAsync, isPending: isChangingType } = useChangeGroupType();
  // vote mutation (must be called unconditionally with other hooks)
  const { mutateAsync: choiceVoteAsync, isPending: isVoting } = useChoiceVote();

  // my group
  const { data: groupRes, isPending: isGroupPending, error: groupError } = useMyGroup();
  const group = groupRes?.data?.data ?? null;
  const groupId = group?.id ?? null;

  // teacher checkpoint request status
  const {
    currentRequest: myTeacherRequest,
    hasActiveRequest,
    canSendNewRequest,
    isPending: isRequestPending,
    isApproved: isRequestApproved,
    isRejected: isRequestRejected,
  } = useMyRequestTeacherCheckpoint(groupId);

  // Tính toán thông tin giáo viên chấm checkpoint (chỉ từ approved request)
  const approvedTeacher = isRequestApproved ? myTeacherRequest?.teacher : null;
  const hasCheckpointTeacher = !!approvedTeacher;

  // members
  const { data: groupMembersRes, isPending: isGroupMembersPending, refetch: refetchMembers } = useGroupMembers(groupId);

  // leader
  const { data: leaderRes } = useGetGroupLeader(groupId);
  const leader = leaderRes?.data?.data ?? null;

  // votes by group
  const { data: voteRes, isPending: isVoteListPending, refetch: refetchVoteList } = useVoteByGroupId(groupId);
  const groupVotes: TVoteByGroup[] = useMemo(
    () => (Array.isArray(voteRes?.data?.data) ? (voteRes.data.data as TVoteByGroup[]) : []),
    [voteRes?.data?.data],
  );

  // chỉ hiển thị ứng viên có status OPEN
  const openVotes = useMemo(() => groupVotes.filter((v) => String(v.status).toUpperCase() === "OPEN"), [groupVotes]);

  // chọn voteId: ưu tiên query ?voteId=..., nếu không có thì lấy open cuối
  const queryVoteId = Number(new URLSearchParams(search).get("voteId") || 0);
  const defaultOpen = openVotes.length ? openVotes[openVotes.length - 1] : null;
  const voteId = queryVoteId || (defaultOpen?.id ?? null);

  // choices theo voteId
  const { data: voteChoicesRes, isPending: isVotesPending, refetch: refetchVotes } = useVotesByVoteId(voteId);
  const voteChoices: TVoteChoice[] = useMemo(
    () => (Array.isArray(voteChoicesRes?.data?.data) ? (voteChoicesRes.data.data as TVoteChoice[]) : []),
    [voteChoicesRes?.data?.data],
  );

  // tổng hợp YES/NO + info cho panel
  const currentVote = voteId ? (groupVotes.find((v) => v.id === voteId) ?? null) : null;
  const yesCount = voteChoices.filter((c) => String(c?.choiceValue).toUpperCase() === "YES").length;
  const noCount = voteChoices.filter((c) => String(c?.choiceValue).toUpperCase() === "NO").length;

  const votesForPanel = currentVote
    ? [
        {
          id: currentVote.id,
          title: currentVote.topic ?? `Vote #${currentVote.id}`,
          description: "",
          status: currentVote.status ?? "OPEN",
          resultYes: yesCount,
          resultNo: noCount,
          candidate: currentVote.targetUser ? { id: currentVote.targetUser.id, fullName: currentVote.targetUser.fullName } : undefined,
          hasVoted: voteChoices.some((c) => c?.user?.email === currentEmail),
        },
      ]
    : [];

  // auto refetch
  useEffect(() => {
    if (!groupId) return;
    const interval = setInterval(() => {
      refetchMembers();
      refetchVoteList();
      if (voteId) refetchVotes();
    }, 20000);
    return () => clearInterval(interval);
  }, [groupId, voteId, refetchMembers, refetchVoteList, refetchVotes]);

  // header
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
        <div>
          <h1 className="text-xl font-semibold">
            Nhóm #{group?.id} — {group?.title}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
            {group?.semester && <Badge variant="secondary">Học kỳ: {group.semester?.name ?? group.semester?.id ?? String(group.semester)}</Badge>}
            {group?.type && <Badge variant="outline">Loại: {String(group.type)}</Badge>}
            {group?.status && <Badge className={statusClass(String(group.status))}>Trạng thái: {String(group.status)}</Badge>}
            {/* Hiển thị thông tin giáo viên chấm checkpoint (chỉ từ approved request) */}
            {approvedTeacher ? (
              <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                GV chấm: {approvedTeacher.fullName}
              </Badge>
            ) : (
              <Badge variant="outline" className="border-gray-200 bg-gray-50 text-gray-600">
                Chưa có GV chấm
              </Badge>
            )}
          </div>
        </div>
        <Button onClick={() => navigate("/student/group-chat")} className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Chat nhóm
        </Button>
      </div>
    );
  }, [isGroupPending, groupError, groupId, group, approvedTeacher, navigate]);

  if (isGroupPending || !groupId || !group) {
    return <div className="bg-background text-foreground flex min-h-screen flex-col">{header}</div>;
  }

  // members mapping
  const rawList: TUser[] = Array.isArray(groupMembersRes?.data?.data) ? groupMembersRes.data.data : [];
  const members = rawList.map((u) => ({
    id: u.id,
    fullName: u.fullName,
    email: u.email,
    studentCode: u.studentCode ?? null,
    avatarUrl: u.avatarUrl ?? null,
    majorName: u.major?.name ?? null,
  }));
  const memberCount = members.length;

  const isLeader = leader?.email === currentEmail;
  const isGroupLocked = String(group?.status).toUpperCase() === "LOCKED";

  // Debug submit idea
  console.log("Debug submit idea:", {
    isRequestApproved,
    approvedTeacher: approvedTeacher?.fullName,
    hasCheckpointTeacher,
    isLeader,
    currentEmail,
    leaderEmail: leader?.email,
    groupStatus: group?.status,
  });

  // minimal group to child
  const minimalGroup: GroupMinimal = {
    id: (group.id as number) ?? 0,
    title: group.title,
    description: group.description ?? null,
    status: group.status,
  };

  // handlers
  const handleKick = async (id: number, fullName: string) => {
    if (isRemoving) return;
    try {
      await removeUserAsync(id);
      toast.success(`Đã xóa ${fullName} khỏi nhóm.`);
      await refetchMembers();
    } catch {
      toast.error("Không thể xóa thành viên này!");
    }
  };

  const handleTransfer = async (id: number, fullName: string) => {
    if (isTransferring) return;
    try {
      await transferLeaderAsync({ newLeaderId: id });
      toast.success(`Đã chuyển quyền trưởng nhóm cho ${fullName}.`);
      await qc.invalidateQueries({ queryKey: ["groupLeader"] });
      await refetchMembers();
    } catch {
      toast.error("Không thể chuyển quyền, vui lòng thử lại!");
    }
  };

  const handleLeave = async () => {
    try {
      await leaveAsync();
      toast.success("Đã rời nhóm thành công!");
      await qc.invalidateQueries({ queryKey: ["myGroup"] });
      setTimeout(() => navigate("/groups", { replace: true }), 1000);
    } catch {
      toast.error("Không thể rời nhóm, vui lòng thử lại!");
    }
  };

  const handleChangeType = async () => {
    try {
      await changeGroupTypeAsync();
      toast.success("Đã thay đổi trạng thái nhóm.");
    } catch {
      toast.error("Không thể thay đổi trạng thái nhóm!");
    }
  };

  const handleFinalize = async () => {
    try {
      await finalizeGroupAsync();
      toast.success("Đã hoàn tất nhóm.");
    } catch {
      toast.error("Không thể hoàn tất nhóm!");
    }
  };

  // vote handler – mọi member đều được bấm
  const handleVote = async (vId: number, choice: "YES" | "NO") => {
    try {
      await choiceVoteAsync({ voteId: vId, choiceValue: choice });
      toast.success("Đã ghi nhận lá phiếu của bạn!");
      await refetchVotes();
      await refetchVoteList();
    } catch (err: unknown) {
      let msg = "Không thể bỏ phiếu, thử lại sau.";
      if (typeof err === "object" && err !== null) {
        const maybeResponse = (err as { response?: unknown }).response as { data?: { message?: unknown } } | undefined;
        const maybeMessage = maybeResponse?.data?.message;
        if (typeof maybeMessage === "string") msg = maybeMessage;
        else if (err instanceof Error && err.message) msg = err.message;
      }
      toast.error(msg);
    }
  };

  // Teacher checkpoint handlers
  const handleSelectTeacher = async () => {
    if (!selectedTeacherId) {
      toast.error("Vui lòng chọn một giáo viên!");
      return;
    }

    // Kiểm tra xem có thể gửi request mới không
    if (!canSendNewRequest) {
      toast.error("Nhóm đã có yêu cầu đang chờ xử lý hoặc đã được chấp nhận!");
      return;
    }

    try {
      await requestTeacherAsync(selectedTeacherId);
      toast.success("Đã gửi yêu cầu chọn giáo viên chấm checkpoint!");
      setShowTeacherDialog(false);
      setSelectedTeacherId(null);
      // Refresh group data and teacher request data
      await qc.invalidateQueries({ queryKey: ["myGroup"] });
      await qc.invalidateQueries({ queryKey: ["myRequestTeacherCheckpoint", groupId] });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Không thể gửi yêu cầu, vui lòng thử lại!";
      toast.error(msg);
    }
  };

  // chọn ứng viên (vote) → cập nhật query ?voteId=
  const selectVote = (id: number) => {
    const params = new URLSearchParams(search);
    if (id) params.set("voteId", String(id));
    else params.delete("voteId");
    navigate({ search: params.toString() ? `?${params.toString()}` : "" }, { replace: true });
  };

  // Aside
  const membersAside = (
    <div className="space-y-4">
      <MembersAside
        members={members}
        isLeader={isLeader}
        currentEmail={currentEmail}
        leaderEmail={leader?.email ?? null}
        isGroupMembersPending={isGroupMembersPending}
        isLeaving={isLeaving}
        onKick={handleKick}
        onTransfer={handleTransfer}
        onLeave={handleLeave}
        onViewProfile={(id) => navigate(`/student/profile/${id}`)}
      />

      {/* Phần chọn giáo viên chấm - hiển thị theo trạng thái request */}
      {isGroupLocked && isLeader && !hasCheckpointTeacher && (
        <Card className="p-4">
          <div className="mb-2">
            <h3 className="text-lg font-semibold">Giáo viên chấm checkpoint</h3>

            {/* Hiển thị theo trạng thái request */}
            {isRequestPending && (
              <div className="space-y-2">
                <p className="text-sm text-blue-600">Đã gửi yêu cầu đến GV {myTeacherRequest?.teacher?.fullName}. Đang chờ phê duyệt...</p>
                <Badge variant="secondary" className="border-blue-200 bg-blue-50 text-blue-700">
                  Đang chờ xác nhận
                </Badge>
              </div>
            )}

            {isRequestApproved && (
              <div className="space-y-2">
                <p className="text-sm text-green-600">
                  GV {myTeacherRequest?.teacher?.fullName} đã chấp nhận làm giáo viên chấm checkpoint cho nhóm.
                </p>
                <Badge variant="default" className="border-green-200 bg-green-50 text-green-700">
                  Đã chấp nhận
                </Badge>
              </div>
            )}

            {isRequestRejected && (
              <div className="space-y-2">
                <p className="text-sm text-red-600">Yêu cầu đến GV {myTeacherRequest?.teacher?.fullName} đã bị từ chối.</p>
                {myTeacherRequest?.message && <p className="text-muted-foreground text-sm">Lý do: {myTeacherRequest.message}</p>}
                <Badge variant="destructive" className="border-red-200 bg-red-50 text-red-700">
                  Đã từ chối
                </Badge>
              </div>
            )}

            {!hasActiveRequest && <p className="text-muted-foreground text-sm">Nhóm đã hoàn tất, vui lòng chọn giáo viên để chấm checkpoint.</p>}
          </div>

          {/* Chỉ hiện button chọn khi có thể gửi request mới */}
          {canSendNewRequest && (
            <Button onClick={() => setShowTeacherDialog(true)} className="w-full">
              {isRequestRejected ? "Chọn giáo viên khác" : "Chọn giáo viên chấm"}
            </Button>
          )}
        </Card>
      )}

      <Card className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Ứng viên đang mở ({openVotes.length})</h3>
          {isVoteListPending && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>

        {!isVoteListPending && openVotes.length === 0 && (
          <div className="text-muted-foreground rounded-lg border border-dashed p-4 text-sm">Hiện không có ứng viên nào đang mở để bỏ phiếu.</div>
        )}

        {!isVoteListPending && openVotes.length > 0 && (
          <div className="grid gap-2">
            {openVotes.map((v) => {
              const active = voteId === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => selectVote(v.id)}
                  className={`hover:bg-muted/40 w-full rounded-md border p-3 text-left transition-colors ${active ? "ring-2 ring-amber-500/60" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate font-medium">{v.targetUser?.fullName ?? `Vote #${v.id}`}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </Card>

      {/* 🔸 PANEL BỎ PHIẾU CHO VOTE ĐANG CHỌN */}
      <Card className="p-4">
        <VotesPanel isLoading={!!voteId && isVotesPending} votes={votesForPanel} onVote={handleVote} isVoting={isVoting} />
      </Card>
    </div>
  );

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
        hasCheckpointTeacher={hasCheckpointTeacher}
        memberCount={memberCount}
        isChangingType={isChangingType}
        isFinalizing={isFinalizing}
        onChangeType={handleChangeType}
        onFinalize={handleFinalize}
      />

      {/* Dialog chọn giáo viên */}
      <Dialog open={showTeacherDialog} onOpenChange={setShowTeacherDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chọn giáo viên chấm checkpoint</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {isTeacherListPending ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Đang tải danh sách giáo viên...</span>
              </div>
            ) : (
              <div className="space-y-2">
                {teacherListRes?.data?.data?.map((teacher: TUser) => (
                  <button
                    key={teacher.id}
                    onClick={() => setSelectedTeacherId(teacher.id)}
                    className={`w-full rounded-lg border p-3 text-left transition-colors ${
                      selectedTeacherId === teacher.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-medium">{teacher.fullName}</div>
                    <div className="text-sm text-gray-600">{teacher.email}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowTeacherDialog(false);
                setSelectedTeacherId(null);
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleSelectTeacher} disabled={!selectedTeacherId || isRequestingTeacher}>
              {isRequestingTeacher ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                "Chọn giáo viên"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
