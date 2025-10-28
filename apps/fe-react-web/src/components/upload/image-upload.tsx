import { Button } from "@/components/ui/button";
import { useImageUpload } from "@/hooks/use-image-upload";
import { getCloudflareImageUrl } from "@/utils/cloudflare";
import { Image as ImageIcon, Trash2, Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface ImageUploadProps {
  value?: string;
  onChange?: (imageId: string) => void;
  onClear?: () => void;
  label?: string;
}

export const ImageUpload = ({ value, onChange, onClear, label }: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string>();
  const { uploadImage, isUploading } = useImageUpload();

  const handleSelect = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFile = useCallback(
    async (file?: File) => {
      if (!file) return;
      try {
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        const response = await uploadImage(file);
        onChange?.(response.result);
        setPreview(undefined);
        inputRef.current && (inputRef.current.value = "");
      } catch (error) {
        console.error("Failed to upload image", error);
        setPreview(undefined);
      }
    },
    [onChange, uploadImage],
  );

  const handleClear = () => {
    setPreview(undefined);
    onClear?.();
    inputRef.current && (inputRef.current.value = "");
  };

  const displayUrl = preview ?? (value ? getCloudflareImageUrl(value) : undefined);

  return (
    <div className="border-primary/40 flex w-full flex-col gap-3 rounded-lg border border-dashed p-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <ImageIcon className="h-4 w-4" />
        {label ?? "Tải ảnh"}
      </div>

      <div className="flex flex-col items-center justify-center gap-3">
        {displayUrl ? (
          <img src={displayUrl} alt="Preview" className="h-48 w-full max-w-sm rounded-md object-contain" />
        ) : (
          <div className="border-muted-foreground/40 bg-muted/30 text-muted-foreground flex h-48 w-full max-w-sm flex-col items-center justify-center rounded-md border border-dashed">
            <ImageIcon className="mb-2 h-10 w-10" />
            <span className="text-xs">Chọn ảnh để xem trước</span>
          </div>
        )}

        <div className="flex gap-2">
          <Button type="button" onClick={handleSelect} disabled={isUploading}>
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Đang tải..." : "Chọn ảnh"}
          </Button>
          <Button type="button" variant="secondary" onClick={handleClear} disabled={isUploading}>
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa
          </Button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
      </div>
    </div>
  );
};
