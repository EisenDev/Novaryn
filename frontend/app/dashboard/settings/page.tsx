"use client";

import React, { useState, useEffect } from "react";
import { Settings, RefreshCw, Check } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    company_name: "Novaryn",
    logo_url: "/novaryn-logo.png",
    email: "novaryntec@gmail.com",
    phone: "+63 917 123 4567",
    address: "Makati City, Metro Manila, Philippines",
    seo_title: "Novaryn | Custom Software & Business Platforms",
    seo_description: "Novaryn builds custom, high-fidelity business platforms and scheduling systems."
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const token = localStorage.getItem("novaryn_admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    try {
      const res = await fetch(`${apiUrl}/system/settings`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setSettings((prev) => ({
          ...prev,
          ...data.data
        }));
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("novaryn_admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    try {
      const res = await fetch(`${apiUrl}/system/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify({ settings })
      });
      if (res.ok) {
        alert("Settings saved successfully and synced with the database!");
      }
    } catch (err) {
      console.error("Error saving settings:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      
      {/* Header */}
      <div>
        <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none">Settings</h1>
        <p className="text-[13px] text-slate-500 mt-1.5 font-medium">Configure global site variables served dynamically on the frontend website.</p>
      </div>

      {/* Form card */}
      <form onSubmit={handleSaveSettings} className="bg-white border border-[#E2E8F0]/70 p-6.5 rounded-2xl shadow-xs flex flex-col gap-5 max-w-2xl">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Company Name</label>
            <input
              type="text"
              value={settings.company_name}
              onChange={(e) => setSettings({...settings, company_name: e.target.value})}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-205 bg-slate-50/50 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-slate-800"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logo Asset Path</label>
            <input
              type="text"
              value={settings.logo_url}
              onChange={(e) => setSettings({...settings, logo_url: e.target.value})}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-205 bg-slate-50/50 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-slate-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Support Email</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({...settings, email: e.target.value})}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-205 bg-slate-50/50 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-slate-800"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hotline Phone</label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => setSettings({...settings, phone: e.target.value})}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-205 bg-slate-50/50 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-slate-800"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Office HQ Address</label>
          <input
            type="text"
            value={settings.address}
            onChange={(e) => setSettings({...settings, address: e.target.value})}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-205 bg-slate-50/50 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-slate-800"
          />
        </div>

        <div className="h-[1px] bg-slate-100 my-1" />

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SEO Meta Page Title</label>
          <input
            type="text"
            value={settings.seo_title}
            onChange={(e) => setSettings({...settings, seo_title: e.target.value})}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-205 bg-slate-50/50 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-slate-800"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SEO Meta Description</label>
          <textarea
            value={settings.seo_description}
            onChange={(e) => setSettings({...settings, seo_description: e.target.value})}
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-205 bg-slate-50/50 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none font-semibold text-slate-800"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 px-5 py-2.5 mt-3 self-end rounded-lg bg-[#059669] hover:bg-[#059669]/90 text-white font-bold text-[13px] shadow-xs active:scale-98 transition-all cursor-pointer"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Save Website Settings</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
