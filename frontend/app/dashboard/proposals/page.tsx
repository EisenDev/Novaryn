"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { 
  FileText, ArrowLeft, Printer, RefreshCw, 
  User, Calendar, Landmark, Settings, CheckCircle2, ShieldAlert, CreditCard,
  MoreVertical, Trash2, Code2, AlertTriangle
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────

interface DBModule {
  id: string;
  name: string;
  category: "build" | "support";
  build_price: number;
  monthly_price: number;
}

interface QuotationModule {
  id: string;
  module_id: string;
  enabled: boolean;
  build_price_snapshot: number;
  monthly_price_snapshot: number;
  module: DBModule;
}

interface Quotation {
  id: string;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  client_address: string | null;
  downpayment: number;
  build_total: number;
  monthly_total: number;
  notes: string | null;
  include_maintenance: boolean;
  status: "draft" | "sent" | "accepted" | "declined";
  created_at: string;
  quotation_modules: QuotationModule[];
  pending_deletion_at: string | null;
  pending_deletion_by: string | null;
  pending_deletion_reason: string | null;
}

// Module Features Map for detailed contract scopes
const MODULE_FEATURES: Record<string, string[]> = {
  "Custom Brand Website / CMS": [
    "Fully Custom Figma-to-Code Design",
    "Mobile-Responsive Layouts",
    "Easy Content Management (CMS)",
    "SEO & Meta Tag Configurations",
    "Secure Contact Form Integration"
  ],
  "Appointment & Slot Booking": [
    "Client Online Booking Widget",
    "Dynamic Scheduling Calendar Grid",
    "Email & SMS Confirmation Alerts",
    "Services & Staff Directory Setup",
    "Real-time Availability Sync"
  ],
  "Standalone POS (Point of Sale)": [
    "Fast Cashier Checkout Interface",
    "Thermal Receipt Printer Integration",
    "GCash, Maya, and QR Payments",
    "Daily Shift & Cash Logging",
    "Refunds & Transaction History"
  ],
  "Small Inventory System": [
    "Product catalog with SKU logs",
    "Manual Stock-In & Stock-Out Logs",
    "Automated Low-Stock Alert Alerts",
    "Supplier List & Purchase Logs",
    "Basic Stock Value Summaries"
  ],
  "Customer CRM & Membership Wallet": [
    "Client Profile & Purchase Logs",
    "Tiered Membership Badges",
    "Prepaid Credit Digital Wallet",
    "Loyalty & Rewards Point Rules",
    "QR Check-in Scanner App"
  ],
  "E-Commerce Online Store": [
    "Shopping Cart & Secure Checkout",
    "Product Filters & Variations",
    "GCash/Maya/Card Gateways",
    "Lalamove/J&T Delivery API Sync",
    "Stock levels auto-deduction"
  ],
  "Venue / Facility Booking Grid": [
    "Hourly Asset Booking Grid UI",
    "Peak & Off-Peak Price Rules",
    "Interactive Court/Room Layouts",
    "Reservation Check-in validation",
    "Re-scheduling & Refund requests"
  ],
  "MIS Dashboard & Custom Reports": [
    "Executive Performance Charts",
    "Role-Based Access (RBAC) control",
    "PDF Financial statement reports",
    "Manager Activity Audit Logs",
    "Custom business data filters"
  ],
  "Big Inventory & Supply Chain": [
    "Multi-branch real-time stock sync",
    "Barcode inventory scanning",
    "Auto-replenish purchase orders",
    "Inter-branch stock transfer logs",
    "Physical count adjustment logs"
  ],
  "Franchise & Branch HQ Panel": [
    "Central Headquarters Control Panel",
    "Consolidated Branch comparison charts",
    "Central Product Catalog control",
    "Cross-branch audit logging logs",
    "Royalty fee billing modules"
  ],
  "Enterprise ERP & Legacy Integration": [
    "SAP, Oracle, or Dynamics API Sync",
    "Replicated Database Instances",
    "Active Directory (AD/SSO) Login",
    "Scheduler retry queues",
    "Enterprise 99.99% Node SLA"
  ]
};

const peso = (n: number) =>
  "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 0 });

const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Authorized Personnel static data
const AUTHORIZED_SIGNATORIES = [
  { name: "Joshua Eisen", title: "Chief Executive Officer (CEO)" },
  { name: "Mary Jane", title: "Project Delivery Manager (PM)" },
  { name: "Alex Reyes", title: "Lead Software Architect" }
];

// ─────────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────

// Module-level cache
let _cachedQuotations: Quotation[] = [];
let _proposalsLoaded = false;

