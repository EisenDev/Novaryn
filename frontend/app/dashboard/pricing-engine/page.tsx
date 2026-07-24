"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  Calculator, Zap, ChevronDown, ChevronRight,
  Minus, Plus, Save, Send, RefreshCw, Info,
  ToggleLeft, ToggleRight, BadgePercent, Rocket, Gem, Building2,
  Lock, Unlock, AlertCircle
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────

interface Module {
  id: string;
  name: string;
  buildPrice: number;
  monthlyPrice: number;
  complexityScore: number;
  required: boolean;
  enabled: boolean;
}

interface SupportService {
  id: string;
  name: string;
  monthlyPrice: number;
  required: boolean;
  enabled: boolean;
}

interface Plan {
  id: string;
  name: string;
  slug: string;
  icon: React.ComponentType<{ className?: string }>;
  minBuildPrice: number;
  minMonthlyPrice: number;
  modules: Module[];
  support: SupportService[];
}

// ─────────────────────────────────────────────────────────────────
// STATIC DATA — mirrors the DB seed
// ─────────────────────────────────────────────────────────────────

const INITIAL_PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    slug: "starter",
    icon: Rocket,
    minBuildPrice: 20_000,
    minMonthlyPrice: 5_000,
    modules: [
      { id: "s1",  name: "Custom Brand Website",    buildPrice: 8_000,  monthlyPrice: 300, complexityScore: 4, required: false, enabled: true },
      { id: "s2",  name: "Online Booking Engine",   buildPrice: 18_000, monthlyPrice: 800, complexityScore: 8, required: false, enabled: true },
      { id: "s3",  name: "Responsive UI",           buildPrice: 5_000,  monthlyPrice: 200, complexityScore: 3, required: false, enabled: true },
      { id: "s4",  name: "Admin Dashboard",         buildPrice: 12_000, monthlyPrice: 600, complexityScore: 6, required: false, enabled: true },
      { id: "s5",  name: "User Accounts",           buildPrice: 8_000,  monthlyPrice: 300, complexityScore: 4, required: false, enabled: true },
      { id: "s6",  name: "Booking Calendar",        buildPrice: 10_000, monthlyPrice: 500, complexityScore: 5, required: false, enabled: true },
      { id: "s7",  name: "GCash / Maya Payments",   buildPrice: 12_000, monthlyPrice: 700, complexityScore: 6, required: false, enabled: true },
      { id: "s8",  name: "QR Code Check-in",        buildPrice: 8_000,  monthlyPrice: 400, complexityScore: 3, required: false, enabled: true },
      { id: "s9",  name: "Automated Email Alerts",  buildPrice: 4_000,  monthlyPrice: 200, complexityScore: 2, required: false, enabled: true },
      { id: "s10", name: "Basic Analytics",         buildPrice: 7_000,  monthlyPrice: 300, complexityScore: 3, required: false, enabled: true },
      { id: "s11", name: "Reports & Data Export",   buildPrice: 8_000,  monthlyPrice: 400, complexityScore: 4, required: false, enabled: true },
    ],
    support: [
      { id: "ss1", name: "Standard Cloud Hosting",     monthlyPrice: 1_500, required: true,  enabled: true },
      { id: "ss2", name: "Active Server Monitoring",   monthlyPrice: 700,   required: true,  enabled: true },
      { id: "ss3", name: "Monthly Security Updates",   monthlyPrice: 900,   required: false, enabled: true },
      { id: "ss4", name: "Weekly Server Backups",      monthlyPrice: 600,   required: false, enabled: true },
      { id: "ss5", name: "Email & Chat Tech Support",  monthlyPrice: 800,   required: false, enabled: true },
      { id: "ss6", name: "Infrastructure Maintenance", monthlyPrice: 2_000, required: false, enabled: true },
      { id: "ss7", name: "Performance Audit",          monthlyPrice: 3_500, required: false, enabled: true },
    ],
  },
  {
    id: "professional",
    name: "Professional",
    slug: "professional",
    icon: Gem,
    minBuildPrice: 30_000,
    minMonthlyPrice: 8_000,
    modules: [
      { id: "p1",  name: "Unlimited Facility Modules",     buildPrice: 20_000, monthlyPrice: 1_000, complexityScore: 7,  required: false, enabled: true },
      { id: "p2",  name: "Tiered Membership System",       buildPrice: 15_000, monthlyPrice: 800,   complexityScore: 6,  required: false, enabled: true },
      { id: "p3",  name: "Customer CRM",                   buildPrice: 25_000, monthlyPrice: 1_200, complexityScore: 10, required: false, enabled: true },
      { id: "p4",  name: "Open Play Reservation Logic",    buildPrice: 12_000, monthlyPrice: 600,   complexityScore: 5,  required: false, enabled: true },
      { id: "p5",  name: "Loyalty & Rewards System",       buildPrice: 10_000, monthlyPrice: 500,   complexityScore: 5,  required: false, enabled: true },
      { id: "p6",  name: "Point-of-Sale Module",           buildPrice: 18_000, monthlyPrice: 900,   complexityScore: 7,  required: false, enabled: true },
      { id: "p7",  name: "Prepaid Credits & Wallet",       buildPrice: 15_000, monthlyPrice: 800,   complexityScore: 7,  required: false, enabled: true },
      { id: "p8",  name: "Advanced Analytics & Reports",   buildPrice: 12_000, monthlyPrice: 600,   complexityScore: 6,  required: false, enabled: true },
      { id: "p9",  name: "QR Check-in Advanced",          buildPrice: 10_000, monthlyPrice: 500,   complexityScore: 4,  required: false, enabled: true },
      { id: "p10", name: "Priority Support Ticketing",     buildPrice: 13_000, monthlyPrice: 600,   complexityScore: 3,  required: false, enabled: true },
    ],
    support: [
      { id: "ps1", name: "High-Performance CDN Hosting",      monthlyPrice: 2_500, required: true,  enabled: true },
      { id: "ps2", name: "Priority SLA Support",              monthlyPrice: 2_000, required: false, enabled: true },
      { id: "ps3", name: "Monthly Code & Feature Updates",    monthlyPrice: 3_000, required: false, enabled: true },
      { id: "ps4", name: "Server Uptime Optimizations",       monthlyPrice: 2_000, required: false, enabled: true },
      { id: "ps5", name: "Daily Encrypted DB Backups",        monthlyPrice: 2_000, required: false, enabled: true },
      { id: "ps6", name: "Live Security Threat Scanning",     monthlyPrice: 1_500, required: false, enabled: true },
      { id: "ps7", name: "Complete Hosting Management",       monthlyPrice: 2_000, required: false, enabled: true },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    slug: "enterprise",
    icon: Building2,
    minBuildPrice: 50_000,
    minMonthlyPrice: 10_000,
    modules: [
      { id: "e1", name: "Multi-Branch Administration",       buildPrice: 50_000, monthlyPrice: 3_000, complexityScore: 10, required: false, enabled: true },
      { id: "e2", name: "Franchise Network Modules",         buildPrice: 40_000, monthlyPrice: 2_500, complexityScore: 10, required: false, enabled: true },
      { id: "e3", name: "HQ Central Operations Panel",       buildPrice: 50_000, monthlyPrice: 3_000, complexityScore: 10, required: false, enabled: true },
      { id: "e4", name: "Custom Active Directory Roles",     buildPrice: 30_000, monthlyPrice: 1_500, complexityScore: 8,  required: false, enabled: true },
      { id: "e5", name: "Custom ERP Integrations",           buildPrice: 80_000, monthlyPrice: 5_000, complexityScore: 10, required: false, enabled: true },
      { id: "e6", name: "Business Intelligence Dashboards",  buildPrice: 60_000, monthlyPrice: 4_000, complexityScore: 10, required: false, enabled: true },
      { id: "e7", name: "Live Barcode Inventory Tracks",     buildPrice: 40_000, monthlyPrice: 2_500, complexityScore: 7,  required: false, enabled: true },
      { id: "e8", name: "Oracle / SAP System Syncs",         buildPrice: 80_000, monthlyPrice: 5_000, complexityScore: 10, required: false, enabled: true },
      { id: "e9", name: "Dedicated DevOps SLA",              buildPrice: 50_000, monthlyPrice: 3_000, complexityScore: 8,  required: false, enabled: true },
    ],
    support: [
      { id: "es1", name: "Dedicated Bare-Metal Hosting",        monthlyPrice: 5_000, required: true,  enabled: true },
      { id: "es2", name: "Full Legacy DB Migration",             monthlyPrice: 4_000, required: false, enabled: true },
      { id: "es3", name: "Dedicated DevOps Engineer SLA",        monthlyPrice: 6_000, required: false, enabled: true },
      { id: "es4", name: "99.99% Node Uptime Guarantee",         monthlyPrice: 3_000, required: false, enabled: true },
      { id: "es5", name: "24/7 Phone Incident Hotline",          monthlyPrice: 5_000, required: false, enabled: true },
      { id: "es6", name: "Custom Corporate SLA Agreements",      monthlyPrice: 5_000, required: false, enabled: true },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────

const peso = (n: number) =>
  "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 0 });

function calcPlan(plan: Plan) {
  const buildSum = plan.modules.filter((m) => m.enabled).reduce((s, m) => s + m.buildPrice, 0);
  const moduleMonthlySum = plan.modules.filter((m) => m.enabled).reduce((s, m) => s + m.monthlyPrice, 0);
  const supportSum = plan.support.filter((s) => s.enabled).reduce((s, srv) => s + srv.monthlyPrice, 0);

  const buildTotal = Math.max(plan.minBuildPrice, buildSum);
  const monthlyTotal = Math.max(plan.minMonthlyPrice, moduleMonthlySum + supportSum);
  const complexityAvg =
    plan.modules.filter((m) => m.enabled).length > 0
      ? Math.round(
          plan.modules.filter((m) => m.enabled).reduce((s, m) => s + m.complexityScore, 0) /
            plan.modules.filter((m) => m.enabled).length
        )
      : 0;

  return { buildTotal, monthlyTotal, buildSum, moduleMonthlySum, supportSum, complexityAvg };
}

// ─────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────

function ComplexityBar({ score }: { score: number }) {
  return (
    <div className="flex gap-0.5 items-center">
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

interface ModuleRowProps {
  mod: Module;
  onToggle: (id: string) => void;
}

function ModuleRow({ mod, onToggle }: ModuleRowProps) {
  return (
    <div
      className={`flex items-center justify-between py-2.5 px-3 rounded-lg transition-all ${
        mod.enabled ? "bg-white border border-slate-200/60" : "bg-slate-50 border border-transparent opacity-60"
      }`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {mod.required ? (
          <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" title="Required – cannot be removed" />
        ) : (
          <button
            onClick={() => onToggle(mod.id)}
            className="shrink-0 text-slate-300 hover:text-emerald-500 transition-colors cursor-pointer"
          >
            {mod.enabled ? (
              <ToggleRight className="w-5 h-5 text-emerald-500" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-slate-300" />
            )}
          </button>
        )}
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-slate-700 truncate">{mod.name}</p>
          <ComplexityBar score={mod.complexityScore} />
        </div>
      </div>
      <div className="flex items-center gap-5 shrink-0 text-right">
        <div>
          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Build</p>
          <p className={`text-[12px] font-semibold ${mod.enabled ? "text-slate-800" : "text-slate-400 line-through"}`}>
            {peso(mod.buildPrice)}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 uppercase tracking-wide">Monthly</p>
          <p className={`text-[12px] font-semibold ${mod.enabled ? "text-slate-800" : "text-slate-400 line-through"}`}>
            {peso(mod.monthlyPrice)}
          </p>
        </div>
      </div>
    </div>
  );
}

interface SupportRowProps {
  srv: SupportService;
  onToggle: (id: string) => void;
}

function SupportRow({ srv, onToggle }: SupportRowProps) {
  return (
    <div
      className={`flex items-center justify-between py-2.5 px-3 rounded-lg transition-all ${
        srv.enabled ? "bg-white border border-slate-200/60" : "bg-slate-50 border border-transparent opacity-60"
      }`}
    >
      <div className="flex items-center gap-3">
        {srv.required ? (
          <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" title="Required service" />
        ) : (
          <button onClick={() => onToggle(srv.id)} className="shrink-0 cursor-pointer">
            {srv.enabled ? (
              <ToggleRight className="w-5 h-5 text-emerald-500" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-slate-300" />
            )}
          </button>
        )}
        <p className="text-[12px] font-medium text-slate-700">{srv.name}</p>
      </div>
      <p className={`text-[12px] font-semibold ${srv.enabled ? "text-slate-800" : "text-slate-400 line-through"}`}>
        {peso(srv.monthlyPrice)}<span className="text-slate-400 font-normal text-[10px]">/mo</span>
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN PLAN PANEL
// ─────────────────────────────────────────────────────────────────

interface PlanPanelProps {
  plan: Plan;
  onChange: (plan: Plan) => void;
}

function PlanPanel({ plan, onChange }: PlanPanelProps) {
  const [modulesOpen, setModulesOpen] = useState(true);
  const [supportOpen, setSupportOpen] = useState(true);

  const { buildTotal, monthlyTotal, buildSum, supportSum, complexityAvg } = useMemo(
    () => calcPlan(plan),
    [plan]
  );

  const isAtMinBuild = buildSum < plan.minBuildPrice;
  const isAtMinMonthly = (plan.modules.filter((m) => m.enabled).reduce((s,m) => s + m.monthlyPrice, 0) + supportSum) < plan.minMonthlyPrice;

  const toggleModule = useCallback(
    (id: string) => {
      onChange({
        ...plan,
        modules: plan.modules.map((m) =>
          m.id === id && !m.required ? { ...m, enabled: !m.enabled } : m
        ),
      });
    },
    [plan, onChange]
  );

  const toggleSupport = useCallback(
    (id: string) => {
      onChange({
        ...plan,
        support: plan.support.map((s) =>
          s.id === id && !s.required ? { ...s, enabled: !s.enabled } : s
        ),
      });
    },
    [plan, onChange]
  );

  const enableAll = () =>
    onChange({ ...plan, modules: plan.modules.map((m) => ({ ...m, enabled: true })), support: plan.support.map((s) => ({ ...s, enabled: true })) });

  const PlanIcon = plan.icon;

  const enabledCount = plan.modules.filter((m) => m.enabled).length;
  const totalCount = plan.modules.length;

  return (
    <div className="bg-white border border-slate-200/70 rounded-2xl overflow-hidden shadow-sm">
      {/* Plan Header */}
      <div className="flex items-start justify-between p-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <PlanIcon className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">{plan.name}</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {enabledCount}/{totalCount} modules active · Complexity avg {complexityAvg}/10
            </p>
          </div>
        </div>
        <button
          onClick={enableAll}
          className="text-[10px] text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" /> Reset All
        </button>
      </div>

      {/* Live Price Summary */}
      <div className="grid grid-cols-2 divide-x divide-slate-100 border-b border-slate-100">
        <div className="p-4">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Base Build Price</p>
          <p className="text-xl font-semibold text-slate-900 mt-1 tracking-tight">{peso(buildTotal)}</p>
          {isAtMinBuild && (
            <p className="text-[10px] text-amber-500 font-medium flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" /> Floor minimum applied
            </p>
          )}
          <p className="text-[10px] text-slate-400 mt-0.5">min. {peso(plan.minBuildPrice)}</p>
        </div>
        <div className="p-4">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Monthly Support</p>
          <p className="text-xl font-semibold text-slate-900 mt-1 tracking-tight">{peso(monthlyTotal)}<span className="text-xs text-slate-400 font-normal">/mo</span></p>
          {isAtMinMonthly && (
            <p className="text-[10px] text-amber-500 font-medium flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3" /> Floor minimum applied
            </p>
          )}
          <p className="text-[10px] text-slate-400 mt-0.5">min. {peso(plan.minMonthlyPrice)}/mo</p>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {/* Build Modules Section */}
        <button
          className="flex items-center justify-between w-full text-left cursor-pointer"
          onClick={() => setModulesOpen((v) => !v)}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Build Modules ({enabledCount}/{totalCount})
          </span>
          {modulesOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        {modulesOpen && (
          <div className="flex flex-col gap-1.5">
            {plan.modules.map((mod) => (
              <ModuleRow key={mod.id} mod={mod} onToggle={toggleModule} />
            ))}
            <div className="flex justify-between items-center pt-2 border-t border-dashed border-slate-100 mt-1">
              <span className="text-[10px] text-slate-400 font-medium">Module subtotal</span>
              <span className="text-[12px] font-semibold text-slate-700">
                {peso(plan.modules.filter((m) => m.enabled).reduce((s, m) => s + m.buildPrice, 0))} build ·{" "}
                {peso(plan.modules.filter((m) => m.enabled).reduce((s, m) => s + m.monthlyPrice, 0))}/mo
              </span>
            </div>
          </div>
        )}

        {/* Support Services Section */}
        <button
          className="flex items-center justify-between w-full text-left cursor-pointer mt-1"
          onClick={() => setSupportOpen((v) => !v)}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Support Services ({plan.support.filter((s) => s.enabled).length}/{plan.support.length})
          </span>
          {supportOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        {supportOpen && (
          <div className="flex flex-col gap-1.5">
            {plan.support.map((srv) => (
              <SupportRow key={srv.id} srv={srv} onToggle={toggleSupport} />
            ))}
            <div className="flex justify-between items-center pt-2 border-t border-dashed border-slate-100 mt-1">
              <span className="text-[10px] text-slate-400 font-medium">Support subtotal</span>
              <span className="text-[12px] font-semibold text-slate-700">
                {peso(supportSum)}/mo
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// QUOTATION BUILDER PANEL
// ─────────────────────────────────────────────────────────────────

interface QuotationBuilderProps {
  plans: Plan[];
}

function QuotationBuilder({ plans }: QuotationBuilderProps) {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState("starter");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState(false);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId)!;
  const { buildTotal, monthlyTotal } = useMemo(() => calcPlan(selectedPlan), [selectedPlan]);

  const handleSave = () => {
    // Will POST to /api/v1/pricing/quotations once backend is wired
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="bg-white border border-slate-200/70 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <BadgePercent className="w-4 h-4 text-emerald-500" />
          <h3 className="text-sm font-semibold text-slate-900">Generate Client Quotation</h3>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Prices are snapshots — changing modules later won't affect saved quotes.
        </p>
      </div>

      <div className="p-5 flex flex-col gap-4">
        {/* Plan Selector */}
        <div className="grid grid-cols-3 gap-2">
          {plans.map((p) => {
            const { buildTotal: bt, monthlyTotal: mt } = calcPlan(p);
            const PIcon = p.icon;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPlanId(p.id)}
                className={`border rounded-xl p-3 text-left transition-all cursor-pointer ${
                  selectedPlanId === p.id
                    ? "border-emerald-400 bg-emerald-50/50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <PIcon className={`w-3.5 h-3.5 ${selectedPlanId === p.id ? "text-emerald-600" : "text-slate-400"}`} />
                  <span className={`text-[11px] font-semibold ${selectedPlanId === p.id ? "text-emerald-700" : "text-slate-600"}`}>
                    {p.name}
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-slate-900">{peso(bt)}</p>
                <p className="text-[10px] text-slate-400">{peso(mt)}/mo</p>
              </button>
            );
          })}
        </div>

        {/* Client Details */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Client Name
            </label>
            <input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="PaddleYard Sports Inc."
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 transition-all"
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
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Needs Pickleball court support, 3 branches..."
            rows={3}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[12px] text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 resize-none transition-all"
          />
        </div>

        {/* Price Preview */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Quoted Build</p>
            <p className="text-lg font-semibold text-slate-900 mt-0.5">{peso(buildTotal)}</p>
          </div>
          <div className="w-[1px] h-10 bg-slate-200" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Monthly Support</p>
            <p className="text-lg font-semibold text-slate-900 mt-0.5">{peso(monthlyTotal)}<span className="text-xs text-slate-400 font-normal">/mo</span></p>
          </div>
          <div className="w-[1px] h-10 bg-slate-200" />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Plan</p>
            <p className="text-sm font-semibold text-emerald-700 mt-0.5">{selectedPlan.name}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={!clientName}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[12px] font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {saved ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saved!
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" /> Save Quotation
              </>
            )}
          </button>
          <button
            disabled={!clientName || !clientEmail}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[12px] font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" /> Send to Client
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────

export default function PricingEnginePage() {
  const [plans, setPlans] = useState<Plan[]>(INITIAL_PLANS);
  const [activeTab, setActiveTab] = useState<"starter" | "professional" | "enterprise">("starter");

  const updatePlan = useCallback(
    (updated: Plan) => {
      setPlans((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    },
    []
  );

  const activePlan = plans.find((p) => p.id === activeTab)!;
  const { buildTotal, monthlyTotal } = useMemo(() => calcPlan(activePlan), [activePlan]);

  const tabs: { id: "starter" | "professional" | "enterprise"; label: string; Icon: React.ComponentType<{className?: string}> }[] = [
    { id: "starter",      label: "Starter",      Icon: Rocket    },
    { id: "professional", label: "Professional",  Icon: Gem       },
    { id: "enterprise",   label: "Enterprise",    Icon: Building2 },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calculator className="w-4.5 h-4.5 text-emerald-500" />
            <h1 className="text-lg font-semibold text-slate-900">Pricing Engine</h1>
          </div>
          <p className="text-[12px] text-slate-500">
            Toggle modules on/off — build price and monthly support recalculate instantly. Floors prevent prices from dropping below minimum.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2">
          <Zap className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-[11px] font-semibold text-emerald-700">Auto-calculating</span>
        </div>
      </div>

      {/* Formula Explainer */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div className="text-[11px] text-slate-500 leading-relaxed">
          <strong className="text-slate-700">Formula:</strong>{" "}
          <code className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-emerald-700 font-mono text-[10px]">
            Build = max(min_build, Σ enabled_module.build_price)
          </code>{" "}
          ·{" "}
          <code className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-emerald-700 font-mono text-[10px]">
            Monthly = max(min_monthly, Σ enabled_module.monthly + Σ enabled_support.monthly)
          </code>
          . Modules marked <Lock className="inline w-3 h-3 text-slate-400 mx-0.5" /> are required and cannot be removed.
          Complexity scores (1–10) reflect development weight — useful for estimating timeline and team allocation.
        </div>
      </div>

      {/* Plan Tabs */}
      <div className="flex gap-1.5 bg-slate-100/80 p-1 rounded-xl w-fit border border-slate-200/60">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer ${
              activeTab === id
                ? "bg-white shadow-sm text-slate-900 border border-slate-200/60"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${activeTab === id ? "text-emerald-500" : "text-slate-400"}`} />
            {label}
          </button>
        ))}
      </div>

      {/* Live Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/70 rounded-xl p-4 shadow-sm">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Base Build Price</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1 tracking-tight">{peso(buildTotal)}</p>
          <p className="text-[10px] text-slate-400 mt-1">one-time setup</p>
        </div>
        <div className="bg-white border border-slate-200/70 rounded-xl p-4 shadow-sm">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Monthly Support</p>
          <p className="text-2xl font-semibold text-slate-900 mt-1 tracking-tight">
            {peso(monthlyTotal)}<span className="text-sm text-slate-400 font-normal">/mo</span>
          </p>
          <p className="text-[10px] text-slate-400 mt-1">recurring maintenance</p>
        </div>
        <div className="bg-white border border-slate-200/70 rounded-xl p-4 shadow-sm">
          <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Floor Minimums</p>
          <p className="text-sm font-semibold text-slate-700 mt-1">
            {peso(activePlan.minBuildPrice)} build
          </p>
          <p className="text-[12px] text-slate-500 mt-0.5">
            {peso(activePlan.minMonthlyPrice)}/mo support
          </p>
        </div>
      </div>

      {/* Two Column — Plan Editor + Quotation Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 items-start">
        <PlanPanel
          plan={activePlan}
          onChange={updatePlan}
        />
        <QuotationBuilder plans={plans} />
      </div>
    </div>
  );
}
