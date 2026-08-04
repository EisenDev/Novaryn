"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { 
  RefreshCw, ShieldAlert, Cpu, Check, DollarSign, Server, 
  Database, Activity, ArrowUpRight, TrendingUp, Sparkles, Percent
} from "lucide-react";

interface ProjectItem {
  id: string;
  title: string;
  client_name: string | null;
  module_config: {
    one_time_revenue?: number;
    monthly_revenue?: number;
    server_cost?: number;
    database_cost?: number;
    other_cost?: number;
  } | null;
}

export default function ProjectCostingPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");

  // Input states
  const [oneTimeRevenue, setOneTimeRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [serverCost, setServerCost] = useState(0);
  const [databaseCost, setDatabaseCost] = useState(0);
  const [otherCost, setOtherCost] = useState(0);

  // Fetch project list
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("novaryn_admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    try {
      const res = await fetch(`${apiUrl}/projects`, {
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
        throw new Error("Unable to retrieve project costing installations.");
      }

      const json = await res.json();
      const list: ProjectItem[] = json.data || [];
      setProjects(list);

      if (list.length > 0) {
        // Find if there was a previous selection, otherwise choose first
        setSelectedProjectId(list[0].id);
        loadProjectConfig(list[0]);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load project database files.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Load configs
  const loadProjectConfig = (project: ProjectItem) => {
    const config = project.module_config || {};
    setOneTimeRevenue(config.one_time_revenue || 0);
    setMonthlyRevenue(config.monthly_revenue || 0);
    setServerCost(config.server_cost || 0);
    setDatabaseCost(config.database_cost || 0);
    setOtherCost(config.other_cost || 0);
  };

  // Selection change
  const handleProjectChange = (id: string) => {
    setSelectedProjectId(id);
    const p = projects.find(item => item.id === id);
    if (p) {
      loadProjectConfig(p);
    }
  };

  // Submit updates
  const handleSave = async () => {
    if (!selectedProjectId) return;

    setSaveLoading(true);
    const token = localStorage.getItem("novaryn_admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    const payload = {
      module_config: {
        one_time_revenue: parseFloat(oneTimeRevenue as any) || 0,
        monthly_revenue: parseFloat(monthlyRevenue as any) || 0,
        server_cost: parseFloat(serverCost as any) || 0,
        database_cost: parseFloat(databaseCost as any) || 0,
        other_cost: parseFloat(otherCost as any) || 0
      }
    };

    try {
      const res = await fetch(`${apiUrl}/projects/${selectedProjectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Failed to save operational costing credentials.");
      }

      alert("Project financial and hosting cost configurations saved successfully!");
      
      // Update local list state
      setProjects(prev => prev.map(p => {
        if (p.id === selectedProjectId) {
          return { ...p, module_config: payload.module_config };
        }
        return p;
      }));
    } catch (err: any) {
      alert(err.message || "Failed to update configs.");
    } finally {
      setSaveLoading(false);
    }
  };

  // Computations for SELECTED PROJECT
  const projectStats = useMemo(() => {
    const expenses = serverCost + databaseCost + otherCost;
    const profit = monthlyRevenue - expenses;
    const margin = monthlyRevenue > 0 ? Math.round((profit / monthlyRevenue) * 100) : 0;
    return { expenses, profit, margin };
  }, [monthlyRevenue, serverCost, databaseCost, otherCost]);

  // Computations for ALL PROJECTS (Company-wide Overview)
  const globalStats = useMemo(() => {
    let totalMRR = 0;
    let totalOneTime = 0;
    let totalServer = 0;
    let totalDbOther = 0;

    projects.forEach(p => {
      const cfg = p.module_config || {};
      totalMRR += cfg.monthly_revenue || 0;
      totalOneTime += cfg.one_time_revenue || 0;
      totalServer += cfg.server_cost || 0;
      totalDbOther += (cfg.database_cost || 0) + (cfg.other_cost || 0);
    });

    const totalExpenses = totalServer + totalDbOther;
    const netProfit = totalMRR - totalExpenses;
    const avgMargin = totalMRR > 0 ? Math.round((netProfit / totalMRR) * 100) : 0;

    return { totalMRR, totalOneTime, totalServer, totalDbOther, totalExpenses, netProfit, avgMargin };
  }, [projects]);

  const peso = (n: number) =>
    "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 0 });

  if (loading && projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-[12px] text-slate-500 font-medium">Loading project cost analysis panels...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-left font-sans pb-12">
      <div>
        <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none">Project Financial Costing</h1>
        <p className="text-[13px] text-slate-500 mt-1.5 font-medium">Configure VPS hosting fees, db node costs, and net margins.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-3.5 text-xs text-red-700 flex items-start gap-2.5 leading-relaxed max-w-4xl">
          <ShieldAlert className="w-4.5 h-4.5 shrink-0 text-red-650 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="py-20 bg-white border border-slate-200 rounded-2xl text-center text-slate-400 flex flex-col items-center justify-center gap-2 max-w-4xl shadow-xs">
          <Cpu className="w-8 h-8 text-slate-350" />
          <p className="text-xs font-semibold">No active project installations found.</p>
          <p className="text-[10px] text-slate-400 max-w-[280px] leading-relaxed">
            Mark a CRM deal as "Won" to automatically launch a project build before configuring database hosting margins.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
          
          {/* Left Side (Costing Editor Form) */}
          <div className="xl:col-span-2 bg-white border border-slate-200 p-4 sm:p-6 rounded-2xl shadow-xs flex flex-col gap-4 sm:gap-5">
            
            {/* Project dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Select Client Project</label>
              <select 
                value={selectedProjectId}
                onChange={(e) => handleProjectChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white font-semibold text-xs text-slate-800 outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer shadow-xs"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.client_name || "Internal"})
                  </option>
                ))}
              </select>
            </div>

            <div className="h-[1px] bg-slate-100 my-0.5" />

            {/* Revenues */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                <h3 className="text-[12px] sm:text-[13px] font-bold text-slate-800 tracking-tight">Contract Revenue Parameters</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">One-time Build Cost (₱)</label>
                  <input
                    type="number"
                    value={oneTimeRevenue || ""}
                    onChange={(e) => setOneTimeRevenue(parseFloat(e.target.value) || 0)}
                    placeholder="e.g. 150000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-[12px] font-semibold text-slate-805 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Monthly SLA Support (₱)</label>
                  <input
                    type="number"
                    value={monthlyRevenue || ""}
                    onChange={(e) => setMonthlyRevenue(parseFloat(e.target.value) || 0)}
                    placeholder="e.g. 5000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-[12px] font-semibold text-slate-805 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-slate-100 my-0.5" />

            {/* Cloud Hosting Expenses */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-indigo-650 shrink-0" />
                <h3 className="text-[12px] sm:text-[13px] font-bold text-slate-800 tracking-tight">Monthly Server & Cloud Expenses</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Hosting / VPS Cost (₱)</label>
                  <input
                    type="number"
                    value={serverCost || ""}
                    onChange={(e) => setServerCost(parseFloat(e.target.value) || 0)}
                    placeholder="e.g. 1200"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-[12px] font-semibold text-slate-805 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Database Node Cost (₱)</label>
                  <input
                    type="number"
                    value={databaseCost || ""}
                    onChange={(e) => setDatabaseCost(parseFloat(e.target.value) || 0)}
                    placeholder="e.g. 500"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-[12px] font-semibold text-slate-805 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Other APIs & Domain (₱)</label>
                  <input
                    type="number"
                    value={otherCost || ""}
                    onChange={(e) => setOtherCost(parseFloat(e.target.value) || 0)}
                    placeholder="e.g. 300"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-[12px] font-semibold text-slate-805 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saveLoading}
              className="flex items-center justify-center gap-2 px-5 py-2.5 mt-2 w-full sm:w-auto sm:self-end rounded-xl bg-slate-900 hover:bg-slate-805 text-white font-bold text-xs shadow-md active:scale-98 transition-all cursor-pointer disabled:opacity-50"
            >
              {saveLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>Save Financial Parameters</span>
            </button>

          </div>

          {/* Right Side (Selected Project Margins Breakdown) */}
          <div className="flex flex-col gap-4">
            
            <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-xs flex flex-col gap-4">
              <h3 className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Project Margin Calculator</h3>
              
              <div className="flex flex-col gap-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500">Monthly Billing SLA</span>
                  <span className="font-bold text-slate-800">{peso(monthlyRevenue)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-500">Total Hosting Costs</span>
                  <span className="font-bold text-red-650">-{peso(projectStats.expenses)}</span>
                </div>
                <div className="h-[1px] bg-slate-100 my-0.5" />
                
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900">Net Monthly Earnings</span>
                  <span className={`text-[14px] font-black ${projectStats.profit >= 0 ? "text-emerald-700" : "text-red-750"}`}>
                    {peso(projectStats.profit)}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-0.5">
                  <span className="text-xs font-bold text-slate-900">Profit Margin %</span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                    projectStats.margin >= 70 ? "bg-emerald-50 text-emerald-800 border border-emerald-100" :
                    projectStats.margin >= 40 ? "bg-blue-50 text-blue-800 border border-blue-100" :
                    "bg-amber-50 text-amber-800 border border-amber-100"
                  }`}>
                    {projectStats.margin}%
                  </span>
                </div>
              </div>
            </div>

            {/* Cloud host warning alert if margin is low */}
            {projectStats.margin < 40 && monthlyRevenue > 0 && (
              <div className="bg-amber-50 border border-amber-105 p-3.5 rounded-2xl text-[11px] text-amber-850 font-medium leading-relaxed flex items-start gap-2 animate-fade-in">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Hosting costs exceed 60% of the Retainer SLA. Review Cloud resource utilization.</span>
              </div>
            )}

          </div>

        </div>
      )}

      {/* Global Corporate Financial Overview */}
      <div className="flex flex-col gap-4 mt-4 border-t border-slate-100 pt-5">
        <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
          <div>
            <h3 className="text-[13px] font-bold text-slate-905 tracking-tight leading-none">Novaryn Corporate Project Portfolio Earnings</h3>
            <p className="text-[11px] text-slate-400 mt-1 font-semibold">Total aggregated portfolio valuations, combined hosting costs, and net margin estimates.</p>
          </div>
          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-lg text-slate-500">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Live Estimates
          </span>
        </div>

        {/* 2x2 grid on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          
          <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl text-left shadow-xs">
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wide">One-Time Value</span>
            <div className="text-base sm:text-xl font-black text-slate-800 mt-1">{peso(globalStats.totalOneTime)}</div>
          </div>

          <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl text-left shadow-xs">
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wide">Monthly SLA (MRR)</span>
            <div className="text-base sm:text-xl font-black text-slate-800 mt-1">{peso(globalStats.totalMRR)}</div>
          </div>

          <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl text-left shadow-xs">
            <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wide">Hosting Costs</span>
            <div className="text-base sm:text-xl font-black text-red-605 mt-1">-{peso(globalStats.totalExpenses)}</div>
          </div>

          <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl text-left shadow-xs">
            <div className="flex justify-between items-center gap-1 flex-wrap">
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wide">Net Profit</span>
              <span className="text-[8px] font-extrabold text-emerald-705 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 shrink-0">{globalStats.avgMargin}% margin</span>
            </div>
            <div className="text-base sm:text-xl font-black text-[#059669] mt-1">{peso(globalStats.netProfit)}<span className="text-[10px] font-semibold text-slate-400">/mo</span></div>
          </div>

        </div>
      </div>

    </div>
  );
}
