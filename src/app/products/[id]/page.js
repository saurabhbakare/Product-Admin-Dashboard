"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import LoadingSpinner from "../../../components/LoadingSpinner";
import ErrorState from "../../../components/ErrorState";
import { fetchProductById } from "../../../services/productService";
import {
  ArrowLeft,
  Star,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
  PackageCheck,
  User,
  AlertCircle,
  PackageX,
} from "lucide-react";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function loadProduct() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchProductById(id);
        setProduct(data);
        const mainImg = data.images?.[0] || data.thumbnail || "";
        setSelectedImage(mainImg);
        setIsLoading(false);
      } catch (err) {
        console.error("Error loading product details:", err);
        setError("Product not found or invalid product ID.");
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products Dashboard</span>
          </Link>
        </div>

        {/* Content States */}
        {isLoading ? (
          <LoadingSpinner />
        ) : error || !product ? (
          /* 404 / Not Found State */
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center max-w-md mx-auto my-12 shadow-xl space-y-4">
            <div className="w-16 h-16 bg-red-950/60 border border-red-800/60 text-red-400 rounded-full flex items-center justify-center mx-auto">
              <PackageX className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">Product Not Found</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                The product with ID <code className="bg-slate-950 px-1.5 py-0.5 rounded text-indigo-300">"{id}"</code> could not be found or has been deleted.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md transition-all cursor-pointer"
            >
              <span>Return to Dashboard</span>
            </Link>
          </div>
        ) : (
          /* Product Detail View */
          <div className="space-y-8">
            {/* Top Grid: Gallery + Essential Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="w-full h-80 sm:h-96 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden p-4 flex items-center justify-center relative">
                  <img
                    src={selectedImage}
                    alt={product.title}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400?text=No+Image";
                    }}
                  />
                  {product.discountPercentage && (
                    <span className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                      -{Math.round(product.discountPercentage)}% OFF
                    </span>
                  )}
                </div>

                {/* Thumbnails list */}
                {product.images && product.images.length > 1 && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(img)}
                        className={`w-16 h-16 rounded-lg border-2 overflow-hidden bg-slate-950 p-1 transition-all flex-shrink-0 cursor-pointer ${
                          selectedImage === img
                            ? "border-indigo-500 scale-105"
                            : "border-slate-800 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  {/* Category & Brand */}
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 capitalize">
                      <Tag className="w-3.5 h-3.5" />
                      {product.category?.replace(/-/g, " ")}
                    </span>
                    {product.brand && (
                      <span className="text-xs text-slate-400 font-medium">
                        Brand: <strong className="text-slate-200">{product.brand}</strong>
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 leading-tight">
                    {product.title}
                  </h1>

                  {/* Rating & Stock */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 bg-amber-950/40 border border-amber-800/40 px-2.5 py-1 rounded-md text-amber-300 font-semibold">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{Number(product.rating || 0).toFixed(1)}</span>
                      <span className="text-xs text-slate-400 ml-1">
                        ({product.reviews?.length || 0} reviews)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      <PackageCheck className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">
                        {product.stock} units available
                      </span>
                    </div>
                  </div>

                  {/* Price Block */}
                  <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl flex items-baseline gap-3">
                    <span className="text-3xl font-black text-emerald-400">
                      ${Number(product.price).toFixed(2)}
                    </span>
                    {product.discountPercentage && (
                      <span className="text-sm text-slate-500 line-through">
                        $
                        {(
                          product.price /
                          (1 - product.discountPercentage / 100)
                        ).toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Description
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Shipping & Return Policy Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-xs">
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800/60 text-slate-300">
                    <Truck className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <span>{product.shippingInformation || "Fast Shipping"}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800/60 text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <span>{product.warrantyInformation || "1 Year Warranty"}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800/60 text-slate-300">
                    <RotateCcw className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <span>{product.returnPolicy || "30-Day Returns"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Reviews Section */}
            {product.reviews && product.reviews.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-md space-y-4">
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span>Customer Reviews ({product.reviews.length})</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {product.reviews.map((review, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-indigo-900/60 text-indigo-300 flex items-center justify-center font-semibold text-xs border border-indigo-700/50">
                            <User className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-semibold text-slate-200">
                            {review.reviewerName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span className="font-bold">{review.rating}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 italic">
                        "{review.comment}"
                      </p>

                      <div className="text-[10px] text-slate-500 pt-1">
                        {new Date(review.date).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
