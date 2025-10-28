import { envConfig } from "@/schema/config.schema";

/**
 * Build a Cloudflare R2 image URL from the stored image identifier.
 */
export const getCloudflareImageUrl = (imageId: string): string => {
  if (!imageId) return "";
  if (imageId.startsWith("http")) return imageId;

  const baseUrl = envConfig.VITE_CLOUDFLARE_R2_URL ?? "https://your-r2-bucket.r2.dev";
  return `${baseUrl.replace(/\/+$/, "")}/${imageId}`;
};

/**
 * Extract the image identifier from a Cloudflare R2 URL.
 */
export const getImageIdFromUrl = (imageUrl: string): string => {
  if (!imageUrl) return "";
  if (!imageUrl.startsWith("http")) return imageUrl;

  const parts = imageUrl.split("/");
  return parts[parts.length - 1];
};

export const isValidImageId = (imageId: string): boolean => Boolean(imageId?.trim());
