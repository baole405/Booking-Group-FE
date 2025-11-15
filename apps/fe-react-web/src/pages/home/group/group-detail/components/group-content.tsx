import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useIdeaHook } from "@/hooks/use-idea";
import type { TIdea } from "@/schema/ideas.schema";
import { Loader2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { IdeaCard } from "./ideas-card";

type GroupMinimal = {
  id: number;
  title: string;
  description?: string | null;
};

interface GroupContentProps {
  group: GroupMinimal;
  aside?: ReactNode;
  isLecturer?: boolean;
}

export default function GroupContent({ group, aside, isLecturer = false }: GroupContentProps) {
  const { useIdeaListByGroupId, useApproveIdea, useRejectIdea } = useIdeaHook();
  const { data: ideasRes, isPending, error, refetch } = useIdeaListByGroupId(group.id);
  const { mutateAsync: approveIdeaAsync } = useApproveIdea();
  const { mutateAsync: rejectIdeaAsync } = useRejectIdea();

  const [processing, setProcessing] = useState<{ id: number | null; type: "approve" | "reject" | null }>({
    id: null,
    type: null,
  });

  const ideas = ideasRes?.data?.data ?? [];

  const handleApproveIdea = async (id: number) => {
    try {
      setProcessing({ id, type: "approve" });
      await approveIdeaAsync(id);
      toast.success("Đã phê duyệt ý tưởng!");
      await refetch();
    } catch (err) {
      console.error("approve idea error", err);
      toast.error("Không thể phê duyệt ý tưởng. Vui lòng thử lại.");
    } finally {
      setProcessing({ id: null, type: null });
    }
  };

  const handleRejectIdea = async (id: number) => {
    const reason = window.prompt("Nhập lý do từ chối ý tưởng này:");
    if (!reason || !reason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối ý tưởng.");
      return;
    }

    try {
      setProcessing({ id, type: "reject" });
      await rejectIdeaAsync({ id, data: { reason: reason.trim() } });
      toast.success("Đã từ chối ý tưởng.");
      await refetch();
    } catch (err) {
      console.error("reject idea error", err);
      toast.error("Không thể từ chối ý tưởng. Vui lòng thử lại.");
    } finally {
      setProcessing({ id: null, type: null });
    }
  };

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-6 py-8 md:grid-cols-6">
      {/* MAIN CONTENT */}
      <main className="space-y-6 md:col-span-4">
        {/* Mục tiêu nhóm */}
        <Card className="p-6">
          <h2 className="mb-2 text-lg font-semibold">Mục tiêu của nhóm</h2>
          <Separator className="mb-4" />
          <p className="text-foreground/80 text-sm leading-relaxed">{group.description || "Chưa có mô tả."}</p>
        </Card>

        {/* Danh sách ý tưởng */}
        <section>
          <h3 className="mb-3 text-base font-semibold">Ý tưởng của nhóm</h3>

          {isPending && (
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" /> Đang tải ý tưởng...
            </div>
          )}

          {error && <div className="text-destructive text-sm">Không thể tải danh sách ý tưởng.</div>}

          {!isPending && !error && !ideas.length && <p className="text-muted-foreground text-sm">Chưa có ý tưởng nào.</p>}

          {!isPending && !error && ideas.length > 0 && (
            <div className="grid gap-4">
              {ideas.map((idea: TIdea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  isLecturer={isLecturer}
                  onApprove={() => handleApproveIdea(idea.id)}
                  onReject={() => handleRejectIdea(idea.id)}
                  processingState={processing.id === idea.id ? (processing.type === "approve" ? "approve" : "reject") : null}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ASIDE */}
      <aside className="md:col-span-2">{aside}</aside>
    </div>
  );
}
