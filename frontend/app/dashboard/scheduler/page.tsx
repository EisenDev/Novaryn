"use client";

import React, { useState } from "react";
import { Calendar, Video, Clock, Check, AlertCircle } from "lucide-react";

interface ConsultationEvent {
  id: string;
  clientName: string;
  industry: string;
  time: string;
  date: string;
  platform: string;
  notes: string;
  status: "pending" | "completed" | "cancelled";
}

const mockConsultations: ConsultationEvent[] = [
  {
    id: "1",
    clientName: "Michael Chang (ActiveSports Gyms)",
    industry: "Gyms & Wellness",
    time: "10:00 AM - 10:45 AM",
    date: "July 24, 2026",
    platform: "Google Meet",
    notes: "Requires custom QR code check-in flow and GCash payment integration.",
    status: "pending",
  },
  {
    id: "2",
    clientName: "Sophia Cruz (HeartCare Clinic Group)",
    industry: "Clinics & Medical",
    time: "2:00 PM - 2:45 PM",
    date: "July 24, 2026",
    platform: "Zoom Video",
    notes: "Requires multi-branch scheduling system for 4 locations.",
    status: "pending",
  },
  {
    id: "3",
    clientName: "Chef Andres (Bistro Group PH)",
    industry: "Restaurants",
    time: "11:30 AM - 12:15 PM",
    date: "July 25, 2026",
    platform: "Google Meet",
    notes: "Interested in POS integrations and self-service table kiosks.",
    status: "pending",
  },
];

export default function SchedulerPage() {
  const [consultations, setConsultations] = useState<ConsultationEvent[]>(mockConsultations);

  const toggleStatus = (id: string) => {
    setConsultations(
      consultations.map((c) =>
        c.id === id ? { ...c, status: c.status === "pending" ? "completed" : "pending" } : c
      )
    );
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div>
        <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none">Consultations</h1>
        <p className="text-[13px] text-slate-500 mt-1.5 font-medium">Coordinate scheduled video calls and review pre-meeting client discovery notes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agenda list */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white border border-[#E2E8F0]/70 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
            <h3 className="text-[13px] font-semibold text-slate-800 tracking-tight">Upcoming Consultations</h3>
            
            <div className="flex flex-col gap-3">
              {consultations.map((meeting) => (
                <div 
                  key={meeting.id} 
                  className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-4 ${
                    meeting.status === "completed" 
                      ? "bg-slate-50/50 border-slate-200/50 opacity-70" 
                      : "bg-white border-[#E2E8F0] hover:border-slate-350"
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-650 shrink-0 mt-0.5">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-semibold text-slate-900 leading-snug">{meeting.clientName}</h4>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 items-center text-[11px] text-slate-450 mt-1 font-medium">
                        <span className="bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200/50">{meeting.industry}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {meeting.date} at {meeting.time}
                        </span>
                        <span className="font-bold text-slate-650">{meeting.platform}</span>
                      </div>
                      <p className="text-[11px] text-slate-450 mt-2.5 bg-slate-50/50 p-2.5 rounded border border-slate-100 leading-relaxed italic">
                        "{meeting.notes}"
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleStatus(meeting.id)}
                    className={`shrink-0 p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      meeting.status === "completed"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-650"
                        : "bg-white border-slate-200 text-slate-400 hover:border-slate-350 hover:bg-slate-50"
                    }`}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar widget */}
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-[#E2E8F0]/70 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
            <h3 className="text-[13px] font-semibold text-slate-800 tracking-tight">Calendar Status</h3>
            <div className="border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center py-8 text-center text-slate-400">
              <Calendar className="w-8 h-8 text-slate-300 mb-3" />
              <span className="text-xs font-semibold">Discovery Calendar</span>
              <p className="text-[11px] text-slate-450 max-w-[200px] mt-1.5 leading-relaxed">
                Connect external accounts in Google Calendar settings.
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0]/70 rounded-2xl p-5 shadow-xs flex flex-col gap-3">
            <h3 className="text-[13px] font-semibold text-slate-800 tracking-tight">Preparation Guide</h3>
            <div className="flex items-start gap-2.5 text-[11px] leading-relaxed text-slate-500">
              <AlertCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Review client request forms to check if they require Starter, Professional, or Enterprise templates.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
