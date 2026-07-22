"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "What kind of platforms do you build?",
    answer: "We design and build custom web applications, portals, and internal management systems. This includes reservation engines, sports scheduling systems, medical clinic portals, custom membership portals, inventory managers, and custom CRM systems. If your business has unique workflows, we build a platform that matches them exactly."
  },
  {
    question: "Who owns the code once the project is finished?",
    answer: "You do. Unlike SaaS products where you rent the service, Novaryn builds custom software that you own entirely. Once development is complete and the final payment is cleared, the intellectual property rights and full codebase repository are transferred to your company."
  },
  {
    question: "How long does a typical custom platform build take?",
    answer: "A standard custom build takes between 6 to 12 weeks from scoping to launching. Small customer portals or localized automations might be ready in 4 weeks, while complex enterprise platforms with multiple external API integrations can take 3 months or more. We establish detailed project milestones so you always know the exact progress."
  },
  {
    question: "Do you support the software after deployment?",
    answer: "Yes, we provide continuous monitoring, security updates, and performance adjustments post-launch. All our plans include a dedicated support period. After that, we offer flexible monthly maintenance SLAs to ensure your software remains fast, secure, and compatible with new API updates."
  },
  {
    question: "How much input do we need to provide during the process?",
    answer: "Your input is critical during the initial Discovery and Design phases. We interview your key staff to understand operational pain points, and we ask you to review and approve the high-fidelity Figma mockups. Once the designs are locked, we handle the heavy coding, keeping you updated with bi-weekly demo previews."
  },
  {
    question: "Can you integrate the platform with our existing software?",
    answer: "Absolutely. We build robust API clients that sync in real-time with popular third-party systems like accounting services (QuickBooks, Xero), messaging APIs (Twilio, SendGrid), CRM tools (HubSpot, Salesforce), and various local payment gateways (GCash, PayMaya, Stripe)."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            COMMON INQUIRIES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-slate-500 mt-4 leading-relaxed">
            Have questions about how we work, code ownership, or project timelines? Here are answers to the most common questions our clients ask.
          </p>
        </div>

        {/* Accordions */}
        <div className="flex flex-col gap-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className={`border rounded-2xl transition-all duration-350 ${
                  isOpen
                    ? "border-slate-300 bg-slate-50/50 shadow-sm"
                    : "border-slate-200/80 hover:border-slate-300 bg-white"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-bold text-slate-900 pr-4 text-base sm:text-lg">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-emerald-600" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-sm text-slate-550 leading-relaxed border-t border-slate-100 pt-4 bg-white/60">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
