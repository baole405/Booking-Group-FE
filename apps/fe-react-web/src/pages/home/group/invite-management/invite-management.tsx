import { AlertCircle, CalendarDays, CheckCircle, Loader2, Mail, RefreshCw, UserPlus, Users, XCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInviteHook } from "@/hooks/use-invite";
import type { TInvite } from "@/schema/invite.schema";
import { toast } from "sonner";

export default function InviteManagementPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"received" | "sent">("received");

  const { useMyInvites, useRespondToInvite } = useInviteHook();

  const {
    data: invitesData,
    isPending,
    isError,
    refetch,
  } = useMyInvites({
    receivedPage: 1,
    receivedSize: 50,
    sentPage: 1,
    sentSize: 50,
  });

  const { mutate: respondToInvite, isPending: isResponding } = useRespondToInvite();

  const receivedInvites: TInvite[] = invitesData?.data?.data?.received?.content || [];
  const sentInvites: TInvite[] = invitesData?.data?.data?.sent?.content || [];

  const pendingReceived = receivedInvites.filter((inv) => inv.status === "PENDING");
  const pendingSent = sentInvites.filter((inv) => inv.status === "PENDING");

  // Handle accept invite
  const handleAccept = (inviteId: number, fromUserName: string) => {
    respondToInvite(
      { inviteId, data: { status: "ACCEPTED" } },
      {
        onSuccess: () => {
          toast.success(`Đã chấp nhận lời mời từ ${fromUserName}`);
          refetch(); // Reload data

          // Có thể reload page để đảm bảo UI sync hoàn toàn
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        },
        onError: () => {
          // Refetch vì BE có thể đã thực thi thành công
          refetch();

          // Reload page để đảm bảo sync
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        },
      },
    );
  };

  // Handle decline invite
  const handleDecline = (inviteId: number, fromUserName: string) => {
    respondToInvite(
      { inviteId, data: { status: "DECLINED" } },
      {
        onSuccess: () => {
          toast.success(`Đã từ chối lời mời từ ${fromUserName}`);
          refetch(); // Reload data
        },
        onError: () => {
          // Refetch vì BE có thể đã thực thi thành công
          refetch();

          // Reload page để đảm bảo sync
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        },
      },
    );
  };

  // Handle cancel sent invite (set status to DECLINED)
  const handleCancel = (inviteId: number, toUserName: string) => {
    if (window.confirm(`Bạn có chắc muốn hủy lời mời gửi đến ${toUserName}?`)) {
      respondToInvite(
        { inviteId, data: { status: "DECLINED" } },
        {
          onSuccess: () => {
            toast.success(`Đã hủy lời mời gửi đến ${toUserName}`);
            refetch(); // Reload data
          },
          onError: () => {
            // Refetch vì BE có thể đã thực thi thành công
            refetch();

            // Reload page để đảm bảo sync
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          },
        },
      );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="bg-amber-100 text-amber-700">Chờ phản hồi</Badge>;
      case "ACCEPTED":
        return <Badge className="bg-emerald-100 text-emerald-700">Đã chấp nhận</Badge>;
      case "DECLINED":
        return <Badge className="bg-red-100 text-red-700">Đã từ chối</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Header */}
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <UserPlus className="text-primary h-6 w-6" />
          <h1 className="text-2xl font-bold">Quản lý lời mời</h1>
          {isPending && (
            <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Đang tải...
            </span>
          )}
          {isError && (
            <span className="inline-flex items-center gap-1 text-xs text-red-600">
              <AlertCircle className="h-3.5 w-3.5" /> Không thể tải danh sách
            </span>
          )}
        </div>

        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isPending} title="Tải lại">
          <RefreshCw className="mr-2 h-4 w-4" />
          Tải lại
        </Button>
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-6xl px-6 pb-10">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "received" | "sent")}>
          <TabsList className="mb-6 grid w-full grid-cols-2">
            <TabsTrigger value="received" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Lời mời nhận được ({pendingReceived.length})
            </TabsTrigger>
            <TabsTrigger value="sent" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Lời mời đã gửi ({pendingSent.length})
            </TabsTrigger>
          </TabsList>

          {/* Tab: Lời mời nhận được */}
          <TabsContent value="received" className="space-y-4">
            {!isPending && receivedInvites.length === 0 && (
              <Card className="p-6">
                <div className="flex items-start gap-3">
                  <Mail className="text-muted-foreground mt-0.5 h-5 w-5" />
                  <div>
                    <div className="font-medium">Chưa có lời mời nào</div>
                    <p className="text-muted-foreground mt-1 text-sm">Bạn chưa nhận được lời mời tham gia nhóm nào.</p>
                  </div>
                </div>
              </Card>
            )}

            {receivedInvites.map((invite) => (
              <Card key={invite.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-1 items-center gap-3">
                      <Avatar className="h-10 w-10 cursor-pointer" onClick={() => navigate(`/profile/${invite.inviter.id}`)}>
                        <AvatarImage src={invite.inviter.avatarUrl || undefined} />
                        <AvatarFallback>
                          {invite.inviter.fullName
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase() || "??"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className="hover:text-primary cursor-pointer font-medium hover:underline"
                            onClick={() => navigate(`/profile/${invite.inviter.id}`)}
                          >
                            {invite.inviter.fullName}
                          </span>
                          <span className="text-muted-foreground text-sm">mời bạn tham gia</span>
                          <span
                            className="hover:text-primary cursor-pointer font-medium hover:underline"
                            onClick={() => navigate(`/groups/${invite.group.id}`)}
                          >
                            {invite.group.title}
                          </span>
                        </div>
                        <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
                          <CalendarDays className="h-3 w-3" />
                          {formatDate(invite.createdAt.toString())}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(invite.status)}
                  </div>
                </CardHeader>

                {invite.status === "PENDING" && (
                  <CardContent className="pt-0 pb-4">
                    <Separator className="mb-3" />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDecline(invite.id, invite.inviter.fullName || "")}
                        disabled={isResponding}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Từ chối
                      </Button>
                      <Button size="sm" onClick={() => handleAccept(invite.id, invite.inviter.fullName || "")} disabled={isResponding}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Chấp nhận
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </TabsContent>

          {/* Tab: Lời mời đã gửi */}
          <TabsContent value="sent" className="space-y-4">
            {!isPending && sentInvites.length === 0 && (
              <Card className="p-6">
                <div className="flex items-start gap-3">
                  <Users className="text-muted-foreground mt-0.5 h-5 w-5" />
                  <div>
                    <div className="font-medium">Chưa gửi lời mời nào</div>
                    <p className="text-muted-foreground mt-1 text-sm">Bạn chưa gửi lời mời tham gia nhóm đến ai.</p>
                  </div>
                </div>
              </Card>
            )}

            {sentInvites.map((invite) => (
              <Card key={invite.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-1 items-center gap-3">
                      <Avatar className="h-10 w-10 cursor-pointer" onClick={() => navigate(`/profile/${invite.invitee.id}`)}>
                        <AvatarImage src={invite.invitee.avatarUrl || undefined} />
                        <AvatarFallback>
                          {invite.invitee.fullName
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase() || "??"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-muted-foreground text-sm">Bạn đã mời</span>
                          <span
                            className="hover:text-primary cursor-pointer font-medium hover:underline"
                            onClick={() => navigate(`/profile/${invite.invitee.id}`)}
                          >
                            {invite.invitee.fullName}
                          </span>
                          <span className="text-muted-foreground text-sm">tham gia</span>
                          <span
                            className="hover:text-primary cursor-pointer font-medium hover:underline"
                            onClick={() => navigate(`/groups/${invite.group.id}`)}
                          >
                            {invite.group.title}
                          </span>
                        </div>
                        <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
                          <CalendarDays className="h-3 w-3" />
                          {formatDate(invite.createdAt.toString())}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(invite.status)}
                  </div>
                </CardHeader>

                {invite.status === "PENDING" && (
                  <CardContent className="pt-0 pb-4">
                    <Separator className="mb-3" />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancel(invite.id, invite.invitee.fullName || "")}
                        disabled={isResponding}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Hủy lời mời
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
