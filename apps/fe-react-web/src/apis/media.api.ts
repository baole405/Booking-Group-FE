import { apiRequest } from "@/lib/http";

export interface UploadImageResponse {
  code: number;
  message: string;
  result: string;
}

class MediaApi {
  async uploadImage(formData: FormData): Promise<UploadImageResponse> {
    const response = await apiRequest.post<UploadImageResponse>("/media/upload", formData);
    return response.data;
  }
}

export const mediaApi = new MediaApi();
