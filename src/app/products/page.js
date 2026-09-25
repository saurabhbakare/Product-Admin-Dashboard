"use client";

import React, { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Navbar from "../../components/Navbar";
import SearchFilterBar from "../../components/SearchFilterBar";
import ProductTable from "../../components/ProductTable";
import ProductCards from "../../components/ProductCards";
import Pagination from "../../components/Pagination";
import ProductModal from "../../components/ProductModal";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorState from "../../components/ErrorState";

import { useDebounce } from "../../hooks/useDebounce";
import { parseQueryParams, buildQueryString } from "../../utils/urlParams";
import {
  fetchProducts,
  searchProducts,
  fetchProductsByCategory,
  fetchCategories,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productService";
import { PackageX, Plus, RefreshCw } from "lucide-react";

/**
 * Main Product Dashboard Content
 * Handles state management, URL sync, API fetching, debounced search, category filtering, sorting, pagination, and local CRUD state overlays.
 */
function ProductsDashboardContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Parse URL query params with sanitization fallbacks
  const {
    page: urlPage,
    limit: urlLimit,
    search: urlSearch,
    category: urlCategory,
    sortBy: urlSortBy,
    order: urlOrder,
  } = parseQueryParams(searchParams);

  // Search input state (immediate for input UI)
  const [searchInput, setSearchInput] = useState(urlSearch);
  const debouncedSearch = useDebounce(searchInput, 400);

  // Local state for categories, products, loading, error, total items count
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Local state overlay for mock CRUD operations (Add, Edit, Delete)
  // DummyJSON API returns simulated results but does not modify backend persistence.
  const [localAddedProducts, setLocalAddedProducts] = useState([]);
  const [localUpdatedProducts, setLocalUpdatedProducts] = useState({});
  const [localDeletedProductIds, setLocalDeletedProductIds] = useState(new Set());

  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalSubmitting, setIsModalSubmitting] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Ref for active AbortController to cancel superseded network requests
  const activeAbortControllerRef = useRef(null);

  // Sync debounced search back to input state if URL changes externally
  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  // Load Categories on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const catList = await fetchCategories();
        setCategories(catList || []);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }
    loadCategories();
  }, []);

  // Update URL helper function
  const updateUrlParams = useCallback(
    (newParams) => {
      const mergedParams = {
        page: urlPage,
        limit: urlLimit,
        search: debouncedSearch,
        category: urlCategory,
        sortBy: urlSortBy,
        order: urlOrder,
        ...newParams,
      };

      const queryString = buildQueryString(mergedParams);
      router.replace(`${pathname}${queryString}`, { scroll: false });
    },
    [router, pathname, urlPage, urlLimit, debouncedSearch, urlCategory, urlSortBy, urlOrder]
  );

  // Reset to page 1 when debounced search or category filter changes
  useEffect(() => {
    if (debouncedSearch !== urlSearch) {
      updateUrlParams({ search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch, urlSearch, updateUrlParams]);

  // Primary Data Fetching Function with AbortController for race condition resolution
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Cancel any in-flight request to avoid race conditions (fast typing or network delays)
    if (activeAbortControllerRef.current) {
      activeAbortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    activeAbortControllerRef.current = abortController;

    const skip = (urlPage - 1) * urlLimit;

    try {
      let data = { products: [], total: 0 };

      // Case A: Search active
      if (urlSearch) {
        data = await searchProducts({
          q: urlSearch,
          limit: urlLimit,
          skip,
          sortBy: urlSortBy,
          order: urlOrder,
          signal: abortController.signal,
        });

        // If category is ALSO selected alongside search:
        // DummyJSON API doesn't support combined search & category params in a single endpoint.
        // We filter search results by category in memory.
        if (urlCategory && data.products) {
          data.products = data.products.filter(
            (p) => p.category?.toLowerCase() === urlCategory.toLowerCase()
          );
          data.total = data.products.length;
        }
      }
      // Case B: Category filter active (without search)
      else if (urlCategory) {
        data = await fetchProductsByCategory({
          category: urlCategory,
          limit: urlLimit,
          skip,
          sortBy: urlSortBy,
          order: urlOrder,
          signal: abortController.signal,
        });
      }
      // Case C: Standard product list
      else {
        data = await fetchProducts({
          limit: urlLimit,
          skip,
          sortBy: urlSortBy,
          order: urlOrder,
          signal: abortController.signal,
        });
      }

      // Apply Local Modifications Overlay (Add, Edit, Delete)
      let fetchedProducts = data.products || [];

      // 1. Substitute local updates
      fetchedProducts = fetchedProducts.map((p) => {
        if (localUpdatedProducts[p.id]) {
          return { ...p, ...localUpdatedProducts[p.id] };
        }
        return p;
      });

      // 2. Filter out locally deleted products
      fetchedProducts = fetchedProducts.filter((p) => !localDeletedProductIds.has(p.id));

      // 3. Prepend newly added products on Page 1 if no search/filter active or if matching
      if (urlPage === 1 && localAddedProducts.length > 0) {
        let matchingAdded = localAddedProducts.filter((p) => !localDeletedProductIds.has(p.id));
        if (urlCategory) {
          matchingAdded = matchingAdded.filter(
            (p) => p.category?.toLowerCase() === urlCategory.toLowerCase()
          );
        }
        if (urlSearch) {
          matchingAdded = matchingAdded.filter((p) =>
            p.title?.toLowerCase().includes(urlSearch.toLowerCase())
          );
        }
        fetchedProducts = [...matchingAdded, ...fetchedProducts];
      }

      setProducts(fetchedProducts);
      setTotalItems((data.total || 0) + (urlPage === 1 ? localAddedProducts.length : 0));
      setIsLoading(false);
    } catch (err) {
      if (err.name === "CanceledError" || err.message === "canceled" || err.name === "AbortError") {
        // Request was cancelled due to a newer request; ignore error safely
        return;
      }
      console.error("Product fetching error:", err);
      setError(err.message || "Failed to load products from server.");
      setIsLoading(false);
    }
  }, [
    urlPage,
    urlLimit,
    urlSearch,
    urlCategory,
    urlSortBy,
    urlOrder,
    localAddedProducts,
    localUpdatedProducts,
    localDeletedProductIds,
  ]);

  // Re-fetch products when URL parameters change
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Handlers for Filters & Sorting
  const handleCategoryChange = (newCategory) => {
    updateUrlParams({ category: newCategory, page: 1 });
  };

  const handleSortByChange = (newSortBy) => {
    updateUrlParams({ sortBy: newSortBy, order: "asc", page: 1 });
  };

  const handleSortFromTable = (field) => {
    if (urlSortBy === field) {
      const nextOrder = urlOrder === "asc" ? "desc" : "asc";
      updateUrlParams({ order: nextOrder });
    } else {
      updateUrlParams({ sortBy: field, order: "asc", page: 1 });
    }
  };

  const handleOrderToggle = () => {
    const nextOrder = urlOrder === "asc" ? "desc" : "asc";
    updateUrlParams({ order: nextOrder });
  };

  const handleResetFilters = () => {
    setSearchInput("");
    router.replace(pathname, { scroll: false });
  };

  const handlePageChange = (newPage) => {
    updateUrlParams({ page: newPage });
  };

  const handleLimitChange = (newLimit) => {
    updateUrlParams({ limit: newLimit, page: 1 });
  };

  // Add & Edit Handlers
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (formData) => {
    setIsModalSubmitting(true);
    try {
      if (editingProduct) {
        // Mock PUT request to /products/{id}
        await updateProduct(editingProduct.id, formData);
        setLocalUpdatedProducts((prev) => ({
          ...prev,
          [editingProduct.id]: { ...editingProduct, ...formData },
        }));
      } else {
        // Mock POST request to /products/add
        const newProduct = await addProduct(formData);
        // Ensure newProduct has a unique local ID if API returns duplicate
        const createdProduct = {
          ...formData,
          id: newProduct.id || Date.now(),
        };
        setLocalAddedProducts((prev) => [createdProduct, ...prev]);
      }
      setIsProductModalOpen(false);
      loadProducts();
    } catch (err) {
      alert("Error saving product: " + (err.message || "Something went wrong"));
    } finally {
      setIsModalSubmitting(false);
    }
  };

  // Delete Handlers
  const handleOpenDeleteModal = (product) => {
    setDeletingProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      // Mock DELETE request to /products/{id}
      await deleteProduct(deletingProduct.id);
      setLocalDeletedProductIds((prev) => new Set(prev).add(deletingProduct.id));
      setIsDeleteModalOpen(false);
      setDeletingProduct(null);
      loadProducts();
    } catch (err) {
      alert("Error deleting product: " + (err.message || "Failed to delete"));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Control Bar */}
        <SearchFilterBar
          search={searchInput}
          onSearchChange={setSearchInput}
          category={urlCategory}
          onCategoryChange={handleCategoryChange}
          categories={categories}
          sortBy={urlSortBy}
          onSortByChange={handleSortByChange}
          order={urlOrder}
          onOrderToggle={handleOrderToggle}
          onResetFilters={handleResetFilters}
          onOpenAddModal={handleOpenAddModal}
        />

        {/* Dynamic Content Area */}
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorState message={error} onRetry={loadProducts} />
        ) : products.length === 0 ? (
          /* Empty State */
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center my-6 shadow-md max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto border border-slate-700">
              <PackageX className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">No Products Found</h3>
              <p className="text-sm text-slate-400 mt-1">
                {urlSearch || urlCategory
                  ? "No matching products found for your selected search query or category filter."
                  : "Your product inventory is currently empty."}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              {(urlSearch || urlCategory) && (
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
              <button
                onClick={handleOpenAddModal}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>
          </div>
        ) : (
          /* Product List (Desktop Table + Mobile Cards) */
          <>
            <ProductTable
              products={products}
              sortBy={urlSortBy}
              order={urlOrder}
              onSort={handleSortFromTable}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
            />

            <ProductCards
              products={products}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
            />

            {/* Pagination Controls */}
            <Pagination
              currentPage={urlPage}
              totalItems={totalItems}
              limit={urlLimit}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          </>
        )}
      </main>

      {/* Add / Edit Product Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSubmit={handleSaveProduct}
        initialData={editingProduct}
        categories={categories}
        isSubmitting={isModalSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        productTitle={deletingProduct?.title || ""}
        isDeleting={isDeleting}
      />
    </div>
  );
}

/**
 * Root Dashboard Page Wrapper with React Suspense Boundary.
 * Suspense is required when invoking useSearchParams in Next.js App Router client components.
 */
export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    }>
      <ProductsDashboardContent />
    </Suspense>
  );
}
