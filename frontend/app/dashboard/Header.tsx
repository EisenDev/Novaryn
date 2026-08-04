"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search, ChevronDown, ChevronRight, Settings, LogOut, FileText, LayoutDashboard, Users, Calendar, Calculator, Briefcase, Layers, DollarSign, Receipt, Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface HeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
    profile_picture?: string | null;
  } | null;
  onLogout: () => void;
  onOpenSidebar: () => void;
}

interface SearchItem {
  title: string;
  desc: string;
  href: string;
  icon: React.ComponentType<any>;
}

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  developer: "Developer",
  sales: "Sales",
  marketing: "Marketing",
};

const SEARCH_PAGES: SearchItem[] = [
  { title: "Overview Dashboard", desc: "View real-time revenues, CSS graphs, and client MRR contributions.", href: "/dashboard", icon: LayoutDashboard },
  { title: "Leads Manager CRM", desc: "Track customer sales funnel, deals progress, and send proposals.", href: "/dashboard/leads", icon: Users },
  { title: "Consultations Scheduler", desc: "Manage client meeting lists, temporary schedulers, and online dates.", href: "/dashboard/consultations", icon: Calendar },
  { title: "Contract Builder", desc: "Compose pricing estimations, quotation systems, and proposals.", href: "/dashboard/proposals", icon: FileText },
  { title: "Pricing Engine Calculator", desc: "Compute system parameters, module fees, and support retainers.", href: "/dashboard/pricing-engine", icon: Calculator },
  { title: "Active Projects", desc: "Explore milestones stages, dev lead progress, and repo source links.", href: "/dashboard/projects", icon: Briefcase },
  { title: "Project Costing", desc: "Configure database VPS expenses, monthly server nodes, and SLA margins.", href: "/dashboard/modules", icon: Layers },
  { title: "Gross Income Analytics", desc: "Track MRR run rates, cash income inflows, and expense charts.", href: "/dashboard/financials", icon: DollarSign },
  { title: "Billing Ledger Receipts", desc: "Settle invoice records, unpaid transactions list, and PDF logs.", href: "/dashboard/billing", icon: Receipt },
  { title: "Account Settings", desc: "Change password credentials, administrator nickname, and profile photo.", href: "/dashboard/settings", icon: Settings }
];

export default function Header({ user, onLogout, onOpenSidebar }: HeaderProps) {
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cmd+K hotkey hook
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus search input on open
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery("");
    }
  }, [searchOpen]);

  // Filter search matches
  const filteredSearch = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return SEARCH_PAGES;
    return SEARCH_PAGES.filter(
      (p) => p.title.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleNavigate = (href: string) => {
    router.push(href);
    setSearchOpen(false);
  };

  return (
    <>
      <header className="h-14 bg-white/95 backdrop-blur-sm border-b border-slate-200/60 px-4 md:px-6 flex items-center justify-between select-none fixed top-0 right-0 left-0 md:left-[220px] z-40">
        
        {/* Left: Hamburger + Search */}
        <div className="flex items-center gap-2 flex-1">
          {/* Hamburger — mobile only */}
          <button 
            onClick={onOpenSidebar}
            className="p-1.5 -ml-1.5 rounded-lg text-slate-500 hover:bg-slate-100 md:hidden cursor-pointer shrink-0 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-4.5 h-4.5" />
          </button>

          {/* Search Trigger — full bar on desktop, icon-only pill on mobile */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden sm:flex items-center gap-2.5 h-8 pl-3 pr-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/70 hover:border-slate-300 rounded-lg text-slate-400 hover:text-slate-500 transition-all cursor-pointer w-64 group"
            aria-label="Open search"
          >
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[12px] font-medium flex-1 text-left text-slate-400">Search pages...</span>
            <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-400 font-mono shadow-sm shrink-0">⌘K</kbd>
          </button>

          {/* Mobile-only search icon button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="sm:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Right: Profile button */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 px-1.5 py-1.5 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          >
            {/* Name + Role — desktop only */}
            <div className="hidden sm:block text-right leading-tight select-none">
              <div className="text-[11px] font-bold text-slate-800">{user?.name || "Super Admin"}</div>
              <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{(user?.role && ROLE_LABELS[user.role]) || "Admin"}</div>
            </div>
            
            {/* Avatar */}
            <div className="relative w-7 h-7 rounded-full overflow-hidden border-2 border-emerald-100 shrink-0">
              <div className="absolute inset-0 bg-emerald-50 flex items-center justify-center font-bold text-emerald-700 text-[11px] select-none">
                {user?.name?.charAt(0)?.toUpperCase() || "S"}
              </div>
              {user?.profile_picture && (
                <img 
                  src={user.profile_picture} 
                  alt="" 
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
            </div>
            
            {/* Chevron — desktop only */}
            <ChevronDown className={`hidden sm:block w-3 h-3 text-slate-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-200/60 py-1.5 z-50 text-left animate-fade-in">
              <div className="px-3.5 py-2 border-b border-slate-100 mb-1">
                <p className="text-[11px] font-bold text-slate-800 truncate">{user?.name || "Super Admin"}</p>
                <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wide mt-0.5">{(user?.role && ROLE_LABELS[user.role]) || "Admin"}</p>
              </div>
              <Link 
                href="/dashboard/settings"
                onClick={() => setProfileOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2 hover:bg-slate-50 text-[11px] font-semibold text-slate-600 transition-colors rounded-lg mx-1"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>Settings</span>
              </Link>
              <button 
                onClick={() => {
                  setProfileOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-red-50 hover:text-red-600 text-[11px] font-semibold text-slate-600 transition-colors cursor-pointer rounded-lg mx-1 mt-0.5"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-400" />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>

      </header>

      {/* ── SPOTLIGHT SEARCH MODAL ── */}
      {searchOpen && (
        <div 
          className="fixed inset-0 z-[55] flex items-start justify-center px-4 pt-16 sm:pt-24 bg-slate-900/30 backdrop-blur-[2px]"
          onClick={() => setSearchOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-lg rounded-2xl border border-slate-200/80 shadow-2xl shadow-slate-300/40 overflow-hidden flex flex-col text-left animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pages, sections..."
                className="w-full text-[13px] font-medium text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-[9px] font-bold text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded font-mono hover:bg-slate-50 cursor-pointer shrink-0"
              >
                ESC
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[340px] overflow-y-auto py-1.5 no-scrollbar">
              {filteredSearch.length > 0 ? (
                <>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-4 pt-2 pb-1.5">Pages</p>
                  {filteredSearch.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={item.href}
                        onClick={() => handleNavigate(item.href)}
                        className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 transition-colors cursor-pointer text-left group"
                      >
                        <ItemIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] font-semibold text-slate-700 group-hover:text-slate-900 transition-colors truncate">{item.title}</p>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">{item.desc}</p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-400 shrink-0 transition-colors" />
                      </button>
                    );
                  })}
                </>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-[12px] font-semibold text-slate-400">No results for "{searchQuery}"</p>
                  <p className="text-[10px] text-slate-300 mt-1">Try a different keyword</p>
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div className="border-t border-slate-100 px-4 py-2 flex items-center gap-3">
              <span className="text-[9px] text-slate-400 font-medium">Navigate with</span>
              <kbd className="text-[9px] font-bold text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded font-mono">↑↓</kbd>
              <kbd className="text-[9px] font-bold text-slate-400 border border-slate-200 px-1 py-0.5 rounded font-mono">↵</kbd>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

