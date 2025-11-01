import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGroupMessages, useSendMessage } from "@/hooks/use-chat";
import { useGroupHook } from "@/hooks/use-group";
import type { RootState } from "@/redux/store";
import type { TMessage } from "@/schema/chat.schema";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { AlertCircle, MessageCircle, RefreshCw, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function GroupChat() {
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserId = useSelector((state: RootState) => state.user.userId);
  const { useMyGroup } = useGroupHook();
  const { data: groupData, isPending: groupPending } = useMyGroup();
  const myGroup = groupData?.data?.data;

  // Use REST API hooks
  const { data: messages, isPending: messagesLoading, refetch, isRefetching, error: messagesError } = useGroupMessages(myGroup?.id ?? null);
  const { mutateAsync: sendMessageAsync, isPending: isSending } = useSendMessage();

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.length]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !myGroup?.id) return;

    try {
      await sendMessageAsync({
        groupId: myGroup.id,
        content: messageInput.trim(),
        messageType: "TEXT",
      });
      setMessageInput("");
      toast.success("Đã gửi tin nhắn");
    } catch (error) {
      console.error("Send message error:", error);
      toast.error(`Không thể gửi tin nhắn: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRefresh = () => {
    refetch();
    toast.info("Đang làm mới tin nhắn...");
  };

  if (groupPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Đang tải thông tin nhóm...</p>
      </div>
    );
  }

  if (!myGroup) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <MessageCircle className="text-muted-foreground h-16 w-16" />
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold">Chưa có nhóm</h2>
          <p className="text-muted-foreground">Bạn cần tham gia một nhóm để sử dụng tính năng chat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto h-[calc(100vh-80px)] max-w-6xl p-4">
      <Card className="flex h-full flex-col">
        {/* Header */}
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="text-primary h-5 w-5" />
                {myGroup.title}
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={myGroup.status === "LOCKED" ? "default" : "secondary"}>{myGroup.status}</Badge>
              <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefetching}>
                <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Messages Area */}
        <CardContent className="flex-1 space-y-4 overflow-y-auto p-4">
          {messagesLoading && (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">Đang tải tin nhắn...</p>
            </div>
          )}

          {messagesError && !messagesLoading && (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <AlertCircle className="text-destructive h-12 w-12" />
              <div>
                <h3 className="mb-2 text-lg font-semibold">Backend Error: Chat API chưa hoạt động</h3>
                <p className="text-muted-foreground mb-2 text-sm">
                  Backend trả về: <code className="bg-muted rounded px-2 py-1">Uncategorized error</code>
                </p>
                <p className="text-muted-foreground mb-4 text-sm">
                  Chat API có thể chưa được implement hoặc database chưa được setup.
                  <br />
                  Vui lòng liên hệ team Backend để kiểm tra.
                </p>
                <Button onClick={() => refetch()} variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Thử lại
                </Button>
              </div>
            </div>
          )}

          {!messagesLoading && !messagesError && (!messages || messages.length === 0) && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <MessageCircle className="text-muted-foreground mb-4 h-12 w-12" />
              <p className="text-muted-foreground">Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
            </div>
          )}

          {!messagesLoading && !messagesError && messages && messages.length > 0 && (
            <>
              {messages.map((msg: TMessage, index: number) => {
                const isMyMessage = msg.fromUserId === currentUserId;

                return (
                  <div key={`${msg.id}-${index}`} className={`flex gap-3 ${isMyMessage ? "flex-row-reverse" : "flex-row"}`}>
                    <Avatar className="h-8 w-8">
                      {msg.fromUserAvatar ? (
                        <AvatarImage src={msg.fromUserAvatar} alt={msg.fromUserName} />
                      ) : (
                        <AvatarFallback>{msg.fromUserName?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                      )}
                    </Avatar>

                    <div className={`flex max-w-[70%] flex-col gap-1 ${isMyMessage ? "items-end" : "items-start"}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">{msg.fromUserName}</span>
                        <span className="text-muted-foreground text-xs">
                          {formatDistanceToNow(new Date(msg.createdAt), {
                            addSuffix: true,
                            locale: vi,
                          })}
                        </span>
                        {msg.isEdited && <span className="text-muted-foreground text-xs italic">(đã chỉnh sửa)</span>}
                      </div>
                      <div className={`rounded-lg px-4 py-2 ${isMyMessage ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                        <p className="text-sm break-words whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              disabled={isSending}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!messageInput.trim() || isSending} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-muted-foreground mt-2 text-xs">Tin nhắn tự động làm mới mỗi 5 giây. Nhấn Enter để gửi, Shift+Enter để xuống dòng.</p>
        </div>
      </Card>
    </div>
  );
}
