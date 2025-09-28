import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, BookText, Home, Mail, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-[#fff6ee]">
      {/* Header */}
      <header className="flex w-full items-center justify-between rounded-b-2xl bg-[#ff9800] px-8 py-3 shadow">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-full bg-white p-2 text-[#ff9800]" onClick={() => navigate("/")}>
            <Home className="h-6 w-6" />
          </Button>
          <span className="text-lg font-bold text-white">Home</span>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <input type="text" placeholder="Tìm kiếm" className="mr-8 w-64 rounded-full bg-white px-4 py-2 text-gray-700" />
        </div>
        <div className="flex items-center gap-4">
          <button className="relative rounded-full bg-white p-2">
            <Bell className="h-5 w-5 text-[#ff9800]" />
            <span className="absolute top-0 right-0 rounded-full bg-red-500 px-1 text-xs text-white">2</span>
          </button>
          <Avatar className="flex h-8 w-8 items-center justify-center bg-[#ff9800] font-bold text-white">C</Avatar>
        </div>
      </header>
      {/* Main content */}
      <main className="flex flex-1 items-center justify-center py-8">
        <div className="flex w-full max-w-4xl gap-8">
          {/* Left: Avatar & Name */}
          <Card className="flex w-1/2 flex-col items-center justify-center rounded-2xl bg-[#ffe3c1] p-8 shadow">
            <Avatar className="mb-4 flex h-32 w-32 items-center justify-center bg-[#ff9800] text-6xl font-bold text-white">C</Avatar>
            <div className="mt-4 rounded-lg bg-white px-4 py-2 text-center font-semibold shadow">
              Cao Nguyen Hoai Nam
              <br />
              (K17 HCM)
            </div>
          </Card>
          {/* Right: Personal Info */}
          <Card className="flex flex-1 flex-col gap-6 rounded-2xl bg-white p-8 shadow">
            <h2 className="mb-4 text-center text-2xl font-bold text-[#ff9800]">Thông tin cá nhân</h2>
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="fullname" className="mb-1 flex items-center gap-2 font-semibold text-[#ff9800]">
                  <User className="h-4 w-4" /> Họ và tên
                </Label>
                <Input id="fullname" type="text" value="Cao Nguyen Hoai Nam" className="bg-[#fff6ee]" readOnly />
              </div>
              <div>
                <Label htmlFor="mssv" className="mb-1 flex items-center gap-2 font-semibold text-[#ff9800]">
                  <BookText className="h-4 w-4" /> MSSV
                </Label>
                <Input id="mssv" type="text" value="SE171807" className="bg-[#fff6ee]" readOnly />
              </div>
              <div>
                <Label htmlFor="major" className="mb-1 flex items-center gap-2 font-semibold text-[#ff9800]">
                  <BookText className="h-4 w-4" /> Chuyên ngành
                </Label>
                <Input id="major" type="text" value="Kỹ thuật phần mềm" className="bg-[#fff6ee]" readOnly />
              </div>
              <div>
                <Label htmlFor="email" className="mb-1 flex items-center gap-2 font-semibold text-[#ff9800]">
                  <Mail className="h-4 w-4" /> Email
                </Label>
                <Input id="email" type="email" value="NamCNHSE171807@fpt.edu.vn" className="bg-[#fff6ee]" readOnly />
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
