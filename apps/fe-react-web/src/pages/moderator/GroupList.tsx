import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Eye, FileText, Plus, Search, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Mock data - 20 groups for testing pagination
const mockGroups = [
  { id: 1, title: "Nhóm AI ứng dụng", description: "Nghiên cứu và phát triển ứng dụng AI trong đời sống", leader: "Nguyễn Văn An", status: "ACTIVE" },
  { id: 2, title: "Nhóm Web Development", description: "Phát triển website hiện đại với React và Node.js", leader: null, status: ",FORMING" },
  { id: 3, title: "Nhóm IoT thực tiễn", description: "Ứng dụng IoT trong nông nghiệp thông minh", leader: "Trần Thị Bình", status: "ACTIVE" },
  { id: 4, title: "Nhóm Machine Learning", description: "Xây dựng mô hình ML cho dự đoán thời tiết", leader: "Lê Văn Cường", status: ",LOCKED" },
  { id: 5, title: "Nhóm Blockchain", description: "Nghiên cứu công nghệ Blockchain và ứng dụng", leader: null, status: ",FORMING" },
  { id: 6, title: "Nhóm Mobile App", description: "Phát triển ứng dụng di động đa nền tảng", leader: "Phạm Thị Dung", status: "ACTIVE" },
  { id: 7, title: "Nhóm Cloud Computing", description: "Triển khai hệ thống trên AWS và Azure", leader: null, status: ",FORMING" },
  { id: 8, title: "Nhóm Cybersecurity", description: "Nghiên cứu an ninh mạng và bảo mật", leader: "Hoàng Văn Em", status: "ACTIVE" },
  { id: 9, title: "Nhóm Data Science", description: "Phân tích dữ liệu lớn với Python", leader: "Vũ Thị Phương", status: "ACTIVE" },
  { id: 10, title: "Nhóm DevOps", description: "Tự động hóa quy trình CI/CD", leader: null, status: ",FORMING" },
  { id: 11, title: "Nhóm AR/VR", description: "Phát triển ứng dụng thực tế ảo", leader: "Đặng Văn Giang", status: ",LOCKED" },
  { id: 12, title: "Nhóm Game Development", description: "Thiết kế game 2D với Unity", leader: "Bùi Thị Hoa", status: "ACTIVE" },
  { id: 13, title: "Nhóm UI/UX Design", description: "Nghiên cứu trải nghiệm người dùng", leader: null, status: ",FORMING" },
  { id: 14, title: "Nhóm Big Data", description: "Xử lý dữ liệu lớn với Hadoop", leader: "Dương Văn Inh", status: "ACTIVE" },
  { id: 15, title: "Nhóm Robotics", description: "Lập trình robot tự động", leader: "Lý Thị Khánh", status: "ACTIVE" },
  { id: 16, title: "Nhóm Smart City", description: "Giải pháp thành phố thông minh", leader: null, status: ",FORMING" },
  { id: 17, title: "Nhóm E-commerce", description: "Xây dựng nền tảng thương mại điện tử", leader: "Phan Văn Long", status: ",LOCKED" },
  { id: 18, title: "Nhóm FinTech", description: "Công nghệ tài chính và thanh toán", leader: "Ngô Thị Mai", status: "ACTIVE" },
  { id: 19, title: "Nhóm EdTech", description: "Nền tảng giáo dục trực tuyến", leader: null, status: ",FORMING" },
  { id: 20, title: "Nhóm HealthTech", description: "Ứng dụng công nghệ trong y tế", leader: "Trịnh Văn Nam", status: "ACTIVE" },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "default";
    case ",FORMING":
      return "secondary";
    case ",LOCKED":
      return "outline";
    default:
      return "outline";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-800 border-green-200";
    case ",FORMING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case ",LOCKED":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "";
  }
};

const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    ACTIVE: "Hoạt động",
    ",FORMING": "Đang hình thành",
    ",LOCKED": "Đã khóa",
  };
  return statusMap[status] || status;
};

export default function GroupList() {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [groups, setGroups] = useState(mockGroups);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const itemsPerPage = 15;

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tên nhóm");
      return;
    }

    const newGroup = {
      id: groups.length + 1,
      title: formData.title,
      description: formData.description,
      leader: null,
      status: ",FORMING",
    };

    setGroups([newGroup, ...groups]);
    toast.success("Tạo nhóm thành công!");
    setIsCreateDialogOpen(false);
    setFormData({ title: "", description: "" });
  };

  const handleCancel = (groupId: number, title: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn hủy ${title}?`)) {
      setGroups(groups.filter((g) => g.id !== groupId));
      toast.success("Đã hủy nhóm thành công!");
    }
  };

  // Filter groups by search term
  const filteredGroups = groups.filter(
    (group) => group.title.toLowerCase().includes(searchTerm.toLowerCase()) || group.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination
  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGroups = filteredGroups.slice(startIndex, endIndex);
  const totalElements = filteredGroups.length;

  // Reset page when search changes
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Danh sách nhóm sinh viên</h1>
              <p className="mt-1 text-sm text-gray-500">Quản lý và theo dõi các nhóm sinh viên</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">
                {totalElements} nhóm
              </Badge>

              {/* Create Group Dialog */}
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="size-4" />
                    Tạo nhóm mới
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tạo nhóm mới</DialogTitle>
                    <DialogDescription>Tạo nhóm rỗng để sinh viên apply vào</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateGroup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Tên nhóm</Label>
                      <Input
                        id="title"
                        placeholder="Nhập tên nhóm..."
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Mô tả</Label>
                      <Textarea
                        id="description"
                        placeholder="Nhập mô tả nhóm..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                      />
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Hủy
                      </Button>
                      <Button type="submit">Tạo nhóm</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo tên nhóm..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Groups Grid */}
        {paginatedGroups.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gray-100">
              <Users className="size-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Không tìm thấy nhóm nào</h3>
            <p className="text-sm text-gray-500">Thử thay đổi từ khóa tìm kiếm hoặc tạo nhóm mới</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedGroups.map((group) => (
                <Card key={group.id} className="transition-shadow hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-bold text-gray-900">{group.title}</CardTitle>
                      <Badge variant={getStatusVariant(group.status)} className={getStatusColor(group.status)}>
                        {getStatusLabel(group.status)}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Description */}
                    <div className="flex items-start gap-2">
                      <FileText className="mt-0.5 size-4 shrink-0 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500">Mô tả</p>
                        <p className="line-clamp-2 text-sm text-gray-900">{group.description || "Chưa có mô tả"}</p>
                      </div>
                    </div>

                    {/* Leader */}
                    <div className="flex items-center gap-2">
                      <Users className="size-4 shrink-0 text-gray-400" />
                      <div>
                        <p className="text-xs font-medium text-gray-500">Trưởng nhóm</p>
                        <p className="text-sm font-semibold text-orange-600">{group.leader || "Chưa có"}</p>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex gap-2 border-t pt-4">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/moderator/home/groups/${group.id}`)}>
                      <Eye className="size-4" />
                      Xem chi tiết
                    </Button>
                    <Button variant="destructive" size="sm" className="flex-1" onClick={() => handleCancel(group.id, group.title)}>
                      <Trash2 className="size-4" />
                      Hủy nhóm
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-white p-4 shadow-sm">
                <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(0, p - 1))} disabled={currentPage === 0}>
                  Trước
                </Button>
                <span className="text-sm text-gray-600">
                  Trang {currentPage + 1} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage === totalPages - 1}
                >
                  Sau
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
