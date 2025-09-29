import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BookOpen, Layers, LogOut, User, Users } from "lucide-react";
import { Outlet, useNavigate } from "react-router-dom";

export default function ModeratorHomePage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col bg-[#f8fafc]">
      {/* Header */}
      <header className="flex items-center justify-between bg-[#ff9800] px-8 py-4 shadow">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 bg-white font-bold text-[#ff9800]">M</Avatar>
          <span className="text-2xl font-bold text-white">EXE Booking Moderator</span>
        </div>
      </header>
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="flex w-64 flex-col gap-2 border-r bg-white px-4 py-8 shadow-lg">
          <Button variant="ghost" className="justify-start gap-2 text-[#ff9800]" onClick={() => navigate("/moderator/home/forum")}>
            {" "}
            <Layers className="h-5 w-5" /> Diễn đàn{" "}
          </Button>
          <Button variant="ghost" className="justify-start gap-2 text-[#ff9800]" onClick={() => navigate("/moderator/home/groups")}>
            <Users className="h-5 w-5" /> Nhóm sinh viên
          </Button>
          <Button variant="ghost" className="justify-start gap-2 text-[#ff9800]" onClick={() => navigate("/moderator/lecturers")}>
            {" "}
            <User className="h-5 w-5" /> Giảng viên{" "}
          </Button>
          <Button variant="ghost" className="justify-start gap-2 text-[#ff9800]" onClick={() => navigate("/moderator/students")}>
            {" "}
            <User className="h-5 w-5" /> Sinh viên{" "}
          </Button>
          <Button variant="ghost" className="justify-start gap-2 text-[#ff9800]" onClick={() => navigate("/profile")}>
            {" "}
            <BookOpen className="h-5 w-5" /> Hồ sơ cá nhân{" "}
          </Button>
          <div className="mt-8">
            <Button
              variant="destructive"
              className="w-full justify-center gap-2"
              onClick={() => {
                /* handle logout */
              }}
            >
              {" "}
              <LogOut className="h-5 w-5" /> Đăng xuất{" "}
            </Button>
          </div>
        </aside>
        {/* Main Content: Outlet sẽ render nội dung động */}
        <main className="flex flex-1 flex-col items-center justify-center p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
