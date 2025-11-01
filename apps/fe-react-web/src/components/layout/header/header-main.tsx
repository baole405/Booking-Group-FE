import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGroupHook } from "@/hooks/use-group";
import { useInviteHook } from "@/hooks/use-invite";
import { logout } from "@/redux/User/user-slice";
import type { TJoinGroup } from "@/schema/group.schema";
import type { TInvite } from "@/schema/invite.schema";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const HeaderMain = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔹 Lấy danh sách yêu cầu tham gia đã gửi của tôi
  const { useGetMyJoinRequests } = useGroupHook();
  const { data, isPending } = useGetMyJoinRequests();

  // 🔹 Lấy danh sách lời mời
  const { useMyInvites } = useInviteHook();
  const { data: invitesData, isPending: isInvitesPending } = useMyInvites({
    receivedPage: 1,
    receivedSize: 100,
    sentPage: 1,
    sentSize: 100,
  });

  // data shape: { status, message, data: JoinRequest[] }
  const requests: TJoinGroup[] = Array.isArray(data?.data?.data) ? data.data.data : [];
  const pendingJoinCount = requests.filter((r) => String(r?.status).toUpperCase() === "PENDING").length;

  // Lời mời nhận được chưa xử lý
  const receivedInvites = invitesData?.data?.data?.received?.content || [];
  const pendingInviteCount = receivedInvites.filter((inv: TInvite) => inv.status === "PENDING").length;

  const totalPendingCount = pendingJoinCount + pendingInviteCount;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth/login", { replace: true });
  };

  return (
    <header className="border-border/60 bg-background/80 border-b backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        {/* Logo + Title */}
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold tracking-tight uppercase">
            Co-found
          </div>
        </Link>

        {/* Navigation */}
        <nav className="text-muted-foreground hidden items-center gap-6 text-sm md:flex">
          <Link to="/student/groups" className="hover:text-foreground transition-colors">
            Ghép Nhóm
          </Link>

          <Link to="/student/forum" className="hover:text-foreground transition-colors">
            Diễn Đàn
          </Link>

          <Link to="/student/ideas" className="hover:text-foreground transition-colors">
            Ý tưởng
          </Link>

          {/* 🔹 Quản lý lời mời + badge */}
          <Link to="/student/invites" className="hover:text-foreground relative inline-flex items-center gap-2 transition-colors">
            Quản lý lời mời
            {!isPending && !isInvitesPending && totalPendingCount > 0 && (
              <Badge
                variant="secondary"
                className="rounded-full px-1.5 py-0 text-[10px] leading-none"
                aria-label={`${totalPendingCount} lời mời đang chờ`}
              >
                {totalPendingCount}
              </Badge>
            )}
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button size="sm" asChild>
            <Link to="/student/mygroup">Nhóm của bạn</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/student/myprofile">Thông tin cá nhân</Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default HeaderMain;
