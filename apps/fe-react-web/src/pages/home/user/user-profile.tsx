import { InviteButtonWrapper } from "@/components/dialog/InviteButtonWrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCommentHook } from "@/hooks/use-comment";
import { useGroupHook } from "@/hooks/use-group";
import { useIdeaHook } from "@/hooks/use-idea";
import { usePostHook } from "@/hooks/use-post";
import { useUserHook } from "@/hooks/use-user";
import { useRoleNavigate } from "@/hooks/useRoleNavigate";
import type { TComment } from "@/schema/comment.schema";
import type { TIdea } from "@/schema/ideas.schema";
import type { TPost } from "@/schema/post.schema";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { BookOpen, Calendar, FileText, Hash, Lightbulb, Mail, MessageSquare, Users, UserSquare2 } from "lucide-react";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

export default function UserProfileView() {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const roleNavigate = useRoleNavigate();

  const { useUserById } = useUserHook();
  const { useGroupByUserId } = useGroupHook();
  const { useGetAllPosts } = usePostHook();
  const { useGetAllComments } = useCommentHook();
  const { useGetAllIdeas } = useIdeaHook();

  const { data: userData, isPending: userPending, error: userError } = useUserById(userId);
  const { data: groupData } = useGroupByUserId(userId); // Lấy nhóm của user được xem
  const { data: postsData } = useGetAllPosts();
  const { data: commentsData } = useGetAllComments();
  const { data: ideasData } = useGetAllIdeas();

  const user = userData?.data;
  const userGroup = groupData?.data?.data;

  // Filter user's posts
  const userPosts = useMemo(() => {
    if (!postsData?.data?.data) return [];
    return (postsData.data.data as TPost[]).filter((post: TPost) => post.userResponse?.id === userId);
  }, [postsData, userId]);

  // Filter user's comments
  const userComments = useMemo(() => {
    if (!commentsData?.data?.data) return [];
    return (commentsData.data.data as TComment[]).filter((comment: TComment) => comment.user?.id === userId);
  }, [commentsData, userId]);

  // Filter user's ideas
  const userIdeas = useMemo(() => {
    if (!ideasData?.data?.data) return [];
    return (ideasData.data.data as TIdea[]).filter((idea: TIdea) => idea.author?.id === userId);
  }, [ideasData, userId]);

  if (userPending) return <p className="text-muted-foreground mt-10 text-center text-sm">Đang tải thông tin người dùng...</p>;

  if (userError || !user) return <p className="mt-10 text-center text-red-500">Không tìm thấy người dùng.</p>;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hồ sơ cá nhân</h1>
          <p className="text-muted-foreground text-sm">Thông tin chi tiết của {user.role === "LECTURER" ? "giảng viên" : "sinh viên"}</p>
        </div>
        {/* Nút mời vào nhóm - chỉ hiện cho Leader */}
        <InviteButtonWrapper targetUserId={userId} targetUserName={user.fullName ?? "người dùng"} variant="default" size="default" />
      </div>

      {/* Layout: Avatar + Details */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Avatar Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <UserSquare2 className="text-primary h-5 w-5" />
              Thông tin cơ bản
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 pb-5">
            <Avatar className="h-28 w-28 border">
              {user.avatarUrl ? (
                <AvatarImage src={user.avatarUrl} alt={user.fullName} className="object-cover" />
              ) : (
                <AvatarFallback>
                  {(user.fullName ?? "U")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="text-center">
              <div className="text-base font-semibold">{user.fullName}</div>
              <div className="text-muted-foreground text-sm">{user.studentCode ?? "—"}</div>
              <div className="mt-1 text-xs text-emerald-700">{user.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}</div>
            </div>

            {/* Stats */}
            <div className="grid w-full grid-cols-3 gap-2 border-t pt-4 text-center">
              <div>
                <div className="text-primary text-lg font-bold">{userPosts.length}</div>
                <div className="text-muted-foreground text-xs">Bài đăng</div>
              </div>
              <div>
                <div className="text-primary text-lg font-bold">{userComments.length}</div>
                <div className="text-muted-foreground text-xs">Bình luận</div>
              </div>
              <div>
                <div className="text-primary text-lg font-bold">{userIdeas.length}</div>
                <div className="text-muted-foreground text-xs">Ý tưởng</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Chi tiết người dùng</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div>
              <p className="text-muted-foreground flex items-center gap-1">
                <BookOpen className="text-primary h-4 w-4" /> Chuyên ngành
              </p>
              <p className="mt-1 font-medium">{user.major?.name ?? "—"}</p>
            </div>

            <div>
              <p className="text-muted-foreground flex items-center gap-1">
                <Mail className="text-primary h-4 w-4" /> Email
              </p>
              <p className="mt-1 font-medium break-all">{user.email ?? "—"}</p>
            </div>

            <div>
              <p className="text-muted-foreground flex items-center gap-1">
                <Hash className="text-primary h-4 w-4" /> Vai trò
              </p>
              <p className="mt-1 font-medium uppercase">{user.role ?? "STUDENT"}</p>
            </div>

            {user.cvUrl && (
              <div>
                <p className="text-muted-foreground flex items-center gap-1">
                  <BookOpen className="text-primary h-4 w-4" /> CV (URL)
                </p>
                <a
                  href={user.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium break-all text-blue-600 hover:underline"
                >
                  Xem CV
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Group Information */}
      {userGroup && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Users className="text-primary h-5 w-5" />
              Thông tin nhóm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{userGroup.title}</h3>
                <p className="text-muted-foreground mt-1 text-sm">{userGroup.description}</p>
                <div className="mt-2 flex gap-2">
                  <Badge variant={userGroup.status === "LOCKED" ? "default" : "secondary"}>{userGroup.status}</Badge>
                  <Badge variant="outline">{userGroup.type}</Badge>
                </div>
              </div>
              <button
                onClick={() => {
                  if (userGroup?.id) {
                    roleNavigate("GROUP_DETAIL", { id: userGroup.id.toString() });
                  }
                }}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm"
              >
                Xem nhóm
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts">
            <FileText className="mr-2 h-4 w-4" />
            Bài đăng ({userPosts.length})
          </TabsTrigger>
          <TabsTrigger value="comments">
            <MessageSquare className="mr-2 h-4 w-4" />
            Bình luận ({userComments.length})
          </TabsTrigger>
          <TabsTrigger value="ideas">
            <Lightbulb className="mr-2 h-4 w-4" />Ý tưởng ({userIdeas.length})
          </TabsTrigger>
        </TabsList>

        {/* Posts Tab */}
        <TabsContent value="posts" className="mt-4 space-y-4">
          {userPosts.length === 0 ? (
            <Card className="p-8 text-center">
              <FileText className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <p className="text-muted-foreground">Chưa có bài đăng nào</p>
            </Card>
          ) : (
            userPosts.map((post: TPost) => (
              <Card key={post.id} className="transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="line-clamp-3 text-sm">{post.content}</p>
                      <div className="text-muted-foreground mt-3 flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: vi })}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {post.type === "FIND_MEMBER" ? "Tìm thành viên" : "Tìm nhóm"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Comments Tab */}
        <TabsContent value="comments" className="mt-4 space-y-4">
          {userComments.length === 0 ? (
            <Card className="p-8 text-center">
              <MessageSquare className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <p className="text-muted-foreground">Chưa có bình luận nào</p>
            </Card>
          ) : (
            userComments.slice(0, 10).map((comment: TComment) => (
              <Card key={comment.id} className="transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <p className="text-sm">{comment.content}</p>
                  <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs">
                    <Calendar className="h-3 w-3" />
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: vi })}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Ideas Tab */}
        <TabsContent value="ideas" className="mt-4 space-y-4">
          {userIdeas.length === 0 ? (
            <Card className="p-8 text-center">
              <Lightbulb className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <p className="text-muted-foreground">Chưa có ý tưởng nào</p>
            </Card>
          ) : (
            userIdeas.map((idea: TIdea) => {
              const getStatusVariant = () => {
                if (idea.status === "APPROVED") return "default";
                if (idea.status === "REJECTED") return "destructive";
                return "secondary";
              };

              return (
                <Card key={idea.id} className="transition-shadow hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{idea.title}</h3>
                        <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{idea.description}</p>
                        <div className="mt-3 flex items-center gap-3">
                          <Badge variant={getStatusVariant()}>{idea.status}</Badge>
                          <span className="text-muted-foreground flex items-center gap-1 text-xs">
                            <Calendar className="h-3 w-3" />
                            {formatDistanceToNow(new Date(idea.createdAt), { addSuffix: true, locale: vi })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
