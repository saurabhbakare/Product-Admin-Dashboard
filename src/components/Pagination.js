"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ALLOWED_LIMITS } from "../utils/urlParams";

/**
 * Custom Pagination Component
 * Manages page switching, page size changes, and displays pagination statistics.
 */
export default function Pagination({
  currentPage = 1,
  totalItems = 0,
  limit = 10,
  onPageChange,
  onLimitChange,
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  // Calculate range string (e.g., Showing 21–40 of 194)
  const startItem = totalItems === 0 ? 0 : (safePage - 1) * limit + 1;
  const endItem = Math.min(safePage * limit, totalItems);

  // Generate numbered page buttons array (with ellipsis for large page lists)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push("...");

      const start = Math.max(2, safePage - 1);
      const end = Math.min(totalPages - 1, safePage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (safePage < totalPages - 2) pages.push("...");
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mt-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
      {/* Page Size & Range Summary Text */}
      <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-400">
        <div className="flex items-center gap-2">
          <span>Show:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="bg-slate-950 border border-slate-800 focus:border-indigo-500 text-slate-200 rounded-md px-2.5 py-1 text-xs sm:text-sm focus:outline-none cursor-pointer"
          >
            {ALLOWED_LIMITS.map((size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ))}
          </select>
        </div>

        <span className="h-4 w-px bg-slate-800 hidden sm:block"></span>

        <span>
          Showing <strong className="text-slate-200 font-semibold">{startItem}–{endItem}</strong> of{" "}
          <strong className="text-slate-200 font-semibold">{totalItems}</strong> items
        </span>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(safePage - 1)}
          disabled={safePage <= 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page Number Buttons */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((num, idx) => {
            if (num === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-slate-500 text-xs"
                >
                  ...
                </span>
              );
            }

            const isSelected = num === safePage;
            return (
              <button
                key={num}
                onClick={() => onPageChange(num)}
                className={`min-w-[32px] h-8 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-indigo-600 text-white font-bold shadow"
                    : "bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/80"
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(safePage + 1)}
          disabled={safePage >= totalPages}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs font-medium"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
