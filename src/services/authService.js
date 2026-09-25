import api from "./axios";

/**
 * Authentication Service Module
 * Handles login API requests and local storage auth session helpers.
 */

/**
 * Log in user using DummyJSON /auth/login endpoint.
 * Accepts username & password, returns user object containing accessToken/token.
 * Default credentials for testing: username: "emilys", password: "emilyspass"
 */
export async function loginUser(username, password) {
  try {
    const response = await api.post("/auth/login", {
      username,
      password,
      expiresInMins: 60 * 24, // Optional session expiry duration (24h)
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      "Invalid username or password. Please check your credentials.";
    throw new Error(errorMessage);
  }
}

/**
 * Fetch current logged-in user profile from /auth/me
 */
export async function getCurrentUser() {
  try {
    const response = await api.get("/auth/me");
    return response.data;
  } catch (error) {
    throw new Error("Session expired or invalid user token");
  }
}

/**
 * Store auth session in localStorage
 */
export function setAuthSession(user, token) {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  }
}

/**
 * Get stored auth session from localStorage
 */
export function getAuthSession() {
  if (typeof window === "undefined") return { user: null, token: null };
  try {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    return { user, token };
  } catch (err) {
    return { user: null, token: null };
  }
}

/**
 * Clear stored auth session
 */
export function clearAuthSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}
