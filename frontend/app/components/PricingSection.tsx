"use client";

import React, { useState, useMemo } from "react";
import { 
  ArrowRight, RefreshCw, Rocket, Gem, Building2, Shield, 
  CloudLightning, Lock, Headphones, Check, Layers, Smartphone, 
  Cpu, Monitor, CreditCard, HelpCircle, Sparkles, CheckSquare
} from "lucide-react";

interface Blueprint {
  name: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  setupPrice: string;
  monthlyPrice: string;
  description: string;
  modulesIncluded: string[];
  slaFeatures: string[];
  ctaText: string;
  popular?: boolean;
}

const BLUEPRINTS: Blueprint[] = [
  {
    name: "Sports & Fitness Arena Suite",
    tagline: "Custom scheduling platform for sports centers & clubs.",
    icon: Rocket,
    setupPrice: "₱185,000",
    monthlyPrice: "₱15,000",
    description: "Fully automated facilities scheduling, QR queues, and player wallets.",
    modulesIncluded: [
      "Live Booking Calendar",
      "Digital Player Wallet",
      "GCash & PayMaya Sync",
      "QR Code Gate Entry Scans",
      "DUPR Skill Rating Sync",
      "Loyalty Credits Module"
    ],
    slaFeatures: [
      "Standard Cloud Hosting",
      "Active Server Monitoring",
      "Weekly Secure Backups",
      "Email & Chat Tech Support"
    ],
    ctaText: "Lock in Sports Presets"
  },
  {
    name: "Healthcare Clinic Suite",
    tagline: "EHR CRM records for medical and clinic groups.",
    icon: Gem,
    setupPrice: "₱320,000",
    monthlyPrice: "₱20,000",
    description: "Centralized EHR records, cross-branch calendar coordination, and SMS integrations.",
    modulesIncluded: [
      "Centralized Patient CRM",
      "Multi-Branch Doctor Rosters",
      "Encrypted Medical Records",
      "SMS Booking Reminders",
      "Insurance Clearance Sync",
      "Prescription Document Gen"
    ],
    slaFeatures: [
      "HIPAA-Compliant Hostings",
      "Daily Encrypted DB Backups",
      "Priority SLA Support Lines",
      "Monthly Security Scans"
    ],
    ctaText: "Lock in Clinic Presets",
    popular: true
  },
  {
    name: "Enterprise Multi-Branch ERP",
    tagline: "HQ orchestration for franchises and networks.",
    icon: Building2,
    setupPrice: "₱650,000",
    monthlyPrice: "₱35,000",
    description: "Full supply chain trackers, headquarters operational dashboards, and database nodes.",
    modulesIncluded: [
      "HQ Central Administration",
      "Franchise Billing Controls",
      "RFID Barcode Inventory Tracks",
      "Custom Active Directory Roles",
      "Custom Accounting Syncs",
      "Fleet Driver Logistics App"
    ],
    slaFeatures: [
      "Dedicated Bare-Metal Node",
      "99.99% Uptime SLA Guarantees",
      "Dedicated DevOps Support",
      "24/7 Priority Emergency Hotline"
    ],
    ctaText: "Request Enterprise Quote"
  }
];

const ESTIMATOR_MODULES = [
  { id: "base", name: "Base Custom System Platform (Required)", setup: 80000, monthly: 8000, desc: "Bespoke database backbone, secure login, admin dashboards, and responsive frontends.", required: true },
  { id: "scheduler", name: "Facilities & Resource Scheduler", setup: 35000, monthly: 2000, desc: "Hourly slot allocation grid, court scheduling calendars, and conflict blockers." },
  { id: "wallet", name: "Client Wallets & Payment Sync", setup: 40000, monthly: 2000, desc: "Digital wallet credits, GCash, PayMaya, and credit card gateway triggers." },
  { id: "qr", name: "QR Code Gate Access Scans", setup: 25000, monthly: 1000, desc: "Generates custom QR passes for physical check-in scanning." },
  { id: "crm", name: "Patients EHR / Customer CRM", setup: 90000, monthly: 4500, desc: "Medical records encryption, customer profile logs, and notes history." },
  { id: "multibranch", name: "Franchise / Multi-Branch HQ", setup: 120000, monthly: 6000, desc: "hq manager orchestrations and database synchronization across locations." },
  { id: "sms", name: "SMS Gateway Alerts", setup: 15000, monthly: 1500, desc: "Automated SMS alerts dispatching via Twilio/Semahouse." },
  { id: "analytics", name: "BI Operations Dashboard Reports", setup: 30000, monthly: 1500, desc: "Custom revenue progress charts, server monitoring dials, and exports." }
];

