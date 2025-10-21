import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserSquare2, Mail, BookOpen, Hash } from "lucide-react";
import { useUserHook } from "@/hooks/use-user";
import { useParams } from "react-router-dom";

export default function UserProfileView() {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const { useUserById } = useUserHook();
  const { data, isPending, error } = useUserById(userId);

  const user = data?.data;

  if (isPending)
    return (
      <p className="text-center text-sm text-muted-foreground mt-10">
        Đang tải thông tin người dùng...
      </p>
    );

  if (error || !user)
    return (
      <p className="text-center text-red-500 mt-10">
        Không tìm thấy người dùng.
      </p>
    );

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Hồ sơ cá nhân</h1>
        <p className="text-sm text-muted-foreground">
          Thông tin chi tiết của sinh viên
        </p>
      </div>

      {/* Layout: Avatar + Details */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Avatar Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <UserSquare2 className="h-5 w-5 text-primary" />
              Thông tin cơ bản
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 pb-5">
            <Avatar className="h-28 w-28 border">
              {user.avatarUrl ? (
                <AvatarImage
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="object-cover"
                />
              ) : (
                <AvatarFallback>
                  {(user.fullName ?? "U")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="text-center">
              <div className="font-semibold text-base">{user.fullName}</div>
              <div className="text-sm text-muted-foreground">
                {user.studentCode ?? "—"}
              </div>
              <div className="mt-1 text-xs text-emerald-700">
                {user.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Chi tiết người dùng
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 text-sm">
            <div>
              <p className="flex items-center gap-1 text-muted-foreground">
                <BookOpen className="h-4 w-4 text-primary" /> Chuyên ngành
              </p>
              <p className="font-medium mt-1">{user.major?.name ?? "—"}</p>
            </div>

            <div>
              <p className="flex items-center gap-1 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" /> Email
              </p>
              <p className="font-medium mt-1 break-all">{user.email ?? "—"}</p>
            </div>

            <div>
              <p className="flex items-center gap-1 text-muted-foreground">
                <Hash className="h-4 w-4 text-primary" /> Vai trò
              </p>
              <p className="font-medium mt-1 uppercase">
                {user.role ?? "STUDENT"}
              </p>
            </div>

            {user.cvUrl && (
              <div>
                <p className="flex items-center gap-1 text-muted-foreground">
                  <BookOpen className="h-4 w-4 text-primary" /> CV (URL)
                </p>
                <a
                  href={user.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm font-medium hover:underline break-all"
                >
                  {user.cvUrl}
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
