"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { 
  DollarSign, FileText, CheckCircle, RefreshCw, Plus, X, 
  Search, Filter, ShieldAlert, Check, Calendar, Mail, FileUp
} from "lucide-react";

interface InvoiceItem {
  id: string;
  invoice_number: string;
  client_name: string;
  client_email: string;
  amount: number;
  type: "downpayment" | "monthly_sla" | "full_payment" | "other";
  status: "paid" | "unpaid" | "overdue";
  due_date: string;
  paid_at: string | null;
  project_id: string | null;
  created_at: string;
}

interface ProjectItem {
  id: string;
  title: string;
  client_name: string | null;
}

export default function BillingPage() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Invoicing creation modal
  const [isCreating, setIsCreating] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState<InvoiceItem["type"]>("other");
  const [status, setStatus] = useState<InvoiceItem["status"]>("unpaid");
  const [dueDate, setDueDate] = useState("");
  const [projectId, setProjectId] = useState("");

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Fetch invoices and projects
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("novaryn_admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    try {
      // 1. Fetch invoices
      const invRes = await fetch(`${apiUrl}/invoices?per_page=100`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });

      if (invRes.status === 401) {
        localStorage.removeItem("novaryn_admin_token");
        localStorage.removeItem("novaryn_admin_user");
        window.location.href = "/login";
        return;
      }

      if (!invRes.ok) {
        throw new Error("Unable to retrieve invoice ledger entries.");
      }

      const invJson = await invRes.json();
      setInvoices(invJson.data?.data || invJson.data || []);

      // 2. Fetch projects (for invoice binding selection dropdown)
      const projRes = await fetch(`${apiUrl}/projects`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });

      if (projRes.ok) {
        const projJson = await projRes.json();
        setProjects(projJson.data || []);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to sync billing data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle invoice status change directly (Mark Paid/Unpaid)
  const handleToggleStatus = async (invoice: InvoiceItem) => {
    setActionLoading(invoice.id);
    const token = localStorage.getItem("novaryn_admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    const nextStatus = invoice.status === "paid" ? "unpaid" : "paid";

    try {
      const res = await fetch(`${apiUrl}/invoices/${invoice.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify({
          status: nextStatus
        })
      });

      if (!res.ok) {
        throw new Error("Failed to change invoice status.");
      }

      // Update local state directly
      setInvoices(prev => prev.map(inv => inv.id === invoice.id ? { ...inv, status: nextStatus } : inv));
    } catch (err: any) {
      alert(err.message || "Failed to update ledger.");
    } finally {
      setActionLoading(null);
    }
  };

  // Submit invoice generator form
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || amount <= 0 || !dueDate) return;

    setModalLoading(true);
    const token = localStorage.getItem("novaryn_admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    const payload = {
      client_name: clientName,
      client_email: clientEmail,
      amount: parseInt(amount as any, 10),
      type,
      status,
      due_date: dueDate,
      project_id: projectId || null
    };

    try {
      const res = await fetch(`${apiUrl}/invoices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Failed to record new invoice.");
      }

      alert("Invoice logged inside corporate ledger!");
      setIsCreating(false);
      fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to generate invoice.");
    } finally {
      setModalLoading(false);
    }
  };

  // Safe formatting
  const peso = (n: number) =>
    "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 0 });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  // Filters logic
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const search = searchQuery.toLowerCase().trim();
      const matchesSearch = !search || 
        inv.invoice_number.toLowerCase().includes(search) || 
        inv.client_name.toLowerCase().includes(search) || 
        inv.client_email.toLowerCase().includes(search);

      const matchesStatus = statusFilter === "all" || inv.status === statusFilter;
      const matchesType = typeFilter === "all" || inv.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [invoices, searchQuery, statusFilter, typeFilter]);

  if (loading && invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-[12px] text-slate-500 font-medium font-sans">Syncing ledger records from database...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-left font-sans pb-12">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none">Billing Ledger</h1>
          <p className="text-[13px] text-slate-500 mt-1.5 font-medium">Review invoice receipts, record settle dates, and verify active project transactions.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-805 text-white font-bold text-[11px] rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Invoice</span>
          </button>
          <button
            onClick={fetchData}
            className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-bold text-slate-655 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-3.5 text-xs text-red-700 flex items-start gap-2.5 leading-relaxed">
          <ShieldAlert className="w-4.5 h-4.5 shrink-0 text-red-650 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Search & Filter bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoice number, client name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-800 placeholder-slate-450 font-sans"
          />
        </div>
        
        <div className="flex gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs font-bold text-slate-655 cursor-pointer shadow-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="overdue">Overdue</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs font-bold text-slate-655 cursor-pointer shadow-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
          >
            <option value="all">All Types</option>
            <option value="downpayment">Downpayments</option>
            <option value="monthly_sla">Monthly SLAs</option>
            <option value="full_payment">Full Payments</option>
            <option value="other">Other Fees</option>
          </select>
        </div>
      </div>

      {/* Invoice list card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        
        {/* Desktop Table View (hidden on mobile) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-[13px] text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 uppercase tracking-wider font-bold text-[9px]">
                <th className="py-3.5 px-6">Invoice ID</th>
                <th className="py-3.5 px-6">Client Installation</th>
                <th className="py-3.5 px-6">Billing Type</th>
                <th className="py-3.5 px-6">Amount</th>
                <th className="py-3.5 px-6">Due Date</th>
                <th className="py-3.5 px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/20 transition-colors">
                  <td className="py-4 px-6 font-semibold font-mono text-xs text-slate-700">{inv.invoice_number}</td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-slate-900 leading-none">{inv.client_name}</div>
                    <span className="text-[10px] text-slate-400 font-medium mt-1 inline-block">{inv.client_email}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-[9px] font-extrabold tracking-wider px-2 py-0.5 bg-slate-50 border border-slate-200/60 text-slate-500 uppercase rounded">
                      {inv.type.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-black text-slate-900">{peso(inv.amount)}</td>
                  <td className="py-4 px-6 text-slate-550 font-bold text-xs">
                    {formatDate(inv.due_date)}
                    {inv.paid_at && (
                      <span className="block text-[8px] text-emerald-700 font-extrabold uppercase mt-0.5">
                        Paid: {formatDate(inv.paid_at)}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                    {actionLoading === inv.id ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-650 mx-auto" />
                    ) : (
                      <button
                        onClick={() => handleToggleStatus(inv)}
                        className={`inline-block text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full cursor-pointer hover:scale-105 active:scale-95 transition-all ${
                          inv.status === "paid" ? "bg-emerald-50 text-emerald-800 border border-emerald-100" :
                          inv.status === "unpaid" ? "bg-blue-50 text-blue-800 border border-blue-100" :
                          "bg-red-50 text-red-800 border border-red-100"
                        }`}
                        title="Click to toggle Paid / Unpaid status"
                      >
                        {inv.status}
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {filteredInvoices.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400 font-semibold leading-relaxed">
                    No transactions match these ledger filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Rich Card List View (hidden on desktop) */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredInvoices.map((inv) => (
            <div key={inv.id} className="p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-mono text-[11px] font-bold text-slate-400">{inv.invoice_number}</p>
                  <p className="font-bold text-slate-800 text-[14px] mt-0.5 truncate">{inv.client_name}</p>
                  <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">{inv.client_email}</p>
                </div>
                <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                  {actionLoading === inv.id ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-650" />
                  ) : (
                    <button
                      onClick={() => handleToggleStatus(inv)}
                      className={`text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full transition-all active:scale-95 ${
                        inv.status === "paid" ? "bg-emerald-50 text-emerald-800 border border-emerald-100" :
                        inv.status === "unpaid" ? "bg-blue-50 text-blue-800 border border-blue-100" :
                        "bg-red-50 text-red-800 border border-red-100"
                      }`}
                    >
                      {inv.status}
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-55">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Fee Type</span>
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide bg-slate-50 border border-slate-200/50 px-1.5 py-0.5 rounded w-fit font-sans">
                    {inv.type.replace("_", " ")}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 text-right">
                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Billing Amount</span>
                  <span className="font-black text-slate-900 text-[14px]">{peso(inv.amount)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] bg-slate-50/50 p-2 rounded-xl">
                <div className="flex items-center gap-1 text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-450 shrink-0" />
                  <span>Due: <span className="font-bold">{formatDate(inv.due_date)}</span></span>
                </div>
                {inv.paid_at && (
                  <span className="text-[9px] text-emerald-700 font-bold uppercase">
                    Paid: {formatDate(inv.paid_at)}
                  </span>
                )}
              </div>
            </div>
          ))}

          {filteredInvoices.length === 0 && !loading && (
            <div className="py-16 text-center text-slate-400 font-semibold text-xs leading-relaxed">
              No transactions match these ledger filters.
            </div>
          )}
        </div>
      </div>

      {/* Invoice creation bottom sheet (mobile) / centered modal (desktop) */}
      {isCreating && (
        <>
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 transition-opacity animate-fade-in"
            onClick={() => setIsCreating(false)}
          />

          {/* Modal / Sheet Container */}
          <div className="fixed inset-x-0 bottom-0 sm:inset-0 z-[60] sm:flex sm:items-center sm:justify-center sm:p-4">
            <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl border-t sm:border border-slate-200 shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh] animate-slide-up sm:animate-scale-up">
              
              {/* Drag Handle on Mobile */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 bg-slate-200 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                    <FileUp className="w-4.5 h-4.5 text-slate-500 shrink-0" />
                    <span>Log Corporate Invoice</span>
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Manually record a setup fee, SLA payment, or support invoice.</p>
                </div>
                <button
                  onClick={() => setIsCreating(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer transition-colors"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto p-5 no-scrollbar">
                <form onSubmit={handleCreateInvoice} className="flex flex-col gap-4 text-xs font-sans">
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-450">Client / Company Name</label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Juan Dela Cruz"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-450 focus:border-emerald-450 text-[12px] font-medium"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-455">Client Email</label>
                    <input
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="e.g. juan@paddleyard.ph"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-450 focus:border-emerald-450 text-[12px] font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-450">Billing Amount (₱)</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={amount || ""}
                        onChange={(e) => setAmount(parseInt(e.target.value, 10) || 0)}
                        placeholder="e.g. 5000"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-450 focus:border-emerald-450 text-[12px] font-medium"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-450">Payment Due Date</label>
                      <input
                        type="date"
                        required
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-450 focus:border-emerald-450 text-[12px] font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-450">Billing Type</label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-450 focus:border-emerald-450 text-[12px] font-semibold cursor-pointer"
                      >
                        <option value="downpayment">Setup Downpayment</option>
                        <option value="monthly_sla">Monthly SLA Support</option>
                        <option value="full_payment">Full Setup Fee Payment</option>
                        <option value="other">Other custom charges</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-455">Initial Status</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-450 focus:border-emerald-450 text-[12px] font-semibold cursor-pointer"
                      >
                        <option value="unpaid">Unpaid / Pending</option>
                        <option value="paid">Paid / Settled</option>
                        <option value="overdue">Overdue / Late</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-450">Bind to Project (optional)</label>
                    <select
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-450 focus:border-emerald-450 text-[12px] font-semibold cursor-pointer"
                    >
                      <option value="">No Active Installation</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={modalLoading}
                    className="w-full py-3.5 mt-2 rounded-xl bg-slate-900 hover:bg-slate-850 disabled:bg-slate-850/50 text-white font-bold text-xs shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {modalLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                    <span>Log Invoice Entry</span>
                  </button>
                </form>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}
