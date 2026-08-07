"use client";

import React, { useState } from "react";
import { X, Check, Loader2, Calendar, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
}

export default function ConsultationModal({ isOpen, onClose, initialMessage }: ConsultationModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  // Reset or pre-fill message when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        message: initialMessage || ""
      }));
    }
  }, [isOpen, initialMessage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    try {
      const res = await fetch(`${apiUrl}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 422 && data.errors) {
          setErrors(data.errors);
        } else {
          alert(data.message || "Something went wrong. Please try again.");
        }
      } else {
        setSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: ""
        });
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Unable to connect to the server. Please verify the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
          {/* Light Glassmorphic Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-white/40 backdrop-blur-[2px] transition-all"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative border border-slate-100 max-h-[90vh] flex flex-col z-10 text-left"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight font-sans">Book a Consultation</h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5 font-sans">Submit your project details to schedule a meeting with our team.</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Scroll Area */}
            <div className="p-6 overflow-y-auto flex-1 font-sans">
              {!success ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  
                  {/* Name */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="name" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Name *</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border bg-slate-55/50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                        errors.name ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200"
                      }`}
                      placeholder="e.g. John Doe"
                    />
                    {errors.name && <span className="text-[10px] text-red-500 font-bold mt-0.5">{errors.name[0]}</span>}
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-xl border bg-slate-55/50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all ${
                        errors.email ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : "border-slate-200"
                      }`}
                      placeholder="e.g. john@company.com"
                    />
                    {errors.email && <span className="text-[10px] text-red-500 font-bold mt-0.5">{errors.email[0]}</span>}
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="phone" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone / Mobile</label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-55/50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      placeholder="e.g. 0917 123 4567"
                    />
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1">
                    <label htmlFor="message" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tell us about your project</label>
                    <textarea
                      name="message"
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-55/50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                      placeholder="Describe the operational features, users, integrations, or modules you need us to build..."
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t border-slate-100 shrink-0">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <Shield className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Data protected securely</span>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-500/50 text-white font-bold text-xs shadow-md shadow-emerald-600/10 active:scale-98 transition-all cursor-pointer select-none"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Request</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="py-8 flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center text-emerald-650 mb-5 shadow-xs">
                    <Check className="w-7 h-7" strokeWidth={3} />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 tracking-tight">Consultation Request Sent!</h4>
                  <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
                    Thank you for contacting Novaryn. Our engineering team has received your information and we will reach out to you within 24 hours to schedule our call.
                  </p>
                  <button
                    onClick={() => {
                      setSuccess(false);
                      onClose();
                    }}
                    className="mt-6 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-805 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Close Panel
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
