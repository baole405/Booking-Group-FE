import { useMemo, useState } from "react";
import { Loader2, Users, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { TJoinGroup } from "@/schema/group.schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Props = {
  isLoading: boolean;
  requests: TJoinGroup[];
  canModerate: boolean; // leader mới thao tác
  onAccept?: (id: number) => Promise<void> | void;
  onReject?: (id: number) => Promise<void> | void;
};

const getInitials = (name?: string | null) =>
  (name ?? "")
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

const SkeletonItem = () => (
  <div className="rounded-lg border p-3">
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
        <div className="min-w-0">
          <div className="h-4 w-40 animate-pulse rounded bg-muted" />
          <div className="mt-1 h-3 w-24 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-8 w-24 animate-pulse rounded bg-muted" />
        <div className="h-8 w-24 animate-pulse rounded bg-muted" />
      </div>
    </div>
  </div>
);

export default function JoinRequestsPanel({
  isLoading,
  requests,
  canModerate,
  onAccept,
  onReject,
}: Props) {
  // loading theo từng item để button không chớp cho tất cả
  const [busy, setBusy] = useState<{ [id: number]: "accept" | "reject" | null }>({});

  const count = useMemo(() => requests.length, [requests]);

  const handleAccept = async (r: TJoinGroup) => {
    if (!canModerate || busy[r.id]) return;
    try {
      setBusy((s) => ({ ...s, [r.id]: "accept" }));
      await onAccept?.(r.id);
      toast.success(`✅ Đã chấp nhận ${r.fromUser.fullName}`);
    } catch (e) {
      console.error("handleAccept error:", e);
      toast.error("Không thể chấp nhận yêu cầu. Vui lòng thử lại!");
    } finally {
      setBusy((s) => ({ ...s, [r.id]: null }));
    }
  };

  const handleReject = async (r: TJoinGroup) => {
    if (!canModerate || busy[r.id]) return;
    try {
      setBusy((s) => ({ ...s, [r.id]: "reject" }));
      await onReject?.(r.id);
      toast.success(`❌ Đã từ chối ${r.fromUser.fullName}`);
    } catch (e) {
      console.error("handleReject error:", e);
      toast.error("Không thể từ chối yêu cầu. Vui lòng thử lại!");
    } finally {
      setBusy((s) => ({ ...s, [r.id]: null }));
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-2 flex items-center gap-2">
        <Users className="h-5 w-5 text-amber-600" />
        <h3 className="text-lg font-semibold">
          Yêu cầu tham gia <span className="opacity-75">({count})</span>
        </h3>
        {!!count && (
          <Badge variant="secondary" className="ml-1">
            Chỉ trưởng nhóm mới duyệt
          </Badge>
        )}
      </div>

      {!canModerate && (
        <p className="mb-3 text-xs text-muted-foreground">
          Chỉ trưởng nhóm mới có thể chấp nhận / từ chối yêu cầu.
        </p>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="grid gap-3">
          <SkeletonItem />
          <SkeletonItem />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && requests.length === 0 && (
        <div className="rounded-lg border border-dashed p-5 text-center">
          <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-muted">
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="font-medium">Không có yêu cầu tham gia nào</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Khi có sinh viên gửi yêu cầu, bạn sẽ thấy danh sách ở đây.
          </p>
        </div>
      )}

      {/* List */}
      {!isLoading && requests.length > 0 && (
        <div className="grid gap-3">
          {requests.map((req) => {
            const u = req.fromUser;
            const loadingState = busy[req.id];

            return (
              <div
                key={req.id}
                className="rounded-lg border p-3 transition-colors hover:bg-muted/30"
              >
                <div className="flex items-center justify-between gap-3">
                  {/* Left: user info */}
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={u.avatarUrl ?? undefined} alt={u.fullName} />
                      <AvatarFallback>{getInitials(u.fullName)}</AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <div className="truncate font-medium">{u.fullName}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {u.major?.name ?? "—"}
                      </div>
                    </div>
                  </div>

                  {/* Right: actions */}
                  <div className="flex shrink-0 items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!canModerate || !!loadingState}
                      onClick={() => handleAccept(req)}
                    >
                      {loadingState === "accept" ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang duyệt...
                        </>
                      ) : (
                        <>
                          <Check className="mr-1.5 h-4 w-4" />
                          Chấp nhận
                        </>
                      )}
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={!canModerate || !!loadingState}
                      onClick={() => handleReject(req)}
                    >
                      {loadingState === "reject" ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang từ chối...
                        </>
                      ) : (
                        <>
                          <X className="mr-1.5 h-4 w-4" />
                          Từ chối
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
