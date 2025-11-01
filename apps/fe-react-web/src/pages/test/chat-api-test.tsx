import { chatApi } from "@/apis/chat.api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGroupHook } from "@/hooks/use-group";
import { useState } from "react";
import { toast } from "sonner";

export default function ChatApiTest() {
  const [response, setResponse] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [groupId, setGroupId] = useState("");
  const [messageId, setMessageId] = useState("");
  const [content, setContent] = useState("");
  const [keyword, setKeyword] = useState("");

  const { useMyGroup } = useGroupHook();
  const { data: groupData } = useMyGroup();
  const myGroup = groupData?.data?.data;

  const handleTest = async (apiCall: () => Promise<unknown>, name: string) => {
    setLoading(true);
    setResponse(null);
    try {
      const result = await apiCall();
      setResponse(result as Record<string, unknown>);
      toast.success(`✅ ${name} thành công!`);
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; statusText?: string; data?: { message?: string; code?: string } }; message?: string };
      const errorData = {
        status: err.response?.status,
        statusText: err.response?.statusText,
        message: err.response?.data?.message || err.message,
        code: err.response?.data?.code,
        data: err.response?.data,
      };
      setResponse(errorData as Record<string, unknown>);
      toast.error(`❌ ${name} thất bại!`);
    } finally {
      setLoading(false);
    }
  };

  const testGetMessages = () => {
    const gid = groupId || myGroup?.id;
    if (!gid) {
      toast.error("Vui lòng nhập Group ID");
      return;
    }
    handleTest(() => chatApi.getGroupMessages(Number(gid), 1, 50), "GET /groups/{groupId}/messages");
  };

  const testSendMessage = () => {
    const gid = groupId || myGroup?.id;
    if (!gid || !content) {
      toast.error("Vui lòng nhập Group ID và Content");
      return;
    }
    handleTest(
      () =>
        chatApi.sendMessage({
          groupId: Number(gid),
          content: content,
          messageType: "TEXT",
        }),
      "POST /messages",
    );
  };

  const testUpdateMessage = () => {
    if (!messageId || !content) {
      toast.error("Vui lòng nhập Message ID và Content");
      return;
    }
    handleTest(() => chatApi.updateMessage(Number(messageId), content), "PUT /messages/{messageId}");
  };

  const testDeleteMessage = () => {
    if (!messageId) {
      toast.error("Vui lòng nhập Message ID");
      return;
    }
    handleTest(() => chatApi.deleteMessage(Number(messageId)), "DELETE /messages/{messageId}");
  };

  const testSearchMessages = () => {
    const gid = groupId || myGroup?.id;
    if (!gid || !keyword) {
      toast.error("Vui lòng nhập Group ID và Keyword");
      return;
    }
    handleTest(() => chatApi.searchMessages(Number(gid), keyword), "GET /groups/{groupId}/search");
  };

  const testGetMessageById = () => {
    if (!messageId) {
      toast.error("Vui lòng nhập Message ID");
      return;
    }
    handleTest(() => chatApi.getMessageById(Number(messageId)), "GET /messages/{messageId}");
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Chat API Test</h1>
        <p className="text-muted-foreground">Test các endpoints của Chat API</p>
        {myGroup && (
          <Badge variant="outline" className="mt-2">
            My Group ID: {myGroup.id} - {myGroup.title}
          </Badge>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Fields */}
        <Card>
          <CardHeader>
            <CardTitle>Input Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Group ID</label>
              <Input
                placeholder={myGroup ? `Default: ${myGroup.id}` : "Enter Group ID"}
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                type="number"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Message ID</label>
              <Input placeholder="Enter Message ID" value={messageId} onChange={(e) => setMessageId(e.target.value)} type="number" />
            </div>

            <div>
              <label className="text-sm font-medium">Content</label>
              <Textarea placeholder="Enter message content" value={content} onChange={(e) => setContent(e.target.value)} rows={3} />
            </div>

            <div>
              <label className="text-sm font-medium">Search Keyword</label>
              <Input placeholder="Enter search keyword" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {/* API Endpoints */}
        <Card>
          <CardHeader>
            <CardTitle>API Endpoints</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button onClick={testGetMessages} disabled={loading} variant="outline" className="w-full justify-start">
              <span className="font-mono text-xs">GET</span>
              <span className="ml-2">/groups/{"{groupId}"}/messages</span>
            </Button>

            <Button onClick={testSendMessage} disabled={loading} variant="outline" className="w-full justify-start">
              <span className="font-mono text-xs">POST</span>
              <span className="ml-2">/messages</span>
            </Button>

            <Button onClick={testUpdateMessage} disabled={loading} variant="outline" className="w-full justify-start">
              <span className="font-mono text-xs">PUT</span>
              <span className="ml-2">/messages/{"{messageId}"}</span>
            </Button>

            <Button onClick={testDeleteMessage} disabled={loading} variant="destructive" className="w-full justify-start">
              <span className="font-mono text-xs">DELETE</span>
              <span className="ml-2">/messages/{"{messageId}"}</span>
            </Button>

            <Button onClick={testSearchMessages} disabled={loading} variant="outline" className="w-full justify-start">
              <span className="font-mono text-xs">GET</span>
              <span className="ml-2">/groups/{"{groupId}"}/search</span>
            </Button>

            <Button onClick={testGetMessageById} disabled={loading} variant="outline" className="w-full justify-start">
              <span className="font-mono text-xs">GET</span>
              <span className="ml-2">/messages/{"{messageId}"}</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Response Display */}
      {response && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Response
              {typeof response === "object" && response !== null && "status" in response && (
                <Badge variant={(response as { status?: number }).status === 200 ? "default" : "destructive"}>
                  {(response as { status?: number }).status}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted max-h-[500px] overflow-auto rounded-lg p-4 text-xs">{JSON.stringify(response, null, 2)}</pre>
          </CardContent>
        </Card>
      )}

      {loading && (
        <Card>
          <CardContent className="py-8 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
              <span>Đang gọi API...</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
