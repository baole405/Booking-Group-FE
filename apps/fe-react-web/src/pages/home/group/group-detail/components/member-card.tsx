import { useSelector } from "react-redux";
import { MoreVertical, Eye } from "lucide-react";
import type { RootState } from "@/redux/store";
import { useRoleNavigate } from "@/hooks/useRoleNavigate";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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
  const userRole = useSelector((state: RootState) => state.user.role);
  const isLecturer = userRole === "LECTURER";
  const roleNavigate = useRoleNavigate();

  const handleViewProfile = () => {
    roleNavigate(`/profile/${user.id}`);
  };

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

        {/* Menu dropdown - hiển thị cho cả STUDENT và LECTURER */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-muted/60"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Mở menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleViewProfile} className="cursor-pointer">
              <Eye className="mr-2 h-4 w-4" />
              {isLecturer ? "Xem chi tiết sinh viên" : "Xem thông tin thành viên"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
