import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ROUTES } from "@/constants/route.constant";
import { useAiChatbotHistory, useSendAiChatbotMessage } from "@/hooks/use-ai-chatbot";
import { cn } from "@/lib/utils";
import type { AiChatAttachments, AiChatMessageResponse, AiChatRole } from "@/schema/ai-chatbot.schema";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Loader2, MessageCircle, RefreshCw, Send, Sparkles, X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type UiChatMessage = AiChatMessageResponse & {
  id: string;
  attachments?: AiChatAttachments | null;
};

const HISTORY_LIMIT = 20;

const AiChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<UiChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: history, isPending: historyPending, isRefetching, refetch, error: historyError } = useAiChatbotHistory(HISTORY_LIMIT);
  const { mutateAsync: sendMessageAsync, isPending: isSending } = useSendAiChatbotMessage();

  const sortedHistory = useMemo(() => {
    if (!history || !history.length) return [];
    return [...history].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [history]);

  useEffect(() => {
    if (!sortedHistory.length) {
      setMessages([]);
      return;
    }

    setMessages(
      sortedHistory.map((message, index) => ({
        ...message,
        id: `history-${message.role}-${message.createdAt}-${index}`,
      })),
    );
  }, [sortedHistory]);

  useEffect(() => {
    if (!historyError) return;
    const message = extractErrorMessage(historyError);
    toast.error(message);
  }, [historyError]);

  useEffect(() => {
    if (!isOpen) return;
    const scrollDelay = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 120);

    return () => clearTimeout(scrollDelay);
  }, [messages, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const focusDelay = setTimeout(() => textareaRef.current?.focus(), 180);
    return () => clearTimeout(focusDelay);
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleRefresh = async () => {
    const result = await refetch();
    if (result.error) {
      toast.error(extractErrorMessage(result.error));
      return;
    }
    toast.success("Đã đồng bộ hội thoại gần nhất");
  };

  const handleSend = async () => {
    const value = draft.trim();
    if (!value || isSending) return;

    try {
      const response = await sendMessageAsync(value);
      const now = new Date().toISOString();

      const userMessage: UiChatMessage = {
        id: crypto.randomUUID?.() ?? `user-${Date.now()}`,
        role: "user",
        content: value,
        createdAt: now,
      };

      const assistantMessage: UiChatMessage = {
        id: crypto.randomUUID?.() ?? `assistant-${Date.now()}`,
        role: "assistant",
        content: response.answer,
        attachments: response.attachments,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setDraft("");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleSend();
  };

  const isHistoryLoading = historyPending && !messages.length;

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3">
      {isOpen && (
        <Card className="border-primary/20 w-[min(92vw,22rem)] rounded-2xl shadow-2xl sm:w-[26rem]">
          <CardHeader className="pb-3">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="text-primary h-4 w-4" />
                  SWD AI Teammate
                  <Badge variant="outline" className="text-[10px] tracking-wide uppercase">
                    Beta
                  </Badge>
                </CardTitle>
                <p className="text-muted-foreground text-xs">
                  Hỏi về nhóm của bạn, trạng thái thành viên hoặc giảng viên hướng dẫn. Bot sẽ gọi dữ liệu backend – không dùng Gemini ở client.
                </p>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={handleRefresh}
                  disabled={isRefetching || historyPending}
                  aria-label="Làm mới hội thoại"
                >
                  {isRefetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleToggle} aria-label="Đóng chat AI">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {(isRefetching || historyPending) && (
              <p className="text-muted-foreground mt-2 text-xs">
                <Loader2 className="mr-2 inline h-3 w-3 animate-spin" />
                Đang đồng bộ với /api/chatbot/history?limit=20
              </p>
            )}

            {historyError && <p className="text-destructive mt-2 text-xs">Không thể tải hội thoại. Vui lòng thử lại.</p>}
          </CardHeader>

          <CardContent className="space-y-0 p-0">
            <div className="border-border/80 border-t">
              <ScrollArea className="h-[360px] px-4 py-3">
                {isHistoryLoading && (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <SkeletonBubble key={index} align={index % 2 === 0 ? "left" : "right"} />
                    ))}
                  </div>
                )}

                {!isHistoryLoading && !messages.length && (
                  <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-2 text-center text-sm">
                    <Sparkles className="text-primary h-5 w-5" />
                    <p>Chưa có hội thoại. Hãy hỏi bot để bắt đầu.</p>
                  </div>
                )}

                <div className="space-y-3">
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>
            </div>

            <div className="border-border/60 bg-muted/40 border-t p-3">
              <form className="space-y-2" onSubmit={handleSubmit}>
                <Textarea
                  ref={textareaRef}
                  placeholder="Nhập câu hỏi..."
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      handleSend();
                    }
                  }}
                  className="bg-background/80 min-h-[68px] resize-none text-sm"
                />
                <div className="text-muted-foreground flex items-center justify-between text-xs">
                  <span>Nhấn Enter để gửi • Shift + Enter để xuống dòng</span>
                  <Button type="submit" size="sm" disabled={!draft.trim() || isSending} className="gap-1">
                    {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Gửi
                  </Button>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      )}

      <Button
        onClick={handleToggle}
        className={cn(
          "bg-primary flex items-center gap-2 rounded-full px-5 py-2 text-sm shadow-lg transition hover:shadow-xl",
          isOpen && "bg-primary/90",
        )}
        aria-expanded={isOpen}
        aria-label="Mở chat AI"
      >
        <Sparkles className="h-4 w-4" />
        AI Chat
      </Button>
    </div>
  );
};

