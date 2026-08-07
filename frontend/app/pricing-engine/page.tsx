"use client";

import React, { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Calculator, ChevronDown, ChevronRight,
  Info, Shield, Server, ArrowRight, Check, Sparkles
} from "lucide-react";
import FloatingHeader from "../components/FloatingHeader";
import Footer from "../components/Footer";
import ConsultationModal from "../components/ConsultationModal";

const EMAIL = "novarynph@gmail.com";

// ─────────────────────────────────────────────────────────────────
// TYPES & MAPPINGS
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
  "Custom Brand Website / CMS": { tier: "Starter", badgeColor: "bg-blue-50 text-blue-750 border-blue-100" },
  "Appointment & Slot Booking": { tier: "Starter", badgeColor: "bg-blue-50 text-blue-750 border-blue-100" },
  "Standalone POS (Point of Sale)": { tier: "Starter", badgeColor: "bg-blue-50 text-blue-750 border-blue-100" },
  "Small Inventory System": { tier: "Professional", badgeColor: "bg-amber-50 text-amber-700 border-amber-100" },
  "Customer CRM & Membership Wallet": { tier: "Professional", badgeColor: "bg-amber-50 text-amber-700 border-amber-100" },
  "E-Commerce Online Store": { tier: "Professional", badgeColor: "bg-amber-50 text-amber-700 border-amber-100" },
  "Venue / Facility Booking Grid": { tier: "Professional", badgeColor: "bg-amber-50 text-amber-700 border-amber-100" },
  "MIS Dashboard & Custom Reports": { tier: "Professional", badgeColor: "bg-amber-50 text-amber-700 border-amber-100" },
  "Big Inventory & Supply Chain": { tier: "Enterprise", badgeColor: "bg-purple-50 text-purple-700 border-purple-100" },
  "Franchise & Branch HQ Panel": { tier: "Enterprise", badgeColor: "bg-purple-50 text-purple-700 border-purple-100" },
  "Enterprise ERP & Legacy Integration": { tier: "Enterprise", badgeColor: "bg-purple-50 text-purple-700 border-purple-100" }
};

const MODULE_DESCRIPTIONS: Record<string, string> = {
  "Custom Brand Website / CMS": "Bespoke brand site with CMS for fast updates, blog management, and SEO optimization.",
  "Appointment & Slot Booking": "Online booking widgets, staff timetables, and SMS confirmation triggers.",
  "Standalone POS (Point of Sale)": "Cashier checkout portal supporting GCash/Maya and receipt printer integration.",
  "Small Inventory System": "Track items, variants, SKUs, barcode mappings, and low-stock notification triggers.",
  "Customer CRM & Membership Wallet": "Customer profiles, prepaid wallets, tier rewards, and QR check-in scanners.",
  "E-Commerce Online Store": "Shopping cart, payment gateways, and delivery APIs (Lalamove/J&T) sync.",
  "Venue / Facility Booking Grid": "Court booking grids, peak/off-peak price rule settings, and slot conflict blockers.",
  "MIS Dashboard & Custom Reports": "KPI summary widgets, department transaction logs, and exportable financial sheets.",
  "Big Inventory & Supply Chain": "HQ multi-branch supply chain integration and real-time stock sync.",
  "Franchise & Branch HQ Panel": "Centralized control dashboard orchestrating all active franchise branches.",
  "Enterprise ERP & Legacy Integration": "Legacy database node synchronization, fleet driver tracking, and accounting APIs."
};

