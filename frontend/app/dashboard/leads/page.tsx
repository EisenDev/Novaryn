"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { 
  Users, RefreshCw, ShieldAlert, Search, Filter, Mail, Phone, 
  Building, Briefcase, DollarSign, Calendar, Clock, Edit3, 
  ExternalLink, Plus, Check, ChevronRight, X, FileText
} from "lucide-react";

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
  notes?: string | null;
  meeting_date?: string | null;
  created_at: string;
}

interface Quotation {
  id: string;
  client_name: string;
  client_email: string | null;
  build_total: number;
  monthly_total: number;
}

const statusFilters = [
  { value: "all", label: "All Leads" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "meeting_scheduled", label: "Meeting Scheduled" },
  { value: "proposal_sent", label: "Proposal Sent" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
  { value: "archived", label: "Archived" }
];

const peso = (n: number) =>
  "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 0 });

const getStatusBadge = (status: string) => {
  switch (status) {
    case "new":
      return "bg-blue-50 text-blue-600 border border-blue-100/50";
    case "contacted":
      return "bg-amber-50 text-amber-600 border border-amber-100/50";
    case "meeting_scheduled":
      return "bg-indigo-50 text-indigo-650 border border-indigo-100/50";
    case "proposal_sent":
      return "bg-purple-50 text-purple-600 border border-purple-100/50";
    case "won":
      return "bg-emerald-50 text-emerald-650 border border-emerald-100/50 font-bold";
    case "lost":
      return "bg-red-50 text-red-650 border border-red-105";
    default:
      return "bg-slate-50 text-slate-500 border border-slate-200/50";
  }
};

export default function LeadsPage() {
  const [leadsList, setLeadsList] = useState<LeadItem[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [inviteLoading, setInviteLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Drawer / Editing state
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    company: "",
    industry: "",
    budget: "",
    timeline: "",
    phone: "",
    message: ""
  });

  const fetchLeadsAndQuotes = useCallback(async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("novaryn_admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    
    try {
      // 1. Fetch leads
      const leadsRes = await fetch(`${apiUrl}/leads?per_page=100`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });

      if (leadsRes.status === 401) {
        localStorage.removeItem("novaryn_admin_token");
        localStorage.removeItem("novaryn_admin_user");
        window.location.href = "/login";
        return;
      }

      if (!leadsRes.ok) {
        throw new Error("Unable to retrieve CRM leads from the backend API.");
      }
      
      const leadsJson = await leadsRes.json();
      setLeadsList(leadsJson.data?.data || leadsJson.data || []);

      // 2. Fetch quotations (to link proposals)
      const quotesRes = await fetch(`${apiUrl}/pricing/quotations`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });

      if (quotesRes.ok) {
        const quotesJson = await quotesRes.json();
        setQuotations(quotesJson.data || []);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Connection failure. Make sure Laravel API is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeadsAndQuotes();
  }, [fetchLeadsAndQuotes]);

  // Update lead status
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
        // Update local list
        setLeadsList(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } catch (err) {
      console.error("Error updating lead status:", err);
    } finally {
      setActionLoading(null);
    }
  };

  // Dispatch schedule invite
  const handleSendInvite = async (lead: LeadItem) => {
    setInviteLoading(lead.id);
    const token = localStorage.getItem("novaryn_admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    try {
      const res = await fetch(`${apiUrl}/leads/${lead.id}/send-invite`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });

      if (!res.ok) {
        throw new Error("Failed to dispatch scheduling invitation email.");
      }

      alert(`Consultation schedule invite link sent successfully to ${lead.name}!`);
      fetchLeadsAndQuotes();
    } catch (err: any) {
      alert(err.message || "Failed to send invite email.");
    } finally {
      setInviteLoading(null);
    }
  };

  // Save edits from Detail Drawer
  const handleSaveEdits = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;

    setActionLoading(selectedLead.id);
    const token = localStorage.getItem("novaryn_admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    try {
      const res = await fetch(`${apiUrl}/leads/${selectedLead.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify(editForm)
      });

      if (!res.ok) {
        throw new Error("Failed to update lead details.");
      }

      const json = await res.json();
      const updated = json.data;

      // Update lists
      setLeadsList(prev => prev.map(l => l.id === selectedLead.id ? { ...l, ...updated } : l));
      setSelectedLead({ ...selectedLead, ...updated });
      setIsEditing(false);
    } catch (err: any) {
      alert(err.message || "Failed to save lead updates.");
    } finally {
      setActionLoading(null);
    }
  };

  // Select a lead for the drawer
  const handleSelectLead = (lead: LeadItem) => {
    setSelectedLead(lead);
    setIsEditing(false);
    setEditForm({
      company: lead.company || "",
      industry: lead.industry || "",
      budget: lead.budget || "",
      timeline: lead.timeline || "",
      phone: lead.phone || "",
      message: lead.message || ""
    });
  };

  // Map of active quotations by client email
  const leadQuotationMap = useMemo(() => {
    const map: Record<string, Quotation> = {};
    quotations.forEach((q) => {
      if (q.client_email) {
        map[q.client_email.toLowerCase().trim()] = q;
      }
    });
    return map;
  }, [quotations]);

  // Filters logic
  const filteredLeads = useMemo(() => {
    let result = [...leadsList];

    if (selectedFilter !== "all") {
      result = result.filter(lead => lead.status === selectedFilter);
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(lead => 
        lead.name.toLowerCase().includes(query) ||
        (lead.company && lead.company.toLowerCase().includes(query)) ||
        lead.email.toLowerCase().includes(query) ||
        (lead.industry && lead.industry.toLowerCase().includes(query))
      );
    }

    return result;
  }, [leadsList, selectedFilter, searchQuery]);

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const formatMeetingTime = (isoString: string | null) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Stats
  const stats = useMemo(() => {
    const total = leadsList.length;
    const won = leadsList.filter(l => l.status === "won").length;
    const activeProposals = leadsList.filter(l => l.status === "proposal_sent" || l.status === "meeting_scheduled").length;
    const rate = total > 0 ? Math.round((won / total) * 100) : 0;
    return { total, won, activeProposals, rate };
  }, [leadsList]);

  return (
    <div className="flex flex-col gap-6 text-left font-sans pb-12">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none">CRM Deals & Pipeline</h1>
          <p className="text-[13px] text-slate-500 mt-1.5 font-medium">Coordinate inquiries, consultations, custom quotation builders, and pipeline stages.</p>
        </div>
        <button
          onClick={fetchLeadsAndQuotes}
          disabled={loading}
          className="flex items-center gap-2 bg-[#059669] hover:bg-[#059669]/90 text-white font-semibold text-[11px] h-9 px-4 rounded-xl transition-all shadow-xs cursor-pointer select-none"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Sync Data</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-3.5 text-xs text-red-700 flex items-start gap-2.5 leading-relaxed">
          <ShieldAlert className="w-4.5 h-4.5 shrink-0 text-red-650 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Control Segment Toolbar */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 border-b border-slate-100 pb-4 mt-2">
        
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-1 bg-slate-50 border border-slate-200/50 p-1 rounded-xl w-fit">
          {statusFilters.map((filter) => {
            const isSelected = selectedFilter === filter.value;
            return (
              <button
                key={filter.value}
                onClick={() => setSelectedFilter(filter.value)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                  isSelected 
                    ? "bg-white text-slate-900 shadow-xs border border-slate-100" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search client or sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-56 bg-white rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 font-medium placeholder-slate-350"
            />
          </div>
        </div>
      </div>

      {/* ── 1. DESKTOP VIEW (hidden md:grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start) ── */}
      <div className="hidden md:grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">
        
        {/* Left Side: Table */}
        <div className="bg-white border border-slate-200/70 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px] text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-150 bg-slate-50/50 text-slate-400 uppercase tracking-wider font-bold text-[9px]">
                  <th className="py-3.5 px-6">Client Profile</th>
                  <th className="py-3.5 px-6">Contact Info</th>
                  <th className="py-3.5 px-6">Company / Quote Status</th>
                  <th className="py-3.5 px-6 text-center">Pipeline Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((lead) => {
                  const hasQuote = leadQuotationMap[lead.email.toLowerCase().trim()];
                  return (
                    <tr 
                      key={lead.id} 
                      onClick={() => handleSelectLead(lead)}
                      className={`hover:bg-slate-50/50 transition-all group cursor-pointer ${
                        selectedLead?.id === lead.id ? "bg-slate-50/70" : ""
                      }`}
                    >
                      {/* Avatar Profile */}
                      <td className="py-4 px-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center font-bold text-emerald-700 text-xs shrink-0 select-none">
                          {getInitials(lead.name)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 group-hover:text-slate-950 transition-colors">{lead.name}</div>
                          <div className="text-[11px] text-slate-400 font-medium mt-0.5 max-w-[200px] truncate">
                            {lead.message || "No project specs provided"}
                          </div>
                        </div>
                      </td>

                      {/* Contact Info */}
                      <td className="py-4 px-6">
                        <div className="font-medium text-slate-700">{lead.email}</div>
                        <div className="text-slate-400 text-[10px] mt-0.5 font-medium">{lead.phone || "No phone"}</div>
                      </td>

                      {/* Company & Quote linking status */}
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-800">{lead.company || "Individual / Startup"}</div>
                        <div className="flex gap-2 mt-1">
                          {hasQuote ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded uppercase tracking-wider">
                              Quote Active: {peso(hasQuote.build_total)}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-slate-50 text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded uppercase tracking-wider">
                              No Proposal Drafted
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stage Selector */}
                      <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                        {actionLoading === lead.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin text-emerald-600 mx-auto" />
                        ) : (
                          <select
                            value={lead.status}
                            onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                            className="px-2 py-1 rounded-lg border border-slate-200 bg-white font-bold text-[10px] text-slate-700 outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer shadow-xs"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="meeting_scheduled">Meeting Scheduled</option>
                            <option value="proposal_sent">Proposal Sent</option>
                            <option value="negotiation">Negotiation</option>
                            <option value="won font-bold">Won (Closed)</option>
                            <option value="lost">Lost</option>
                            <option value="archived">Archived</option>
                          </select>
                        )}
                      </td>

                    </tr>
                  );
                })}
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

        {/* Right Side: CRM Detailed Panel */}
        <div className="bg-white border border-slate-200/70 p-5 rounded-2xl shadow-xs text-slate-800 flex flex-col gap-4">
          {selectedLead ? (
            <div className="flex flex-col gap-4">
              
              {/* Profile card */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedLead.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Client Profile details</p>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* CRM Options panel */}
              {!isEditing ? (
                <div className="flex flex-col gap-4.5 text-xs">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Email Address</span>
                    <span className="font-semibold text-slate-800 break-all">{selectedLead.email}</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Phone Contact</span>
                    <span className="font-semibold text-slate-800">{selectedLead.phone || "None provided"}</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Company Name</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {selectedLead.company || "Individual / Startup"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Industry / Sector</span>
                      <span className="font-semibold text-slate-800">{selectedLead.industry || "Not specified"}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Budget target</span>
                      <span className="font-semibold text-slate-800">{selectedLead.budget || "Not specified"}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Project Description</span>
                    <p className="text-[11px] text-slate-655 bg-slate-50 p-2.5 border border-slate-100 rounded-lg italic leading-relaxed">
                      "{selectedLead.message || "No project notes provided"}"
                    </p>
                  </div>

                  {/* Booking schedule time */}
                  {selectedLead.meeting_date && (
                    <div className="bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-xl flex flex-col gap-1 text-[11px]">
                      <span className="font-bold text-emerald-800 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" /> Meeting Date Scheduled:
                      </span>
                      <span className="text-emerald-950 font-bold ml-5">
                        {formatMeetingTime(selectedLead.meeting_date)}
                      </span>
                      {selectedLead.notes && (
                        <span className="text-[10px] text-slate-500 font-semibold ml-5">
                          Format/Notes: {selectedLead.notes}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Connected Proposal badge */}
                  {leadQuotationMap[selectedLead.email.toLowerCase().trim()] ? (
                    <div className="bg-blue-50/55 border border-blue-100 p-3 rounded-xl flex flex-col gap-2">
                      <div>
                        <span className="text-[9px] font-bold uppercase text-blue-500">Active quotation</span>
                        <p className="font-black text-blue-900 text-sm mt-0.5">
                          {peso(leadQuotationMap[selectedLead.email.toLowerCase().trim()].build_total)} build
                        </p>
                      </div>
                      <a
                        href="/dashboard/proposals"
                        className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] uppercase tracking-wide transition-all text-center"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Open Contract Draft</span>
                      </a>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200/50 p-3 rounded-xl flex flex-col gap-2 text-center">
                      <span className="text-[10px] text-slate-400 font-bold">No Custom Quote Found</span>
                      <a
                        href={`/dashboard/pricing-engine?name=${encodeURIComponent(selectedLead.name)}&email=${encodeURIComponent(selectedLead.email)}&phone=${encodeURIComponent(selectedLead.phone || "")}&address=${encodeURIComponent(selectedLead.company || "")}`}
                        className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-805 text-white font-bold text-[10px] uppercase tracking-wide transition-all text-center"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Build Custom Quote</span>
                      </a>
                    </div>
                  )}

                  {/* Operational actions */}
                  <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                    {!selectedLead.meeting_date && (
                      <button
                        onClick={() => handleSendInvite(selectedLead)}
                        disabled={inviteLoading === selectedLead.id}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        {inviteLoading === selectedLead.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
                        <span>Email Scheduling Invite</span>
                      </button>
                    )}
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl transition-all cursor-pointer"
                    >
                      Edit Client Details
                    </button>
                  </div>

                </div>
              ) : (
                /* Edit Lead form inside drawer */
                <form onSubmit={handleSaveEdits} className="flex flex-col gap-4 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Company / Organization</label>
                    <input
                      type="text"
                      value={editForm.company}
                      onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                      placeholder="e.g. Acme Corporation"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-450 focus:border-emerald-450"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Phone / Contact</label>
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      placeholder="e.g. 0917 123 4567"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-450 focus:border-emerald-450"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Industry / Sector</label>
                    <input
                      type="text"
                      value={editForm.industry}
                      onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })}
                      placeholder="e.g. Health & Clinics"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-450 focus:border-emerald-450"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Budget Target</label>
                      <input
                        type="text"
                        value={editForm.budget}
                        onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })}
                        placeholder="e.g. ₱50k - ₱100k"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-450 focus:border-emerald-450"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Timeline Target</label>
                      <input
                        type="text"
                        value={editForm.timeline}
                        onChange={(e) => setEditForm({ ...editForm, timeline: e.target.value })}
                        placeholder="e.g. 1-2 Months"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-450 focus:border-emerald-450"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Project Scope Description</label>
                    <textarea
                      rows={3}
                      value={editForm.message}
                      onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-450 focus:border-emerald-450 resize-none font-sans"
                    />
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-805 text-white font-bold text-xs cursor-pointer text-center"
                    >
                      Save Updates
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs cursor-pointer text-center"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center text-slate-400 gap-2">
              <Users className="w-8 h-8 text-slate-300" />
              <span className="text-xs font-semibold">Select a lead client from the table to view pipeline tracking metrics, edit company details, or invite them to book.</span>
            </div>
          )}
        </div>

      </div>

      {/* ── 2. MOBILE VIEW (block md:hidden flex flex-col gap-4) ── */}
      <div className="block md:hidden flex flex-col gap-4">
        
        {/* Client cards stack instead of side-scrolling table */}
        <div className="flex flex-col gap-3">
          {filteredLeads.map((lead) => {
            const hasQuote = leadQuotationMap[lead.email.toLowerCase().trim()];
            return (
              <div
                key={lead.id}
                onClick={() => handleSelectLead(lead)}
                className={`bg-white border p-4.5 rounded-2xl shadow-xs text-left cursor-pointer flex flex-col gap-3.5 transition-colors ${
                  selectedLead?.id === lead.id ? "border-emerald-500 bg-emerald-50/5" : "border-slate-200"
                }`}
              >
                {/* Header: Avatar, Name, Pipeline Stage */}
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center font-bold text-emerald-700 text-xs shrink-0 select-none">
                      {getInitials(lead.name)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">{lead.name}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{lead.company || "Individual"}</p>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <span className={`inline-block text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${getStatusBadge(lead.status)}`}>
                    {lead.status.replace("_", " ")}
                  </span>
                </div>

                <div className="h-[1px] bg-slate-100" />

                {/* Sub details: email, budget target */}
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="text-slate-450 truncate max-w-[170px]">{lead.email}</span>
                  <span className="text-slate-700">{lead.budget || "TBD Budget"}</span>
                </div>
              </div>
            );
          })}

          {filteredLeads.length === 0 && !loading && (
            <div className="py-12 text-center text-slate-400 text-xs font-semibold">
              No matching client records found.
            </div>
          )}
        </div>

        {/* Slide-Up Bottom Drawer Sheet on Mobile */}
        {selectedLead && (
          <>
            {/* Backdrop Overlay */}
            <div 
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] z-50 transition-opacity"
              onClick={() => setSelectedLead(null)}
            />

            {/* Bottom Drawer container */}
            <div className="fixed inset-x-0 bottom-0 bg-white border-t border-slate-200 shadow-2xl rounded-t-3xl z-55 max-h-[85vh] transition-transform duration-300 transform translate-y-0 text-left flex flex-col overflow-hidden">
              <style>{`
                .no-scrollbar::-webkit-scrollbar {
                  display: none;
                }
                .no-scrollbar {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
              `}</style>

              {/* Fixed Header */}
              <div className="p-6 pb-3 border-b border-slate-100 flex-shrink-0 relative bg-white z-10">
                {/* Drag Handle Bar */}
                <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-4" />

                {/* Close Button */}
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-105 text-slate-400 cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>

                <div>
                  <h3 className="text-base font-black text-slate-900 leading-snug">{selectedLead.name}</h3>
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">Client Profile Details</span>
                </div>
              </div>

              {/* Scrollable Body Content */}
              <div className="p-6 pt-4 flex-1 overflow-y-auto no-scrollbar pb-10">
                {!isEditing ? (
                  <div className="flex flex-col gap-4 text-xs">
                    
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Email Address</span>
                      <span className="font-semibold text-slate-800 break-all">{selectedLead.email}</span>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Phone Contact</span>
                      <span className="font-semibold text-slate-800">{selectedLead.phone || "None provided"}</span>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Company Name</span>
                      <span className="font-semibold text-slate-850 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {selectedLead.company || "Individual / Startup"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Industry / Sector</span>
                        <span className="font-semibold text-slate-800">{selectedLead.industry || "Not specified"}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Budget Target</span>
                        <span className="font-semibold text-slate-800">{selectedLead.budget || "Not specified"}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Project Description</span>
                      <p className="text-[11px] text-slate-655 bg-slate-50 p-3.5 border border-slate-100 rounded-lg italic leading-relaxed font-medium">
                        "{selectedLead.message || "No project notes provided"}"
                      </p>
                    </div>

                    {selectedLead.meeting_date && (
                      <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl flex flex-col gap-1 text-[11px]">
                        <span className="font-bold text-emerald-800 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" /> Meeting Date Scheduled:
                        </span>
                        <span className="text-emerald-950 font-bold ml-5">
                          {formatMeetingTime(selectedLead.meeting_date)}
                        </span>
                      </div>
                    )}

                    {/* Proposal Badge */}
                    {leadQuotationMap[selectedLead.email.toLowerCase().trim()] ? (
                      <div className="bg-blue-50/55 border border-blue-100 p-3 rounded-xl flex flex-col gap-2">
                        <div>
                          <span className="text-[9px] font-bold uppercase text-blue-505">Active quotation</span>
                          <p className="font-black text-blue-900 text-sm mt-0.5">
                            {peso(leadQuotationMap[selectedLead.email.toLowerCase().trim()].build_total)} build
                          </p>
                        </div>
                        <a
                          href="/dashboard/proposals"
                          className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] uppercase tracking-wide transition-all text-center"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Open Contract Draft</span>
                        </a>
                      </div>
                    ) : (
                      <div className="bg-slate-50 border border-slate-200/50 p-3 rounded-xl flex flex-col gap-2 text-center">
                        <span className="text-[10px] text-slate-400 font-bold">No Custom Quote Found</span>
                        <a
                          href={`/dashboard/pricing-engine?name=${encodeURIComponent(selectedLead.name)}&email=${encodeURIComponent(selectedLead.email)}&phone=${encodeURIComponent(selectedLead.phone || "")}&address=${encodeURIComponent(selectedLead.company || "")}`}
                          className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-805 text-white font-bold text-[10px] uppercase tracking-wide transition-all text-center"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Build Custom Quote</span>
                        </a>
                      </div>
                    )}

                    {/* Operational action toggles */}
                    <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                      {!selectedLead.meeting_date && (
                        <button
                          onClick={() => handleSendInvite(selectedLead)}
                          disabled={inviteLoading === selectedLead.id}
                          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5"
                        >
                          {inviteLoading === selectedLead.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
                          <span>Email Scheduling Invite</span>
                        </button>
                      )}
                      <button
                        onClick={() => setIsEditing(true)}
                        className="w-full py-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                      >
                        Edit Client Details
                      </button>

                      {/* Dropdown status update for Mobile */}
                      <div className="flex flex-col gap-1 mt-1">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Update status pipeline</label>
                        <select
                          value={selectedLead.status}
                          onChange={(e) => handleUpdateStatus(selectedLead.id, e.target.value)}
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="meeting_scheduled">Meeting Scheduled</option>
                          <option value="proposal_sent">Proposal Sent</option>
                          <option value="negotiation">Negotiation</option>
                          <option value="won">Won (Closed)</option>
                          <option value="lost">Lost</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                    </div>

                  </div>
                ) : (
                  /* Edit form inside drawer on Mobile */
                  <form onSubmit={handleSaveEdits} className="flex flex-col gap-4 text-xs">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Company / Organization</label>
                      <input
                        type="text"
                        value={editForm.company}
                        onChange={(e) => setEditForm({ ...editForm, company: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-450 focus:border-emerald-450"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Phone / Contact</label>
                      <input
                        type="text"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-450 focus:border-emerald-450"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Industry / Sector</label>
                      <input
                        type="text"
                        value={editForm.industry}
                        onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-450 focus:border-emerald-450"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Budget Target</label>
                        <input
                          type="text"
                          value={editForm.budget}
                          onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-450 focus:border-emerald-450"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Timeline Target</label>
                        <input
                          type="text"
                          value={editForm.timeline}
                          onChange={(e) => setEditForm({ ...editForm, timeline: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-450 focus:border-emerald-450"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Project Scope Description</label>
                      <textarea
                        rows={3}
                        value={editForm.message}
                        onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-450 focus:border-emerald-450 resize-none font-sans"
                      />
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-805 text-white font-bold text-xs"
                      >
                        Save Updates
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>

            </div>
          </>
        )}

      </div>

      {/* Applications Pipeline Summary */}
      <div className="mt-4 flex flex-col gap-4">
        <h3 className="text-[13px] font-semibold text-slate-900 tracking-tight">Leads Conversion & Pipeline Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white border border-slate-200/70 p-5 rounded-2xl text-left shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Total Applications</span>
            <div className="text-2xl font-black text-slate-800 mt-1.5">{stats.total}</div>
          </div>

          <div className="bg-white border border-slate-200/70 p-5 rounded-2xl text-left shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Proposals Active</span>
            <div className="text-2xl font-black text-slate-800 mt-1.5">{stats.activeProposals}</div>
          </div>

          <div className="bg-white border border-slate-200/70 p-5 rounded-2xl text-left shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Deals Closed Won</span>
            <div className="text-2xl font-black text-slate-800 mt-1.5">{stats.won}</div>
          </div>

          <div className="bg-white border border-slate-200/70 p-5 rounded-2xl text-left shadow-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Conversion Rate</span>
            <div className="text-2xl font-black text-[#059669] mt-1.5">{stats.rate}%</div>
          </div>

        </div>
      </div>

    </div>
  );
}
