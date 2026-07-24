"use client";

import React, { useState } from "react";
import { Check, Mail, Copy, ArrowRight, Star } from "lucide-react";
import FloatingHeader from "./components/FloatingHeader";
import InteractiveDashboard from "./components/InteractiveDashboard";
import CapabilitiesSection from "./components/CapabilitiesSection";
import ProcessSection from "./components/ProcessSection";
import PricingSection from "./components/PricingSection";
import FAQSection from "./components/FAQSection";
import Footer from "./components/Footer";
import ConsultationModal from "./components/ConsultationModal";

// Avatars for hero trust social proof
const TRUST_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
  "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=100&h=100&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80"
];

const EMAIL = "novaryntec@gmail.com";

export default function Home() {
  const [showToast, setShowToast] = useState(false);
  const [consultationOpen, setConsultationOpen] = useState(false);

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 antialiased overflow-x-hidden">
      {/* Floating Header */}
      <FloatingHeader 
        email={EMAIL} 
        onCopySuccess={triggerToast} 
        onOpenConsultation={() => setConsultationOpen(true)} 
      />

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 max-w-6xl mx-auto px-6 w-full text-center md:text-left flex flex-col md:flex-row items-center gap-12 lg:gap-16">
        {/* Hero Left Column */}
        <div className="flex-1 flex flex-col gap-6 items-center md:items-start max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-6 h-[1px] bg-emerald-500 hidden md:block"></span>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
              BUSINESS SOFTWARE FOR MODERN FACILITIES
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] text-center md:text-left">
            Run Your Facility. <br />
            Grow Your Business. <br />
            All in <span className="text-emerald-600">One Platform.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-550 leading-relaxed text-center md:text-left">
            From online bookings and payments to memberships, tournaments, and analytics — Novaryn helps you automate operations and deliver exceptional experiences that keep customers coming back.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mt-2">
            <button
              onClick={() => setConsultationOpen(true)}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm px-6 py-3.5 rounded-xl transition-all duration-200 shadow-md shadow-emerald-600/10 hover:shadow-emerald-600/20 active:scale-98 w-full sm:w-auto cursor-pointer"
            >
              <span>Book a Free Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#capabilities"
              className="flex items-center justify-center bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm px-6 py-3.5 rounded-xl border border-slate-200 shadow-sm transition-all duration-200 w-full sm:w-auto"
            >
              Explore Features
            </a>
          </div>


        </div>

        {/* Hero Right Column (Dashboard Preview) */}
        <div className="flex-1 w-full max-w-2xl">
          <InteractiveDashboard />
        </div>
      </section>

      {/* Industries Row (Built for all types of sports facilities / industries) */}
      <section id="sports" className="py-12 bg-white border-y border-slate-100 w-full">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-6">
            BUILT FOR ALL TYPES OF SPORTS FACILITIES & LOCAL INDUSTRIES
          </span>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6 text-slate-500 font-semibold text-xs md:text-sm">
            {/* Pickleball */}
            <div className="flex items-center gap-2 hover:text-slate-900 transition-colors">
              <svg className="w-5 h-5 text-slate-400 group-hover:text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="10" r="6" />
                <path d="M12 16v5M10 21h4" />
              </svg>
              <span>Pickleball</span>
            </div>

            {/* Badminton */}
            <div className="flex items-center gap-2 hover:text-slate-900 transition-colors">
              <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M9 7c0 2.21 1.79 4 4 4s4-1.79 4-4-1.79-4-4-4-4 1.79-4 4zM7 17c-2.21 0-4 1.79-4 4h8c0-2.21-1.79-4-4-4z" />
              </svg>
              <span>Badminton</span>
            </div>

            {/* Basketball */}
            <div className="flex items-center gap-2 hover:text-slate-900 transition-colors">
              <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3v18M3 12h18M6.2 6.2c2.4 2.4 2.4 6.2 0 8.6M17.8 6.2c-2.4 2.4-2.4 6.2 0 8.6" />
              </svg>
              <span>Basketball</span>
            </div>

            {/* Tennis */}
            <div className="flex items-center gap-2 hover:text-slate-900 transition-colors">
              <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M6 12a6 6 0 0 1 12 0" />
              </svg>
              <span>Tennis</span>
            </div>

            {/* Volleyball */}
            <div className="flex items-center gap-2 hover:text-slate-900 transition-colors">
              <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3a9 9 0 0 1 7.8 4.5M4.2 7.5A9 9 0 0 1 12 3M12 21a9 9 0 0 1-7.8-4.5M19.8 16.5A9 9 0 0 1 12 21" />
              </svg>
              <span>Volleyball</span>
            </div>

            {/* Futsal */}
            <div className="flex items-center gap-2 hover:text-slate-900 transition-colors">
              <svg className="w-5 h-5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3l3 4.5L12 12l-3-4.5L12 3zM3 12l4.5-3L12 12l-4.5 3L3 12zM12 21l-3-4.5L12 12l3 4.5L12 21zM21 12l-4.5 3L12 12l4.5-3L21 12z" />
              </svg>
              <span>Futsal</span>
            </div>

            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>

            {/* General Industries in the prompt */}
            <div className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors flex items-center gap-1.5">
              <span>Clinics</span>
            </div>
            <div className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors flex items-center gap-1.5">
              <span>Restaurants</span>
            </div>
            <div className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors flex items-center gap-1.5">
              <span>Hotels</span>
            </div>
            <div className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors flex items-center gap-1.5">
              <span>Gyms & Salons</span>
            </div>
            <div className="text-slate-400 font-medium">
              And More
            </div>
          </div>
        </div>
      </section>

      {/* 4-Column Feature Benefits */}
      <section className="py-20 max-w-6xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Revenue */}
          <div className="flex flex-col gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200/50">
              <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <h4 className="text-base font-bold text-slate-900 mt-2">Increase Revenue</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Maximize court and staff utilization. Accept credit card and GCash bookings 24/7 with zero overhead.
            </p>
          </div>

          {/* Time */}
          <div className="flex flex-col gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200/50">
              <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h4 className="text-base font-bold text-slate-900 mt-2">Save Time</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Automate repetitive schedules, booking receipts, and payment logs. Focus on growing your business.
            </p>
          </div>

          {/* Customer */}
          <div className="flex flex-col gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200/50">
              <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h4 className="text-base font-bold text-slate-900 mt-2">Delight Customers</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Deliver a smooth booking portal and automatic SMS updates that your players and clients will love.
            </p>
          </div>

          {/* Decisions */}
          <div className="flex flex-col gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200/50">
              <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                <path d="M22 12A10 10 0 0 0 12 2v10z" />
              </svg>
            </div>
            <h4 className="text-base font-bold text-slate-900 mt-2">Data-Driven Decisions</h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              Get powerful charts, occupancy rates, customer statistics, and financial tracking reports in real-time.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Showcase Details (Everything you need. Nothing you don't) */}
      <section className="py-20 bg-white border-y border-slate-200/40">
        <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Device Mockups (Left) */}
          <div className="flex-1 w-full flex flex-col sm:flex-row items-center justify-center gap-6 relative">
            {/* Calendar Mockup card */}
            <div className="w-full max-w-[280px] bg-white border border-slate-200/70 rounded-2xl p-5 shadow-lg flex flex-col gap-4 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Scheduler</span>
                <span className="text-[10px] text-slate-400 font-semibold">May 2026</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5 text-center">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <span key={i} className="text-[10px] font-bold text-slate-400">{d}</span>
                ))}
                {[...Array(31)].map((_, i) => {
                  const dayNum = i + 1;
                  const isBooked = dayNum === 14 || dayNum === 22 || dayNum === 28;
                  return (
                    <div
                      key={i}
                      className={`aspect-square text-[10px] font-semibold flex items-center justify-center rounded-md relative ${
                        isBooked
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "text-slate-650 hover:bg-slate-50"
                      }`}
                    >
                      {dayNum}
                      {isBooked && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-500"></span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile App Frame */}
            <div className="relative border-[5px] border-slate-900 rounded-[2rem] shadow-xl overflow-hidden bg-slate-50 aspect-[9/19] w-[200px] shrink-0 text-left">
              <div className="absolute top-0 inset-x-0 h-4.5 bg-slate-900 flex justify-center items-center z-15">
                <div className="w-12 h-3.5 bg-slate-900 rounded-b-xl" />
              </div>

              <div className="p-4 pt-7 flex flex-col gap-3.5 h-full justify-between">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-semibold text-slate-400">Welcome back</span>
                    <span className="text-xs font-bold text-slate-800">Hi, Alex!</span>
                  </div>

                  {/* Wallet Card */}
                  <div className="bg-emerald-600 text-white rounded-xl p-3 shadow-md flex flex-col gap-1">
                    <span className="text-[8px] opacity-75 font-semibold">YOUR WALLET BALANCE</span>
                    <span className="text-sm font-bold">₱2,450.00</span>
                    <span className="text-[7px] bg-white/20 px-1.5 py-0.5 rounded w-max font-bold mt-1">GCASH CONNECTED</span>
                  </div>

                  {/* Upcoming Card */}
                  <div className="bg-white border border-slate-200/80 rounded-xl p-3 flex flex-col gap-2 shadow-xs">
                    <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wide">Next Booking</span>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-slate-800 block">Court 2</span>
                        <span className="text-[8px] text-slate-500 font-medium block">9:00 - 10:00 AM</span>
                      </div>
                      <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">Paid</span>
                    </div>
                    <button className="w-full py-1 bg-slate-900 text-white text-[8px] font-bold rounded-lg text-center mt-1">
                      View QR Pass
                    </button>
                  </div>
                </div>

                {/* Bottom Navigation */}
                <div className="border-t border-slate-200/60 pt-2 flex justify-around text-slate-400">
                  <span className="text-emerald-500 font-bold text-[8px]">Home</span>
                  <span className="font-bold text-[8px]">Book</span>
                  <span className="font-bold text-[8px]">Wallet</span>
                  <span className="font-bold text-[8px]">Profile</span>
                </div>
              </div>
            </div>

            {/* QR Check-in overlapping card */}
            <div className="w-40 bg-white border border-slate-200/70 rounded-xl p-4 shadow-lg text-left absolute -bottom-4 right-2 sm:right-6 lg:-right-6">
              <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wide">Check-in Pass</span>
              <span className="text-xs font-bold text-slate-800 block mt-0.5">Court 3 Access</span>
              <div className="w-24 h-24 mx-auto my-3 bg-slate-100 flex items-center justify-center p-1 rounded-lg border border-slate-200/50">
                {/* Simulated QR Code */}
                <div className="grid grid-cols-6 gap-0.5 w-full h-full">
                  {[...Array(36)].map((_, i) => {
                    const isDark = (i % 2 === 0 && i % 3 !== 0) || i < 6 || i % 6 === 0 || i > 30;
                    return (
                      <div
                        key={i}
                        className={`w-full h-full rounded-[1px] ${
                          isDark ? "bg-slate-900" : "bg-transparent"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
              <span className="text-[9px] text-center font-mono block text-slate-500">Alex Reyes | ID: 8319-XM</span>
            </div>

            {/* Payments curve chart card */}
            <div className="w-44 bg-white border border-slate-200/70 rounded-xl p-4 shadow-lg text-left absolute -top-8 left-2 sm:-left-4">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">This Month</span>
              <span className="text-sm font-extrabold text-slate-800 block mt-0.5">₱12,430.00</span>
              {/* Mini area chart */}
              <div className="mt-2.5 h-10 w-full relative">
                <svg className="w-full h-full" viewBox="0 0 100 40">
                  <path
                    d="M0 35 C 20 30, 40 10, 60 25 C 80 15, 90 5, 100 2 L 100 40 L 0 40 Z"
                    fill="url(#grad)"
                  />
                  <path
                    d="M0 35 C 20 30, 40 10, 60 25 C 80 15, 90 5, 100 2"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="1.5"
                  />
                  <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>

          {/* Text Content (Right) */}
          <div className="flex-1 flex flex-col gap-6 text-left max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              POWERFUL FEATURES
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Everything you need. <br />Nothing you don't.
            </h2>
            <p className="text-base text-slate-500 leading-relaxed">
              Novaryn brings all your operations together in one intuitive platform designed for sports facilities. Keep track of operations without dealing with complicated software suites.
            </p>

            {/* Checklist Grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3.5 mt-2">
              {[
                "Online Booking",
                "Open Play",
                "Secure Payments",
                "Tournaments",
                "Memberships",
                "Customer CRM",
                "QR Check-In",
                "Reports & Analytics"
              ].map((feat) => (
                <div key={feat} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 shrink-0">
                    <Check className="w-3 h-3 text-emerald-600" />
                  </div>
                  <span className="text-sm text-slate-700 font-semibold">{feat}</span>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <a
                href="#capabilities"
                className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600 hover:text-emerald-700 group"
              >
                <span>See all features</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <CapabilitiesSection />

      {/* Process Section */}
      <ProcessSection />

      {/* Why Novaryn Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-200/50">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              WHY CHOOSE US
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
              Software built with a business-first approach.
            </h2>
            <p className="text-base text-slate-500 mt-4 leading-relaxed">
              We aren't just developers for hire. We act as your long-term technology partners, ensuring your custom systems are scalable, reliable, and secure.
            </p>
          </div>

          {/* Why Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Modern Architecture",
                desc: "We use the latest high-performance stacks like Next.js 15, TypeScript, and serverless hosting to build lightning-fast web assets."
              },
              {
                title: "Scalable Systems",
                desc: "We structure databases and API routing rules to ensure your custom platform scales from 10 to 10,000 active users effortlessly."
              },
              {
                title: "Clean UI/UX",
                desc: "We prioritize user experience above everything else. If a dashboard isn't simple to navigate, it's not a Novaryn dashboard."
              },
              {
                title: "Reliable Performance",
                desc: "We write strict test cases, implement error handlers, and host code on autoscaling cloud networks targeting 99.99% uptime."
              },
              {
                title: "Long-term Partnership",
                desc: "We don't disappear after launching. We work with you for months to implement improvements and secure your software asset."
              },
              {
                title: "Business-first Approach",
                desc: "We align all engineering work with your core business metrics: increasing revenue, saving staff time, and delighting users."
              }
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white border border-slate-200/80 p-7 rounded-2xl shadow-xs text-left hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col gap-2"
              >
                <h4 className="text-base font-bold text-slate-950">{item.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection email={EMAIL} onOpenConsultation={() => setConsultationOpen(true)} />

      {/* FAQ Section */}
      <FAQSection />

      {/* Final CTA Banner */}
      <section className="py-20 max-w-6xl mx-auto px-6 w-full">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-10">
          {/* Subtle green glow graphic in bottom right */}
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="flex flex-col gap-4 text-left max-w-xl z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              START YOUR TRANSFORMATION
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to build something exceptional?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Let's build a smarter way to manage, engage, and grow your business operations. Book a friendly consultation call today.
            </p>
          </div>

          <div className="flex flex-col gap-3 shrink-0 z-10 w-full sm:w-auto">
            <button
              onClick={() => setConsultationOpen(true)}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm px-6 py-3.5 rounded-xl transition-all duration-200 shadow-md w-full sm:w-auto cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Book a Consultation</span>
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(EMAIL);
                triggerToast();
              }}
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-semibold text-sm px-6 py-3.5 rounded-xl transition-all duration-200 w-full sm:w-auto"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Email Address</span>
            </button>
            <span className="text-[10px] text-slate-400 font-semibold text-center md:text-left block mt-1 pl-1">
              ✓ No commitment. Just a friendly call.
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer email={EMAIL} />

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
