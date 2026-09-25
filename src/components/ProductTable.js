"use client";

import React from "react";
import Link from "next/link";
import { Star, Edit, Trash2, Eye, ArrowUpDown, Tag, AlertCircle } from "lucide-react";

/**
 * ProductTable Component (Desktop View)
 * Displays product data in a structured, sortable data table with status badges and quick action buttons.
 */
export default function ProductTable({
  products = [],
  sortBy,
  order,
  onSort,
  onEdit,
  onDelete,
}) {
  const getSortIcon = (field) => {
    if (sortBy !== field) return <ArrowUpDown className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400" />;
    return (
      <span className="text-indigo-400 font-bold text-xs">
        {order === "asc" ? "▲" : "▼"}
      </span>
    );
  };

  return (
    <div className="hidden md:block overflow-x-auto bg-slate-900 border border-slate-800 rounded-xl shadow-md">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider font-semibold">
            <th className="py-3.5 px-4 w-16">Image</th>
            <th
              onClick={() => onSort("title")}
              className="py-3.5 px-4 cursor-pointer hover:text-indigo-400 transition-colors group"
            >
              <div className="flex items-center gap-1.5">
                <span>Title</span>
                {getSortIcon("title")}
              </div>
            </th>
            <th className="py-3.5 px-4">Category</th>
            <th
              onClick={() => onSort("price")}
              className="py-3.5 px-4 cursor-pointer hover:text-indigo-400 transition-colors group"
            >
              <div className="flex items-center gap-1.5">
                <span>Price</span>
                {getSortIcon("price")}
              </div>
            </th>
            <th
              onClick={() => onSort("rating")}
              className="py-3.5 px-4 cursor-pointer hover:text-indigo-400 transition-colors group"
            >
              <div className="flex items-center gap-1.5">
                <span>Rating</span>
                {getSortIcon("rating")}
              </div>
            </th>
            <th className="py-3.5 px-4">Stock</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-sm text-slate-200">
          {products.map((product) => {
            const thumbnail = product.thumbnail || product.images?.[0] || "/placeholder.png";
            const isLowStock = product.stock > 0 && product.stock <= 10;
            const isOutOfStock = product.stock === 0;

            return (
              <tr
                key={product.id}
                className="hover:bg-slate-800/40 transition-colors duration-150"
              >
                {/* Product Image */}
                <td className="py-3 px-4">
                  <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center p-1">
                    <img
                      src={thumbnail}
                      alt={product.title}
                      className="w-full h-full object-contain hover:scale-110 transition-transform duration-200"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/100?text=Product";
                      }}
                    />
                  </div>
                </td>

                {/* Title & Brand */}
                <td className="py-3 px-4 font-medium text-slate-100 max-w-xs">
                  <Link
                    href={`/products/${product.id}`}
                    className="hover:text-indigo-400 hover:underline transition-colors line-clamp-1"
                    title={product.title}
                  >
                    {product.title}
                  </Link>
                  {product.brand && (
                    <span className="text-xs text-slate-500 block font-normal">
                      {product.brand}
                    </span>
                  )}
                </td>

                {/* Category Badge */}
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700/60 capitalize">
                    <Tag className="w-3 h-3 text-indigo-400" />
                    {product.category?.replace(/-/g, " ")}
                  </span>
                </td>

                {/* Price */}
                <td className="py-3 px-4 font-semibold text-emerald-400">
                  ${Number(product.price).toFixed(2)}
                </td>

                {/* Rating */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium text-slate-200">
                      {Number(product.rating || 0).toFixed(1)}
                    </span>
                  </div>
                </td>

                {/* Stock Status */}
                <td className="py-3 px-4">
                  {isOutOfStock ? (
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-red-950/60 text-red-400 border border-red-800/40 font-medium">
                      Out of Stock
                    </span>
                  ) : isLowStock ? (
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-amber-950/60 text-amber-400 border border-amber-800/40 font-medium">
                      <AlertCircle className="w-3 h-3" />
                      Low ({product.stock})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-medium">
                      {product.stock} units
                    </span>
                  )}
                </td>

                {/* Action Buttons */}
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/products/${product.id}`}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => onEdit(product)}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-amber-600 hover:text-white transition-colors"
                      title="Edit Product"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(product)}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-red-600 hover:text-white transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
