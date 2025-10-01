import { useState } from "react";
import { useParams } from "react-router-dom";

interface Comment {
  id: number;
  author: {
    name: string;
    avatar: string;
    group?: string;
  };
  content: string;
  replies?: Comment[];
}

const mockPost = {
  id: 1,
  author: { name: "Nguyễn Văn A", avatar: "/avatar1.png", group: "Nhóm 1" },
  type: "Discussion",
  title: "Cách chăm sóc da mùa hè",
  content: "Mùa hè da dễ bị nhờn, mọi người có tips gì không?",
  image: "/post-img.png",
};

const mockComments: Comment[] = [
  {
    id: 1,
    author: { name: "Trần Thị B", avatar: "/avatar2.png", group: "Nhóm Skincare" },
    content: "Mình hay dùng toner kiềm dầu.",
    replies: [
      {
        id: 11,
        author: { name: "Nguyễn Văn C", avatar: "/avatar3.png" },
        content: "Chuẩn luôn, toner cực hợp mùa hè.",
      },
    ],
  },
  {
    id: 2,
    author: { name: "Lê Văn D", avatar: "/avatar4.png" },
    content: "Nên dùng kem chống nắng SPF50 nhé!",
  },
];

export default function ForumDetail() {
  const { id } = useParams();
  const [comments, setComments] = useState<Comment[]>(mockComments);

  return (
    <div className="grid grid-cols-3 gap-4 p-6">
      {/* 2/3 bài viết */}
      <div className="col-span-2 rounded-xl bg-white p-4 shadow">
        <div className="mb-4 flex items-center space-x-3">
          <img src={mockPost.author.avatar} alt={mockPost.author.name} className="h-12 w-12 rounded-full border" />
          <div>
            <h3 className="font-semibold">{mockPost.author.name}</h3>
            <span className="rounded-full border bg-gray-100 px-2 py-1 text-xs text-gray-600">{mockPost.author.group || "N/A"}</span>
          </div>
        </div>
        <p className="mb-1 text-sm text-blue-500">#{mockPost.type}</p>
        <h2 className="mb-2 text-lg font-bold">{mockPost.title}</h2>
        <p className="mb-3 text-gray-700">{mockPost.content}</p>
        {mockPost.image && <img src={mockPost.image} alt="Post" className="h-72 w-full rounded-lg border object-cover" />}
      </div>

      {/* 1/3 comment */}
      <div className="col-span-1 max-h-[80vh] overflow-y-auto rounded-xl bg-gray-50 p-4 shadow">
        <h3 className="mb-3 font-bold">Bình luận</h3>
        {comments.map((cmt) => (
          <div key={cmt.id} className="mb-4">
            <div className="flex items-center space-x-2">
              <img src={cmt.author.avatar} alt={cmt.author.name} className="h-8 w-8 rounded-full border" />
              <div>
                <p className="text-sm font-semibold">{cmt.author.name}</p>
                <span className="rounded-full border bg-gray-200 px-2 py-0.5 text-xs text-gray-600">{cmt.author.group || "N/A"}</span>
              </div>
            </div>
            <p className="ml-10 text-sm text-gray-700">{cmt.content}</p>

            {/* reply */}
            {cmt.replies?.map((reply) => (
              <div key={reply.id} className="mt-2 ml-12">
                <div className="flex items-center space-x-2">
                  <img src={reply.author.avatar} alt={reply.author.name} className="h-7 w-7 rounded-full border" />
                  <div>
                    <p className="text-xs font-semibold">{reply.author.name}</p>
                    <span className="rounded-full border bg-gray-200 px-2 py-0.5 text-xs text-gray-600">{reply.author.group || "N/A"}</span>
                  </div>
                </div>
                <p className="ml-10 text-sm text-gray-700">{reply.content}</p>
              </div>
            ))}

            {/* input trả lời */}
            <div className="mt-2 ml-10">
              <input type="text" placeholder="Trả lời..." className="w-full rounded-lg border px-2 py-1 text-sm" />
            </div>
          </div>
        ))}

        {/* input thêm comment */}
        <div className="mt-4">
          <input type="text" placeholder="Viết bình luận..." className="w-full rounded-lg border px-3 py-2 text-sm" />
        </div>
      </div>
    </div>
  );
}
