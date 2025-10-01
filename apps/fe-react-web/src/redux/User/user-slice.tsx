import type { TAuthResponse } from "@/schema/auth.schema";
import type { TRole } from "@/schema/role.schema";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

interface UserState {
  user: TAuthResponse | null;
  isAuthenticated: boolean;
  role: TRole | null;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  role: null,
};

// Check token expired safely
const isTokenExpired = (token?: string): boolean => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token) as any;
    if (!decoded.exp) return true;
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.warn("Invalid token, skipping decode:", error);
    return true;
  }
};

// const setAuthorizationHeaders = (token: string) => {
//   // apiRequest.defaults.headers.common["Authorization"] = `Bearer ${token}`;
// };

// const clearAuthorizationHeaders = () => {
//   // apiRequest.defaults.headers.common["Authorization"] = null;
// };

const clearStoredAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
  // clearAuthorizationHeaders();
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<TAuthResponse | null>) {
      const userData = action.payload;

      if (!userData || !userData.token || isTokenExpired(userData.token)) {
        state.user = null;
        state.isAuthenticated = false;
        state.role = null;
        clearStoredAuthData();
        return;
      }

      // Nếu token hợp lệ mới decode
      let role: TRole | null = null;
      try {
        const decoded = jwtDecode(userData.token) as any;
        role = decoded.role ?? null;
      } catch {
        role = null;
      }

      state.user = userData;
      state.isAuthenticated = true;
      state.role = role;

      localStorage.setItem("token", userData.token);
      localStorage.setItem("refresh_token", userData.refresh_token);
      localStorage.setItem("user", JSON.stringify(userData));

      // setAuthorizationHeaders(userData.token);
    },

    loadUserFromStorage(state) {
      const accessToken = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refresh_token");
      const storedUserData = localStorage.getItem("user");

      if (!accessToken || !refreshToken || !storedUserData || isTokenExpired(accessToken)) {
        clearStoredAuthData();
        state.user = null;
        state.isAuthenticated = false;
        state.role = null;
        return;
      }

      const userData: TAuthResponse = JSON.parse(storedUserData);

      let role: TRole | null = null;
      try {
        const decoded = jwtDecode(accessToken) as any;
        role = decoded.role ?? null;
      } catch {
        role = null;
      }

      state.user = userData;
      state.isAuthenticated = true;
      state.role = role;

      // setAuthorizationHeaders(accessToken);
    },

    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.role = null;
      clearStoredAuthData();
    },
  },
});

export const { setUser, loadUserFromStorage, logout } = userSlice.actions;
export default userSlice.reducer;
