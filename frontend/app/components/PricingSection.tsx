"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { 
  ArrowRight, Shield, CloudLightning, Lock, Headphones, Check, 
  Sparkles, ChevronDown, ChevronRight, Server, ChevronLeft, Info
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────
// STATIC MAPPINGS & DATA
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
    "Client Booking Widget",
    "Staff Roster Coordination",
    "SMS Booking Reminders",
    "Availability Sync"
  ],
  "Standalone POS (Point of Sale)": [
    "Thermal Receipt Printing",
    "Multi-Gateway Support",
    "Void & Transaction Logs",
    "End-of-Shift Cash Balancing"
  ],
  "Small Inventory System": [
    "SKU & Barcode Logs",
    "Manual Stock Updates",
    "Low-Stock Alerts",
    "Supplier Purchase Logs"
  ],
  "Customer CRM & Membership Wallet": [
    "Prepaid Player Wallet",
    "Tier Levels (Silver/Gold)",
    "Loyalty Points Engine",
    "QR Check-in Scans"
  ],
  "E-Commerce Online Store": [
    "Secure Cart & Checkout",
    "Lalamove/J&T Shipping Sync",
    "GCash/Maya/Card Pay",
    "Coupon & Promo Engine"
  ],
  "Venue / Facility Booking Grid": [
    "Hourly Asset Booking Grid",
    "Peak Hour Pricing Rules",
    "Visual Floor Layouts",
    "Automatic Slot Lockouts"
  ],
  "MIS Dashboard & Custom Reports": [
    "Executive KPI Counters",
    "Role-Based Access Controls",
    "Excel & PDF Data Exports",
    "Cross-Module Analytics"
  ],
  "Big Inventory & Supply Chain": [
    "Multi-Branch Stock Sync",
    "Inter-Branch Transfers",
    "Auto-Replenish Limits",
    "Damage & Loss Audits"
  ],
  "Franchise & Branch HQ Panel": [
    "Central Multi-Branch Grid",
    "Royalty Calculator Billing",
    "Central Product Catalog",
    "HQ Security Audit Logs"
  ],
  "Enterprise ERP & Legacy Integration": [
    "Bare-Metal Sync Triggers",
    "Legacy DB Bridge Nodes",
    "Fleet Driver Logistics App",
    "Accounting Ledgers Sync"
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

interface Blueprint {
  name: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  modulesIncluded: string[];
  dbModules: string[];
  dbHosting: string;
  popular?: boolean;
}

const BLUEPRINTS: Blueprint[] = [
  {
    name: "Sports & Fitness Arena Suite",
    tagline: "Custom scheduling platform for sports centers & clubs.",
    icon: CloudLightning,
    description: "Fully automated facilities scheduling, cashier POS checkout, player wallets, and standard hosting.",
    modulesIncluded: [
      "Live Booking Calendar Grid",
      "Dynamic Facility Court Allocation",
      "Cashier POS POS Checkout Terminal",
      "Loyalty Credits Member Wallet",
      "SMS Booking Notifications"
    ],
    dbModules: ["Appointment & Slot Booking", "Standalone POS (Point of Sale)", "Venue / Facility Booking Grid"],
    dbHosting: "Basic Server & DB (Starter Host)"
  },
  {
    name: "Healthcare Clinic Suite",
    tagline: "EHR CRM records for medical and clinic groups.",
    icon: Sparkles,
    description: "Centralized EHR records, cross-branch calendar coordination, patient profile CRM, and advanced hosting.",
    modulesIncluded: [
      "Central Patient Profiles CRM",
      "Encrypted Medical Records Intake",
      "Multi-Branch Doctor Rosters",
      "SMS Schedule Appointments Auto-Alert",
      "Small Scale Stock Room Inventories"
    ],
    dbModules: ["Appointment & Slot Booking", "Small Inventory System", "Customer CRM & Membership Wallet"],
    dbHosting: "Advanced Server & DB (Pro Host)",
    popular: true
  },
  {
    name: "Enterprise Multi-Branch ERP",
    tagline: "HQ orchestration for franchises and networks.",
    icon: Shield,
    description: "Consolidated multi-branch supply chain tracker, headquarters operations, custom report charts, and enterprise cloud hosting.",
    modulesIncluded: [
      "Consolidated Central Multi-Branch Inventory",
      "HQ Administration Control Console",
      "Custom MIS Revenue Dashboard Analytics",
      "Secure Department Action Audit Logs",
      "Dedicated Enterprise Level Network Hosting"
    ],
    dbModules: ["Big Inventory & Supply Chain", "Franchise & Branch HQ Panel", "MIS Dashboard & Custom Reports"],
    dbHosting: "High-Availability Cloud Network (Enterprise Host)"
  }
];

interface PricingSectionProps {
  email: string;
  onOpenConsultation: (message?: string) => void;
}

export default function PricingSection({ email, onOpenConsultation }: PricingSectionProps) {
  const [plan, setPlan] = useState<DBPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [enabledModuleIds, setEnabledModuleIds] = useState<Set<string>>(new Set());
  const [selectedHostId, setSelectedHostId] = useState<string>("none");
  const [includeMaintenance, setIncludeMaintenance] = useState(true);
  const [highlightCalculator, setHighlightCalculator] = useState(false);
  const [activeBlueprint, setActiveBlueprint] = useState<string | null>(null);

  // Group Expand states
  const [starterOpen, setStarterOpen] = useState(true);
  const [proOpen, setProOpen] = useState(true);
  const [enterpriseOpen, setEnterpriseOpen] = useState(true);
  const [hostingOpen, setHostingOpen] = useState(true);

  // USD → PHP Exchange Rate
  const [usdRate, setUsdRate] = useState<number>(57);
  const [rateDate, setRateDate] = useState<string>("");

  const carouselRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Plan & Modules from Public API Route
  useEffect(() => {
    let active = true;
    const fetchPlanData = async () => {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      try {
        const res = await fetch(`${apiUrl}/public/pricing/plans`);
        if (!res.ok) throw new Error("Failed to load plans from DB.");
        const json = await res.json();
        const customPlan = json.data?.find((p: DBPlan) => p.slug === "custom") || json.data?.[0];

        if (customPlan && active) {
          setPlan(customPlan);
          // Prefill default modules (is_required or enabled_by_default)
          const defaults = new Set<string>();
          customPlan.modules.forEach((mod: DBModule) => {
            if (mod.category === "build" && (mod.is_required || mod.enabled_by_default)) {
              defaults.add(mod.id);
            }
          });
          setEnabledModuleIds(defaults);

          // Select first hosting option
          const hosts = customPlan.modules.filter((mod: DBModule) => mod.category === "support");
          if (hosts.length > 0) {
            setSelectedHostId(hosts[0].id);
          }
        }
      } catch (err) {
        console.warn("Backend dynamic pricing unavailable, using local cache fallback:", err);
        if (active) {
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
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchPlanData();
    return () => { active = false; };
  }, []);

  // 2. Fetch Live USD exchange rate
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

  // 3. Separate build vs hosting modules
  const buildModules = useMemo(() => {
    if (!plan) return [];
    return plan.modules.filter((m) => m.category === "build");
  }, [plan]);

  const hostingModules = useMemo(() => {
    if (!plan) return [];
    return plan.modules.filter((m) => m.category === "support");
  }, [plan]);

  // 4. Categorize Build modules
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

  // 5. Calculations (50% downpayment rule applied)
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

    // Dynamic Monthly support = (maintenance sum of active modules) + hosting server cost
    const monthlyTotal = (includeMaintenance ? maintenanceTotal : 0) + hostCostPhp;

    const complexityAvg = activeBuildModulesCount > 0 ? Math.round(complexitySum / activeBuildModulesCount) : 0;

    return {
      buildTotal,
      maintenanceTotal: includeMaintenance ? maintenanceTotal : 0,
      hostCostUsd,
      hostCostPhp,
      monthlyTotal,
      complexityAvg,
      activeCount: activeBuildModulesCount,
      totalCount: buildModules.length
    };
  }, [buildModules, hostingModules, enabledModuleIds, selectedHostId, usdRate, includeMaintenance]);

  // Dynamic Blueprint computations for Carousel cards
  const blueprintsCalculated = useMemo(() => {
    if (buildModules.length === 0) return [];
    return BLUEPRINTS.map((bp) => {
      let setupSum = 0;
      let monthlySum = 0;
      bp.dbModules.forEach((name) => {
        const mod = buildModules.find((m) => m.name === name);
        if (mod) {
          setupSum += mod.build_price;
          monthlySum += mod.monthly_price;
        }
      });

      const hostMod = hostingModules.find((h) => h.name === bp.dbHosting);
      const hostCostUsd = hostMod ? hostMod.monthly_price : 0;
      const hostCostPhp = Math.round(hostCostUsd * usdRate);

      // Downpayment is 50%
      const downpayment = Math.round(setupSum * 0.50);
      const remaining = setupSum - downpayment;
      const installment = Math.round(remaining / 12) + hostCostPhp + (includeMaintenance ? monthlySum : 0);

      return {
        ...bp,
        setupPrice: setupSum,
        cloudCost: hostCostPhp,
        downpayment,
        installment
      };
    });
  }, [buildModules, hostingModules, usdRate, includeMaintenance]);

  // Formatter
  const peso = (n: number) => "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 0 });

  // 6. Sync Carousel selection to Estimator Checkbox list
  const handleApplyBlueprint = (bp: typeof BLUEPRINTS[0]) => {
    setActiveBlueprint(bp.name);
    const newSelections = new Set<string>();

    bp.dbModules.forEach((modName) => {
      const match = buildModules.find((m) => m.name === modName);
      if (match) newSelections.add(match.id);
    });

    setEnabledModuleIds(newSelections);

    const matchedHost = hostingModules.find((h) => h.name === bp.dbHosting);
    if (matchedHost) {
      setSelectedHostId(matchedHost.id);
    }

    // Scroll smoothly to Interactive Estimator anchor
    const target = document.getElementById("interactive-calculator");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Flash border color of calculator to give visual feedback
    setHighlightCalculator(true);
    setTimeout(() => {
      setHighlightCalculator(false);
    }, 1500);
  };

  const toggleModule = (id: string) => {
    setActiveBlueprint(null); // clear preset tag if manual overrides happen
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
    setActiveBlueprint(null);
    setEnabledModuleIds(new Set());
    setSelectedHostId("none");
  };

  // Carousel scroll helpers
  const handleCarouselScroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      const offset = direction === "left" ? -clientWidth * 0.8 : clientWidth * 0.8;
      carouselRef.current.scrollTo({
        left: scrollLeft + offset,
        behavior: "smooth"
      });
    }
  };

  // Handle Consultation Trigger with pre-filled parameters
  const handleBookConsultation = () => {
    const selectedModNames = Array.from(enabledModuleIds)
      .map(id => buildModules.find(m => m.id === id)?.name)
      .filter(Boolean);
    const selectedHostName = hostingModules.find(h => h.id === selectedHostId)?.name || "Client-Managed Hosting";
    
    const prefillMessage = `Hello, I checked my estimates on your pricing engine. I am interested in building a custom platform configured with the following selections:

🚀 System Modules:
${selectedModNames.length > 0 ? selectedModNames.map(name => `• ${name}`).join("\n") : "• None selected"}

🌐 Managed Server Tier:
• ${selectedHostName}

💰 Estimated Financials:
• Total Build Contract Value: ${peso(calculations.buildTotal)}
• 50% Production Downpayment: ${peso(Math.round(calculations.buildTotal * 0.50))}
• Estimated Monthly installment: ${peso(calculations.monthlyTotal)}/mo (includes monthly support & cloud server charges)

Let's schedule a call to finalize details.`;

    onOpenConsultation(prefillMessage);
  };

  if (loading) {
    return (
      <section id="pricing" className="py-24 bg-slate-50 border-t border-slate-200/50 flex flex-col items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-250 border-t-emerald-600 rounded-full animate-spin"></div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">
            Configuring Cost Estimator...
          </span>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="py-24 bg-slate-50 border-t border-slate-200/50 scroll-mt-10">
      <div className="max-w-6xl mx-auto px-6 font-sans">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100/50">
            SIMPLE, TRANSPARENT, FAIR
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
            Tailored Modular Platform Costing
          </h2>
          <p className="text-sm text-slate-500 mt-4 leading-relaxed">
            Choose a pre-configured industry blueprint or customize your system estimate using our live Interactive Estimator checklist.
          </p>
        </div>

        {/* 🎠 BLUEPRINT PRESET CAROUSEL (Moving Side Carousel) */}
        <div className="relative mb-20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Selectable Blueprint Presets</span>
            </h3>
            
            {/* Carousel Control Buttons */}
            <div className="flex gap-2">
              <button 
                onClick={() => handleCarouselScroll("left")}
                className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-slate-805 hover:border-slate-350 transition-all cursor-pointer shadow-xs active:scale-95"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleCarouselScroll("right")}
                className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-slate-805 hover:border-slate-350 transition-all cursor-pointer shadow-xs active:scale-95"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Carousel Track */}
          <div 
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide pb-4 -mx-6 px-6"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {blueprintsCalculated.map((blueprint) => {
              const BlueprintIcon = blueprint.icon;
              const isSelected = activeBlueprint === blueprint.name;
              
              return (
                <div
                  key={blueprint.name}
                  className={`snap-start shrink-0 w-[85%] sm:w-[380px] md:w-[350px] relative rounded-3xl bg-white border p-8 flex flex-col justify-between shadow-[0_4px_20px_rgba(15,23,42,0.02)] hover:shadow-md transition-all duration-300 overflow-hidden ${
                    isSelected ? "border-emerald-600 ring-2 ring-emerald-500/20" : blueprint.popular ? "border-emerald-500/80 shadow-[0_10px_35px_rgba(16,185,129,0.03)]" : "border-slate-200"
                  }`}
                >
                  {blueprint.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-emerald-600 text-white font-mono text-[9px] uppercase font-bold tracking-widest py-1.5 flex items-center justify-center gap-1">
                      ★ MOST POPULAR PRESET
                    </div>
                  )}

                  <div className={`flex flex-col gap-5 text-left flex-1 ${blueprint.popular ? "pt-4" : ""}`}>
                    
                    {/* Header */}
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100">
                        <BlueprintIcon className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h4 className="text-md font-extrabold text-slate-900 tracking-tight leading-snug">{blueprint.name}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 leading-normal font-semibold">
                          {blueprint.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="h-[1px] bg-slate-100" />

                    {/* Financial Summary (50% Downpayment Applied) */}
                    <div className="flex flex-col gap-2">
                      <div className="grid grid-cols-2 gap-2 relative py-1">
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">System Price</span>
                          <span className="text-md font-extrabold text-slate-950 block mt-0.5 leading-tight">
                            {peso(blueprint.setupPrice)}
                          </span>
                        </div>
                        <div className="absolute top-1 bottom-1 left-1/2 w-[1px] bg-slate-100" />
                        <div className="pl-3">
                          <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block">Downpayment (50%)</span>
                          <span className="text-md font-extrabold text-slate-800 block mt-0.5 leading-tight">
                            {peso(blueprint.downpayment)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 relative py-1 bg-emerald-50/60 border border-emerald-100/70 rounded-xl px-3 mt-1">
                        <div>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Server hosting</span>
                          <span className="text-[12px] font-extrabold text-slate-600 block mt-0.5 leading-tight">
                            {peso(blueprint.cloudCost)}<span className="text-[8px] text-slate-400 font-normal">/mo</span>
                          </span>
                        </div>
                        <div className="absolute top-2 bottom-2 left-1/2 w-[1px] bg-emerald-200/50" />
                        <div className="pl-3">
                          <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-wider block">Installment</span>
                          <span className="text-[12px] font-extrabold text-emerald-600 block mt-0.5 leading-tight">
                            {peso(blueprint.installment)}<span className="text-[8px] text-slate-400 font-normal">/mo × 12</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="h-[1px] bg-slate-100" />

                    {/* Features checklist bullets */}
                    <div className="flex-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                        Build Features Included
                      </span>
                      <ul className="flex flex-col gap-2">
                        {blueprint.modulesIncluded.map((mod) => (
                          <li key={mod} className="flex items-center gap-2 text-xs text-slate-700 font-bold">
                            <div className="w-3.5 h-3.5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                              <Check className="w-2 h-2 text-emerald-650" strokeWidth={3} />
                            </div>
                            <span className="truncate">{mod}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Apply Button */}
                  <div className="mt-6 shrink-0">
                    <button
                      onClick={() => handleApplyBlueprint(blueprint)}
                      className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-xs transition-all active:scale-98 cursor-pointer shadow-xs ${
                        isSelected 
                          ? "bg-emerald-650 text-white hover:bg-emerald-700 shadow-md shadow-emerald-650/10" 
                          : "bg-slate-900 hover:bg-slate-805 text-white"
                      }`}
                    >
                      <span>{isSelected ? "Selected & Loaded" : "Customize Blueprint"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 💻 INTERACTIVE PRICING ESTIMATOR (Live Checklist and Sticky Valuation) */}
        <div 
          id="interactive-calculator" 
          className={`grid grid-cols-1 lg:grid-cols-3 gap-8 items-start scroll-mt-28 p-1 rounded-3xl transition-all duration-700 ${
            highlightCalculator ? "ring-4 ring-emerald-500/30 scale-[1.01]" : ""
          }`}
        >
          {/* Interactive Checklist list (Spans 2 columns) */}
          <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-3xl shadow-xs flex flex-col gap-5 text-left">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  Select Custom Platform Modules
                </h3>
                <p className="text-[10px] text-slate-450 mt-0.5">Toggle modules to custom-tailor your operational engine.</p>
              </div>
              <button 
                onClick={handleReset}
                className="text-[10px] font-bold text-slate-400 hover:text-slate-650 hover:underline cursor-pointer"
              >
                Reset Selections
              </button>
            </div>

            {/* A. STARTER MODULES ACCORDION */}
            <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white">
              <button 
                onClick={() => setStarterOpen(!starterOpen)}
                className="w-full px-5 py-4 bg-slate-50/50 flex justify-between items-center border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer text-left animate-fade-in"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    Starter Modules (Brochure / Small Backend)
                  </span>
                </div>
                {starterOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-450" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-450" />}
              </button>

              {starterOpen && (
                <div className="p-4 flex flex-col gap-3">
                  {categorizedModules.starter.map((m) => {
                    const selected = enabledModuleIds.has(m.id);
                    return (
                      <div 
                        key={m.id}
                        onClick={() => toggleModule(m.id)}
                        className={`p-3.5 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer select-none ${
                          selected 
                            ? "bg-slate-50/30 border-emerald-500 shadow-[0_2px_10px_rgba(16,185,129,0.01)]" 
                            : "border-slate-200 bg-white hover:border-slate-350"
                        }`}
                      >
                        <div className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                          selected ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 text-transparent"
                        }`}>
                          <Check className="w-3 h-3" strokeWidth={3.5} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h5 className="text-[12px] font-extrabold text-slate-805">{m.name}</h5>
                            <span className="text-[11px] font-bold text-slate-800 shrink-0 ml-4">{peso(m.build_price)}</span>
                          </div>
                          <p className="text-[10px] text-slate-450 mt-1 font-semibold leading-relaxed">
                            {MODULE_DESCRIPTIONS[m.name] || "Custom features tailored for booking slots and online presence."}
                          </p>
                          {/* Mini Features List */}
                          {MODULE_FEATURES[m.name] && (
                            <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 border-t border-slate-100/60 pt-2">
                              {MODULE_FEATURES[m.name].slice(0, 3).map((f) => (
                                <span key={f} className="text-[8px] text-slate-400 font-bold flex items-center gap-1">
                                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                  {f}
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

            {/* B. PROFESSIONAL MODULES ACCORDION */}
            <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white">
              <button 
                onClick={() => setProOpen(!proOpen)}
                className="w-full px-5 py-4 bg-slate-50/50 flex justify-between items-center border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer text-left animate-fade-in"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    Professional Modules (Mid-Tier Operations)
                  </span>
                </div>
                {proOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-450" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-450" />}
              </button>

              {proOpen && (
                <div className="p-4 flex flex-col gap-3">
                  {categorizedModules.pro.map((m) => {
                    const selected = enabledModuleIds.has(m.id);
                    return (
                      <div 
                        key={m.id}
                        onClick={() => toggleModule(m.id)}
                        className={`p-3.5 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer select-none ${
                          selected 
                            ? "bg-slate-50/30 border-emerald-500 shadow-[0_2px_10px_rgba(16,185,129,0.01)]" 
                            : "border-slate-200 bg-white hover:border-slate-350"
                        }`}
                      >
                        <div className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                          selected ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 text-transparent"
                        }`}>
                          <Check className="w-3 h-3" strokeWidth={3.5} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h5 className="text-[12px] font-extrabold text-slate-805">{m.name}</h5>
                            <span className="text-[11px] font-bold text-slate-800 shrink-0 ml-4">{peso(m.build_price)}</span>
                          </div>
                          <p className="text-[10px] text-slate-450 mt-1 font-semibold leading-relaxed">
                            {MODULE_DESCRIPTIONS[m.name] || "Advanced CRM, logistics, dashboards, and operational flows."}
                          </p>
                          {/* Mini Features List */}
                          {MODULE_FEATURES[m.name] && (
                            <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 border-t border-slate-100/60 pt-2">
                              {MODULE_FEATURES[m.name].slice(0, 3).map((f) => (
                                <span key={f} className="text-[8px] text-slate-400 font-bold flex items-center gap-1">
                                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                  {f}
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

            {/* C. ENTERPRISE MODULES ACCORDION */}
            <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white">
              <button 
                onClick={() => setEnterpriseOpen(!enterpriseOpen)}
                className="w-full px-5 py-4 bg-slate-50/50 flex justify-between items-center border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer text-left animate-fade-in"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    Enterprise Modules (Advanced Networks)
                  </span>
                </div>
                {enterpriseOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-450" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-450" />}
              </button>

              {enterpriseOpen && (
                <div className="p-4 flex flex-col gap-3">
                  {categorizedModules.ent.map((m) => {
                    const selected = enabledModuleIds.has(m.id);
                    return (
                      <div 
                        key={m.id}
                        onClick={() => toggleModule(m.id)}
                        className={`p-3.5 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer select-none ${
                          selected 
                            ? "bg-slate-50/30 border-emerald-500 shadow-[0_2px_10px_rgba(16,185,129,0.01)]" 
                            : "border-slate-200 bg-white hover:border-slate-350"
                        }`}
                      >
                        <div className={`w-4.5 h-4.5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                          selected ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 text-transparent"
                        }`}>
                          <Check className="w-3 h-3" strokeWidth={3.5} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h5 className="text-[12px] font-extrabold text-slate-805">{m.name}</h5>
                            <span className="text-[11px] font-bold text-slate-800 shrink-0 ml-4">{peso(m.build_price)}</span>
                          </div>
                          <p className="text-[10px] text-slate-450 mt-1 font-semibold leading-relaxed">
                            {MODULE_DESCRIPTIONS[m.name] || "Legacy integration, supply chain networks, and headquarters views."}
                          </p>
                          {/* Mini Features List */}
                          {MODULE_FEATURES[m.name] && (
                            <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 border-t border-slate-100/60 pt-2">
                              {MODULE_FEATURES[m.name].slice(0, 3).map((f) => (
                                <span key={f} className="text-[8px] text-slate-400 font-bold flex items-center gap-1">
                                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                  {f}
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

            {/* D. HOSTING ACCORDION (Radio Selection) */}
            <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white">
              <button 
                onClick={() => setHostingOpen(!hostingOpen)}
                className="w-full px-5 py-4 bg-slate-50/50 flex justify-between items-center border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-2">
                  <Server className="w-3.5 h-3.5 text-slate-550" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    Infrastructure & Database Hosting Server
                  </span>
                </div>
                {hostingOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-450" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-450" />}
              </button>

              {hostingOpen && (
                <div className="p-4 flex flex-col gap-3 animate-fade-in">
                  <p className="text-[10px] text-slate-500 mb-2 leading-relaxed">
                    Choose who hosts the database and API. If Novaryn manages deployment, choose a server size.
                  </p>

                  <div className="flex flex-col gap-2">
                    {/* Client Managed */}
                    <label
                      className={`flex items-start justify-between p-3 border.5 rounded-xl cursor-pointer transition-all ${
                        selectedHostId === "none"
                          ? "border-emerald-500 bg-emerald-50/10"
                          : "border-slate-200 hover:border-slate-350 bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <input
                          type="radio"
                          name="hosting-select"
                          checked={selectedHostId === "none"}
                          onChange={() => setSelectedHostId("none")}
                          className="mt-0.5 accent-emerald-600 cursor-pointer"
                        />
                        <div>
                          <span className="text-[11px] font-extrabold text-slate-800 block">Client-Managed Hosting</span>
                          <span className="text-[9px] text-slate-450 block mt-0.5">We deploy to your corporate AWS or Vercel accounts.</span>
                        </div>
                      </div>
                      <span className="text-[11px] font-extrabold text-slate-800">₱0</span>
                    </label>

                    {/* API Hosting Options */}
                    {hostingModules.map((h) => {
                      const costPhp = Math.round(h.monthly_price * usdRate);
                      return (
                        <label
                          key={h.id}
                          className={`flex items-start justify-between p-3 border.5 rounded-xl cursor-pointer transition-all ${
                            selectedHostId === h.id
                              ? "border-emerald-500 bg-emerald-50/10"
                              : "border-slate-200 hover:border-slate-350 bg-white"
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <input
                              type="radio"
                              name="hosting-select"
                              checked={selectedHostId === h.id}
                              onChange={() => setSelectedHostId(h.id)}
                              className="mt-0.5 accent-emerald-600 cursor-pointer"
                            />
                            <div>
                              <span className="text-[11px] font-extrabold text-slate-800 block">{h.name}</span>
                              <span className="text-[9px] text-slate-450 block mt-0.5">
                                Managed cloud service (${h.monthly_price}/mo). Conversion cached at {usdRate} ₱/$.
                              </span>
                            </div>
                          </div>
                          <span className="text-[11px] font-extrabold text-slate-800">
                            {peso(costPhp)}<span className="text-[9px] text-slate-400 font-normal">/mo</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Support SLA Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-55/40 rounded-2xl border border-slate-100/80">
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
                aria-label="Toggle support maintenance"
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    includeMaintenance ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Sticky Estimate receipt summary card */}
          <div className="sticky top-28 bg-white border border-slate-200 p-6 rounded-3xl shadow-md flex flex-col gap-6 text-left transition-all">
            <div>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">
                Calculated Estimate
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">Platform Valuation</h3>
            </div>

            <div className="flex flex-col gap-4 text-xs font-semibold">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">Total Build Price</span>
                <span className="text-base font-black text-slate-900">{peso(calculations.buildTotal)}</span>
              </div>

              {/* Downpayment is strictly 50% */}
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">Launch Downpayment (50%)</span>
                <span className="text-base font-black text-slate-850">{peso(Math.round(calculations.buildTotal * 0.50))}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">Cloud Server Hosting</span>
                <span className="text-base font-black text-slate-650">
                  {peso(calculations.hostCostPhp)}<span className="text-[10px] text-slate-400 font-normal">/mo</span>
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-bold">Monthly Installments</span>
                <span className="text-base font-black text-emerald-650">
                  {peso(Math.round(calculations.buildTotal * 0.50 / 12) + calculations.hostCostPhp + (includeMaintenance ? calculations.maintenanceTotal : 0))}
                  <span className="text-[10px] text-slate-450 font-normal">/mo × 12</span>
                </span>
              </div>

              <div className="h-[1px] bg-slate-100 my-1" />

              <div className="flex items-start gap-2.5 leading-relaxed text-[10px] text-slate-450 font-medium">
                <Shield className="w-4 h-4 text-slate-400 shrink-0 mt-0.5 animate-pulse" />
                <span>
                  All estimates are subject to final architectural validation. Downpayments are non-refundable once sprints initiate.
                </span>
              </div>
            </div>

            <button
              onClick={handleBookConsultation}
              className="w-full py-4 rounded-xl bg-slate-900 hover:bg-slate-805 text-white font-bold text-xs transition-all active:scale-98 shadow-md flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider font-sans"
            >
              <span>Book Quote Consultation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Trust Indicators Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-t border-slate-200/60 max-w-5xl mx-auto mt-20 mb-10 text-left">
          {[
            { label: "12 Months Free Support", sub: "Included in all platforms", icon: Shield },
            { label: "Secure & Reliable", sub: "99.99% Node Uptime Guarantees", icon: CloudLightning },
            { label: "Bespoke Source Code Ownership", sub: "Clean PHP/React deliveries", icon: Lock },
            { label: "Active SLA Support Lines", sub: "Dedicated DevOps resources", icon: Headphones }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.label}</h4>
                  <p className="text-[10px] text-slate-455 font-bold mt-0.5 leading-tight">{item.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
