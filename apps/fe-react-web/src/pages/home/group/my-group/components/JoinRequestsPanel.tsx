import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TJoinGroup } from "@/schema/group.schema";
import { Check, Loader2, Users, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

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
        <div className="bg-muted h-9 w-9 animate-pulse rounded-full" />
        <div className="min-w-0">
          <div className="bg-muted h-4 w-40 animate-pulse rounded" />
          <div className="bg-muted mt-1 h-3 w-24 animate-pulse rounded" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-muted h-8 w-24 animate-pulse rounded" />
        <div className="bg-muted h-8 w-24 animate-pulse rounded" />
      </div>
    </div>
  </div>
);

export default function JoinRequestsPanel({ isLoading, requests, canModerate, onAccept, onReject }: Props) {
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
      // Reload trang để đảm bảo data được cập nhật nếu BE đã thực thi
      setTimeout(() => {
        window.location.reload();
      }, 2000);
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
      // Reload trang để đảm bảo data được cập nhật nếu BE đã thực thi
      setTimeout(() => {
        window.location.reload();
      }, 2000);
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

      {!canModerate && <p className="text-muted-foreground mb-3 text-xs">Chỉ trưởng nhóm mới có thể chấp nhận / từ chối yêu cầu.</p>}

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
          <div className="bg-muted mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full">
            <Users className="text-muted-foreground h-4 w-4" />
          </div>
          <div className="font-medium">Không có yêu cầu tham gia nào</div>
          <p className="text-muted-foreground mt-1 text-sm">Khi có sinh viên gửi yêu cầu, bạn sẽ thấy danh sách ở đây.</p>
        </div>
      )}

      {/* List */}
      {!isLoading && requests.length > 0 && (
        <div className="grid gap-3">
          {requests.map((req) => {
            const u = req.fromUser;
            const loadingState = busy[req.id];

            return (
              <div key={req.id} className="hover:bg-muted/30 rounded-lg border p-3 transition-colors">
                <div className="flex items-center justify-between gap-3">
                  {/* Left: user info */}
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={u.avatarUrl ?? undefined} alt={u.fullName} />
                      <AvatarFallback>{getInitials(u.fullName)}</AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <div className="truncate font-medium">{u.fullName}</div>
                      <div className="text-muted-foreground mt-0.5 text-xs">{u.major?.name ?? "—"}</div>
                    </div>
                  </div>

                  {/* Right: actions */}
                  <div className="flex shrink-0 items-center gap-2">
                    <Button size="sm" variant="outline" disabled={!canModerate || !!loadingState} onClick={() => handleAccept(req)}>
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

                    <Button size="sm" variant="destructive" disabled={!canModerate || !!loadingState} onClick={() => handleReject(req)}>
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
