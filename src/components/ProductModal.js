"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, Package, DollarSign, Layers, AlignLeft, Image as ImageIcon, Star } from "lucide-react";

/**
 * ProductModal Component
 * Renders a dialog form for creating or editing product data with validation rules.
 */
export default function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  categories = [],
  isSubmitting = false,
}) {
  const isEditMode = !!initialData;

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    stock: "",
    brand: "",
    description: "",
    thumbnail: "",
    rating: "4.5",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        price: initialData.price !== undefined ? String(initialData.price) : "",
        category: initialData.category || "",
        stock: initialData.stock !== undefined ? String(initialData.stock) : "",
        brand: initialData.brand || "",
        description: initialData.description || "",
        thumbnail: initialData.thumbnail || initialData.images?.[0] || "",
        rating: initialData.rating !== undefined ? String(initialData.rating) : "4.5",
      });
    } else {
      setFormData({
        title: "",
        price: "",
        category: categories[0] ? (typeof categories[0] === "string" ? categories[0] : categories[0].slug) : "",
        stock: "10",
        brand: "",
        description: "",
        thumbnail: "",
        rating: "4.5",
      });
    }
    setErrors({});
  }, [initialData, isOpen, categories]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Product title is required";
    }

    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a valid number greater than 0";
    }

    if (formData.stock === "" || isNaN(formData.stock) || Number(formData.stock) < 0) {
      newErrors.stock = "Stock must be a non-negative integer";
    }

    if (!formData.category) {
      newErrors.category = "Category selection is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    onSubmit({
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      rating: Number(formData.rating || 4.5),
      thumbnail: formData.thumbnail || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Package className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-100">
              {isEditMode ? "Edit Product Details" : "Add New Product"}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Product Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Wireless Noise-Cancelling Headphones"
              className={`w-full bg-slate-950 border ${
                errors.title ? "border-red-500" : "border-slate-800 focus:border-indigo-500"
              } rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
            />
            {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
          </div>

          {/* Price & Stock Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Price ($) *
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="99.99"
                  className={`w-full bg-slate-950 border ${
                    errors.price ? "border-red-500" : "border-slate-800 focus:border-indigo-500"
                  } rounded-lg pl-9 pr-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                />
              </div>
              {errors.price && <p className="text-xs text-red-400 mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Stock Units *
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="50"
                className={`w-full bg-slate-950 border ${
                  errors.stock ? "border-red-500" : "border-slate-800 focus:border-indigo-500"
                } rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
              />
              {errors.stock && <p className="text-xs text-red-400 mt-1">{errors.stock}</p>}
            </div>
          </div>

          {/* Category & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={`w-full bg-slate-950 border ${
                  errors.category ? "border-red-500" : "border-slate-800 focus:border-indigo-500"
                } rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 capitalize cursor-pointer`}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => {
                  const name = typeof cat === "string" ? cat : cat.name || cat.slug;
                  return (
                    <option key={name} value={name} className="capitalize">
                      {name.replace(/-/g, " ")}
                    </option>
                  );
                })}
              </select>
              {errors.category && <p className="text-xs text-red-400 mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Brand Name
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. Sony, Apple, Nike"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Image URL & Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Image Thumbnail URL
              </label>
              <input
                type="url"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Rating (1-5)
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter product features, specifications, and details..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            ></textarea>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditMode ? "Save Changes" : "Create Product"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
