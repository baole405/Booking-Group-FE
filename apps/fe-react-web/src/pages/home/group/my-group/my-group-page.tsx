import { useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useGroupHook } from "@/hooks/use-group";
import { useUserHook } from "@/hooks/use-user";
import type { TUser } from "@/schema/user.schema";
import type { TVoteByGroup, TVoteChoice } from "@/schema/group.schema";

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
  const groupId = group?.id ?? 0;

  // members
  const {
    data: groupMembersRes,
    isPending: isGroupMembersPending,
    refetch: refetchMembers,
  } = useGroupMembers(groupId);

  // leader
  const { data: leaderRes } = useGetGroupLeader(groupId);
  const leader = leaderRes?.data?.data ?? null;

  // votes by group
  const { data: voteRes, isPending: isVoteListPending, refetch: refetchVoteList } = useVoteByGroupId(groupId);
  const groupVotes: TVoteByGroup[] = useMemo(
    () => (Array.isArray(voteRes?.data?.data) ? (voteRes.data.data as TVoteByGroup[]) : []),
    [voteRes?.data?.data]
  );

  // chỉ hiển thị ứng viên có status OPEN
  const openVotes = useMemo(
    () => groupVotes.filter((v) => String(v.status).toUpperCase() === "OPEN"),
    [groupVotes]
  );

  // chọn voteId: ưu tiên query ?voteId=..., nếu không có thì lấy open cuối
  const queryVoteId = Number(new URLSearchParams(search).get("voteId") || 0);
  const defaultOpen = openVotes.length ? openVotes[openVotes.length - 1] : null;
  const voteId = queryVoteId || (defaultOpen?.id ?? 0);

  // choices theo voteId
  const {
    data: voteChoicesRes,
    isPending: isVotesPending,
    refetch: refetchVotes,
  } = useVotesByVoteId(voteId);
  const voteChoices: TVoteChoice[] = useMemo(
    () => (Array.isArray(voteChoicesRes?.data?.data) ? (voteChoicesRes.data.data as TVoteChoice[]) : []),
    [voteChoicesRes?.data?.data]
  );

  // tổng hợp YES/NO + info cho panel
  const currentVote = voteId ? groupVotes.find((v) => v.id === voteId) ?? null : null;
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
        candidate: currentVote.targetUser
          ? { id: currentVote.targetUser.id, fullName: currentVote.targetUser.fullName }
          : undefined,
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
            {group?.semester && (
              <Badge variant="secondary">
                Học kỳ: {group.semester?.name ?? group.semester?.id ?? String(group.semester)}
              </Badge>
            )}
            {group?.type && <Badge variant="outline">Loại: {String(group.type)}</Badge>}
            {group?.status && (
              <Badge className={statusClass(String(group.status))}>
                Trạng thái: {String(group.status)}
              </Badge>
            )}
          </div>
        </div>
      </div>
    );
  }, [
    isGroupPending,
    groupError,
    groupId,
    group?.id,
    group?.title,
    group?.semester,
    group?.type,
    group?.status,
  ]);

  if (isGroupPending || !groupId || !group) {
    return <div className="bg-background text-foreground flex min-h-screen flex-col">{header}</div>;
  }

  // members mapping
  const rawList: TUser[] = Array.isArray(groupMembersRes?.data?.data)
    ? groupMembersRes.data.data
    : [];
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
        const maybeResponse = (err as { response?: unknown }).response as
          | { data?: { message?: unknown } }
          | undefined;
        const maybeMessage = maybeResponse?.data?.message;
        if (typeof maybeMessage === "string") msg = maybeMessage;
        else if (err instanceof Error && err.message) msg = err.message;
      }
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
        isGroupMembersPending={isGroupMembersPending}
        isLeaving={isLeaving}
        onKick={handleKick}
        onTransfer={handleTransfer}
        onLeave={handleLeave}
        onViewProfile={(id) => navigate(`/student/profile/${id}`)}
      />

      {/* 🔸 DANH SÁCH ỨNG VIÊN (CHỈ VOTE OPEN) – mọi thành viên đều thấy */}
      <Card className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Ứng viên đang mở ({openVotes.length})</h3>
          {isVoteListPending && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>

        {!isVoteListPending && openVotes.length === 0 && (
          <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            Hiện không có ứng viên nào đang mở để bỏ phiếu.
          </div>
        )}

        {!isVoteListPending && openVotes.length > 0 && (
          <div className="grid gap-2">
            {openVotes.map((v) => {
              const active = voteId === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => selectVote(v.id)}
                  className={`w-full rounded-md border p-3 text-left transition-colors hover:bg-muted/40 ${active ? "ring-2 ring-amber-500/60" : ""
                    }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-medium truncate">
                        {v.targetUser?.fullName ?? `Vote #${v.id}`}
                      </div>
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
        <VotesPanel
          isLoading={isVotesPending || !voteId}
          votes={votesForPanel}
          onVote={handleVote}
          isVoting={isVoting}
        />
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
        memberCount={memberCount}
        isChangingType={isChangingType}
        isFinalizing={isFinalizing}
        onChangeType={handleChangeType}
        onFinalize={handleFinalize}
      />
    </div>
  );
}
