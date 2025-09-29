import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const posts = [
  { id: 1, title: "Ý tưởng cải thiện thư viện", author: "Nguyen Van A", time: "2025-09-29", status: "Chờ duyệt" },
  { id: 2, title: "Gợi ý hoạt động ngoại khóa", author: "Tran Thi B", time: "2025-09-28", status: "Đã duyệt" },
];

export default function Forum() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex h-full w-full flex-col">
      {/* Header forum */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#ff9800]">Diễn đàn trao đổi</h2>
        <Button onClick={() => setOpen(true)} className="bg-[#ff9800] font-semibold text-white">
          Đăng ý tưởng
        </Button>
      </div>
      {/* Danh sách bài viết */}
      <div className="rounded-lg bg-white p-4 shadow">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Tiêu đề</th>
              <th className="py-2">Tác giả</th>
              <th className="py-2">Thời gian</th>
              <th className="py-2">Trạng thái</th>
              <th className="py-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="group transition hover:bg-orange-50">
                <td className="py-2 font-semibold">{post.title}</td>
                <td className="py-2">{post.author}</td>
                <td className="py-2">{post.time}</td>
                <td className="py-2">{post.status}</td>
                <td className="py-2">
                  <div className="flex gap-2 opacity-0 transition group-hover:opacity-100">
                    <Button size="sm" variant="outline">
                      Duyệt
                    </Button>
                    <Button size="sm" variant="destructive">
                      Xoá
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Form đăng ý tưởng */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đăng ý tưởng/gợi ý</DialogTitle>
          </DialogHeader>
          <form className="flex flex-col gap-4">
            <Input placeholder="Tiêu đề" required />
            <Input placeholder="Nội dung" required />
            <Input placeholder="Liên kết Vote (nếu có)" />
            <DialogFooter>
              <Button type="submit" className="bg-[#ff9800] text-white">
                Đăng
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
