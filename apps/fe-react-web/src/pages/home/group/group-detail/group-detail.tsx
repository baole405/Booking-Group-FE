import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGroupHook } from "@/hooks/use-group";
import { useIdeaHook } from "@/hooks/use-idea";
import { Loader2, Users } from "lucide-react";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { IdeaCard } from "./components/ideas-card";
import { MemberCard } from "./components/member-card";

const getInitials = (name?: string) =>
  (name ?? "")
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const groupId = Number(id);

  const { useGroupById } = useGroupHook();
  const { useIdeaListByGroupId } = useIdeaHook();

  // Group detail
  const { data, isPending, error } = useGroupById(groupId);
  const group = data?.data?.data;

  // Ideas by group (đã select -> trả thẳng mảng)
  const { data: ideasRes, isPending: isIdeasPending, error: ideasError } = useIdeaListByGroupId(groupId); // ✅ dùng hook ideas riêng

  const ideas = ideasRes?.data?.data ?? [];
  const header = useMemo(() => {
    let content;
    if (isPending) {
      content = (
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <h1 className="text-xl font-semibold">Đang tải nhóm...</h1>
        </div>
      );
    } else if (error || !data) {
      content = <h1 className="text-destructive text-xl font-semibold">Không tải được thông tin nhóm</h1>;
    } else {
      content = (
        <h1 className="text-xl font-semibold">
          Nhóm #{group?.id} — {group?.title}
        </h1>
      );
    }

    return (
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        {content}
        <div className="w-64"></div>
      </div>
    );
  }, [isPending, error, group]);

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      {/* BG effect */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)_/_12%)_0,_transparent_55%)]"
        aria-hidden="true"
      />

      {header}

      {/* Main layout */}
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-6 py-8 md:grid-cols-6">
        {/* MAIN CONTENT */}
        <main className="md:col-span-4">
          {/* Card mô tả */}
          <Card className="p-6">
            {(() => {
              if (isPending) {
                return (
                  <div className="text-muted-foreground flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang tải chi tiết dự án...
                  </div>
                );
              }
              if (error || !group) {
                return <div className="text-destructive">Có lỗi xảy ra.</div>;
              }
              return (
                <>
                  <h2 className="mb-2 text-lg font-semibold">Mục tiêu của nhóm</h2>
                  <Separator className="mb-4" />
                  <p className="text-foreground/80 text-sm leading-relaxed">{group.description || "Chưa có mô tả."}</p>
                </>
              );
            })()}
          </Card>

          {/* Danh sách Idea dưới Card */}
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
              if (!ideas?.length) {
                return <div className="text-muted-foreground text-sm">Chưa có ý tưởng nào.</div>;
              }
              return (
                <div className="grid gap-4">
                  {ideas.map((idea) => (
                    <IdeaCard key={idea.id} idea={idea} onClick={(id) => console.log("open idea", id)} />
                  ))}
                </div>
              );
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

            {(() => {
              if (isPending) {
                return (
                  <div className="text-muted-foreground flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang tải thành viên...
                  </div>
                );
              }
              if (error || !group) {
                return <div className="text-destructive">Không thể hiển thị thành viên.</div>;
              }
              return (
                <>
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
                  <div className="mt-2 space-y-2">
                    <div className="text-muted-foreground text-sm">
                      (Hiện API chi tiết nhóm chưa trả danh sách thành viên khác. Khi BE bổ sung <code>members[]</code> mình sẽ map ra tại đây.)
                    </div>
                  </div>
                  {group.leader && (
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex -space-x-2">
                        <Avatar className="ring-background h-8 w-8 ring-2">
                          <AvatarImage src={group.leader.avatarUrl ?? ""} alt="" />
                          <AvatarFallback>{getInitials(group.leader.fullName)}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="text-muted-foreground text-sm">Tổng cộng: 1 thành viên</div>
                    </div>
                  )}
                </>
              );
            })()}
          </Card>
        </aside>
      </div>
    </div>
  );
}
