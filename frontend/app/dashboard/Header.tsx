"use client";

import React from "react";
import { Bell, Menu } from "lucide-react";

interface HeaderProps {
  onMenuOpen: () => void;
}

export default function Header({ onMenuOpen }: HeaderProps) {
  return (
    <header className="h-14 bg-white border-b border-[#E2E8F0]/70 px-4 sm:px-6 flex items-center justify-between select-none fixed top-0 right-0 left-0 lg:left-[220px] z-40">
      {/* Left — hamburger on mobile, search on desktop */}
      <div className="flex items-center gap-3">
        {/* Hamburger — only on mobile */}
        <button
          onClick={onMenuOpen}
          className="lg:hidden p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-all cursor-pointer"
          aria-label="Open navigation"
        >
          <Menu className="w-4.5 h-4.5" />
        </button>

        {/* Search bar — hidden on very small screens */}
        <div className="relative hidden sm:block w-64">
          <svg className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search leads, projects..."
            className="w-full pl-9 pr-10 py-1.5 bg-slate-50/50 rounded-lg text-[12px] border border-slate-200/60 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 placeholder-slate-400"
          />
          <div className="absolute right-2 top-2 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-400 font-mono shadow-xs">
            ⌘K
          </div>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        <button className="p-1.5 text-slate-450 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-all relative cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 border border-white" />
        </button>

        <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />

        <div className="hidden sm:flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Gateway Live</span>
        </div>
      </div>
    </header>
  );
}
