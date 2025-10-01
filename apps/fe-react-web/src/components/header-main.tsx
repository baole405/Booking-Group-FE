import { Button } from "@/components/ui/button";
import { logout } from "@/redux/User/user-slice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const HeaderMain = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
          <div className="flex flex-col">
            <span className="text-lg leading-none font-semibold tracking-tight">Co-found</span>
            <span className="text-muted-foreground text-sm">Campus experience platform</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="text-muted-foreground hidden items-center gap-6 text-sm md:flex">
          <Link to="/" className="hover:text-foreground transition-colors">
            Ghép Nhóm
          </Link>
          <Link to="/student/forum" className="hover:text-foreground transition-colors">
            Diễn Đàn
          </Link>
          <Link to="/stories" className="hover:text-foreground transition-colors">
            Ý tưởng
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button size="sm" asChild>
            <Link to="/book-demo">Nhóm của bạn</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/student/profile">Thông tin cá nhân</Link>
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
