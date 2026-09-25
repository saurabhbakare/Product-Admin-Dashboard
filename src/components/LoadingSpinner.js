"use client";

import React from "react";

/**
 * Skeleton / Spinner Loading Component
 * Displays animated skeleton placeholders during API network requests.
 */
export default function LoadingSpinner() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 animate-pulse">
      {/* Table Header Skeleton */}
      <div className="h-10 bg-slate-800/60 rounded-lg w-full"></div>
      
      {/* Table Rows Skeleton */}
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3">
          <div className="w-12 h-12 bg-slate-800 rounded-lg flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-800 rounded w-1/3"></div>
            <div className="h-3 bg-slate-800/60 rounded w-1/4"></div>
          </div>
          <div className="w-20 h-6 bg-slate-800/80 rounded"></div>
          <div className="w-16 h-6 bg-slate-800/80 rounded"></div>
          <div className="w-24 h-8 bg-slate-800 rounded"></div>
        </div>
      ))}
    </div>
  );
}
