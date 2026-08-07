"use client";

import React, { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Calculator, Zap, ChevronDown, ChevronRight,
  RefreshCw, Info, ToggleLeft, ToggleRight, BadgePercent,
  AlertCircle, Server, CheckCircle2, X, ArrowRight, FileText
} from "lucide-react";
import FloatingHeader from "../components/FloatingHeader";
import Footer from "../components/Footer";
import ConsultationModal from "../components/ConsultationModal";

const EMAIL = "novarynph@gmail.com";

// ─────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────

interface DBModule {
  id: string;
  plan_id: string;
  category: "build" | "support";
  name: string;
  build_price: number;
  monthly_price: number;
  complexity_score: number;
  is_required: boolean;
  enabled_by_default: boolean;
  sort_order: number;
}

interface DBPlan {
  id: string;
  name: string;
  slug: string;
  modules: DBModule[];
}

const MODULE_TIERS: Record<string, { tier: "Starter" | "Professional" | "Enterprise"; badgeColor: string }> = {
  "Custom Brand Website / CMS": { tier: "Starter", badgeColor: "bg-blue-50 text-blue-700 border-blue-100" },
  "Appointment & Slot Booking": { tier: "Starter", badgeColor: "bg-blue-50 text-blue-700 border-blue-100" },
  "Standalone POS (Point of Sale)": { tier: "Starter", badgeColor: "bg-blue-50 text-blue-700 border-blue-100" },
  "Small Inventory System": { tier: "Professional", badgeColor: "bg-amber-50 text-amber-700 border-amber-100" },
  "Customer CRM & Membership Wallet": { tier: "Professional", badgeColor: "bg-amber-50 text-amber-700 border-amber-100" },
  "E-Commerce Online Store": { tier: "Professional", badgeColor: "bg-amber-50 text-amber-700 border-amber-100" },
  "Venue / Facility Booking Grid": { tier: "Professional", badgeColor: "bg-amber-50 text-amber-700 border-amber-100" },
  "MIS Dashboard & Custom Reports": { tier: "Professional", badgeColor: "bg-amber-50 text-amber-700 border-amber-100" },
  "Big Inventory & Supply Chain": { tier: "Enterprise", badgeColor: "bg-purple-50 text-purple-700 border-purple-100" },
  "Franchise & Branch HQ Panel": { tier: "Enterprise", badgeColor: "bg-purple-50 text-purple-700 border-purple-100" },
  "Enterprise ERP & Legacy Integration": { tier: "Enterprise", badgeColor: "bg-purple-50 text-purple-700 border-purple-100" }
};

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
    "— Analytics & Reports —",
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
    "— Analytics & Reports —",
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
    "— Analytics & Reports —",
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
    "— Analytics & Reports —",
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
    "— Analytics & Reports —",
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
    "— Analytics & Reports —",
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
    "— Analytics & Reports —",
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
    "— Analytics & Reports —",
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
    "— Analytics & Reports —",
    "Branch Performance Benchmarking Dashboard",
    "Consolidated Revenue & Expense Analytics",
    "Operational Performance & Efficiency Benchmarks",
    "System Usage & Access Compliance Reports",
    "Royalty Billing & Collection Summary Ledger"
  ],
  "Enterprise ERP & Legacy Integration": [
    "Legacy DB Bridge Node Synchronization",
    "Real-time Fleet Driver Logistics sync",
    "Custom accounting API bridges",
    "Enterprise Single Sign-On Roles",
    "Active Directory Security Groups"
  ]
};

