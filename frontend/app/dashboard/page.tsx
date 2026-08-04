"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { 
  TrendingUp, Minus, CheckCircle, Users, Briefcase, RefreshCw, 
  ChevronRight, Sparkles, CheckSquare, BarChart3, PieChart, Activity, AlertCircle, ShieldAlert
} from "lucide-react";
import Link from "next/link";

interface LeadItem {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  industry: string | null;
  budget: string | null;
  timeline: string | null;
  status: string;
  created_at: string;
}

interface IndustryBreakdownItem {
  industry: string | null;
  total: number;
}

interface StatusBreakdownItem {
  status: string;
  total: number;
}

export default function OverviewPage() {
  const [loading, setLoading] = useState(false);
  const [adminName, setAdminName] = useState("Administrator");
  const [metrics, setMetrics] = useState({
    today_leads: 0,
    this_month_leads: 0,
    total_projects: 0,
    pending_consultations: 0,
    won_deals: 0,
    revenue: 0,
    mrr: 0,
    hosting_expenses: 0,
    server_cost: 0,
    db_cost: 0,
    other_cost: 0
  });
  
  const [leadsList, setLeadsList] = useState<LeadItem[]>([]);
  const [industriesBreakdown, setIndustriesBreakdown] = useState<IndustryBreakdownItem[]>([]);
  const [statusBreakdown, setStatusBreakdown] = useState<StatusBreakdownItem[]>([]);
  const [error, setError] = useState("");

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("novaryn_admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    try {
      const res = await fetch(`${apiUrl}/dashboard/analytics`, {
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
        throw new Error("Failed to load dashboard metrics.");
      }

      const json = await res.json();
      const payload = json.data;
      
      setMetrics({
        today_leads: Number(payload.metrics.today_leads) || 0,
        this_month_leads: Number(payload.metrics.this_month_leads) || 0,
        total_projects: Number(payload.metrics.total_projects) || 0,
        pending_consultations: Number(payload.metrics.pending_consultations) || 0,
        won_deals: Number(payload.metrics.won_deals) || 0,
        revenue: Number(payload.metrics.revenue) || 0,
        mrr: Number(payload.metrics.mrr) || 0,
        hosting_expenses: Number(payload.metrics.hosting_expenses) || 0,
        server_cost: Number(payload.metrics.server_cost) || 0,
        db_cost: Number(payload.metrics.db_cost) || 0,
        other_cost: Number(payload.metrics.other_cost) || 0
      });
      
      setLeadsList(payload.recent_leads || []);
      setIndustriesBreakdown(payload.industries_breakdown || []);
      setStatusBreakdown(payload.status_breakdown || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAdminProfile = useCallback(() => {
    const savedUser = localStorage.getItem("novaryn_admin_user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user.name) {
          setAdminName(user.name.split(" ")[0]);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    loadAdminProfile();
    fetchAnalytics();

    // Listen to profile updates to refresh name instantly
    window.addEventListener("profileUpdate", loadAdminProfile);
    return () => window.removeEventListener("profileUpdate", loadAdminProfile);
  }, [fetchAnalytics, loadAdminProfile]);

  // Safe formatting
  const peso = (n: number) =>
    "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 0 });

  // Helper to extract client initials
  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Helper to colorize status badges
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-50 text-blue-600 border border-blue-100/50";
      case "contacted":
        return "bg-amber-50 text-amber-600 border border-amber-100/50";
      case "meeting_scheduled":
        return "bg-indigo-50 text-indigo-600 border border-indigo-100/50";
      case "proposal_sent":
        return "bg-purple-50 text-purple-600 border border-purple-100/50";
      case "won":
        return "bg-emerald-50 text-emerald-600 border border-emerald-100/50 font-semibold";
      default:
        return "bg-slate-50 text-slate-500 border border-slate-200/50";
    }
  };

  // Compute status pipeline percentages for funnel chart
  const pipelineStats = useMemo(() => {
    const totalLeads = statusBreakdown.reduce((sum, item) => sum + item.total, 0) || 1;
    return statusBreakdown.map((item) => ({
      status: item.status,
      count: item.total,
      percent: Math.min((item.total / totalLeads) * 100, 100)
    }));
  }, [statusBreakdown]);

  return (
    <div className="flex flex-col gap-6 text-left font-sans pb-12">
      
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-3.5 text-xs text-red-750 flex items-start gap-2.5 leading-relaxed">
          <AlertCircle className="w-4.5 h-4.5 shrink-0 text-red-650 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* ── 1. MOBILE-TAILORED CUSTOM VIEW (block md:hidden) ── */}
      <div className="block md:hidden flex flex-col gap-5">
        
        {/* Welcome Section */}
        <div className="flex justify-between items-center bg-white border border-slate-200 p-4.5 rounded-2xl shadow-xs">
          <div>
            <h1 className="text-base font-black text-slate-900 tracking-tight">
              Hello, {adminName}! 👋
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              Novaryn Mobile Console
            </p>
          </div>
          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-900 text-white hover:bg-slate-805 transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Central Revenue Highlight Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-5 rounded-3xl shadow-md relative overflow-hidden text-left flex flex-col gap-4">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
          
          <div>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-emerald-400">Net Monthly SLA Income</span>
            <div className="text-3xl font-black text-white mt-1 tracking-tight">
              {peso(metrics.mrr - metrics.hosting_expenses)}
            </div>
            <div className="flex items-center gap-1 text-[9px] text-emerald-300 bg-emerald-950/40 border border-emerald-900/50 px-2 py-0.5 rounded-full font-bold mt-2.5 w-fit uppercase tracking-widest">
              <span>
                {metrics.mrr > 0 ? Math.round(((metrics.mrr - metrics.hosting_expenses) / metrics.mrr) * 100) : 0}% SLA Margin
              </span>
            </div>
          </div>

          <div className="h-[1px] bg-slate-800" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Total Inflow</span>
              <span className="text-sm font-extrabold text-white block mt-0.5">{peso(metrics.revenue)}</span>
            </div>
            <div>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block">Gross MRR</span>
              <span className="text-sm font-extrabold text-white block mt-0.5">{peso(metrics.mrr)}</span>
            </div>
          </div>
        </div>

        {/* 4-Item Grid of Core Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col gap-0.5">
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Leads Database</span>
            <div className="text-lg font-black text-slate-900">{metrics.this_month_leads}</div>
            <p className="text-[7px] text-slate-400 font-semibold uppercase tracking-widest">Total Inquiries</p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col gap-0.5">
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Active Installs</span>
            <div className="text-lg font-black text-slate-900">{metrics.total_projects}</div>
            <p className="text-[7px] text-slate-400 font-semibold uppercase tracking-widest">Live Nodes</p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col gap-0.5">
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Won Deals</span>
            <div className="text-lg font-black text-slate-900">{metrics.won_deals}</div>
            <p className="text-[7px] text-slate-400 font-semibold uppercase tracking-widest">Client Contracts</p>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col gap-0.5">
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Today's Leads</span>
            <div className="text-lg font-black text-slate-900">{metrics.today_leads}</div>
            <p className="text-[7px] text-slate-400 font-semibold uppercase tracking-widest">New Requests</p>
          </div>
        </div>

        {/* Custom Mobile-Tailored Cost & SLA Margin Breakdown */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex flex-col gap-4 text-left">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-500" />
            <h3 className="text-[11px] font-extrabold text-slate-450 uppercase tracking-widest">Monthly Cost vs SLA Margin</h3>
          </div>

          {/* Simple Linear Progress stack for margins */}
          <div className="flex flex-col gap-3">
            <div className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[9px] font-extrabold text-emerald-700 uppercase tracking-wider block">Net SLA profit</span>
                <span className="text-base font-black text-slate-900 mt-0.5 block">{peso(metrics.mrr - metrics.hosting_expenses)}</span>
              </div>
              <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
                {metrics.mrr > 0 ? Math.round(((metrics.mrr - metrics.hosting_expenses) / metrics.mrr) * 100) : 0}% margin
              </span>
            </div>

            <div className="flex flex-col gap-2.5 mt-1">
              {[
                { label: "VPS Hosting node", amount: metrics.server_cost, pct: metrics.mrr > 0 ? Math.round((metrics.server_cost / metrics.mrr) * 100) : 0, color: "bg-slate-800" },
                { label: "DB Node & VPS nodes", amount: metrics.db_cost, pct: metrics.mrr > 0 ? Math.round((metrics.db_cost / metrics.mrr) * 100) : 0, color: "bg-indigo-600" },
                { label: "APIs & Support tools", amount: metrics.other_cost, pct: metrics.mrr > 0 ? Math.round((metrics.other_cost / metrics.mrr) * 100) : 0, color: "bg-emerald-600" }
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-1 text-[11px]">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-slate-650">{item.label}</span>
                    <span className="text-slate-900">{peso(item.amount)} <span className="text-[9px] text-slate-400 font-normal">({item.pct}%)</span></span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Custom Mobile-Tailored Funnel Distribution */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex flex-col gap-4 text-left">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-slate-500" />
            <h3 className="text-[11px] font-extrabold text-slate-450 uppercase tracking-widest">Pipeline Funnel Distribution</h3>
          </div>

          <div className="flex flex-col gap-3">
            {pipelineStats.map((item) => (
              <div key={item.status} className="flex flex-col gap-1 text-[11px]">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-700 uppercase tracking-wider text-[10px]">{item.status.replace("_", " ")}</span>
                  <span className="text-slate-900">{item.count} deals ({Math.round(item.percent)}%)</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-600" style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
            {pipelineStats.length === 0 && (
              <p className="text-xs text-slate-400 text-center font-medium py-4">No pipeline deals logged yet.</p>
            )}
          </div>
        </div>

        {/* Custom Mobile-Tailored Market Industry Distribution */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex flex-col gap-4 text-left">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-slate-500" />
            <h3 className="text-[11px] font-extrabold text-slate-450 uppercase tracking-widest">Market Industry Distribution</h3>
          </div>

          <div className="flex flex-col gap-3.5">
            {industriesBreakdown.map((item) => {
              const maxLeads = Math.max(...industriesBreakdown.map(x => x.total), 1);
              const barPercent = Math.min((item.total / maxLeads) * 100, 100);
              return (
                <div key={item.industry} className="flex flex-col gap-1 text-[11px]">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-slate-700">{item.industry || "Uncategorized"}</span>
                    <span className="text-slate-900">{item.total} inquiries</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-slate-900" style={{ width: `${barPercent}%` }} />
                  </div>
                </div>
              );
            })}
            {industriesBreakdown.length === 0 && (
              <p className="text-xs text-slate-400 text-center font-medium py-4">No categories logged yet.</p>
            )}
          </div>
        </div>

        {/* Custom Mobile-Tailored Recent Inquiries */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs flex flex-col gap-4 text-left">
          <div className="flex justify-between items-center">
            <h3 className="text-[11px] font-extrabold text-slate-450 uppercase tracking-widest">Recent Inquiries</h3>
            <Link
              href="/dashboard/leads"
              className="text-[10px] font-bold text-[#059669] hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="flex flex-col gap-3.5">
            {leadsList.slice(0, 4).map((lead) => (
              <div key={lead.id} className="flex justify-between items-start gap-2 pb-3.5 border-b border-slate-100 last:border-b-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100/50 flex items-center justify-center font-bold text-emerald-700 text-xs shrink-0 select-none">
                    {getInitials(lead.name)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 leading-tight">{lead.name}</h4>
                    <p className="text-[10px] text-slate-450 font-medium mt-1 truncate max-w-[160px]">
                      {lead.company || lead.email}
                    </p>
                    <span className="text-[10px] font-extrabold text-slate-500 block mt-1.5">{lead.budget || "TBD Budget"}</span>
                  </div>
                </div>
                <span className={`inline-block text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md shrink-0 ${getStatusBadge(lead.status)}`}>
                  {lead.status.replace("_", " ")}
                </span>
              </div>
            ))}
            {leadsList.length === 0 && (
              <div className="py-8 text-center text-slate-400 font-semibold text-xs">
                No recent inquiries registered.
              </div>
            )}
          </div>
        </div>

        {/* CRM Copilot Recommendations */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl text-left shadow-xs relative overflow-hidden flex flex-col gap-3.5">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-emerald-500" />
          
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h3 className="text-[11px] font-extrabold text-slate-850 uppercase tracking-widest">CRM Copilot Recommendations</h3>
          </div>

          <div className="flex flex-col gap-3 text-xs font-semibold">
            <div className="flex items-start gap-2.5 leading-relaxed bg-slate-50 p-3 rounded-xl">
              <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-700 font-bold block text-[11px]">Sync Leads Pipeline</span>
                <span className="text-slate-450 text-[10px] mt-0.5 block leading-normal">You have {metrics.pending_consultations} pending consultations scheduled.</span>
                <Link href="/dashboard/leads" className="inline-block text-[10px] text-emerald-600 hover:underline font-bold mt-1.5">
                  Resolve Pipeline now →
                </Link>
              </div>
            </div>

            <div className="flex items-start gap-2.5 leading-relaxed bg-slate-50 p-3 rounded-xl">
              <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-700 font-bold block text-[11px]">Verify Account Security</span>
                <span className="text-slate-455 text-[10px] mt-0.5 block leading-normal">Manage settings, password keys, and team roles securely.</span>
                <Link href="/dashboard/settings" className="inline-block text-[10px] text-emerald-600 hover:underline font-bold mt-1.5">
                  Open Settings Console →
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── 2. DESKTOP VIEW LAYOUT (hidden md:flex flex-col gap-6) ── */}
      <div className="hidden md:flex flex-col gap-6">
        
        {/* Header Greeting */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none">
              Hello how are you, {adminName}? 👋
            </h1>
            <p className="text-[13px] text-slate-500 mt-1.5 font-medium">
              Here's the real-time operational status of Novaryn today.
            </p>
          </div>
          <button
            onClick={fetchAnalytics}
            disabled={loading}
            className="flex items-center gap-2 bg-[#059669] hover:bg-[#059669]/90 text-white font-semibold text-[12px] h-9 px-4 rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync Dashboard</span>
          </button>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-4 gap-4">
          
          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs text-left">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Leads Captured</span>
            <div className="text-2xl font-black text-slate-950 mt-1 tracking-tight">{metrics.this_month_leads}</div>
            <div className="flex items-center gap-1 text-[10px] text-slate-455 font-bold mt-1 uppercase tracking-wider">
              <span>Total CRM Database</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs text-left">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Active Dev Instances</span>
            <div className="text-2xl font-black text-slate-950 mt-1 tracking-tight">{metrics.total_projects}</div>
            <div className="flex items-center gap-1 text-[10px] text-slate-455 font-bold mt-1 uppercase tracking-wider">
              <span>Active Installs</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs text-left">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Real Invoiced Income</span>
            <div className="text-2xl font-black text-emerald-650 mt-1 tracking-tight">{peso(metrics.revenue)}</div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-750 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded font-extrabold mt-1 w-fit uppercase tracking-widest">
              <span>Paid Revenue</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs text-left">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Net Monthly SLA Profit</span>
            <div className="text-2xl font-black text-slate-950 mt-1 tracking-tight">
              {peso(metrics.mrr - metrics.hosting_expenses)}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded font-extrabold mt-1 w-fit uppercase tracking-widest">
              <span>
                {metrics.mrr > 0 ? Math.round(((metrics.mrr - metrics.hosting_expenses) / metrics.mrr) * 100) : 0}% Margin
              </span>
            </div>
          </div>

        </div>

        {/* Charts & Graphs Row (3 columns: Funnel, Donut Expenses, Industry) */}
        <div className="grid grid-cols-3 gap-6">
          
          {/* CRM Funnel Graph */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs flex flex-col gap-4 text-left">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-slate-500" />
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pipeline Funnel Distribution</h3>
            </div>
            
            <div className="flex flex-col gap-4.5 mt-2">
              {pipelineStats.map((item) => (
                <div key={item.status} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-800 uppercase tracking-wide">{item.status.replace("_", " ")}</span>
                    <span className="text-slate-455">{item.count} deals</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-emerald-600 transition-all" 
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
              
              {pipelineStats.length === 0 && (
                <div className="py-12 text-center text-slate-400 text-xs font-semibold">
                  No pipeline deals created yet.
                </div>
              )}
            </div>
          </div>

          {/* Expenses Donut Chart */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs flex flex-col gap-4 text-left">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-500" />
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Monthly Cost vs SLA Margin</h3>
            </div>

            <div className="flex items-center justify-center gap-5 mt-2">
              {/* The Donut Circle */}
              <div 
                className="relative w-28 h-28 rounded-full flex items-center justify-center shrink-0 shadow-xs"
                style={{
                  background: metrics.mrr > 0 ? (()=>{
                    const profitPct = Math.round(((metrics.mrr - metrics.hosting_expenses) / metrics.mrr) * 100);
                    const serverPct = Math.round((metrics.server_cost / metrics.mrr) * 100);
                    const serverEnd = profitPct + serverPct;
                    return `conic-gradient(#059669 0% ${profitPct}%, #1e293b ${profitPct}% ${serverEnd}%, #4f46e5 ${serverEnd}% 100%)`;
                  })() : "conic-gradient(#cbd5e1 0% 100%)"
                }}
              >
                <div className="w-20 h-20 bg-white rounded-full flex flex-col items-center justify-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Net Margin</span>
                  <span className="text-sm font-black text-slate-800">
                    {metrics.mrr > 0 ? Math.round(((metrics.mrr - metrics.hosting_expenses) / metrics.mrr) * 100) : 0}%
                  </span>
                </div>
              </div>

              {/* Donut Legend */}
              <div className="flex flex-col gap-2.5 text-[11px] font-semibold text-slate-500 w-full">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <div className="flex-1 flex justify-between">
                    <span>Net Profit</span>
                    <span className="font-bold text-slate-800">{peso(metrics.mrr - metrics.hosting_expenses)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
                  <div className="flex-1 flex justify-between">
                    <span>VPS Server</span>
                    <span className="font-bold text-slate-800">{peso(metrics.server_cost)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                  <div className="flex-1 flex justify-between">
                    <span>DB & APIs</span>
                    <span className="font-bold text-slate-800">{peso(metrics.db_cost + metrics.other_cost)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Industry Interest breakdown chart */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs flex flex-col gap-4 text-left">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-slate-500" />
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Market Industry Distribution</h3>
            </div>

            <div className="flex flex-col gap-4.5 mt-2">
              {industriesBreakdown.map((item) => {
                const maxLeads = Math.max(...industriesBreakdown.map(x => x.total), 1);
                const barPercent = Math.min((item.total / maxLeads) * 100, 100);

                return (
                  <div key={item.industry} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-800">{item.industry || "Uncategorized"}</span>
                      <span className="text-slate-455">{item.total} inquiries</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-slate-900 transition-all" 
                        style={{ width: `${barPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              {industriesBreakdown.length === 0 && (
                <div className="py-12 text-center text-slate-400 text-xs font-semibold">
                  No inquiries registered to track industries.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Two-Column Main Workspace */}
        <div className="grid grid-cols-3 gap-6">
          
          {/* Left Column: Recent Inquiries Table (Spans 2 cols) */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl col-span-2 flex flex-col gap-5 text-left shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[13px] font-bold text-slate-900 tracking-tight">Recent Inquiries</h3>
                <p className="text-[11px] text-slate-400 mt-0.5 font-semibold">List of active client consultations and proposal requests.</p>
              </div>
              <Link
                href="/dashboard/leads"
                className="text-[11px] font-bold text-[#059669] hover:text-[#059669]/80 transition-colors flex items-center gap-0.5"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto text-[13px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold text-[9px]">
                    <th className="py-2.5 px-1 pb-3">Client Profile</th>
                    <th className="py-2.5 px-1 pb-3">Budget Scale</th>
                    <th className="py-2.5 px-1 pb-3 text-right">Pipeline Stage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leadsList.slice(0, 5).map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="py-3.5 px-1 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100/50 flex items-center justify-center font-bold text-emerald-700 text-xs shrink-0 select-none">
                          {getInitials(lead.name)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">{lead.name}</div>
                          <div className="text-[11px] text-slate-405 mt-0.5 font-medium">{lead.company || lead.email}</div>
                        </div>
                      </td>
                      
                      <td className="py-3.5 px-1 font-bold text-slate-655 text-xs">
                        {lead.budget || "TBD"}
                      </td>
                      
                      <td className="py-3.5 px-1 text-right">
                        <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${getStatusBadge(lead.status)}`}>
                          {lead.status.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {leadsList.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-10 text-center text-slate-400 font-medium">
                        No recent inquiries cataloged.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: CRM Copilot AI widget */}
          <div className="flex flex-col gap-6">
            
            <div className="bg-white border border-slate-200/80 p-6 rounded-2xl text-left shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-emerald-500" />
              
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h3 className="text-[13px] font-semibold text-slate-900 tracking-tight">CRM Copilot</h3>
                <span className="text-[9px] bg-emerald-50 border border-emerald-100 text-emerald-700 font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  Beta
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-1">Automated activity analysis suggestions:</p>

              <div className="flex flex-col gap-3.5 mt-4">
                <div className="flex items-start gap-2.5 text-[12px] leading-relaxed">
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-700 font-medium">You have {metrics.pending_consultations} pending consultations</span>
                    <Link href="/dashboard/leads" className="block text-[10px] text-emerald-600 hover:underline font-bold mt-0.5">
                      Sync Pipeline now →
                    </Link>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-[12px] leading-relaxed">
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-700 font-medium">Configure company address</span>
                    <Link href="/dashboard/settings" className="block text-[10px] text-emerald-600 hover:underline font-bold mt-0.5">
                      Open Settings →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
