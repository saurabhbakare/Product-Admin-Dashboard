import axios from "axios";

/**
 * Shared Axios instance configured for the DummyJSON API.
 * Requirements addressed:
 * - Single shared Axios setup file.
 * - Automatically attaches JWT token to Authorization header for every request.
 * - Centralized response interceptor for handling 401 Unauthorized & API errors.
 */
const api = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 15000, // 15s timeout
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor:
 * Attaches the auth token from localStorage (if present) to outgoing API requests.
 */
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor:
 * Intercepts responses to handle common error codes globally.
 * If 401 Unauthorized occurs, clears local auth session and redirects to login page.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        // Clear invalid token & user session
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Redirect to login if not already on login page
        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;