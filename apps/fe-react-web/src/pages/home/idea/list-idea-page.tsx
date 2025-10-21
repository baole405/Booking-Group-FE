// src/pages/ideas/idea-list-page.tsx
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import IdeaCard from "./components/idea-card"; // <- đường dẫn tới IdeaCard của bạn
import { useIdeaHook } from "@/hooks/use-idea";

export default function IdeaListPage() {
    const { useGetAllIdeas } = useIdeaHook();

  const { data, isPending, error } = useGetAllIdeas();

  // Tùy vào BaseResponse của bạn:
  // - AxiosResponse<BaseResponse<TIdea[]>> => data?.data?.data
  // - Nếu ideaApi.getAllIdeas() đã .then(res => res.data) thì chỉ cần data?.data
  const ideas = (data?.data?.data ?? []) as any[];

  const listSection = useMemo(() => {
    if (isPending) {
      return (
        <div className="text-muted-foreground flex justify-center py-10">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Đang tải danh sách ý tưởng...
        </div>
      );
    }
    if (error) {
      return <div className="text-destructive py-10 text-center">Đã xảy ra lỗi khi tải dữ liệu ý tưởng.</div>;
    }
    if (!ideas.length) {
      return <div className="text-muted-foreground py-10 text-center">Chưa có ý tưởng nào.</div>;
    }

    return (
      <div className="flex flex-col gap-4">
        {ideas.map((idea: any, index: number) => (
          <div key={idea.id ?? index} className="w-full">
            <IdeaCard idea={idea} />
          </div>
        ))}
      </div>
    );
  }, [isPending, error, ideas]);

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      {/* Hiệu ứng nền (giữ style tương tự GroupPage nếu bạn thích) */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)_/_12%)_0,_transparent_55%)]"
        aria-hidden="true"
      />

      {/* Header đơn giản */}
      <div className="mx-auto w-full max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Danh sách ý tưởng</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto w-full max-w-6xl px-6 py-8 pb-16">
        {listSection}
      </div>
    </div>
  );
}
