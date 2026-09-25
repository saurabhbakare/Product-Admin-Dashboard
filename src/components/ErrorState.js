"use client";

import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

/**
 * ErrorState Component
 * Displays network error message with a prominent Retry button to attempt re-fetching API data.
 */
export default function ErrorState({
  message = "Failed to load product data from server.",
  onRetry,
}) {
  return (
    <div className="bg-red-950/30 border border-red-900/50 rounded-2xl p-8 my-6 text-center max-w-lg mx-auto shadow-lg space-y-4">
      <div className="w-12 h-12 bg-red-900/40 text-red-400 border border-red-800/60 rounded-full flex items-center justify-center mx-auto">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-100 mb-1">
          Something went wrong
        </h3>
        <p className="text-sm text-slate-300">{message}</p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Retry Loading</span>
        </button>
      )}
    </div>
  );
}
