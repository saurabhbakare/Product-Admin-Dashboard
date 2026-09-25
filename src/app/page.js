"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push("/products");
      } else {
        router.push("/login");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="flex items-center gap-3 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
        <span className="text-sm font-medium">Loading Dashboard...</span>
      </div>
    </main>
  );
}
