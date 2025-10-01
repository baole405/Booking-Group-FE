import jwt from "jsonwebtoken";

interface UserLoginResponse {
  tokenType: string;
  id: number;
  username: string;
  role: string;
  token: string;
  refresh_token: string;
}

interface BaseResponse<T> {
  status: number;
  message: string;
  data: T;
}

// Secret key mock (chỉ dùng cho dev/test)
const SECRET_KEY = "mock-secret";

// Hàm tạo JWT mock
const createMockToken = (user: { id: number; username: string; role: string }) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    SECRET_KEY,
    { expiresIn: "1h" }, // token hết hạn sau 1h
  );
};

// Mock users
export const usersMockData: Record<string, UserLoginResponse> = {
  "admin@fe-swd.com": {
    tokenType: "Bearer",
    id: 1,
    username: "Admin User",
    role: "Admin",
    token: createMockToken({ id: 1, username: "Admin User", role: "Admin" }),
    refresh_token: createMockToken({ id: 1, username: "Admin User", role: "Admin" }),
  },
  "student@fe-swd.com": {
    tokenType: "Bearer",
    id: 2,
    username: "Student User",
    role: "Student",
    token: createMockToken({ id: 2, username: "Student User", role: "Student" }),
    refresh_token: createMockToken({ id: 2, username: "Student User", role: "Student" }),
  },
  "moderator@fe-swd.com": {
    tokenType: "Bearer",
    id: 3,
    username: "Moderator User",
    role: "Moderator",
    token: createMockToken({ id: 3, username: "Moderator User", role: "Moderator" }),
    refresh_token: createMockToken({ id: 3, username: "Moderator User", role: "Moderator" }),
  },
  "lecture@fe-swd.com": {
    tokenType: "Bearer",
    id: 4,
    username: "Lecture User",
    role: "Lecture",
    token: createMockToken({ id: 4, username: "Lecture User", role: "Lecture" }),
    refresh_token: createMockToken({ id: 4, username: "Lecture User", role: "Lecture" }),
  },
};

// Hàm login mock
export const loginMock = (email: string, password: string): BaseResponse<UserLoginResponse> => {
  const user = usersMockData[email];
  if (user) {
    return { status: 200, message: "Login successful", data: user };
  }
  return { status: 401, message: "Invalid credentials", data: null as any };
};