const MessageBubble = ({ message }: { message: UiChatMessage }) => {
  const normalizedRole = normalizeRole(message.role);
  const isUser = normalizedRole === "user";

  return (
    <div className={cn("flex w-full items-end gap-2", isUser ? "justify-end" : "justify-start")}>
      {!isUser && <ChatAvatar label="AI" className="bg-muted text-foreground" textClass="text-foreground" />}

      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm",
          isUser ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm",
        )}
      >
        <p className="text-sm whitespace-pre-line">{message.content}</p>
        <p className={cn("mt-1 text-[11px]", isUser ? "text-primary-foreground/80" : "text-muted-foreground")}>
          {formatDistanceToNow(new Date(message.createdAt), {
            addSuffix: true,
            locale: vi,
          })}
        </p>
        {message.attachments && <AttachmentsRenderer attachments={message.attachments} />}
      </div>

      {isUser && <ChatAvatar label="Bạn" className="bg-primary text-primary-foreground" textClass="text-primary-foreground" />}
    </div>
  );
};

const ChatAvatar = ({ label, className, textClass }: { label: string; className: string; textClass: string }) => (
  <Avatar className={cn("h-8 w-8 text-xs font-semibold", className)}>
    <AvatarFallback className={cn("text-xs font-semibold", textClass)}>{label}</AvatarFallback>
  </Avatar>
);

const AttachmentsRenderer = ({ attachments }: { attachments: AiChatAttachments }) => {
  const groupList = Array.isArray(attachments.groups) ? attachments.groups : [];
  const teacherList = Array.isArray(attachments.teachers) ? attachments.teachers : [];
  const memberList = Array.isArray(attachments.members) ? attachments.members : [];

  const buildGroupLink = (groupId?: number) => (groupId ? ROUTES.STUDENT.GROUP_DETAIL.replace(":id", String(groupId)) : ROUTES.STUDENT.GROUPS);

  const sections: ReactNode[] = [];

  const groupSection = renderGroupSection(groupList, buildGroupLink);
  if (groupSection) sections.push(groupSection);

  const teacherSection = renderTeacherSection(teacherList, attachments.groupId, attachments.groupTitle, buildGroupLink);
  if (teacherSection) sections.push(teacherSection);

  const memberSection = renderMemberSection(memberList);
  if (memberSection) sections.push(memberSection);

  const statusSection = renderStatusSection(attachments);
  if (statusSection) sections.push(statusSection);

  if (!sections.length) return null;

  return (
    <div className="border-primary/30 bg-background/80 text-foreground mt-3 space-y-3 rounded-xl border border-dashed p-3 shadow-sm">
      {sections.map((section, index) => (
        <div key={`attachment-section-${index}`} className="space-y-2">
          {section}
          {index < sections.length - 1 && <Separator className="my-1" />}
        </div>
      ))}
    </div>
  );
};

