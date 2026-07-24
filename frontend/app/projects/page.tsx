"use client";

import React, { useState } from "react";
import FloatingHeader from "../components/FloatingHeader";
import Footer from "../components/Footer";
import { Check, ArrowRight, Eye, X, ChevronLeft, ChevronRight, Activity, Calendar, ShieldCheck, CreditCard } from "lucide-react";
import Link from "next/link";
import ConsultationModal from "../components/ConsultationModal";

const EMAIL = "novaryntec@gmail.com";

interface ScreenshotItem {
  src: string;
  title: string;
  desc: string;
}

const PADDLEYARD_SCREENSHOTS: ScreenshotItem[] = [
  {
    src: "/paddleyard/LANDING.png",
    title: "Client Landing Page",
    desc: "The public-facing portal for PaddleYard where players check live court availability, register for events, and manage booking sessions."
  },
  {
    src: "/paddleyard/LOGIN.png",
    title: "Secure Login Modal",
    desc: "Client authentication panel powered by Auth.js (NextAuth) and credentials validation with hashed bcryptjs password checks."
  },
  {
    src: "/paddleyard/SIGNUP.png",
    title: "User Onboarding Page",
    desc: "Customer registration form integrated with DUPR rating scales and user onboarding waivers to match PH sports regulations."
  },
  {
    src: "/paddleyard/ANALYTICS.png",
    title: "Admin Analytics Dashboard",
    desc: "Business intelligence panel showing hourly court occupancy rates, transactions breakdown, wallet balance sums, and player logs."
  },
  {
    src: "/paddleyard/BOOKING-MONITOR.png",
    title: "Booking Operations Calendar",
    desc: "Interactive schedule grid mapping live court allocations, active sessions (Indoor/Outdoor/Rooftop), and walk-in cash payments."
  },
  {
    src: "/paddleyard/PADDLESTACK.png",
    title: "System Infrastructure (PaddleStack)",
    desc: "Conceptual mapping of the digital queue system, showing how players stack paddles digitally using QR code scans at the court gate."
  }
];

