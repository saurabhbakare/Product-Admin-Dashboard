"use client";

import React from "react";
import { useAuth } from "../context/AuthContext";
import { LogOut, Package, User } from "lucide-react";

/**
 * Top Navbar Component
 * Displays application branding, user profile info, and logout action button.
 */
export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo / Title */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-indigo-500 to-violet-600 p-2 rounded-xl text-white shadow-sm">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wide bg-gradient-to-r from-indigo-200 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-xs text-slate-400">Product Management Console</p>
          </div>
        </div>

        {/* User Info & Logout Button */}
        {user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/60">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.username}
                  className="w-7 h-7 rounded-full object-cover border border-indigo-400"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-semibold">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="text-xs sm:text-sm font-medium text-slate-200">
                @{user.username}
              </span>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 text-xs sm:text-sm px-3.5 py-1.5 rounded-lg bg-red-600/10 text-red-400 hover:bg-red-600 hover:text-white transition-all duration-150 border border-red-500/20 font-medium"
              title="Logout from Dashboard"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
