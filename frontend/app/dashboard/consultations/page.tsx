"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { 
  Calendar, Video, Clock, Check, AlertCircle, RefreshCw, 
  Mail, Phone, ExternalLink, Edit3, Shield, Info, CheckCircle2, Copy
} from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: string;
  meeting_date: string | null;
  notes: string | null;
  created_at: string;
}

// Module-level cache
let _cachedLeads: Lead[] = [];
let _consultLoaded = false;

export default function SchedulerPage() {
  const [leads, setLeads] = useState<Lead[]>(_cachedLeads);
  const [loading, setLoading] = useState(!_consultLoaded);
  const [error, setError] = useState("");
  
  // Tab control
  const [activeTab, setActiveTab] = useState<"pending" | "scheduled" | "all">("pending");

  // Selected lead for scheduler modal
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [meetingDateInput, setMeetingDateInput] = useState("");
  const [meetingNotesInput, setMeetingNotesInput] = useState("");
  const [meetingStatusInput, setMeetingStatusInput] = useState("meeting_scheduled");
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Loading state map for sending Resend invites
  const [inviteLoadingMap, setInviteLoadingMap] = useState<Record<string, boolean>>({});

  // Fetch leads list
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("novaryn_admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    try {
      const res = await fetch(`${apiUrl}/leads?per_page=100`, {
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
        throw new Error("Unable to retrieve consultation leads.");
      }

      const json = await res.json();
      const data = json.data?.data || [];
      _cachedLeads = data;
      _consultLoaded = true;
      setLeads(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load consultations.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Trigger dispatching Resend booking invite email to client
  const handleSendInvite = async (lead: Lead) => {
    setInviteLoadingMap((prev) => ({ ...prev, [lead.id]: true }));
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

      alert(`Consultation schedule invite sent successfully to ${lead.name} (${lead.email})!`);
      fetchLeads();
    } catch (err: any) {
      alert(err.message || "Failed to send email.");
    } finally {
      setInviteLoadingMap((prev) => ({ ...prev, [lead.id]: false }));
    }
  };

  // Copy booking link to clipboard
  const handleCopyLink = (email: string) => {
    const link = `${window.location.origin}/schedule-meeting?email=${encodeURIComponent(email)}`;
    navigator.clipboard.writeText(link);
    alert("Booking link copied to clipboard!");
  };

  // Open Scheduler panel
  const handleOpenScheduler = (lead: Lead) => {
    setSelectedLead(lead);
    if (lead.meeting_date) {
      const d = new Date(lead.meeting_date);
      const formatted = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setMeetingDateInput(formatted);
    } else {
      setMeetingDateInput("");
    }
    setMeetingNotesInput(lead.notes || "");
    setMeetingStatusInput(lead.status || "meeting_scheduled");
  };

  // Submit Scheduler Updates
  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;

    setSaveLoading(true);
    setSuccessMsg("");
    const token = localStorage.getItem("novaryn_admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    try {
      const res = await fetch(`${apiUrl}/leads/${selectedLead.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          meeting_date: meetingDateInput ? new Date(meetingDateInput).toISOString() : null,
          notes: meetingNotesInput,
          status: meetingStatusInput
        })
      });

      if (!res.ok) {
        throw new Error("Failed to save meeting parameters.");
      }

      setSuccessMsg(`Consultation details updated successfully.`);
      setTimeout(() => {
        setSuccessMsg("");
        setSelectedLead(null);
      }, 1500);

      fetchLeads();
    } catch (err: any) {
      alert(err.message || "Failed to save meeting schedule.");
    } finally {
      setSaveLoading(false);
    }
  };

  // Quick mark status toggle (completed/pending)
  const handleToggleCompleted = async (lead: Lead) => {
    const token = localStorage.getItem("novaryn_admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    const nextStatus = lead.status === "completed" ? "new" : "completed";

    try {
      const res = await fetch(`${apiUrl}/leads/${lead.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          status: nextStatus
        })
      });

      if (!res.ok) {
        throw new Error("Failed to toggle status.");
      }

      fetchLeads();
    } catch (err: any) {
      alert(err.message || "Failed to update status.");
    }
  };

  // Filter list based on tabs
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      if (activeTab === "pending") {
        return l.status !== "completed" && l.status !== "archived" && !l.meeting_date;
      }
      if (activeTab === "scheduled") {
        return l.status !== "completed" && l.status !== "archived" && l.meeting_date;
      }
      return true; // show all
    });
  }, [leads, activeTab]);

  // Date formatting helpers
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
    return {
      newInquiries: leads.filter((l) => !l.meeting_date && l.status !== "completed").length,
      scheduled: leads.filter((l) => l.meeting_date && l.status !== "completed").length,
      completed: leads.filter((l) => l.status === "completed").length
    };
  }, [leads]);

  if (loading && leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-[12px] text-slate-500 font-medium">Loading live consultations data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-left font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none">Consultations</h1>
          <p className="text-[13px] text-slate-500 mt-1.5 font-medium">Coordinate scheduled video calls and review client inquiry notes.</p>
        </div>
        <button
          onClick={fetchLeads}
          className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-bold text-slate-650 rounded-xl transition-all shadow-xs cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/70 p-4 rounded-2xl shadow-xs">
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">New Inquiries</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{stats.newInquiries}</p>
        </div>
        <div className="bg-white border border-slate-200/70 p-4 rounded-2xl shadow-xs">
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Scheduled calls</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{stats.scheduled}</p>
        </div>
        <div className="bg-white border border-slate-200/70 p-4 rounded-2xl shadow-xs">
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Completed Sessions</p>
          <p className="text-2xl font-black text-slate-500 mt-1">{stats.completed}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Agenda Lists */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
            
            {/* Tabs */}
            <div className="flex border-b border-slate-100 pb-1 gap-4">
              <button
                onClick={() => setActiveTab("pending")}
                className={`pb-2 text-[12px] font-bold transition-all relative cursor-pointer ${
                  activeTab === "pending" ? "text-slate-900 border-b-2 border-emerald-500" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                New Inquiries ({stats.newInquiries})
              </button>
              <button
                onClick={() => setActiveTab("scheduled")}
                className={`pb-2 text-[12px] font-bold transition-all relative cursor-pointer ${
                  activeTab === "scheduled" ? "text-slate-900 border-b-2 border-emerald-500" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Scheduled ({stats.scheduled})
              </button>
              <button
                onClick={() => setActiveTab("all")}
                className={`pb-2 text-[12px] font-bold transition-all relative cursor-pointer ${
                  activeTab === "all" ? "text-slate-900 border-b-2 border-emerald-500" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                All Records ({leads.length})
              </button>
            </div>

            {/* List */}
            {filteredLeads.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center text-slate-400">
                <Calendar className="w-8 h-8 text-slate-200 mb-2" />
                <p className="text-xs font-semibold">No records match this filter</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredLeads.map((lead) => (
                  <div 
                    key={lead.id} 
                    className={`p-4 rounded-xl border transition-all flex flex-col gap-3.5 ${
                      lead.status === "completed" 
                        ? "bg-slate-50/50 border-slate-200/50 opacity-70" 
                        : "bg-white border-slate-200 hover:border-slate-350"
                    }`}
                  >
                    {/* Header Area (Responsive: flex-col sm:flex-row) */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      
                      {/* Avatar/Name Column */}
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-650 shrink-0">
                          <Video className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-[13px] font-bold text-slate-900 leading-snug">{lead.name}</h4>
                            <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                              lead.status === "new" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                              lead.status === "contacted" ? "bg-amber-50 text-amber-700 border border-amber-100" :
                              lead.status === "meeting_scheduled" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                              "bg-slate-100 text-slate-700"
                            }`}>
                              {lead.status.replace("_", " ")}
                            </span>
                          </div>
                          
                          {/* Contact detail subtext (Desktop Only) */}
                          <div className="hidden sm:flex flex-wrap gap-x-3 gap-y-1 items-center text-[10px] text-slate-450 mt-1 font-semibold uppercase">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400" />
                              {lead.email}
                            </span>
                            {lead.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-slate-400" />
                                {lead.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Contact detail subtext (Mobile Only) */}
                      <div className="flex sm:hidden flex-col gap-1 text-[11px] text-slate-500 font-medium pl-1">
                        <div className="flex items-center gap-2 break-all">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{lead.email}</span>
                        </div>
                        {lead.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{lead.phone}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons Row */}
                      <div className="flex items-center gap-2 sm:justify-end mt-2 sm:mt-0 pt-2.5 sm:pt-0 border-t border-slate-100 sm:border-t-0">
                        {/* Invite Link trigger */}
                        {!lead.meeting_date && (
                          <div className="flex gap-1.5 flex-1 sm:flex-initial">
                            <button
                              onClick={() => handleSendInvite(lead)}
                              disabled={inviteLoadingMap[lead.id]}
                              className="flex-1 sm:flex-initial px-3 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white disabled:bg-slate-100 disabled:text-slate-400 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                              title="Email Scheduling Invite Link"
                            >
                              {inviteLoadingMap[lead.id] ? (
                                <RefreshCw className="w-3 h-3 animate-spin" />
                              ) : (
                                <Mail className="w-3 h-3" />
                              )}
                              <span>Invite to Book</span>
                            </button>
                            <button
                              onClick={() => handleCopyLink(lead.email)}
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 cursor-pointer flex items-center justify-center"
                              title="Copy Booking Link"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                        <button
                          onClick={() => handleOpenScheduler(lead)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-550 hover:bg-slate-50 cursor-pointer flex items-center justify-center"
                          title="Configure Parameters Manually"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleCompleted(lead)}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer flex items-center justify-center ${
                            lead.status === "completed"
                              ? "bg-emerald-50 border-emerald-200 text-emerald-650"
                              : "bg-white border-slate-200 text-slate-400 hover:border-slate-350 hover:bg-slate-50"
                          }`}
                          title={lead.status === "completed" ? "Mark Pending" : "Mark Completed"}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>

                    {/* Description Text */}
                    {lead.message && (
                      <p className="text-[11px] text-slate-450 bg-slate-50/50 p-2.5 rounded border border-slate-100 leading-relaxed italic">
                        "{lead.message}"
                      </p>
                    )}

                    {/* Scheduled Info Block */}
                    {lead.meeting_date && (
                      <div className="bg-emerald-50/50 border border-emerald-100/60 p-2.5 rounded-lg flex items-center justify-between text-[11px] font-sans">
                        <div className="flex items-center gap-2 text-emerald-800">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Scheduled: <strong>{formatMeetingTime(lead.meeting_date)}</strong></span>
                        </div>
                        {lead.notes && (
                          <span className="text-[10px] text-slate-500 max-w-[300px] truncate" title={lead.notes}>
                            Notes/Platform: {lead.notes}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Dynamic System Info Check */}
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
            <h3 className="text-[13px] font-semibold text-slate-800 tracking-tight">Active Booking Gateway</h3>
            
            <div className="border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center py-6 text-center text-slate-400 gap-3">
              <Shield className="w-7 h-7 text-emerald-600" />
              <div>
                <span className="text-xs font-semibold text-slate-800">Scheduling Portal Active</span>
                <p className="text-[10px] text-slate-400 max-w-[200px] mt-1 leading-relaxed">
                  Clients receive email invite links pointing directly to the secure booking portal at:
                </p>
                <div className="bg-slate-50 border border-slate-200 px-2 py-1.5 rounded-lg mt-2 text-[9px] font-mono text-slate-600 select-all select-text font-bold">
                  /schedule-meeting
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-xs flex flex-col gap-3">
            <h3 className="text-[13px] font-semibold text-slate-800 tracking-tight">System Status Check</h3>
            <div className="flex flex-col gap-2.5 text-[11px] leading-relaxed text-slate-500 font-sans">
              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                <span className="font-semibold text-slate-600">Production Domain</span>
                <span className="text-slate-900 font-bold">novaryn.tech</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                <span className="font-semibold text-slate-600">Resend Mailer Gateway</span>
                <span className="text-emerald-700 font-bold">Active (Env Ready)</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-1.5">
                <span className="font-semibold text-slate-600">Verification Router</span>
                <span className="text-emerald-700 font-bold">Public (Sanctum Free)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scheduler Overlay Modal */}
      {selectedLead && (
        <>
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] z-50 transition-opacity"
            onClick={() => setSelectedLead(null)}
          />

          {/* Unified Centered Modal */}
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm sm:max-w-md rounded-2xl border border-slate-150 p-5 sm:p-6 shadow-2xl relative text-left">
              <button
                onClick={() => setSelectedLead(null)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              <h3 className="text-sm font-bold text-slate-800 tracking-tight">Configure Parameters</h3>
              <p className="text-xs text-slate-500 font-medium mt-1 mb-4">Set manual consultation parameters for <span className="font-semibold text-slate-700">{selectedLead.name}</span>.</p>

              {successMsg && (
                <div className="bg-emerald-50 border border-emerald-250 p-3 rounded-lg text-emerald-850 text-xs font-medium flex items-center gap-2 mb-4 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveSchedule} className="flex flex-col gap-4 font-sans text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Meeting Date & Time</label>
                  <input
                    type="datetime-local"
                    required
                    value={meetingDateInput}
                    onChange={(e) => setMeetingDateInput(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-450 focus:border-emerald-450 bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Meeting Link / Address</label>
                  <input
                    type="text"
                    placeholder="e.g. https://meet.google.com/abc-defg-hij"
                    value={meetingNotesInput}
                    onChange={(e) => setMeetingNotesInput(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-450 focus:border-emerald-450 font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Lead Status</label>
                  <select
                    value={meetingStatusInput}
                    onChange={(e) => setMeetingStatusInput(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-emerald-450 focus:border-emerald-450 bg-white"
                  >
                    <option value="new">New Inquiry</option>
                    <option value="contacted">Awaiting Client Booking</option>
                    <option value="meeting_scheduled">Meeting Scheduled</option>
                    <option value="completed">Completed / Finished</option>
                    <option value="proposal_sent">Proposal Sent</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="won">Lead Won</option>
                    <option value="lost">Lead Lost</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={saveLoading}
                  className="w-full py-3 mt-2 rounded-xl bg-slate-900 hover:bg-slate-850 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {saveLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Save Consultation Settings</span>
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function X(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
