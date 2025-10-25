import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useIdeaHook } from "@/hooks/use-idea";
import { useGroupHook } from "@/hooks/use-group";
import {
  CreateIdeaSchema,
  type TIdea,
  type TCreateIdea,
  type TUpdateIdea,
} from "@/schema/ideas.schema";
import {
  UpdateInformationGroupSchema,
  type TUpdateInformationGroup,
} from "@/schema/group.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { IdeasList } from "./ideas-card";

type GroupMinimal = {
  id: number;
  title: string;
  description?: string | null;
  status?: "ACTIVE" | "DONE" | string;
};

interface GroupContentProps {
  group: GroupMinimal;
  aside?: ReactNode;
  isLeader?: boolean;

  // ✅ props mới để điều kiện & handler 2 nút
  memberCount?: number;
  isChangingType?: boolean;
  isFinalizing?: boolean;
  onChangeType?: () => Promise<void> | void;
  onFinalize?: () => Promise<void> | void;
}

export default function GroupContent({
  group,
  aside,
  isLeader,
  memberCount = 0,
  isChangingType = false,
  isFinalizing = false,
  onChangeType,
  onFinalize,
}: GroupContentProps) {
  // Hooks
  const { useIdeaListByGroupId, useCreateIdea, useUpdateIdea, useDeleteIdea } = useIdeaHook();
  const { useUpdateGroupInfo } = useGroupHook();

  // Queries & Mutations
  const {
    data: ideasRes,
    isPending: isIdeasPending,
    error: ideasError,
    refetch,
  } = useIdeaListByGroupId(group.id);

  const { mutateAsync: updateGroupInfo, isPending: isUpdating } = useUpdateGroupInfo();
  const { mutateAsync: createIdeaAsync, isPending: isCreating } = useCreateIdea();
  const { mutateAsync: updateIdeaAsync, isPending: isUpdatingIdea } = useUpdateIdea();
  const { mutateAsync: deleteIdeaAsync } = useDeleteIdea();

  // Local state
  const [openUpdateGroup, setOpenUpdateGroup] = useState(false);
  const [openCreateIdea, setOpenCreateIdea] = useState(false);
  const [editingIdea, setEditingIdea] = useState<TIdea | null>(null);

  // Forms
  const groupForm = useForm<TUpdateInformationGroup>({
    resolver: zodResolver(UpdateInformationGroupSchema),
    defaultValues: { title: group.title, description: group.description ?? "" },
  });

  const createIdeaForm = useForm<TCreateIdea>({
    resolver: zodResolver(CreateIdeaSchema),
    defaultValues: { title: "", description: "" },
  });

  const editIdeaForm = useForm<TUpdateIdea>({
    resolver: zodResolver(CreateIdeaSchema),
  });

  // Handlers
  const handleUpdateGroup = async (values: TUpdateInformationGroup) => {
    try {
      await updateGroupInfo(values);
      toast.success("✅ Cập nhật thông tin nhóm thành công!");
      setOpenUpdateGroup(false);
    } catch {
      toast.error("❌ Cập nhật thất bại, vui lòng thử lại.");
    }
  };

  const handleCreateIdea = async (values: TCreateIdea) => {
    try {
      await createIdeaAsync(values);
      toast.success("✨ Tạo ý tưởng mới thành công!");
      createIdeaForm.reset();
      setOpenCreateIdea(false);
      await refetch();
    } catch {
      toast.error("❌ Không thể tạo ý tưởng, vui lòng thử lại.");
    }
  };

  const handleEditIdea = async (values: TUpdateIdea) => {
    if (!editingIdea) return;
    try {
      await updateIdeaAsync({ id: editingIdea.id, data: values });
      toast.success("✅ Cập nhật ý tưởng thành công!");
      setEditingIdea(null);
      await refetch();
    } catch {
      toast.error("❌ Không thể cập nhật ý tưởng!");
    }
  };

  const handleDeleteIdea = async (id: number) => {
    try {
      await deleteIdeaAsync(id);
      toast.success("🗑️ Xóa ý tưởng thành công!");
      await refetch();
    } catch {
      toast.error("❌ Không thể xóa ý tưởng!");
    }
  };

  const ideas = ideasRes?.data?.data ?? [];

  // ✅ Điều kiện hiển thị nút theo yêu cầu
  const isActive = group.status === "ACTIVE";
  const isDone = group.status === "DONE";

  // - Thay đổi trạng thái nhóm: chỉ Leader, members > 3, status = ACTIVE, và chưa DONE
  const canShowChangeTypeBtn = !!isLeader && memberCount > 0 && isActive && !isDone;

  // - Hoàn tất nhóm: chỉ Leader, members > 5, status = ACTIVE, và chưa DONE
  const canShowFinalizeBtn = !!isLeader && memberCount > 0 && isActive && !isDone;

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-6 py-8 md:grid-cols-6">
      <main className="md:col-span-4 space-y-6">
        {/* Group Info */}
        <Card className="p-6 relative">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Mục tiêu của nhóm</h2>

            <div className="flex items-center gap-2">
              {/* Cập nhật thông tin (chỉ Leader) */}
              {isLeader && (
                <Dialog open={openUpdateGroup} onOpenChange={setOpenUpdateGroup}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      Cập nhật thông tin
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Cập nhật thông tin nhóm</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={groupForm.handleSubmit(handleUpdateGroup)}
                      className="space-y-4 mt-2"
                    >
                      <div>
                        <label className="text-sm font-medium">Tên nhóm</label>
                        <Input {...groupForm.register("title")} placeholder="Nhập tên nhóm" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Mô tả nhóm</label>
                        <Textarea {...groupForm.register("description")} rows={3} />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setOpenUpdateGroup(false)}
                          disabled={isUpdating}
                        >
                          Hủy
                        </Button>
                        <Button type="submit" disabled={isUpdating}>
                          {isUpdating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang lưu...
                            </>
                          ) : (
                            "Lưu thay đổi"
                          )}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}

              {/* ✅ Thay đổi trạng thái nhóm (điều kiện) */}
              {canShowChangeTypeBtn && (
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={isChangingType}
                  onClick={() => onChangeType?.()}
                >
                  {isChangingType ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang thay đổi…
                    </>
                  ) : (
                    "Thay đổi trạng thái nhóm"
                  )}
                </Button>
              )}

              {/* ✅ Hoàn tất nhóm (điều kiện) */}
              {canShowFinalizeBtn && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="default"
                      disabled={isFinalizing}
                    >
                      {isFinalizing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang hoàn tất…
                        </>
                      ) : (
                        "Hoàn tất nhóm"
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Xác nhận hoàn tất nhóm</AlertDialogTitle>
                      <AlertDialogDescription>
                        Vui lòng đảm bảo các thành viên trong nhóm có đủ từ 2 chuyên ngành trở lên trước khi hoàn tất nhóm.
                        <br /><br />
                        Sau khi hoàn tất, bạn sẽ không thể thay đổi thông tin nhóm.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isFinalizing}>
                        Hủy
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onFinalize?.()}
                        disabled={isFinalizing}
                      >
                        {isFinalizing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang xử lý...
                          </>
                        ) : (
                          "Xác nhận hoàn tất"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>

          <Separator className="mb-4" />
          <p className="text-foreground/80 text-sm leading-relaxed">
            {group.description || "Chưa có mô tả."}
          </p>
        </Card>

        {/* Ideas Section */}
        <Card className="p-6 relative">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold">Ý tưởng của nhóm</h3>
            {isLeader && (
              <Dialog open={openCreateIdea} onOpenChange={setOpenCreateIdea}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-1 h-4 w-4" /> Thêm ý tưởng
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Thêm ý tưởng mới</DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={createIdeaForm.handleSubmit(handleCreateIdea)}
                    className="space-y-4 mt-2"
                  >
                    <div>
                      <label className="text-sm font-medium">Tiêu đề</label>
                      <Input {...createIdeaForm.register("title")} />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Mô tả</label>
                      <Textarea {...createIdeaForm.register("description")} rows={3} />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpenCreateIdea(false)}
                        disabled={isCreating}
                      >
                        Hủy
                      </Button>
                      <Button type="submit" disabled={isCreating}>
                        {isCreating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang lưu...
                          </>
                        ) : (
                          "Tạo ý tưởng"
                        )}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <IdeasList
            ideas={ideas}
            isLoading={isIdeasPending}
            isError={!!ideasError}
            isLeader={isLeader}
            onEdit={(idea) => {
              editIdeaForm.reset({
                title: idea.title,
                description: idea.description ?? "",
              });
              setEditingIdea(idea);
            }}
            onDelete={(id) => void handleDeleteIdea(id)}
          />
        </Card>
      </main>

      <aside className="md:col-span-2">{aside}</aside>

      {/* Dialog: Edit Idea */}
      <Dialog open={!!editingIdea} onOpenChange={(open) => !open && setEditingIdea(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa ý tưởng</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={editIdeaForm.handleSubmit(handleEditIdea)}
            className="space-y-4 mt-2"
          >
            <div>
              <label className="text-sm font-medium">Tiêu đề</label>
              <Input {...editIdeaForm.register("title")} />
            </div>
            <div>
              <label className="text-sm font-medium">Mô tả</label>
              <Textarea {...editIdeaForm.register("description")} rows={3} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingIdea(null)}
                disabled={isUpdatingIdea}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isUpdatingIdea}>
                {isUpdatingIdea ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang lưu...
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
