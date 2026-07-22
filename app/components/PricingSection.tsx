"use client";

import React, { useState } from "react";
import { ArrowRight, RefreshCw, Rocket, Gem, Building2, Shield, CloudLightning, Lock, Headphones, Check, Layers, Smartphone, Cpu, Monitor, CreditCard, HelpCircle } from "lucide-react";

interface PricingPlan {
  name: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  setupPrice: string;
  monthlyPrice: string;
  frontFeatures: string[];
  setupCount: number;
  monthlyCount: number;
  setupIncludes: string[];
  monthlyIncludes: string[];
  ctaText: string;
  ctaSubject: string;
  popular?: boolean;
}

const PLANS: PricingPlan[] = [
  {
    name: "Starter",
    tagline: "Perfect for small businesses starting their digital journey.",
    icon: Rocket,
    setupPrice: "₱50,000 – ₱100,000",
    monthlyPrice: "₱10,000",
    frontFeatures: [
      "Custom Website",
      "Booking System",
      "Admin Dashboard",
      "Payment Integration",
      "Basic Reports",
      "Email & Chat Support"
    ],
    setupCount: 11,
    monthlyCount: 7,
    setupIncludes: [
      "Custom Brand Website Build",
      "Online Booking Engine",
      "Full Mobile Responsive UI",
      "Admin Control Dashboard",
      "Customer Account Profiles",
      "Interactive Bookings Calendar",
      "GCash & PayMaya Sync",
      "QR Code Ticket Check-in",
      "Automated Email Alerts",
      "Basic Analytics Reports",
      "30 Days Hot-Fix Support"
    ],
    monthlyIncludes: [
      "Standard Cloud Hosting",
      "Active Server Monitoring",
      "Monthly Security Patches",
      "Weekly Server Backups",
      "Email & Chat Tech Support",
      "Infrastructure Maintenance",
      "Uptime Performance Audits"
    ],
    ctaText: "Get Started",
    ctaSubject: "Starter%20Package"
  },
  {
    name: "Professional",
    tagline: "Complete business platform for growing organizations.",
    icon: Gem,
    setupPrice: "₱150,000 – ₱200,000",
    monthlyPrice: "₱15,000",
    frontFeatures: [
      "Everything in Starter",
      "Membership Management",
      "QR Check-in",
      "Analytics & Reports",
      "Customer CRM",
      "Rewards & Loyalty",
      "Priority Support"
    ],
    setupCount: 15,
    monthlyCount: 8,
    setupIncludes: [
      "Everything in Starter Package",
      "Unlimited Courts / Facilities",
      "Open Play Reservation Logic",
      "Tiered Membership Tiers",
      "Prepaid Credits & User Wallet",
      "Customer Loyalty Rewards",
      "Point-of-Sale (POS) Module",
      "Granular Staff Role Rules",
      "Promo & Referral Code Engine",
      "SMS Gateway Notifications",
      "Real-Time Occupancy Analytics",
      "QR Code Gate Entry Scans",
      "Digital Waiver Forms",
      "Integrated Customer CRM",
      "Accounting API Integrations"
    ],
    monthlyIncludes: [
      "High-Performance CDN Hosting",
      "Priority SLA Support Tickets",
      "Monthly Code & Feature Updates",
      "Server Uptime Optimizations",
      "Daily Encrypted DB Backups",
      "Live Security Threat Scanning",
      "Free Let's Encrypt SSL Keys",
      "Complete Hosting Management"
    ],
    ctaText: "Book a Consultation",
    ctaSubject: "Professional%20Package",
    popular: true
  },
  {
    name: "Enterprise",
    tagline: "For multi-branch and enterprise organizations with advanced needs.",
    icon: Building2,
    setupPrice: "₱350,000 – ₱750,000",
    monthlyPrice: "₱20,000 – ₱35,000",
    frontFeatures: [
      "Unlimited Modules",
      "Multi-Branch Management",
      "Advanced Permissions",
      "ERP Integrations",
      "Dedicated Account Manager",
      "SLA & 24/7 Support",
      "Custom Development"
    ],
    setupCount: 10,
    monthlyCount: 6,
    setupIncludes: [
      "Everything in Professional Scope",
      "Multi-Branch Administration",
      "Franchise Network Modules",
      "HQ Central Operations Panel",
      "Custom Active Directory Roles",
      "Live Barcode Inventory Tracks",
      "Oracle / SAP System Syncs",
      "Custom ERP Integrations",
      "Business Intelligence Dashboards",
      "Fully Custom-Coded Deliverables"
    ],
    monthlyIncludes: [
      "Dedicated Bare-Metal Hosting",
      "Full Legacy Database Migration",
      "Dedicated DevOps Engineer SLA",
      "99.99% Node Uptime Guarantees",
      "24/7 Phone Incident Hotline",
      "Custom Corporate SLA Agreements"
    ],
    ctaText: "Request a Proposal",
    ctaSubject: "Enterprise%20Package"
  }
];

