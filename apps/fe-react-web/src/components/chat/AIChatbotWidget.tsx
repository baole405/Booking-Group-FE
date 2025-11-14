import type { TChatbotMessage } from "@/apis/chatbot.api";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useChatbotHistory, useSendChatbotMessage } from "@/hooks/use-chatbot";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Bot, Minimize2, RefreshCw, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function AIChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [historyLimit, setHistoryLimit] = useState(20);
  const [hasInteracted, setHasInteracted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Only load history when user has interacted (sent message or clicked refresh)
  const { data: history, isPending: historyLoading, refetch, isRefetching } = useChatbotHistory(historyLimit, hasInteracted);
  const { mutateAsync: sendMessageAsync, isPending: isSending } = useSendChatbotMessage();

  // Auto scroll to bottom when new messages arrive or chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && history && history.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100);
    }
  }, [history, isOpen, isMinimized]);

  // Scroll to bottom when sending new message
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    const userMessage = messageInput.trim();
    setMessageInput(""); // Clear input immediately for better UX

    // Enable history loading on first message
    if (!hasInteracted) {
      setHasInteracted(true);
    }

    try {
      const response = await sendMessageAsync({ message: userMessage });

      if (response.answer) {
        toast.success("AI đã trả lời!");
      }

      // Refetch history to get the latest conversation and scroll to bottom
      setTimeout(() => {
        refetch();
        scrollToBottom();
      }, 500);
    } catch (error) {
      console.error("Chatbot error:", error);
      toast.error("Không thể gửi tin nhắn đến AI");
      setMessageInput(userMessage); // Restore message on error
    }
  };

  const handleRefresh = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
    refetch();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isProcessing = isSending;

  return (
    <>
      {/* Floating AI Button - Positioned left side */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-44 left-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl ${isOpen ? "z-40" : "z-50"}`}
        aria-label={isOpen ? "Close AI chat" : "Open AI chat"}
        title="AI Assistant - Hỗ trợ ghép nhóm học tập"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </button>

      {/* AI Chatbot Window */}
      {isOpen && (
        <div className={`fixed bottom-44 left-6 z-50 transition-all duration-300 ${isMinimized ? "w-80" : "h-[650px] w-[480px]"}`}>
          <Card className="flex h-full flex-col border-2 border-blue-200 shadow-2xl">
            {/* Header */}
            <CardHeader className="border-b bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Bot className="h-5 w-5 flex-shrink-0" />
                  <CardTitle className="truncate text-base">AI Assistant</CardTitle>
                </div>
                <div className="flex items-center gap-1">
                  <Select value={historyLimit.toString()} onValueChange={(value) => setHistoryLimit(Number(value))}>
                    <SelectTrigger className="h-8 w-20 border-white/20 bg-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={handleRefresh}
                    disabled={isRefetching}
                    title="Làm mới"
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={() => setIsMinimized(!isMinimized)}
                    title="Thu gọn"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={() => setIsOpen(false)} title="Đóng">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {!isMinimized && <p className="mt-2 text-xs text-white/90">Chatbot hỗ trợ ghép nhóm học tập. Hỏi về nhóm, thành viên, giáo viên...</p>}
            </CardHeader>

            {/* Body - Only show when not minimized */}
            {!isMinimized && (
              <>
                {/* Messages Area */}
                <CardContent className="flex-1 overflow-hidden p-0">
                  <ScrollArea className="h-[480px] w-full" style={{ scrollBehavior: "smooth" }}>
                    <div className="space-y-3 p-4 pb-2">
                      {/* Welcome message when no interaction yet */}
                      {!hasInteracted && (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                          <Bot className="text-muted-foreground mb-2 h-10 w-10" />
                          <p className="text-muted-foreground text-sm">Chào bạn! Tôi có thể giúp gì?</p>
                          <p className="text-muted-foreground mt-1 text-xs">Hỏi về nhóm học tập, thành viên, giáo viên...</p>
                        </div>
                      )}

                      {/* Loading state */}
                      {hasInteracted && historyLoading && (
                        <div className="flex items-center justify-center py-16">
                          <p className="text-muted-foreground text-sm">Đang tải lịch sử...</p>
                        </div>
                      )}

                      {/* Empty history after interaction */}
                      {hasInteracted && !historyLoading && (!history || history.length === 0) && (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                          <Bot className="text-muted-foreground mb-2 h-8 w-8" />
                          <p className="text-muted-foreground text-sm">Chưa có tin nhắn nào</p>
                        </div>
                      )}

                      {/* Chat history */}
                      {hasInteracted && !historyLoading && history && history.length > 0 && (
                        <>
                          {history.map((msg: TChatbotMessage, index: number) => {
                            const isUser = msg.role === "USER";

                            return (
                              <div key={`${index}-${msg.createdAt}`} className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                                <Avatar className="h-7 w-7 flex-shrink-0">
                                  {isUser ? (
                                    <AvatarFallback className="bg-blue-100 text-xs text-blue-600">U</AvatarFallback>
                                  ) : (
                                    <AvatarFallback className="bg-purple-100 text-xs text-purple-600">
                                      <Bot className="h-4 w-4" />
                                    </AvatarFallback>
                                  )}
                                </Avatar>

                                <div className={`flex max-w-[85%] flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium">{isUser ? "Bạn" : "AI Assistant"}</span>
                                    <span className="text-muted-foreground text-[10px]">
                                      {formatDistanceToNow(new Date(msg.createdAt), {
                                        addSuffix: true,
                                        locale: vi,
                                      })}
                                    </span>
                                  </div>
                                  <div
                                    className={`max-w-full overflow-hidden rounded-2xl px-3 py-2 ${
                                      isUser ? "rounded-tr-sm bg-blue-500 text-white" : "rounded-tl-sm border bg-gray-100 text-gray-900"
                                    }`}
                                  >
                                    <p className="word-break overflow-wrap text-sm break-words hyphens-auto whitespace-pre-wrap">
                                      {msg.content.startsWith('{"error"') ? (
                                        <span className="text-red-500 italic">
                                          <span role="img" aria-label="warning">
                                            ⚠️
                                          </span>{" "}
                                          AI hiện đang quá tải, vui lòng thử lại sau
                                        </span>
                                      ) : (
                                        msg.content
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>

                {/* Input Area */}
                <div className="bg-background border-t p-3">
                  <div className="flex gap-2">
                    <Input
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Hỏi AI về nhóm học tập..."
                      disabled={isProcessing}
                      className="flex-1 text-sm"
                      maxLength={500}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim() || isProcessing}
                      size="icon"
                      className="flex-shrink-0 bg-blue-500 hover:bg-blue-600"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">{isProcessing ? "AI đang suy nghĩ..." : "Nhấn Enter để gửi"}</p>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </>
  );
}
