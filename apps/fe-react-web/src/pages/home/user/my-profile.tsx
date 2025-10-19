import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserHook } from "@/hooks/use-user";
import { UserSchema, type TUser } from "@/schema/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpenText, Mail, User, UserSquare2 } from "lucide-react";
import { useForm } from "react-hook-form";

export default function MyProfile() {
  const { useMyProfile } = useUserHook();
  const { data, isPending, error } = useMyProfile();
  // console.log(data);

  // -------------------- Form setup --------------------
  const form = useForm<TUser>({
    resolver: zodResolver(UserSchema),
    values: data?.data || undefined,
  });

  const { register, handleSubmit } = form;

  // Khi submit form (update thông tin)
  const onSubmit = (values: TUser) => {
    console.log("Updated values:", values);
  };

  if (isPending) {
    return <p className="text-muted-foreground text-center text-sm">Đang tải thông tin...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Lỗi khi tải dữ liệu người dùng!</p>;
  }

  const user = data?.data;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Hồ sơ cá nhân</h1>
        <p className="text-muted-foreground text-sm">Thông tin tài khoản sinh viên</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* --------- Thông tin cơ bản --------- */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <UserSquare2 className="h-5 w-5" /> Thông tin cơ bản
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Avatar className="h-28 w-28">{user?.avatarUrl && <img src={user.avatarUrl} alt="User avatar" className="rounded-full" />}</Avatar>
            <div className="text-center">
              <div className="font-semibold">{user?.fullName || "Chưa có tên"}</div>
              <div className="text-muted-foreground text-sm">{user?.studentCode || "Không rõ mã số"}</div>
            </div>
            <Button variant="secondary" size="sm" type="button">
              Cập nhật ảnh
            </Button>
          </CardContent>
        </Card>

        {/* --------- Chi tiết --------- */}
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
                <Input id="fullname" {...register("fullName")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentCode" className="flex items-center gap-2">
                  <BookOpenText className="h-4 w-4" /> MSSV
                </Label>
                <Input id="studentCode" {...register("studentCode")} readOnly />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="major" className="flex items-center gap-2">
                  <BookOpenText className="h-4 w-4" /> Chuyên ngành
                </Label>
                <Input id="major" value={user?.major?.name || ""} readOnly />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email
                </Label>
                <Input id="email" type="email" {...register("email")} readOnly />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button type="submit">Lưu thay đổi</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
