import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMajorHook } from "@/hooks/use-major";
import { useUserHook } from "@/hooks/use-user";
import { UpdateUserSchema, type TUpdateUserSchema, type TUser } from "@/schema/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface UserDetailDialogProps {
  userId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserRole?: TUser["role"];
}

export function UserDetailDialog({ userId, open, onOpenChange, currentUserRole }: UserDetailDialogProps) {
  const { useUserById, useUpdateUser, useUpdateStatus, useToggleLecturerModeratorRole } = useUserHook();
  const { useMajorList } = useMajorHook();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: selectedUserResponse,
    isLoading: userLoading,
    refetch: refetchUser,
  } = useUserById(userId ?? 0, {
    enabled: !!userId && open,
  });
  const { data: majorsResponse } = useMajorList();

  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser(userId ?? 0);
  const { mutate: updateStatus, isPending: statusUpdating } = useUpdateStatus(userId ?? 0);
  const { mutate: toggleRole, isPending: isTogglingRole } = useToggleLecturerModeratorRole();

  const userData = selectedUserResponse?.data;
  const majors = majorsResponse?.data?.data ?? [];

  const form = useForm<TUpdateUserSchema>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      avatarUrl: null,
      cvUrl: null,
      majorId: null,
    },
  });

  useEffect(() => {
    if (userData) {
      form.reset({
        avatarUrl: userData.avatarUrl ?? null,
        cvUrl: userData.cvUrl ?? null,
        majorId: userData.major?.id ?? null,
      });
    }
    if (!open) {
      setIsEditing(false);
    }
  }, [userData, open, form]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const onSubmit = (data: TUpdateUserSchema) => {
    updateUser(data, {
      onSuccess: () => {
        toast.success("Cập nhật người dùng thành công!");
        setIsEditing(false);
        refetchUser();
        queryClient.invalidateQueries({ queryKey: ["userList"] });
      },
      onError: () => {
        toast.error("Cập nhật người dùng thất bại!");
      },
    });
  };

  const handleChangeStatus = () => {
    updateStatus(undefined, {
      onSuccess: () => {
        toast.success("Cập nhật trạng thái thành công!");
        refetchUser();
        queryClient.invalidateQueries({ queryKey: ["userList"] });
      },
      onError: () => {
        toast.error("Cập nhật trạng thái thất bại!");
      },
    });
  };

  const handleToggleRole = () => {
    if (userId) {
      toggleRole(userId, {
        onSuccess: () => {
          toast.success("Thay đổi vai trò thành công!");
          refetchUser();
          queryClient.invalidateQueries({ queryKey: ["userList"] });
        },
        onError: () => {
          toast.error("Thay đổi vai trò thất bại!");
        },
      });
    }
  };

  const handleMajorChange = (value: string) => {
    const selectedMajor = majors.find((m) => m.id.toString() === value);
    if (selectedMajor) {
      form.setValue("majorId", selectedMajor.id);
    } else if (value === "none") {
      form.setValue("majorId", null);
    }
  };

  const renderViewMode = () => (
    <div className="grid gap-6 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Mã SV</p>
          <p className="mt-1 text-sm text-gray-900">{userData?.studentCode || "Chưa có"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Vai trò</p>
          <p className="mt-1">
            <Badge variant="outline">{userData?.role}</Badge>
          </p>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500">Họ tên</p>
        <p className="mt-1 text-sm text-gray-900">{userData?.fullName}</p>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500">Email</p>
        <p className="mt-1 text-sm text-gray-900">{userData?.email}</p>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500">Chuyên ngành</p>
        <p className="mt-1 text-sm text-gray-900">{userData?.major?.name || "Chưa có"}</p>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-500">Trạng thái</p>
        <p className="mt-1">
          <Badge className={userData?.isActive ? "border-green-200 bg-green-100 text-green-800" : "border-red-200 bg-red-100 text-red-800"}>
            {userData?.isActive ? "Hoạt động" : "Tạm khóa"}
          </Badge>
        </p>
      </div>

      {userData?.avatarUrl && (
        <div>
          <p className="text-sm font-medium text-gray-500">Avatar URL</p>
          <a
            href={userData.avatarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 text-sm break-all text-blue-600 hover:text-blue-800 hover:underline"
          >
            {userData.avatarUrl}
          </a>
        </div>
      )}

      {userData?.cvUrl && (
        <div>
          <p className="text-sm font-medium text-gray-500">CV URL</p>
          <a
            href={userData.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 text-sm break-all text-blue-600 hover:text-blue-800 hover:underline"
          >
            {userData.cvUrl}
          </a>
        </div>
      )}
    </div>
  );

  const renderEditMode = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 py-4">
        <FormField
          control={form.control}
          name="majorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chuyên ngành</FormLabel>
              <Select onValueChange={handleMajorChange} value={field.value?.toString() || "none"}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chuyên ngành" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[300px]">
                  <SelectItem value="none">-- Chưa chọn --</SelectItem>
                  {majors.length === 0 ? (
                    <div className="p-2 text-center text-sm text-gray-500">Không có chuyên ngành</div>
                  ) : (
                    majors.map((major) => (
                      <SelectItem key={major.id} value={major.id.toString()}>
                        {major.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="avatarUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/avatar.png" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cvUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CV URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/cv.pdf" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );

  const renderDialogContent = () => {
    if (userLoading) {
      return (
        <div className="py-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
          <p className="mt-2">Đang tải...</p>
        </div>
      );
    }
    return isEditing ? renderEditMode() : renderViewMode();
  };

  const getStatusButtonText = () => {
    if (statusUpdating) return "Đang cập nhật...";
    return userData?.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản";
  };

  const getToggleRoleButtonText = () => {
    if (isTogglingRole) return "Đang đổi...";
    const nextRole = userData?.role === "LECTURER" ? "MODERATOR" : "LECTURER";
    const roleMap: Record<string, string> = {
      LECTURER: "Giảng viên",
      MODERATOR: "Điều hành viên",
    };
    return `Chuyển sang ${roleMap[nextRole]}`;
  };

  const showToggleRoleButton = currentUserRole === "ADMIN" && (userData?.role === "LECTURER" || userData?.role === "MODERATOR");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Chỉnh sửa người dùng" : "Chi tiết người dùng"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Cập nhật thông tin người dùng." : "Xem thông tin chi tiết và quản lý trạng thái người dùng."}
          </DialogDescription>
        </DialogHeader>

        {renderDialogContent()}

        <DialogFooter>
          {isEditing ? (
            <>
              <Button onClick={() => setIsEditing(false)} variant="outline">
                Hủy
              </Button>
              <Button onClick={form.handleSubmit(onSubmit)} disabled={isUpdating}>
                {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleClose} variant="outline">
                Đóng
              </Button>
              <Button onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
              <Button onClick={handleChangeStatus} disabled={statusUpdating}>
                {getStatusButtonText()}
              </Button>
              {showToggleRoleButton && (
                <Button onClick={handleToggleRole} disabled={isTogglingRole}>
                  {getToggleRoleButtonText()}
                </Button>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
