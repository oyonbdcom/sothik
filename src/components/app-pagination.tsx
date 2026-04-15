"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

interface AppPaginationProps {
  meta: Meta | undefined;
  onPageChange: (page: number) => void;
}

export default function AppPagination({
  meta,
  onPageChange,
}: AppPaginationProps) {
  if (!meta || meta.totalPage <= 1) return null;

  const { page, totalPage } = meta;

  const handlePageClick = (pageNum: number) => {
    if (pageNum !== page) {
      onPageChange(pageNum);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3; // বর্তমান পেজের আশেপাশে কয়টি পেজ দেখাবে

    for (let i = 1; i <= totalPage; i++) {
      // ১. প্রথম পেজ, বর্তমান পেজ এবং তার আশেপাশের পেজগুলো সবসময় দেখাবে
      if (i === 1 || (i >= page - 1 && i <= page + 1)) {
        pages.push(
          <button
            key={i}
            onClick={() => handlePageClick(i)}
            className={`px-4 py-2 text-sm font-black border transition-all ${
              page === i
                ? "bg-primary-600 text-white border-primary-600 z-10 scale-110 rounded-lg shadow-lg"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {i}
          </button>,
        );
      }
      // ২. এলিপসিস লজিক: যদি বর্তমান পেজের পর আরও অনেক পেজ থাকে
      else if (i === page + 2 && i < totalPage) {
        pages.push(
          <span
            key="single-ellipsis"
            className="px-3 py-2 border border-slate-200 bg-white text-slate-400 flex items-center"
          >
            <MoreHorizontal size={16} />
          </span>,
        );

        // এলিপসিস দেখানোর পর সরাসরি শেষ পেজে চলে যাওয়ার জন্য i আপডেট
        i = totalPage - 1;
      }
      // ৩. শেষ পেজটি সবসময় দেখাবে (যদি না সেটা অলরেডি দেখানো হয়ে থাকে)
      else if (i === totalPage) {
        pages.push(
          <button
            key={totalPage}
            onClick={() => handlePageClick(totalPage)}
            className={`px-4 py-2 text-sm font-black border transition-all ${
              page === totalPage
                ? "bg-primary-600 text-white border-primary-600 rounded-lg"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {totalPage}
          </button>,
        );
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <div className="flex items-center -space-x-px shadow-sm rounded-md overflow-hidden">
        {/* Previous Button */}
        <button
          disabled={page === 1}
          onClick={() => handlePageClick(page - 1)}
          className="p-2   bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Page Numbers */}
        <div className="flex -space-x-px">{renderPageNumbers()}</div>

        {/* Next Button */}
        <button
          disabled={page >= totalPage}
          onClick={() => handlePageClick(page + 1)}
          className="p-2   bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-500 font-medium italic">
        Showing page <span className="text-slate-900">{page}</span> of{" "}
        <span className="text-slate-900">{totalPage}</span>
      </p>
    </div>
  );
}
