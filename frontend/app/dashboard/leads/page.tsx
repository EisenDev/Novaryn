"use client";

import React, { useState, useEffect } from "react";
import { Users, RefreshCw, ShieldAlert, Search, Filter, Sliders, CheckCircle } from "lucide-react";

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
  message?: string | null;
  created_at: string;
}

const statusFilters = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "meeting_scheduled", label: "Meeting" },
  { value: "proposal_sent", label: "Proposal" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

export default function LeadsPage() {
  const [leadsList, setLeadsList] = useState<LeadItem[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    filterData();
  }, [leadsList, selectedFilter, searchQuery]);

  const fetchLeads = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("novaryn_admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    try {
      const res = await fetch(`${apiUrl}/leads`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      const data = await res.json();
      if (res.ok) {
        setLeadsList(data.data.data || data.data);
      } else {
        setError("Unable to retrieve CRM leads from the backend API.");
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
      setError("Connection failure. Make sure Laravel API container is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (leadId: string, newStatus: string) => {
    setActionLoading(leadId);
    const token = localStorage.getItem("novaryn_admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    try {
      const res = await fetch(`${apiUrl}/leads/${leadId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        await fetchLeads();
      }
    } catch (err) {
      console.error("Error updating lead status:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const filterData = () => {
    let result = [...leadsList];

    // 1. Filter by Segment status
    if (selectedFilter !== "all") {
      result = result.filter(lead => lead.status === selectedFilter);
    }

    // 2. Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(lead => 
        lead.name.toLowerCase().includes(query) ||
        (lead.company && lead.company.toLowerCase().includes(query)) ||
        lead.email.toLowerCase().includes(query) ||
        (lead.industry && lead.industry.toLowerCase().includes(query))
      );
    }

    setFilteredLeads(result);
  };

  // Helper to extract initials
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Helper to calculate statistics dynamically
  const totalLeadsCount = leadsList.length;
  const wonLeadsCount = leadsList.filter(l => l.status === 'won').length;
  const activeProposalsCount = leadsList.filter(l => l.status === 'proposal_sent' || l.status === 'meeting_scheduled').length;
  const conversionRate = totalLeadsCount > 0 ? Math.round((wonLeadsCount / totalLeadsCount) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 text-left">
      
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none">Leads</h1>
          <p className="text-[13px] text-slate-500 mt-1.5 font-medium">Track and manage captured client consultations.</p>
        </div>
        <button
          onClick={fetchLeads}
          disabled={loading}
          className="flex items-center gap-2 bg-[#059669] hover:bg-[#059669]/90 text-white font-semibold text-[13px] h-9 px-4 rounded-lg transition-all shadow-xs cursor-pointer select-none"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Sync Leads</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-3.5 text-xs text-red-700 flex items-start gap-2.5 leading-relaxed">
          <ShieldAlert className="w-4.5 h-4.5 shrink-0 text-red-650 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Control Segment Toolbar (Avenor style layout) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[#E2E8F0]/70 pb-4 mt-2">
        {/* Left: Status segment buttons */}
        <div className="flex flex-wrap gap-1 bg-[#F1F5F9]/50 border border-[#E2E8F0]/50 p-1 rounded-xl w-fit">
          {statusFilters.map((filter) => {
            const isSelected = selectedFilter === filter.value;
            return (
              <button
                key={filter.value}
                onClick={() => setSelectedFilter(filter.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  isSelected 
                    ? "bg-white text-slate-900 shadow-xs" 
                    : "text-slate-550 hover:text-slate-800"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* Right: Search and Filter Actions */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search client or sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 w-52 bg-white rounded-lg text-xs border border-slate-200/80 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 font-medium placeholder-slate-400"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200/80 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-xs cursor-pointer">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Leads Table Card (Clean slate style borders) */}
      <div className="bg-white border border-[#E2E8F0]/70 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0]/70 bg-slate-50/50 text-slate-400 uppercase tracking-wider font-bold text-[10px]">
                <th className="py-3.5 px-6">Client Profile</th>
                <th className="py-3.5 px-6">Contact info</th>
                <th className="py-3.5 px-6">Company / Sector</th>
                <th className="py-3.5 px-6 text-center">Pipeline Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]/40">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/30 transition-all group">
                  
                  {/* Name and Initials box */}
                  <td className="py-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100/50 flex items-center justify-center font-bold text-emerald-700 text-xs shrink-0 select-none">
                      {getInitials(lead.name)}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 group-hover:text-slate-950 transition-colors">{lead.name}</div>
                      <div className="text-[11px] text-slate-400 font-medium mt-0.5" title={lead.message || ""}>
                        {lead.message ? lead.message.slice(0, 45) + "..." : "No notes provided"}
                      </div>
                    </div>
                  </td>

                  {/* Email & Phone */}
                  <td className="py-4 px-6 font-medium text-slate-650">
                    <div>{lead.email}</div>
                    <div className="text-slate-400 text-[10px] mt-0.5">{lead.phone || "—"}</div>
                  </td>

                  {/* Industry & budget details */}
                  <td className="py-4 px-6">
                    <div className="font-semibold text-slate-800">{lead.company || "Individual"}</div>
                    <div className="flex gap-2 mt-1 text-[10px] font-bold text-slate-400">
                      <span className="bg-slate-50 border border-slate-200/50 px-1.5 py-0.5 rounded-md">{lead.industry}</span>
                      <span className="bg-slate-50 border border-slate-200/50 px-1.5 py-0.5 rounded-md">{lead.budget}</span>
                    </div>
                  </td>

                  {/* Dropdown Selector stage modifier */}
                  <td className="py-4 px-6 text-center">
                    {actionLoading === lead.id ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-600 mx-auto" />
                    ) : (
                      <select
                        value={lead.status}
                        onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-bold text-[11px] text-slate-700 outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer shadow-xs"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="meeting_scheduled">Meeting Scheduled</option>
                        <option value="proposal_sent">Proposal Sent</option>
                        <option value="negotiation">Negotiation</option>
                        <option value="won">Won (Deal Closed)</option>
                        <option value="lost">Lost</option>
                        <option value="archived">Archived</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-slate-400 font-semibold leading-relaxed">
                    No matching client records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Applications Pipeline Timeline & Stage Summary (Avenor style lower indicators) */}
      <div className="mt-4 flex flex-col gap-4">
        <h3 className="text-[13px] font-semibold text-slate-900 tracking-tight">Leads Conversion & Pipeline Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white border border-[#E2E8F0]/70 p-5 rounded-xl text-left shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Total Applications</span>
            <div className="text-2xl font-bold text-slate-800 mt-1.5">{totalLeadsCount}</div>
          </div>

          <div className="bg-white border border-[#E2E8F0]/70 p-5 rounded-xl text-left shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Proposals Drafted</span>
            <div className="text-2xl font-bold text-slate-800 mt-1.5">{activeProposalsCount}</div>
          </div>

          <div className="bg-white border border-[#E2E8F0]/70 p-5 rounded-xl text-left shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Deals Won</span>
            <div className="text-2xl font-bold text-slate-800 mt-1.5">{wonLeadsCount}</div>
          </div>

          <div className="bg-white border border-[#E2E8F0]/70 p-5 rounded-xl text-left shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Conversion Rate</span>
            <div className="text-2xl font-bold text-[#059669] mt-1.5">{conversionRate}%</div>
          </div>

        </div>
      </div>

    </div>
  );
}
