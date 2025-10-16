import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpenText, Mail, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type StudentDetail = {
  id: number;
  studentCode: string;
  fullName: string;
  email: string;
  cvUrl: string;
  avatarUrl: string;
  major: { id: number; name: string };
  role: string;
  isActive: boolean;
};

export default function ModeratorStudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetch(`/api/users/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Không tìm thấy sinh viên");
        const json = await res.json();
        setStudent(json.data);
      })
      .catch((err) => setError(err.message || "Lỗi không xác định"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center text-gray-500">Đang tải thông tin sinh viên...</div>;
  }
  if (error || !student) {
    return <div className="text-muted-foreground flex min-h-[50vh] items-center justify-center">{error || "Không tìm thấy sinh viên."}</div>;
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Hồ sơ sinh viên</h1>
        <p className="text-muted-foreground text-sm">MSSV {student.studentCode}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Avatar className="h-28 w-28">
              {student.avatarUrl && <img src={student.avatarUrl} alt={student.fullName} className="h-28 w-28 rounded-full object-cover" />}
            </Avatar>
            <div className="text-center">
              <div className="font-semibold">{student.fullName}</div>
              <div className="text-muted-foreground text-sm">{student.major?.name}</div>
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
                <Input id="fullname" value={student.fullName} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mssv" className="flex items-center gap-2">
                  <BookOpenText className="h-4 w-4" /> MSSV
                </Label>
                <Input id="mssv" value={student.studentCode} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="major" className="flex items-center gap-2">
                  <BookOpenText className="h-4 w-4" /> Chuyên ngành
                </Label>
                <Input id="major" value={student.major?.name || "-"} readOnly />
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
                {/* Không có groupId trong API mẫu, có thể bổ sung nếu backend trả về */}
                <Input value={"Chưa có nhóm"} readOnly />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
