"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Calendar, FileText, Briefcase,
  Layers, UserPlus, Sliders, Settings, Database,
  LogOut, DollarSign, Receipt, Calculator, X
} from "lucide-react";

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  } | null;
  onLogout: () => void;
  onClose?: () => void;
}

interface SidebarGroup {
  label: string;
  items: {
    href: string;
    label: string;
    icon: React.ComponentType<any>;
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
      { href: "/dashboard/leads", label: "Leads Manager", icon: Users },
      { href: "/dashboard/scheduler", label: "Consultations", icon: Calendar },
      { href: "/dashboard/proposals", label: "Proposal Builder", icon: FileText },
      { href: "/dashboard/pricing-engine", label: "Pricing Engine", icon: Calculator },
    ]
  },
  {
    label: "Project Delivery",
    items: [
      { href: "/dashboard/projects", label: "Active Projects", icon: Briefcase },
      { href: "/dashboard/modules", label: "Module Config", icon: Layers },
    ]
  },
  {
    label: "Talent & Hiring",
    items: [
      { href: "/dashboard/hiring", label: "Hiring Pipeline", icon: UserPlus },
      { href: "/dashboard/jobs", label: "Job Openings", icon: Sliders },
    ]
  },
  {
    label: "Financial Operations",
    items: [
      { href: "/dashboard/financials", label: "Gross Income", icon: DollarSign },
      { href: "/dashboard/billing", label: "Billing Ledger", icon: Receipt },
    ]
  },
  {
    label: "System Controls",
    items: [
      { href: "/dashboard/logs", label: "System Audit Logs", icon: Database },
      { href: "/dashboard/settings", label: "Website Settings", icon: Settings },
    ]
  }
];

export default function Sidebar({ user, onLogout, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] bg-white border-r border-[#E2E8F0]/70 flex flex-col justify-between select-none h-screen">
      <div className="flex flex-col overflow-y-auto max-h-[calc(100vh-80px)]">

        {/* Brand Header */}
        <div className="h-14 border-b border-[#E2E8F0]/70 flex items-center px-4 gap-2.5 flex-shrink-0 sticky top-0 bg-white z-10">
          <img
            src="/novaryn-logo.png"
            alt="Novaryn Logo"
            className="w-5 h-5 object-contain"
          />
          <span className="font-sans font-bold text-[14px] text-slate-900 tracking-tight flex-1">
            Novaryn
          </span>
          {/* Close button — only visible on mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              aria-label="Close navigation"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Menu Navigation Groups */}
        <nav className="flex flex-col gap-4 p-2 text-left" aria-label="Main navigation">
          {sidebarGroups.map((group) => (
            <div key={group.label} className="flex flex-col gap-0.5">
              <span className="px-3 text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                {group.label}
              </span>

              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-2.5 px-3 h-8 rounded-lg text-[12px] font-medium transition-all ${
                      isActive
                        ? "bg-emerald-500/5 text-emerald-700 font-semibold"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={isActive ? 2.2 : 1.6} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-2 p-3 border-t border-slate-100 bg-white">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center font-bold text-emerald-700 text-xs shrink-0">
              {user?.name?.charAt(0) || "S"}
            </div>
            <div className="overflow-hidden text-left leading-tight">
              <div className="text-[11px] font-semibold text-slate-800 truncate">{user?.name || "Super Admin"}</div>
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 truncate">{user?.role || "Owner"}</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
