import ImageNotFound from "@/assets/illustration/image-not-found";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import type { FallbackProps } from "react-error-boundary";
import { handleApiError } from "../../lib/error";

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  handleApiError(error);

  return (
    <div className="relative flex min-h-[200px] w-full flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-semibold">Có gì đó không ổn</h2>
      <p className="mb-4 text-sm text-gray-500">Vui lòng thử lại hoặc liên hệ với bộ phận hỗ trợ nếu sự cố vẫn tiếp diễn.</p>
      <ImageNotFound className="mx-auto mb-4 h-80 w-80" />
      <Button onClick={resetErrorBoundary}>
        <RefreshCw className="mr-2" />
        Thử lại
      </Button>
    </div>
  );
};
