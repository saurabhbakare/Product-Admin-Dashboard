"use client";

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Lock, User, Package, AlertCircle, Loader2, KeyRound, Sparkles } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFillDemo = () => {
    setUsername("emilys");
    setPassword("emilyspass");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await login(username, password);
    } catch (err) {
      setError(err.message || "Invalid username or password.");
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800/80 rounded-2xl shadow-2xl p-8 backdrop-blur space-y-6">
        {/* Branding Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20 mb-2">
            <Package className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Admin Login
          </h1>
          <p className="text-xs text-slate-400">
            Sign in to access your Product Admin Dashboard
          </p>
        </div>

        {/* Demo Credentials Quick Button Notice */}
        <div className="bg-indigo-950/40 border border-indigo-800/40 rounded-xl p-3 text-xs text-indigo-300 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <span>Demo: <strong>emilys</strong> / <strong>emilyspass</strong></span>
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-xs font-semibold underline hover:text-white transition-colors cursor-pointer"
          >
            Auto-fill
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-950/60 border border-red-800/60 text-red-400 p-3 rounded-xl text-xs flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username (e.g. emilys)"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (e.g. emilyspass)"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-600/25 disabled:opacity-50 transition-all duration-150 active:scale-[0.99] cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
