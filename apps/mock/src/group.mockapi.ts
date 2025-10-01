// ========== Group types ==========
export interface Group {
  id: string;
  name: string;
  logo?: string;
  tags: string[];
  teamSize: number;
  startDate: string;
  endDate: string;
  leader: string;
  mentor: string;
  lecturer: string;
  description: string;
}

// ========== Mock data ==========
export const groups: Group[] = [
  {
    id: "EXE201",
    name: "NuFit",
    logo: "/nufit-logo.png",
    tags: ["AI & Machine Learning", "Healthcare"],
    teamSize: 4,
    startDate: "28/09/2025",
    endDate: "31/12/2025",
    leader: "Nguyen Le Nhat Huy (K18 QN)",
    mentor: "Dr. Tran Van Nam",
    lecturer: "Prof. Le Thi Hoa",
    description: "NuFit leverages AI to create personalized training plans to improve both physical and mental well-being.",
  },
  {
    id: "EXE202",
    name: "Trầm Hương TA",
    logo: "/tramhuong.png",
    tags: ["Logistics", "GreenTech"],
    teamSize: 3,
    startDate: "27/09/2025",
    endDate: "31/12/2025",
    leader: "Nguyen Thanh",
    mentor: "N/A",
    lecturer: "N/A",
    description: "Một dự án logistics kết hợp công nghệ xanh nhằm tối ưu vận chuyển.",
  },
  {
    id: "EXE203",
    name: "CyberShield",
    logo: "/cybershield.png",
    tags: ["Cybersecurity"],
    teamSize: 5,
    startDate: "01/10/2025",
    endDate: "31/12/2025",
    leader: "Tran Van An",
    mentor: "Nguyen Van B",
    lecturer: "N/A",
    description: "Phát triển hệ thống bảo mật chống tấn công DDoS và bảo vệ dữ liệu người dùng.",
  },
  {
    id: "EXE204",
    name: "FinTrack",
    logo: "/fintrack.png",
    tags: ["FinTech"],
    teamSize: 4,
    startDate: "05/10/2025",
    endDate: "31/12/2025",
    leader: "Le Hoang Minh",
    mentor: "Pham Thi Lan",
    lecturer: "N/A",
    description: "Ứng dụng quản lý chi tiêu cá nhân tích hợp AI dự đoán tài chính.",
  },
  {
    id: "EXE205",
    name: "EduNext",
    logo: "/edunext.png",
    tags: ["EduTech", "AI & Machine Learning"],
    teamSize: 6,
    startDate: "07/10/2025",
    endDate: "31/12/2025",
    leader: "Nguyen Hoang Phuc",
    mentor: "Do Van Son",
    lecturer: "N/A",
    description: "Nền tảng học trực tuyến cá nhân hóa theo khả năng học viên.",
  },
  {
    id: "EXE206",
    name: "GreenFarm",
    logo: "/greenfarm.png",
    tags: ["IoT", "GreenTech"],
    teamSize: 5,
    startDate: "10/10/2025",
    endDate: "31/12/2025",
    leader: "Pham Van Tuan",
    mentor: "Nguyen Thi Mai",
    lecturer: "N/A",
    description: "Hệ thống nông nghiệp thông minh sử dụng IoT và năng lượng tái tạo.",
  },
  {
    id: "EXE207",
    name: "ChainTrust",
    logo: "/chaintrust.png",
    tags: ["Blockchain", "FinTech"],
    teamSize: 4,
    startDate: "12/10/2025",
    endDate: "31/12/2025",
    leader: "Dang Quoc Bao",
    mentor: "Tran Thi Lan Anh",
    lecturer: "N/A",
    description: "Ứng dụng blockchain để xác thực giao dịch và hợp đồng thông minh.",
  },
  {
    id: "EXE208",
    name: "MediConnect",
    logo: "/mediconnect.png",
    tags: ["Healthcare", "Logistics"],
    teamSize: 3,
    startDate: "15/10/2025",
    endDate: "31/12/2025",
    leader: "Vu Thi Huong",
    mentor: "N/A",
    lecturer: "N/A",
    description: "Hệ thống quản lý phân phối thuốc an toàn và nhanh chóng.",
  },
  {
    id: "EXE209",
    name: "GameOn",
    logo: "/gameon.png",
    tags: ["Game Development", "AI"],
    teamSize: 5,
    startDate: "18/10/2025",
    endDate: "31/12/2025",
    leader: "Bui Van Quang",
    mentor: "Nguyen Van Nam",
    lecturer: "N/A",
    description: "Phát triển game RPG tích hợp AI để tạo cốt truyện động.",
  },
  {
    id: "EXE210",
    name: "SmartCity",
    logo: "/smartcity.png",
    tags: ["IoT", "GreenTech", "AI"],
    teamSize: 6,
    startDate: "20/10/2025",
    endDate: "31/12/2025",
    leader: "Tran Hoang Duy",
    mentor: "N/A",
    lecturer: "N/A",
    description: "Giải pháp thành phố thông minh quản lý giao thông, rác thải và năng lượng.",
  },
];

// ========== BaseResponse & Pagination ==========
export type BaseResponse<T> = {
  status: number;
  message: string;
  data: T;
};

export type PaginationResponse<T> = {
  size: number; // số phần tử mỗi trang
  page: number; // trang hiện tại
  total: number; // tổng số phần tử
  totalPages: number; // tổng số trang
  items: T[]; // dữ liệu
};

// ========== Get all groups with pagination ==========
export const getAllGroups = (page = 1, size = 5): BaseResponse<PaginationResponse<Group>> => {
  const total = groups.length;
  const totalPages = Math.ceil(total / size);

  // Tính index để slice dữ liệu
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const items = groups.slice(startIndex, endIndex);

  return {
    status: 200,
    message: "Groups fetched successfully",
    data: {
      size,
      page,
      total,
      totalPages,
      items,
    },
  };
};

// Lấy chi tiết nhóm theo id
export const getGroupById = (id: string): BaseResponse<Group | null> => {
  const group = groups.find((g) => g.id === id) || null;
  return {
    status: group ? 200 : 404,
    message: group ? "Group found" : "Group not found",
    data: group,
  };
};

// Tạo nhóm mới
export const createGroup = (newGroup: Group): BaseResponse<Group> => {
  const group = { ...newGroup };
  groups.push(group);
  return {
    status: 201,
    message: "Group created successfully",
    data: group,
  };
};

// Cập nhật nhóm
export const updateGroup = (id: string, updatedData: Partial<Group>): BaseResponse<Group | null> => {
  const index = groups.findIndex((g) => g.id === id);
  if (index === -1) {
    return { status: 404, message: "Group not found", data: null };
  }
  groups[index] = { ...groups[index], ...updatedData };
  return {
    status: 200,
    message: "Group updated successfully",
    data: groups[index],
  };
};

// Xóa nhóm
export const deleteGroup = (id: string): BaseResponse<null> => {
  const index = groups.findIndex((g) => g.id === id);
  if (index === -1) {
    return { status: 404, message: "Group not found", data: null };
  }
  groups.splice(index, 1);
  return {
    status: 200,
    message: "Group deleted successfully",
    data: null,
  };
};
