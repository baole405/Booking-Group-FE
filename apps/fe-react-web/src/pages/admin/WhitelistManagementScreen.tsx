import { AdminFilterBar, AdminLayout } from "@/components/layout/AdminLayout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSemesterHook } from "@/hooks/use-semester";
import { useWhitelistHook } from "@/hooks/use-whitelist";
import type { TSemester } from "@/schema/semester.schema";
import type { TWhitelist } from "@/schema/whitelist.schema";
import { useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Download, FileUp, RefreshCw, Search, Trash2, Upload, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

const ROLES = [
  { value: "STUDENT", label: "Sinh viên" },
  { value: "LECTURER", label: "Giảng viên" },
  { value: "MODERATOR", label: "Kiểm duyệt viên" },
];

export default function WhitelistManagementScreen() {
  const queryClient = useQueryClient();
  const { useSemesterList } = useSemesterHook();
  const { useWhitelistBySemester, useImportWhitelist, useRemoveEmail, useClearAllEmails } = useWhitelistHook();

  const [selectedSemesterId, setSelectedSemesterId] = useState<number>(0);
  const [selectedRole, setSelectedRole] = useState<string>("STUDENT");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch data
  const { data: semesterData, isLoading: isSemesterLoading } = useSemesterList();
  const { data: whitelistData, isLoading: isWhitelistLoading, refetch } = useWhitelistBySemester(selectedSemesterId, selectedRole);

  // Mutations
  const { mutate: importWhitelist, isPending: isImporting } = useImportWhitelist();
  const { mutate: removeEmail, isPending: isDeleting } = useRemoveEmail();
  const { mutate: clearAllEmails, isPending: isClearing } = useClearAllEmails();

  const semesters = useMemo(() => semesterData?.data?.data || [], [semesterData?.data?.data]);

  useEffect(() => {
    if (semesters.length > 0 && selectedSemesterId === 0) {
      const activeSemester: TSemester | undefined = semesters.find((s) => s.active);
      if (activeSemester) {
        setSelectedSemesterId(activeSemester.id ?? 0);
      }
    }
  }, [semesters, selectedSemesterId]);
  const whitelists = whitelistData?.data?.data || [];
  const isLoading = isWhitelistLoading || isImporting || isDeleting || isClearing;

  // Filter whitelists
  const filteredWhitelists = whitelists.filter((item: TWhitelist) => {
    const matchRole = item.role === selectedRole;
    const matchSearch =
      searchQuery === "" ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.studentCode && item.studentCode.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchActive = item.isActive;
    return matchRole && matchSearch && matchActive;
  });

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (!["xlsx", "xls"].includes(fileExtension || "")) {
        toast.error("Vui lòng chọn file Excel (.xlsx, .xls)");
        return;
      }
      setSelectedFile(file);
    }
  };

  // Handle import
  const handleImport = () => {
    if (!selectedFile) {
      toast.error("Vui lòng chọn file Excel");
      return;
    }
    if (!selectedSemesterId) {
      toast.error("Vui lòng chọn học kỳ");
      return;
    }

    importWhitelist(
      { semesterId: selectedSemesterId, role: selectedRole, file: selectedFile },
      {
        onSuccess: (response) => {
          const message = response.data?.data;
          toast.success(`${message}!`);
          queryClient.invalidateQueries({ queryKey: ["whitelistList", selectedSemesterId, selectedRole] });
          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        },
        onError: (error: Error) => {
          const axiosError = error as AxiosError<{ message: string }>;
          const errorMessage = axiosError.response?.data?.message || "Import thất bại!";
          toast.error(errorMessage);
        },
      },
    );
  };

  // Handle delete single email
  const handleDeleteSingle = (email: string) => {
    removeEmail(email, {
      onSuccess: () => {
        toast.success("Đã xóa email khỏi whitelist!");
        queryClient.invalidateQueries({ queryKey: ["whitelistList", selectedSemesterId, selectedRole] });
      },
      onError: (error: Error) => {
        const axiosError = error as AxiosError<{ message: string }>;
        const errorMessage = axiosError.response?.data?.message || "Xóa thất bại!";
        toast.error(errorMessage);
      },
    });
  };

  // Handle delete multiple
  const handleDeleteMultiple = () => {
    if (selectedEmails.length === 0) {
      toast.error("Vui lòng chọn ít nhất một email");
      return;
    }

    Promise.all(
      selectedEmails.map((email) =>
        removeEmail(email, {
          onSuccess: () => {
            // intentionally left blank
          },
        }),
      ),
    ).then(() => {
      toast.success(`Đã xóa ${selectedEmails.length} email khỏi whitelist!`);
      queryClient.invalidateQueries({ queryKey: ["whitelistList", selectedSemesterId, selectedRole] });
      setSelectedEmails([]);
      setShowDeleteDialog(false);
    });
  };

  // Handle clear all
  const handleClearAll = () => {
    if (!selectedSemesterId) {
      toast.error("Vui lòng chọn học kỳ");
      return;
    }

    clearAllEmails(
      { semesterId: selectedSemesterId, role: selectedRole },
      {
        onSuccess: () => {
          toast.success("Đã xóa toàn bộ whitelist của học kỳ này!");
          queryClient.invalidateQueries({ queryKey: ["whitelistList", selectedSemesterId, selectedRole] });
          setShowClearDialog(false);
        },
        onError: (error: Error) => {
          const axiosError = error as AxiosError<{ message: string }>;
          const errorMessage = axiosError.response?.data?.message || "Xóa thất bại!";
          toast.error(errorMessage);
        },
      },
    );
  };

  // Download template
  const handleDownloadTemplate = () => {
    const template = "Email,Full Name,Student Code\nexample@email.com,Nguyen Van A,SE123456";
    const blob = new Blob([template], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "whitelist_template.csv";
    link.click();
    toast.success("Đã tải xuống file mẫu!");
  };

  return (
    <AdminLayout
      title="Quản lý Whitelist Email"
      description="Import và quản lý danh sách email được phép đăng ký theo học kỳ"
      headerActions={
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleDownloadTemplate}>
            <Download className="mr-1 h-4 w-4" />
            Tải file mẫu
          </Button>
          <Button size="sm" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`mr-1 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Tải lại
          </Button>
        </div>
      }
    >
      {/* Import Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileUp className="h-5 w-5" />
            Import Whitelist
          </CardTitle>
          <CardDescription>
            Upload file Excel để thêm danh sách email vào whitelist. Format: Email (cột A), Họ tên (cột B), Mã sinh viên (cột C - không bắt buộc)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label>Học kỳ</Label>
              <Select
                value={selectedSemesterId?.toString() || ""}
                onValueChange={(value) => setSelectedSemesterId(parseInt(value))}
                disabled={isSemesterLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn học kỳ" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((semester) => (
                    <SelectItem key={semester.id} value={semester.id?.toString() || ""}>
                      {semester.name}
                      {semester.active && <Badge className="ml-2 bg-green-100 text-green-800">Active</Badge>}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Vai trò</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>File Excel</Label>
              <div className="flex gap-2">
                <Input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFileSelect} disabled={isImporting} />
                {selectedFile && (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-end">
              <Button onClick={handleImport} disabled={isImporting || !selectedFile} className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                {isImporting ? "Đang import..." : "Import"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Section */}
      <AdminFilterBar>
        <div className="flex flex-1 items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo email, họ tên, mã sinh viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {selectedEmails.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{selectedEmails.length} đã chọn</Badge>
              <Button size="sm" variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="mr-1 h-4 w-4" />
                Xóa đã chọn
              </Button>
            </div>
          )}

          <Button size="sm" variant="destructive" onClick={() => setShowClearDialog(true)} disabled={!selectedSemesterId}>
            <Trash2 className="mr-1 h-4 w-4" />
            Xóa tất cả
          </Button>
        </div>
      </AdminFilterBar>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Họ tên</TableHead>
                <TableHead>Mã sinh viên</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isWhitelistLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center">
                    <RefreshCw className="mx-auto mb-2 h-6 w-6 animate-spin" />
                    <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>
                  </TableCell>
                </TableRow>
              )}

              {!isWhitelistLoading && filteredWhitelists.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center">
                    <p className="text-sm text-gray-500">
                      {selectedSemesterId === 0 ? "Vui lòng chọn học kỳ để xem whitelist" : "Không có email nào trong whitelist"}
                    </p>
                  </TableCell>
                </TableRow>
              )}

              {!isWhitelistLoading && filteredWhitelists.length > 0 && (
                <>
                  {filteredWhitelists.map((item: TWhitelist) => (
                    <TableRow key={item.email}>
                      <TableCell className="font-medium">{item.email}</TableCell>
                      <TableCell>{item.fullName}</TableCell>
                      <TableCell>{item.studentCode || "-"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{ROLES.find((r) => r.value === item.role)?.label || item.role}</Badge>
                      </TableCell>
                      <TableCell>
                        {item.isActive ? (
                          <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">Đã xóa</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteSingle(item.email)} disabled={isDeleting}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Multiple Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa {selectedEmails.length} email?</AlertDialogTitle>
            <AlertDialogDescription>Các email này sẽ bị đánh dấu là không hoạt động. Bạn có chắc chắn muốn tiếp tục?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMultiple} disabled={isDeleting}>
              {isDeleting ? "Đang xóa..." : "Xác nhận"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Clear All Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              <span role="img" aria-label="Cảnh báo">
                ⚠️
              </span>{" "}
              Xóa tất cả whitelist?
            </AlertDialogTitle>

            <AlertDialogDescription className="space-y-2">
              <p>Thao tác này sẽ xóa toàn bộ whitelist cho:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  Học kỳ: <strong>{semesters.find((s) => s.id === selectedSemesterId)?.name || "N/A"}</strong>
                </li>
                <li>
                  Vai trò: <strong>{ROLES.find((r) => r.value === selectedRole)?.label}</strong>
                </li>
              </ul>
              <p className="font-semibold text-red-600">Hành động này không thể hoàn tác!</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearAll} disabled={isClearing} className="bg-red-600 hover:bg-red-700">
              {isClearing ? "Đang xóa..." : "Xóa tất cả"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
