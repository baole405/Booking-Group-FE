import { apiRequest } from "@/lib/http";
import type { TAuthResponse, TGoogleLoginRequest, TLoginRequest } from "@/schema/auth.schema";
import type { BaseResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

export const authApi = {
  login: async (request: TLoginRequest) => {
    const response = await apiRequest.post<BaseResponse<TAuthResponse>>(API_SUFFIX.AUTH_API, request);
    return response;
  },

  loginWithGoogle: async (request: TGoogleLoginRequest) => {
    const response = await apiRequest.post<BaseResponse<TAuthResponse>>(API_SUFFIX.GOOGLE_AUTH_API, request);
    return response;
  },
};
