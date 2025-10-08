import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useIdeaHook } from "@/hooks/use-idea";
import type { TIdea } from "@/schema/ideas.schema";
import { Loader2, Users } from "lucide-react";
import { IdeaCard } from "../components/ideas-card";
import { MemberCard } from "../components/member-card";
type GroupMinimal = {
  id: number;
  title: string;
  description?: string | null;
  leader?: {
    id: number;
    fullName: string;
    studentCode?: string | null;
    avatarUrl?: string | null;
  } | null;
};

const getInitials = (name?: string) =>
  (name ?? "")
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function GroupContent({ group }: { group: GroupMinimal }) {
  const { useIdeaListByGroupId } = useIdeaHook();
  const { data: ideasRes, isPending: isIdeasPending, error: ideasError } = useIdeaListByGroupId(group.id); // chỉ gọi khi component này được mount

  const ideas = ideasRes?.data?.data ?? [];

  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-6 py-8 md:grid-cols-6">
      {/* MAIN CONTENT */}
      <main className="md:col-span-4">
        <Card className="p-6">
          <h2 className="mb-2 text-lg font-semibold">Mục tiêu của nhóm</h2>
          <Separator className="mb-4" />
          <p className="text-foreground/80 text-sm leading-relaxed">{group.description || "Chưa có mô tả."}</p>
        </Card>

        {/* Ideas */}
        <div className="mt-6">
          <h3 className="mb-3 text-base font-semibold">Ý tưởng của nhóm</h3>

          {(() => {
            let ideasNode: React.ReactNode;

            if (isIdeasPending) {
              ideasNode = (
                <div className="text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang tải ý tưởng...
                </div>
              );
            } else if (ideasError) {
              ideasNode = <div className="text-destructive">Không thể tải danh sách ý tưởng.</div>;
            } else if (!ideas.length) {
              ideasNode = <div className="text-muted-foreground text-sm">Chưa có ý tưởng nào.</div>;
            } else {
              ideasNode = (
                <div className="grid gap-4">
                  {ideas.map((idea: TIdea) => (
                    <IdeaCard key={idea.id} idea={idea} onClick={(id) => console.log("open idea", id)} />
                  ))}
                </div>
              );
            }

            return ideasNode;
          })()}
        </div>
      </main>

      {/* MEMBER SECTION */}
      <aside className="md:col-span-2">
        <Card className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-600" />
            <h3 className="text-lg font-semibold">Thành viên</h3>
          </div>

          {group.leader && (
            <MemberCard
              user={{
                id: group.leader.id,
                fullName: group.leader.fullName,
                studentCode: group.leader.studentCode ?? "",
                avatarUrl: group.leader.avatarUrl ?? undefined,
              }}
              role="LEADER"
              highlight
            />
          )}

          <div className="mt-3 flex items-center justify-between">
            <div className="flex -space-x-2">
              <Avatar className="ring-background h-8 w-8 ring-2">
                <AvatarImage src={group.leader?.avatarUrl ?? ""} alt="" />
                <AvatarFallback>{getInitials(group.leader?.fullName)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="text-muted-foreground text-sm">Tổng cộng: {group.leader ? 1 : 0} thành viên</div>
          </div>
        </Card>
      </aside>
    </div>
  );
}
