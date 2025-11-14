import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, User } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const MOCK = {
  GV001: { id: "GV001", name: "Nguyễn Văn Mentor", email: "mentor1@fpt.edu.vn", department: "SE", title: "ThS." },
  GV002: { id: "GV002", name: "Lê Thị Teacher", email: "teacher2@fpt.edu.vn", department: "AI", title: "TS." },
};

export default function ModeratorLecturerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lecturer = id && MOCK && typeof MOCK === "object" && id in MOCK ? (MOCK as Record<string, unknown>)[id] : null;

  if (!lecturer) {
    return <div className="text-muted-foreground flex min-h-[50vh] items-center justify-center">Không tìm thấy giảng viên.</div>;
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Hồ sơ giảng viên</h1>
        <p className="text-muted-foreground text-sm">Mã GV {lecturer.id}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Avatar className="h-28 w-28" />
            <div className="text-center">
              <div className="font-semibold">{lecturer.name}</div>
              <div className="text-muted-foreground text-sm">{lecturer.department}</div>
            </div>
            <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
              Quay lại
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Chi tiết</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullname" className="flex items-center gap-2">
                  <User className="h-4 w-4" /> Họ và tên
                </Label>
                <Input id="fullname" value={lecturer.name} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="magv" className="flex items-center gap-2">
                  <User className="h-4 w-4" /> Mã GV
                </Label>
                <Input id="magv" value={lecturer.id} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title" className="flex items-center gap-2">
                  <User className="h-4 w-4" /> Học hàm/học vị
                </Label>
                <Input id="title" value={lecturer.title || ""} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email
                </Label>
                <Input id="email" type="email" value={lecturer.email} readOnly />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
