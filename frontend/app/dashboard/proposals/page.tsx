"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { 
  FileText, ArrowLeft, Printer, RefreshCw, 
  User, Calendar, Landmark, Settings, CheckCircle2, ShieldAlert, CreditCard,
  MoreVertical, Trash2, Code2, AlertTriangle, Clock, Edit3, X, Save
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

// Module Features Map — kept in sync with pricing-engine/page.tsx
const MODULE_FEATURES: Record<string, string[]> = {
  "Custom Brand Website / CMS": [
    "Fully Custom Figma-to-Code Design",
    "Mobile-Responsive Layouts",
    "Easy Content Management (CMS)",
    "SEO & Meta Tag Configurations",
    "Secure Contact Form Integration",
    "Basic Site Traffic Overview (page views, visitor count)",
    "Monthly Website Performance Summary Report"
  ],
  "Appointment & Slot Booking": [
    "Client Online Booking Widget (web & mobile)",
    "Dynamic Scheduling Calendar Grid",
    "Email & SMS Confirmation & Reminder Alerts",
    "Services, Staff & Time Slot Directory Setup",
    "Real-time Availability Sync",
    "Walk-in & Manual Override Booking by Admin",
    "Booking Status Tracking (Pending / Confirmed / Cancelled)",
    "Daily & Weekly Booking Volume Summary",
    "Cancellation & No-show Rate Tracker",
    "Staff Utilization Rate Overview",
    "Monthly Appointment Revenue Summary Report"
  ],
  "Standalone POS (Point of Sale)": [
    "Fast Cashier Checkout Interface",
    "Thermal Receipt Printer Integration",
    "GCash, Maya, Cash, and QR Payment Support",
    "Daily Shift Opening & Cash Closing Logs",
    "Refunds, Voids & Transaction History",
    "Product/Service Quick-Add Menu",
    "Discount & Promo Code Application",
    "Daily Sales Summary & Cash Flow Report",
    "Top-Selling Products & Services Ranking",
    "Shift-by-Shift Revenue Comparison",
    "Monthly Sales Trend Report (exportable)"
  ],
  "Small Inventory System": [
    "Product Catalog with SKU & Barcode Logs",
    "Manual Stock-In & Stock-Out Entry Logs",
    "Automated Low-Stock Alert Notifications",
    "Supplier Directory & Purchase Order Logs",
    "Category & Variant Management",
    "Multi-unit Stock Conversion (box → pcs)",
    "Inventory Valuation & Stock-on-Hand Report",
    "Stock Movement & Variance Analytics",
    "Slow-Moving & Dead Stock Identification",
    "Supplier Purchase History & Lead Time Report",
    "Monthly Inventory Health Summary (exportable PDF)"
  ],
  "Customer CRM & Membership Wallet": [
    "Customer Profile Directory & Purchase History",
    "Tiered Membership Levels (Bronze / Silver / Gold)",
    "Prepaid Digital Wallet (top-up & deduct)",
    "Loyalty Points Earn & Redeem Rules Engine",
    "QR Code Check-in Scanner App",
    "Birthday & Anniversary Auto-messaging",
    "Customer Segmentation Tags",
    "Customer Retention & Churn Rate Report",
    "Member Activity & Visit Frequency Analytics",
    "Wallet Top-up & Spending Summary",
    "Loyalty Points Redemption Trend Report",
    "Customer Lifetime Value (CLV) Overview Dashboard"
  ],
  "E-Commerce Online Store": [
    "Shopping Cart & Secure Checkout Flow",
    "Product Listings with Filters, Variants & Gallery",
    "GCash, Maya, Credit/Debit Card Gateways",
    "Lalamove / J&T Delivery API Sync",
    "Stock Auto-Deduction on Checkout",
    "Order Management & Fulfillment Tracker",
    "Customer Account & Order History Portal",
    "Coupon & Flash Sale Engine",
    "Sales Revenue & GMV Analytics Dashboard",
    "Product Performance & Conversion Rate Reports",
    "Cart Abandonment Rate Tracking",
    "Customer Purchase Behavior Insights",
    "Top Traffic Sources & Channel Attribution",
    "Monthly E-Commerce Business Report (exportable)"
  ],
  "Venue / Facility Booking Grid": [
    "Hourly Asset Booking Grid (courts, rooms, lanes)",
    "Peak & Off-Peak Dynamic Pricing Rules",
    "Interactive Floor / Court Layout Map",
    "Reservation QR Check-in Validation",
    "Re-scheduling, Cancellation & Refund Workflow",
    "Walk-in & Admin Manual Override Booking",
    "Blocked / Maintenance Slot Management",
    "Facility Utilization Rate per Asset Report",
    "Revenue per Court / Room / Lane Analytics",
    "Peak Hours & Off-Peak Demand Heatmap",
    "Booking Source Breakdown (online vs walk-in)",
    "Monthly Facility Revenue Trend Summary"
  ],
  "MIS Dashboard & Custom Reports": [
    "Executive KPI Summary Dashboard (multi-module)",
    "Role-Based Access Control (RBAC) per department",
    "Exportable PDF & Excel Financial Reports",
    "Manager & Staff Activity Audit Logs",
    "Custom Business Data Filters & Date Ranges",
    "Real-time Data Feed Across All Modules",
    "Scheduled Auto-Email Report Delivery",
    "Cross-Department Revenue & Cost Analytics",
    "Performance vs Target Comparison Charts",
    "Operational Efficiency Metrics Dashboard",
    "Trend Analysis & Month-over-Month Growth Charts",
    "Custom Report Builder (drag & configure)",
    "Executive-ready Slide-format Report Exports"
  ],
  "Big Inventory & Supply Chain": [
    "Multi-Branch Real-time Stock Sync",
    "Barcode & QR Code Inventory Scanning",
    "Auto-Replenishment & Purchase Order Automation",
    "Inter-Branch Stock Transfer with Approval Flow",
    "Physical Count Adjustment & Variance Logs",
    "Multi-Warehouse Zone Management",
    "Perishable & Expiry Date Tracking",
    "Supply Chain Performance & Lead Time Dashboard",
    "Demand Forecasting & Reorder Point Analytics",
    "Vendor Scorecard & Comparison Report",
    "Loss, Shrinkage & Damage Audit Reports",
    "COGS & Gross Margin per Product Analytics",
    "Inventory Aging & Turnover Rate Report",
    "Multi-Branch Stock Consolidation Summary"
  ],
  "Franchise & Branch HQ Panel": [
    "Central HQ Control Panel (all branches in one view)",
    "Consolidated Branch Revenue Comparison Charts",
    "Central Product Catalog & Pricing Control",
    "Cross-Branch Audit Logging & Compliance Monitoring",
    "Royalty Fee Calculation & Billing Module",
    "Franchisee Onboarding & Access Management",
    "Announcement & Policy Broadcast System",
    "Branch Performance Benchmarking Dashboard",
    "Consolidated Revenue & Expense Analytics",
    "Franchise Compliance Score Reports",
    "Territory & Regional Sales Heatmap",
    "Top & Bottom Performing Branch Rankings",
    "Royalty Fee Collection Trend Analysis",
    "HQ-to-Branch Operational Efficiency Comparison"
  ],
  "Enterprise ERP & Legacy Integration": [
    "SAP, Oracle, or MS Dynamics API Integration",
    "Replicated Read/Write Database Node Instances",
    "Active Directory / SSO (Single Sign-On) Login",
    "Async Job Scheduler with Retry Queue System",
    "Enterprise 99.99% Uptime SLA Node Architecture",
    "Custom Webhook & API Gateway Bridge",
    "Legacy Data Migration & ETL Pipeline",
    "Multi-entity & Holding Company Structure Support",
    "Enterprise Business Intelligence (BI) Dashboard",
    "Custom Data Warehouse & OLAP Cube Reports",
    "Real-time Executive KPI Streaming Dashboard",
    "Multi-system Consolidated Analytics Hub",
    "Predictive Analytics & AI-assisted Forecasting",
    "Regulatory Compliance & Audit Trail Reports",
    "Board-ready Financial Intelligence Reports"
  ]
};

