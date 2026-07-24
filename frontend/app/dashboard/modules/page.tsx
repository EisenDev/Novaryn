"use client";

import React, { useState } from "react";
import { Layers, Shield, Key, Wifi, Settings, Check } from "lucide-react";

export default function ModuleConfigPage() {
  const [loading, setLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState("paddleyard");
  const [gcashMerchantId, setGcashMerchantId] = useState("GCASH-MID-99281");
  const [paymayaApiKey, setPaymayaApiKey] = useState("pk-maya-8291-a1b2-c3d4");
  const [qrCheckInType, setQrCheckInType] = useState("single_entry");
  const [rfidReaderIp, setRfidReaderIp] = useState("192.168.1.150");

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Client module credentials updated successfully!");
    }, 800);
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div>
        <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none">Client Module Config</h1>
        <p className="text-[13px] text-slate-500 mt-1.5 font-medium">Configure live integration tokens, payment credentials, and hardware links for active client systems.</p>
      </div>

      <div className="bg-white border border-[#E2E8F0]/70 p-6 rounded-2xl shadow-xs max-w-2xl flex flex-col gap-5">
        
        {/* Client Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Client Installation</label>
          <select 
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white font-semibold text-xs text-slate-800 outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer shadow-xs"
          >
            <option value="paddleyard">PaddleYard Sports Club (Active)</option>
            <option value="activesports">ActiveSports Gyms (Development)</option>
            <option value="bistrogroup">Bistro Group PH (Planning)</option>
          </select>
        </div>

        <div className="h-[1px] bg-slate-100 my-1" />

        {/* Payment Gateways Config */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-600" />
            <h3 className="text-[13px] font-semibold text-slate-800 tracking-tight">Payment Integration API Keys</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">GCash Merchant ID</label>
              <input
                type="text"
                value={gcashMerchantId}
                onChange={(e) => setGcashMerchantId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-slate-800"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PayMaya Public API Key</label>
              <input
                type="text"
                value={paymayaApiKey}
                onChange={(e) => setPaymayaApiKey(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-slate-800"
              />
            </div>
          </div>
        </div>

        <div className="h-[1px] bg-slate-100 my-1" />

        {/* Access control settings */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-emerald-600" />
            <h3 className="text-[13px] font-semibold text-slate-800 tracking-tight">Access Control & Scan Modules</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">QR Code Booking Rules</label>
              <select 
                value={qrCheckInType}
                onChange={(e) => setQrCheckInType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white font-semibold text-xs text-slate-800 outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer shadow-xs"
              >
                <option value="single_entry">Single Scan Entry (Expires on scan)</option>
                <option value="multi_entry">Multi-pass Entry (Schedules window)</option>
                <option value="manual_review">Staff Verification Queue</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">RFID Reader Node IP Address</label>
              <input
                type="text"
                value={rfidReaderIp}
                onChange={(e) => setRfidReaderIp(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-slate-800"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-5 py-2.5 mt-3 self-end rounded-lg bg-[#059669] hover:bg-[#059669]/90 text-white font-bold text-[13px] shadow-xs active:scale-98 transition-all cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>Save Client Config</span>
        </button>

      </div>
    </div>
  );
}
