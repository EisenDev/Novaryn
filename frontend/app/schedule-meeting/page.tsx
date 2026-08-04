"use client";

import React, { useState } from "react";
import { 
  Calendar as CalendarIcon, Video, Clock, CheckCircle2, 
  MapPin, Loader2, ArrowRight, Mail, ShieldCheck
} from "lucide-react";

export default function PublicSchedulingPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [emailInput, setEmailInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Verified lead info
  const [clientName, setClientName] = useState("");

  // Form selections
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("09:00 AM - 10:00 AM");
  const [meetingType, setMeetingType] = useState<"google_meet" | "physical">("google_meet");
  const [notes, setNotes] = useState("");

  const timeSlots = [
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM"
  ];

  // Step 1: Verify Email
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;

    setLoading(true);
    setErrorMsg("");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    try {
      const res = await fetch(`${apiUrl}/public/leads/verify?email=${encodeURIComponent(emailInput.trim())}`, {
        method: "GET",
        headers: {
          "Accept": "application/json"
        }
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "No active consultation request found for this email.");
      }

      setClientName(json.data.name);
      setStep(2);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong. Please check your spelling.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Save Schedule Preference
  const handleBookSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetingDate) {
      alert("Please select a date.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    // Combine date and time slot start time
    const timePart = meetingTime.split(" ")[0]; // "09:00"
    const meridiem = meetingTime.split(" ")[1]; // "AM"
    let hours = parseInt(timePart.split(":")[0], 10);
    const minutes = parseInt(timePart.split(":")[1], 10);
    
    if (meridiem === "PM" && hours !== 12) {
      hours += 12;
    } else if (meridiem === "AM" && hours === 12) {
      hours = 0;
    }

    const scheduledDateTime = new Date(meetingDate);
    scheduledDateTime.setHours(hours, minutes, 0, 0);

    try {
      const res = await fetch(`${apiUrl}/public/leads/schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          email: emailInput.trim(),
          meeting_date: scheduledDateTime.toISOString(),
          meeting_type: meetingType,
          notes: notes
        })
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to schedule slot.");
      }

      setStep(3);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to book this slot. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 text-left font-sans">
      <div className="w-full max-w-lg bg-white border border-slate-200/80 rounded-3xl p-8 shadow-2xl flex flex-col gap-6 relative overflow-hidden">
        
        {/* Top Branding Header */}
        <div className="flex flex-col items-center text-center pb-4 border-b border-slate-100">
          <img 
            src="/novaryn-logo.png" 
            alt="Novaryn Logo" 
            className="w-10 h-10 object-contain mb-2"
          />
          <h2 className="text-base font-extrabold uppercase tracking-wider text-slate-900 leading-none">NOVARYN TECH SOLUTIONS</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Consultation Scheduler</p>
        </div>

        {/* STEP 1: VERIFY EMAIL */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Access Consultation Portal</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Enter the email address you used when requesting your custom platform consultation to select your slot.
              </p>
            </div>

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl text-red-800 text-[11px] font-bold flex items-start gap-2">
                <AlertIcon className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleVerifyEmail} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="verify-email" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Consultation Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    id="verify-email"
                    required
                    placeholder="e.g. client@domain.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold font-sans"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-805 disabled:bg-slate-805/50 text-white font-bold text-xs shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Proceed to Calendar</span>}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: SELECT DATE, TIME & TYPE */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Select Meeting Details</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Hello <strong>{clientName}</strong>, please choose your preferred timing and meeting method.
              </p>
            </div>

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl text-red-800 text-[11px] font-bold flex items-start gap-2">
                <AlertIcon className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleBookSlot} className="flex flex-col gap-4">
              
              {/* Meeting Type Selector */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMeetingType("google_meet")}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center cursor-pointer ${
                    meetingType === "google_meet" 
                      ? "border-emerald-500 bg-emerald-50/40 text-emerald-800" 
                      : "border-slate-200 hover:border-slate-350 text-slate-650"
                  }`}
                >
                  <Video className="w-5 h-5 text-emerald-600" />
                  <span className="text-[11px] font-bold">Google Meet (Online)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMeetingType("physical")}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-center cursor-pointer ${
                    meetingType === "physical" 
                      ? "border-emerald-500 bg-emerald-50/40 text-emerald-800" 
                      : "border-slate-200 hover:border-slate-350 text-slate-650"
                  }`}
                >
                  <MapPin className="w-5 h-5 text-indigo-600" />
                  <span className="text-[11px] font-bold">Physical (Digos City)</span>
                </button>
              </div>

              {/* Date selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <CalendarIcon className="w-3.5 h-3.5" /> Preferred Date
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-450 focus:border-emerald-450 font-sans"
                />
              </div>

              {/* Time selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Preferred Time Slot
                </label>
                <select
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-450 focus:border-emerald-450 font-sans"
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              {/* Additional notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Additional Specifications / Meeting Location Notes</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={meetingType === "physical" ? "Specify preferred coffee shop or venue in Digos City..." : "Describe any details you want to align during the call..."}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-450 focus:border-emerald-450 resize-none font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-500/50 text-white font-bold text-xs shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Confirm Appointment</span>}
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: SUCCESS CONFIRMATION */}
        {step === 3 && (
          <div className="py-8 flex flex-col items-center justify-center text-center max-w-sm mx-auto gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center text-emerald-650 shadow-xs mb-2">
              <ShieldCheck className="w-8 h-8" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Appointment Scheduled!</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed font-sans">
                Thank you, your appointment details have been locked in. We have dispatched a confirmation email via Resend to <strong>{emailInput}</strong>.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 w-full text-[11px] text-slate-650 flex flex-col gap-1">
              <p><strong>Format:</strong> {meetingType === "google_meet" ? "Google Meet (Online Video)" : "Physical Meetup"}</p>
              <p><strong>Date:</strong> {new Date(meetingDate).toLocaleDateString("en-PH", { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              <p><strong>Time Slot:</strong> {meetingTime}</p>
            </div>
            <p className="text-[10px] text-slate-400 font-sans">Our engineering representatives will verify the calendar invite shortly.</p>
          </div>
        )}

      </div>
    </div>
  );
}

// Inline alert icon
function AlertIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
