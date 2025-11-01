import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/route.constant";
import { useTeacherCheckpointsHook } from "@/hooks/use-teacher-checkpoints";
import { logout } from "@/redux/User/user-slice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const HeaderLecture = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔹 Lấy danh sách yêu cầu chấm checkpoint đang chờ
  const { usePendingRequests } = useTeacherCheckpointsHook();
  const { data, isPending } = usePendingRequests();

  // data shape: { status, message, data: CheckpointRequest[] }
  const requests = Array.isArray(data?.data?.data) ? data?.data?.data : [];
  const pendingCount = requests.length; // Tất cả requests trong này đều là PENDING

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
          <Link to={ROUTES.LECTURER.GROUPS} className="hover:text-foreground transition-colors">
            Nhóm
          </Link>

          <Link to={ROUTES.LECTURER.FORUMS} className="hover:text-foreground transition-colors">
            Diễn Đàn
          </Link>

          <Link to={ROUTES.LECTURER.IDEAS} className="hover:text-foreground transition-colors">
            Ý tưởng
          </Link>

          {/* 🔹 Yêu cầu chấm checkpoint + badge */}
          <Link to={ROUTES.LECTURER.CHECKPOINT_REQUESTS} className="hover:text-foreground relative inline-flex items-center gap-2 transition-colors">
            Yêu cầu chấm
            {!isPending && pendingCount > 0 && (
              <Badge
                variant="secondary"
                className="rounded-full px-1.5 py-0 text-[10px] leading-none"
                aria-label={`${pendingCount} yêu cầu chấm checkpoint đang chờ`}
              >
                {pendingCount}
              </Badge>
            )}
          </Link>

          {/* 🔹 Duyệt ý tưởng */}
          <Link to={ROUTES.LECTURER.IDEA_REVIEW} className="hover:text-foreground transition-colors">
            Duyệt ý tưởng
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button size="sm" asChild>
            <Link to={ROUTES.LECTURER.MY_PROFILE}>Thông tin cá nhân</Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default HeaderLecture;
