"use client";

import React, { useState } from "react";
import { Sliders, Calculator, FileText, CheckCircle } from "lucide-react";

interface AddonModule {
  id: string;
  name: string;
  price: number;
}

const addonModules: AddonModule[] = [
  { id: "mobile_android", name: "Mobile App (Android) - Publishing & Setup", price: 80000 },
  { id: "mobile_ios", name: "Mobile App (iOS) - Publishing & Setup", price: 80000 },
  { id: "tournament", name: "Tournament Module (Brackets, Registration)", price: 35000 },
  { id: "member_card", name: "Membership Card Layout (Barcode, RFID)", price: 20000 },
  { id: "rfid_entry", name: "RFID Entry Scanner Hardware Integration", price: 45000 },
  { id: "facial_checkin", name: "Facial Recognition Check-In System", price: 80000 },
  { id: "ai_analytics", name: "AI Predictive Analytics (Demand Forecasts)", price: 50000 },
  { id: "kiosk_app", name: "Self-Service Kiosk Tablet App", price: 90000 },
];

export default function ProposalsPage() {
  const [selectedPlan, setSelectedPlan] = useState("professional");
  const [customSetupPrice, setCustomSetupPrice] = useState(175000);
  const [customMonthlyPrice, setCustomMonthlyPrice] = useState(15000);
  const [activeAddons, setActiveAddons] = useState<string[]>([]);
  const [clientName, setClientName] = useState("");

  const handlePlanChange = (plan: string) => {
    setSelectedPlan(plan);
    if (plan === "starter") {
      setCustomSetupPrice(75000);
      setCustomMonthlyPrice(10000);
    } else if (plan === "professional") {
      setCustomSetupPrice(175000);
      setCustomMonthlyPrice(15000);
    } else {
      setCustomSetupPrice(550000);
      setCustomMonthlyPrice(30000);
    }
  };

  const toggleAddon = (id: string) => {
    setActiveAddons(
      activeAddons.includes(id) ? activeAddons.filter((x) => x !== id) : [...activeAddons, id]
    );
  };

  const calculateAddonsCost = () => {
    return addonModules
      .filter((m) => activeAddons.includes(m.id))
      .reduce((sum, item) => sum + item.price, 0);
  };

  const totalSetupFee = customSetupPrice + calculateAddonsCost();

  return (
    <div className="flex flex-col gap-6 text-left">
      <div>
        <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none">Proposal Builder</h1>
        <p className="text-[13px] text-slate-500 mt-1.5 font-medium">Generate custom price sheets matching Starter, Professional, and Enterprise specs, plus add-on upsells.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Selection panel */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white border border-[#E2E8F0]/70 p-6 rounded-2xl shadow-xs flex flex-col gap-5">
            <h3 className="text-[13px] font-semibold text-slate-800 tracking-tight">Project Tiers</h3>
            
            {/* Input Details */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client / Lead Name</label>
              <input
                type="text"
                placeholder="e.g. ActiveSports Gyms"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-slate-800"
              />
            </div>

            {/* Plan tier options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {["starter", "professional", "enterprise"].map((plan) => (
                <button
                  key={plan}
                  type="button"
                  onClick={() => handlePlanChange(plan)}
                  className={`p-4 border rounded-xl flex flex-col items-start text-left cursor-pointer transition-all ${
                    selectedPlan === plan
                      ? "border-emerald-500 bg-emerald-500/5"
                      : "border-slate-200 bg-white hover:border-slate-350"
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{plan}</span>
                  <span className="text-[13px] font-bold text-slate-800 mt-2">
                    {plan === "starter" ? "₱50k–₱100k" : plan === "professional" ? "₱150k–₱200k" : "₱350k–₱750k"}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom pricing variables */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base Setup Fee (₱)</label>
                <input
                  type="number"
                  value={customSetupPrice}
                  onChange={(e) => setCustomSetupPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-slate-800"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monthly License Fee (₱)</label>
                <input
                  type="number"
                  value={customMonthlyPrice}
                  onChange={(e) => setCustomMonthlyPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Add-ons checkbox list */}
          <div className="bg-white border border-[#E2E8F0]/70 p-6 rounded-2xl shadow-xs flex flex-col gap-4">
            <h3 className="text-[13px] font-semibold text-slate-800 tracking-tight">Optional Plug-and-Play Add-ons</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {addonModules.map((item) => {
                const isActive = activeAddons.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleAddon(item.id)}
                    className={`p-3.5 border rounded-xl flex items-center justify-between text-left cursor-pointer transition-all ${
                      isActive 
                        ? "border-emerald-500 bg-emerald-500/5 text-emerald-900" 
                        : "border-slate-200 bg-white hover:border-slate-350 text-slate-700"
                    }`}
                  >
                    <div>
                      <div className="text-[11px] font-semibold">{item.name}</div>
                      <div className="text-[10px] font-bold text-slate-400 mt-0.5">₱{item.price.toLocaleString()}</div>
                    </div>
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                      isActive ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300"
                    }`}>
                      {isActive && <CheckCircle className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Calculation summary right column */}
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-[#E2E8F0]/70 p-6 rounded-2xl shadow-xs flex flex-col gap-5 sticky top-20">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Calculator className="w-4 h-4 text-emerald-600" />
              <h3 className="text-[13px] font-semibold text-slate-800 tracking-tight">Estimate Breakdown</h3>
            </div>

            <div className="flex flex-col gap-3.5 text-xs">
              <div className="flex justify-between font-semibold text-slate-500">
                <span>Base setup ({selectedPlan})</span>
                <span>₱{customSetupPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold text-slate-500">
                <span>Add-on modules ({activeAddons.length})</span>
                <span>₱{calculateAddonsCost().toLocaleString()}</span>
              </div>
              <div className="h-[1px] bg-slate-100" />
              <div className="flex justify-between font-bold text-slate-900 text-sm">
                <span>Total Setup Fee</span>
                <span>₱{totalSetupFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-[#059669] bg-emerald-50 px-2 py-1.5 rounded-lg">
                <span>Monthly Subscription</span>
                <span>₱{customMonthlyPrice.toLocaleString()} / mo</span>
              </div>
            </div>

            <button
              onClick={() => alert(`Proposal generated for ${clientName || "Client"}!`)}
              className="flex items-center justify-center gap-2 w-full py-3 mt-2 rounded-xl bg-[#059669] hover:bg-[#059669]/90 text-white font-bold text-xs shadow-xs active:scale-98 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Draft Client Proposal</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