interface PricingSectionProps {
  email: string;
  onOpenConsultation: () => void;
}

export default function PricingSection({ email, onOpenConsultation }: PricingSectionProps) {
  const [activeTab, setActiveTab] = useState<"blueprints" | "estimator">("blueprints");
  
  // Estimator selection state (base is always selected)
  const [selectedModules, setSelectedModules] = useState<string[]>(["base"]);

  const toggleModule = (id: string) => {
    if (id === "base") return; // cannot deselect required base
    setSelectedModules((prev) => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Computations for estimator
  const estimatorTotals = useMemo(() => {
    let setupSum = 0;
    let monthlySum = 0;
    ESTIMATOR_MODULES.forEach((m) => {
      if (selectedModules.includes(m.id)) {
        setupSum += m.setup;
        monthlySum += m.monthly;
      }
    });
    return { setup: setupSum, monthly: monthlySum };
  }, [selectedModules]);

  const peso = (n: number) =>
    "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 0 });

  return (
    <section id="pricing" className="py-24 bg-slate-50 border-t border-slate-200/50">
      <div className="max-w-6xl mx-auto px-6 font-sans">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            SIMPLE, TRANSPARENT, FAIR
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
            Tailored Modular Platform Costing
          </h2>
          <p className="text-sm text-slate-500 mt-4 leading-relaxed">
            Choose a pre-configured industry blueprint or build your custom system estimate using our modular Pricing Engine checklist.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex p-1 bg-slate-200/60 rounded-2xl border border-slate-200 shadow-xs">
            <button
              onClick={() => setActiveTab("blueprints")}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === "blueprints"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Industry Blueprints
            </button>
            <button
              onClick={() => setActiveTab("estimator")}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "estimator"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>Interactive Estimator</span>
            </button>
          </div>
        </div>

        {/* Tab content 1: Blueprints */}
        {activeTab === "blueprints" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-20 select-none">
            {BLUEPRINTS.map((blueprint) => {
              const BlueprintIcon = blueprint.icon;
              return (
                <div
                  key={blueprint.name}
                  className={`relative rounded-3xl bg-white border p-8 flex flex-col justify-between shadow-[0_4px_25px_rgba(15,23,42,0.02)] hover:shadow-lg transition-all duration-300 overflow-hidden ${
                    blueprint.popular ? "border-emerald-500 shadow-[0_10px_40px_rgba(16,185,129,0.03)]" : "border-slate-200"
                  }`}
                >
                  {blueprint.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-emerald-600 text-white font-mono text-[9px] uppercase font-bold tracking-widest py-1.5 flex items-center justify-center gap-1">
                      ★ MOST POPULAR PRESET
                    </div>
                  )}

                  <div className={`flex flex-col gap-6 text-left flex-1 ${blueprint.popular ? "pt-4" : ""}`}>
                    
                    {/* Header Details */}
                    <div className="flex items-center gap-4.5">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100 shadow-xs">
                        <BlueprintIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">{blueprint.name}</h3>
                        <p className="text-[11px] text-slate-500 mt-1 leading-normal font-semibold">
                          {blueprint.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="h-[1px] bg-slate-100" />

                    {/* Pricing details */}
                    <div className="grid grid-cols-2 gap-2 text-left relative py-1">
                      <div className="pr-2.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">One-time Setup</span>
                        <span className="text-lg font-extrabold text-slate-950 tracking-tight block mt-1 leading-tight">
                          {blueprint.setupPrice}
                        </span>
                      </div>

                      <div className="absolute top-1 bottom-1 left-1/2 w-[1px] bg-slate-150" />

                      <div className="pl-4">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Monthly Support SLA</span>
                        <span className="text-lg font-extrabold text-emerald-600 tracking-tight block mt-1 leading-tight">
                          {blueprint.monthlyPrice} <span className="text-[10px] text-slate-400 font-normal">/mo</span>
                        </span>
                      </div>
                    </div>

                    <div className="h-[1px] bg-slate-100" />

                    {/* Description */}
                    <p className="text-xs text-slate-500 leading-relaxed italic">{blueprint.description}</p>

                    {/* Module inclusions */}
                    <div className="flex-1 flex flex-col gap-5 mt-2">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Build Modules Included ({blueprint.modulesIncluded.length})</span>
                        <ul className="flex flex-col gap-2">
                          {blueprint.modulesIncluded.map((mod) => (
                            <li key={mod} className="flex items-center gap-2 text-xs text-slate-700 font-bold">
                              <div className="w-3.5 h-3.5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                                <Check className="w-2 h-2 text-emerald-650 animate-pulse" strokeWidth={3} />
                              </div>
                              <span>{mod}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Ongoing SLA Support ({blueprint.slaFeatures.length})</span>
                        <ul className="flex flex-col gap-1.5">
                          {blueprint.slaFeatures.map((sla) => (
                            <li key={sla} className="flex items-center gap-2 text-[11px] text-slate-500 font-semibold">
                              <span className="text-slate-350">•</span>
                              <span>{sla}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                  </div>

                  {/* CTA button */}
                  <div className="mt-6 shrink-0">
                    <button
                      onClick={onOpenConsultation}
                      className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-xs transition-all active:scale-98 cursor-pointer shadow-xs ${
                        blueprint.popular
                          ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/10"
                          : "bg-slate-900 hover:bg-slate-805 text-white"
                      }`}
                    >
                      <span>{blueprint.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab content 2: Live checklist estimator */}
        {activeTab === "estimator" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-20">
            
            {/* Interactive Checklist list (Spans 2 columns) */}
            <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-3xl shadow-xs flex flex-col gap-4 text-left">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Select Custom Platform Modules</h3>
              
              <div className="flex flex-col gap-4">
                {ESTIMATOR_MODULES.map((m) => {
                  const selected = selectedModules.includes(m.id);
                  return (
                    <div 
                      key={m.id}
                      onClick={() => toggleModule(m.id)}
                      className={`p-4 rounded-2xl border transition-all flex items-start gap-4 cursor-pointer select-none ${
                        selected 
                          ? "bg-slate-50/50 border-emerald-500 shadow-[0_4px_15px_rgba(16,185,129,0.01)]" 
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      {/* Custom checkbox square visual */}
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        selected 
                          ? "bg-emerald-600 border-emerald-600 text-white" 
                          : "border-slate-300 text-transparent"
                      }`}>
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-black text-slate-850">{m.name}</h4>
                          <div className="text-right text-[11px] font-bold text-slate-800 leading-tight">
                            <span>{peso(m.setup)} setup</span>
                            <span className="block text-slate-400 font-semibold text-[9px] mt-0.5">+{peso(m.monthly)}/mo support</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-450 mt-1 leading-normal font-semibold max-w-[480px]">
                          {m.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sticky Estimator summary receipt box */}
            <div className="sticky top-24 bg-white border border-slate-200 p-6 rounded-3xl shadow-md flex flex-col gap-6 text-left">
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">Operational Estimator</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Platform Valuation</h3>
              </div>

              <div className="flex flex-col gap-4 text-xs font-semibold">
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold">One-Time Setup Fee</span>
                  <span className="text-base font-black text-slate-900">{peso(estimatorTotals.setup)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold">Monthly Service SLA</span>
                  <span className="text-base font-black text-emerald-600">{peso(estimatorTotals.monthly)}<span className="text-[10px] text-slate-400 font-normal">/mo</span></span>
                </div>

                <div className="h-[1px] bg-slate-100 my-1" />

                <div className="flex items-start gap-2.5 leading-relaxed text-[11px] text-slate-450 font-medium">
                  <Shield className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>Cost estimates include 12 months free server monitoring, backup orchestration, and technical security hot-fixes.</span>
                </div>
              </div>

              <button
                onClick={onOpenConsultation}
                className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-805 text-white font-bold text-xs transition-all active:scale-98 shadow-md flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
              >
                <span>Book Quote Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        )}

        {/* Bottom Trust Icons Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-t border-slate-200/60 max-w-5xl mx-auto mb-20 text-left">
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
                  <p className="text-[10px] text-slate-450 font-bold mt-0.5 leading-tight">{item.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
