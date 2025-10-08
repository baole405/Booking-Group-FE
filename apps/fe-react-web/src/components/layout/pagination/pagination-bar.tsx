import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";

type PaginationBarProps = {
  total: number;
  currentPage: number; // 1-based
  totalPages: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  className?: string;
  locale?: string;
  boundaryCount?: number; // số trang giữ cố định ở đầu/cuối (mặc định 1)
  siblingCount?: number; // số trang hai bên current (mặc định 1)
};

function range(start: number, end: number) {
  const out: number[] = [];
  for (let i = start; i <= end; i++) out.push(i);
  return out;
}

function getPageItems(currentPage: number, totalPages: number, boundaryCount: number, siblingCount: number): (number | "…")[] {
  if (totalPages <= 0) return [];
  const startPages = range(1, Math.min(boundaryCount, totalPages));
  const endPages = range(Math.max(totalPages - boundaryCount + 1, boundaryCount + 1), totalPages);

  const leftSiblingStart = Math.max(Math.min(currentPage - siblingCount, totalPages - boundaryCount - siblingCount * 2 - 1), boundaryCount + 2);
  const rightSiblingEnd = Math.min(
    Math.max(currentPage + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? endPages[0] - 2 : totalPages - 1,
  );

  const items: (number | "…")[] = [];
  items.push(...startPages);

  if (leftSiblingStart > boundaryCount + 2) {
    items.push("…");
  } else if (boundaryCount + 1 < totalPages - boundaryCount) {
    items.push(boundaryCount + 1);
  }

  if (leftSiblingStart <= rightSiblingEnd) {
    items.push(...range(leftSiblingStart, rightSiblingEnd));
  }

  if (rightSiblingEnd < totalPages - boundaryCount - 1) {
    items.push("…");
  } else if (totalPages - boundaryCount > boundaryCount) {
    items.push(totalPages - boundaryCount);
  }

  if (endPages[0] > startPages[startPages.length - 1]) {
    items.push(...endPages);
  }

  return items.filter((v, i, arr) => v !== arr[i - 1]);
}

export function PaginationBar({
  total,
  currentPage,
  totalPages,
  pageSize,
  pageSizeOptions = [5, 10, 20, 50],
  onPageChange,
  onPageSizeChange,
  className = "",
  locale = "vi-VN",
  boundaryCount = 1,
  siblingCount = 1,
}: PaginationBarProps) {
  const canPrev = currentPage > 1;
  const canNext = totalPages > 0 && currentPage < totalPages;

  const pageItems = React.useMemo(
    () => getPageItems(currentPage, totalPages, boundaryCount, siblingCount),
    [currentPage, totalPages, boundaryCount, siblingCount],
  );

  const nf = React.useMemo(() => new Intl.NumberFormat(locale), [locale]);

  return (
    <div className={`mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:items-center ${className}`}>
      {/* Trái: Tổng cộng */}
      <div className="text-foreground/80 text-sm sm:justify-self-start">Tổng cộng {nf.format(total)}</div>

      {/* Giữa: chọn size + Hiển thị X/Y */}
      <div className="flex items-center justify-start gap-3 text-sm sm:justify-center">
        <label className="flex items-center gap-2">
          <span className="text-foreground/80"></span>
          <select
            className="h-9 rounded-md border bg-transparent px-2 text-sm"
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              onPageChange(1); // đổi size -> về trang 1
            }}
          >
            {pageSizeOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <span className="text-foreground/60">
          Hiển thị {currentPage} trên {totalPages || 1}
        </span>
      </div>

      {/* Phải: cụm nút trang */}
      <div className="flex items-center justify-start gap-1 sm:justify-end">
        {/* Prev */}
        <Button variant="ghost" size="icon" onClick={() => canPrev && onPageChange(currentPage - 1)} disabled={!canPrev} aria-label="Trang trước">
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Các nút trang */}
        <div className="flex items-center gap-1">
          {pageItems.map((item, idx) =>
            item === "…" ? (
              <span key={`dots-${idx}`} className="text-foreground/60 px-2 text-sm select-none">
                …
              </span>
            ) : (
              <Button
                key={item}
                variant={item === currentPage ? "default" : "outline"}
                className={`h-8 min-w-8 px-2 ${item === currentPage ? "rounded-full" : "bg-background rounded-full"}`}
                onClick={() => onPageChange(item)}
              >
                {item}
              </Button>
            ),
          )}
        </div>

        {/* Next */}
        <Button variant="ghost" size="icon" onClick={() => canNext && onPageChange(currentPage + 1)} disabled={!canNext} aria-label="Trang sau">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
