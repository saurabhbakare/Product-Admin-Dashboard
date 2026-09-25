"use client";

import React from "react";
import { Search, X, Filter, ArrowUpDown, Plus, RotateCcw } from "lucide-react";

/**
 * SearchFilterBar Component
 * Renders search bar, category dropdown, sorting dropdown, asc/desc toggle, reset button, and Add Product button.
 */
export default function SearchFilterBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories = [],
  sortBy,
  onSortByChange,
  order,
  onOrderToggle,
  onResetFilters,
  onOpenAddModal,
}) {
  const hasActiveFilters = search || category || sortBy;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-6 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products by title, description..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg pl-10 pr-9 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters & Actions Group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category Filter */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full sm:w-auto bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer capitalize"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => {
                const name = typeof cat === "string" ? cat : cat.name || cat.slug;
                return (
                  <option key={name} value={name} className="capitalize">
                    {name.replace(/-/g, " ")}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="w-full sm:w-auto bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors cursor-pointer"
            >
              <option value="">Sort By: Default</option>
              <option value="price">Sort by Price</option>
              <option value="rating">Sort by Rating</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>

          {/* Order Toggle (Asc / Desc) */}
          {sortBy && (
            <button
              onClick={onOrderToggle}
              className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-300 transition-colors"
              title={`Toggle Sort Order (Currently ${order.toUpperCase()})`}
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
              <span>{order.toUpperCase()}</span>
            </button>
          )}

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors border border-slate-700"
              title="Reset all search & filter options"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {/* Add Product Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium px-4 py-2.5 rounded-lg text-sm shadow-md transition-all duration-150 border border-indigo-500/30 active:scale-95 ml-auto sm:ml-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* API limitation explanation notice when both search & category filter are applied */}
      {search && category && (
        <div className="mt-3 text-xs bg-amber-950/40 border border-amber-800/40 text-amber-300 p-2.5 rounded-lg flex items-center gap-2">
          <span>
            💡 <strong>API Note:</strong> DummyJSON API does not natively support combined search & category endpoints. Search is evaluated within the selected category in-memory.
          </span>
        </div>
      )}
    </div>
  );
}
