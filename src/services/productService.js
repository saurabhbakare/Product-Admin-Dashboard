import api from "./axios";

/**
 * Product API Service Module
 * Encapsulates all network requests related to products.
 * Includes support for AbortController signals to handle race conditions during rapid typing/search.
 */

/**
 * Fetch products with pagination and optional sorting.
 * @param {Object} params - { limit, skip, sortBy, order, signal }
 */
export async function fetchProducts({ limit = 10, skip = 0, sortBy = "", order = "asc", signal } = {}) {
  const params = { limit, skip };
  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order;
  }

  const response = await api.get("/products", { params, signal });
  return response.data; // { products: [], total: number, skip: number, limit: number }
}

/**
 * Search products with query string, pagination, and optional sorting.
 * API Endpoint: /products/search?q={query}&limit={limit}&skip={skip}
 * @param {Object} params - { q, limit, skip, sortBy, order, signal }
 */
export async function searchProducts({ q = "", limit = 10, skip = 0, sortBy = "", order = "asc", signal } = {}) {
  const params = { q, limit, skip };
  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order;
  }

  const response = await api.get("/products/search", { params, signal });
  return response.data;
}

/**
 * Fetch products by category with pagination and optional sorting.
 * API Endpoint: /products/category/{category}?limit={limit}&skip={skip}
 * @param {Object} params - { category, limit, skip, sortBy, order, signal }
 */
export async function fetchProductsByCategory({ category, limit = 10, skip = 0, sortBy = "", order = "asc", signal }) {
  const params = { limit, skip };
  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order;
  }

  const response = await api.get(`/products/category/${encodeURIComponent(category)}`, { params, signal });
  return response.data;
}

/**
 * Fetch all available product categories.
 * API Endpoint: /products/categories or /products/category-list
 */
export async function fetchCategories() {
  try {
    const response = await api.get("/products/category-list");
    return response.data; // Array of strings e.g. ["beauty", "fragrances", "furniture", ...]
  } catch (err) {
    // Fallback if category-list endpoint returns objects in older API versions
    const response = await api.get("/products/categories");
    if (Array.isArray(response.data) && typeof response.data[0] === "object") {
      return response.data.map((c) => c.slug || c.name || c);
    }
    return response.data;
  }
}

/**
 * Fetch detailed product info by ID.
 * API Endpoint: /products/{id}
 */
export async function fetchProductById(id) {
  const response = await api.get(`/products/${id}`);
  return response.data;
}

/**
 * Add a new product (Mock POST request to /products/add)
 * Note: DummyJSON simulates product creation and returns the created object with a new ID.
 */
export async function addProduct(productData) {
  const response = await api.post("/products/add", productData);
  return response.data;
}

/**
 * Update an existing product (Mock PUT request to /products/{id})
 * Note: DummyJSON simulates update and returns modified product data.
 */
export async function updateProduct(id, productData) {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
}

/**
 * Delete a product by ID (Mock DELETE request to /products/{id})
 * Note: DummyJSON simulates deletion and returns isDeleted: true object.
 */
export async function deleteProduct(id) {
  const response = await api.delete(`/products/${id}`);
  return response.data;
}
