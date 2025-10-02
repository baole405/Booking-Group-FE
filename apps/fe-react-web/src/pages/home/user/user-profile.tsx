import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpenText, Mail, User, UserSquare2 } from "lucide-react";

export default function UserProfile() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Hồ sơ cá nhân</h1>
        <p className="text-muted-foreground text-sm">Thông tin tài khoản sinh viên</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <UserSquare2 className="h-5 w-5" /> Thông tin cơ bản
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Avatar className="h-28 w-28">{/* Avatar image slot kept empty for now */}</Avatar>
            <div className="text-center">
              <div className="font-semibold">Nguyen Van A</div>
              <div className="text-muted-foreground text-sm">K17 - HCM</div>
            </div>
            <Button variant="secondary" size="sm">
              Cập nhật ảnh
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
                <Input id="fullname" value="Nguyen Van A" readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mssv" className="flex items-center gap-2">
                  <BookOpenText className="h-4 w-4" /> MSSV
                </Label>
                <Input id="mssv" value="SE201141" readOnly />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="major" className="flex items-center gap-2">
                  <BookOpenText className="h-4 w-4" /> Chuyên ngành
                </Label>
                <Input id="major" value="Kỹ thuật phần mềm" readOnly />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email
                </Label>
                <Input id="email" type="email" value="dhebse201141@fpt.edu.vn" readOnly />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
