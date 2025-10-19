import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { UserSquare2 } from "lucide-react";
import { useUserHook } from "@/hooks/use-user";
import { useParams } from "react-router-dom";

export default function UserProfileView() {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const { useUserById } = useUserHook();
  const { data, isPending, error } = useUserById(userId);
  const user = data?.data;

  if (isPending) return <p className="text-muted-foreground text-center text-sm">Đang tải...</p>;
  if (error || !user) return <p className="text-center text-red-500">Không tìm thấy người dùng.</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hồ sơ cá nhân</h1>
        <p className="text-muted-foreground text-sm">Thông tin sinh viên</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <UserSquare2 className="h-5 w-5" /> Thông tin cơ bản
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Avatar className="h-28 w-28">
              {user?.avatarUrl && <img src={user.avatarUrl} alt="User avatar" className="rounded-full" />}
            </Avatar>
            <div className="text-center">
              <div className="font-semibold">{user?.fullName}</div>
              <div className="text-muted-foreground text-sm">{user?.studentCode}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Chi tiết</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Chuyên ngành</p>
              <p className="font-medium">{user?.major?.name ?? "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email ?? "—"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
