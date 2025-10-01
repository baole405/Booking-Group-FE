import { apiRequest } from "@/lib/http";
import type { TAuthResponse, TLoginRequest } from "@/schema/auth.schema";
import type { BaseResponse } from "@/types/response.type";
import { API_SUFFIX } from "./util.api";

export const authApi = {
  login: async (request: TLoginRequest) => {
    return apiRequest.post<BaseResponse<TAuthResponse>>(API_SUFFIX.AUTH_API, request);
  },
};
