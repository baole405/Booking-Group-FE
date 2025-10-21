import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useUserHook } from "@/hooks/use-user";
import { useMajorHook } from "@/hooks/use-major";
import { UserSquare2, Image } from "lucide-react";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { TUpdateUserSchema } from "@/schema/user.schema";
import type { TMajor } from "@/schema/major.schema";
import { useQueryClient } from "@tanstack/react-query";

export default function MyProfile() {
  const { useMyProfile, useUpdateMyProfile } = useUserHook();
  const { useMajorList } = useMajorHook();
  const qc = useQueryClient();
  // 🔹 Fetch dữ liệu người dùng & chuyên ngành
  const { data, isPending, error } = useMyProfile();
  const { data: majorListRes, isPending: isMajorPending } = useMajorList();
  const { mutateAsync: updateUserAsync, isPending: isUpdating } = useUpdateMyProfile();

  const majorList = majorListRes?.data.data ?? [];
  const user = data?.data;

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  // -------------------- Form setup --------------------
  const form = useForm<{ cvUrl: string | null; avatarUrl: string | null; majorId: number | null }>(
    {
      defaultValues: {
        cvUrl: user?.cvUrl ?? null,
        avatarUrl: user?.avatarUrl ?? null,
        majorId: user?.major?.id ?? null,
      },
    }
  );

  const { register, handleSubmit, setValue, watch, reset } = form;

  // Khi user hoặc data load lại thì reset form
  useEffect(() => {
    if (user) {
      reset({
        cvUrl: user.cvUrl ?? null,
        avatarUrl: user.avatarUrl ?? null,
        majorId: user.major?.id ?? null,
      });
    }
  }, [user, reset]);

  // -------------------- Avatar preview logic --------------------
  const renderAvatarPreview = useMemo(() => {
    if (selectedAvatar)
      return <img src={selectedAvatar} className="rounded-full object-cover" alt="Preview" />;

    if (user?.avatarUrl)
      return <img src={user.avatarUrl} className="rounded-full object-cover" alt="Avatar" />;

    return (
      <div className="flex h-full w-full items-center justify-center bg-muted rounded-full text-sm text-muted-foreground">
        No Avatar
      </div>
    );
  }, [selectedAvatar, user?.avatarUrl]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setSelectedAvatar(base64);
        setValue("avatarUrl", base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // -------------------- Submit Update --------------------
  // -------------------- Submit Update --------------------
  const onSubmit = async (values: TUpdateUserSchema) => {
    try {
      await updateUserAsync(values);
      toast.success("Cập nhật thông tin thành công!");

      // ✅ Refetch lại thông tin user từ server
      await qc.invalidateQueries({ queryKey: ["myProfile"] });

      setOpenEdit(false);
    } catch (err) {
      console.error(err);
      toast.error("Không thể cập nhật thông tin!");
    }
  };


  // -------------------- Loading / Error --------------------
  if (isPending)
    return <p className="text-muted-foreground text-center text-sm">Đang tải thông tin...</p>;
  if (error)
    return <p className="text-center text-red-500">Lỗi khi tải dữ liệu người dùng!</p>;

  const selectedMajor = watch("majorId") ?? user?.major?.id ?? "";

  // -------------------- JSX --------------------
  return (
    <div className="flex w-full flex-col gap-6">
      {/* Tiêu đề */}
      <div className="space-y-1 pl-2">
        <h1 className="text-2xl font-bold tracking-tight">Hồ sơ cá nhân</h1>

      </div>

      {/* Card chính */}
      <Card className="p-6 relative md:w-2/7 w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <UserSquare2 className="h-5 w-5" /> Thông tin người dùng
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-4 pb-5">
          {/* Avatar */}
          <Avatar className="h-28 w-28">{renderAvatarPreview}</Avatar>

          {/* Basic Info */}
          <div className="text-center">
            <div className="font-semibold text-base">
              {user?.fullName || "Chưa có tên"}
            </div>
            <div className="text-muted-foreground text-xs">
              {user?.studentCode || "Không rõ mã số"}
            </div>
          </div>

          {/* Detail fields */}
          <div className="w-full space-y-3 text-sm mt-4">
            <div>
              <Label className="text-xs">Email</Label>
              <Input value={user?.email ?? ""} readOnly />
            </div>

            <div>
              <Label className="text-xs">Chuyên ngành</Label>
              <Input value={user?.major?.name ?? "Chưa có chuyên ngành"} readOnly />
            </div>

            {user?.cvUrl && (
              <div>
                <Label className="text-xs">CV</Label>
                <Input value={user.cvUrl} readOnly />
              </div>
            )}
          </div>

          {/* Nút mở dialog cập nhật */}
          <div className="mt-6 w-full flex justify-end">
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
              <DialogTrigger asChild>
                <Button size="sm">Cập nhật thông tin</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Cập nhật hồ sơ</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Avatar */}
                  <div className="flex flex-col items-center gap-3">
                    <Avatar className="h-24 w-24">{renderAvatarPreview}</Avatar>

                    <Button variant="outline" size="sm" type="button" asChild>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Image className="h-4 w-4" />
                        Chọn ảnh mới
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                      </label>
                    </Button>
                  </div>

                  {/* Chuyên ngành */}
                  <div>
                    <Label className="text-xs">Chuyên ngành</Label>
                    <Select
                      onValueChange={(value) => setValue("majorId", Number(value))}
                      value={String(selectedMajor)}
                      disabled={isMajorPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn chuyên ngành" />
                      </SelectTrigger>
                      <SelectContent>
                        {majorList.map((m: TMajor) => (
                          <SelectItem key={m.id} value={String(m.id)}>
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* CV */}
                  <div>
                    <Label className="text-xs">CV (URL)</Label>
                    <Input
                      {...register("cvUrl")}
                      placeholder="Nhập đường dẫn CV..."
                      className="text-sm"
                    />
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpenEdit(false)}
                      disabled={isUpdating}
                    >
                      Hủy
                    </Button>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
