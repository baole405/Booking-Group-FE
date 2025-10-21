import { Loader2, ThumbsUp, ThumbsDown, CheckCircle2, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type VoteItem = {
  id: number;
  title: string;
  description?: string;
  status: string;
  resultYes?: number;
  resultNo?: number;
  candidate?: { id: number; fullName: string };
  hasVoted?: boolean;
  closedAt?: string;
};

type Props = {
  isLoading: boolean;
  votes: VoteItem[];
  onVote: (voteId: number, choice: "YES" | "NO") => Promise<void> | void;
  isVoting?: boolean;
};

export default function VotesPanel({ isLoading, votes, onVote, isVoting }: Props) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Đang tải cuộc bỏ phiếu...
      </div>
    );
  }

  if (!isLoading && votes.length === 0) {
    return <div className="text-muted-foreground text-sm">Chưa có cuộc bỏ phiếu nào đang mở.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Bỏ phiếu nhóm</h3>
      </div>

      <div className="grid gap-4">
        {votes.map((v) => {
          const status = (v.status ?? "OPEN").toUpperCase();
          const isClosed = status !== "OPEN";
          const yes = v.resultYes ?? 0;
          const no = v.resultNo ?? 0;
          const total = yes + no;
          const yesPercent = total > 0 ? Math.round((yes / total) * 100) : 0;

          return (
            <div
              key={v.id}
              className={`rounded-xl border p-4 shadow-sm transition-all hover:shadow-md ${isClosed ? "bg-muted/40" : "bg-card"
                }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">

                  {v.candidate && (
                    <div className="text-sm mt-1">
                      Ứng viên:{" "}
                      <span className="font-semibold text-primary">{v.candidate.fullName}</span>
                    </div>
                  )}

                  {v.description && (
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{v.description}</p>
                  )}

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge
                      variant={isClosed ? "secondary" : "outline"}
                      className="capitalize"
                    >
                      {status === "OPEN" ? (
                        <span className="flex items-center gap-1">
                          <Clock3 className="h-3 w-3" /> Đang mở
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-green-600" /> Đã đóng
                        </span>
                      )}
                    </Badge>
                    {v.closedAt && (
                      <span>
                        Đóng lúc:{" "}
                        <span className="font-medium">
                          {new Date(v.closedAt).toLocaleString("vi-VN")}
                        </span>
                      </span>
                    )}
                    {v.hasVoted && (
                      <span className="text-green-600 font-medium">• Bạn đã bỏ phiếu</span>
                    )}
                  </div>

                  {/* ✅ Biểu đồ kết quả */}
                  {total > 0 && (
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-emerald-600 font-medium">YES: {yes}</span>
                        <span className="text-destructive font-medium">NO: {no}</span>
                      </div>
                      <Progress
                        value={yesPercent}
                        className="h-2 bg-destructive/20 [&>div]:bg-emerald-500"
                      />
                    </div>
                  )}
                </div>

                {/* Nút hành động */}
                <div className="flex shrink-0 flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isVoting || isClosed || v.hasVoted}
                    onClick={() => onVote(v.id, "YES")}
                    className="transition-all hover:scale-105"
                  >
                    <ThumbsUp className="mr-1 h-4 w-4 text-emerald-600" />
                    YES
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={isVoting || isClosed || v.hasVoted}
                    onClick={() => onVote(v.id, "NO")}
                    className="transition-all hover:scale-105"
                  >
                    <ThumbsDown className="mr-1 h-4 w-4" />
                    NO
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
