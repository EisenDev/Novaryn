"use client";

import React from "react";
import { TrendingUp, DollarSign, Activity, ShoppingBag } from "lucide-react";

interface SalesBreakdown {
  category: string;
  amount: number;
  count: number;
  color: string;
}

const financialBreakdown: SalesBreakdown[] = [
  { category: "One-Time Custom Setup Fees", amount: 625000, count: 4, color: "bg-emerald-500" },
  { category: "Monthly SaaS Subscriptions", amount: 165000, count: 11, color: "bg-blue-500" },
  { category: "Module Upsell Add-ons", amount: 135000, count: 2, color: "bg-purple-500" },
];

export default function FinancialsPage() {
  const totalRevenue = financialBreakdown.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="flex flex-col gap-6 text-left">
      <div>
        <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none">Gross Revenue</h1>
        <p className="text-[13px] text-slate-500 mt-1.5 font-medium">Track client setup invoicing metrics, monthly SaaS MRR licensing, and dynamic upsell distributions.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E2E8F0]/70 p-5 rounded-xl flex flex-col gap-1.5 shadow-xs">
          <span className="text-[12px] font-medium text-slate-400 tracking-tight">Total YTD Revenue</span>
          <div className="text-2xl font-bold text-slate-900 mt-0.5 tracking-tight">₱{totalRevenue.toLocaleString()}</div>
          <div className="flex items-center gap-1 text-[11px] text-[#10B981] font-semibold mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12.4% vs last Q</span>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0]/70 p-5 rounded-xl flex flex-col gap-1.5 shadow-xs">
          <span className="text-[12px] font-medium text-slate-400 tracking-tight">Current MRR License Fees</span>
          <div className="text-2xl font-bold text-slate-900 mt-0.5 tracking-tight">₱165,000</div>
          <div className="flex items-center gap-1 text-[11px] text-[#10B981] font-semibold mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>11 active subscribers</span>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0]/70 p-5 rounded-xl flex flex-col gap-1.5 shadow-xs">
          <span className="text-[12px] font-medium text-slate-400 tracking-tight">Add-on Sales Share</span>
          <div className="text-2xl font-bold text-slate-900 mt-0.5 tracking-tight">₱135,000</div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold mt-1">
            <span>2 modules deployed</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Breakdown */}
        <div className="lg:col-span-2 bg-white border border-[#E2E8F0]/70 p-6 rounded-2xl shadow-xs flex flex-col gap-5">
          <h3 className="text-[13px] font-semibold text-slate-800 tracking-tight">Revenue Stream Share</h3>
          
          <div className="flex flex-col gap-4">
            {financialBreakdown.map((item) => {
              const sharePercent = ((item.amount / totalRevenue) * 100).toFixed(1);
              return (
                <div key={item.category} className="flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-650">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                      <span>{item.category}</span>
                    </div>
                    <div className="text-slate-800 font-bold">
                      ₱{item.amount.toLocaleString()} <span className="text-slate-400 font-medium">({sharePercent}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${sharePercent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic add-on share */}
        <div className="bg-white border border-[#E2E8F0]/70 p-6 rounded-2xl shadow-xs flex flex-col gap-4">
          <h3 className="text-[13px] font-semibold text-slate-800 tracking-tight">MRR Expansion Metrics</h3>
          
          <div className="flex flex-col gap-3.5 text-xs text-slate-500 font-semibold mt-1">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span>Starter Seats (₱10k/mo)</span>
              <span className="text-slate-800">4 clients</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span>Pro Seats (₱15k/mo)</span>
              <span className="text-slate-800">5 clients</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span>Enterprise Seats (₱25k+/mo)</span>
              <span className="text-slate-800">2 clients</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
