import { useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, RefreshCw, Users, CalendarDays, Lock, Globe2, AlertCircle } from "lucide-react";

import { useGroupHook } from "@/hooks/use-group";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { TJoinGroup } from "@/schema/group.schema";



export default function JoinRequestsPage() {
  const navigate = useNavigate();
  const { useGetMyJoinRequests } = useGroupHook();

  const {
    data: myReqRes,
    isPending,
    isError,
    refetch,
  } = useGetMyJoinRequests();

  const requests: TJoinGroup[] = useMemo(
    () => (Array.isArray(myReqRes?.data?.data) ? myReqRes.data.data : []),
    [myReqRes]
  );

  const hasData = requests.length > 0;

  const statusColor = (s: string) => {
    switch (String(s).toUpperCase()) {
      case "PENDING":
        return "bg-amber-100 text-amber-700";
      case "APPROVED":
        return "bg-emerald-100 text-emerald-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-muted text-foreground";
    }
  };

  const typeIcon = (t?: string) =>
    String(t).toUpperCase() === "PRIVATE" ? (
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <Lock className="h-3.5 w-3.5" /> Private
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <Globe2 className="h-3.5 w-3.5" /> Public
      </span>
    );

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Header */}
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold">Yêu cầu tham gia đã gửi</h1>
          {isPending && (
            <span className="text-xs inline-flex items-center gap-1 text-muted-foreground">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Đang tải...
            </span>
          )}
          {isError && (
            <span className="text-xs inline-flex items-center gap-1 text-red-600">
              <AlertCircle className="h-3.5 w-3.5" /> Không thể tải danh sách
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isPending}
            title="Tải lại"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Tải lại
          </Button>
          <Button size="sm" asChild>
            <Link to="/student/groups">Tìm nhóm khác</Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-6xl px-6 pb-10">
        {!isPending && !isError && !hasData && (
          <Card className="p-6">
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium">Chưa có yêu cầu nào</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Bạn chưa gửi yêu cầu tham gia nhóm nào. Hãy duyệt danh sách và gửi yêu cầu đến nhóm bạn muốn.
                </p>
                <div className="mt-3">
                  <Button size="sm" asChild>
                    <Link to="/student/groups">Xem danh sách nhóm</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {hasData && (
          <div className="grid gap-4">
            {requests.map((req) => {
              const g = req.toGroup;
              const createdText = g?.createdAt
                ? new Date(g.createdAt).toLocaleString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : null;
              return (
                <Card key={req.id} className="p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    {/* Left: Info */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="font-medium truncate">
                          Nhóm #{g?.id} — {g?.title}
                        </div>
                        {/* Status badge */}
                        <Badge className={`${statusColor(req.status)} text-[11px]`}>
                          {String(req.status).toUpperCase()}
                        </Badge>
                      </div>

                      <div className="text-sm text-muted-foreground mt-1 flex items-center gap-3 flex-wrap">
                        {typeIcon(g?.type)}
                        {g?.semester?.name && (
                          <span className="inline-flex items-center gap-1">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {g.semester.name}
                          </span>
                        )}
                        {g?.status && (
                          <span className="text-xs opacity-80">• Trạng thái nhóm: {g.status}</span>
                        )}
                        {createdText && (
                          <span className="text-xs opacity-80">• Tạo lúc: {createdText}</span>
                        )}
                      </div>

                      {g?.description && (
                        <>
                          <Separator className="my-3" />
                          <p className="text-sm text-foreground/80 line-clamp-2">
                            {g.description}
                          </p>
                        </>
                      )}
                    </div>

                    {/* Right: Actions */}
                    <div className="shrink-0 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/student/groups/${g?.id}`)}
                      >
                        Xem nhóm
                      </Button>

                      {/* Nếu muốn có hủy yêu cầu (nếu backend hỗ trợ), thêm nút dưới đây:
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelRequest(req.id)}
                        disabled={String(req.status).toUpperCase() !== "PENDING"}
                        title={
                          String(req.status).toUpperCase() === "PENDING"
                            ? "Hủy yêu cầu này"
                            : "Chỉ hủy yêu cầu khi đang PENDING"
                        }
                      >
                        Hủy yêu cầu
                      </Button>
                      */}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
