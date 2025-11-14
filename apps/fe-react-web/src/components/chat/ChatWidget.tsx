import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDeleteMessage, useGroupMessages, useSearchMessages, useSendMessage, useUpdateMessage } from "@/hooks/use-chat";
import { useGroupHook } from "@/hooks/use-group";
import type { RootState } from "@/redux/store";
import type { TMessage } from "@/schema/chat.schema";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Edit2, MessageCircle, Minimize2, Reply, Search, Send, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [replyToMessage, setReplyToMessage] = useState<TMessage | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserId = useSelector((state: RootState) => state.user.userId);
  const { useMyGroup } = useGroupHook();
  const { data: groupData } = useMyGroup();
  const myGroup = groupData?.data?.data;

  const { data: messages, isPending: messagesLoading, refetch } = useGroupMessages(myGroup?.id ?? null);
  const { mutateAsync: sendMessageAsync, isPending: isSending } = useSendMessage();
  const { mutateAsync: updateMessageAsync, isPending: isUpdating } = useUpdateMessage();
  const { mutateAsync: deleteMessageAsync, isPending: isDeleting } = useDeleteMessage();

  // ✅ Search messages
  const { data: searchResults, isPending: searchLoading } = useSearchMessages(
    myGroup?.id ?? 0,
    searchKeyword,
    isSearching && searchKeyword.length >= 2,
  );

  // ✅ Đảo ngược messages để tin mới nhất ở dưới cùng (dùng useMemo để tránh re-render)
  const reversedMessages = useMemo(() => {
    // Nếu đang search và có kết quả, dùng kết quả search
    if (isSearching && searchResults) {
      return [...searchResults].reverse();
    }
    // Không thì dùng messages thường
    return messages ? [...messages].reverse() : [];
  }, [messages, searchResults, isSearching]);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [reversedMessages.length, isOpen, isMinimized]);

  // Update unread count when closed
  useEffect(() => {
    if (!isOpen && reversedMessages && reversedMessages.length > 0) {
      const lastMessage = reversedMessages[reversedMessages.length - 1];
      if (lastMessage.fromUserId !== currentUserId) {
        setUnreadCount((prev) => prev + 1);
      }
    }
  }, [reversedMessages, isOpen, currentUserId]);

  // Reset unread when open
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  // ✅ Gửi tin nhắn mới hoặc reply
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !myGroup?.id) return;

    try {
      await sendMessageAsync({
        groupId: myGroup.id,
        content: messageInput.trim(),
        messageType: "TEXT",
        replyToMessageId: replyToMessage ? String(replyToMessage.id) : null,
      });
      setMessageInput("");
      setReplyToMessage(null);
      toast.success("Đã gửi");
      refetch();
    } catch (error) {
      console.error("Send message error:", error);
      toast.error("Không thể gửi tin nhắn");
    }
  };

  // ✅ Sửa tin nhắn
  const handleEditMessage = async () => {
    if (!editingContent.trim() || !editingMessageId) return;

    try {
      await updateMessageAsync({
        messageId: editingMessageId,
        content: editingContent.trim(),
      });
      setEditingMessageId(null);
      setEditingContent("");
      toast.success("Đã chỉnh sửa");
      refetch();
    } catch (error) {
      console.error("Edit message error:", error);
      toast.error("Không thể sửa tin nhắn");
    }
  };

  // ✅ Xóa tin nhắn
  const handleDeleteMessage = async (messageId: number) => {
    if (!messageId || messageId <= 0 || !myGroup?.id) {
      toast.warning("ID tin nhắn không hợp lệ");
      return;
    }

    try {
      await deleteMessageAsync({ messageId, groupId: myGroup.id });
      toast.success("Đã xóa tin nhắn");
      refetch();
    } catch (error) {
      console.error("Delete message error:", error);
      toast.error("Không thể xóa tin nhắn");
    }
  };

  // ✅ Bắt đầu chỉnh sửa
  const startEditing = (msg: TMessage) => {
    setEditingMessageId(msg.id);
    setEditingContent(msg.content);
    setReplyToMessage(null);
  };

  // ✅ Hủy chỉnh sửa
  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditingContent("");
  };

  // ✅ Bắt đầu reply
  const startReply = (msg: TMessage) => {
    setReplyToMessage(msg);
    setEditingMessageId(null);
    setEditingContent("");
  };

  // ✅ Hủy reply
  const cancelReply = () => {
    setReplyToMessage(null);
  };

  // ✅ Toggle search mode
  const toggleSearch = () => {
    setIsSearching(!isSearching);
    if (isSearching) {
      setSearchKeyword(""); // Clear search khi đóng
    }
  };

  // ✅ Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  // ✅ Get search status text
  const getSearchStatusText = () => {
    if (searchLoading) return "Đang tìm kiếm...";
    if (searchResults && searchResults.length > 0) return `Tìm thấy ${searchResults.length} tin nhắn`;
    return "Không tìm thấy tin nhắn nào";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (editingMessageId) {
        handleEditMessage();
      } else {
        handleSendMessage();
      }
    }
  };

  // Don't show if no group
  if (!myGroup) return null;

  const isProcessing = isSending || isUpdating || isDeleting;

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
                    className={`text-primary-foreground hover:bg-primary-foreground/20 h-8 w-8 ${isSearching ? "bg-primary-foreground/20" : ""}`}
                    onClick={toggleSearch}
                    title={isSearching ? "Đóng tìm kiếm" : "Tìm kiếm tin nhắn"}
                  >
                    <Search className="h-4 w-4" />
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
                {/* ✅ Search Bar */}
                {isSearching && (
                  <div className="border-b p-3">
                    <div className="relative">
                      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                      <Input
                        value={searchKeyword}
                        onChange={handleSearchChange}
                        placeholder="Tìm kiếm tin nhắn... (tối thiểu 2 ký tự)"
                        className="pl-9 text-sm"
                        maxLength={100}
                        autoFocus
                      />
                    </div>
                    {searchKeyword && <p className="text-muted-foreground mt-2 text-xs">{getSearchStatusText()}</p>}
                  </div>
                )}

                {/* Messages Area */}
                <CardContent className="bg-muted/30 flex-1 space-y-3 overflow-y-auto p-4">
                  {messagesLoading && (
                    <div className="flex h-full items-center justify-center">
                      <p className="text-muted-foreground text-sm">Đang tải...</p>
                    </div>
                  )}

                  {!messagesLoading && (!reversedMessages || reversedMessages.length === 0) && (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <MessageCircle className="text-muted-foreground mb-2 h-10 w-10" />
                      <p className="text-muted-foreground text-sm">Chưa có tin nhắn</p>
                    </div>
                  )}

                  {!messagesLoading && reversedMessages && reversedMessages.length > 0 && (
                    <>
                      {reversedMessages.map((msg: TMessage, index: number) => {
                        const isMyMessage = msg.fromUserId === currentUserId;
                        const isEditing = editingMessageId === msg.id;

                        return (
                          <div key={`${msg.id}-${index}`}>
                            {/* ✅ Reply Preview */}
                            {msg.replyToContent && (
                              <div className="bg-muted/50 border-primary mb-1 ml-10 rounded-lg border-l-2 p-2 text-xs">
                                <p className="text-muted-foreground italic">Trả lời: {msg.replyToContent}</p>
                              </div>
                            )}

                            <div className={`flex gap-2 ${isMyMessage ? "flex-row-reverse" : "flex-row"}`}>
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
                                  {msg.isEdited && <span className="text-muted-foreground text-[10px] italic">(đã sửa)</span>}
                                </div>

                                {/* ✅ Edit Mode */}
                                {isEditing ? (
                                  <div className="flex w-full flex-col gap-2">
                                    <Input
                                      value={editingContent}
                                      onChange={(e) => setEditingContent(e.target.value)}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                          e.preventDefault();
                                          handleEditMessage();
                                        } else if (e.key === "Escape") {
                                          cancelEditing();
                                        }
                                      }}
                                      className="text-sm"
                                      autoFocus
                                    />
                                    <div className="flex gap-1">
                                      <Button size="sm" onClick={handleEditMessage} disabled={isUpdating} className="h-7 text-xs">
                                        Lưu
                                      </Button>
                                      <Button size="sm" variant="outline" onClick={cancelEditing} className="h-7 text-xs">
                                        Hủy
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="group relative">
                                    <div
                                      className={`rounded-2xl px-3 py-2 ${
                                        isMyMessage ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted rounded-tl-sm"
                                      }`}
                                    >
                                      <p className="text-sm break-words whitespace-pre-wrap">{msg.content}</p>
                                    </div>

                                    {/* ✅ Action Buttons (chỉ hiện khi hover và là tin nhắn của mình) */}
                                    {isMyMessage && (
                                      <div
                                        className={`absolute top-0 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 ${
                                          isMyMessage ? "left-0 -translate-x-full" : "right-0 translate-x-full"
                                        }`}
                                      >
                                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => startReply(msg)} title="Trả lời">
                                          <Reply className="h-3 w-3" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => startEditing(msg)} title="Chỉnh sửa">
                                          <Edit2 className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="text-destructive h-6 w-6"
                                          onClick={() => handleDeleteMessage(msg.id)}
                                          title="Xóa"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                )}
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
                  {/* ✅ Reply Preview */}
                  {replyToMessage && (
                    <div className="bg-muted border-primary mb-2 flex items-start justify-between rounded-lg border-l-2 p-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium">Trả lời {replyToMessage.fromUserName}</p>
                        <p className="text-muted-foreground truncate text-xs">{replyToMessage.content}</p>
                      </div>
                      <Button size="icon" variant="ghost" className="h-6 w-6 flex-shrink-0" onClick={cancelReply}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Input
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder={replyToMessage ? "Nhập câu trả lời..." : "Nhập tin nhắn..."}
                      disabled={isProcessing}
                      className="flex-1 text-sm"
                    />
                    <Button onClick={handleSendMessage} disabled={!messageInput.trim() || isProcessing} size="icon" className="flex-shrink-0">
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
