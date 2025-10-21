// src/pages/forum/components/forum-card.tsx
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import type { TPost } from "@/schema/post.schema";

interface ForumCardProps {
  post: TPost;
}

export default function ForumCard({ post }: ForumCardProps) {
  const navigate = useNavigate();
  const createdAt = new Date(post.createdAt);

  return (
    <Card className="overflow-hidden rounded-xl border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex items-center gap-3 border-b bg-muted/30 px-4 py-3">
        <img
          src={post.user.avatarUrl ?? "/avatars/default.png"}
          alt={post.user.fullName}
          className="h-10 w-10 rounded-full border object-cover"
        />
        <div>
          <h3 className="font-semibold">{post.user.fullName}</h3>
          <p className="text-xs text-muted-foreground">
            {post.user.major?.name ?? "Chưa có ngành"}
          </p>
        </div>
      </CardHeader>

      <CardContent className="px-4 py-3 space-y-2">
        <div className="flex items-center justify-between">
          <Badge variant={post.type === "FIND_GROUP" ? "outline" : "secondary"}>
            {post.type === "FIND_GROUP" ? "Tìm nhóm" : "Tìm thành viên"}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays size={14} />
            {createdAt.toLocaleDateString("vi-VN")}
          </div>
        </div>

        <h2 className="text-lg font-semibold">{post.group.title}</h2>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {post.content}
        </p>
      </CardContent>

      <CardFooter className="px-4 py-3 border-t flex justify-between">
        <span className="text-xs text-muted-foreground">
          Nhóm: <span className="font-medium">{post.group.title}</span>
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/student/forum/${post.id}`)}
        >
          Xem chi tiết
        </Button>
      </CardFooter>
    </Card>
  );
}
