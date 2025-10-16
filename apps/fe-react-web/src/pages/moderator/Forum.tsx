import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CheckCircle, Clock, Eye, MessageSquare, Search, Trash2, User, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Mock data - Bài viết để kiểm duyệt
const mockPosts = [
  {
    id: 1,
    title: "Đề xuất cải thiện hệ thống thư viện trường",
    content: "Em đề xuất nên có thêm khu vực tự học nhóm và tăng giờ mở cửa thư viện vào cuối tuần để phục vụ nhu cầu học tập của sinh viên...",
    author: "Nguyễn Văn An",
    studentCode: "SE160123",
    createdAt: "2025-10-15T14:30:00",
    status: "PENDING",
    category: "Cơ sở vật chất",
    votes: 45,
  },
  {
    id: 2,
    title: "Gợi ý tổ chức workshop về AI và Machine Learning",
    content: "Nhà trường nên tổ chức các buổi workshop thực hành về AI/ML để sinh viên có cơ hội tiếp cận công nghệ mới...",
    author: "Trần Thị Bình",
    studentCode: "SE160234",
    createdAt: "2025-10-14T09:15:00",
    status: "APPROVED",
    category: "Hoạt động học tập",
    votes: 78,
  },
  {
    id: 3,
    title: "Đề xuất cải thiện menu căn tin",
    content: "Mong trường xem xét đa dạng hóa thực đơn căn tin, đặc biệt là các món ăn chay và healthy...",
    author: "Lê Văn Cường",
    studentCode: "SE160345",
    createdAt: "2025-10-13T16:45:00",
    status: "REJECTED",
    category: "Dịch vụ",
    votes: 23,
  },
  {
    id: 4,
    title: "Ý tưởng xây dựng app quản lý điểm danh thông minh",
    content: "Đề xuất phát triển ứng dụng điểm danh bằng QR code hoặc GPS để tiện lợi hơn cho sinh viên và giảng viên...",
    author: "Phạm Thị Dung",
    studentCode: "SE160456",
    createdAt: "2025-10-12T11:20:00",
    status: "PENDING",
    category: "Công nghệ",
    votes: 92,
  },
  {
    id: 5,
    title: "Đề xuất tổ chức ngày hội việc làm",
    content: "Trường nên tổ chức Job Fair thường xuyên hơn để sinh viên có cơ hội kết nối với doanh nghiệp...",
    author: "Hoàng Văn Em",
    studentCode: "SE160567",
    createdAt: "2025-10-11T13:10:00",
    status: "APPROVED",
    category: "Sự kiện",
    votes: 156,
  },
  {
    id: 6,
    title: "Gợi ý cải thiện hệ thống wifi campus",
    content: "Wifi hiện tại thường xuyên bị chậm và mất kết nối, đề nghị nâng cấp để phục vụ tốt hơn cho việc học online...",
    author: "Vũ Thị Phương",
    studentCode: "SE160678",
    createdAt: "2025-10-10T08:30:00",
    status: "PENDING",
    category: "Cơ sở vật chất",
    votes: 203,
  },
  {
    id: 7,
    title: "Đề xuất mở rộng bãi đỗ xe sinh viên",
    content: "Bãi xe hiện tại quá chật, đề nghị mở rộng hoặc xây thêm tầng để đáp ứng nhu cầu...",
    author: "Đặng Văn Giang",
    studentCode: "SE160789",
    createdAt: "2025-10-09T15:25:00",
    status: "PENDING",
    category: "Cơ sở vật chất",
    votes: 167,
  },
  {
    id: 8,
    title: "Ý tưởng CLB lập trình thi đấu",
    content: "Thành lập CLB lập trình thi đấu để rèn luyện kỹ năng giải thuật và tham gia các cuộc thi...",
    author: "Bùi Thị Hoa",
    studentCode: "SE160890",
    createdAt: "2025-10-08T10:40:00",
    status: "APPROVED",
    category: "Hoạt động ngoại khóa",
    votes: 89,
  },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "PENDING":
      return {
        label: "Chờ duyệt",
        variant: "secondary" as const,
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock,
      };
    case "APPROVED":
      return {
        label: "Đã duyệt",
        variant: "default" as const,
        className: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
      };
    case "REJECTED":
      return {
        label: "Từ chối",
        variant: "destructive" as const,
        className: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
      };
    default:
      return {
        label: status,
        variant: "outline" as const,
        className: "",
        icon: Clock,
      };
  }
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    "Cơ sở vật chất": "bg-blue-100 text-blue-700",
    "Hoạt động học tập": "bg-purple-100 text-purple-700",
    "Dịch vụ": "bg-orange-100 text-orange-700",
    "Công nghệ": "bg-cyan-100 text-cyan-700",
    "Sự kiện": "bg-pink-100 text-pink-700",
    "Hoạt động ngoại khóa": "bg-indigo-100 text-indigo-700",
  };
  return colors[category] || "bg-gray-100 text-gray-700";
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function Forum() {
  const [posts, setPosts] = useState(mockPosts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [selectedPost, setSelectedPost] = useState<(typeof mockPosts)[0] | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const itemsPerPage = 15;

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "ALL" || post.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  const handleApprove = (postId: number, title: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn duyệt bài viết "${title}"?`)) {
      setPosts(posts.map((post) => (post.id === postId ? { ...post, status: "APPROVED" } : post)));
      toast.success("Đã duyệt bài viết thành công!");
      setIsDetailDialogOpen(false);
    }
  };

  const handleReject = (postId: number, title: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn từ chối bài viết "${title}"?`)) {
      setPosts(posts.map((post) => (post.id === postId ? { ...post, status: "REJECTED" } : post)));
      toast.error("Đã từ chối bài viết!");
      setIsDetailDialogOpen(false);
    }
  };

  const handleDelete = (postId: number, title: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa bài viết "${title}"?`)) {
      setPosts(posts.filter((post) => post.id !== postId));
      toast.success("Đã xóa bài viết!");
      setIsDetailDialogOpen(false);
    }
  };

  const handleViewDetail = (post: (typeof mockPosts)[0]) => {
    setSelectedPost(post);
    setIsDetailDialogOpen(true);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(0);
  };

  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
    setCurrentPage(0);
  };

  const pendingCount = posts.filter((p) => p.status === "PENDING").length;
  const approvedCount = posts.filter((p) => p.status === "APPROVED").length;
  const rejectedCount = posts.filter((p) => p.status === "REJECTED").length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Kiểm duyệt bài viết</h1>
              <p className="mt-1 text-sm text-gray-500">Quản lý và kiểm duyệt bài viết từ sinh viên</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                {filteredPosts.length} bài viết
              </Badge>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề, tác giả, nội dung..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2">
            <Button variant={filterStatus === "ALL" ? "default" : "outline"} size="sm" onClick={() => handleFilterChange("ALL")}>
              Tất cả ({posts.length})
            </Button>
            <Button
              variant={filterStatus === "PENDING" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("PENDING")}
              className={filterStatus === "PENDING" ? "" : "border-yellow-300 text-yellow-700 hover:bg-yellow-50"}
            >
              <Clock className="mr-1 size-3" />
              Chờ duyệt ({pendingCount})
            </Button>
            <Button
              variant={filterStatus === "APPROVED" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("APPROVED")}
              className={filterStatus === "APPROVED" ? "" : "border-green-300 text-green-700 hover:bg-green-50"}
            >
              <CheckCircle className="mr-1 size-3" />
              Đã duyệt ({approvedCount})
            </Button>
            <Button
              variant={filterStatus === "REJECTED" ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange("REJECTED")}
              className={filterStatus === "REJECTED" ? "" : "border-red-300 text-red-700 hover:bg-red-50"}
            >
              <XCircle className="mr-1 size-3" />
              Từ chối ({rejectedCount})
            </Button>
          </div>
        </div>

        {/* Posts Grid */}
        {paginatedPosts.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gray-100">
              <MessageSquare className="size-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Không tìm thấy bài viết nào</h3>
            <p className="text-sm text-gray-500">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedPosts.map((post) => {
                const statusConfig = getStatusConfig(post.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <Card key={post.id} className="flex flex-col transition-shadow hover:shadow-md">
                    <CardHeader className="pb-3">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <h3 className="line-clamp-2 flex-1 text-base font-bold text-gray-900">{post.title}</h3>
                        <Badge className={statusConfig.className}>
                          <StatusIcon className="mr-1 size-3" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                      <Badge variant="outline" className={`w-fit ${getCategoryColor(post.category)}`}>
                        {post.category}
                      </Badge>
                    </CardHeader>

                    <CardContent className="flex-1 space-y-3 pb-3">
                      <p className="line-clamp-3 text-sm text-gray-600">{post.content}</p>

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <User className="size-3" />
                        <span className="font-medium">{post.author}</span>
                        <span>•</span>
                        <span>{post.studentCode}</span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {formatDate(post.createdAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="size-3" />
                          {post.votes} votes
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="flex gap-2 border-t pt-3">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleViewDetail(post)}>
                        <Eye className="mr-1 size-3" />
                        Chi tiết
                      </Button>
                      {post.status === "PENDING" && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(post.id, post.title)}
                          >
                            <CheckCircle className="mr-1 size-3" />
                            Duyệt
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleReject(post.id, post.title)}>
                            <XCircle className="size-3" />
                          </Button>
                        </>
                      )}
                      {post.status !== "PENDING" && (
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id, post.title)}>
                          <Trash2 className="mr-1 size-3" />
                          Xóa
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-600">
                  Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredPosts.length)} trong tổng số {filteredPosts.length} bài viết
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 0}>
                    Trang trước
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <Button
                        key={i}
                        variant={currentPage === i ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(i)}
                        className="min-w-[2rem]"
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages - 1}>
                    Trang sau
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-2xl">
            {selectedPost && (
              <>
                <DialogHeader>
                  <div className="flex items-start justify-between gap-4">
                    <DialogTitle className="flex-1 text-xl">{selectedPost.title}</DialogTitle>
                    <Badge className={getStatusConfig(selectedPost.status).className}>{getStatusConfig(selectedPost.status).label}</Badge>
                  </div>
                  <DialogDescription>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                      <Badge variant="outline" className={getCategoryColor(selectedPost.category)}>
                        {selectedPost.category}
                      </Badge>
                      <span>•</span>
                      <span className="font-medium">{selectedPost.author}</span>
                      <span>({selectedPost.studentCode})</span>
                      <span>•</span>
                      <span>{formatDate(selectedPost.createdAt)}</span>
                      <span>•</span>
                      <span>{selectedPost.votes} votes</span>
                    </div>
                  </DialogDescription>
                </DialogHeader>

                <div className="max-h-96 overflow-y-auto">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h4 className="mb-2 font-semibold text-gray-900">Nội dung:</h4>
                    <p className="text-sm whitespace-pre-wrap text-gray-700">{selectedPost.content}</p>
                  </div>
                </div>

                <DialogFooter className="gap-2">
                  {selectedPost.status === "PENDING" ? (
                    <>
                      <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                        Đóng
                      </Button>
                      <Button variant="destructive" onClick={() => handleReject(selectedPost.id, selectedPost.title)}>
                        <XCircle className="mr-1 size-4" />
                        Từ chối
                      </Button>
                      <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleApprove(selectedPost.id, selectedPost.title)}>
                        <CheckCircle className="mr-1 size-4" />
                        Duyệt bài
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                        Đóng
                      </Button>
                      <Button variant="destructive" onClick={() => handleDelete(selectedPost.id, selectedPost.title)}>
                        <Trash2 className="mr-1 size-4" />
                        Xóa bài viết
                      </Button>
                    </>
                  )}
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
