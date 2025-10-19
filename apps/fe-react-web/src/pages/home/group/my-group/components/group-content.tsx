import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

// 🧩 Types
type GroupMinimal = {
  id: number;
  title: string;
  description?: string | null;
};

interface GroupContentProps {
  group: GroupMinimal;
  aside?: ReactNode;
  isLeader?: boolean;
}

// 🎨 Helper
const getStatusColor = (status: string): string => {
  switch (status) {
    case "DRAFT":
      return "bg-gray-200 text-gray-800";
    case "PENDING":
      return "bg-yellow-200 text-yellow-800";
    case "APPROVED":
      return "bg-green-200 text-green-800";
    case "REJECTED":
      return "bg-red-200 text-red-800";
    default:
      return "bg-muted text-foreground";
  }
};

export default function GroupContent({ group, aside, isLeader }: GroupContentProps) {
  // 🔗 Hooks
  const { useIdeaListByGroupId, useCreateIdea, useUpdateIdea, useDeleteIdea } = useIdeaHook();
  const { useUpdateGroupInfo } = useGroupHook();

  // ⏳ Queries & Mutations
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

  // 🧠 Local state
  const [openUpdateGroup, setOpenUpdateGroup] = useState(false);
  const [openCreateIdea, setOpenCreateIdea] = useState(false);
  const [editingIdea, setEditingIdea] = useState<TIdea | null>(null);

  // 📝 Form: Group update
  const groupForm = useForm<TUpdateInformationGroup>({
    resolver: zodResolver(UpdateInformationGroupSchema),
    defaultValues: { title: group.title, description: group.description ?? "" },
  });

  // 📝 Form: Create Idea
  const createIdeaForm = useForm<TCreateIdea>({
    resolver: zodResolver(CreateIdeaSchema),
    defaultValues: { title: "", description: "" },
  });

  // 📝 Form: Edit Idea
  const editIdeaForm = useForm<TUpdateIdea>({
    resolver: zodResolver(CreateIdeaSchema),
  });

  // ⚙️ Handlers
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

  // 🧱 Subcomponent: Idea Card
  const IdeaCard = ({ idea }: { idea: TIdea }) => {
    const canEdit =
      !!isLeader && (idea.status === "DRAFT" || idea.status === "REJECTED");

    return (
      <div
        key={idea.id}
        className="rounded-lg border p-4 relative group transition-colors hover:bg-muted/20"
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium">{idea.title}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {idea.description || "—"}
            </div>
          </div>
          <Badge className={`${getStatusColor(idea.status)} text-xs`}>
            {idea.status}
          </Badge>
        </div>

        {isLeader && (
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canEdit && (
                  <DropdownMenuItem
                    onClick={() => {
                      editIdeaForm.reset({
                        title: idea.title,
                        description: idea.description ?? "",
                      });
                      setEditingIdea(idea);
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  className="text-red-500 focus:text-red-600"
                  onClick={() => handleDeleteIdea(idea.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Xóa ý tưởng
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    );
  };

  // 🧠 Content render for ideas
  const renderIdeas = () => {
    if (isIdeasPending)
      return (
        <div className="text-muted-foreground flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Đang tải ý tưởng...
        </div>
      );

    if (ideasError)
      return <div className="text-destructive">Không thể tải danh sách ý tưởng.</div>;

    if (!ideas.length)
      return <div className="text-muted-foreground text-sm">Chưa có ý tưởng nào.</div>;

    return <div className="grid gap-4">{ideas.map((idea) => <IdeaCard key={idea.id} idea={idea} />)}</div>;
  };

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-6 py-8 md:grid-cols-6">
      <main className="md:col-span-4 space-y-6">
        {/* 🧱 Group Info */}
        <Card className="p-6 relative">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Mục tiêu của nhóm</h2>
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
                    <DialogFooter>
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
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <Separator className="mb-4" />
          <p className="text-foreground/80 text-sm leading-relaxed">
            {group.description || "Chưa có mô tả."}
          </p>
        </Card>

        {/* 🧠 Ideas Section */}
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
                    <DialogFooter>
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
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
          {renderIdeas()}
        </Card>
      </main>

      <aside className="md:col-span-2">{aside}</aside>

      {/* 🧾 Dialog: Edit Idea */}
      <Dialog open={!!editingIdea} onOpenChange={() => setEditingIdea(null)}>
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
            <DialogFooter>
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
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