const renderGroupSection = (groups: AiChatAttachments["groups"], buildGroupLink: (groupId?: number) => string) => {
  if (!groups?.length) return null;

  return (
    <>
      <AttachmentLabel icon="group">Nhóm liên quan</AttachmentLabel>
      <div className="space-y-2">
        {groups.map((group) => (
          <div key={group.id} className="border-border/60 bg-muted/40 flex items-center justify-between rounded-lg border px-3 py-2 text-sm">
            <div>
              <p className="font-medium">{group.title}</p>
              {group.description && <p className="text-muted-foreground line-clamp-2 text-xs">{group.description}</p>}
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to={buildGroupLink(group.id)}>Xem</Link>
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};

const renderTeacherSection = (
  teachers: AiChatAttachments["teachers"],
  groupId: number | undefined,
  groupTitle: string | undefined,
  buildGroupLink: (groupId?: number) => string,
) => {
  if (!teachers?.length) return null;

  return (
    <>
      <AttachmentLabel icon="teacher">Giảng viên hướng dẫn</AttachmentLabel>
      <div className="space-y-2">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="border-border/60 bg-muted/30 rounded-lg border px-3 py-2 text-sm">
            <p className="font-semibold">{teacher.fullName}</p>
            {teacher.role && <p className="text-muted-foreground text-xs">{teacher.role}</p>}
            <p className="text-xs">{teacher.email}</p>
          </div>
        ))}
      </div>
      {groupId && (
        <Button variant="secondary" size="sm" asChild className="w-full">
          <Link to={buildGroupLink(groupId)}>Xem nhóm {groupTitle ?? ""}</Link>
        </Button>
      )}
    </>
  );
};

const renderMemberSection = (members: AiChatAttachments["members"]) => {
  if (!members?.length) return null;

  return (
    <>
      <AttachmentLabel icon="member">Thành viên</AttachmentLabel>
      <div className="flex flex-wrap gap-2">
        {members.map((member) => (
          <Badge key={member.id} variant="secondary" className="text-xs">
            {member.fullName ?? `User #${member.id}`}
          </Badge>
        ))}
      </div>
    </>
  );
};

const renderStatusSection = (attachments: AiChatAttachments) => {
  const hasStatus =
    attachments.myGroup ||
    attachments.memberCount !== undefined ||
    attachments.majorCount !== undefined ||
    attachments.isDiverse !== undefined ||
    attachments.memberCountValid !== undefined ||
    attachments.status ||
    attachments.membershipRole;

  if (!hasStatus) return null;

  return (
    <>
      <AttachmentLabel icon="status">Trạng thái nhóm</AttachmentLabel>
      <div className="border-border/60 bg-muted/20 rounded-lg border p-3 text-sm">
        <p className="font-semibold">{attachments.myGroup?.title ?? attachments.groupTitle ?? "Nhóm của bạn"}</p>
        <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
          {renderStatusRow("Số thành viên", attachments.memberCount ?? attachments.myGroup?.memberCount)}
          {renderStatusRow("Chuyên ngành", attachments.majorCount ?? attachments.myGroup?.majorCount)}
          {renderStatusRow("Vai trò", attachments.membershipRole ?? attachments.myGroup?.membershipRole)}
          {attachments.status || attachments.myGroup?.status ? (
            <div>
              <dt className="text-muted-foreground">Trạng thái</dt>
              <dd className="font-medium">{attachments.status ?? attachments.myGroup?.status}</dd>
            </div>
          ) : null}
          {attachments.isDiverse !== undefined || attachments.myGroup?.isDiverse !== undefined ? (
            <div>
              <dt className="text-muted-foreground">Ngành đa dạng</dt>
              <dd className="font-medium">{(attachments.isDiverse ?? attachments.myGroup?.isDiverse) ? "Đạt" : "Chưa"}</dd>
            </div>
          ) : null}
          {attachments.memberCountValid !== undefined || attachments.myGroup?.memberCountValid !== undefined ? (
            <div>
              <dt className="text-muted-foreground">Sĩ số hợp lệ</dt>
              <dd className="font-medium">{(attachments.memberCountValid ?? attachments.myGroup?.memberCountValid) ? "Có" : "Không"}</dd>
            </div>
          ) : null}
        </dl>
      </div>
    </>
  );
};

const AttachmentLabel = ({ children, icon }: { children: ReactNode; icon: "group" | "teacher" | "member" | "status" }) => {
  const iconMap: Record<typeof icon, ReactNode> = {
    group: <MessageCircle className="text-primary h-3.5 w-3.5" />,
    teacher: <Sparkles className="text-primary h-3.5 w-3.5" />,
    member: <MessageCircle className="text-primary h-3.5 w-3.5" />,
    status: <Sparkles className="text-primary h-3.5 w-3.5" />,
  };

  return (
    <p className="text-muted-foreground flex items-center gap-1 text-xs font-semibold uppercase">
      {iconMap[icon]}
      {children}
    </p>
  );
};

const renderStatusRow = (label: string, value?: string | number | null) => {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
};

const SkeletonBubble = ({ align }: { align: "left" | "right" }) => (
  <div className={cn("flex", align === "right" ? "justify-end" : "justify-start")}>
    <div className="bg-muted/60 h-16 w-44 animate-pulse rounded-2xl" />
  </div>
);

const normalizeRole = (role: AiChatRole) => (role ? role.toString().toLowerCase() : "");

const extractErrorMessage = (error: unknown) => {
  if (!error) return "Đã xảy ra lỗi không xác định";
  if (typeof error === "string") return error;

  if (typeof error === "object" && "response" in error && error.response && typeof error.response === "object") {
    const axiosError = error as {
      response?: { data?: { message?: string }; status?: number };
      message?: string;
    };
    return axiosError.response?.data?.message || axiosError.message || "Không thể kết nối máy chủ";
  }

  if (error instanceof Error) return error.message;
  return "Không thể xử lý yêu cầu";
};

export default AiChatWidget;