const TRUST_ITEMS = [
  { label: "12 Months Free Support", sub: "Included in all plans", icon: Shield },
  { label: "Secure & Reliable", sub: "99.99% uptime guarantee", icon: CloudLightning },
  { label: "Your Data is Safe", sub: "We follow best practices", icon: Lock },
  { label: "We're Here to Help", sub: "Support you can count on", icon: Headphones }
];

const ADDONS = [
  { name: "Mobile App (Android)", price: "₱80,000", desc: "Native Android app published on Google Play.", icon: Smartphone },
  { name: "Mobile App (iOS)", price: "₱80,000", desc: "Native iOS app published on Apple App Store.", icon: Smartphone },
  { name: "Tournament Module", price: "₱35,000", desc: "Brackets, registration, and tournament logic.", icon: Layers },
  { name: "Membership Card", price: "₱20,000", desc: "Custom RFID/barcode cards layout.", icon: CreditCard },
  { name: "RFID Entry Integration", price: "₱45,000", desc: "Gate access integrated with scanner system.", icon: Shield },
  { name: "Facial Recognition Check-in", price: "₱80,000", desc: "Instant AI check-in scanner support.", icon: Cpu },
  { name: "AI Predictive Analytics", price: "₱50,000", desc: "AI forecasts demand and peak hourly rates.", icon: Cpu },
  { name: "Digital Signage Display", price: "₱25,000", desc: "Live TV dashboard for lobby timetables.", icon: Monitor },
  { name: "Self-Service Kiosk App", price: "₱90,000", desc: "Tablet portal for walk-ins and store items.", icon: Monitor }
];

interface PricingSectionProps {
  email: string;
}

