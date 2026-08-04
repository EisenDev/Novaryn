"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";

const INACTIVITY_LIMIT_MS = 48 * 60 * 60 * 1000; // 48 hours in ms
const LAST_ACTIVE_KEY = "novaryn_last_active";

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

  const doLogout = useCallback(() => {
    localStorage.removeItem("novaryn_admin_token");
    localStorage.removeItem("novaryn_admin_user");
    localStorage.removeItem(LAST_ACTIVE_KEY);
    router.push("/login");
  }, [router]);

  // Record activity timestamp on any user interaction
  const recordActivity = useCallback(() => {
    localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
  }, []);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    const syncUser = () => {
      const savedToken = localStorage.getItem("novaryn_admin_token");
      const savedUser = localStorage.getItem("novaryn_admin_user");

      if (!savedToken || !savedUser) {
        router.push("/login");
        return;
      }

      // Inactivity check: if last active was > 48h ago, force logout
      const lastActive = localStorage.getItem(LAST_ACTIVE_KEY);
      if (lastActive) {
        const elapsed = Date.now() - parseInt(lastActive, 10);
        if (elapsed > INACTIVITY_LIMIT_MS) {
          doLogout();
          return;
        }
      }

      setToken(savedToken);
      setAdminUser(JSON.parse(savedUser));
      setLoading(false);
      recordActivity(); // record activity on page load / tab focus
    };

    const freshFetchUser = async () => {
      const savedToken = localStorage.getItem("novaryn_admin_token");
      if (!savedToken) return;
      try {
        const res = await fetch(`${apiUrl}/auth/me`, {
          headers: { "Authorization": `Bearer ${savedToken}`, "Accept": "application/json" }
        });
        if (res.status === 401) {
          // Token expired on backend — clear session
          doLogout();
          return;
        }
        const json = await res.json();
        if (res.ok && json.user) {
          localStorage.setItem("novaryn_admin_user", JSON.stringify(json.user));
          setAdminUser(json.user);
        }
      } catch {}
    };

    syncUser();
    freshFetchUser();

    // Track user activity events to reset inactivity clock
    const events = ["mousemove", "keydown", "touchstart", "click", "scroll"];
    events.forEach((e) => window.addEventListener(e, recordActivity, { passive: true }));

    window.addEventListener("storage", syncUser);
    window.addEventListener("profileUpdate", syncUser);

    return () => {
      events.forEach((e) => window.removeEventListener(e, recordActivity));
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("profileUpdate", syncUser);
    };
  }, [router, doLogout, recordActivity]);

  const handleLogout = () => {
    doLogout();
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
