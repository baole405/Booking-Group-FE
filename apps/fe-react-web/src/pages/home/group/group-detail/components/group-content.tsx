import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useIdeaHook } from "@/hooks/use-idea";
import type { TIdea } from "@/schema/ideas.schema";
import { Loader2 } from "lucide-react";
import { IdeaCard } from "./ideas-card";

type GroupMinimal = {
  id: number;
  title: string;
  description?: string | null;
};

export default function GroupContent({
  group,
  aside,
}: {
  group: GroupMinimal;
  aside?: React.ReactNode;
}) {
  const { useIdeaListByGroupId } = useIdeaHook();
  const {
    data: ideasRes,
    isPending,
    error,
  } = useIdeaListByGroupId(group.id);

  const ideas = ideasRes?.data?.data ?? [];

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-6 py-8 md:grid-cols-6">
      {/* MAIN CONTENT */}
      <main className="md:col-span-4 space-y-6">
        {/* Mục tiêu nhóm */}
        <Card className="p-6">
          <h2 className="mb-2 text-lg font-semibold">Mục tiêu của nhóm</h2>
          <Separator className="mb-4" />
          <p className="text-sm text-foreground/80 leading-relaxed">
            {group.description || "Chưa có mô tả."}
          </p>
        </Card>

        {/* Danh sách ý tưởng */}
        <section>
          <h3 className="mb-3 text-base font-semibold">Ý tưởng của nhóm</h3>

          {isPending && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Đang tải ý tưởng...
            </div>
          )}

          {error && (
            <div className="text-destructive text-sm">
              Không thể tải danh sách ý tưởng.
            </div>
          )}

          {!isPending && !error && !ideas.length && (
            <p className="text-sm text-muted-foreground">Chưa có ý tưởng nào.</p>
          )}

          {!isPending && !error && ideas.length > 0 && (
            <div className="grid gap-4">
              {ideas.map((idea: TIdea) => (
                <IdeaCard key={idea.id} idea={idea} />
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
