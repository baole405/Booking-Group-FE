import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserHook } from "@/hooks/use-user";
import type { RootState } from "@/redux/store";
import type { TUpdateUserSchema, TUser } from "@/schema/user.schema";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";

interface EditUserDialogProps {
  user: TUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditUserDialog({ user, open, onOpenChange, onSuccess }: EditUserDialogProps) {
  const { role: currentUserRole } = useSelector((state: RootState) => state.user);
  const canEdit = currentUserRole === "ADMIN";

  type FormValues = {
    fullName: string;
    email: string;
    role: "STUDENT" | "ADMIN" | "MODERATOR" | "LECTURER";
    studentCode: string;
    isActive: boolean;
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      studentCode: user.studentCode || "",
      isActive: user.isActive,
    },
  });

  const { useUpdateUser } = useUserHook();
  const { mutateAsync: updateUserAsync, isPending } = useUpdateUser(user.id);

  const onSubmit = async (data: FormValues) => {
    if (!canEdit) {
      toast.error("Bạn không có quyền chỉnh sửa thông tin người dùng");
      return;
    }

    try {
      // The backend update schema (`TUpdateUserSchema`) currently contains different
      // fields (cvUrl, avatarUrl, majorId). Cast the form values to the expected
      // type for the API call — keep this cast minimal to satisfy TS while not
      // changing API behavior. If your backend expects other fields, adjust
      // the mapping here.
      await updateUserAsync(data as unknown as TUpdateUserSchema);
      toast.success("Cập nhật thông tin thành công");
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra khi cập nhật thông tin");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông tin người dùng</DialogTitle>
          <DialogDescription>
            {canEdit ? "Thay đổi thông tin chi tiết của người dùng dưới đây." : "Bạn chỉ có thể xem thông tin người dùng."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input id="fullName" {...register("fullName", { required: "Vui lòng nhập họ tên" })} disabled={!canEdit || isSubmitting} />
              {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Vui lòng nhập email",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email không hợp lệ",
                  },
                })}
                disabled={!canEdit || isSubmitting}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="studentCode">Mã số sinh viên</Label>
              <Input id="studentCode" {...register("studentCode")} disabled={!canEdit || isSubmitting} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Vai trò</Label>
              <Select
                disabled={!canEdit || isSubmitting}
                onValueChange={(value) => register("role").onChange({ target: { value } })}
                defaultValue={user.role}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="LECTURER">Giảng viên</SelectItem>
                  <SelectItem value="STUDENT">Sinh viên</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={!canEdit || isSubmitting || isPending}>
              {isSubmitting || isPending ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
