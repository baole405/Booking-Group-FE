// pages/home/group/my-group/my-group-page.tsx
import { useUserHook } from "@/hooks/use-user";
import type { RootState } from "@/redux/store";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import GroupContent from "./components/group-content";

type GroupMinimal = {
  id: number;
  title: string;
  description?: string | null;
  leader?: {
    id: number;
    fullName: string;
    studentCode?: string | null;
    avatarUrl?: string | null;
  } | null;
};

export default function MyGroupPage() {
  const userId = useSelector((s: RootState) => s.user.userId);
  const { useMyGroupId } = useUserHook();

  const { data: groupRes, isPending: isGroupPending, error: groupError } = useMyGroupId(userId);

  // Nếu BE trả 400 (User is not in the group) thì groupRes?.data?.data sẽ không có
  const group = groupRes?.data?.data ?? null;
  const groupId = group?.id ?? 0;

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

  // Nếu chưa có groupId ⇒ KHÔNG mount child ⇒ KHÔNG gọi hook nào khác
  if (isGroupPending || !groupId || !group) {
    return <div className="bg-background text-foreground flex min-h-screen flex-col">{header}</div>;
  }
  const minimalGroup: GroupMinimal = {
    id: group.id as number,
    title: group.title,
    description: group.description ?? null,
    leader: group.leader
      ? {
          id: group.leader.id,
          fullName: group.leader.fullName,
          studentCode: group.leader.studentCode ?? null,
          avatarUrl: group.leader.avatarUrl ?? null,
        }
      : null,
  };

  // Có groupId ⇒ render child, child mới gọi hook ideas
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)_/_12%)_0,_transparent_55%)]"
        aria-hidden
      />
      {header}
      <GroupContent group={minimalGroup} />
    </div>
  );
}
