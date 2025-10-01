import { Input } from "@/components/ui/input";
import ForumCard from "./components/forum-card";

export default function ForumPage() {
  // const currentYear = new Date().getFullYear()

  const posts = [
    {
      id: 1,
      author: {
        name: "Nguyễn Văn A",
        avatar: "/avatars/user1.png",
        group: "Frontend Dev",
      },
      type: "Thảo luận",
      title: "Kinh nghiệm học React",
      content: "Mọi người có thể chia sẻ kinh nghiệm học React hiệu quả không? Mình mới bắt đầu và hơi khó theo kịp.",
      image: "/images/post1.jpg",
      // comments omitted for brevity or can be added as needed
    },
    {
      id: 2,
      author: {
        name: "Trần Thị B",
        avatar: "/avatars/user2.png",
        group: "Web Developer",
      },
      type: "Thảo luận",
      title: "Chia sẻ về học JavaScript",
      content: "Có ai có tài liệu học JavaScript căn bản không?",
      image: "/images/post2.jpg",
    },
    {
      id: 3,
      author: {
        name: "Phạm Văn E",
        avatar: "/avatars/user5.png",
        group: undefined,
      },
      type: "Thảo luận",
      title: "Tìm nhóm học React",
      content: "Mình muốn tìm nhóm học React cùng, ai có nhóm cho mình tham gia với.",
      image: "/images/post3.jpg",
    },
    {
      id: 4,
      author: {
        name: "Lê Văn D",
        avatar: "/avatars/user4.png",
        group: undefined,
      },
      type: "Ý tưởng",
      title: "Ý tưởng project nhỏ với React",
      content: "Mọi người có ý tưởng nào cho project nhỏ dùng React không?",
      image: "/images/post4.jpg",
    },
    {
      id: 5,
      author: {
        name: "Nguyễn Văn C",
        avatar: "/avatars/user3.png",
        group: "React Learner",
      },
      type: "Thảo luận",
      title: "Chia sẻ kinh nghiệm học ES6",
      content: "Mọi người học ES6 như thế nào cho hiệu quả?",
      image: "/images/post5.jpg",
    },
  ];

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)_/_12%)_0,_transparent_55%)]"
        aria-hidden="true"
      />

      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <h1 className="text-xl font-semibold text-[#00fff1]">Các nhóm</h1>
        <div className="w-64">
          <Input type="text" placeholder="Nhập tên nhóm..." />
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-5 gap-6 px-6 py-8">
        {/* Sidebar */}
        <aside className="col-span-1">
          <div className="rounded-lg border p-4">
            <h2 className="mb-3 font-semibold">Lĩnh vực</h2>
            <ul className="space-y-2">
              <li>
                <input type="checkbox" /> Tìm nhóm
              </li>
              <li>
                <input type="checkbox" /> Ý tưởng
              </li>
              <li>
                <input type="checkbox" /> marketing
              </li>
            </ul>
          </div>
        </aside>

        {/* Main content */}
        <main className="col-span-4 space-y-4">
          {posts.map((p) => (
            <ForumCard key={p.id} post={p} />
          ))}
        </main>
      </div>
    </div>
  );
}
