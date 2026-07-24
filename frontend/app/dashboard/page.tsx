"use client";

import React, { useState, useEffect } from "react";
import { 
  TrendingUp, Minus, CheckCircle, Users, Briefcase, RefreshCw, 
  ChevronRight, Sparkles, CheckSquare, Plus 
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

export default function OverviewPage() {
  const [loading, setLoading] = useState(false);
  const [adminName, setAdminName] = useState("Administrator");
  const [metrics, setMetrics] = useState({
    today_leads: 0,
    this_month_leads: 0,
    total_projects: 0,
    pending_consultations: 0,
    won_deals: 0,
    revenue: "₱0"
  });
  
  const [leadsList, setLeadsList] = useState<LeadItem[]>([]);
  const [industriesBreakdown, setIndustriesBreakdown] = useState<any[]>([]);

  useEffect(() => {
    // Fetch administrator name from storage
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
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
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
      const data = await res.json();
      if (res.ok) {
        setMetrics(data.data.metrics);
        setLeadsList(data.data.recent_leads);
        setIndustriesBreakdown(data.data.industries_breakdown);
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to extract client initials
  const getInitials = (name: string) => {
    const parts = name.split(" ");
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

  return (
    <div className="flex flex-col gap-7">
      
      {/* Welcome Greeting Header Block */}
      <div className="flex justify-between items-center text-left">
        <div>
          <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none">
            Good morning, {adminName}! 👋
          </h1>
          <p className="text-[13px] text-slate-500 mt-1.5 font-medium">
            Here's what's happening with Novaryn operations today.
          </p>
        </div>
        <button
          onClick={() => fetchAnalytics()}
          disabled={loading}
          className="flex items-center gap-2 bg-[#059669] hover:bg-[#059669]/90 text-white font-semibold text-[13px] h-9 px-4 rounded-lg transition-all shadow-xs cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Sync Pipelines</span>
        </button>
      </div>

      {/* 4 Stat Cards Grid (Subtle borders, no heavy shadows) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Leads */}
        <div className="bg-white border border-[#E2E8F0]/70 p-5 rounded-xl flex flex-col gap-1.5 text-left transition-all hover:border-[#E2E8F0] shadow-xs">
          <span className="text-[12px] font-medium text-slate-400 tracking-tight">Leads Captured</span>
          <div className="text-2xl font-bold text-slate-900 mt-0.5 tracking-tight">{metrics.this_month_leads}</div>
          <div className="flex items-center gap-1 text-[11px] text-[#10B981] font-semibold mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+15% this month</span>
          </div>
        </div>

        {/* Won Consultations */}
        <div className="bg-white border border-[#E2E8F0]/70 p-5 rounded-xl flex flex-col gap-1.5 text-left transition-all hover:border-[#E2E8F0] shadow-xs">
          <span className="text-[12px] font-medium text-slate-400 tracking-tight">Won Deals</span>
          <div className="text-2xl font-bold text-slate-900 mt-0.5 tracking-tight">{metrics.won_deals}</div>
          <div className="flex items-center gap-1 text-[11px] text-[#10B981] font-semibold mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+25% this month</span>
          </div>
        </div>

        {/* Active Works */}
        <div className="bg-white border border-[#E2E8F0]/70 p-5 rounded-xl flex flex-col gap-1.5 text-left transition-all hover:border-[#E2E8F0] shadow-xs">
          <span className="text-[12px] font-medium text-slate-400 tracking-tight">Active Projects</span>
          <div className="text-2xl font-bold text-slate-900 mt-0.5 tracking-tight">{metrics.total_projects}</div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold mt-1">
            <Minus className="w-3.5 h-3.5 text-slate-400" />
            <span>No changes</span>
          </div>
        </div>

        {/* Gross Revenue */}
        <div className="bg-white border border-[#E2E8F0]/70 p-5 rounded-xl flex flex-col gap-1.5 text-left transition-all hover:border-[#E2E8F0] shadow-xs">
          <span className="text-[12px] font-medium text-slate-400 tracking-tight">Won Revenue</span>
          <div className="text-2xl font-bold text-emerald-600 mt-0.5 tracking-tight">{metrics.revenue}</div>
          <div className="flex items-center gap-1 text-[11px] text-[#10B981] font-semibold mt-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+8% this month</span>
          </div>
        </div>
      </div>

      {/* Two-Column Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Recent Inquiries Table (Spans 2 cols) */}
        <div className="bg-white border border-[#E2E8F0]/70 p-6 rounded-2xl lg:col-span-2 flex flex-col gap-5 text-left shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[14px] font-semibold text-slate-900 tracking-tight">Recent Inquiries</h3>
              <p className="text-[12px] text-slate-400 mt-0.5 font-medium">List of live client consultations and proposal requests.</p>
            </div>
            <Link
              href="/dashboard/leads"
              className="text-[12px] font-bold text-[#059669] hover:text-[#059669]/80 transition-colors flex items-center gap-0.5"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[13px] text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F0]/70 text-slate-400 uppercase tracking-wider font-bold text-[10px]">
                  <th className="py-2.5 px-1 pb-3">Client Profile</th>
                  <th className="py-2.5 px-1 pb-3">Budget Scale</th>
                  <th className="py-2.5 px-1 pb-3 text-right">Pipeline Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]/40">
                {leadsList.slice(0, 5).map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/30 transition-colors group">
                    {/* Client details with initials avatar box */}
                    <td className="py-3.5 px-1 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100/50 flex items-center justify-center font-bold text-emerald-700 text-xs shrink-0 select-none">
                        {getInitials(lead.name)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">{lead.name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5 font-medium">{lead.company || lead.email}</div>
                      </div>
                    </td>
                    
                    {/* Budget */}
                    <td className="py-3.5 px-1 font-medium text-slate-600">
                      {lead.budget || "TBD"}
                    </td>
                    
                    {/* Status Pill Badge */}
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

        {/* Right Column: AI Assistant (Avenor design style) & Interest chart */}
        <div className="flex flex-col gap-6">
          
          {/* Novaryn CRM Copilot AI widget */}
          <div className="bg-white border border-[#E2E8F0]/70 p-6 rounded-2xl text-left shadow-xs relative overflow-hidden">
            {/* Glowing top divider */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-emerald-500" />
            
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h3 className="text-[13px] font-semibold text-slate-900 tracking-tight">CRM Copilot</h3>
              <span className="text-[9px] bg-emerald-50 border border-emerald-100 text-emerald-700 font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                Beta
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-1">Automated activity analysis suggestions:</p>

            <div className="flex flex-col gap-3 mt-4">
              <div className="flex items-start gap-2.5 text-[12px] leading-relaxed">
                <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-700 font-medium">You have 3 consultations to review</span>
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

          {/* Industry interest metrics */}
          <div className="bg-white border border-[#E2E8F0]/70 p-6 rounded-2xl text-left shadow-xs flex flex-col gap-4">
            <div>
              <h3 className="text-[13px] font-semibold text-slate-900 tracking-tight">Industry Interest</h3>
              <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Captured leads distribution by sector.</p>
            </div>

            <div className="flex flex-col gap-3.5 mt-2">
              {industriesBreakdown.map((item) => (
                <div key={item.industry} className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>{item.industry || "General"}</span>
                    <span className="text-slate-400">{item.total} leads</span>
                  </div>
                  <div className="w-full h-[5px] rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ 
                        width: `${Math.max(8, (item.total / (leadsList.length || 1)) * 100)}%` 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
