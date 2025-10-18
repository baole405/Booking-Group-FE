import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useIdeaHook } from "@/hooks/use-idea";
import type { TIdea } from "@/schema/ideas.schema";
import { Loader2 } from "lucide-react";

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
  aside?: React.ReactNode; // <— NEW
}) {
  const { useIdeaListByGroupId } = useIdeaHook();
  const { data: ideasRes, isPending: isIdeasPending, error: ideasError } =
    useIdeaListByGroupId(group.id);

  const ideas = ideasRes?.data?.data ?? [];

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-6 py-8 md:grid-cols-6">
      {/* MAIN CONTENT */}
      <main className="md:col-span-4">
        <Card className="p-6">
          <h2 className="mb-2 text-lg font-semibold">Mục tiêu của nhóm</h2>
          <Separator className="mb-4" />
          <p className="text-foreground/80 text-sm leading-relaxed">
            {group.description || "Chưa có mô tả."}
          </p>
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
              return (
                <div className="text-destructive">Không thể tải danh sách ý tưởng.</div>
              );
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

      {/* ASIDE — vị trí cũ của danh sách thành viên */}
      <aside className="md:col-span-2">
        {aside /* <— render slot */}
      </aside>
    </div>
  );
}