export default function ContractBuilderPage() {
  const [quotations, setQuotations] = useState<Quotation[]>(_cachedQuotations);
  const [loading, setLoading] = useState(!_proposalsLoaded);
  const [error, setError] = useState("");
  const [selectedQuote, setSelectedQuote] = useState<Quotation | null>(null);

  // Contract Mode Config
  const [contractMode, setContractMode] = useState<"new" | "renewal">("new");

  // Contract Configurator States
  const [signatoryIndex, setSignatoryIndex] = useState(0);
  const [timeframe, setTimeframe] = useState("60 Calendar Days");
  const [paymentTerms, setPaymentTerms] = useState("50/50 Split (50% Downpayment / 50% Handover)");
  const [attorneyName, setAttorneyName] = useState("Atty. Carlos B. Santos");
  
  // New States: Date, Period, Acknowledgment Style
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split("T")[0]);
  const [durationMonths, setDurationMonths] = useState("12"); // default to 1 year (12 months)
  const [acknowledgmentStyle, setAcknowledgmentStyle] = useState<"notarized" | "private">("private"); // default to private witness

  // Source Code clause toggle
  const [includeSourceCodeClause, setIncludeSourceCodeClause] = useState(false);

  // Delete workflow states
  const [deleteTarget, setDeleteTarget] = useState<Quotation | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteAgreed, setDeleteAgreed] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Fetch quotations list from backend
  const fetchQuotationsList = useCallback(async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("novaryn_admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    try {
      const res = await fetch(`${apiUrl}/pricing/quotations`, {
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
        throw new Error("Unable to retrieve saved quotations.");
      }

      const json = await res.json();
      const quotes = json.data || [];
      _cachedQuotations = quotes;
      _proposalsLoaded = true;
      setQuotations(quotes);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load quotations list.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuotationsList();
  }, [fetchQuotationsList]);

  // Selected Quote Modules Breakdown
  const enabledBuildModules = useMemo(() => {
    if (!selectedQuote) return [];
    return selectedQuote.quotation_modules
      .filter((qm) => qm.enabled && qm.module.category === "build")
      .map((qm) => qm.module);
  }, [selectedQuote]);

  const selectedHostModule = useMemo(() => {
    if (!selectedQuote) return null;
    const hostQM = selectedQuote.quotation_modules.find(
      (qm) => qm.enabled && qm.module.category === "support"
    );
    return hostQM ? hostQM.module : null;
  }, [selectedQuote]);

  // Selected representative data
  const signatory = AUTHORIZED_SIGNATORIES[signatoryIndex];

  // Expiration date helper
  const getExpirationDate = () => {
    if (durationMonths === "indefinite") return "Indefinite";
    const date = new Date(effectiveDate);
    date.setMonth(date.getMonth() + parseInt(durationMonths, 10));
    return formatDate(date.toISOString());
  };

  // Print execution handler
  const handlePrint = () => {
    window.print();
  };

  // Delete workflow
  const openDeleteModal = (quote: Quotation) => {
    setDeleteTarget(quote);
    setDeleteConfirmText("");
    setDeleteAgreed(false);
    setDeleteReason("");
    setDeleteError("");
    setOpenMenuId(null);
  };

  const closeDeleteModal = () => {
    setDeleteTarget(null);
    setDeleteConfirmText("");
    setDeleteAgreed(false);
    setDeleteReason("");
    setDeleteError("");
  };

  const submitDeleteRequest = async () => {
    if (!deleteTarget) return;
    if (deleteConfirmText !== `Delete ${deleteTarget.client_name} Contract`) {
      setDeleteError(`You must type exactly: Delete ${deleteTarget.client_name} Contract`);
      return;
    }
    if (!deleteAgreed) {
      setDeleteError("You must confirm you understand this action cannot be undone without admin approval.");
      return;
    }
    if (!deleteReason.trim()) {
      setDeleteError("Please provide a reason for deletion.");
      return;
    }
    setDeleteLoading(true);
    setDeleteError("");
    const token = localStorage.getItem("novaryn_admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    try {
      const res = await fetch(`${apiUrl}/pricing/quotations/${deleteTarget.id}/request-delete`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: deleteReason }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to submit deletion request.");
      // Update local state: mark as pending deletion
      setQuotations(prev => prev.map(q => q.id === deleteTarget.id ? { ...q, pending_deletion_at: new Date().toISOString(), pending_deletion_by: "You", pending_deletion_reason: deleteReason } : q));
      _cachedQuotations = _cachedQuotations.map(q => q.id === deleteTarget!.id ? { ...q, pending_deletion_at: new Date().toISOString(), pending_deletion_by: "You", pending_deletion_reason: deleteReason } : q);
      closeDeleteModal();
    } catch (err: any) {
      setDeleteError(err.message || "Something went wrong.");
    } finally {
      setDeleteLoading(false);
    }
  };


  if (loading && quotations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-6 h-6 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
      </div>
    );
  }

  // 1. CONTRACT BUILDER DETAILS / CONFIG PANEL VIEW
  if (selectedQuote) {
    return (
      <div className="flex flex-col gap-6 text-left pb-12">
        {/* Style block for Print override (Strict A4 page constraints) */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* A4 screen preview styling */
          .a4-page {
            width: 210mm;
            height: 297mm;
            min-height: 297mm;
            padding: 20mm;
            margin: 0 auto;
            background: white;
            box-shadow: 0 4px 10px rgb(0 0 0 / 0.07), 0 2px 4px rgb(0 0 0 / 0.05);
            box-sizing: border-box;
            position: relative;
            font-family: 'Times New Roman', Times, serif;
            font-size: 11.5px;
            color: #1e293b;
            line-height: 1.5;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          @media print {
            body {
              background: white !important;
              color: black !important;
            }
            @page {
              size: A4;
              margin: 0; /* Let A4 padding define margins */
            }
            body * {
              visibility: hidden !important;
            }
            #print-container-wrapper, #print-container-wrapper * {
              visibility: visible !important;
            }
            #print-container-wrapper {
              display: block !important;
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 210mm !important;
              background: white !important;
              padding: 0 !important;
              margin: 0 !important;
              border: none !important;
              box-shadow: none !important;
            }
            .a4-page {
              border: none !important;
              box-shadow: none !important;
              padding: 20mm !important;
              margin: 0 !important;
              width: 210mm !important;
              height: 297mm !important;
              min-height: 297mm !important;
              page-break-after: always !important;
              box-sizing: border-box !important;
              font-family: 'Times New Roman', Times, serif !important;
              font-size: 11pt !important;
              line-height: 1.6 !important;
              color: black !important;
              background: white !important;
            }
            /* Remove margins on last page to prevent blank sheet */
            .a4-page:last-child {
              page-break-after: avoid !important;
            }
          }
        `}} />

        {/* Back and Page title */}
        <div className="flex items-center justify-between no-print">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedQuote(null)}
              className="flex items-center justify-center w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-55 text-slate-600 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none">
                Draft {contractMode === "renewal" ? "SLA Support Renewal" : "Project Contract"}
              </h1>
              <p className="text-[13px] text-slate-500 mt-1.5 font-medium font-sans">Configure legal clauses, signatories, effective dates, and timeframe terms.</p>
            </div>
          </div>
        </div>

        {/* Builder Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start">
          
          {/* Configurator Left Panel */}
          <div className="flex flex-col gap-5 bg-white border border-slate-250/70 p-5 rounded-2xl shadow-xs sticky top-20 no-print">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Settings className="w-4 h-4 text-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Contract Settings</h3>
            </div>

            {/* Type Indicator */}
            <div className="bg-slate-50 border border-slate-205 p-3.5 rounded-xl text-left text-xs">
              <p className="text-slate-400 font-bold uppercase text-[9px] tracking-wide">Contract Type</p>
              <p className="text-slate-800 font-bold mt-0.5">
                {contractMode === "renewal" ? "Support SLA & Hosting Renewal" : "New System Build Contract"}
              </p>
            </div>

            {/* Config: Signatory */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" /> Authorized Signee
              </label>
              <select
                value={signatoryIndex}
                onChange={(e) => setSignatoryIndex(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-250 bg-slate-50/50 text-[12px] font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 transition-all"
              >
                {AUTHORIZED_SIGNATORIES.map((sig, idx) => (
                  <option key={idx} value={idx}>
                    {sig.name} ({sig.title})
                  </option>
                ))}
              </select>
            </div>

            {/* Config: Effective Date */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Effective Date
              </label>
              <input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-250 bg-slate-50/50 text-[12px] font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 transition-all font-sans"
              />
            </div>

            {/* Config: Period Term */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Contract Term
              </label>
              <select
                value={durationMonths}
                onChange={(e) => setDurationMonths(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-250 bg-slate-50/50 text-[12px] font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 transition-all"
              >
                <option value="6">6 Months</option>
                <option value="12">12 Months (1 Year)</option>
                <option value="24">24 Months (2 Years)</option>
                <option value="indefinite">Indefinite (Until Terminated)</option>
              </select>
            </div>

            {/* Config: Timeframe (Only for new builds) */}
            {contractMode === "new" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Build Timeframe
                </label>
                <input
                  type="text"
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  placeholder="e.g. 60 Calendar Days"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-250 bg-slate-50/50 text-[12px] font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 transition-all font-sans"
                />
              </div>
            )}

            {/* Config: Payment Terms (Only for new builds) */}
            {contractMode === "new" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" /> Payment Schedule
                </label>
                <input
                  type="text"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  placeholder="e.g. 50/50 split"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-250 bg-slate-50/50 text-[12px] font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 transition-all font-sans"
                />
              </div>
            )}

            {/* Config: Acknowledgment Style Toggle */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-slate-400" /> Legal Acknowledgment
              </label>
              <select
                value={acknowledgmentStyle}
                onChange={(e) => setAcknowledgmentStyle(e.target.value as "notarized" | "private")}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-250 bg-slate-50/50 text-[12px] font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 transition-all"
              >
                <option value="private">Private Agreement (Witness Signatures)</option>
                <option value="notarized">Notarized (Notary Public Block)</option>
              </select>
            </div>

            {/* Source Code Ownership Clause Toggle */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-slate-400" /> Source Code Clause
              </label>
              <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-205 bg-slate-50/50 cursor-pointer hover:border-slate-300 transition-all">
                <input
                  type="checkbox"
                  checked={includeSourceCodeClause}
                  onChange={(e) => setIncludeSourceCodeClause(e.target.checked)}
                  className="mt-0.5 accent-emerald-500 w-3.5 h-3.5 shrink-0 cursor-pointer"
                />
                <div>
                  <p className="text-[11px] font-bold text-slate-700 leading-tight">Include Source Code Transfer Clause</p>
                  <p className="text-[9.5px] text-slate-400 mt-0.5 leading-relaxed">
                    Adds a contract section stating Novaryn transfers full source code ownership and repository access to the Client upon completion of all payments. Check only if a negotiated source code buyout is part of this agreement.
                  </p>
                </div>
              </label>
            </div>

            {/* Config: Notary (Only if notarized acknowledgment selected) */}
            {acknowledgmentStyle === "notarized" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5 text-slate-400" /> Attorney Name (Notary)
                </label>
                <input
                  type="text"
                  value={attorneyName}
                  onChange={(e) => setAttorneyName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-250 bg-slate-50/50 text-[12px] font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 transition-all"
                />
              </div>
            )}

            {/* Document details preview indicator */}
            <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-400 flex flex-col gap-1 text-left font-sans">
              <p><strong>Default Paper Size:</strong> A4 Standard (210mm x 297mm)</p>
              <p><strong>Page Break Mode:</strong> Discrete Multi-Page Structure</p>
            </div>

            {/* Action buttons */}
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 w-full py-3 mt-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Legal Contract</span>
            </button>
          </div>

          {/* Legal Contract HTML Preview (Right Column - Discrete A4 Page Layouts) */}
          <div id="print-container-wrapper" className="bg-slate-150 border border-slate-205 rounded-2xl p-6 flex flex-col gap-6 shadow-inner overflow-x-auto select-none no-print-layout justify-center items-center">
            
            {/* PAGE 1 */}
            <div className="a4-page">
              
              {/* Header Letterhead */}
              <div>
                <div className="flex flex-col items-center border-b-2 border-slate-900 pb-4 mb-6">
                  <img 
                    src="/novaryn-logo.png" 
                    alt="Novaryn Logo" 
                    className="w-11 h-11 object-contain mb-2"
                  />
                  <h1 className="text-sm font-sans font-black uppercase tracking-wider text-slate-950">NOVARYN TECH SOLUTIONS</h1>
                  <p className="text-[9px] text-slate-500 font-sans tracking-wide">Digos City, Davao del Sur, Philippines · contact@novaryn.tech</p>
                </div>

                {/* Agreement Title */}
                <div className="text-center mb-6">
                  <h2 className="text-[13px] font-extrabold uppercase tracking-wide font-sans text-slate-900 leading-tight">
                    {contractMode === "renewal" 
                      ? "SOFTWARE SUPPORT SLA & INFRASTRUCTURE RENEWAL AGREEMENT"
                      : "SOFTWARE DEVELOPMENT AGREEMENT & SERVICE RETAINER"
                    }
                  </h2>
                  <div className="w-20 h-[1.5px] bg-slate-800 mx-auto my-2" />
                  <p className="text-[8px] tracking-widest text-slate-400 uppercase font-sans font-bold">
                    {contractMode === "renewal" ? "Support Renewal Contract" : "New System Build Contract"}
                  </p>
                </div>

                {/* Parties Preamble */}
                <p className="mb-3 text-justify">
                  <strong>KNOW ALL MEN BY THESE PRESENTS:</strong>
                </p>
                <p className="mb-3 text-justify">
                  This Agreement (the "Contract") is entered into and executed this <strong>{formatDate(effectiveDate)}</strong>, by and between:
                </p>
                <p className="mb-3 pl-4 text-justify">
                  <strong>NOVARYN TECH SOLUTIONS</strong>, a software development startup team organized in the Philippines, with office address in <strong>Digos City, Davao del Sur, Philippines</strong>, represented herein by its Authorized Representative, <strong>{signatory.name}</strong>, who acts as the <strong>{signatory.title}</strong>, (hereinafter referred to as the <strong>"Developer"</strong>);
                </p>
                <p className="text-center my-1.5 font-bold italic">- and -</p>
                <p className="mb-4 pl-4 text-justify">
                  <strong>{selectedQuote.client_name}</strong>,
                  {selectedQuote.client_address ? ` with registered address at ${selectedQuote.client_address}` : ""}
                  {selectedQuote.client_phone ? `, telephone contact at ${selectedQuote.client_phone}` : ""}
                  {selectedQuote.client_email ? `, and registered email contact at ${selectedQuote.client_email}` : ""}, (hereinafter referred to as the <strong>"Client"</strong>).
                </p>

                {/* Section 1: Scope of Work */}
                <h3 className="font-sans font-bold text-[11px] uppercase border-b border-slate-250 pb-0.5 mt-5 mb-2 text-slate-900">SECTION 1: SCOPE OF SERVICES</h3>
                {contractMode === "renewal" ? (
                  <p className="mb-3 text-justify">
                    <strong>WHEREAS</strong>, the Developer previously custom-developed and deployed system software for the Client, and the parties now desire to renew their cooperative commitment specifically for software maintenance updates, bug-fixes, and hosting infrastructure support. 
                    The systems covered under this Support Renewal Agreement are:
                  </p>
                ) : (
                  <p className="mb-3 text-justify">
                    The Developer agrees to custom-design, write, compile, and deploy the following modular systems requested by the Client:
                  </p>
                )}
                
                <div className="flex flex-col gap-2.5 mb-4 pl-4">
                  {enabledBuildModules.map((m) => {
                    const feats = MODULE_FEATURES[m.name] || [];
                    return (
                      <div key={m.id} className="border-l-2 border-slate-200 pl-3">
                        <p className="text-[11px] font-bold text-slate-900 leading-tight">{m.name}</p>
                        {feats.length > 0 && (
                          <ul className="list-disc pl-4 mt-0.5 text-[10px] text-slate-550 flex flex-col gap-0.5">
                            {feats.map((f, i) => (
                              <li key={i}>{f}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Server Host card */}
                {selectedHostModule ? (
                  <div className="bg-slate-50 border border-slate-100 p-2 rounded-lg mb-4 text-[10px]">
                    <p className="font-semibold text-slate-800">Included Hosting Infrastructure:</p>
                    <p className="text-slate-600 mt-0.5">
                      <strong>{selectedHostModule.name}</strong> will be configured and deployed on behalf of the Client to hold the database, background job queue workers, and visual files.
                    </p>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-100 p-2 rounded-lg mb-4 text-[10px]">
                    <p className="font-semibold text-slate-800">Hosting Infrastructure Disclaimer:</p>
                    <p className="text-slate-600 mt-0.5">
                      No managed server package selected. The Client will host the system directly on their own cloud infrastructure (Vercel, AWS, or DigitalOcean) under the technical setup instruction of the Developer.
                  </p>
                </div>
              )}
              </div>

              {/* Page Footer */}
              <div className="flex justify-between items-center text-[9px] text-slate-400 border-t border-slate-100 pt-1 font-sans">
                <span>Novaryn Business Contract</span>
                <span>Page 1 of 2</span>
              </div>
            </div>

            {/* PAGE 2 */}
            <div className="a4-page">
              
              <div>
                {/* Pricing Table (Section 2) */}
                <h3 className="font-sans font-bold text-[11px] uppercase border-b border-slate-250 pb-0.5 mb-2 text-slate-900">SECTION 2: COMPENSATION & PAYMENT TERMS</h3>
                <p className="mb-2 text-justify">
                  In consideration of the services rendered, the Client agrees to make payment to the Developer under a contract-based structure as follows:
                </p>
                
                <table className="w-full border-collapse border border-slate-300 mb-3 text-[11px]">
                  <thead>
                    <tr className="bg-slate-55 border-b border-slate-300 text-[10px]">
                      <th className="border border-slate-300 p-2 text-left font-bold font-sans">Payment Detail</th>
                      <th className="border border-slate-300 p-2 text-right font-bold font-sans w-28">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 p-2">
                        <strong>Total Agreement Contract Value</strong>
                        <p className="text-[9px] text-slate-500 mt-0.5">Comprehensive valuation based on selected functional modules.</p>
                      </td>
                      <td className="border border-slate-300 p-2 text-right font-bold text-slate-900">
                        {contractMode === "renewal" ? peso(0) : peso(selectedQuote.build_total)}
                      </td>
                    </tr>
                    {contractMode === "new" && (
                      <>
                        <tr className="bg-slate-50/40">
                          <td className="border border-slate-300 p-2 pl-6 font-sans">
                            <strong>Production Launch Payment (50%)</strong>
                            <p className="text-[9px] text-slate-500">Payable upon final deployment & system handover to production.</p>
                          </td>
                          <td className="border border-slate-300 p-2 text-right font-semibold">
                            {peso(Math.round(selectedQuote.build_total * 0.5))}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-slate-300 p-2 pl-6 font-sans">
                            <strong>Monthly Contract Installment (50% spread)</strong>
                            <p className="text-[9px] text-slate-500">
                              Amortized monthly over the initial {durationMonths === "indefinite" ? "12" : durationMonths}-month contract term.
                            </p>
                          </td>
                          <td className="border border-slate-300 p-2 text-right font-semibold">
                            {peso(Math.round((selectedQuote.build_total * 0.5) / (durationMonths === "indefinite" ? 12 : parseInt(durationMonths, 10))))}/mo
                          </td>
                        </tr>
                      </>
                    )}
                    {selectedHostModule && (
                      <tr className="bg-slate-50/40">
                        <td className="border border-slate-300 p-2">
                          <strong>Monthly Server Hosting & Database Licensing Fee</strong>
                          <p className="text-[9px] text-slate-500 mt-0.5">Managed cloud hosting resources, database node, and API subscriptions.</p>
                        </td>
                        <td className="border border-slate-300 p-2 text-right font-semibold">
                          {peso(selectedHostModule.monthly_price)}/mo
                        </td>
                      </tr>
                    )}
                    <tr className="bg-slate-50/40">
                      <td className="border border-slate-300 p-2">
                        <strong>Year 2 Maintenance SLA (Post-Contract Period)</strong>
                        <p className="text-[9px] text-slate-500 mt-0.5">Pay-as-you-go model. Client only pays for bugfixes and checkups if service is rendered.</p>
                      </td>
                      <td className="border border-slate-300 p-2 text-right font-bold text-emerald-600">
                        On-Demand (₱0 base)
                      </td>
                    </tr>
                    <tr className="bg-slate-100">
                      <td className="border border-slate-300 p-2 font-bold font-sans">Total Combined Monthly Fee (Installment + Cloud)</td>
                      <td className="border border-slate-300 p-2 text-right font-bold text-slate-900">
                        {peso(
                          Math.round((selectedQuote.build_total * 0.5) / (durationMonths === "indefinite" ? 12 : parseInt(durationMonths, 10))) + 
                          (selectedHostModule ? selectedHostModule.monthly_price : 0)
                        )}/mo
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Schedule and SLA scope */}
                {contractMode === "new" ? (
                  <p className="mb-3 text-justify text-[10px]">
                    <strong>Schedule of Payment:</strong>
                    <br />
                    The Compensation for this Software Development Agreement is structured on a contract basis of <strong>{peso(selectedQuote.build_total)}</strong>. The Client agrees to settle <strong>50% (amounting to {peso(Math.round(selectedQuote.build_total * 0.5))})</strong> as a Production Launch Payment upon system deployment. The remaining <strong>50% (amounting to {peso(Math.round(selectedQuote.build_total * 0.5))})</strong> shall be amortized and paid in <strong>{durationMonths === "indefinite" ? "12" : durationMonths} monthly installments of {peso(Math.round((selectedQuote.build_total * 0.5) / (durationMonths === "indefinite" ? 12 : parseInt(durationMonths, 10))))}/month</strong> over the term of the agreement.
                  </p>
                ) : (
                  <p className="mb-3 text-justify text-[10px]">
                    <strong>Schedule of Payment:</strong>
                    <br />
                    No system build charges apply to this SLA Support renewal. Client agrees to pay the recurring monthly subscription total of <strong>{peso(selectedQuote.monthly_total)}/mo</strong> every month starting from the Effective Date.
                  </p>
                )}

                {/* SLA Details text */}
                <div className="mb-3 pl-3 text-[10px] text-slate-650 leading-relaxed border-l-2 border-emerald-500">
                  <p className="font-bold text-slate-900">Support & Maintenance SLA Details:</p>
                  <ul className="list-disc pl-4 mt-1 flex flex-col gap-1">
                    <li><strong>Initial Maintenance Term:</strong> The Client is entitled to **three (3) months of complimentary software bug-fixing and checkup maintenance** starting from the launch date. Subsequent months are covered under the Monthly Contract Installment.</li>
                    <li><strong>Post-Contract Year 2+ Support:</strong> Upon the expiration of the initial {durationMonths === "indefinite" ? "12" : durationMonths}-month term, this Agreement transitions to a **Pay-as-you-go / On-Demand Renewal model**. The Client shall pay a monthly base support fee of **₱0** if no software errors, checkups, or service interventions occur. Active support calls, system health checks, or bug resolution requests will be billed separately.</li>
                  </ul>
                </div>

                {/* Timeframe & Term (Section 3) */}
                <h3 className="font-sans font-bold text-[11px] uppercase border-b border-slate-250 pb-0.5 mt-4 mb-2 text-slate-900">SECTION 3: TIMEFRAME & TERM DURATION</h3>
                {contractMode === "new" ? (
                  <p className="mb-4 text-justify text-[10px]">
                    The Developer commits to deploying the custom system within <strong>{timeframe}</strong> from the receipt of downpayment. This contract becomes effective on <strong>{formatDate(effectiveDate)}</strong> and remains active for an initial term of <strong>{durationMonths === "indefinite" ? "an indefinite period" : `${durationMonths} months`}</strong>, expiring on <strong>{getExpirationDate()}</strong>. Upon expiration, the Client may renew this contract to continue the monthly SLA support and cloud hosting packages.
                  </p>
                ) : (
                  <p className="mb-4 text-justify text-[10px]">
                    The software maintenance and support services under this Renewal Agreement shall become effective on <strong>{formatDate(effectiveDate)}</strong> and shall remain in force for a term of <strong>{durationMonths === "indefinite" ? "an indefinite period" : `${durationMonths} months`}</strong>, expiring on <strong>{getExpirationDate()}</strong>.
                  </p>
                )}

                {/* Source Code Transfer Clause (conditionally included) */}
                {includeSourceCodeClause && (
                  <>
                    <h3 className="font-sans font-bold text-[11px] uppercase border-b border-slate-250 pb-0.5 mt-4 mb-2 text-slate-900">SECTION 4: SOURCE CODE OWNERSHIP & TRANSFER</h3>
                    <p className="mb-2 text-justify text-[10px]">
                      The parties hereto have mutually agreed and negotiated a <strong>Source Code Transfer</strong> as part of this Agreement. Accordingly, the following terms shall govern the intellectual property and ownership of the developed software:
                    </p>
                    <div className="pl-3 text-[10px] text-slate-650 leading-relaxed border-l-2 border-slate-400 mb-3 flex flex-col gap-1.5">
                      <p><strong>(a) Transfer Conditions:</strong> Upon the Client's full and complete settlement of all amounts due under Section 2 of this Agreement — including all installment payments, cloud hosting fees, and any other outstanding obligations — Novaryn Tech Solutions shall transfer to the Client full ownership of the source code repository for the custom system modules described in Section 1.</p>
                      <p><strong>(b) Repository Handover:</strong> Transfer shall be effected by granting the Client administrative access to the version-controlled repository (e.g., GitHub, GitLab) containing the final source code. The Developer shall provide one (1) complimentary handover session to assist in the transition.</p>
                      <p><strong>(c) Retained Rights:</strong> Novaryn retains all rights over its proprietary internal frameworks, development tooling, reusable component libraries, and platform infrastructure not custom-built exclusively for this Client. Only the custom-developed modules uniquely attributed to this engagement shall be transferred.</p>
                      <p><strong>(d) Post-Transfer Warranty:</strong> Following repository handover, Novaryn's obligation for bug fixes, updates, or maintenance related to modifications made by the Client or third parties to the transferred codebase is hereby waived. The Client assumes full technical responsibility upon transfer.</p>
                    </div>
                  </>
                )}

                {/* Signatures block */}
                <div className="grid grid-cols-2 gap-x-12 mt-6 pt-4 border-t border-slate-100 signature-block">
                  <div className="text-center">
                    <p className="text-slate-400 text-[9px] uppercase font-sans font-bold">Novaryn Tech Solutions</p>
                    <div className="h-12 border-b border-slate-300" />
                    <p className="text-[11px] font-bold text-slate-800 mt-1">{signatory.name}</p>
                    <p className="text-[9px] text-slate-500 font-sans">{signatory.title}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-400 text-[9px] uppercase font-sans font-bold">Client Authorized Signatory</p>
                    <div className="h-12 border-b border-slate-300" />
                    <p className="text-[11px] font-bold text-slate-800 mt-1">{selectedQuote.client_name}</p>
                    <p className="text-[9px] text-slate-500 font-sans">Authorized Client Representative</p>
                  </div>
                </div>

                {/* Legal acknowledgment block */}
                {acknowledgmentStyle === "private" ? (
                  /* Private Witness Agreement signatures */
                  <div className="mt-6 pt-4 border-t-2 border-dashed border-slate-300 text-[10px] text-slate-500 notary-block">
                    <p className="text-center font-bold font-sans uppercase text-[9px] tracking-wide mb-3 text-slate-650">SIGNED IN THE PRESENCE OF:</p>
                    <div className="grid grid-cols-2 gap-x-12 mt-1 text-center">
                      <div>
                        <div className="h-8 border-b border-slate-300" />
                        <p className="text-[9px] text-slate-500 font-sans mt-1">Witness 1 (Signature over Printed Name)</p>
                      </div>
                      <div>
                        <div className="h-8 border-b border-slate-300" />
                        <p className="text-[9px] text-slate-500 font-sans mt-1">Witness 2 (Signature over Printed Name)</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Notary public legal acknowledgment */
                  <div className="mt-6 pt-4 border-t-2 border-dashed border-slate-300 text-[10px] text-slate-555 notary-block">
                    <p className="text-center font-bold font-sans uppercase text-[9px] tracking-wide mb-1 text-slate-600">NOTARIAL ACKNOWLEDGEMENT</p>
                    <p className="mb-2 text-justify text-[9px]">
                      REPUBLIC OF THE PHILIPPINES)
                      <br />
                      CITY OF DIGOS &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ) S.S.
                    </p>
                    <p className="text-justify mb-2 text-[9px]">
                      BEFORE ME, a Notary Public for and in the City of Digos, this day personally appeared {signatory.name} and {selectedQuote.client_name}, exhibiting to me their respective government-issued IDs, known to me to be the same persons who executed the foregoing Software Agreement, and they acknowledged to me that the same is their free and voluntary act and deed.
                    </p>
                    <div className="flex justify-between mt-2 text-[9px]">
                      <div>
                        <p>Doc. No. _______;</p>
                        <p>Page. No. _______;</p>
                        <p>Book. No. _______;</p>
                        <p>Series of 2026.</p>
                      </div>
                      <div className="text-center border-t border-slate-350 w-48 pt-1.5 mt-2 font-sans font-semibold text-slate-700 text-[9px]">
                        {attorneyName}
                        <p className="text-[8px] text-slate-400 font-normal mt-0.5">Notary Public / Attorney-at-Law</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Page Footer */}
              <div className="flex justify-between items-center text-[9px] text-slate-400 border-t border-slate-100 pt-1 font-sans">
                <span>Novaryn Business Contract</span>
                <span>Page 2 of 2</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // 2. DEFAULT LIST VIEW: ALL QUOTATIONS / CONTRACTS
  return (
    <div className="flex flex-col gap-6 text-left font-sans">
      <div>
        <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none">Contract Builder</h1>
        <p className="text-[13px] text-slate-500 mt-1.5 font-medium">Select a saved quotation to generate a formal software development contract or SLA renewal.</p>
      </div>

      {quotations.length === 0 ? (
        <div className="bg-white border border-slate-200/70 p-12 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs">
          <FileText className="w-10 h-10 text-slate-300 mb-3" />
          <h3 className="text-sm font-semibold text-slate-700">No Saved Quotations Found</h3>
          <p className="text-[11px] text-slate-400 mt-1 max-w-[280px]">
            Configure and save a quotation in the Pricing Engine first, and it will list here automatically.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/70 rounded-2xl shadow-xs overflow-hidden">
          <table className="w-full border-collapse text-left text-xs text-slate-500">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
              <tr>
                <th className="px-6 py-4 font-sans">Client Name</th>
                <th className="px-6 py-4 font-sans">System Plan</th>
                <th className="px-6 py-4 font-sans text-right">One-time Build</th>
                <th className="px-6 py-4 font-sans text-right">Monthly Support</th>
                <th className="px-6 py-4 font-sans text-center">Maintenance SLA</th>
                <th className="px-6 py-4 font-sans">Saved Date</th>
                <th className="px-6 py-4 text-right font-sans">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {quotations.map((quote) => (
                <tr key={quote.id} className={`hover:bg-slate-50/50 transition-colors ${quote.pending_deletion_at ? "opacity-60" : ""}`}>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                      {quote.client_name}
                      {quote.pending_deletion_at && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-100 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                          <AlertTriangle className="w-2.5 h-2.5" /> Pending Deletion
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{quote.client_email || "No Email"}</div>
                    {quote.pending_deletion_at && (
                      <div className="text-[9px] text-amber-600 mt-0.5 font-medium">
                        Requested by {quote.pending_deletion_by} · Awaiting approval
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-600">Custom System</span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-semibold text-slate-900">
                    {peso(quote.build_total)}
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-semibold text-slate-900">
                    {peso(quote.monthly_total)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {quote.include_maintenance ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Included
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Declined
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {formatDate(quote.created_at)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {!quote.pending_deletion_at && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedQuote(quote);
                              setContractMode("new");
                            }}
                            className="px-3 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                          >
                            Draft Contract
                          </button>
                          <button
                            onClick={() => {
                              setSelectedQuote(quote);
                              setContractMode("renewal");
                            }}
                            className="px-3 py-1.5 bg-blue-50 border border-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                          >
                            Draft Renewal
                          </button>
                        </>
                      )}
                      {/* 3-dot kebab menu */}
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === quote.id ? null : quote.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {openMenuId === quote.id && (
                          <>
                            {/* Click outside handler */}
                            <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-slate-200 shadow-lg z-20 py-1 overflow-hidden">
                              {!quote.pending_deletion_at ? (
                                <button
                                  onClick={() => openDeleteModal(quote)}
                                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[12px] font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Request Deletion
                                </button>
                              ) : (
                                <div className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[12px] font-semibold text-amber-600 cursor-not-allowed">
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  Pending Approval
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={closeDeleteModal}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 flex flex-col gap-5 z-10">
            {/* Icon + title */}
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h2 className="text-[16px] font-bold text-slate-900 leading-tight">Request Contract Deletion</h2>
              <p className="text-[12px] text-slate-500 max-w-[300px]">
                This will flag <strong>{deleteTarget.client_name}&apos;s</strong> contract for deletion. A Super Admin must approve before it is permanently removed.
              </p>
            </div>

            {/* Reason field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Reason for Deletion</label>
              <textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                rows={2}
                placeholder="e.g. Duplicate entry, client request, data error..."
                className="w-full px-3 py-2.5 rounded-lg border border-slate-250 bg-slate-50 text-[12px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-red-400 transition-all resize-none font-sans"
              />
            </div>

            {/* Typed confirmation */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Type to confirm
              </label>
              <p className="text-[11px] text-slate-400">
                Type exactly: <code className="bg-slate-100 px-1 py-0.5 rounded text-red-600 font-mono text-[10px]">Delete {deleteTarget.client_name} Contract</code>
              </p>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder={`Delete ${deleteTarget.client_name} Contract`}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-250 bg-slate-50 text-[12px] text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-red-400 focus:border-red-400 transition-all"
              />
            </div>

            {/* Acknowledgment checkbox */}
            <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl bg-amber-50 border border-amber-100">
              <input
                type="checkbox"
                checked={deleteAgreed}
                onChange={(e) => setDeleteAgreed(e.target.checked)}
                className="mt-0.5 accent-red-500 w-3.5 h-3.5 shrink-0 cursor-pointer"
              />
              <p className="text-[11px] text-amber-800 leading-relaxed">
                I understand this deletion request requires <strong>Super Admin approval</strong> before the contract is permanently removed. This action is logged in the audit trail.
              </p>
            </label>

            {/* Error message */}
            {deleteError && (
              <p className="text-[11px] text-red-600 font-medium bg-red-50 px-3 py-2 rounded-lg border border-red-100">
                {deleteError}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 mt-1">
              <button
                onClick={closeDeleteModal}
                disabled={deleteLoading}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-[12px] font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={submitDeleteRequest}
                disabled={deleteLoading || deleteConfirmText !== `Delete ${deleteTarget.client_name} Contract` || !deleteAgreed || !deleteReason.trim()}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[12px] font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {deleteLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