const MODULE_FEATURES: Record<string, string[]> = {
  "Appointment & Slot Booking": [
    "Client Online Booking Widget",
    "Dynamic Staff Timetables",
    "SMS Booking Confirmations",
    "Real-time Scheduling Engine"
  ],
  "Standalone POS (Point of Sale)": [
    "Thermal Receipt Outputting",
    "Multi-Gateway Payment Sync",
    "Void & Shift Audit Logs",
    "Quick Checkout Interface"
  ],
  "Small Inventory System": [
    "SKU & Barcode Registrations",
    "Manual Stock Updates",
    "Low-Stock Email Notifications",
    "Supplier Purchase Logs"
  ],
  "Customer CRM & Membership Wallet": [
    "Prepaid Wallet Ledger",
    "Bronze/Silver/Gold Tier Limits",
    "Points Earning Rules",
    "QR Membership Access Scans"
  ],
  "E-Commerce Online Store": [
    "Shopping Cart & Pay Flow",
    "Lalamove / J&T API Sync",
    "Stock Deduct on Order",
    "Discount Coupon Engine"
  ],
  "Venue / Facility Booking Grid": [
    "Hourly Slot Booking Grid",
    "Peak Pricing Override Rules",
    "Visual Layout Matrix Map",
    "Double Booking Safeguards"
  ],
  "MIS Dashboard & Custom Reports": [
    "Consolidated KPI Summary",
    "Excel/PDF Ledger Exports",
    "Departmental Audit Logs",
    "Revenue Trends Matrix"
  ],
  "Big Inventory & Supply Chain": [
    "Real-time Branch Stock Sync",
    "Inter-Branch stock transfers",
    "Low Stock Replenish rules",
    "Damage & Shortage Audit logs"
  ],
  "Franchise & Branch HQ Panel": [
    "Consolidated Branch Dashboards",
    "Royalty Calculator engine",
    "Central Product Master catalogs",
    "Access privilege settings"
  ],
  "Enterprise ERP & Legacy Integration": [
    "Legacy DB Bridge synchronization",
    "Fleet driver tracking utilities",
    "Custom accounting API bridges",
    "Enterprise Single Sign-On Roles"
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

  // USD → PHP Exchange Rate
  const [usdRate, setUsdRate] = useState<number>(57);
  const [rateDate, setRateDate] = useState<string>("");

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  // Load plans & modules from public API (dynamic lookup)
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
        throw new Error("No custom system plans found.");
      }
    } catch (err: any) {
      console.warn("Pricing DB load failed, loading static fallback module configurations.", err);
      // Fallback
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
    const rawMaintenanceTotal = maintenanceTotal;

    const monthlyTotal = (includeMaintenance ? rawMaintenanceTotal : 0) + hostCostPhp;
    const complexityAvg = activeBuildModulesCount > 0 ? Math.round(complexitySum / activeBuildModulesCount) : 0;

    return {
      buildTotal,
      rawMaintenanceTotal,
      maintenanceTotal: includeMaintenance ? rawMaintenanceTotal : 0,
      hostCostUsd,
      hostCostPhp,
      monthlyTotal,
      complexityAvg,
      activeCount: activeBuildModulesCount,
      totalCount: buildModules.length
    };
  }, [buildModules, hostingModules, enabledModuleIds, selectedHostId, usdRate, includeMaintenance]);

  const peso = (n: number) => "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 0 });

  // GeneratePrefill Consultation description
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

      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6 text-left">
          
          {/* Document Header */}
          <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-slate-200/80 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-600 animate-pulse" />
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Custom System Pricing Engine
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium leading-relaxed max-w-2xl">
                A modular quotation builder. Toggle systems and select a hosting tier to instantly calculate the total contract value, production launch payment, and monthly installment schedule.
              </p>
            </div>
            
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-650 text-xs font-bold rounded-xl transition-all self-start md:self-center"
            >
              Reset Configuration
            </button>
          </div>

          {/* Dynamic Valuation Metrics Grid (Matches Eisen Admin Dashboard look) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {/* Box 1 */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">TOTAL CONTRACT VALUE</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 block mt-1.5 leading-none">
                {peso(calculations.buildTotal)}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold block mt-2">Full project baseline</span>
            </div>

            {/* Box 2 */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">PRODUCTION LAUNCH (50%)</span>
              <span className="text-xl sm:text-2xl font-black text-slate-800 block mt-1.5 leading-none">
                {peso(Math.round(calculations.buildTotal * 0.50))}
              </span>
              <span className="text-[10px] text-slate-450 font-bold block mt-2 text-emerald-600">Paid upon kickoff</span>
            </div>

            {/* Box 3 */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">CLOUD HOSTING / MO</span>
              <span className="text-xl sm:text-2xl font-black text-slate-700 block mt-1.5 leading-none">
                {selectedHostId === "none" ? "₱0" : peso(calculations.hostCostPhp)}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold block mt-2">
                {selectedHostId === "none" ? "Client-Managed" : `$${calculations.hostCostUsd}/mo equivalent`}
              </span>
            </div>

            {/* Box 4 */}
            <div className="bg-[#ECFDF5] border border-emerald-100 p-5 rounded-2xl shadow-xs">
              <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider block">MONTHLY INSTALLMENT</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-650 block mt-1.5 leading-none">
                {peso(Math.round(calculations.buildTotal * 0.50 / 12) + calculations.hostCostPhp + (includeMaintenance ? calculations.maintenanceTotal : 0))}
                <span className="text-xs text-slate-500 font-normal">/mo</span>
              </span>
              <span className="text-[10px] text-slate-450 font-bold block mt-2">50% / 12mo (₱) + Cloud ($)</span>
            </div>
          </div>

          {/* Interactive Form & Receipt Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Panel: Checklist accordions (Spans 2 columns) */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              
              {/* Accordion 1: Starter */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <button
                  onClick={() => setStarterOpen(!starterOpen)}
                  className="w-full px-5 py-4 bg-slate-50/50 flex justify-between items-center border-b border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-700">
                      STARTER MODULES (BROCHURE / SMALL BACKEND)
                    </span>
                  </div>
                  {starterOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-450" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-450" />}
                </button>

                {starterOpen && (
                  <div className="p-4 flex flex-col gap-3.5 animate-fade-in">
                    {categorizedModules.starter.map((m) => {
                      const selected = enabledModuleIds.has(m.id);
                      return (
                        <div
                          key={m.id}
                          onClick={() => handleToggleModule(m.id)}
                          className={`p-4 rounded-xl border transition-all flex items-start gap-4 cursor-pointer select-none bg-white ${
                            selected ? "border-emerald-500 bg-emerald-50/5" : "border-slate-200 hover:border-slate-350"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                            selected ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300"
                          }`}>
                            <Check className="w-3.5 h-3.5" strokeWidth={3.5} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className="text-xs font-black text-slate-800 leading-snug">{m.name}</h3>
                              <div className="text-right text-[11px] font-bold text-slate-800 leading-tight shrink-0 ml-4">
                                <span>{peso(m.build_price)} setup</span>
                                <span className="block text-slate-400 text-[9px] font-semibold mt-0.5">+{peso(m.monthly_price)}/mo support</span>
                              </div>
                            </div>
                            <p className="text-[10px] text-slate-450 mt-1 leading-normal font-semibold max-w-[480px]">
                              {MODULE_DESCRIPTIONS[m.name] || "Custom dynamic components matching your portal specs."}
                            </p>
                            {MODULE_FEATURES[m.name] && (
                              <div className="mt-3 flex flex-wrap gap-x-3.5 gap-y-1.5 border-t border-slate-100 pt-2.5">
                                {MODULE_FEATURES[m.name].map((feat) => (
                                  <span key={feat} className="text-[9px] text-slate-450 font-bold flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                    {feat}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Accordion 2: Professional */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <button
                  onClick={() => setProOpen(!proOpen)}
                  className="w-full px-5 py-4 bg-slate-50/50 flex justify-between items-center border-b border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-700">
                      PROFESSIONAL MODULES (MID-TIER OPERATIONS)
                    </span>
                  </div>
                  {proOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-450" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-450" />}
                </button>

                {proOpen && (
                  <div className="p-4 flex flex-col gap-3.5 animate-fade-in">
                    {categorizedModules.pro.map((m) => {
                      const selected = enabledModuleIds.has(m.id);
                      return (
                        <div
                          key={m.id}
                          onClick={() => handleToggleModule(m.id)}
                          className={`p-4 rounded-xl border transition-all flex items-start gap-4 cursor-pointer select-none bg-white ${
                            selected ? "border-emerald-500 bg-emerald-50/5" : "border-slate-200 hover:border-slate-355"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                            selected ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300"
                          }`}>
                            <Check className="w-3.5 h-3.5" strokeWidth={3.5} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className="text-xs font-black text-slate-800 leading-snug">{m.name}</h3>
                              <div className="text-right text-[11px] font-bold text-slate-800 leading-tight shrink-0 ml-4">
                                <span>{peso(m.build_price)} setup</span>
                                <span className="block text-slate-400 text-[9px] font-semibold mt-0.5">+{peso(m.monthly_price)}/mo support</span>
                              </div>
                            </div>
                            <p className="text-[10px] text-slate-450 mt-1 leading-normal font-semibold max-w-[480px]">
                              {MODULE_DESCRIPTIONS[m.name] || "Intermediate databases, transaction tools, and customer pipelines."}
                            </p>
                            {MODULE_FEATURES[m.name] && (
                              <div className="mt-3 flex flex-wrap gap-x-3.5 gap-y-1.5 border-t border-slate-100 pt-2.5">
                                {MODULE_FEATURES[m.name].map((feat) => (
                                  <span key={feat} className="text-[9px] text-slate-450 font-bold flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                    {feat}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Accordion 3: Enterprise */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <button
                  onClick={() => setEnterpriseOpen(!enterpriseOpen)}
                  className="w-full px-5 py-4 bg-slate-50/50 flex justify-between items-center border-b border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-purple-550" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-700">
                      ENTERPRISE MODULES (ADVANCED NETWORKS)
                    </span>
                  </div>
                  {enterpriseOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-450" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-450" />}
                </button>

                {enterpriseOpen && (
                  <div className="p-4 flex flex-col gap-3.5 animate-fade-in">
                    {categorizedModules.ent.map((m) => {
                      const selected = enabledModuleIds.has(m.id);
                      return (
                        <div
                          key={m.id}
                          onClick={() => handleToggleModule(m.id)}
                          className={`p-4 rounded-xl border transition-all flex items-start gap-4 cursor-pointer select-none bg-white ${
                            selected ? "border-emerald-500 bg-emerald-50/5" : "border-slate-200 hover:border-slate-355"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                            selected ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300"
                          }`}>
                            <Check className="w-3.5 h-3.5" strokeWidth={3.5} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h3 className="text-xs font-black text-slate-800 leading-snug">{m.name}</h3>
                              <div className="text-right text-[11px] font-bold text-slate-800 leading-tight shrink-0 ml-4">
                                <span>{peso(m.build_price)} setup</span>
                                <span className="block text-slate-400 text-[9px] font-semibold mt-0.5">+{peso(m.monthly_price)}/mo support</span>
                              </div>
                            </div>
                            <p className="text-[10px] text-slate-450 mt-1 leading-normal font-semibold max-w-[480px]">
                              {MODULE_DESCRIPTIONS[m.name] || "HQ controls, franchise sync, legacy DB structures, and fleet tools."}
                            </p>
                            {MODULE_FEATURES[m.name] && (
                              <div className="mt-3 flex flex-wrap gap-x-3.5 gap-y-1.5 border-t border-slate-100 pt-2.5">
                                {MODULE_FEATURES[m.name].map((feat) => (
                                  <span key={feat} className="text-[9px] text-slate-450 font-bold flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                    {feat}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Accordion 4: Hosting Infrastructures */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <button
                  onClick={() => setHostingOpen(!hostingOpen)}
                  className="w-full px-5 py-4 bg-slate-50/50 flex justify-between items-center border-b border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-slate-550" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-700">
                      INFRASTRUCTURE & DATABASE HOSTING PLAN
                    </span>
                  </div>
                  {hostingOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-450" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-450" />}
                </button>

                {hostingOpen && (
                  <div className="p-5 flex flex-col gap-3.5 bg-white animate-fade-in">
                    <p className="text-[10px] text-slate-450 mt-0.5">
                      Define where system modules run. If you manage the server nodes internally, select Client-Managed Hosting.
                    </p>

                    <div className="grid grid-cols-1 gap-2.5">
                      {/* Client Managed radio */}
                      <label
                        className={`flex items-start justify-between p-3.5 border.5 rounded-xl cursor-pointer transition-all ${
                          selectedHostId === "none" ? "border-emerald-500 bg-emerald-50/5" : "border-slate-200 bg-white"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="hostingPlanPublic"
                            checked={selectedHostId === "none"}
                            onChange={() => setSelectedHostId("none")}
                            className="mt-0.5 accent-emerald-600 cursor-pointer"
                          />
                          <div>
                            <span className="text-[11px] font-extrabold text-slate-805 block">Client-Managed Hosting</span>
                            <span className="text-[9px] text-slate-400 block mt-0.5">Deploy directly to client's cloud nodes (AWS, GCP, Vercel).</span>
                          </div>
                        </div>
                        <span className="text-[11px] font-extrabold text-slate-800">₱0</span>
                      </label>

                      {/* DB Hosting options */}
                      {hostingModules.map((host) => {
                        const hostCostPhp = Math.round(host.monthly_price * usdRate);
                        return (
                          <label
                            key={host.id}
                            className={`flex items-start justify-between p-3.5 border.5 rounded-xl cursor-pointer transition-all ${
                              selectedHostId === host.id ? "border-emerald-500 bg-emerald-50/5" : "border-slate-200 bg-white"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <input
                                type="radio"
                                name="hostingPlanPublic"
                                checked={selectedHostId === host.id}
                                onChange={() => setSelectedHostId(host.id)}
                                className="mt-0.5 accent-emerald-600 cursor-pointer"
                              />
                              <div>
                                <span className="text-[11px] font-extrabold text-slate-805 block">{host.name}</span>
                                <span className="text-[9px] text-slate-400 block mt-0.5">
                                  Managed deploy (${host.monthly_price}/mo). Live rate locked at {usdRate} ₱/$.
                                </span>
                              </div>
                            </div>
                            <span className="text-[11px] font-extrabold text-slate-800">
                              {peso(hostCostPhp)}<span className="text-[9px] text-slate-400 font-normal">/mo</span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Maintenance toggle bar */}
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200">
                <div className="flex items-start gap-3">
                  <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-[11px] font-bold text-slate-700">Include Active Support & Maintenance SLA</h5>
                    <p className="text-[9px] text-slate-450 mt-0.5 leading-relaxed font-semibold">
                      Covers routine updates, backup checks, security scanning, and hot-fixes. Recommended for business operations.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIncludeMaintenance(!includeMaintenance)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    includeMaintenance ? "bg-emerald-600" : "bg-slate-200"
                  }`}
                  aria-label="Toggle support maintenance SLA"
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      includeMaintenance ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

            </div>

            {/* Right Panel: View-Only Sticky Summary Receipt (Replaces Save Quotation Card) */}
            <div className="sticky top-28 bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col gap-6 text-left">
              <div>
                <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest block">
                  Estimate Receipt
                </span>
                <h2 className="text-lg font-black text-slate-900 mt-1">Valuation Summary</h2>
              </div>

              <div className="flex flex-col gap-4.5 text-xs font-semibold">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold">System Price</span>
                  <span className="text-sm font-extrabold text-slate-900">{peso(calculations.buildTotal)}</span>
                </div>

                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="text-slate-550 font-bold">Launch Downpayment (50%)</span>
                  <span className="text-sm font-extrabold text-slate-800">{peso(Math.round(calculations.buildTotal * 0.50))}</span>
                </div>

                <div className="flex justify-between items-center mt-1">
                  <span className="text-slate-500 font-bold">Cloud Server Support</span>
                  <span className="text-sm font-extrabold text-slate-650">{peso(calculations.hostCostPhp)}<span className="text-[10px] text-slate-400 font-normal">/mo</span></span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold">Maintenance Support SLA</span>
                  <span className="text-sm font-extrabold text-slate-650">
                    {peso(includeMaintenance ? calculations.rawMaintenanceTotal : 0)}<span className="text-[10px] text-slate-400 font-normal">/mo</span>
                  </span>
                </div>

                <div className="flex justify-between items-center border-t border-slate-150 pt-4 mt-2">
                  <span className="text-slate-900 font-black">Estimated Monthly</span>
                  <span className="text-base font-black text-emerald-600">
                    {peso(Math.round(calculations.buildTotal * 0.50 / 12) + calculations.hostCostPhp + (includeMaintenance ? calculations.rawMaintenanceTotal : 0))}
                    <span className="text-[10px] text-slate-450 font-normal">/mo × 12</span>
                  </span>
                </div>

                <div className="flex items-start gap-2.5 leading-relaxed text-[9px] text-slate-450 font-medium bg-slate-50 p-3.5 rounded-xl border border-slate-100 mt-2">
                  <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    No administrative quotation generated. Cost estimates include 12 months free technical security support.
                  </span>
                </div>
              </div>

              <button
                onClick={handleOpenConsultation}
                className="w-full py-4.5 rounded-xl bg-slate-900 hover:bg-slate-805 text-white font-bold text-xs transition-all active:scale-98 shadow-md flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider font-sans"
              >
                <span>Book Free Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </main>

      {/* Public Footer */}
      <Footer email={EMAIL} />

      {/* Consultation Modal Integration */}
      <ConsultationModal
        isOpen={consultationOpen}
        onClose={() => setConsultationOpen(false)}
        initialMessage={consultationMessage}
      />

      {/* Global Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-slate-800 text-white text-xs font-semibold px-4 py-3.5 rounded-xl shadow-2xl flex items-center gap-2.5 z-55 animate-in fade-in slide-in-from-bottom-5 duration-250">
          <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Check className="w-3 h-3 text-emerald-500" />
          </div>
          <span>Email copied: <strong>{EMAIL}</strong></span>
        </div>
      )}

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
