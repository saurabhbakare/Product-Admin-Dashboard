"use client";

import React from "react";
import Link from "next/link";
import { Star, Edit, Trash2, Eye, Tag, AlertCircle } from "lucide-react";

/**
 * ProductCards Component (Mobile View)
 * Displays product data as responsive card elements on small mobile screens.
 */
export default function ProductCards({ products = [], onEdit, onDelete }) {
  return (
    <div className="block md:hidden space-y-4">
      {products.map((product) => {
        const thumbnail = product.thumbnail || product.images?.[0] || "/placeholder.png";
        const isLowStock = product.stock > 0 && product.stock <= 10;
        const isOutOfStock = product.stock === 0;

        return (
          <div
            key={product.id}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-3"
          >
            {/* Header: Image + Details */}
            <div className="flex gap-3">
              <div className="w-20 h-20 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden flex-shrink-0 p-1 flex items-center justify-center">
                <img
                  src={thumbnail}
                  alt={product.title}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/100?text=Product";
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${product.id}`}
                  className="font-semibold text-slate-100 text-sm hover:text-indigo-400 transition-colors line-clamp-2"
                >
                  {product.title}
                </Link>

                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300 border border-slate-700/60 capitalize">
                    <Tag className="w-3 h-3 text-indigo-400" />
                    {product.category?.replace(/-/g, " ")}
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <span className="font-bold text-emerald-400 text-base">
                    ${Number(product.price).toFixed(2)}
                  </span>

                  <div className="flex items-center gap-1 text-xs text-slate-300">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{Number(product.rating || 0).toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer: Stock + Action Buttons */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              {/* Stock Badge */}
              <div>
                {isOutOfStock ? (
                  <span className="text-xs px-2.5 py-1 rounded bg-red-950/60 text-red-400 border border-red-800/40 font-medium">
                    Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-amber-950/60 text-amber-400 border border-amber-800/40 font-medium">
                    <AlertCircle className="w-3 h-3" /> Low ({product.stock})
                  </span>
                ) : (
                  <span className="text-xs px-2.5 py-1 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-medium">
                    {product.stock} in stock
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/products/${product.id}`}
                  className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => onEdit(product)}
                  className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-amber-600 hover:text-white transition-colors"
                  title="Edit Product"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(product)}
                  className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-red-600 hover:text-white transition-colors"
                  title="Delete Product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
