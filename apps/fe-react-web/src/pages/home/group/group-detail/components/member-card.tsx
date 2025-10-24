type MemberCardProps = {
  user: {
    id: number;
    fullName: string;
    studentCode?: string | null;
    avatarUrl?: string | null;
    major?: {
      id: number;
      name: string;
    } | null;
  };
  isThisUserTheLeader?: boolean;
};

export function MemberCard({ user, isThisUserTheLeader = false }: MemberCardProps) {
  return (
    <div className="rounded-lg border bg-muted/20 p-3 transition-all hover:bg-muted/40 hover:shadow-sm">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          {isThisUserTheLeader && (
            <div className="mb-1">
              <span className="rounded bg-yellow-200 px-2 py-[1px] text-[10px] font-semibold text-yellow-800">
                LEADER
              </span>
            </div>
          )}
          <div className="truncate text-sm font-medium">{user.fullName}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            {user.studentCode?.trim() || "—"}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {user.major?.name?.trim() || "—"}
          </div>
        </div>
      </div>
    </div>
  );
}
