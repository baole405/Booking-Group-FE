import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type MemberCardProps = {
  user: {
    id: number;
    fullName: string;
    studentCode?: string | null; // 👈 cho phép null/undefined
    avatarUrl?: string | null; // 👈 cho phép null/undefined
  };
  role?: "LEADER" | "MEMBER";
  highlight?: boolean;
};

const getInitials = (name?: string) =>
  (name ?? "")
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

export function MemberCard({ user, role = "MEMBER", highlight = false }: MemberCardProps) {
  const isLeader = role === "LEADER";
  const initials = getInitials(user.fullName);

  return (
    <div
      className={`rounded-lg border p-3 transition-colors ${
        highlight ? "bg-emerald-50/50 hover:bg-emerald-100/60" : "bg-muted/20 hover:bg-muted/40"
      }`}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          {/* AvatarImage chấp nhận src rỗng; nếu null sẽ fallback */}
          <AvatarImage src={user.avatarUrl ?? ""} alt={user.fullName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <div className="truncate font-medium">{user.fullName}</div>
          <div className="mt-1 flex items-center gap-2">
            {isLeader ? (
              <Badge variant="secondary" className="border-emerald-200 bg-emerald-100 text-emerald-700">
                Trưởng nhóm
              </Badge>
            ) : (
              <Badge variant="outline">Thành viên</Badge>
            )}
            <span className="text-muted-foreground text-xs">
              {user.studentCode ?? "—"} {/* 👈 nếu null -> hiển thị “—” */}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
