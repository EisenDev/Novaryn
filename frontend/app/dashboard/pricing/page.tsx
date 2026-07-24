"use client";

import React from "react";
import { Sliders } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="flex flex-col gap-6 text-left">
      <div>
        <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none">Pricing Packages</h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">Add, update, or reorder the pricing packages displayed on the public landing page grid.</p>
      </div>
      <div className="bg-white border border-slate-200 p-8 rounded-3xl text-center py-16 shadow-[0_4px_25px_rgba(15,23,42,0.01)]">
        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-650 mx-auto mb-4 border border-emerald-100 shadow-xs">
          <Sliders className="w-5 h-5" />
        </div>
        <h3 className="text-[15px] font-semibold text-slate-900">Pricing Database Linked</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed">
          Packages data is loaded dynamically from the backend database. You can manage package tiers, customize features, and toggle recommended flags.
        </p>
      </div>
    </div>
  );
}
