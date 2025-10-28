import { ImageUpload } from "@/components/upload/image-upload";
import { getCloudflareImageUrl } from "@/utils/cloudflare";
import { useState } from "react";

const UploadTestPage = () => {
  const [imageId, setImageId] = useState<string>();

  const handleClear = () => setImageId(undefined);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 py-10">
      <div>
        <h1 className="text-2xl font-semibold">Test tải ảnh với Cloudflare R2</h1>
        <p className="text-muted-foreground text-sm">Ảnh sẽ được nén thành WebP bằng Squoosh (jsquash) trước khi gửi lên backend /media/upload.</p>
      </div>

      <ImageUpload value={imageId} onChange={setImageId} onClear={handleClear} label="Chọn ảnh" />

      {imageId && (
        <div className="border-border bg-muted/40 rounded-md border px-4 py-3 text-sm">
          <p>
            Image ID: <code>{imageId}</code>
          </p>
          <p>
            URL: <code>{getCloudflareImageUrl(imageId)}</code>
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadTestPage;
