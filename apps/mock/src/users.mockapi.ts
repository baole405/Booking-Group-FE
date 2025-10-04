import jwt from "jsonwebtoken";

interface GoogleLoginResponse {
  email: string;
  token: string;
}

interface BaseResponse<T> {
  status: number;
  message: string;
  data: T;
}

// Secret key mock (chỉ dùng cho dev/test)
const SECRET_KEY = "mock-secret";

// Hàm tạo JWT mock (payload giống Google token)
const createMockToken = (user: { email: string; role: string; uid: string }) => {
  return jwt.sign(
    {
      sub: user.email,
      role: user.role,
      uid: user.uid,
      email: user.email,
    },
    SECRET_KEY,
    { expiresIn: "1h" }, // token hết hạn sau 1h
  );
};

// Mock users
export const usersMockData: Record<string, { email: string; role: string; uid: string }> = {
  "admin@fe-swd.com": {
    email: "admin@fe-swd.com",
    role: "ADMIN",
    uid: "UID_ADMIN_001",
  },
  "student@fe-swd.com": {
    email: "student@fe-swd.com",
    role: "STUDENT",
    uid: "UID_STUDENT_001",
  },
  "moderator@fe-swd.com": {
    email: "moderator@fe-swd.com",
    role: "MODERATOR",
    uid: "UID_MODERATOR_001",
  },
  "lecture@fe-swd.com": {
    email: "lecture@fe-swd.com",
    role: "LECTURE",
    uid: "UID_LECTURE_001",
  },
};

// Hàm login mock
export const loginMock = (email: string, password: string): BaseResponse<GoogleLoginResponse | null> => {
  const user = usersMockData[email];
  if (user) {
    return {
      status: 200,
      message: "Google login success",
      data: {
        email: user.email,
        token: createMockToken(user),
      },
    };
  }
  return {
    status: 401,
    message: "Invalid credentials",
    data: null,
  };
};
