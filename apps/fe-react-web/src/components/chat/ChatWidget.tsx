import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGroupMessages, useSendMessage } from "@/hooks/use-chat";
import { useGroupHook } from "@/hooks/use-group";
import type { RootState } from "@/redux/store";
import type { TMessage } from "@/schema/chat.schema";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { MessageCircle, Minimize2, RefreshCw, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserId = useSelector((state: RootState) => state.user.userId);
  const { useMyGroup } = useGroupHook();
  const { data: groupData } = useMyGroup();
  const myGroup = groupData?.data?.data;

  const { data: messages, isPending: messagesLoading, refetch, isRefetching } = useGroupMessages(myGroup?.id ?? null);
  const { mutateAsync: sendMessageAsync, isPending: isSending } = useSendMessage();

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages?.length, isOpen, isMinimized]);

  // Update unread count when closed
  useEffect(() => {
    if (!isOpen && messages && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.fromUserId !== currentUserId) {
        setUnreadCount((prev) => prev + 1);
      }
    }
  }, [messages, isOpen, currentUserId]);

  // Reset unread when open
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !myGroup?.id) return;

    try {
      await sendMessageAsync({
        groupId: myGroup.id,
        content: messageInput.trim(),
        messageType: "TEXT",
      });
      setMessageInput("");
      toast.success("Đã gửi");
    } catch (error) {
      console.error("Send message error:", error);
      toast.error("Không thể gửi tin nhắn");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Don't show if no group
  if (!myGroup) return null;

  return (
    <>
      {/* Floating Button - Always visible - Positioned higher to not block close button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-primary text-primary-foreground fixed right-6 bottom-24 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl ${
          isOpen ? "z-40" : "z-50"
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed right-6 bottom-24 z-50 transition-all duration-300 ${isMinimized ? "w-80" : "h-[600px] w-96"}`}>
          <Card className="flex h-full flex-col shadow-2xl">
            {/* Header */}
            <CardHeader className="bg-primary text-primary-foreground border-b p-4">
              <div className="flex items-center justify-between">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <MessageCircle className="h-5 w-5 flex-shrink-0" />
                  <CardTitle className="truncate text-base">{myGroup.title}</CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary-foreground hover:bg-primary-foreground/20 h-8 w-8"
                    onClick={() => refetch()}
                    disabled={isRefetching}
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary-foreground hover:bg-primary-foreground/20 h-8 w-8"
                    onClick={() => setIsMinimized(!isMinimized)}
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary-foreground hover:bg-primary-foreground/20 h-8 w-8"
                    onClick={() => setIsOpen(false)}
                    title="Đóng chat"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Body - Only show when not minimized */}
            {!isMinimized && (
              <>
                {/* Messages Area */}
                <CardContent className="bg-muted/30 flex-1 space-y-3 overflow-y-auto p-4">
                  {messagesLoading && (
                    <div className="flex h-full items-center justify-center">
                      <p className="text-muted-foreground text-sm">Đang tải...</p>
                    </div>
                  )}

                  {!messagesLoading && (!messages || messages.length === 0) && (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <MessageCircle className="text-muted-foreground mb-2 h-10 w-10" />
                      <p className="text-muted-foreground text-sm">Chưa có tin nhắn</p>
                    </div>
                  )}

                  {!messagesLoading && messages && messages.length > 0 && (
                    <>
                      {messages.map((msg: TMessage, index: number) => {
                        const isMyMessage = msg.fromUserId === currentUserId;

                        return (
                          <div key={`${msg.id}-${index}`} className={`flex gap-2 ${isMyMessage ? "flex-row-reverse" : "flex-row"}`}>
                            <Avatar className="h-7 w-7 flex-shrink-0">
                              {msg.fromUserAvatar ? (
                                <AvatarImage src={msg.fromUserAvatar} alt={msg.fromUserName} />
                              ) : (
                                <AvatarFallback className="text-xs">{msg.fromUserName?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                              )}
                            </Avatar>

                            <div className={`flex max-w-[75%] flex-col gap-1 ${isMyMessage ? "items-end" : "items-start"}`}>
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-medium">{msg.fromUserName}</span>
                                <span className="text-muted-foreground text-[10px]">
                                  {formatDistanceToNow(new Date(msg.createdAt), {
                                    addSuffix: true,
                                    locale: vi,
                                  })}
                                </span>
                              </div>
                              <div
                                className={`rounded-2xl px-3 py-2 ${
                                  isMyMessage ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted rounded-tl-sm"
                                }`}
                              >
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
                <div className="bg-background border-t p-3">
                  <div className="flex gap-2">
                    <Input
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Nhập tin nhắn..."
                      disabled={isSending}
                      className="flex-1 text-sm"
                    />
                    <Button onClick={handleSendMessage} disabled={!messageInput.trim() || isSending} size="icon" className="flex-shrink-0">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </>
  );
}
