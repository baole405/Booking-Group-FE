import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ListAccountScreen from "@/pages/admin/ListAccountScreen";
import ListLectureScreen from "@/pages/admin/ListLectureScreen";
import ListProjectScreen from "@/pages/admin/ListProjectScreen";
import ListGroupsScreen from "@/pages/admin/ListSemesterScreen";
import ListStudentScreen from "@/pages/admin/ListStudentScreen";
import { logout } from "@/redux/User/user-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const MENU = [
  { label: "Tài khoản", component: <ListAccountScreen /> },
  { label: "Nhóm", component: <ListGroupsScreen /> },
  { label: "Giảng viên", component: <ListLectureScreen /> },
  { label: "Project", component: <ListProjectScreen /> },
  { label: "Sinh viên", component: <ListStudentScreen /> },
];

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth/login", { replace: true });
  };
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <div className="from-background to-muted/30 flex min-h-screen bg-gradient-to-br">
        {/* Sidebar quản lý */}
        <aside className="bg-background/95 border-border/50 flex w-64 flex-col border-r shadow-lg backdrop-blur-sm">
          <div className="border-border/50 from-primary/10 to-primary/5 flex h-16 items-center justify-center border-b bg-gradient-to-r">
            <span className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-xl font-bold tracking-tight text-transparent">
              Admin Panel
            </span>
          </div>
          <nav className="flex-1 px-3 py-6">
            <ul className="space-y-1.5">
              {MENU.map((item, idx) => (
                <li key={item.label}>
                  <button
                    onClick={() => setSelected(idx)}
                    className={`group relative w-full overflow-hidden rounded-lg px-4 py-3 text-left font-medium transition-all duration-200 ${
                      selected === idx
                        ? "bg-primary text-primary-foreground scale-[1.02] shadow-md"
                        : "hover:bg-muted/70 text-foreground/70 hover:text-foreground hover:translate-x-1"
                    }`}
                  >
                    <span className="relative z-10">{item.label}</span>
                    {selected === idx && <div className="from-primary/20 absolute inset-0 bg-gradient-to-r to-transparent" />}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          {/* Profile & Logout at bottom */}
          <div className="border-border/50 bg-muted/20 flex flex-col gap-3 border-t p-4">
            <div className="hover:bg-muted/50 flex items-center gap-3 rounded-lg p-2 transition-colors">
              <div className="from-primary to-primary/60 text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-lg font-bold shadow-md">
                A
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">Admin</div>
                <div className="text-muted-foreground truncate text-xs">admin@email.com</div>
              </div>
            </div>
            <button
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full rounded-lg px-4 py-2.5 font-medium shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98]"
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </div>
        </aside>
        {/* Main Content */}
        <div className="flex min-h-screen flex-1 flex-col">
          <SidebarInset>
            <div className="flex h-full w-full flex-1 justify-end p-3">
              <div className="flex h-full w-full justify-end">
                <div className="bg-background border-border/50 h-full w-full max-w-3xl overflow-hidden rounded-lg border shadow-sm">
                  <div className="h-full w-full">{MENU[selected].component}</div>
                </div>
              </div>
            </div>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
