"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { 
  TrendingUp, DollarSign, Activity, ShoppingBag, RefreshCw, 
  ShieldAlert, ArrowUpRight, Server, Receipt, Percent, Landmark
} from "lucide-react";

interface ProjectContribution {
  id: string;
  title: string;
  client_name: string | null;
  mrr: number;
  expenses: number;
  profit: number;
}

interface LedgerEntry {
  id: string;
  invoice_number: string;
  client_name: string;
  amount: number;
  type: string;
  status: string;
  created_at: string;
}

interface FinancialStats {
  mrr: number;
  arr: number;
  total_one_time_paid: number;
  total_sla_paid: number;
  total_hosting_expenses: number;
  server_cost: number;
  db_other_cost: number;
  unpaid_volume: number;
  overdue_volume: number;
  project_contributions: ProjectContribution[];
  recent_ledger: LedgerEntry[];
}

// Module-level cache: persists across navigations without a provider
let _cachedStats: FinancialStats | null = null;

export default function FinancialsPage() {
  const [stats, setStats] = useState<FinancialStats | null>(_cachedStats);
  const [loading, setLoading] = useState(!_cachedStats);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("novaryn_admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    try {
      const res = await fetch(`${apiUrl}/invoices/stats`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });

      if (res.status === 401) {
        localStorage.removeItem("novaryn_admin_token");
        localStorage.removeItem("novaryn_admin_user");
        window.location.href = "/login";
        return;
      }

      if (!res.ok) {
        throw new Error("Unable to load financial analytics from database.");
      }

      const json = await res.json();
      _cachedStats = json.data;
      setStats(json.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load financials.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const peso = (n: number) =>
    "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 0 });  // Computations
  const totalEarnedInflow = useMemo(() => {
    if (!stats) return 0;
    return Number(stats.total_one_time_paid) + Number(stats.total_sla_paid);
  }, [stats]);

  const corporateMarginPercent = useMemo(() => {
    if (!stats || Number(stats.mrr) === 0) return 0;
    const profit = Number(stats.mrr) - Number(stats.total_hosting_expenses);
    return Math.round((profit / Number(stats.mrr)) * 100);
  }, [stats]);

  if (loading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-6 h-6 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="flex flex-col gap-6 text-left font-sans pb-12">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none">Gross Revenue & Analytics</h1>
          <p className="text-[13px] text-slate-500 mt-1.5 font-medium">Analyze MRR run rates, hosting costing margins, and cash distributions.</p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-bold text-slate-650 rounded-xl transition-all shadow-xs cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh stats</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-3.5 text-xs text-red-700 flex items-start gap-2.5 leading-relaxed">
          <ShieldAlert className="w-4.5 h-4.5 shrink-0 text-red-650 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Primary KPI Grid — Compact 2x2 on mobile, 4 columns on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Earned cash inflow */}
        <div className="bg-white border border-slate-200/80 p-4 sm:p-5 rounded-2xl shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wide">Payments Settled</span>
          <div className="text-lg sm:text-2xl font-black text-slate-950 mt-1 tracking-tight">{peso(totalEarnedInflow)}</div>
          <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-widest mt-1">Accumulated Cash</p>
        </div>

        {/* Monthly Recurring SLA */}
        <div className="bg-white border border-slate-200/80 p-4 sm:p-5 rounded-2xl shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wide">Recurring (MRR)</span>
          <div className="text-lg sm:text-2xl font-black text-emerald-650 mt-1 tracking-tight">{peso(Number(stats.mrr))}</div>
          <div className="flex items-center gap-1 text-[9px] text-[#10B981] font-bold mt-1 uppercase tracking-widest">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            <span>ARR: {peso(Number(stats.arr))}</span>
          </div>
        </div>

        {/* Total Server Costs */}
        <div className="bg-white border border-slate-200/80 p-4 sm:p-5 rounded-2xl shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wide">Hosting SLA Cost</span>
          <div className="text-lg sm:text-2xl font-black text-red-655 mt-1 tracking-tight">{peso(Number(stats.total_hosting_expenses))}</div>
          <div className="flex items-center gap-2 text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">
            <span className="flex items-center gap-0.5 truncate"><Server className="w-2.5 h-2.5 text-slate-400" /> Server: {peso(Number(stats.server_cost))}</span>
          </div>
        </div>

        {/* Net Profit margins */}
        <div className="bg-white border border-slate-200/80 p-4 sm:p-5 rounded-2xl shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wide">SLA Net Margin</span>
          <div className="text-lg sm:text-2xl font-black text-slate-950 mt-1 tracking-tight">
            {peso(Number(stats.mrr) - Number(stats.total_hosting_expenses))}<span className="text-[10px] sm:text-xs text-slate-400 font-semibold">/mo</span>
          </div>
          <div className="flex items-center gap-1 text-[8px] sm:text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 font-extrabold mt-1 w-fit uppercase tracking-widest">
            <Percent className="w-2.5 h-2.5 text-emerald-650" />
            <span>{corporateMarginPercent}% Margin</span>
          </div>
        </div>

      </div>

      {/* Analytics split layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* MRR client contributions */}
        <div className="xl:col-span-2 bg-white border border-slate-200/80 p-4 sm:p-6 rounded-2xl shadow-xs flex flex-col gap-4">
          <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">MRR License Contribution Ranking</h3>
          
          <div className="flex flex-col gap-4 mt-1">
            {stats.project_contributions.map((item) => {
              const maxMRR = Math.max(...stats.project_contributions.map(x => x.mrr), 1);
              const barPercent = Math.min((item.mrr / maxMRR) * 100, 100);
              const profitMargin = item.mrr > 0 ? Math.round((item.profit / item.mrr) * 100) : 0;

              return (
                <div key={item.id} className="flex flex-col gap-2">
                  <div className="flex flex-wrap justify-between items-start gap-1 text-xs">
                    <div>
                      <p className="text-slate-800 font-bold text-[12px] sm:text-[13px]">{item.title}</p>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">{item.client_name || "Internal Project"}</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <p className="text-slate-900 font-black">
                        {peso(item.mrr)}<span className="text-[10px] text-slate-400 font-normal">/mo</span>
                      </p>
                      <span className="text-[8px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded uppercase tracking-wider">
                        {profitMargin}% margin
                      </span>
                    </div>
                  </div>
                  {/* Progress ranking bar */}
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${barPercent}%` }} />
                  </div>
                </div>
              );
            })}

            {stats.project_contributions.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-xs font-semibold">
                No client project contributions configured in costing settings.
              </div>
            )}
          </div>
        </div>

        {/* Invoice status backlog summary */}
        <div className="bg-white border border-slate-200/80 p-4 sm:p-6 rounded-2xl shadow-xs flex flex-col gap-4">
          <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Unsettled Ledger Backlog</h3>
          
          <div className="flex flex-col gap-3 text-xs font-semibold">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <span className="text-slate-500">Unpaid Invoices Vol.</span>
              <span className="text-slate-900 font-black">{peso(stats.unpaid_volume)}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <span className="text-slate-500">Overdue Invoices Vol.</span>
              <span className="text-red-650 font-black">{peso(stats.overdue_volume)}</span>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-col gap-2 pt-1">
              <a 
                href="/dashboard/billing"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-805 text-white font-bold text-[11px] shadow-sm transition-all text-center uppercase tracking-wider"
              >
                Go to Billing Ledger
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Recent transactions lists */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden mt-2">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Recent Ledger Entries</h3>
          <a href="/dashboard/billing" className="text-emerald-650 hover:underline text-[11px] font-bold flex items-center gap-1 uppercase tracking-wide">
            <span>View full ledger</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Desktop Table View (hidden on mobile) */}
        <div className="hidden md:block overflow-x-auto text-[13px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 uppercase tracking-wider font-bold text-[9px]">
                <th className="py-3.5 px-6">Invoice #</th>
                <th className="py-3.5 px-6">Client</th>
                <th className="py-3.5 px-6">Fee Type</th>
                <th className="py-3.5 px-6">Amount</th>
                <th className="py-3.5 px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.recent_ledger.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/30">
                  <td className="py-3.5 px-6 font-mono text-xs font-bold text-slate-800">{inv.invoice_number}</td>
                  <td className="py-3.5 px-6 font-semibold text-slate-900">{inv.client_name}</td>
                  <td className="py-3.5 px-6 font-semibold text-slate-400 uppercase text-[10px] tracking-wider font-sans">
                    {inv.type.replace("_", " ")}
                  </td>
                  <td className="py-3.5 px-6 font-black text-slate-900">{peso(inv.amount)}</td>
                  <td className="py-3.5 px-6 text-center">
                    <span className={`inline-block text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      inv.status === "paid" ? "bg-emerald-50 text-emerald-800 border border-emerald-100" :
                      inv.status === "unpaid" ? "bg-blue-50 text-blue-800 border border-blue-100" :
                      "bg-red-50 text-red-800 border border-red-100"
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
              {stats.recent_ledger.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-semibold">
                    No transactions registered in ledger yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile List View (hidden on desktop) */}
        <div className="md:hidden divide-y divide-slate-100">
          {stats.recent_ledger.map((inv) => (
            <div key={inv.id} className="p-4 flex flex-col gap-2">
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <p className="font-mono text-[11px] font-bold text-slate-500">{inv.invoice_number}</p>
                  <p className="font-bold text-slate-800 text-[13px] mt-0.5 truncate">{inv.client_name}</p>
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                  inv.status === "paid" ? "bg-emerald-50 text-emerald-800 border border-emerald-100" :
                  inv.status === "unpaid" ? "bg-blue-50 text-blue-800 border border-blue-100" :
                  "bg-red-50 text-red-800 border border-red-100"
                }`}>
                  {inv.status}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1 text-[11px]">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px] bg-slate-50 border border-slate-150 px-1.5 py-0.5 rounded">
                  {inv.type.replace("_", " ")}
                </span>
                <span className="font-black text-slate-900 text-sm">{peso(inv.amount)}</span>
              </div>
            </div>
          ))}
          {stats.recent_ledger.length === 0 && (
            <div className="py-12 text-center text-slate-400 font-semibold text-xs">
              No transactions registered in ledger yet.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
