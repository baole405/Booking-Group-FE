import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type MemberCardProps = {
  user: {
    id: number;
    fullName: string;
    studentCode?: string | null;
    avatarUrl?: string | null;
  };
};

const getInitials = (name?: string | null) =>
  (name ?? "")
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

export function MemberCard({ user }: MemberCardProps) {
  return (
    <div className="rounded-lg border bg-muted/20 p-3 transition-colors hover:bg-muted/40">
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={user.avatarUrl ?? undefined} alt={user.fullName} />
          <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="truncate font-medium">{user.fullName}</div>
          <div className="text-muted-foreground mt-1 text-xs">
            {user.studentCode?.trim() || "—"}
          </div>
        </div>
      </div>
    </div>
  );
}
