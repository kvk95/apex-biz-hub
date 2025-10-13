import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState, useEffect } from "react";

interface PaginationProps {
  currentPage?: number;
  totalItems: number;
  itemsPerPage?: number;
  pageSizes?: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export function Pagination({
  currentPage = 1,
  totalItems,
  itemsPerPage = 10,
  pageSizes = [5, 10, 20, 50],
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const [page, setPage] = useState(currentPage);
  const [pageSize, setPageSize] = useState(itemsPerPage);

  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  useEffect(() => {
    setPage(currentPage);
  }, [currentPage]);

  useEffect(() => {
    setPageSize(itemsPerPage);
  }, [itemsPerPage]);

  useEffect(() => {
    if (onPageChange) onPageChange(page);
  }, [page, onPageChange]);

  useEffect(() => {
    if (onPageSizeChange) onPageSizeChange(pageSize);
    // Reset to first page when page size changes
    setPage(1);
  }, [pageSize, onPageSizeChange]);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (page > 3) {
        pages.push("...");
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push("...");
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 px-4">
      <div className="text-sm text-muted-foreground">
        Showing {startItem} to {endItem} of {totalItems} results
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-3 py-1.5 rounded border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
          type="button"
        >
          <i className="fa fa-chevron-left text-xs" />
        </button>

        {pageNumbers.map((pageNum, idx) =>
          pageNum === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-3 py-1.5 text-muted-foreground"
            >
              ...
            </span>
          ) : (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum as number)}
              className={`px-3 py-1.5 rounded border transition-colors ${
                page === pageNum
                  ? "bg-[#FF902F] text-white border-[#FF902F] font-medium"
                  : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
              }`}
              aria-label={`Go to page ${pageNum}`}
              aria-current={page === pageNum ? "page" : undefined}
              type="button"
            >
              {pageNum}
            </button>
          )
        )}

        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages || totalPages === 0}
          className="px-3 py-1.5 rounded border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
          type="button"
        >
          <i className="fa fa-chevron-right text-xs" />
        </button>
      </div>

      {onPageSizeChange && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Rows Per Page</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => setPageSize(Number(value))}
          >
            <SelectTrigger className="h-9 w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizes.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-muted-foreground">Entries</span>
        </div>
      )}
    </div>
  );
}