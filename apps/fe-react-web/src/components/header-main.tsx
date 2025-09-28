import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeaderMain = () => {
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
          <Link to="/features" className="hover:text-foreground transition-colors">
            Các Nhóm
          </Link>
          <Link to="/collections" className="hover:text-foreground transition-colors">
            Diễn Đàn
          </Link>
          <Link to="/stories" className="hover:text-foreground transition-colors">
            Ý tưởng
          </Link>
          <Link to="/dashboard" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button size="sm" asChild>
            <Link to="/book-demo">Nhóm của bạn</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Log out</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default HeaderMain;
