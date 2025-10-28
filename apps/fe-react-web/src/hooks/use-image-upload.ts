import { mediaApi } from "@/apis/media.api";
import { compressImageToWebp } from "@/services/image-compress.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface UploadResult {
  code: number;
  message: string;
  result: string;
}

const UPLOADED_IMAGE_ID_KEY = "uploadedImageId";

export const useImageUpload = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const compressed = await compressImageToWebp(file);
      const formData = new FormData();
      formData.append("file", compressed);
      return mediaApi.uploadImage(formData);
    },
    onSuccess: (data) => {
      localStorage.setItem(UPLOADED_IMAGE_ID_KEY, data.result);
      queryClient.invalidateQueries(); // allow consumers to refresh if needed
    },
  });

  return {
    uploadImage: mutation.mutateAsync,
    isUploading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
};

export const getUploadedImageId = () => localStorage.getItem(UPLOADED_IMAGE_ID_KEY);

export const clearUploadedImageId = () => localStorage.removeItem(UPLOADED_IMAGE_ID_KEY);
