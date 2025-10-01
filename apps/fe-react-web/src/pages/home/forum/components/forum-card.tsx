import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface ForumCardProps {
  post: {
    id: number;
    author: {
      name: string;
      avatar: string;
      group?: string;
    };
    type: string;
    title: string;
    content: string;
    image?: string;
  };
}

export default function ForumCard({ post }: ForumCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="mb-4 overflow-hidden rounded-xl shadow-md">
      <CardHeader className="flex items-center space-x-3">
        <img src={post.author.avatar} alt={post.author.name} className="h-12 w-12 rounded-full border" />
        <div>
          <h3 className="font-semibold">{post.author.name}</h3>
          <span className="rounded-full border bg-gray-100 px-2 py-1 text-xs text-gray-600">{post.author.group || "N/A"}</span>
        </div>
      </CardHeader>

      <CardContent>
        <p className="mb-1 text-sm text-blue-500">#{post.type}</p>
        <h2 className="mb-2 text-lg font-bold">{post.title}</h2>
        <p className="mb-3 text-gray-700">{post.content}</p>
        {post.image && <img src={post.image} alt="Post" className="h-60 w-full rounded-lg border object-cover" />}
      </CardContent>

      <CardFooter>
        <Button variant="outline" onClick={() => navigate(`/forum/${post.id}`)}>
          Xem chi tiết
        </Button>
      </CardFooter>
    </Card>
  );
}
