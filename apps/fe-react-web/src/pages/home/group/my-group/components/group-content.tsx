import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useIdeaHook } from "@/hooks/use-idea";
import { useGroupHook } from "@/hooks/use-group";
import type { TIdea } from "@/schema/ideas.schema";
import type { TUpdateInformationGroup } from "@/schema/group.schema";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateInformationGroupSchema } from "@/schema/group.schema";
import { useState } from "react";
import { toast } from "sonner";

type GroupMinimal = {
  id: number;
  title: string;
  description?: string | null;
};

export default function GroupContent({
  group,
  aside,
  isLeader,
}: {
  group: GroupMinimal;
  aside?: React.ReactNode;
  isLeader?: boolean;
}) {
  const { useIdeaListByGroupId } = useIdeaHook();
  const { useUpdateGroupInfo } = useGroupHook();

  const { data: ideasRes, isPending: isIdeasPending, error: ideasError } =
    useIdeaListByGroupId(group.id);

  const { mutateAsync: updateGroupInfo, isPending: isUpdating } = useUpdateGroupInfo();

  const [open, setOpen] = useState(false);
  const form = useForm<TUpdateInformationGroup>({
    resolver: zodResolver(UpdateInformationGroupSchema),
    defaultValues: {
      title: group.title,
      description: group.description ?? "",
    },
  });

  const onSubmit = async (values: TUpdateInformationGroup) => {
    try {
      await updateGroupInfo(values);
      toast.success("Cập nhật thông tin nhóm thành công!");
      setOpen(false);
    } catch (err) {
      toast.error("Cập nhật thất bại, vui lòng thử lại.");
      console.error(err);
    }
  };

  const ideas = ideasRes?.data?.data ?? [];

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-6 py-8 md:grid-cols-6">
      {/* MAIN CONTENT */}
      <main className="md:col-span-4">
        <Card className="p-6 relative">
          <h2 className="mb-2 text-lg font-semibold">Mục tiêu của nhóm</h2>
          <Separator className="mb-4" />
          <p className="text-foreground/80 text-sm leading-relaxed">
            {group.description || "Chưa có mô tả."}
          </p>

          {/* Leader có nút cập nhật */}
          {isLeader && (
            <div className="absolute bottom-4 right-4">
              <Dialog open={open} onOpenChange={setOpen}>
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
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 mt-2"
                  >
                    <div>
                      <label className="text-sm font-medium">Tên nhóm</label>
                      <Input
                        {...form.register("title")}
                        placeholder="Nhập tên nhóm"
                      />
                      {form.formState.errors.title && (
                        <p className="text-sm text-red-600">
                          {form.formState.errors.title.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium">Mô tả nhóm</label>
                      <Textarea
                        {...form.register("description")}
                        placeholder="Nhập mô tả ngắn gọn..."
                        rows={3}
                      />
                    </div>

                    <DialogFooter className="mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={isUpdating}
                      >
                        Hủy
                      </Button>
                      <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang lưu...
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
          )}
        </Card>

        {/* Ideas */}
        <div className="mt-6">
          <h3 className="mb-3 text-base font-semibold">Ý tưởng của nhóm</h3>

          {(() => {
            if (isIdeasPending) {
              return (
                <div className="text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang tải ý tưởng...
                </div>
              );
            }
            if (ideasError) {
              return <div className="text-destructive">Không thể tải danh sách ý tưởng.</div>;
            }
            if (!ideas.length) {
              return <div className="text-muted-foreground text-sm">Chưa có ý tưởng nào.</div>;
            }
            return (
              <div className="grid gap-4">
                {ideas.map((idea: TIdea) => (
                  <div key={idea.id} className="rounded-lg border p-4">
                    <div className="font-medium">{idea.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {idea.description || "—"}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </main>

      {/* ASIDE */}
      <aside className="md:col-span-2">{aside}</aside>
    </div>
  );
}