export default function Projects() {
  const [showToast, setShowToast] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [consultationOpen, setConsultationOpen] = useState(false);

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const openGallery = (index: number) => {
    setActiveIndex(index);
    setGalleryOpen(true);
  };

  const nextSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveIndex((prev) => (prev === PADDLEYARD_SCREENSHOTS.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? PADDLEYARD_SCREENSHOTS.length - 1 : prev - 1));
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 antialiased overflow-x-hidden">
      {/* Floating Header */}
      <FloatingHeader email={EMAIL} onCopySuccess={triggerToast} />

      {/* Hero Header */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 max-w-6xl mx-auto px-6 w-full text-left">
        <div className="max-w-3xl flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-[1px] bg-emerald-500"></span>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              CASE STUDIES & CRAFTSMANSHIP
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-none">
            Featured Systems Built by Novaryn
          </h1>
          <p className="text-base sm:text-lg text-slate-500 mt-2 leading-relaxed">
            We build custom digital assets that automate operations and solve business bottlenecks. Explore how we architected and deployed our featured vertical.
          </p>
        </div>
      </section>

      {/* Case Study Card Section */}
      <section className="pb-24 max-w-6xl mx-auto px-6 w-full">
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-[0_15px_40px_rgba(15,23,42,0.03)] flex flex-col lg:flex-row items-stretch min-h-[500px]">
          
          {/* Landing page screenshot card (Left) */}
          <div 
            onClick={() => openGallery(0)}
            className="flex-1 relative overflow-hidden group cursor-pointer border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-900 aspect-[4/3] lg:aspect-auto"
          >
            <img
              src="/paddleyard/LANDING.png"
              alt="PaddleYard System Landing Page"
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-103"
            />
            {/* Dark Overlay on Hover */}
            <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/45 transition-colors duration-300 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm text-slate-900 text-xs font-bold px-4 py-2.5 rounded-full flex items-center gap-2 shadow-lg opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-350">
                <Eye className="w-4 h-4 text-emerald-600" />
                <span>Explore App Screenshots</span>
              </div>
            </div>
            {/* Top Indicator badge */}
            <span className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-sm border border-slate-700 text-white font-mono text-[9px] uppercase tracking-widest px-3 py-1 rounded-md font-bold">
              Sports Facility Showcase
            </span>
          </div>

          {/* Details & Copy (Right) */}
          <div className="flex-1 p-8 sm:p-10 lg:p-12 flex flex-col justify-between text-left">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">CLIENT PREVIEW</span>
                  <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/50">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-mono font-bold text-emerald-600 uppercase tracking-wider">DEPLOYED & IN PRODUCTION</span>
                  </div>
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">PaddleYard Platform</h2>
                <p className="text-xs text-slate-400 font-semibold">PH Sports Center Management Suite</p>
              </div>

              <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                PaddleYard is a production-grade sports administration suite containerized with Docker and deployed via GitHub Actions CI/CD to cloud virtual machines. Backed by PostgreSQL and Prisma ORM, it incorporates NextAuth secure sessions, a digital DUPR rating system sync for player matching, credit transaction logs, and a unique QR-based Pickleball Paddle Queue (Paddle Stack).
              </p>

              <div className="h-[1px] bg-slate-100" />

              {/* Core Capabilities */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Key System Capabilities</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    "Live Court Scheduling",
                    "NextAuth Security Gate",
                    "DUPR Player Rating Sync",
                    "Digital Wallet Credits",
                    "QR Paddle Stack Queue",
                    "Loyalty Point Shop"
                  ].map((feat) => (
                    <div key={feat} className="flex items-center gap-2">
                      <div className="w-4.5 h-4.5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-emerald-600" strokeWidth={3} />
                      </div>
                      <span className="text-xs text-slate-700 font-semibold">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-[1px] bg-slate-100" />

              {/* Technical Spec icons */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Next.js 16 & TS</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Azure VM CI/CD</span>
                </div>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>PostgreSQL & Prisma</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap gap-3">
              <button
                onClick={() => openGallery(0)}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all duration-200 shadow-md shadow-emerald-600/10 active:scale-98 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>Explore Screenshots</span>
              </button>
              <button
                onClick={() => setConsultationOpen(true)}
                className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all duration-200 active:scale-98 cursor-pointer"
              >
                <span>Request Custom Build</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Screenshots Grid (Preview Gallery) */}
      <section className="py-16 bg-slate-50 border-t border-slate-200/50 text-left">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              EXPLORE EVERY VIEW
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
              Platform Interface Screenshots
            </h3>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              We design and code clean user interfaces. Click any screenshot below to inspect the details, including signup logs and analytics dashboards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PADDLEYARD_SCREENSHOTS.map((screen, idx) => (
              <div 
                key={idx}
                onClick={() => openGallery(idx)}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
              >
                <div className="aspect-[4/3] bg-slate-900 relative overflow-hidden border-b border-slate-100">
                  <img
                    src={screen.src}
                    alt={screen.title}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/20 transition-colors duration-300" />
                </div>
                <div className="p-5 flex flex-col gap-1.5">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                    <span>{screen.title}</span>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-bold uppercase">View</span>
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-semibold line-clamp-2">{screen.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer email={EMAIL} />

      {/* Lightbox Gallery Modal */}
      {galleryOpen && (
        <div 
          onClick={() => setGalleryOpen(false)}
          className="fixed inset-0 bg-slate-950/95 backdrop-blur-sm z-55 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Close button */}
          <button 
            onClick={() => setGalleryOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close gallery"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Nav buttons */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="w-7 h-7" />
          </button>

          {/* Lightbox content card */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-slate-800 animate-in zoom-in-95 duration-200"
          >
            <div className="aspect-[16/10] bg-slate-950 relative flex items-center justify-center border-b border-slate-100">
              <img
                src={PADDLEYARD_SCREENSHOTS[activeIndex].src}
                alt={PADDLEYARD_SCREENSHOTS[activeIndex].title}
                className="max-w-full max-h-full object-contain"
              />
            </div>
            
            <div className="p-6 text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="max-w-2xl">
                <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest block">SCREENSHOT {activeIndex + 1} OF {PADDLEYARD_SCREENSHOTS.length}</span>
                <h4 className="text-lg font-bold text-slate-950 mt-0.5">{PADDLEYARD_SCREENSHOTS[activeIndex].title}</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed font-semibold">{PADDLEYARD_SCREENSHOTS[activeIndex].desc}</p>
              </div>
              <div className="shrink-0 flex gap-2">
                <button
                  onClick={prevSlide}
                  className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors text-xs font-bold cursor-pointer"
                >
                  Prev
                </button>
                <button
                  onClick={nextSlide}
                  className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors text-xs font-bold cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Consultation Popup Modal */}
      <ConsultationModal isOpen={consultationOpen} onClose={() => setConsultationOpen(false)} />

      {/* Global Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-slate-800 text-white text-xs font-semibold px-4 py-3.5 rounded-xl shadow-2xl flex items-center gap-2.5 z-55 animate-in fade-in slide-in-from-bottom-5 duration-250">
          <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Check className="w-3 h-3 text-emerald-500" />
          </div>
          <span>Email copied to clipboard: <strong>{EMAIL}</strong></span>
        </div>
      )}
    </div>
  );
}
