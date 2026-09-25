"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  loginUser,
  getAuthSession,
  setAuthSession,
  clearAuthSession,
} from "../services/authService";

const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Initialize session from localStorage on mount
  useEffect(() => {
    const { user: storedUser, token: storedToken } = getAuthSession();
    if (storedUser && storedToken) {
      setUser(storedUser);
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  // Protect routes: Redirect to /login if unauthenticated user attempts to access /products
  useEffect(() => {
    if (!isLoading) {
      const isPublicRoute = pathname === "/login";
      if (!token && !isPublicRoute) {
        router.push("/login");
      } else if (token && isPublicRoute) {
        // Redirect to products if user is already logged in and hits /login
        router.push("/products");
      }
    }
  }, [token, isLoading, pathname, router]);

  const login = async (username, password) => {
    const data = await loginUser(username, password);
    const userObj = {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      image: data.image,
    };
    const userToken = data.accessToken || data.token;

    setUser(userObj);
    setToken(userToken);
    setAuthSession(userObj, userToken);
    router.push("/products");
    return userObj;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    clearAuthSession();
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
