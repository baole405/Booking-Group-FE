import { envConfig } from "@/schema/config.schema";
import axios from "axios";

const parseParams = (params: Record<string, unknown>) =>
  Object.entries(params)
    .filter(([_, value]) => value !== null && value !== undefined && value !== "") // 🧹 bỏ rác
    .map(([key, value]) => {
      if (Array.isArray(value)) return value.map((v) => `${key}=${encodeURIComponent(v)}`).join("&");
      if (typeof value === "object" && value !== null) return "";
      return `${key}=${encodeURIComponent(value)}`;
    })
    .filter(Boolean)
    .join("&");

export const apiRequest = axios.create({
  baseURL: envConfig.VITE_API_URL,
  paramsSerializer: parseParams,
  withCredentials: false,
});

apiRequest.interceptors.request.use((options) => {
  const { method, data } = options;

  if (method === "put" || method === "post" || method === "patch") {
    if (data instanceof FormData) {
      options.headers["Content-Type"] = "multipart/form-data";
    } else {
      options.headers["Content-Type"] = "application/json;charset=UTF-8";
    }
  }

  // Auto attach token nếu có
  const token = localStorage.getItem("token");
  if (token && options.headers) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  return options;
});

apiRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    // có thể check 401, 403 để logout tự động
    return Promise.reject(error);
  },
);
