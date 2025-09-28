// User types
interface UserLoginResponse {
  tokenType: string;
  id: number;
  username: string;
  roles: string[];
  message: string;
  token: string;
  refresh_token: string;
}

export const usersMockData: Record<string, UserLoginResponse> = {
  "admin@fe-swd.com": {
    tokenType: "Bearer",
    id: 1,
    username: "Admin User",
    roles: ["ROLE_ADMIN"],
    message: "Login successful",
    token: "mock-jwt-token-for-admin-user",
    refresh_token: "mock-refresh-token-for-admin-user",
  },
  "user@fe-swd.com": {
    tokenType: "Bearer",
    id: 2,
    username: "Regular User",
    roles: ["ROLE_USER"],
    message: "Login successful",
    token: "mock-jwt-token-for-regular-user",
    refresh_token: "mock-refresh-token-for-regular-user",
  },
  "guest@fe-swd.com": {
    tokenType: "Bearer",
    id: 3,
    username: "Guest User",
    roles: ["ROLE_GUEST"],
    message: "Login successful",
    token: "mock-jwt-token-for-guest-user",
    refresh_token: "mock-refresh-token-for-guest-user",
  },
};

export const loginMock = (email: string, password: string): UserLoginResponse | null => {
  // For demo purposes, accept any password for existing users
  if (usersMockData[email]) {
    return usersMockData[email];
  }
  return null;
};
