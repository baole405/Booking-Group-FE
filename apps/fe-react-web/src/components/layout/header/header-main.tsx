import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { logout } from "@/redux/User/user-slice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useGroupHook } from "@/hooks/use-group";

const HeaderMain = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔹 Lấy danh sách yêu cầu đã gửi của tôi
  const { useGetMyJoinRequests } = useGroupHook();
  const { data, isPending } = useGetMyJoinRequests();

  // data shape: { status, message, data: JoinRequest[] }
  const requests: any[] = Array.isArray(data?.data?.data) ? data!.data!.data : [];
  const pendingCount = requests.filter((r) => String(r?.status).toUpperCase() === "PENDING").length;

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

          {/* 🔹 Yêu cầu đã gửi + badge */}
          <Link
            to="/student/joinrequests"
            className="hover:text-foreground transition-colors relative inline-flex items-center gap-2"
          >
            Yêu cầu đã gửi
            {!isPending && pendingCount > 0 && (
              <Badge
                variant="secondary"
                className="px-1.5 py-0 text-[10px] leading-none rounded-full"
                aria-label={`${pendingCount} yêu cầu đang chờ`}
              >
                {pendingCount}
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