// Fallback Plan in case database connection fails or seeder hasn't run
const STATIC_PLAN = {
  id: "static-custom",
  name: "Custom System Builder",
  slug: "custom",
  modules: [
    { id: "m-booking", plan_id: "custom", category: "build", name: "Appointment & Slot Booking", build_price: 85000, monthly_price: 3500, complexity_score: 5, is_required: false, enabled_by_default: false, sort_order: 20 },
    { id: "m-pos", plan_id: "custom", category: "build", name: "Standalone POS (Point of Sale)", build_price: 100000, monthly_price: 4000, complexity_score: 5, is_required: false, enabled_by_default: false, sort_order: 30 },
    { id: "m-inventory-sm", plan_id: "custom", category: "build", name: "Small Inventory System", build_price: 100000, monthly_price: 5000, complexity_score: 6, is_required: false, enabled_by_default: false, sort_order: 40 },
    { id: "m-crm", plan_id: "custom", category: "build", name: "Customer CRM & Membership Wallet", build_price: 90000, monthly_price: 4500, complexity_score: 6, is_required: false, enabled_by_default: false, sort_order: 50 },
    { id: "m-ecommerce", plan_id: "custom", category: "build", name: "E-Commerce Online Store", build_price: 130000, monthly_price: 6000, complexity_score: 7, is_required: false, enabled_by_default: false, sort_order: 60 },
    { id: "m-booking-grid", plan_id: "custom", category: "build", name: "Venue / Facility Booking Grid", build_price: 120000, monthly_price: 5500, complexity_score: 7, is_required: false, enabled_by_default: false, sort_order: 70 },
    { id: "m-mis", plan_id: "custom", category: "build", name: "MIS Dashboard & Custom Reports", build_price: 140000, monthly_price: 7000, complexity_score: 8, is_required: false, enabled_by_default: false, sort_order: 80 },
    { id: "m-inventory-lg", plan_id: "custom", category: "build", name: "Big Inventory & Supply Chain", build_price: 450000, monthly_price: 18000, complexity_score: 9, is_required: false, enabled_by_default: false, sort_order: 90 },
    { id: "m-franchise", plan_id: "custom", category: "build", name: "Franchise & Branch HQ Panel", build_price: 350000, monthly_price: 15000, complexity_score: 9, is_required: false, enabled_by_default: false, sort_order: 100 },
    { id: "m-erp", plan_id: "custom", category: "build", name: "Enterprise ERP & Legacy Integration", build_price: 600000, monthly_price: 25000, complexity_score: 10, is_required: false, enabled_by_default: false, sort_order: 110 },
    // support modules
    { id: "h-starter", plan_id: "custom", category: "support", name: "Basic Server & DB (Starter Host)", build_price: 0, monthly_price: 35, complexity_score: 1, is_required: false, enabled_by_default: false, sort_order: 200 },
    { id: "h-pro", plan_id: "custom", category: "support", name: "Advanced Server & DB (Pro Host)", build_price: 0, monthly_price: 100, complexity_score: 1, is_required: false, enabled_by_default: false, sort_order: 210 },
    { id: "h-ent", plan_id: "custom", category: "support", name: "High-Availability Cloud Network (Enterprise Host)", build_price: 0, monthly_price: 330, complexity_score: 1, is_required: false, enabled_by_default: false, sort_order: 220 }
  ]
};

