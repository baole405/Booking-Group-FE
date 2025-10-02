import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpenText, Mail, User, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const MOCK = {
  SE171801: { id: "SE171801", name: "Nguyễn Văn A", email: "a@fpt.edu.vn", cohort: "K17 HCM", major: "Kỹ thuật phần mềm", groupId: "EXE201" },
  SE171802: { id: "SE171802", name: "Trần Thị B", email: "b@fpt.edu.vn", cohort: "K17 HCM", major: "Kỹ thuật phần mềm" },
};

export default function ModeratorStudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const student = (id && (MOCK as any)[id]) || null;

  if (!student) {
    return <div className="text-muted-foreground flex min-h-[50vh] items-center justify-center">Không tìm thấy sinh viên.</div>;
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Hồ sơ sinh viên</h1>
        <p className="text-muted-foreground text-sm">MSSV {student.id}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Avatar className="h-28 w-28" />
            <div className="text-center">
              <div className="font-semibold">{student.name}</div>
              <div className="text-muted-foreground text-sm">{student.cohort}</div>
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
                <Input id="fullname" value={student.name} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mssv" className="flex items-center gap-2">
                  <BookOpenText className="h-4 w-4" /> MSSV
                </Label>
                <Input id="mssv" value={student.id} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="major" className="flex items-center gap-2">
                  <BookOpenText className="h-4 w-4" /> Chuyên ngành
                </Label>
                <Input id="major" value={student.major} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email
                </Label>
                <Input id="email" type="email" value={student.email} readOnly />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4" /> Nhóm
                </Label>
                <Input value={student.groupId ? student.groupId : "Chưa có nhóm"} readOnly />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
