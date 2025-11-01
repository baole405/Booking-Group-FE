import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCommentHook } from "@/hooks/use-comment";
import { useIdeaHook } from "@/hooks/use-idea";
import { useMajorHook } from "@/hooks/use-major";
import { usePostHook } from "@/hooks/use-post";
import { useUserHook } from "@/hooks/use-user";
import type { RootState } from "@/redux/store";
import type { TComment } from "@/schema/comment.schema";
import type { TIdea } from "@/schema/ideas.schema";
import type { TMajor } from "@/schema/major.schema";
import type { TPost } from "@/schema/post.schema";
import type { TUpdateUserSchema } from "@/schema/user.schema";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar, FileText, Image, Lightbulb, MessageSquare, UserSquare2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "sonner";

export default function MyProfile() {
  const { useMyProfile, useUpdateMyProfile } = useUserHook();
  const { useMajorList } = useMajorHook();
  const { useGetAllPosts } = usePostHook();
  const { useGetAllComments } = useCommentHook();
  const { useGetAllIdeas } = useIdeaHook();
  const qc = useQueryClient();

  // Lấy role và userId của user hiện tại
  const userRole = useSelector((state: RootState) => state.user.role);
  const currentUserId = useSelector((state: RootState) => state.user.userId);
  const isLecturer = userRole === "LECTURER";
  const isStudent = userRole === "STUDENT";

  // 🔹 Fetch dữ liệu
  const { data, isPending, error } = useMyProfile();
  const { data: majorListRes, isPending: isMajorPending } = useMajorList();
  const { data: postsData } = useGetAllPosts();
  const { data: commentsData } = useGetAllComments();
  const { data: ideasData } = useGetAllIdeas();
  const { mutateAsync: updateUserAsync, isPending: isUpdating } = useUpdateMyProfile();

  const majorList = majorListRes?.data.data ?? [];
  const user = data?.data;

  // Filter user's posts, comments, ideas
  const userPosts = useMemo(() => {
    if (!postsData?.data?.data) return [];
    return (postsData.data.data as TPost[]).filter((post: TPost) => post.userResponse?.id === currentUserId);
  }, [postsData, currentUserId]);

  const userComments = useMemo(() => {
    if (!commentsData?.data?.data) return [];
    return (commentsData.data.data as TComment[]).filter((comment: TComment) => comment.user?.id === currentUserId);
  }, [commentsData, currentUserId]);

  const userIdeas = useMemo(() => {
    if (!ideasData?.data?.data) return [];
    return (ideasData.data.data as TIdea[]).filter((idea: TIdea) => idea.author?.id === currentUserId);
  }, [ideasData, currentUserId]);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  // -------------------- Form setup --------------------
  const form = useForm<{ cvUrl: string | null; avatarUrl: string | null; majorId: number | null }>({
    defaultValues: {
      cvUrl: user?.cvUrl ?? null,
      avatarUrl: user?.avatarUrl ?? null,
      majorId: user?.major?.id ?? null,
    },
  });

  const { register, handleSubmit, setValue, watch, reset } = form;

  // Khi user hoặc data load lại thì reset form
  useEffect(() => {
    if (user) {
      reset({
        cvUrl: user.cvUrl ?? null,
        avatarUrl: user.avatarUrl ?? null,
        majorId: user.major?.id ?? null,
      });
    }
  }, [user, reset]);

  // -------------------- Avatar preview logic --------------------
  const renderAvatarPreview = useMemo(() => {
    if (selectedAvatar) return <img src={selectedAvatar} className="rounded-full object-cover" alt="Preview" />;

    if (user?.avatarUrl) return <img src={user.avatarUrl} className="rounded-full object-cover" alt="Avatar" />;

    return <div className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center rounded-full text-sm">No Avatar</div>;
  }, [selectedAvatar, user?.avatarUrl]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setSelectedAvatar(base64);
        setValue("avatarUrl", base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // -------------------- Submit Update --------------------
  // -------------------- Submit Update --------------------
  const onSubmit = async (values: TUpdateUserSchema) => {
    try {
      await updateUserAsync(values);
      toast.success("Cập nhật thông tin thành công!");

      // ✅ Refetch lại thông tin user từ server
      await qc.invalidateQueries({ queryKey: ["myProfile"] });

      setOpenEdit(false);
    } catch (err) {
      console.error(err);
      toast.error("Không thể cập nhật thông tin!");
    }
  };

  // -------------------- Loading / Error --------------------
  if (isPending) return <p className="text-muted-foreground text-center text-sm">Đang tải thông tin...</p>;
  if (error) return <p className="text-center text-red-500">Lỗi khi tải dữ liệu người dùng!</p>;

  const selectedMajor = watch("majorId") ?? user?.major?.id ?? "";

  // -------------------- JSX --------------------
  return (
    <div className="container mx-auto max-w-7xl px-4 py-6 md:px-6">
      <div className="flex w-full flex-col gap-6">
        {/* Tiêu đề */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Hồ sơ cá nhân</h1>
        </div>

        {/* Layout 2 cột: Avatar bên trái, Activity bên phải */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[350px_1fr]">
          {/* Card chính - Avatar & Basic Info - BÊN TRÁI */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <UserSquare2 className="h-5 w-5" /> Thông tin người dùng
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col items-center gap-4 pb-5">
              {/* Avatar */}
              <Avatar className="h-28 w-28">{renderAvatarPreview}</Avatar>

              {/* Basic Info */}
              <div className="text-center">
                <div className="text-base font-semibold">{user?.fullName || "Chưa có tên"}</div>
                <div className="text-muted-foreground text-xs">{isLecturer ? "Giảng viên - Môn EXE" : user?.studentCode || "Không rõ mã số"}</div>
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

              {/* Detail fields */}
              <div className="mt-4 w-full space-y-3 text-sm">
                <div>
                  <Label className="text-xs">Email</Label>
                  <Input value={user?.email ?? ""} readOnly />
                </div>

                {/* Chỉ hiển thị chuyên ngành cho STUDENT */}
                {isStudent && (
                  <div>
                    <Label className="text-xs">Chuyên ngành</Label>
                    <Input value={user?.major?.name ?? "Chưa có chuyên ngành"} readOnly />
                  </div>
                )}

                {/* Hiển thị môn giảng dạy cho LECTURER */}
                {isLecturer && (
                  <div>
                    <Label className="text-xs">Môn giảng dạy</Label>
                    <Input value="EXE201 - Capstone Project" readOnly />
                  </div>
                )}

                {user?.cvUrl && (
                  <div>
                    <Label className="text-xs">CV</Label>
                    <a
                      href={user.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm font-medium text-blue-600 hover:underline"
                    >
                      Xem CV
                    </a>
                  </div>
                )}
              </div>

              {/* Nút mở dialog cập nhật */}
              <div className="mt-6 flex w-full justify-end">
                <Dialog open={openEdit} onOpenChange={setOpenEdit}>
                  <DialogTrigger asChild>
                    <Button size="sm">Cập nhật thông tin</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Cập nhật hồ sơ</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      {/* Avatar */}
                      <div className="flex flex-col items-center gap-3">
                        <Avatar className="h-24 w-24">{renderAvatarPreview}</Avatar>

                        <Button variant="outline" size="sm" type="button" asChild>
                          <label className="flex cursor-pointer items-center gap-2">
                            <Image className="h-4 w-4" />
                            Chọn ảnh mới
                            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                          </label>
                        </Button>
                      </div>

                      {/* Chuyên ngành - chỉ hiển thị cho STUDENT */}
                      {isStudent && (
                        <div>
                          <Label className="text-xs">Chuyên ngành</Label>
                          <Select
                            onValueChange={(value) => setValue("majorId", Number(value))}
                            value={String(selectedMajor)}
                            disabled={isMajorPending}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn chuyên ngành" />
                            </SelectTrigger>
                            <SelectContent>
                              {majorList.map((m: TMajor) => (
                                <SelectItem key={m.id} value={String(m.id)}>
                                  {m.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {/* Môn giảng dạy - chỉ hiển thị cho LECTURER */}
                      {isLecturer && (
                        <div>
                          <Label className="text-xs">Môn giảng dạy</Label>
                          <Input value="EXE201 - Capstone Project" readOnly className="bg-muted" />
                          <p className="text-muted-foreground mt-1 text-xs">Thông tin này không thể thay đổi</p>
                        </div>
                      )}

                      {/* CV */}
                      <div>
                        <Label className="text-xs">CV (URL)</Label>
                        <Input {...register("cvUrl")} placeholder="Nhập đường dẫn CV..." className="text-sm" />
                      </div>

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpenEdit(false)} disabled={isUpdating}>
                          Hủy
                        </Button>
                        <Button type="submit" disabled={isUpdating}>
                          {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Activity Tabs - BÊN PHẢI */}
          <div className="flex flex-col gap-6">
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
                          <h3 className="text-lg font-semibold">{idea.title}</h3>
                          <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{idea.description}</p>
                          <div className="mt-3 flex items-center gap-3">
                            <Badge variant={getStatusVariant()}>{idea.status}</Badge>
                            <span className="text-muted-foreground flex items-center gap-1 text-xs">
                              <Calendar className="h-3 w-3" />
                              {formatDistanceToNow(new Date(idea.createdAt), { addSuffix: true, locale: vi })}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
