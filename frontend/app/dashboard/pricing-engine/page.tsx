"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Calculator, Zap, ChevronDown, ChevronRight,
  Save, Send, RefreshCw, Info,
  ToggleLeft, ToggleRight, BadgePercent, Lock,
  AlertCircle, Server, CreditCard, CheckCircle2,
  X, FileText
} from "lucide-react";

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

// Static Tier Lookup for UI Categorization
const MODULE_TIERS: Record<string, { tier: "Starter" | "Professional" | "Enterprise"; badgeColor: string }> = {
  "Custom Brand Website / CMS": { tier: "Starter", badgeColor: "bg-blue-50 text-blue-700 border-blue-100 animate-fade-in" },
  "Appointment & Slot Booking": { tier: "Starter", badgeColor: "bg-blue-50 text-blue-700 border-blue-100 animate-fade-in" },
  "Standalone POS (Point of Sale)": { tier: "Starter", badgeColor: "bg-blue-50 text-blue-700 border-blue-100 animate-fade-in" },
  "Small Inventory System": { tier: "Professional", badgeColor: "bg-amber-50 text-amber-700 border-amber-100 animate-fade-in" },
  "Customer CRM & Membership Wallet": { tier: "Professional", badgeColor: "bg-amber-50 text-amber-700 border-amber-100 animate-fade-in" },
  "E-Commerce Online Store": { tier: "Professional", badgeColor: "bg-amber-50 text-amber-700 border-amber-100 animate-fade-in" },
  "Venue / Facility Booking Grid": { tier: "Professional", badgeColor: "bg-amber-50 text-amber-700 border-amber-100 animate-fade-in" },
  "MIS Dashboard & Custom Reports": { tier: "Professional", badgeColor: "bg-amber-50 text-amber-700 border-amber-100 animate-fade-in" },
  "Big Inventory & Supply Chain": { tier: "Enterprise", badgeColor: "bg-purple-50 text-purple-700 border-purple-100 animate-fade-in" },
  "Franchise & Branch HQ Panel": { tier: "Enterprise", badgeColor: "bg-purple-50 text-purple-700 border-purple-100 animate-fade-in" },
  "Enterprise ERP & Legacy Integration": { tier: "Enterprise", badgeColor: "bg-purple-50 text-purple-700 border-purple-100 animate-fade-in" }
};

// Static Feature Bulletpoints for Module Expansion
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

// ─────────────────────────────────────────────────────────────────
// HELPERS & FORMATTERS
// ─────────────────────────────────────────────────────────────────

const peso = (n: number) =>
  "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 0 });

// ─────────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────