// Authorized Personnel static data (Novaryn Executive Team Directory)
const AUTHORIZED_SIGNATORIES = [
  { name: "Jericho L. Suerto", title: "Chief Executive Officer (CEO)" },
  { name: "Arjay L. Escabas", title: "Founder & Lead Developer" },
  { name: "Eric E. Diamante", title: "Founder & Lead QA" },
  { name: "Aliazer Casan P. Solaiman", title: "Founder & Developer" },
  { name: "Xander Dela Cruz", title: "Founder & Project Manager" }
];

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
  
  // Timeline Modal State
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [timelineDates, setTimelineDates] = useState<Record<string, string>>({
    "Requirements Gathering": "Day 1 – Day 10",
    "System Design": "Day 11 – Day 20",
    "Development": "Day 21 – Day 45",
    "Testing": "Day 46 – Day 52",
    "Deployment/Implementation": "Day 53 – Day 57",
    "Final Turnover": "Day 58 – Day 60"
  });
  
  // New States: Date, Period, Acknowledgment Style
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split("T")[0]);
  const [durationMonths, setDurationMonths] = useState("12"); // default to 1 year (12 months)
  const [acknowledgmentStyle, setAcknowledgmentStyle] = useState<"notarized" | "private">("private"); // default to private witness

  // Source Code clause toggle
  const [includeSourceCodeClause, setIncludeSourceCodeClause] = useState(false);
  const [sourceCodeFee, setSourceCodeFee] = useState("0");
  const [sourceCodeReleaseDays, setSourceCodeReleaseDays] = useState("30");

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
        {/* Style block for Print override & Fluid Document View */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Document screen preview styling (DOCX / PDF standard paper view) */
          .contract-document-paper {
            width: 210mm;
            min-height: 297mm;
            padding: 20mm 22mm 18mm 22mm;
            margin: 0 auto;
            background: white;
            box-shadow: 0 8px 24px rgb(0 0 0 / 0.09), 0 2px 6px rgb(0 0 0 / 0.04);
            box-sizing: border-box;
            position: relative;
            font-family: 'Times New Roman', Times, serif;
            font-size: 11pt;
            color: #0f172a;
            line-height: 1.6;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          .section-block {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          @media print {
            body {
              background: white !important;
              color: black !important;
            }
            @page {
              size: A4;
              margin: 15mm 18mm 18mm 18mm;
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
              width: 100% !important;
              background: white !important;
              padding: 0 !important;
              margin: 0 !important;
              border: none !important;
              box-shadow: none !important;
            }
            .contract-document-paper {
              border: none !important;
              box-shadow: none !important;
              padding: 0 !important;
              margin: 0 !important;
              width: 100% !important;
              min-height: auto !important;
              font-family: 'Times New Roman', Times, serif !important;
              font-size: 11pt !important;
              line-height: 1.5 !important;
              color: black !important;
              background: white !important;
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

            {/* Config: Timeframe & Timeline Modal Trigger */}
            {contractMode === "new" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Build Timeframe &amp; Timeline
                </label>
                <button
                  type="button"
                  onClick={() => setIsTimelineModalOpen(true)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-250 bg-slate-50/50 hover:bg-slate-100/80 text-[12px] font-semibold text-slate-800 flex items-center justify-between transition-all cursor-pointer group shadow-2xs"
                >
                  <span className="truncate">{timeframe || "60 Calendar Days"}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200/70 group-hover:bg-emerald-600 group-hover:text-white transition-all shrink-0">
                    <Edit3 className="w-3 h-3" /> Target Dates
                  </span>
                </button>
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

            {/* Source Code Fee & Release Schedule Inputs */}
            {includeSourceCodeClause && (
              <div className="flex flex-col gap-3 pl-3.5 border-l border-slate-200 mt-0.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Source Code Buyout Fee (PHP)</label>
                  <input
                    type="text"
                    value={sourceCodeFee}
                    onChange={(e) => setSourceCodeFee(e.target.value)}
                    placeholder="e.g. 15,000"
                    className="w-full px-3 py-2 rounded-lg border border-slate-250 bg-slate-50/50 text-[12px] font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 transition-all font-sans"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Release Timeline (Days after full payment)</label>
                  <input
                    type="text"
                    value={sourceCodeReleaseDays}
                    onChange={(e) => setSourceCodeReleaseDays(e.target.value)}
                    placeholder="e.g. 30"
                    className="w-full px-3 py-2 rounded-lg border border-slate-250 bg-slate-50/50 text-[12px] font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 transition-all font-sans"
                  />
                </div>
              </div>
            )}

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
              <p><strong>Default Paper Size:</strong> Standard A4 (210mm x 297mm)</p>
              <p><strong>Page Break Mode:</strong> Dynamic Continuous Legal Layout</p>
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

          {/* Legal Contract HTML Preview (Right Column - Fluid A4 Paper Layout) */}
          <div id="print-container-wrapper" className="bg-slate-150 border border-slate-205 rounded-2xl p-6 flex flex-col gap-6 shadow-inner overflow-x-auto select-none no-print-layout justify-center items-center">
            
            <div className="contract-document-paper">
              <div>
                {/* Header Letterhead */}
                <div className="flex flex-col items-center border-b-2 border-slate-900 pb-3 mb-5">
                  <img src="/novaryn-logo.png" alt="Novaryn Logo" className="w-12 h-12 object-contain mb-1.5" />
                  <h1 className="text-[16px] font-sans font-black uppercase tracking-wider text-slate-950">NOVARYN TECH SOLUTIONS</h1>
                  <p className="text-[10px] text-slate-500 font-sans tracking-wide">Digos City, Davao del Sur, Philippines · contact@novaryn.tech</p>
                </div>

                {/* Agreement Title */}
                <div className="text-center mb-6">
                  <h2 className="text-[16px] font-extrabold uppercase tracking-wide font-sans text-slate-900 leading-tight">
                    CLIENT SYSTEM DEVELOPMENT AGREEMENT
                  </h2>
                  <div className="w-28 h-[1.5px] bg-slate-800 mx-auto my-2" />
                </div>

                <p className="mb-4 text-justify text-[11pt] leading-relaxed">
                  This Client System Development Agreement (<strong>&quot;Agreement&quot;</strong>) is entered into and made effective as of <strong>{formatDate(effectiveDate)}</strong> (the <strong>&quot;Effective Date&quot;</strong>), by and between:
                </p>

                <div className="flex flex-col gap-3 my-4 pl-4 border-l-2 border-slate-400 font-sans">
                  <div>
                    <p className="text-[11pt] font-bold text-slate-950 uppercase tracking-wide">DEVELOPER / DEVELOPMENT TEAM:</p>
                    <p className="text-[10.5pt] text-slate-800 leading-normal pl-2">
                      <strong>NOVARYN TECH SOLUTIONS</strong>, represented herein by <strong>{signatory.name}</strong> ({signatory.title}), with primary address at Digos City, Davao del Sur, Philippines (Contact: contact@novaryn.tech).
                    </p>
                  </div>
                  <div>
                    <p className="text-[11pt] font-bold text-slate-950 uppercase tracking-wide">CLIENT:</p>
                    <p className="text-[10.5pt] text-slate-800 leading-normal pl-2">
                      <strong>{selectedQuote.client_name.toUpperCase()}</strong>
                      {selectedQuote.client_address && `, located at ${selectedQuote.client_address}`}
                      {selectedQuote.client_phone && ` (Phone: ${selectedQuote.client_phone})`}
                      {selectedQuote.client_email && ` (Email: ${selectedQuote.client_email})`}.
                    </p>
                  </div>
                </div>

                {/* 1. Purpose */}
                <div className="section-block mt-6">
                  <h3 className="font-sans font-bold text-[12pt] uppercase border-b border-slate-300 pb-1 mb-2.5 text-slate-900">1. PURPOSE</h3>
                  <p className="text-justify text-[11pt] leading-relaxed mb-4">
                    The purpose of this Agreement is to define the terms, commercial conditions, scope of work, technical obligations, and turnover criteria under which the Developer shall design, build, deploy, and support the custom business software system (<strong>&quot;{enabledBuildModules.length > 0 ? enabledBuildModules.map(m => m.name).join(", ") : "Custom Business System"}&quot;</strong>) for the Client.
                  </p>

                  {/* Financial Valuation Summary Table */}
                  <div className="my-4 font-sans border border-slate-300 rounded-lg overflow-hidden">
                    <div className="bg-slate-100 border-b border-slate-300 px-4 py-2">
                      <h4 className="font-bold text-slate-900 uppercase tracking-wide text-[10pt]">
                        Financial Valuation &amp; Payment Schedule Summary
                      </h4>
                    </div>
                    <table className="w-full border-collapse text-[10pt]">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                          <th className="px-4 py-2 text-left border-r border-slate-200">Component / Fee Item</th>
                          <th className="px-4 py-2 text-left border-r border-slate-200">Schedule &amp; Terms</th>
                          <th className="px-4 py-2 text-right">Valuation Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-800">
                        <tr>
                          <td className="px-4 py-2.5 border-r border-slate-200 font-semibold">Total System Build Contract Value</td>
                          <td className="px-4 py-2.5 border-r border-slate-200 text-slate-600">Fixed turn-key system build fee</td>
                          <td className="px-4 py-2.5 text-right font-mono font-bold text-slate-900">{peso(selectedQuote.build_total)}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2.5 border-r border-slate-200 font-medium">Downpayment (Commencement Fee)</td>
                          <td className="px-4 py-2.5 border-r border-slate-200 text-slate-600">50% due upon signing before development</td>
                          <td className="px-4 py-2.5 text-right font-mono font-semibold text-slate-900">{peso(Math.round(selectedQuote.build_total * 0.5))}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2.5 border-r border-slate-200 font-medium">Monthly System Installment Balance (50%)</td>
                          <td className="px-4 py-2.5 border-r border-slate-200 text-slate-600">Spread over {durationMonths} month(s) post-launch</td>
                          <td className="px-4 py-2.5 text-right font-mono font-semibold text-slate-900">
                            {peso(Math.round((selectedQuote.build_total * 0.5) / (durationMonths === "indefinite" ? 12 : parseInt(durationMonths, 10))))} / mo
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2.5 border-r border-slate-200 font-medium">Cloud Hosting &amp; DB Infrastructure</td>
                          <td className="px-4 py-2.5 border-r border-slate-200 text-slate-600">
                            {selectedHostModule && selectedHostModule.monthly_price > 0 ? selectedHostModule.name : "Client-Managed Server"}
                          </td>
                          <td className="px-4 py-2.5 text-right font-mono font-semibold text-slate-900">
                            {selectedHostModule && selectedHostModule.monthly_price > 0 ? `$${selectedHostModule.monthly_price} USD / mo` : "$0 USD / mo"}
                          </td>
                        </tr>
                        <tr className="bg-slate-100 font-bold border-t-2 border-slate-400 text-slate-950">
                          <td colSpan={2} className="px-4 py-3 border-r border-slate-300 font-sans uppercase tracking-wider text-[9.5pt]">
                            TOTAL RECURRING MONTHLY OBLIGATION:
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-[10.5pt] text-emerald-800">
                            Total = {peso(Math.round((selectedQuote.build_total * 0.5) / (durationMonths === "indefinite" ? 12 : parseInt(durationMonths, 10))))} + ${selectedHostModule?.monthly_price || 0} / mo ({durationMonths} mos)
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. Scope of Work */}
                <div className="section-block mt-6">
                  <h3 className="font-sans font-bold text-[12pt] uppercase border-b border-slate-300 pb-1 mb-2.5 text-slate-900">2. SCOPE OF WORK</h3>
                  <p className="mb-3 text-justify text-[11pt] leading-relaxed">
                    The Developer agrees to design, engineer, and deliver a custom business software system encompassing the following authorized modules, core features, and data management functions:
                  </p>

                  {enabledBuildModules.length > 0 ? (
                    <div className="flex flex-col gap-4 pl-1 mb-4">
                      {enabledBuildModules.map((m) => {
                        const feats = MODULE_FEATURES[m.name] || [];
                        return (
                          <div key={m.id} className="border-l-2 border-slate-400 pl-3.5 py-0.5 break-inside-avoid">
                            <p className="text-[11.5pt] font-bold text-slate-950 font-sans leading-tight">{m.name}</p>
                            {feats.length > 0 && (
                              <ul className="list-disc pl-5 mt-1.5 text-[10.5pt] text-slate-800 flex flex-col gap-1">
                                {feats.map((f, i) => {
                                  if (f.startsWith("—")) {
                                    return (
                                      <p key={i} className="font-bold text-[9.5pt] uppercase tracking-wider text-slate-900 mt-2 mb-0.5 font-sans -ml-5">
                                        {f.replace(/—/g, "").trim()}
                                      </p>
                                    );
                                  }
                                  return <li key={i}>{f}</li>;
                                })}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <ul className="list-disc pl-6 text-[11pt] text-slate-800 flex flex-col gap-1.5 mb-4">
                      <li>User Authentication &amp; Access Control</li>
                      <li>Main Management Dashboard &amp; Analytics</li>
                      <li>Core Module Workflows</li>
                      <li>Reporting &amp; Data Exports</li>
                    </ul>
                  )}

                  <p className="text-[10pt] text-slate-600 mb-4 text-justify italic font-serif leading-relaxed">
                    Any features, third-party integrations, or customizations not explicitly enumerated in Section 2 above shall be deemed outside the scope of this Agreement unless formally agreed upon in writing via a mutually executed Change Order.
                  </p>
                </div>

                {/* 3. Responsibilities of the Developer */}
                <div className="section-block mt-6">
                  <h3 className="font-sans font-bold text-[12pt] uppercase border-b border-slate-300 pb-1 mb-2.5 text-slate-900">3. RESPONSIBILITIES OF THE DEVELOPER</h3>
                  <p className="mb-2 text-[11pt]">The Developer agrees to:</p>
                  <ul className="list-disc pl-6 text-[10.5pt] text-slate-800 flex flex-col gap-1 mb-4">
                    <li>Gather and analyze the Client&apos;s system requirements.</li>
                    <li>Design, develop, test, and implement the system.</li>
                    <li>Maintain the confidentiality of the Client&apos;s information.</li>
                    <li>Provide user documentation or basic training upon project completion.</li>
                    <li>Correct system errors discovered during the agreed warranty period.</li>
                  </ul>
                </div>

                {/* 4. Responsibilities of the Client */}
                <div className="section-block mt-6">
                  <h3 className="font-sans font-bold text-[12pt] uppercase border-b border-slate-300 pb-1 mb-2.5 text-slate-900">4. RESPONSIBILITIES OF THE CLIENT</h3>
                  <p className="mb-2 text-[11pt]">The Client agrees to:</p>
                  <ul className="list-disc pl-6 text-[10.5pt] text-slate-800 flex flex-col gap-1 mb-4">
                    <li>Provide accurate and complete information needed for system development.</li>
                    <li>Designate a representative to communicate with the Developer.</li>
                    <li>Review deliverables and provide timely feedback.</li>
                    <li>Participate in testing and final acceptance of the system.</li>
                    <li>Use the system in accordance with the provided instructions.</li>
                  </ul>
                </div>

                {/* 5. Project Timeline */}
                <div className="section-block mt-6">
                  <h3 className="font-sans font-bold text-[12pt] uppercase border-b border-slate-300 pb-1 mb-2.5 text-slate-900">5. PROJECT TIMELINE</h3>
                  <p className="mb-2 text-justify text-[11pt]">
                    The total estimated build timeframe is <strong>{timeframe}</strong>. The target schedule per milestone phase is structured as follows:
                  </p>
                  <table className="w-full border-collapse text-[10.5pt] my-2 font-sans">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-400">
                        <th className="border border-slate-300 px-3 py-1.5 text-left font-bold font-sans">Activity / Milestone Phase</th>
                        <th className="border border-slate-300 px-3 py-1.5 text-center font-bold font-sans w-48">Target Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        "Requirements Gathering",
                        "System Design",
                        "Development",
                        "Testing",
                        "Deployment/Implementation",
                        "Final Turnover"
                      ].map((activity, i) => (
                        <tr key={i} className={i % 2 === 1 ? "bg-slate-50/70" : ""}>
                          <td className="border border-slate-300 px-3 py-1 text-slate-900 font-medium">{activity}</td>
                          <td className="border border-slate-300 px-3 py-1 text-center text-slate-800 font-semibold">
                            {timelineDates[activity] || "TBD"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-[9.5pt] text-slate-500 mb-4 font-serif italic">The timeline may be adjusted upon mutual written agreement if client requirement feedback or assets are delayed.</p>
                </div>

                {/* 6. Changes to the Project */}
                <div className="section-block mt-6">
                  <h3 className="font-sans font-bold text-[12pt] uppercase border-b border-slate-300 pb-1 mb-2.5 text-slate-900">6. CHANGES TO THE PROJECT</h3>
                  <p className="mb-4 text-justify text-[11pt] leading-relaxed">
                    Any request for additional features, major revisions, or changes beyond the agreed scope shall require the approval of both parties. Such changes may result in adjustments to the project schedule and, if applicable, additional costs.
                  </p>
                </div>

                {/* 7. Confidentiality */}
                <div className="section-block mt-6">
                  <h3 className="font-sans font-bold text-[12pt] uppercase border-b border-slate-300 pb-1 mb-2.5 text-slate-900">7. CONFIDENTIALITY</h3>
                  <p className="mb-2 text-justify text-[11pt] leading-relaxed">
                    The Developer agrees to keep all business information, records, and data provided by the Client strictly confidential and shall not disclose such information to any third party without the Client&apos;s written consent, except as required by law.
                  </p>
                  <p className="mb-4 text-justify text-[11pt] leading-relaxed">
                    The Client likewise agrees not to distribute, copy, or modify the Developer&apos;s source code without prior permission unless ownership of the source code has been transferred under this Agreement.
                  </p>
                </div>

                {/* 8. Ownership */}
                <div className="section-block mt-6">
                  <h3 className="font-sans font-bold text-[12pt] uppercase border-b border-slate-300 pb-1 mb-2.5 text-slate-900">8. OWNERSHIP</h3>
                  <p className="mb-4 text-justify text-[11pt] leading-relaxed">
                    Upon successful completion of the project and fulfillment of all agreed payment obligations, the Client shall own the completed system, including system documentation and database.
                  </p>
                </div>

                {/* 9. Testing and Acceptance */}
                <div className="section-block mt-6">
                  <h3 className="font-sans font-bold text-[12pt] uppercase border-b border-slate-300 pb-1 mb-2.5 text-slate-900">9. TESTING AND ACCEPTANCE</h3>
                  <p className="mb-4 text-justify text-[11pt] leading-relaxed">
                    The completed system shall undergo User Acceptance Testing (UAT). If the system meets the agreed requirements, the Client shall formally accept the project.
                  </p>
                </div>

                {/* 10. Warranty and Maintenance */}
                <div className="section-block mt-6">
                  <h3 className="font-sans font-bold text-[12pt] uppercase border-b border-slate-300 pb-1 mb-2.5 text-slate-900">10. WARRANTY AND MAINTENANCE</h3>
                  <p className="mb-4 text-[11pt] leading-relaxed">
                    The Developer shall provide a warranty period of 30 days after official turnover to correct software bugs or errors related to agreed functionality.
                  </p>
                </div>

                {/* 11. Termination */}
                <div className="section-block mt-6">
                  <h3 className="font-sans font-bold text-[12pt] uppercase border-b border-slate-300 pb-1 mb-2.5 text-slate-900">11. TERMINATION</h3>
                  <p className="mb-4 text-justify text-[11pt] leading-relaxed">
                    Either party may terminate this Agreement by providing written notice if the other party fails to fulfill its obligations.
                  </p>
                </div>

                {/* 12. Limitation of Liability */}
                <div className="section-block mt-6">
                  <h3 className="font-sans font-bold text-[12pt] uppercase border-b border-slate-300 pb-1 mb-2.5 text-slate-900">12. LIMITATION OF LIABILITY</h3>
                  <p className="mb-4 text-justify text-[11pt] leading-relaxed">
                    The Developer shall not be held responsible for data loss caused by Client actions, hardware failures, or unauthorized third-party modifications.
                  </p>
                </div>

                {/* 13. Governing Law */}
                <div className="section-block mt-6">
                  <h3 className="font-sans font-bold text-[12pt] uppercase border-b border-slate-300 pb-1 mb-2.5 text-slate-900">13. GOVERNING LAW</h3>
                  <p className="mb-4 text-justify text-[11pt] leading-relaxed">
                    This Agreement shall be governed by the applicable laws of the Republic of the Philippines.
                  </p>
                </div>

                {/* 14. Entire Agreement */}
                <div className="section-block mt-6">
                  <h3 className="font-sans font-bold text-[12pt] uppercase border-b border-slate-300 pb-1 mb-2.5 text-slate-900">14. ENTIRE AGREEMENT</h3>
                  <p className="mb-4 text-justify text-[11pt] leading-relaxed">
                    This document constitutes the complete agreement between the Client and the Developer and supersedes any prior verbal or written agreements.
                  </p>
                </div>

                {/* Source Code Buyout Clause (Optional) */}
                {includeSourceCodeClause && (
                  <div className="section-block mt-4 mb-4 p-3 border-l-2 border-slate-700 bg-slate-50 text-[10.5pt] leading-relaxed font-sans">
                    <p className="font-bold text-slate-900">Source Code Transfer Addendum:</p>
                    <p className="text-slate-800 mt-0.5">
                      Upon full settlement of all contract fees including the buyout fee of ₱{Number(sourceCodeFee.replace(/,/g, '') || 0).toLocaleString('en-PH')}, source code repository access will be transferred to Client within {sourceCodeReleaseDays || "30"} calendar days post-settlement.
                    </p>
                  </div>
                )}

                {/* 15. Signatures Block */}
                <div className="section-block mt-8 pt-2 break-inside-avoid">
                  <h3 className="font-sans font-bold text-[12pt] uppercase border-b border-slate-300 pb-1 mb-4 text-slate-900">15. SIGNATURES</h3>
                  <p className="mb-8 text-justify text-[11pt] leading-relaxed">
                    IN WITNESS WHEREOF, the parties hereto have executed and acknowledged this Agreement as of the Effective Date written above.
                  </p>

                  {/* SIGNATURES GRID (Signature over printed name format) */}
                  <div className="grid grid-cols-2 gap-12 mt-6 font-sans">
                    {/* CLIENT */}
                    <div className="flex flex-col justify-end">
                      <p className="text-[11pt] font-black tracking-wide text-slate-950 mb-12 uppercase">
                        {selectedQuote.client_name.toUpperCase()}
                      </p>
                      <div className="border-t-2 border-slate-900 pt-1.5">
                        <p className="text-[10pt] font-bold uppercase tracking-wider text-slate-900">CLIENT</p>
                        <p className="text-[9pt] text-slate-500">Authorized Representative</p>
                      </div>
                    </div>

                    {/* DEVELOPER */}
                    <div className="flex flex-col justify-end">
                      <p className="text-[11pt] font-black tracking-wide text-slate-950 mb-12 uppercase">
                        {signatory.name.toUpperCase()}
                      </p>
                      <div className="border-t-2 border-slate-900 pt-1.5">
                        <p className="text-[10pt] font-bold uppercase tracking-wider text-slate-900">DEVELOPER / TEAM</p>
                        <p className="text-[9pt] text-slate-500">{signatory.title}</p>
                      </div>
                    </div>
                  </div>

                  {/* WITNESS / NOTARY BLOCK */}
                  {acknowledgmentStyle === "private" ? (
                    <div className="font-sans mt-10 break-inside-avoid">
                      <p className="text-[10pt] font-bold uppercase tracking-wider text-slate-900 mb-6">WITNESS SIGNATURES</p>
                      <div className="grid grid-cols-2 gap-12">
                        <div>
                          <div className="border-t border-slate-400 pt-1">
                            <p className="text-[9.5pt] font-medium text-slate-700">Witness Name &amp; Signature</p>
                          </div>
                        </div>
                        <div>
                          <div className="border-t border-slate-400 pt-1">
                            <p className="text-[9.5pt] font-medium text-slate-700">Witness Name &amp; Signature</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-[10pt] text-slate-700 font-sans mt-8 break-inside-avoid border-t border-slate-300 pt-4">
                      <p className="text-center font-bold uppercase text-[10pt] tracking-wide mb-2 text-slate-900">NOTARIAL ACKNOWLEDGEMENT</p>
                      <p className="text-justify mb-4 leading-relaxed text-[9.5pt]">
                        BEFORE ME, a Notary Public for and in the City of Digos, Davao del Sur, this day personally appeared <strong>{signatory.name}</strong> and <strong>{selectedQuote.client_name.toUpperCase()}</strong>, exhibiting their respective government-issued IDs, known to me to be the same persons who executed the foregoing Agreement.
                      </p>
                      <div className="flex justify-between items-end mt-6">
                        <div className="text-[9pt]">
                          <p>Doc. No. _____; Page No. _____; Book No. _____; Series of {new Date(effectiveDate).getFullYear()}.</p>
                        </div>
                        <div className="text-center border-t border-slate-900 w-52 pt-1 font-sans font-semibold text-slate-900 text-[9pt]">
                          {attorneyName}
                          <p className="text-[8.5pt] text-slate-500 font-normal">Notary Public / Attorney-at-Law</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center text-[9pt] text-slate-400 border-t border-slate-200 pt-3 pb-1 font-sans mt-12">
                <span>Novaryn Tech Solutions · Client System Development Agreement</span>
                <span>System Agreement Document</span>
              </div>
            </div>

          </div>

          {/* PROJECT TIMELINE MODAL */}
          {isTimelineModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 no-print">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-600">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Configure Project Timeline</h3>
                      <p className="text-xs text-slate-500">Set target dates for Section 5 of the contract</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsTimelineModalOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[70vh]">
                  {/* Estimated Build Timeframe input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Overall Estimated Build Timeframe
                    </label>
                    <input
                      type="text"
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value)}
                      placeholder="e.g. 60 Calendar Days"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-250 bg-slate-50 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-sans"
                    />
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                      Milestone Target Dates
                    </p>
                    <div className="flex flex-col gap-3">
                      {[
                        "Requirements Gathering",
                        "System Design",
                        "Development",
                        "Testing",
                        "Deployment/Implementation",
                        "Final Turnover"
                      ].map((activity) => (
                        <div key={activity} className="flex items-center justify-between gap-4">
                          <label className="text-xs font-semibold text-slate-700 w-1/2">
                            {activity}
                          </label>
                          <input
                            type="text"
                            value={timelineDates[activity] || ""}
                            onChange={(e) => setTimelineDates(prev => ({ ...prev, [activity]: e.target.value }))}
                            placeholder="e.g. Aug 15, 2026 or Day 1-10"
                            className="w-1/2 px-3 py-1.5 rounded-lg border border-slate-250 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-sans"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsTimelineModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsTimelineModalOpen(false)}
                    className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    Save &amp; Update Contract
                  </button>
                </div>
              </div>
            </div>
          )}

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
        <div className="bg-white border border-slate-200/70 rounded-2xl shadow-xs overflow-visible relative">
          <table className="w-full border-collapse text-left text-xs text-slate-500 overflow-visible">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[9px] rounded-t-2xl">
              <tr>
                <th className="px-6 py-4 font-sans rounded-tl-2xl">Client Name</th>
                <th className="px-6 py-4 font-sans">System Plan</th>
                <th className="px-6 py-4 font-sans text-right">One-time Build</th>
                <th className="px-6 py-4 font-sans text-right">Monthly Installment</th>
                <th className="px-6 py-4 font-sans text-right">Cloud Hosting &amp; DB</th>
                <th className="px-6 py-4 font-sans text-center">Installment Progress</th>
                <th className="px-6 py-4 font-sans">Saved Date</th>
                <th className="px-6 py-4 text-right font-sans rounded-tr-2xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {quotations.map((quote) => {
                const hostMod = quote.quotation_modules?.find(qm => qm.module?.category === "support")?.module;
                const hostUsdPrice = hostMod?.monthly_price || 0;
                return (
                  <tr key={quote.id} className={`hover:bg-slate-50/50 transition-colors ${quote.pending_deletion_at ? "opacity-60" : ""} relative`}>
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
                    <td className="px-6 py-4 text-right font-sans">
                      <div className="font-mono font-semibold text-slate-900">{peso(quote.build_total)}</div>
                      <div className="text-[9.5px] text-slate-400 font-normal">50% Launch: {peso(Math.round(quote.build_total * 0.5))}</div>
                    </td>
                    <td className="px-6 py-4 text-right font-sans">
                      <div className="font-mono font-semibold text-slate-900">{peso(Math.round((quote.build_total * 0.5) / 12))}/mo</div>
                      <div className="text-[9.5px] text-slate-400 font-normal">50% spread over 12 mos</div>
                    </td>
                    <td className="px-6 py-4 text-right font-sans">
                      {hostUsdPrice > 0 ? (
                        <>
                          <div className="font-mono font-semibold text-slate-900">${hostUsdPrice}/mo USD</div>
                          <div className="text-[9.5px] text-slate-400 font-normal">≈ {peso(Math.round(hostUsdPrice * 60.93))}/mo</div>
                        </>
                      ) : (
                        <>
                          <div className="font-mono font-semibold text-slate-500">$0 /mo</div>
                          <div className="text-[9.5px] text-slate-400 font-normal">Client-Managed</div>
                        </>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[9.5px] font-bold bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        0 / 12 Months Paid
                      </span>
                      <p className="text-[9px] text-slate-400 mt-0.5 font-sans font-normal">12 Months Term Remaining</p>
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
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all cursor-pointer relative z-10"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {openMenuId === quote.id && (
                            <>
                              {/* Click outside handler */}
                              <div className="fixed inset-0 z-30" onClick={() => setOpenMenuId(null)} />
                              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-slate-200 shadow-xl z-50 py-1 overflow-hidden">
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
                );
              })}
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
