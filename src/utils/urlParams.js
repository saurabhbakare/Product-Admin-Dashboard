/**
 * URL Parameter Sanitization and Formatting Helpers
 * Ensures invalid parameters (e.g. ?page=abc or ?limit=-5) are safely normalized to defaults.
 */

export const ALLOWED_LIMITS = [10, 20, 50];

/**
 * Parses and sanitizes URL query parameters.
 * @param {URLSearchParams} searchParams
 * @returns {Object} { page, limit, search, category, sortBy, order }
 */
export function parseQueryParams(searchParams) {
  const rawPage = searchParams.get("page");
  const rawLimit = searchParams.get("limit");
  const rawSearch = searchParams.get("search");
  const rawCategory = searchParams.get("category");
  const rawSortBy = searchParams.get("sortBy");
  const rawOrder = searchParams.get("order");

  // Parse page: ensure integer >= 1
  let page = parseInt(rawPage, 10);
  if (isNaN(page) || page < 1) {
    page = 1;
  }

  // Parse limit: ensure one of allowed values [10, 20, 50]
  let limit = parseInt(rawLimit, 10);
  if (isNaN(limit) || !ALLOWED_LIMITS.includes(limit)) {
    limit = 10;
  }

  // Sanitize search string
  const search = rawSearch ? rawSearch.trim() : "";

  // Sanitize category string
  const category = rawCategory ? rawCategory.trim() : "";

  // Sanitize sorting parameters
  const allowedSortFields = ["price", "rating", "title"];
  const sortBy = allowedSortFields.includes(rawSortBy) ? rawSortBy : "";
  const order = rawOrder === "desc" ? "desc" : "asc";

  return {
    page,
    limit,
    search,
    category,
    sortBy,
    order,
  };
}

/**
 * Builds a search query string from state object.
 */
export function buildQueryString(params) {
  const searchParams = new URLSearchParams();

  if (params.page && params.page > 1) {
    searchParams.set("page", params.page.toString());
  }
  if (params.limit && params.limit !== 10) {
    searchParams.set("limit", params.limit.toString());
  }
  if (params.search) {
    searchParams.set("search", params.search);
  }
  if (params.category) {
    searchParams.set("category", params.category);
  }
  if (params.sortBy) {
    searchParams.set("sortBy", params.sortBy);
    if (params.order && params.order === "desc") {
      searchParams.set("order", "desc");
    }
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}