export default function PricingSection({ email }: PricingSectionProps) {
  // Flip states keyed by package name
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({
    Starter: false,
    Professional: false,
    Enterprise: false
  });

  const toggleFlip = (name: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <section id="pricing" className="py-24 bg-slate-50 border-t border-slate-200/50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            SIMPLE, TRANSPARENT, FAIR
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
            Choose the Right Plan for Your Business
          </h2>
          <p className="text-base text-slate-550 mt-4 leading-relaxed">
            One-time setup and monthly service options designed to help you grow with confidence. Click <strong>"Click to see more benefits"</strong> on any card to flip.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 items-stretch select-none">
          {PLANS.map((plan) => {
            const isFlipped = flippedCards[plan.name];
            const PlanIcon = plan.icon;

            return (
              <div
                key={plan.name}
                onClick={() => toggleFlip(plan.name)}
                className="relative h-[620px] w-full [perspective:1200px] cursor-pointer"
              >
                {/* Flip Card Container */}
                <div
                  className={`w-full h-full relative transition-transform duration-500 [transform-style:preserve-3d] ${
                    isFlipped ? "[transform:rotateY(180deg)]" : ""
                  }`}
                >
                  
                  {/* FRONT SIDE (Exact match to the chatgpt screenshot design) */}
                  <div className={`absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-3xl bg-white border p-8 flex flex-col justify-between shadow-[0_4px_25px_rgba(15,23,42,0.02)] hover:shadow-lg transition-all duration-300 overflow-hidden ${
                    plan.popular ? "border-emerald-500 shadow-[0_10px_40px_rgba(16,185,129,0.03)]" : "border-slate-200"
                  }`}>
                    
                    {/* MOST POPULAR green banner for Professional plan */}
                    {plan.popular && (
                      <div className="absolute top-0 left-0 right-0 bg-emerald-600 text-white font-mono text-[9px] uppercase font-bold tracking-widest py-1.5 flex items-center justify-center gap-1">
                        ★ MOST POPULAR
                      </div>
                    )}

                    <div className={`flex flex-col gap-6 text-left flex-1 ${plan.popular ? "pt-4" : ""}`}>
                      {/* Logo and Package Name */}
                      <div className="flex items-center gap-4.5">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100 shadow-xs">
                          <PlanIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{plan.name}</h3>
                          <p className="text-[11px] text-slate-500 leading-tight mt-0.5 min-h-[28px]">
                            {plan.tagline}
                          </p>
                        </div>
                      </div>

                      <div className="h-[1px] bg-slate-100" />

                      {/* Pricing Split Grid (2 Columns separated by a thin vertical line) */}
                      <div className="grid grid-cols-2 gap-2 text-left relative py-1">
                        {/* One-time setup */}
                        <div className="pr-2.5">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">ONE-TIME SETUP</span>
                          <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight block mt-1.5 leading-tight">
                            {plan.setupPrice.replace(" – ", "–")}
                          </span>
                        </div>

                        {/* Split line divider */}
                        <div className="absolute top-1 bottom-1 left-1/2 w-[1px] bg-slate-150" />

                        {/* Monthly Support */}
                        <div className="pl-4">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">MONTHLY SERVICE</span>
                          <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight block mt-1.5 leading-tight">
                            {plan.monthlyPrice} <span className="text-[10px] text-slate-400 font-normal">/month</span>
                          </span>
                        </div>
                      </div>

                      <div className="h-[1px] bg-slate-100" />

                      {/* 6 key features list */}
                      <div className="flex-1 flex flex-col justify-between">
                        <ul className="flex flex-col gap-3">
                          {plan.frontFeatures.map((feat) => (
                            <li key={feat} className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold">
                              <div className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                                <Check className="w-2.5 h-2.5 text-emerald-600" strokeWidth={3} />
                              </div>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Link to see more */}
                        <div className="flex items-center justify-center gap-1 text-[10px] text-emerald-600 hover:text-emerald-700 font-bold uppercase tracking-wider mt-5 pt-3 border-t border-dashed border-slate-100">
                          <RefreshCw className="w-3 h-3 animate-spin duration-3000" />
                          <span>Click to see more benefits</span>
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="mt-6 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <a
                        href={`mailto:${email}?subject=Novaryn%20-${plan.ctaSubject}%20Inquiry`}
                        className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-xs transition-all duration-200 active:scale-98 shadow-xs hover:shadow-md ${
                          plan.popular
                            ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/10"
                            : "bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <span>{plan.ctaText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* BACK SIDE (Detailed Spec Sheets) */}
                  <div className={`absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-3xl bg-white border p-8 flex flex-col justify-between shadow-[0_4px_25px_rgba(15,23,42,0.02)] hover:shadow-lg transition-all duration-300 overflow-hidden ${
                    plan.popular ? "border-emerald-500/80 shadow-[0_10px_40px_rgba(16,185,129,0.03)]" : "border-slate-200"
                  }`}>
                    
                    {/* Back header */}
                    <div className="flex flex-col gap-4 text-left flex-1 overflow-hidden">
                      <div className="flex justify-between items-start shrink-0">
                        <div>
                          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                            Detailed System Spec
                          </span>
                          <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{plan.name} Scope</h3>
                        </div>
                        <span className="text-[9px] bg-emerald-50 text-emerald-700 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                          Full Spec
                        </span>
                      </div>

                      <div className="h-[1px] bg-slate-100 shrink-0" />

                      {/* 2-Column Specs Layout */}
                      <div className="grid grid-cols-2 gap-5 flex-1 overflow-hidden text-[11px] leading-relaxed">
                        
                        {/* Setup Column */}
                        <div className="flex flex-col gap-2 border-r border-slate-150/40 pr-3.5 overflow-hidden">
                          <span className="font-bold text-[9px] text-slate-400 uppercase tracking-wider block shrink-0">
                            Build Modules ({plan.setupCount})
                          </span>
                          <ul className="flex flex-col gap-2 flex-1 overflow-hidden">
                            {plan.setupIncludes.map((feat) => (
                              <li key={feat} className="flex items-start gap-1.5 text-slate-650 font-medium shrink-0 leading-tight">
                                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Monthly Column */}
                        <div className="flex flex-col gap-2 pl-1 overflow-hidden">
                          <span className="font-bold text-[9px] text-slate-400 uppercase tracking-wider block shrink-0">
                            Maintenance & Support ({plan.monthlyCount})
                          </span>
                          <ul className="flex flex-col gap-2 flex-1 overflow-hidden">
                            {plan.monthlyIncludes.map((feat) => (
                              <li key={feat} className="flex items-start gap-1.5 text-slate-650 font-medium shrink-0 leading-tight">
                                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Back Flip Hint */}
                      <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-450 font-bold uppercase tracking-wider shrink-0 mt-3 animate-pulse">
                        <RefreshCw className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Click card to return to prices</span>
                      </div>
                    </div>

                    {/* Back CTA Button */}
                    <div className="mt-6 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <a
                        href={`mailto:${email}?subject=Novaryn%20-${plan.ctaSubject}%20Inquiry`}
                        className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-xs transition-all duration-200 active:scale-98 shadow-xs hover:shadow-md ${
                          plan.popular
                            ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/10"
                            : "bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <span>{plan.ctaText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust Icons Row (Matches the chatgpt screenshot exactly) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-t border-slate-200/60 max-w-5xl mx-auto mb-20 text-left">
          {TRUST_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.label}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{item.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Optional Add-ons Section */}
        <div className="pt-8 text-left">
          <div className="mb-10 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              CUSTOM UPSELLS & MODULES
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
              Optional Plug-and-Play Add-ons
            </h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Enhance your platform vertical with advanced hardware integrations, AI intelligence, or native mobile apps at flat-rate rates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ADDONS.map((addon) => {
              const Icon = addon.icon;
              return (
                <div
                  key={addon.name}
                  className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-3 justify-between"
                >
                  <div className="flex gap-4 items-start">
                    <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-200/50 shrink-0 text-slate-600">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{addon.name}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{addon.desc}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-100">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Upgrade cost</span>
                    <span className="text-sm font-extrabold text-emerald-600">{addon.price}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pricing Help note */}
        <div className="flex items-center justify-center gap-2 mt-16 text-xs text-slate-500 font-medium">
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>
            Need a completely custom feature not listed here?{" "}
            <a
              href={`mailto:${email}?subject=Novaryn%20Custom%2520Module%2520Inquiry`}
              className="text-emerald-600 hover:text-emerald-700 font-bold underline underline-offset-2"
            >
              Email us for an architectural consultation.
            </a>
          </span>
        </div>
      </div>
    </section>
  );
}