export default function PricingEnginePage() {
  // DB & State Loading
  const [plan, setPlan] = useState<DBPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  // Selections
  const [enabledModuleIds, setEnabledModuleIds] = useState<Set<string>>(new Set());
  const [selectedHostId, setSelectedHostId] = useState<string>("none");
  const [includeMaintenance, setIncludeMaintenance] = useState(true);

  // Launch Payment Percentage (configurable, default 50%)
  const [launchPct, setLaunchPct] = useState(50);
  const [customPctInput, setCustomPctInput] = useState("");

  // Client Details Form
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [notes, setNotes] = useState("");

  const [isSlaModalOpen, setIsSlaModalOpen] = useState(false);
  const [isMobileQuotationOpen, setIsMobileQuotationOpen] = useState(false);
  const [mobileDrawerModule, setMobileDrawerModule] = useState<DBModule | null>(null);

  // Toast Auto-Dismiss
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Load prefill URL query parameters (Safe window detection)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const nameParam = params.get("name");
      const emailParam = params.get("email");
      const phoneParam = params.get("phone");
      const addressParam = params.get("address");

      if (nameParam) setClientName(nameParam);
      if (emailParam) setClientEmail(emailParam);
      if (phoneParam) setClientPhone(phoneParam);
      if (addressParam) setClientAddress(addressParam);
    }
  }, []);

  const handleDownpaymentChange = (val: string) => {
    const cleaned = val.replace(/,/g, "").replace(/\D/g, "");
    const num = cleaned ? parseInt(cleaned, 10) : 0;
    setDownpayment(num);
    setDownpaymentInput(cleaned ? Number(cleaned).toLocaleString("en-PH") : "");
  };

  // Group Expand states
  const [starterOpen, setStarterOpen] = useState(true);
  const [proOpen, setProOpen] = useState(true);
  const [enterpriseOpen, setEnterpriseOpen] = useState(true);
  const [hostingOpen, setHostingOpen] = useState(true);

  // Load from API
  const fetchPricingData = useCallback(async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("novaryn_admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    try {
      const res = await fetch(`${apiUrl}/pricing/plans`, {
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
        throw new Error("Unable to retrieve custom plans from database.");
      }
      const json = await res.json();
      const customPlan = json.data?.find((p: DBPlan) => p.slug === "custom") || json.data?.[0];

      if (customPlan) {
        setPlan(customPlan);
        // Pre-fill defaults
        const defaults = new Set<string>();
        customPlan.modules.forEach((mod: DBModule) => {
          if (mod.category === "build" && (mod.is_required || mod.enabled_by_default)) {
            defaults.add(mod.id);
          }
        });
        setEnabledModuleIds(defaults);

        // Pre-select first hosting option if available
        const hosts = customPlan.modules.filter((mod: DBModule) => mod.category === "support");
        if (hosts.length > 0) {
          setSelectedHostId(hosts[0].id);
        }
      } else {
        throw new Error("No custom system plans found in the database. Run your seeds.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to establish database connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPricingData();
  }, [fetchPricingData]);

  // Separate modules categories
  const buildModules = useMemo(() => {
    if (!plan) return [];
    return plan.modules.filter((m) => m.category === "build");
  }, [plan]);

  const hostingModules = useMemo(() => {
    if (!plan) return [];
    return plan.modules.filter((m) => m.category === "support");
  }, [plan]);

  // Categorize modules into Tiers
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

  // Toggle Module
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

  // Reset all selections
  const handleReset = () => {
    setEnabledModuleIds(new Set());
    setSelectedHostId("none");
    setLaunchPct(50);
    setCustomPctInput("");
  };

  // Calculations
  const calculations = useMemo(() => {
    let buildTotal = 0;
    let maintenanceTotal = 0;
    let complexitySum = 0;
    let activeBuildModulesCount = 0;

    buildModules.forEach((m) => {
      if (enabledModuleIds.has(m.id)) {
        buildTotal += m.build_price;
        maintenanceTotal += m.monthly_price;
        complexitySum += m.complexity_score;
        activeBuildModulesCount++;
      }
    });

    const hostMod = hostingModules.find((h) => h.id === selectedHostId);
    const hostCost = hostMod ? hostMod.monthly_price : 0;
    const rawMaintenanceTotal = maintenanceTotal;
    const monthlyTotal = (includeMaintenance ? rawMaintenanceTotal : 0) + hostCost;

    const complexityAvg =
      activeBuildModulesCount > 0 ? Math.round(complexitySum / activeBuildModulesCount) : 0;

    return {
      buildTotal,
      rawMaintenanceTotal,
      maintenanceTotal: includeMaintenance ? rawMaintenanceTotal : 0,
      hostCost,
      monthlyTotal,
      complexityAvg,
      activeCount: activeBuildModulesCount,
      totalCount: buildModules.length
    };
  }, [buildModules, hostingModules, enabledModuleIds, selectedHostId]);

  // Submit Quotation
  const handleSaveQuotation = async () => {
    if (!clientName || !plan) return;
    setSaving(true);
    setSuccess("");
    setError("");

    const token = localStorage.getItem("novaryn_admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    // Prepare modules array including selected host if any
    const payloadModuleIds = Array.from(enabledModuleIds);
    if (selectedHostId !== "none") {
      payloadModuleIds.push(selectedHostId);
    }

    try {
      const res = await fetch(`${apiUrl}/pricing/quotations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify({
          client_name: clientName,
          client_email: clientEmail || null,
          client_phone: clientPhone || null,
          client_address: clientAddress || null,
          downpayment: calculations.buildTotal > 0 ? Math.round(calculations.buildTotal * launchPct / 100) : 0,
          plan_id: plan.id,
          notes: notes || null,
          enabled_module_ids: payloadModuleIds,
          include_maintenance: includeMaintenance
        })
      });

      if (res.status === 401) {
        localStorage.removeItem("novaryn_admin_token");
        localStorage.removeItem("novaryn_admin_user");
        window.location.href = "/login";
        return;
      }

      const json = await res.json();
      if (res.ok) {
        setSuccess(`Quotation for "${clientName}" saved successfully!`);
        // Clean fields
        setClientName("");
        setClientEmail("");
        setClientPhone("");
        setClientAddress("");
        setNotes("");
      } else {
        throw new Error(json.message || "Failed to save quotation to backend.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unable to send data to API.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-[12px] text-slate-500 font-medium">Connecting to pricing database...</p>
      </div>
    );
  }

  if (error && !plan) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-red-800">Database Connection Issue</h3>
            <p className="text-[12px] text-red-600 mt-1">{error}</p>
            <button
              onClick={fetchPricingData}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[11px] font-semibold transition-all cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Retry Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Success Toast Notification */}
      {success && (
        <div className="fixed bottom-5 right-5 bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 flex items-center gap-3 shadow-xl z-50 animate-fade-in max-w-[350px] no-print">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span className="text-[12px] font-semibold">{success}</span>
          <button onClick={() => setSuccess("")} className="ml-auto text-[10px] text-slate-400 font-bold hover:text-white cursor-pointer">✕</button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calculator className="w-4.5 h-4.5 text-emerald-500" />
            <h1 className="text-lg font-semibold text-slate-900">Custom System Pricing Engine</h1>
          </div>
          <p className="text-[12px] text-slate-500">
            A modular quotation builder. Toggle systems and select a hosting tier to instantly calculate the total contract value, production launch payment, and monthly installment schedule.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 self-start">
          <Zap className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          <span className="text-[11px] font-semibold text-emerald-700">Custom Module Builder</span>
        </div>
      </div>

      {/* Formula Explainer — commented out for now */}
      {/* <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 sm:p-4 flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div className="text-[11px] text-slate-500 leading-relaxed">
          <strong className="text-slate-700">Accounting Formula:</strong>{" "}
          <div className="flex flex-col sm:flex-row sm:inline-flex flex-wrap gap-1.5 mt-1 sm:mt-0 items-start sm:items-center">
            <code className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-emerald-700 font-mono text-[9px] sm:text-[10px] break-all leading-normal">
              Build (One-time) = Σ selected_module.build_price
            </code>
            <span className="hidden sm:inline text-slate-300">·</span>
            <code className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-emerald-700 font-mono text-[9px] sm:text-[10px] break-all leading-normal">
              Monthly = Σ selected_module.maintenance_price + infrastructure_price
            </code>
          </div>
          <p className="mt-1 text-slate-450">
            Complexity weights (1–10) are used to project timeline milestones and developer allocation.
          </p>
        </div>
      </div> */}

      {/* Live Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white border border-slate-200/70 rounded-xl p-3 sm:p-4 shadow-sm text-left">
          <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-slate-400">Total Contract Value</p>
          <p className="text-lg sm:text-2xl font-semibold text-slate-900 mt-1 tracking-tight">{peso(calculations.buildTotal)}</p>
          <p className="text-[9px] sm:text-[10px] text-slate-405 mt-1">Full project baseline</p>
        </div>
        <div className="bg-white border border-slate-200/70 rounded-xl p-3 sm:p-4 shadow-sm text-left">
          <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-slate-400">Production Launch ({launchPct}%)</p>
          <p className="text-lg sm:text-2xl font-semibold text-slate-900 mt-1 tracking-tight">
            {peso(Math.round(calculations.buildTotal * launchPct / 100))}
          </p>
          <p className="text-[9px] sm:text-[10px] text-slate-405 mt-1">Paid upon go-live</p>
        </div>
        <div className="bg-white border border-slate-200/70 rounded-xl p-3 sm:p-4 shadow-sm text-left">
          <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-slate-400">Cloud Hosting / Mo</p>
          <p className="text-lg sm:text-2xl font-semibold text-slate-900 mt-1 tracking-tight">
            {peso(calculations.hostCost)}<span className="text-xs text-slate-400 font-normal">/mo</span>
          </p>
          <p className="text-[9px] sm:text-[10px] text-slate-405 mt-1">Pass-through cloud costs</p>
        </div>
        <div className="bg-white border border-slate-200/70 rounded-xl p-3 sm:p-4 shadow-sm bg-emerald-50/20 border-emerald-100 text-left">
          <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-emerald-700">Monthly Installment</p>
          <p className="text-lg sm:text-2xl font-semibold text-emerald-600 mt-1 tracking-tight">
            {peso(Math.round(calculations.buildTotal * (1 - launchPct / 100) / 12) + calculations.hostCost)}<span className="text-xs text-emerald-700 font-normal">/mo</span>
          </p>
          <p className="text-[9px] sm:text-[10px] text-slate-500 mt-1">Remaining {100 - launchPct}% / 12mo + Cloud</p>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 items-start">
        {/* Left: Module Selector Cards */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-slate-200/70 rounded-2xl overflow-hidden shadow-sm">
            {/* Card Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Select System Modules</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {calculations.activeCount} modules active · Complexity avg {calculations.complexityAvg}/10
                </p>
              </div>
              <button
                onClick={handleReset}
                className="text-[10px] text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Reset Selections
              </button>
            </div>

            {/* Modules List Container */}
            <div className="p-5 flex flex-col gap-5">
              
              {/* Category 1: Starter Modules */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setStarterOpen(!starterOpen)}
                  className="flex items-center justify-between text-left pb-1 border-b border-slate-100 cursor-pointer"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700">
                    Starter Modules (Brochure / Small backend)
                  </span>
                  {starterOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                </button>
                {starterOpen && (
                  <div className="flex flex-col gap-2 mt-1">
                    {categorizedModules.starter.map((mod) => (
                      <ModuleRow key={mod.id} mod={mod} enabled={enabledModuleIds.has(mod.id)} onToggle={handleToggleModule} onViewFeatures={setMobileDrawerModule} launchPct={launchPct} />
                    ))}
                  </div>
                )}
              </div>

              {/* Category 2: Professional Modules */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setProOpen(!proOpen)}
                  className="flex items-center justify-between text-left pb-1 border-b border-slate-100 cursor-pointer"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
                    Professional Modules (Mid-tier operations)
                  </span>
                  {proOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                </button>
                {proOpen && (
                  <div className="flex flex-col gap-2 mt-1">
                    {categorizedModules.pro.map((mod) => (
                      <ModuleRow key={mod.id} mod={mod} enabled={enabledModuleIds.has(mod.id)} onToggle={handleToggleModule} onViewFeatures={setMobileDrawerModule} launchPct={launchPct} />
                    ))}
                  </div>
                )}
              </div>

              {/* Category 3: Enterprise Modules */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setEnterpriseOpen(!enterpriseOpen)}
                  className="flex items-center justify-between text-left pb-1 border-b border-slate-100 cursor-pointer"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-purple-700">
                    Enterprise Modules (Large business / 2+ branches)
                  </span>
                  {enterpriseOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                </button>
                {enterpriseOpen && (
                  <div className="flex flex-col gap-2 mt-1">
                    {categorizedModules.ent.map((mod) => (
                      <ModuleRow key={mod.id} mod={mod} enabled={enabledModuleIds.has(mod.id)} onToggle={handleToggleModule} onViewFeatures={setMobileDrawerModule} launchPct={launchPct} />
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Hosting & Database Server Box */}
          <div className="bg-white border border-slate-200/70 rounded-2xl overflow-hidden shadow-sm p-5">
            <button
              onClick={() => setHostingOpen(!hostingOpen)}
              className="flex items-center justify-between w-full text-left cursor-pointer"
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
                  {/* None option */}
                  <label
                    className={`flex items-start justify-between p-3 border rounded-xl cursor-pointer transition-all ${
                      selectedHostId === "none"
                        ? "border-emerald-500 bg-emerald-50/10"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="radio"
                        name="hostingPlan"
                        checked={selectedHostId === "none"}
                        onChange={() => setSelectedHostId("none")}
                        className="mt-0.5 accent-emerald-600"
                      />
                      <div>
                        <p className="text-[12px] font-semibold text-slate-700">Client-Managed Hosting</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Deploy directly to client's AWS, DigitalOcean, or Vercel account.</p>
                      </div>
                    </div>
                    <span className="text-[12px] font-bold text-slate-800">₱0</span>
                  </label>

                  {/* Dynamic Hosting Options from DB */}
                  {hostingModules.map((host) => (
                    <label
                      key={host.id}
                      className={`flex items-start justify-between p-3 border rounded-xl cursor-pointer transition-all ${
                        selectedHostId === host.id
                          ? "border-emerald-500 bg-emerald-50/10"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <input
                          type="radio"
                          name="hostingPlan"
                          checked={selectedHostId === host.id}
                          onChange={() => setSelectedHostId(host.id)}
                          className="mt-0.5 accent-emerald-600"
                        />
                        <div>
                          <p className="text-[12px] font-semibold text-slate-700">{host.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Managed deployment with regular monitoring and DB backups.</p>
                        </div>
                      </div>
                      <span className="text-[12px] font-bold text-slate-800">{peso(host.monthly_price)}<span className="text-[9px] text-slate-400 font-normal">/mo</span></span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Quotation Generator Panel (Desktop Only) */}
        <div className="hidden lg:block bg-white border border-slate-200/70 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BadgePercent className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-semibold text-slate-900">Generate Client Quotation</h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Quotation outputs are calculated live based on current selections.
            </p>
          </div>

          <div className="p-5 flex flex-col gap-4">
            {/* Client Details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Client Name
                </label>
                <input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="PaddleYard Sports Inc."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 transition-all font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Client Email
                </label>
                <input
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@company.com"
                  type="email"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Client Phone
                </label>
                <input
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+63 917 123 4567"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 transition-all"
                />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Business Address
                </label>
                <input
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  placeholder="123 Bonifacio Global City, Taguig City, Metro Manila"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 transition-all"
                />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Production Launch Payment (%)
                </label>
                {/* Preset Percentage Pills */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {[30, 40, 50, 60, 70].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => { setLaunchPct(pct); setCustomPctInput(""); }}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                        launchPct === pct && !customPctInput
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-white text-slate-600 border-slate-200 hover:border-emerald-400 hover:text-emerald-700"
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                  {/* Custom % input */}
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="1" max="99"
                      value={customPctInput}
                      onChange={(e) => {
                        setCustomPctInput(e.target.value);
                        const v = parseInt(e.target.value, 10);
                        if (!isNaN(v) && v >= 1 && v <= 99) setLaunchPct(v);
                      }}
                      placeholder="Custom"
                      className="w-16 border border-slate-200 rounded-lg px-2 py-1 text-[11px] text-slate-800 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 transition-all"
                    />
                    <span className="text-[11px] text-slate-400 font-bold">%</span>
                  </div>
                </div>
                {/* Breakdown preview chip */}
                {calculations.buildTotal > 0 && (
                  <div className="text-[10px] text-slate-500 bg-slate-50 border border-slate-150 rounded-lg px-3 py-1.5 leading-relaxed">
                    <span className="font-semibold text-emerald-700">{peso(Math.round(calculations.buildTotal * launchPct / 100))}</span> upon go-live · <span className="font-semibold text-slate-700">{peso(Math.round(calculations.buildTotal * (1 - launchPct / 100) / 12))}/mo</span> for 12 months
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Needs CRM support, multi-branch scope detail..."
                rows={3}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 resize-none transition-all"
              />
            </div>

            {/* SLA Scope Info (no toggle, always on-demand Year 2) */}
            <div className="flex items-center justify-between p-3.5 border border-emerald-100 rounded-xl bg-emerald-50/40">
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <p className="text-[12px] font-semibold text-emerald-800">3 Months Free Bug Fixes Included</p>
                  <button
                    type="button"
                    onClick={() => setIsSlaModalOpen(true)}
                    className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer underline decoration-dotted"
                  >
                    View Scope
                  </button>
                </div>
                <p className="text-[10px] text-emerald-600 mt-0.5">Year 2+: Pay-as-you-go — ₱0 if no issues occur.</p>
              </div>
            </div>

            {/* Price Preview */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center text-[12px]">
                <span className="text-slate-500">Total Contract Value</span>
                <span className="font-semibold text-slate-900">{peso(calculations.buildTotal)}</span>
              </div>
              <div className="flex justify-between items-center text-[12px] text-slate-700">
                <span>Production Launch Payment ({launchPct}%)</span>
                <span className="font-semibold">{peso(Math.round(calculations.buildTotal * launchPct / 100))}</span>
              </div>
              <div className="flex justify-between items-center text-[12px] border-b border-dashed border-slate-200 pb-2">
                <span className="text-slate-500">Monthly Installment ({100 - launchPct}% / 12mo)</span>
                <span className="font-semibold text-slate-900">{peso(Math.round(calculations.buildTotal * (1 - launchPct / 100) / 12))}/mo</span>
              </div>
              <div className="flex justify-between items-center text-[12px] border-b border-dashed border-slate-200 pb-2">
                <span className="text-slate-500">Cloud Hosting Fee</span>
                <span className="font-semibold text-slate-900">{peso(calculations.hostCost)}/mo</span>
              </div>
              <div className="flex justify-between items-center text-[13px] pt-1">
                <span className="font-semibold text-emerald-800">Total Monthly (Installment + Cloud)</span>
                <span className="font-bold text-emerald-600">{peso(Math.round(calculations.buildTotal * (1 - launchPct / 100) / 12) + calculations.hostCost)}<span className="text-[9px] text-slate-400 font-normal">/mo</span></span>
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSaveQuotation}
                disabled={!clientName || saving}
                className="flex items-center justify-center gap-2 flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg text-[12px] font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" /> Save Quotation
                  </>
                )}
              </button>
            </div>
            {error && (
              <div className="text-[11px] text-red-600 font-medium bg-red-50 p-2.5 rounded-lg border border-red-100 flex items-center gap-1.5 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── MOBILE ONLY FLOATING ACTION BUTTON (FAB) ── */}
      <button
        onClick={() => setIsMobileQuotationOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-2xl px-4 py-3 shadow-2xl shadow-emerald-500/25 flex items-center gap-2.5 cursor-pointer transition-all active:scale-95"
        title="Generate Quotation"
      >
        <FileText className="w-4.5 h-4.5" />
        <span className="text-[12px] font-bold tracking-tight">Quotation</span>
      </button>

      {/* ── MOBILE QUOTATION OVERLAY MODAL ── */}
      {isMobileQuotationOpen && (
        <>
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] z-50 transition-opacity"
            onClick={() => setIsMobileQuotationOpen(false)}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-2xl border border-slate-200 p-5 shadow-2xl relative text-left flex flex-col max-h-[85vh] overflow-hidden">
              
              {/* Header */}
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  <BadgePercent className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-sm font-bold text-slate-800 tracking-tight">Generate Client Quotation</h3>
                </div>
                <button 
                  onClick={() => setIsMobileQuotationOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto no-scrollbar py-4 flex flex-col gap-4 text-xs font-sans">
                <p className="text-[10px] text-slate-500 font-medium">
                  Quotation outputs are calculated live based on current selections.
                </p>

                {/* Client Details */}
                <div className="flex flex-col gap-3.5">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block mb-1">
                      Client Name
                    </label>
                    <input
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="PaddleYard Sports Inc."
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-400 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block mb-1">
                      Client Email
                    </label>
                    <input
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="client@company.com"
                      type="email"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-400 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block mb-1">
                      Client Phone
                    </label>
                    <input
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+63 917 123 4567"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-400 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block mb-1">
                      Business Address
                    </label>
                    <input
                      value={clientAddress}
                      onChange={(e) => setClientAddress(e.target.value)}
                      placeholder="Bonifacio Global City, Taguig"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-400 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block mb-1">
                      Production Launch Payment (%)
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {[30, 40, 50, 60, 70].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => { setLaunchPct(pct); setCustomPctInput(""); }}
                          className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                            launchPct === pct && !customPctInput
                              ? "bg-emerald-600 text-white border-emerald-600"
                              : "bg-white text-slate-600 border-slate-200 hover:border-emerald-400"
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="1" max="99"
                          value={customPctInput}
                          onChange={(e) => {
                            setCustomPctInput(e.target.value);
                            const v = parseInt(e.target.value, 10);
                            if (!isNaN(v) && v >= 1 && v <= 99) setLaunchPct(v);
                          }}
                          placeholder="?"
                          className="w-12 border border-slate-200 rounded-lg px-2 py-1 text-[11px] text-slate-800 font-bold focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all"
                        />
                        <span className="text-[11px] text-slate-400 font-bold">%</span>
                      </div>
                    </div>
                    {calculations.buildTotal > 0 && (
                      <div className="text-[10px] text-slate-500 bg-slate-50 border border-slate-150 rounded-lg px-2.5 py-1.5 leading-relaxed">
                        <span className="font-semibold text-emerald-700">{peso(Math.round(calculations.buildTotal * launchPct / 100))}</span> on go-live · <span className="font-semibold text-slate-700">{peso(Math.round(calculations.buildTotal * (1 - launchPct / 100) / 12))}/mo</span> for 12 months
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide block mb-1">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Needs CRM support, scope details..."
                    rows={2}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-400 resize-none font-medium"
                  />
                </div>

                {/* SLA Info (no toggle — always on-demand Year 2) */}
                <div className="flex items-center justify-between p-3 border border-emerald-100 rounded-xl bg-emerald-50/40">
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <p className="text-[11px] font-semibold text-emerald-800">3 Months Free Bug Fixes</p>
                      <button
                        type="button"
                        onClick={() => setIsSlaModalOpen(true)}
                        className="text-[9px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer underline decoration-dotted"
                      >
                        View Scope
                      </button>
                    </div>
                    <p className="text-[9px] text-emerald-600 mt-0.5 font-medium">Year 2+: Pay-as-you-go (₱0 if no issues).</p>
                  </div>
                </div>

                {/* Price Preview */}
                <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex flex-col gap-1.5 font-medium text-slate-650">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Total Contract Value</span>
                    <span className="font-semibold text-slate-800">{peso(calculations.buildTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-700">
                    <span>Production Launch ({launchPct}%)</span>
                    <span className="font-semibold">{peso(Math.round(calculations.buildTotal * launchPct / 100))}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-1.5">
                    <span className="text-slate-500">Monthly Installment ({100 - launchPct}%/12mo)</span>
                    <span className="font-semibold text-slate-800">{peso(Math.round(calculations.buildTotal * (1 - launchPct / 100) / 12))}/mo</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-dashed border-slate-200 pb-1.5">
                    <span className="text-slate-500">Cloud Hosting Fee</span>
                    <span className="font-semibold text-slate-800">{peso(calculations.hostCost)}/mo</span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-800 pt-1">
                    <span className="font-semibold">Total Monthly (Installment + Cloud)</span>
                    <span className="font-bold text-emerald-650">{peso(Math.round(calculations.buildTotal * (1 - launchPct / 100) / 12) + calculations.hostCost)}<span className="text-[9px] text-slate-400 font-normal">/mo</span></span>
                  </div>
                </div>
              </div>

              {/* Fixed Save Button */}
              <div className="pt-3 border-t border-slate-100 flex-shrink-0">
                <button
                  onClick={() => {
                    handleSaveQuotation();
                    setIsMobileQuotationOpen(false);
                  }}
                  disabled={!clientName || saving}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-[12px] font-semibold flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-98"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" /> Save Quotation
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* SLA Scope Modal */}
      {isSlaModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-2xl border border-slate-250 max-w-[500px] w-full p-6 shadow-xl flex flex-col gap-4 animate-scale-up text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Novaryn Maintenance SLA Scope
              </h3>
              <button
                onClick={() => setIsSlaModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold font-mono cursor-pointer"
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
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
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
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 z-[60] lg:hidden"
            onClick={() => setMobileDrawerModule(null)}
          />
          {/* Drawer */}
          <div className="fixed bottom-0 left-0 right-0 z-[70] lg:hidden bg-white rounded-t-2xl shadow-2xl border-t border-slate-200 animate-slide-up">
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-slate-200 rounded-full" />
            </div>
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">What's Included</p>
                <p className="text-[13px] font-bold text-slate-800 mt-0.5">{mobileDrawerModule.name}</p>
              </div>
              <button
                onClick={() => setMobileDrawerModule(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
            {/* Features List */}
            <div className="px-5 pt-3 pb-8 flex flex-col gap-2.5 max-h-[60vh] overflow-y-auto">
              {(MODULE_FEATURES[mobileDrawerModule.name] || []).map((feat, idx) => (
                <div key={idx} className="flex items-start gap-3 py-2 border-b border-slate-50 last:border-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-[13px] text-slate-700 font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </>
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

  return (
    <div
      className={`flex flex-col rounded-lg border transition-all select-none ${
        enabled
          ? "bg-white border-slate-200/80 shadow-sm"
          : "bg-slate-50/50 border-transparent opacity-60 hover:opacity-80"
      }`}
    >
      {/* ── DESKTOP LAYOUT (sm and up) ── */}
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
          <div className="min-w-0">
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

      {/* ── MOBILE LAYOUT (below sm) ── */}
      <div className="sm:hidden flex flex-col">
        {/* Top: Toggle + Name row — tap to toggle */}
        <div
          onClick={() => onToggle(mod.id)}
          className="flex items-center gap-3 px-3 pt-3 pb-2 cursor-pointer"
        >
          {/* Toggle Icon */}
          <div className="shrink-0">
            {enabled ? (
              <ToggleRight className="w-5 h-5 text-emerald-500" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-slate-300" />
            )}
          </div>
          {/* Module Name */}
          <p className={`text-[13px] font-bold leading-snug flex-1 min-w-0 transition-colors ${
            enabled ? "text-slate-800" : "text-slate-500"
          }`}>{mod.name}</p>
        </div>

        {/* Middle: Complexity + Tier badge row */}
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

        {/* Price strip + View button in one row */}
        <div className={`flex items-center gap-0 mx-3 mb-3 rounded-xl overflow-hidden border ${
          enabled ? "border-slate-200" : "border-slate-100"
        }`}>
          {/* Build price cell */}
          <div
            onClick={() => onToggle(mod.id)}
            className={`flex-1 flex flex-col items-center py-2 cursor-pointer border-r ${
              enabled ? "bg-slate-50/50 border-slate-200" : "bg-transparent border-slate-100"
            }`}
          >
            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Build</p>
            <p className={`text-[12px] font-bold mt-0.5 ${
              enabled ? "text-slate-800" : "text-slate-400"
            }`}>{peso(mod.build_price)}</p>
          </div>
          {/* Installment price cell */}
          <div
            onClick={() => onToggle(mod.id)}
            className={`flex-1 flex flex-col items-center py-2 cursor-pointer border-r ${
              enabled ? "bg-slate-50/50 border-slate-200" : "bg-transparent border-slate-100"
            }`}
          >
            <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Installment</p>
            <p className={`text-[12px] font-bold mt-0.5 ${
              enabled ? "text-slate-800" : "text-slate-400"
            }`}>+{peso(Math.round(mod.build_price * (1 - launchPct / 100) / 12))}<span className="text-[8px] text-slate-400 font-normal">/mo</span></p>
          </div>
          {/* View What's Included button cell */}
          {features.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewFeatures?.(mod);
              }}
              className="shrink-0 flex flex-col items-center justify-center px-3 py-2 bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[8px] font-bold text-emerald-700 mt-0.5 whitespace-nowrap">What's In</span>
            </button>
          )}
        </div>
      </div>

      {/* Expanded Features Dropdown List (Desktop only, when enabled) */}
      {enabled && features.length > 0 && (
        <div className="hidden sm:block px-3 pb-3 pt-2.5 border-t border-slate-100 bg-slate-50/20 text-[11px] text-slate-500 animate-fade-in">
          <p className="font-bold text-slate-700 mb-1.5">What's Included:</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-1">
            {features.map((feat, idx) => (
              <li key={idx} className="flex items-center gap-1.5 text-slate-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
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

function ShieldAlert(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 9.7a1 1 0 0 1-.68 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .76-.97l8-2a1 1 0 0 1 .48 0l8 2A1 1 0 0 1 20 6z" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}
