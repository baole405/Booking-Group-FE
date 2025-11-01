import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDeleteMessage, useGroupMessages, useSearchMessages, useSendMessage, useUpdateMessage } from "@/hooks/use-chat";
import { useGroupHook } from "@/hooks/use-group";
import type { RootState } from "@/redux/store";
import type { TMessage } from "@/schema/chat.schema";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { AlertCircle, Edit2, MessageCircle, RefreshCw, Reply, Search, Send, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function GroupChat() {
  const [messageInput, setMessageInput] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [replyToMessage, setReplyToMessage] = useState<TMessage | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUserId = useSelector((state: RootState) => state.user.userId);
  const { useMyGroup } = useGroupHook();
  const { data: groupData, isPending: groupPending } = useMyGroup();
  const myGroup = groupData?.data?.data;

  // Use REST API hooks
  const { data: messages, isPending: messagesLoading, refetch, isRefetching, error: messagesError } = useGroupMessages(myGroup?.id ?? null);
  const { mutateAsync: sendMessageAsync, isPending: isSending } = useSendMessage();
  const { mutateAsync: updateMessageAsync, isPending: isUpdating } = useUpdateMessage();
  const { mutateAsync: deleteMessageAsync, isPending: isDeleting } = useDeleteMessage();

  // ✅ Search messages
  const { data: searchResults, isPending: searchLoading } = useSearchMessages(
    myGroup?.id ?? 0,
    searchKeyword,
    isSearching && searchKeyword.length >= 2,
  );

  // ✅ Đảo ngược messages để tin mới nhất ở dưới cùng
  const reversedMessages = useMemo(() => {
    // Nếu đang search và có kết quả, dùng kết quả search
    if (isSearching && searchResults) {
      return [...searchResults].reverse();
    }
    // Không thì dùng messages thường
    return messages ? [...messages].reverse() : [];
  }, [messages, searchResults, isSearching]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [reversedMessages.length]);

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
      toast.success("Đã gửi tin nhắn");
      refetch();
    } catch (error) {
      console.error("Send message error:", error);
      toast.error(`Không thể gửi tin nhắn: ${error instanceof Error ? error.message : "Unknown error"}`);
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
      toast.success("Đã chỉnh sửa tin nhắn");
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

  const handleRefresh = () => {
    refetch();
    toast.info("Đang làm mới tin nhắn...");
  };

  const isProcessing = isSending || isUpdating || isDeleting;

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
              <Button
                variant="outline"
                size="icon"
                onClick={toggleSearch}
                className={isSearching ? "bg-primary text-primary-foreground" : ""}
                title={isSearching ? "Đóng tìm kiếm" : "Tìm kiếm tin nhắn"}
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefetching}>
                <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* ✅ Search Bar */}
        {isSearching && (
          <div className="border-b p-4">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                value={searchKeyword}
                onChange={handleSearchChange}
                placeholder="Tìm kiếm tin nhắn... (tối thiểu 2 ký tự)"
                className="pl-9"
                maxLength={100}
                autoFocus
              />
            </div>
            {searchKeyword && <p className="text-muted-foreground mt-2 text-sm">{getSearchStatusText()}</p>}
          </div>
        )}

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

          {!messagesLoading && !messagesError && (!reversedMessages || reversedMessages.length === 0) && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <MessageCircle className="text-muted-foreground mb-4 h-12 w-12" />
              <p className="text-muted-foreground">Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
            </div>
          )}

          {!messagesLoading && !messagesError && reversedMessages && reversedMessages.length > 0 && (
            <>
              {reversedMessages.map((msg: TMessage, index: number) => {
                const isMyMessage = msg.fromUserId === currentUserId;
                const isEditing = editingMessageId === msg.id;

                return (
                  <div key={`${msg.id}-${index}`}>
                    {/* ✅ Reply Preview */}
                    {msg.replyToContent && (
                      <div className="bg-muted/50 border-primary mb-2 ml-12 rounded-lg border-l-4 p-3">
                        <p className="text-muted-foreground text-xs italic">
                          <span role="img" aria-label="reply">
                            💬
                          </span>{" "}
                          Trả lời: {msg.replyToContent}
                        </p>
                      </div>
                    )}

                    <div className={`flex gap-3 ${isMyMessage ? "flex-row-reverse" : "flex-row"}`}>
                      <Avatar className="h-8 w-8 flex-shrink-0">
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
                          {msg.isEdited && <span className="text-muted-foreground text-xs italic">(đã sửa)</span>}
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
                              className="min-w-[300px]"
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={handleEditMessage} disabled={isUpdating}>
                                Lưu
                              </Button>
                              <Button size="sm" variant="outline" onClick={cancelEditing}>
                                Hủy
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="group relative">
                            <div className={`rounded-lg px-4 py-2 ${isMyMessage ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                              <p className="text-sm break-words whitespace-pre-wrap">{msg.content}</p>
                            </div>

                            {/* ✅ Action Buttons (chỉ hiện khi hover và là tin nhắn của mình) */}
                            {isMyMessage && (
                              <div
                                className={`absolute top-0 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 ${
                                  isMyMessage ? "left-0 -translate-x-full pr-2" : "right-0 translate-x-full pl-2"
                                }`}
                              >
                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => startReply(msg)} title="Trả lời">
                                  <Reply className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => startEditing(msg)} title="Chỉnh sửa">
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="text-destructive h-8 w-8"
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  title="Xóa"
                                >
                                  <Trash2 className="h-4 w-4" />
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
        <div className="border-t p-4">
          {/* ✅ Reply Preview */}
          {replyToMessage && (
            <div className="bg-muted border-primary mb-3 flex items-start justify-between rounded-lg border-l-4 p-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">
                  <span role="img" aria-label="reply">
                    💬
                  </span>{" "}
                  Trả lời {replyToMessage.fromUserName}
                </p>
                <p className="text-muted-foreground mt-1 truncate text-sm">{replyToMessage.content}</p>
              </div>
              <Button size="icon" variant="ghost" className="h-8 w-8 flex-shrink-0" onClick={cancelReply} title="Hủy trả lời">
                <X className="h-4 w-4" />
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
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!messageInput.trim() || isProcessing} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-muted-foreground mt-2 text-xs">
            Nhấn Enter để gửi, Shift+Enter để xuống dòng. Hover tin nhắn của bạn để xem thêm tùy chọn.
          </p>
        </div>
      </Card>
    </div>
  );
}
