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
      avatarUrl: "",
      cvUrl: "",
      major: undefined,
    },
  });

  useEffect(() => {
    if (userData) {
      form.reset({
        avatarUrl: userData.avatarUrl ?? "",
        cvUrl: userData.cvUrl ?? "",
        major: userData.major ?? undefined,
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
    const selectedMajor = majors.find((m) => m.code === value);
    if (selectedMajor) {
      form.setValue("major", selectedMajor);
    }
  };

  const renderViewMode = () => (
    <div className="grid gap-4 py-4">
      <p>
        <strong>Mã SV:</strong> {userData?.studentCode || "N/A"}
      </p>
      <p>
        <strong>Họ tên:</strong> {userData?.fullName}
      </p>
      <p>
        <strong>Email:</strong> {userData?.email}
      </p>
      <p>
        <strong>Chuyên ngành:</strong> {userData?.major?.name || "N/A"}
      </p>
      <p>
        <strong>Vai trò:</strong> {userData?.role}
      </p>
      <p>
        <strong>Trạng thái:</strong>{" "}
        <Badge variant={userData?.isActive ? "default" : "destructive"}>{userData?.isActive ? "Active" : "Inactive"}</Badge>
      </p>
      <p>
        <strong>Avatar:</strong>{" "}
        <a href={userData?.avatarUrl || "#"} target="_blank" rel="noopener noreferrer" className="text-blue-500">
          Link
        </a>
      </p>
      <p>
        <strong>CV:</strong>{" "}
        <a href={userData?.cvUrl || "#"} target="_blank" rel="noopener noreferrer" className="text-blue-500">
          Link
        </a>
      </p>
    </div>
  );

  const renderEditMode = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="avatarUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/avatar.png" {...field} />
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
                <Input placeholder="https://example.com/cv.pdf" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="major"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chuyên ngành</FormLabel>
              <Select onValueChange={handleMajorChange} value={field.value?.code}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chuyên ngành" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {majors.map((major) => (
                    <SelectItem key={major.code} value={major.code}>
                      {major.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
    const nextStatus = userData?.isActive ? "Inactive" : "Active";
    return `Chuyển sang ${nextStatus}`;
  };

  const getToggleRoleButtonText = () => {
    if (isTogglingRole) return "Đang đổi...";
    const nextRole = userData?.role === "LECTURER" ? "MODERATOR" : "LECTURER";
    return `Chuyển sang ${nextRole}`;
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
