import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export interface PaginationProps {
  currentPage: number; // current active page
  totalPages: number; // total number of pages
  onPageChange: (page: number) => void; // function to call on page click
  totalResults?: number; // total number of items
  limit?: number; // items per page
  isFetching?: boolean; // loading state for disabling buttons
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalResults,
  limit,
  isFetching = false,
}) => {
  if (totalPages <= 1) return null;

  // Generate page numbers with ellipsis logic
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showMax = 5; // maximum page buttons to show

    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-base bg-black-base">
      {/* Showing results info */}

      <div
        className={`
        inline-flex items-center px-4 py-2 rounded-xl
        bg-black-base
        border border-gray-base backdrop-blur-sm
        shadow-lg text-sm
          `}
      >
        {totalResults && limit ? (
          <div className="flex items-center gap-2">
            {/* Results counter */}
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400">Showing</span>
              <span className="px-2 py-0.5 bg-gray-800 rounded-lg text-white font-mono font-bold">
                {(currentPage - 1) * limit + 1}
              </span>
              <span className="text-gray-400">—</span>
              <span className="px-2 py-0.5 bg-gray-800 rounded-lg text-white font-mono font-bold">
                {Math.min(currentPage * limit, totalResults)}
              </span>
            </div>

            {/* Separator */}
            <span className="w-1 h-1 rounded-full bg-gray-600 mx-1" />

            {/* Total results badge */}
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400">Total</span>
              <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-lg font-mono font-bold border border-blue-500/30">
                {totalResults}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Page</span>
            <span className="px-2 py-0.5 bg-gray-800 rounded-lg text-white font-mono font-bold">
              {currentPage}
            </span>
            <span className="text-gray-500">of</span>
            <span className="px-2 py-0.5 bg-gray-800 rounded-lg text-white font-mono font-bold">
              {totalPages}
            </span>
          </div>
        )}
      </div>

      {/* Pagination buttons */}
      <div className="flex items-center gap-1">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isFetching}
          className="p-2 rounded-md border border-gray-base hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <span key={index} className="px-2 text-gray-500">
                <MoreHorizontal size={16} />
              </span>
            ) : (
              <button
                key={index}
                onClick={() => onPageChange(page as number)}
                className={`w-9 h-9 rounded-md text-sm font-medium transition-all ${
                  currentPage === page
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                    : "hover:bg-neutral-800 text-gray-400 border border-transparent hover:border-gray-base"
                }`}
              >
                {page}
              </button>
            ),
          )}
        </div>

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isFetching}
          className="p-2 rounded-md border border-gray-base hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
