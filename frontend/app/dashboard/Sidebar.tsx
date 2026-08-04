"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, Calendar, FileText, Briefcase, 
  Layers, UserPlus, Sliders, Settings, DollarSign, Receipt, Calculator, X
} from "lucide-react";

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
    profile_picture?: string | null;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

interface SidebarBadges {
  new_leads: number;
  pending_consultations: number;
  new_quotations: number;
}

interface SidebarGroup {
  label: string;
  items: {
    href: string;
    label: string;
    icon: React.ComponentType<any>;
    disabled?: boolean;
    badgeKey?: keyof SidebarBadges;
  }[];
}

const sidebarGroups: SidebarGroup[] = [
  {
    label: "Core Workspace",
    items: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    ]
  },
  {
    label: "Sales & CRM",
    items: [
      { href: "/dashboard/leads", label: "Leads Manager", icon: Users, badgeKey: "new_leads" },
      { href: "/dashboard/consultations", label: "Consultations", icon: Calendar, badgeKey: "pending_consultations" },
      { href: "/dashboard/proposals", label: "Contract Builder", icon: FileText },
      { href: "/dashboard/pricing-engine", label: "Pricing Engine", icon: Calculator, badgeKey: "new_quotations" },
    ]
  },
  {
    label: "Project Delivery",
    items: [
      { href: "/dashboard/projects", label: "Active Projects", icon: Briefcase },
      { href: "/dashboard/modules", label: "Project Costing", icon: Layers },
    ]
  },
  {
    label: "Talent & Hiring",
    items: [
      { href: "/dashboard/hiring", label: "Hiring Pipeline", icon: UserPlus, disabled: true },
      { href: "/dashboard/jobs", label: "Job Openings", icon: Sliders, disabled: true },
    ]
  },
  {
    label: "Financial Operations",
    items: [
      { href: "/dashboard/financials", label: "Gross Income", icon: DollarSign },
      { href: "/dashboard/billing", label: "Billing Ledger", icon: Receipt },
    ]
  }
];

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function Sidebar({ user, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [badges, setBadges] = useState<SidebarBadges>({
    new_leads: 0,
    pending_consultations: 0,
    new_quotations: 0,
  });

  const fetchBadges = useCallback(async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("novaryn_admin_token") : null;
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/v1/dashboard/badges`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (!res.ok) return;
      const json = await res.json();
      if (json?.data) {
        setBadges(json.data);
      }
    } catch {
      // Fail silently — badge counts are non-critical
    }
  }, []);

  useEffect(() => {
    fetchBadges();
    // Poll every 30 seconds for fresh badge counts
    const interval = setInterval(fetchBadges, 30_000);
    return () => clearInterval(interval);
  }, [fetchBadges]);

  return (
    <>
      {/* Backdrop overlay on mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] z-45 md:hidden transition-all duration-300"
          onClick={onClose}
        />
      )}

      <aside className={`w-[220px] bg-white border-r border-[#E2E8F0]/70 flex flex-col select-none h-screen fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        
        {/* Brand Header */}
        <div className="h-14 border-b border-[#E2E8F0]/70 flex items-center justify-between px-4.5 flex-shrink-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <img 
              src="/novaryn-logo.png" 
              alt="Novaryn Logo" 
              className="w-5.5 h-5.5 object-contain"
            />
            <span className="font-sans font-bold text-[14px] text-slate-900 tracking-tight">
              Novaryn
            </span>
          </div>
          {/* Close button on mobile */}
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 md:hidden cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Menu Navigation Groups */}
        <nav className="flex flex-col gap-4 p-2 text-left overflow-y-auto flex-1 mt-2" aria-label="Main navigation">
          {sidebarGroups.map((group) => (
            <div key={group.label} className="flex flex-col gap-0.5">
              <span className="px-3 text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {group.label}
              </span>
              
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                const badgeCount = item.badgeKey ? badges[item.badgeKey] : 0;

                if (item.disabled) {
                  return (
                    <div
                      key={item.href}
                      className="flex items-center justify-between px-3 h-8.5 rounded-lg text-[12px] font-semibold text-slate-350 cursor-not-allowed opacity-60"
                      title="This module is currently disabled"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={1.6} />
                        <span>{item.label}</span>
                      </div>
                      <span className="text-[7px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 bg-slate-50 border border-slate-100 rounded text-slate-405 select-none">
                        Hold
                      </span>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center justify-between px-3 h-8.5 rounded-lg text-[12px] font-semibold transition-all ${
                      isActive 
                        ? "bg-emerald-500/5 text-emerald-650 font-black border-l-2 border-emerald-500 rounded-l-none pl-2.5" 
                        : "text-slate-550 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={isActive ? 2.2 : 1.6} />
                      <span>{item.label}</span>
                    </div>
                    {/* Badge indicator */}
                    {badgeCount > 0 && (
                      <span className="min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold leading-none shadow-sm">
                        {badgeCount > 99 ? "99+" : badgeCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
