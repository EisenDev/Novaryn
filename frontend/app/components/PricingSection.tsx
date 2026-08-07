"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { 
  ArrowRight, Shield, CloudLightning, Lock, Headphones, Check, 
  Sparkles, ChevronLeft, ChevronRight, Rocket, Gem, Building2
} from "lucide-react";

interface Blueprint {
  slug: string;
  name: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  setupPrice: number;
  cloudCost: number;
  description: string;
  modulesIncluded: string[];
  slaFeatures: string[];
  ctaText: string;
  popular?: boolean;
}

const BLUEPRINTS: Blueprint[] = [
  {
    slug: "sports",
    name: "Sports & Fitness Arena Suite",
    tagline: "Custom scheduling platform for sports centers & clubs.",
    icon: Rocket,
    setupPrice: 185000,
    cloudCost: 2500,
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
    ctaText: "Customize Sports Suite"
  },
  {
    slug: "clinic",
    name: "Healthcare Clinic Suite",
    tagline: "EHR CRM records for medical and clinic groups.",
    icon: Gem,
    setupPrice: 320000,
    cloudCost: 4000,
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
    ctaText: "Customize Clinic Suite",
    popular: true
  },
  {
    slug: "enterprise",
    name: "Enterprise Multi-Branch ERP",
    tagline: "HQ orchestration for franchises and networks.",
    icon: Building2,
    setupPrice: 650000,
    cloudCost: 8000,
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
    ctaText: "Customize Enterprise ERP"
  }
];

interface PricingSectionProps {
  email: string;
  onOpenConsultation: () => void;
}

export default function PricingSection({ email, onOpenConsultation }: PricingSectionProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

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

  const peso = (n: number) =>
    "₱" + n.toLocaleString("en-PH", { minimumFractionDigits: 0 });

  return (
    <section id="pricing" className="py-24 bg-slate-50 border-t border-slate-200/50">
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

        {/* Link Button to public Pricing Engine */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
          <Link
            href="/pricing-engine"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-md shadow-emerald-600/10 hover:shadow-emerald-600/20 active:scale-98 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-100 animate-pulse" />
            <span>Try Interactive Custom Estimator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Preset Carousel Wrapper */}
        <div className="relative mb-20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <span>Industry Preset Blueprints</span>
            </h3>
            
            {/* Carousel Control Buttons */}
            <div className="flex gap-2">
              <button 
                onClick={() => handleCarouselScroll("left")}
                className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-slate-805 hover:border-slate-350 transition-all cursor-pointer shadow-xs active:scale-95"
                aria-label="Scroll blueprints left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleCarouselScroll("right")}
                className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-slate-805 hover:border-slate-350 transition-all cursor-pointer shadow-xs active:scale-95"
                aria-label="Scroll blueprints right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Carousel snap scrolling container */}
          <div 
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide pb-4 -mx-6 px-6"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {BLUEPRINTS.map((blueprint) => {
              const BlueprintIcon = blueprint.icon;
              
              // 50% Downpayment calculation
              const downpayment = Math.round(blueprint.setupPrice * 0.50);
              const remaining   = blueprint.setupPrice - downpayment;
              const installment = Math.round(remaining / 12) + blueprint.cloudCost;

              return (
                <div
                  key={blueprint.name}
                  className={`snap-start shrink-0 w-[85%] sm:w-[380px] md:w-[350px] relative rounded-3xl bg-white border p-8 flex flex-col justify-between shadow-[0_4px_25px_rgba(15,23,42,0.02)] hover:shadow-lg transition-all duration-300 overflow-hidden ${
                    blueprint.popular ? "border-emerald-500 shadow-[0_10px_40px_rgba(16,185,129,0.03)] animate-pulse-subtle" : "border-slate-200"
                  }`}
                >
                  {blueprint.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-emerald-600 text-white font-mono text-[9px] uppercase font-bold tracking-widest py-1.5 flex items-center justify-center gap-1">
                      ★ MOST POPULAR PRESET
                    </div>
                  )}

                  <div className={`flex flex-col gap-6 text-left flex-1 ${blueprint.popular ? "pt-4" : ""}`}>
                    
                    {/* Header details */}
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

                    {/* Pricing Breakdown (using 50% Downpayment) */}
                    <div className="flex flex-col gap-2.5">
                      <div className="grid grid-cols-2 gap-2 relative py-1">
                        <div className="pr-2.5">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">System Price</span>
                          <span className="text-lg font-extrabold text-slate-950 tracking-tight block mt-1 leading-tight">
                            {peso(blueprint.setupPrice)}
                          </span>
                        </div>
                        <div className="absolute top-1 bottom-1 left-1/2 w-[1px] bg-slate-150" />
                        <div className="pl-4">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Downpayment (50%)</span>
                          <span className="text-lg font-extrabold text-slate-800 tracking-tight block mt-1 leading-tight">
                            {peso(downpayment)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 relative py-1 bg-emerald-50/60 border border-emerald-100/70 rounded-xl px-3">
                        <div className="pr-2.5 py-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Cloud Hosting</span>
                          <span className="text-sm font-extrabold text-slate-600 tracking-tight block mt-1 leading-tight">
                            {peso(blueprint.cloudCost)}<span className="text-[9px] text-slate-400 font-normal">/mo</span>
                          </span>
                        </div>
                        <div className="absolute top-2 bottom-2 left-1/2 w-[1px] bg-emerald-200/60" />
                        <div className="pl-4 py-1">
                          <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider block">Monthly Installment</span>
                          <span className="text-sm font-extrabold text-emerald-600 tracking-tight block mt-1 leading-tight">
                            {peso(installment)}<span className="text-[9px] text-slate-400 font-normal">/mo × 12</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="h-[1px] bg-slate-100" />

                    {/* Description */}
                    <p className="text-xs text-slate-500 leading-relaxed italic">{blueprint.description}</p>

                    {/* Inclusions */}
                    <div className="flex-1 flex flex-col gap-5 mt-2">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Build Modules Included ({blueprint.modulesIncluded.length})</span>
                        <ul className="flex flex-col gap-2">
                          {blueprint.modulesIncluded.map((mod) => (
                            <li key={mod} className="flex items-center gap-2 text-xs text-slate-700 font-bold">
                              <div className="w-3.5 h-3.5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                                <Check className="w-2 h-2 text-emerald-650" strokeWidth={3} />
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

                  {/* Customize button linking to public pricing engine with preset slug */}
                  <div className="mt-6 shrink-0">
                    <Link
                      href={`/pricing-engine?preset=${blueprint.slug}`}
                      className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-xs transition-all active:scale-98 cursor-pointer shadow-xs ${
                        blueprint.popular
                          ? "bg-emerald-650 hover:bg-emerald-700 text-white shadow-md shadow-emerald-650/10"
                          : "bg-slate-900 hover:bg-slate-805 text-white"
                      }`}
                    >
                      <span>{blueprint.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

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
