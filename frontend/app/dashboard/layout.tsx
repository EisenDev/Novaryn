"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    const syncUser = () => {
      const savedToken = localStorage.getItem("novaryn_admin_token");
      const savedUser = localStorage.getItem("novaryn_admin_user");
      
      if (!savedToken || !savedUser) {
        router.push("/login");
      } else {
        setToken(savedToken);
        setAdminUser(JSON.parse(savedUser));
        setLoading(false);
      }
    };

    const freshFetchUser = async () => {
      const savedToken = localStorage.getItem("novaryn_admin_token");
      if (!savedToken) return;
      try {
        const res = await fetch(`${apiUrl}/auth/me`, {
          headers: { "Authorization": `Bearer ${savedToken}`, "Accept": "application/json" }
        });
        const json = await res.json();
        if (res.ok && json.user) {
          localStorage.setItem("novaryn_admin_user", JSON.stringify(json.user));
          setAdminUser(json.user);
        }
      } catch {}
    };

    syncUser();
    freshFetchUser();

    // Listen to storage changes and internal profile updates
    window.addEventListener("storage", syncUser);
    window.addEventListener("profileUpdate", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("profileUpdate", syncUser);
    };
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("novaryn_admin_token");
    localStorage.removeItem("novaryn_admin_user");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-4 border-emerald-500/20 border-t-emerald-600 animate-spin" />
          <span className="text-xs font-bold text-slate-400">Loading system session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-slate-800 antialiased font-sans">
      {/* Shared Sidebar */}
      <Sidebar user={adminUser} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pl-0 md:pl-[220px] transition-all">
        {/* Shared Header */}
        <Header user={adminUser} onLogout={handleLogout} onOpenSidebar={() => setIsSidebarOpen(true)} />

        {/* Dynamic Route Content */}
        <main className="flex-1 px-4 pb-4 pt-18 md:px-8 md:pb-8 md:pt-20 overflow-y-auto w-full animate-fade-up">
          {children}
        </main>
      </div>
    </div>
  );
}