function PricingEngineComponent() {
  const searchParams = useSearchParams();
  const preset = searchParams.get("preset");

  const [plan, setPlan] = useState<DBPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [consultationMessage, setConsultationMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const [enabledModuleIds, setEnabledModuleIds] = useState<Set<string>>(new Set());
  const [selectedHostId, setSelectedHostId] = useState<string>("none");
  const [includeMaintenance, setIncludeMaintenance] = useState(true);

  // Group Expand states
  const [starterOpen, setStarterOpen] = useState(true);
  const [proOpen, setProOpen] = useState(true);
  const [enterpriseOpen, setEnterpriseOpen] = useState(true);
  const [hostingOpen, setHostingOpen] = useState(true);

  const [isSlaModalOpen, setIsSlaModalOpen] = useState(false);
  const [isMobileQuotationOpen, setIsMobileQuotationOpen] = useState(false);
  const [mobileDrawerModule, setMobileDrawerModule] = useState<DBModule | null>(null);

  // USD → PHP Exchange Rate
  const [usdRate, setUsdRate] = useState<number>(57);
  const [rateDate, setRateDate] = useState<string>("");

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  // Load plans & modules from public API
  const fetchPricingData = useCallback(async () => {
    setLoading(true);
    setError("");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    try {
      const res = await fetch(`${apiUrl}/public/pricing/plans`);
      if (!res.ok) {
        throw new Error("Unable to retrieve custom plans from database.");
      }
      const json = await res.json();
      const customPlan = json.data?.find((p: DBPlan) => p.slug === "custom") || json.data?.[0];

      if (customPlan) {
        setPlan(customPlan);
        const defaults = new Set<string>();
        customPlan.modules.forEach((mod: DBModule) => {
          if (mod.category === "build" && (mod.is_required || mod.enabled_by_default)) {
            defaults.add(mod.id);
          }
        });
        setEnabledModuleIds(defaults);

        const hosts = customPlan.modules.filter((mod: DBModule) => mod.category === "support");
        if (hosts.length > 0) {
          setSelectedHostId(hosts[0].id);
        }
      } else {
        throw new Error("No custom plans found.");
      }
    } catch (err: any) {
      console.warn("Pricing DB load failed, loading static fallback module configurations.", err);
      setPlan(STATIC_PLAN as any);
      const defaults = new Set<string>();
      STATIC_PLAN.modules.forEach((mod) => {
        if (mod.category === "build" && (mod.is_required || mod.enabled_by_default)) {
          defaults.add(mod.id);
        }
      });
      setEnabledModuleIds(defaults);

      const hosts = STATIC_PLAN.modules.filter((mod) => mod.category === "support");
      if (hosts.length > 0) {
        setSelectedHostId(hosts[0].id);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPricingData();
  }, [fetchPricingData]);

  // Load exchange rate
  useEffect(() => {
    const CACHE_KEY = "novaryn_usd_php_rate";
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { rate, date } = JSON.parse(cached);
        const cachedDate = new Date(date).toDateString();
        const today = new Date().toDateString();
        if (cachedDate === today) {
          setUsdRate(rate);
          setRateDate(date);
          return;
        }
      } catch {}
    }
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((r) => r.json())
      .then((data) => {
        const rate = data?.rates?.PHP;
        if (rate) {
          const date = new Date().toISOString();
          setUsdRate(rate);
          setRateDate(date);
          localStorage.setItem(CACHE_KEY, JSON.stringify({ rate, date }));
        }
      })
      .catch(() => {});
  }, []);

  const buildModules = useMemo(() => {
    if (!plan) return [];
    return plan.modules.filter((m) => m.category === "build");
  }, [plan]);

  const hostingModules = useMemo(() => {
    if (!plan) return [];
    return plan.modules.filter((m) => m.category === "support");
  }, [plan]);

  // Handle preset URL mapping
  useEffect(() => {
    if (plan && buildModules.length > 0) {
      if (preset === "sports") {
        const selected = new Set<string>();
        const m1 = buildModules.find((m) => m.name === "Appointment & Slot Booking");
        const m2 = buildModules.find((m) => m.name === "Standalone POS (Point of Sale)");
        const m3 = buildModules.find((m) => m.name === "Venue / Facility Booking Grid");
        if (m1) selected.add(m1.id);
        if (m2) selected.add(m2.id);
        if (m3) selected.add(m3.id);
        setEnabledModuleIds(selected);

        const host = hostingModules.find((h) => h.name === "Basic Server & DB (Starter Host)");
        if (host) setSelectedHostId(host.id);
      } else if (preset === "clinic") {
        const selected = new Set<string>();
        const m1 = buildModules.find((m) => m.name === "Appointment & Slot Booking");
        const m2 = buildModules.find((m) => m.name === "Small Inventory System");
        const m3 = buildModules.find((m) => m.name === "Customer CRM & Membership Wallet");
        if (m1) selected.add(m1.id);
        if (m2) selected.add(m2.id);
        if (m3) selected.add(m3.id);
        setEnabledModuleIds(selected);

        const host = hostingModules.find((h) => h.name === "Advanced Server & DB (Pro Host)");
        if (host) setSelectedHostId(host.id);
      } else if (preset === "enterprise") {
        const selected = new Set<string>();
        const m1 = buildModules.find((m) => m.name === "Big Inventory & Supply Chain");
        const m2 = buildModules.find((m) => m.name === "Franchise & Branch HQ Panel");
        const m3 = buildModules.find((m) => m.name === "MIS Dashboard & Custom Reports");
        if (m1) selected.add(m1.id);
        if (m2) selected.add(m2.id);
        if (m3) selected.add(m3.id);
        setEnabledModuleIds(selected);

        const host = hostingModules.find((h) => h.name === "High-Availability Cloud Network (Enterprise Host)");
        if (host) setSelectedHostId(host.id);
      }
    }
  }, [preset, plan, buildModules, hostingModules]);

  const categorizedModules = useMemo(() => {
    const starter: DBModule[] = [];
    const pro: DBModule[] = [];
    const ent: DBModule[] = [];

    buildModules.forEach((m) => {
      const lookup = MODULE_TIERS[m.name];
      if (lookup?.tier === "Enterprise") {
        ent.push(m);
      } else if (lookup?.tier === "Professional") {
        pro.push(m);
      } else {
        starter.push(m);
      }
    });

    return { starter, pro, ent };
  }, [buildModules]);

  const handleToggleModule = (id: string) => {
    setEnabledModuleIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleReset = () => {
    setEnabledModuleIds(new Set());
    setSelectedHostId("none");
  };

  // Computations (50% Minimum Downpayment Rule applied)
  const calculations = useMemo(() => {
    let buildTotal = 0;
    let maintenanceTotal = 0;
    let complexitySum = 0;
    let activeBuildModulesCount = 0;

    buildModules.forEach((m) => {
      // Exclude custom brand from calculations if toggled somehow
      if (m.name === "Custom Brand Website / CMS") return;

      if (enabledModuleIds.has(m.id)) {
        buildTotal += m.build_price;
        maintenanceTotal += m.monthly_price;
        complexitySum += m.complexity_score;
        activeBuildModulesCount++;
      }
    });

    const hostMod = hostingModules.find((h) => h.id === selectedHostId);
    const hostCostUsd = hostMod ? hostMod.monthly_price : 0;
    const hostCostPhp = Math.round(hostCostUsd * usdRate);

    const monthlyTotal = (includeMaintenance ? maintenanceTotal : 0) + hostCostPhp;
    const complexityAvg = activeBuildModulesCount > 0 ? Math.round(complexitySum / activeBuildModulesCount) : 0;

    return {
      buildTotal,
      rawMaintenanceTotal: maintenanceTotal,
      maintenanceTotal: includeMaintenance ? maintenanceTotal : 0,
      hostCostUsd,
      hostCostPhp,
      monthlyTotal,
      complexityAvg,
      activeCount: activeBuildModulesCount,
      totalCount: buildModules.length - 1 // Subtract Custom Brand Website/CMS
    };
  }, [buildModules, hostingModules, enabledModuleIds, selectedHostId, usdRate, includeMaintenance]);

  const peso = (n: number) => "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 0 });
  const usd = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
  const hostPhp = (usdAmt: number) => Math.round(usdAmt * usdRate);

  // Generate Consultation prefill description
  const handleOpenConsultation = () => {
    const selectedNames = Array.from(enabledModuleIds)
      .map((id) => buildModules.find((m) => m.id === id)?.name)
      .filter(Boolean);
    const hostName = hostingModules.find((h) => h.id === selectedHostId)?.name || "Client-Managed Hosting";

    const text = `Hi, I built a custom system estimate on your Pricing Engine. Here are my selected configurations:

🚀 Selected Build Modules:
${selectedNames.length > 0 ? selectedNames.map(name => `• ${name}`).join("\n") : "• None selected"}

🌐 Hosting & Infrastructure Tier:
• ${hostName}

💰 Estimated Cost Breakdown:
• Total Build Contract Value: ${peso(calculations.buildTotal)}
• 50% Production Downpayment: ${peso(Math.round(calculations.buildTotal * 0.50))}
• Estimated Monthly Installment: ${peso(calculations.monthlyTotal)}/mo (includes monthly support & cloud server charges)

Let's schedule a call to review these options.`;

    setConsultationMessage(text);
    setConsultationOpen(true);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex flex-col font-sans selection:bg-emerald-50 selection:text-emerald-900">
      
      {/* Floating Header */}
      <FloatingHeader
        email={EMAIL}
        onCopySuccess={triggerToast}
        onOpenConsultation={() => {
          setConsultationMessage("");
          setConsultationOpen(true);
        }}
      />

      <main className="flex-grow pt-32 pb-24 max-w-6xl mx-auto px-6 flex flex-col gap-6 text-left">
        
        {/* Page Header (Matches Admin Dashboard structure 1-to-1) */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calculator className="w-4.5 h-4.5 text-emerald-505 text-emerald-600" />
              <h1 className="text-lg font-semibold text-slate-900">Custom System Pricing Engine</h1>
            </div>
            <p className="text-[12px] text-slate-505 text-slate-500">
              A modular quotation builder. Toggle systems and select a hosting tier to instantly calculate the total contract value, production launch payment, and monthly installment schedule.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 self-start">
            <Zap className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span className="text-[11px] font-semibold text-emerald-700">Custom Module Builder</span>
          </div>
        </div>

        {/* Live Summary Bar (Matches Admin Dashboard structure 1-to-1) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-white border border-slate-200/70 rounded-xl p-3 sm:p-4 shadow-sm text-left">
            <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-slate-400">Total Contract Value</p>
            <p className="text-lg sm:text-2xl font-semibold text-slate-900 mt-1 tracking-tight">{peso(calculations.buildTotal)}</p>
            <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1">Full project baseline</p>
          </div>
          <div className="bg-white border border-slate-200/70 rounded-xl p-3 sm:p-4 shadow-sm text-left">
            <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-slate-400">Production Launch (50%)</p>
            <p className="text-lg sm:text-2xl font-semibold text-slate-900 mt-1 tracking-tight">
              {peso(Math.round(calculations.buildTotal * 0.5))}
            </p>
            <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1">Paid upon go-live</p>
          </div>
          <div className="bg-white border border-slate-200/70 rounded-xl p-3 sm:p-4 shadow-sm text-left">
            <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-slate-400">Cloud Hosting / Mo</p>
            <p className="text-lg sm:text-2xl font-semibold text-slate-900 mt-1 tracking-tight">
              {usd(calculations.hostCostUsd)}<span className="text-xs text-slate-400 font-normal">/mo</span>
            </p>
            <p className="text-[9px] sm:text-[10px] text-slate-500 mt-1">
              ≈ {peso(calculations.hostCostPhp)}/mo · ₱{usdRate.toFixed(2)}/$
            </p>
          </div>
          <div className="bg-white border border-slate-200/70 rounded-xl p-3 sm:p-4 shadow-sm bg-emerald-50/20 border-emerald-100 text-left">
            <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-emerald-700">Monthly Installment</p>
            <p className="text-lg sm:text-2xl font-semibold text-emerald-600 mt-1 tracking-tight">
              {peso(Math.round(calculations.buildTotal * 0.5 / 12) + calculations.hostCostPhp)}<span className="text-xs text-emerald-700 font-normal">/mo</span>
            </p>
            <p className="text-[9px] sm:text-[10px] text-slate-500 mt-1">50% / 12mo (₱) + Cloud ($)</p>
          </div>
        </div>

        {/* Main Grid Layout (Clones Admin 1-to-1) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 items-start">
          
          {/* Left panel: Module Selectors */}
          <div className="flex flex-col gap-4">
            <div className="bg-white border border-slate-200/70 rounded-2xl overflow-hidden shadow-sm">
              
              {/* Card Header (Matches Admin Dashboard 1-to-1) */}
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Select System Modules</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {calculations.activeCount} modules active · Complexity avg {calculations.complexityAvg}/10
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="text-[10px] text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 cursor-pointer bg-transparent border-0 outline-none"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset Selections
                </button>
              </div>

              {/* Modules List Container (Matches Admin 1-to-1) */}
              <div className="p-5 flex flex-col gap-5">
                
                {/* 1. Starter Modules Category (Custom Brand Website/CMS excluded!) */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setStarterOpen(!starterOpen)}
                    className="flex items-center justify-between text-left pb-1 border-b border-slate-100 cursor-pointer w-full bg-transparent border-0 outline-none"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700">
                      Starter Modules (Brochure / Small backend)
                    </span>
                    {starterOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                  </button>
                  {starterOpen && (
                    <div className="flex flex-col gap-2 mt-1">
                      {categorizedModules.starter
                        .filter((mod) => mod.name !== "Custom Brand Website / CMS")
                        .map((mod) => (
                          <ModuleRow
                            key={mod.id}
                            mod={mod}
                            enabled={enabledModuleIds.has(mod.id)}
                            onToggle={handleToggleModule}
                            onViewFeatures={setMobileDrawerModule}
                            launchPct={50}
                          />
                        ))}
                    </div>
                  )}
                </div>

                {/* 2. Professional Modules Category */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setProOpen(!proOpen)}
                    className="flex items-center justify-between text-left pb-1 border-b border-slate-100 cursor-pointer w-full bg-transparent border-0 outline-none"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
                      Professional Modules (Mid-tier operations)
                    </span>
                    {proOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                  </button>
                  {proOpen && (
                    <div className="flex flex-col gap-2 mt-1">
                      {categorizedModules.pro.map((mod) => (
                        <ModuleRow
                          key={mod.id}
                          mod={mod}
                          enabled={enabledModuleIds.has(mod.id)}
                          onToggle={handleToggleModule}
                          onViewFeatures={setMobileDrawerModule}
                          launchPct={50}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Enterprise Modules Category */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setEnterpriseOpen(!enterpriseOpen)}
                    className="flex items-center justify-between text-left pb-1 border-b border-slate-100 cursor-pointer w-full bg-transparent border-0 outline-none"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest text-purple-700">
                      Enterprise Modules (Large business / 2+ branches)
                    </span>
                    {enterpriseOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                  </button>
                  {enterpriseOpen && (
                    <div className="flex flex-col gap-2 mt-1">
                      {categorizedModules.ent.map((mod) => (
                        <ModuleRow
                          key={mod.id}
                          mod={mod}
                          enabled={enabledModuleIds.has(mod.id)}
                          onToggle={handleToggleModule}
                          onViewFeatures={setMobileDrawerModule}
                          launchPct={50}
                        />
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* Hosting Infrastructure Card (Matches Admin 1-to-1) */}
            <div className="bg-white border border-slate-200/70 rounded-2xl overflow-hidden shadow-sm p-5">
              <button
                onClick={() => setHostingOpen(!hostingOpen)}
                className="flex items-center justify-between w-full text-left cursor-pointer bg-transparent border-0 outline-none"
              >
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-500" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-700">
                    Infrastructure & Database Hosting Plan
                  </span>
                </div>
                {hostingOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
              </button>

              {hostingOpen && (
                <div className="mt-4 flex flex-col gap-3">
                  <p className="text-[11px] text-slate-500">
                    Who hosts the system? If you handle hosting, we recommend adding this infrastructure charge to cover monthly cloud resource bills.
                  </p>

                  <div className="grid grid-cols-1 gap-2.5">
                    {/* Client Managed option */}
                    <label
                      className={`flex items-start justify-between p-3 border rounded-xl cursor-pointer transition-all ${
                        selectedHostId === "none"
                          ? "border-emerald-500 bg-emerald-50/10"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <input
                          type="radio"
                          name="hostingPlanPublic"
                          checked={selectedHostId === "none"}
                          onChange={() => setSelectedHostId("none")}
                          className="mt-0.5 accent-emerald-600 cursor-pointer"
                        />
                        <div>
                          <p className="text-[12px] font-semibold text-slate-700">Client-Managed Hosting</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Deploy directly to client's AWS, DigitalOcean, or Vercel account.</p>
                        </div>
                      </div>
                      <span className="text-[12px] font-bold text-slate-805">₱0</span>
                    </label>

                    {/* Dynamic Hosting Options from DB */}
                    {hostingModules.map((host) => (
                      <label
                        key={host.id}
                        className={`flex items-start justify-between p-3 border rounded-xl cursor-pointer transition-all ${
                          selectedHostId === host.id
                            ? "border-emerald-500 bg-emerald-50/10"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <input
                            type="radio"
                            name="hostingPlanPublic"
                            checked={selectedHostId === host.id}
                            onChange={() => setSelectedHostId(host.id)}
                            className="mt-0.5 accent-emerald-600 cursor-pointer"
                          />
                          <div>
                            <p className="text-[12px] font-semibold text-slate-700">{host.name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Managed deployment with regular monitoring and DB backups.</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <p className="text-[12px] font-bold text-slate-805">{usd(host.monthly_price)}<span className="text-[9px] text-slate-400 font-normal">/mo</span></p>
                          <p className="text-[9px] text-slate-400">≈ {peso(hostPhp(host.monthly_price))}/mo</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Panel: Clones Admin Quotation visual receipt style box */}
          <div className="bg-white border border-slate-200/70 rounded-2xl overflow-hidden shadow-sm sticky top-28">
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BadgePercent className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-semibold text-slate-900">Estimate Summary</h3>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                Estimated pricing totals are calculated live based on current selections.
              </p>
            </div>

            <div className="p-5 flex flex-col gap-4">
              
              {/* SLA Scope Info */}
              <div className="flex items-center justify-between p-3.5 border border-emerald-100 rounded-xl bg-emerald-50/40">
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-[12px] font-semibold text-emerald-800">3 Months Free Bug Fixes Included</p>
                    <button
                      type="button"
                      onClick={() => setIsSlaModalOpen(true)}
                      className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer underline decoration-dotted bg-transparent border-0 outline-none p-0"
                    >
                      View Scope
                    </button>
                  </div>
                  <p className="text-[10px] text-emerald-600 mt-0.5">Year 2+: Pay-as-you-go — ₱0 if no issues occur.</p>
                </div>
              </div>

              {/* Price Preview List (Clones Admin Pricing Summary table 1-to-1) */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex flex-col gap-2">
                <div className="flex justify-between items-center text-[12px] text-left">
                  <span className="text-slate-500">Total Contract Value (PHP)</span>
                  <span className="font-semibold text-slate-900">{peso(calculations.buildTotal)}</span>
                </div>
                <div className="flex justify-between items-center text-[12px] text-slate-700 text-left">
                  <span>Production Launch (50%)</span>
                  <span className="font-semibold">{peso(Math.round(calculations.buildTotal * 0.5))}</span>
                </div>
                <div className="flex justify-between items-center text-[12px] border-b border-dashed border-slate-200 pb-2 text-left">
                  <span className="text-slate-500">Monthly Installment (50% / 12mo)</span>
                  <span className="font-semibold text-slate-900">{peso(Math.round(calculations.buildTotal * 0.5 / 12))}/mo</span>
                </div>
                <div className="flex justify-between items-center text-[12px] border-b border-dashed border-slate-200 pb-2 text-left">
                  <span className="text-slate-500">Cloud Hosting Fee (USD)</span>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">{usd(calculations.hostCostUsd)}/mo</p>
                    <p className="text-[9px] text-slate-400">≈ {peso(calculations.hostCostPhp)}/mo</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-[13px] pt-1 text-left">
                  <span className="font-semibold text-emerald-800">Total Monthly (₱ Installment + $ Cloud)</span>
                  <span className="font-bold text-emerald-600">
                    {peso(Math.round(calculations.buildTotal * 0.5 / 12) + calculations.hostCostPhp)}
                    <span className="text-[9px] text-slate-400 font-normal">/mo</span>
                  </span>
                </div>
              </div>

              {/* Consultation trigger CTA */}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleOpenConsultation}
                  className="flex items-center justify-center gap-2 flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[12px] font-semibold transition-all cursor-pointer shadow-sm active:scale-95 border-0 outline-none"
                >
                  <ArrowRight className="w-3.5 h-3.5" /> Book Free Consultation
                </button>
              </div>

            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <Footer email={EMAIL} />

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={consultationOpen}
        onClose={() => setConsultationOpen(false)}
        initialMessage={consultationMessage}
      />

      {/* SLA Scope Modal */}
      {isSlaModalOpen && (
        <div className="fixed inset-0 bg-slate-900/25 backdrop-blur-[2px] flex items-center justify-center z-[80] animate-fade-in p-4">
          <div className="bg-white rounded-2xl border border-slate-250 max-w-[500px] w-full p-6 shadow-xl flex flex-col gap-4 animate-scale-up text-left font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-805 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Novaryn Maintenance SLA Scope
              </h3>
              <button
                onClick={() => setIsSlaModalOpen(false)}
                className="text-slate-400 hover:text-slate-650 text-xs font-bold font-mono cursor-pointer bg-transparent border-0 outline-none"
              >
                ✕ Close
              </button>
            </div>
            
            <div className="text-[12px] text-slate-600 flex flex-col gap-3">
              <div>
                <p className="font-bold text-emerald-700 uppercase tracking-wide text-[10px] mb-1">✅ What's Included</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Security Audits & Firewall Patches:</strong> Routine package upgrades to prevent exploits.</li>
                  <li><strong>Core Database Backups:</strong> Secure daily backups with automated retention configs.</li>
                  <li><strong>Critical Bug Fixes:</strong> Direct hot-fixes to solve crashes or functional system locks.</li>
                  <li><strong>Uptime Monitoring:</strong> 24/7 endpoint checks to ensure gateway is active.</li>
                  <li><strong>Minor Tweaks:</strong> Up to 2 hours of content text/image alterations monthly.</li>
                </ul>
              </div>
              
              <div className="border-t border-slate-150 pt-3">
                <p className="font-bold text-red-600 uppercase tracking-wide text-[10px] mb-1">❌ What's NOT Included (Exclusions)</p>
                <ul className="list-disc pl-5 space-y-1 text-slate-500">
                  <li><strong className="text-red-500">New Feature Development:</strong> Coding new dashboards, pages, or modular business engines.</li>
                  <li><strong>Third-Party Integrations Billing:</strong> Subscriptions for SMS gateways, domain names, or mail lists.</li>
                  <li><strong>Self-Inflicted Damage:</strong> Fixing errors introduced by admin server-level credentials overrides.</li>
                  <li><strong>On-Site SLA:</strong> Office hardware repairs or dedicated in-person training pipelines.</li>
                </ul>
              </div>
            </div>
            
            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsSlaModalOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer border-0 outline-none"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MOBILE FEATURES BOTTOM DRAWER ── */}
      {mobileDrawerModule && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/40 z-[60] lg:hidden"
            onClick={() => setMobileDrawerModule(null)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-[70] lg:hidden bg-white rounded-t-2xl shadow-2xl border-t border-slate-200 animate-slide-up text-left">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-slate-200 rounded-full" />
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">What's Included</p>
                <p className="text-[13px] font-bold text-slate-800 mt-0.5">{mobileDrawerModule.name}</p>
              </div>
              <button
                onClick={() => setMobileDrawerModule(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer bg-transparent border-0 outline-none"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
            <div className="px-5 pt-3 pb-8 flex flex-col gap-2 max-h-[60vh] overflow-y-auto font-sans">
              {(MODULE_FEATURES[mobileDrawerModule.name] || []).map((feat, idx) =>
                feat.startsWith("—") ? (
                  <div key={idx} className="flex items-center gap-2 mt-3 mb-1">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 shrink-0">{feat.replace(/^—\s*/, "").replace(/\s*—$/, "")}</span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>
                ) : (
                  <div key={idx} className="flex items-start gap-3 py-1.5 border-b border-slate-50 last:border-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-[13px] text-slate-700 font-medium">{feat}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </>
      )}

      {/* Global Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-slate-800 text-white text-xs font-semibold px-4 py-3.5 rounded-xl shadow-2xl flex items-center gap-2.5 z-55 animate-in fade-in slide-in-from-bottom-5 duration-250">
          <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          </div>
          <span>Email copied: <strong>{EMAIL}</strong></span>
        </div>
      )}

    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────

interface ModuleRowProps {
  mod: DBModule;
  enabled: boolean;
  onToggle: (id: string) => void;
  onViewFeatures?: (mod: DBModule) => void;
  launchPct: number;
}

function ModuleRow({ mod, enabled, onToggle, onViewFeatures, launchPct }: ModuleRowProps) {
  const lookup = MODULE_TIERS[mod.name];
  const features = MODULE_FEATURES[mod.name] || [];

  const peso = (n: number) => "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 0 });

  return (
    <div
      className={`flex flex-col rounded-lg border transition-all select-none ${
        enabled
          ? "bg-white border-slate-200/80 shadow-sm"
          : "bg-slate-50/50 border-transparent opacity-60 hover:opacity-80"
      }`}
    >
      {/* DESKTOP ROW LAYOUT */}
      <div
        onClick={() => onToggle(mod.id)}
        className="hidden sm:flex items-center justify-between py-2.5 px-3 cursor-pointer"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="shrink-0 text-slate-350 transition-colors">
            {enabled ? (
              <ToggleRight className="w-5 h-5 text-emerald-500" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-slate-300" />
            )}
          </div>
          <div className="min-w-0 text-left">
            <div className="flex items-center gap-2">
              <p className="text-[12px] font-semibold text-slate-700 truncate">{mod.name}</p>
              {lookup && (
                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full border tracking-wide uppercase shrink-0 ${lookup.badgeColor}`}>
                  {lookup.tier}
                </span>
              )}
            </div>
            <ComplexityBar score={mod.complexity_score} />
          </div>
        </div>
        <div className="flex items-center gap-5 shrink-0 text-right">
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wide">Build</p>
            <p className={`text-[12px] font-semibold ${enabled ? "text-slate-800" : "text-slate-400"}`}>
              {peso(mod.build_price)}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wide">Installment</p>
            <p className={`text-[12px] font-semibold ${enabled ? "text-slate-800" : "text-slate-400"}`}>
              +{peso(Math.round(mod.build_price * (1 - launchPct / 100) / 12))}/mo
            </p>
          </div>
        </div>
      </div>

      {/* MOBILE ROW LAYOUT */}
      <div className="sm:hidden flex flex-col">
        <div
          onClick={() => onToggle(mod.id)}
          className="flex items-center gap-3 px-3 pt-3 pb-2 cursor-pointer text-left"
        >
          <div className="shrink-0">
            {enabled ? (
              <ToggleRight className="w-5 h-5 text-emerald-500" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-slate-300" />
            )}
          </div>
          <p className={`text-[13px] font-bold leading-snug flex-1 min-w-0 transition-colors ${
            enabled ? "text-slate-800" : "text-slate-500"
          }`}>{mod.name}</p>
        </div>

        <div
          onClick={() => onToggle(mod.id)}
          className="flex items-center justify-between px-3 pb-2 cursor-pointer"
        >
          <ComplexityBar score={mod.complexity_score} />
          {lookup && (
            <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full border tracking-widest uppercase shrink-0 ${lookup.badgeColor}`}>
              {lookup.tier}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between px-3 pb-3 border-t border-slate-100/50 pt-2 bg-slate-50/10 text-left">
          <div>
            <span className="text-[9px] text-slate-400 uppercase tracking-wide block">Build Price</span>
            <span className="text-[12px] font-bold text-slate-700">{peso(mod.build_price)}</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-slate-400 uppercase tracking-wide block">Installment</span>
            <span className="text-[12px] font-bold text-slate-700">+{peso(Math.round(mod.build_price * (1 - launchPct / 100) / 12))}/mo</span>
          </div>
        </div>
      </div>

      {/* Expanded Features List (Desktop only) */}
      {enabled && features.length > 0 && (
        <div className="hidden sm:block px-3 pb-3 pt-2.5 border-t border-slate-100 bg-slate-50/20 text-[11px] text-slate-500 animate-fade-in text-left">
          <p className="font-bold text-slate-700 mb-2">What's Included:</p>
          <ul className="flex flex-col gap-1.5 mt-1">
            {features.map((feat, idx) =>
              feat.startsWith("—") ? (
                <li key={idx} className="flex items-center gap-2 mt-2 mb-0.5">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 shrink-0">{feat.replace(/^—\s*/, "").replace(/\s*—$/, "")}</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </li>
              ) : (
                <li key={idx} className="flex items-center gap-1.5 text-slate-655 text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{feat}</span>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function ComplexityBar({ score }: { score: number }) {
  return (
    <div className="flex gap-0.5 items-center mt-0.5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 w-1.5 rounded-full transition-colors ${
            i < score
              ? score <= 3
                ? "bg-emerald-400"
                : score <= 6
                ? "bg-amber-400"
                : "bg-red-400"
              : "bg-slate-200"
          }`}
        />
      ))}
      <span className="ml-1 text-[9px] text-slate-400 font-mono">{score}/10</span>
    </div>
  );
}

export default function PublicPricingEnginePage() {
  return (
    <Suspense fallback={
      <div className="bg-[#F8FAFC] min-h-screen flex flex-col justify-center items-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-250 border-t-emerald-600 rounded-full animate-spin"></div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">
            Loading Public Pricing Engine...
          </span>
        </div>
      </div>
    }>
      <PricingEngineComponent />
    </Suspense>
  );
}
