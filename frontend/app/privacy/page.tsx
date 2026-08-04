"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import FloatingHeader from "../components/FloatingHeader";
import Footer from "../components/Footer";
import ConsultationModal from "../components/ConsultationModal";

const EMAIL = "novarynph@gmail.com";

export default function PrivacyPolicy() {
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex flex-col font-sans selection:bg-emerald-50 selection:text-emerald-900">
      {/* Floating Header */}
      <FloatingHeader 
        email={EMAIL}
        onCopySuccess={triggerToast}
        onOpenConsultation={() => setConsultationOpen(true)} 
      />

      {/* Main Content Area */}
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          
          {/* Document Header */}
          <div className="text-left mb-12 border-b border-slate-200/80 pb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-sm text-slate-500 mt-3 font-medium">
              Last Updated: August 4, 2026
            </p>
          </div>

          {/* Document Body */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 shadow-sm text-left text-slate-700 leading-relaxed text-sm space-y-8">
            
            {/* Section 1 */}
            <section className="space-y-4">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider">
                1. Introduction
              </h2>
              <p>
                Welcome to Novaryn Technologies ("we," "our," "us," or "Novaryn"). We are committed to protecting your personal data and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, 
                <a href="https://novaryn.tech" className="text-emerald-600 hover:underline font-semibold mx-1">novaryn.tech</a>, 
                and use our custom platform engineering, modular quotation, and administrative dashboard services.
              </p>
              <p>
                By accessing or using our services, you consent to the collection, transfer, storage, disclosure, and use of your information as described in this Privacy Policy. If you do not agree with the terms herein, please discontinue your access to our website and services immediately.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider">
                2. Information We Collect
              </h2>
              <p>
                We collect information that identifies, relates to, describes, or could reasonably be linked, directly or indirectly, with a particular user or household ("Personal Data"). The categories of information we collect include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Account & Contact Information:</strong> When you register as an administrative user, request a quote, or sign up for consultations, we collect your full name, email address, corporate email address, business address, phone number, and account credentials.
                </li>
                <li>
                  <strong>Project & Configuration Data:</strong> When utilizing our Modular Pricing Engine or Contract Builder, we collect details regarding your business scale, custom module selections, required feature lists, host configurations, notes, and custom financial parameters (such as production launch percentages).
                </li>
                <li>
                  <strong>Payment & Billing Information:</strong> For processing installments, downpayments, and cloud costs, we collect billing details, invoicing history, and transaction logs. All payments are securely logged in our financial database.
                </li>
                <li>
                  <strong>Technical & Usage Data:</strong> We automatically collect information about your device and how you interact with our website, including your IP address, browser type, operating system, page views, clickstream data, error logs, and performance metrics.
                </li>
                <li>
                  <strong>Cookies and Tracking Technologies:</strong> We use cookies to persist login sessions, remember configuration choices, and analyze traffic patterns. You can manage cookie preferences through your browser settings.
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider">
                3. How We Use Your Information
              </h2>
              <p>
                Novaryn uses the collected data for various operational, financial, and development purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Service Delivery:</strong> To build, host, monitor, and maintain custom software installations, and run administrative dashboards for client operations.
                </li>
                <li>
                  <strong>Billing & Invoicing:</strong> To generate client quotations, structure 12-month installment schedules, calculate production launch downpayments, track cloud hosting costs, and issue monthly invoices.
                </li>
                <li>
                  <strong>Client Communications:</strong> To respond to inquiries, schedule discovery consultations, send system updates, and dispatch transactional notifications via email gateways (e.g., Resend).
                </li>
                <li>
                  <strong>System Safety & Security:</strong> To detect, prevent, and mitigate technical glitches, security exploits, or unauthorized access to client databases.
                </li>
                <li>
                  <strong>Legal Compliance:</strong> To comply with applicable laws, respond to requests from public authorities, and protect the rights, property, and safety of Novaryn and our clients.
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider">
                4. Data Sharing & Disclosure
              </h2>
              <p>
                We do not sell, rent, or trade your personal data. We only share information in the following limited circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Service Providers:</strong> We share data with verified third-party vendors who assist in hosting (e.g., Azure VM instances, Supabase Database hosting), email dispatch (e.g., Resend), and performance monitoring. These parties are contractually bound to use your data only as necessary to provide these services.
                </li>
                <li>
                  <strong>Client Organization Handovers:</strong> If a system installation is handed over to a client organization, authorized administrators of that organization will have access to the user accounts and configurations under their corporate account.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose information if required to do so by law, subpoena, or in the good-faith belief that such action is necessary to comply with legal obligations or protect the rights of Novaryn.
                </li>
                <li>
                  <strong>Business Transfers:</strong> In the event of a merger, acquisition, restructuring, or sale of assets, your personal data may be transferred as part of the business assets to a successor entity.
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider">
                5. Data Security
              </h2>
              <p>
                We implement robust administrative, technical, and physical security measures to safeguard your personal data. Your data is stored on secure cloud databases (Supabase, hosted on AWS ap-northeast-1) with native Row Level Security (RLS) policies enabled. Network traffic to our API is encrypted using Secure Socket Layer (SSL/TLS) via Cloudflare proxies.
              </p>
              <p>
                However, please be aware that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use industry-standard commercial protection to guard your personal data, we cannot guarantee its absolute security. Administrative users must keep their credentials confidential.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider">
                6. Data Retention Policies
              </h2>
              <p>
                We retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations (such as retaining transaction records to comply with tax laws), resolve disputes, and enforce our contracts.
              </p>
              <p>
                When we have no ongoing legitimate business need to process your personal data, we will either delete or anonymize it. Custom database backups and repository source code remain securely archived as long as an active service agreement is in place.
              </p>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider">
                7. Your Data Rights & Choices
              </h2>
              <p>
                Depending on your location, you may have specific statutory rights regarding your personal information under regulations like the Philippines Data Privacy Act of 2012 (Republic Act No. 10173) or the General Data Protection Regulation (GDPR). These rights include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Right to Access:</strong> The right to request copies of the personal data we hold about you.
                </li>
                <li>
                  <strong>Right to Rectification:</strong> The right to request that we correct any information you believe is inaccurate or incomplete.
                </li>
                <li>
                  <strong>Right to Erasure (Right to be Forgotten):</strong> The right to request that we erase your personal data, subject to certain exceptions.
                </li>
                <li>
                  <strong>Right to Restrict or Object to Processing:</strong> The right to limit how we use your data or object to certain processing operations.
                </li>
                <li>
                  <strong>Right to Data Portability:</strong> The right to request that we transfer the data we have collected to another organization, or directly to you, in a structured format.
                </li>
              </ul>
              <p>
                To exercise any of these rights, please contact us at 
                <a href={`mailto:${EMAIL}`} className="text-emerald-600 hover:underline font-semibold mx-1">{EMAIL}</a>. 
                We will respond to your request within the statutory timeframe.
              </p>
            </section>

            {/* Section 8 */}
            <section className="space-y-4">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider">
                8. Third-Party Links & Integrations
              </h2>
              <p>
                Our services utilize third-party integrations (such as Cloudflare DNS proxies, Azure VMs, Supabase servers, and Resend mailers). We also link to our social media profiles (such as Facebook). These third-party entities have their own independent privacy policies. We do not assume responsibility or liability for the content, privacy practices, or security of these external sites.
              </p>
            </section>

            {/* Section 9 */}
            <section className="space-y-4">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider">
                9. Changes to this Policy
              </h2>
              <p>
                We may modify this Privacy Policy from time to time to reflect updates to our operational practices, changes in security architectures, or new regulatory guidelines. Any modifications will be posted directly on this page, and the "Last Updated" date at the top of this document will be updated accordingly. We encourage you to review this policy periodically.
              </p>
            </section>

            {/* Section 10 */}
            <section className="space-y-4">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider">
                10. Contact Information
              </h2>
              <p>
                If you have questions, comments, or complaints regarding this Privacy Policy or our data handling practices, please contact our Data Protection Officer at:
              </p>
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-6 mt-2 space-y-1 font-mono text-xs text-slate-650">
                <p className="font-bold text-slate-900">Novaryn Technologies</p>
                <p>Attention: Data Protection Officer</p>
                <p>Email: {EMAIL}</p>
                <p>Location: Metro Manila, Philippines</p>
              </div>
            </section>

          </div>

        </div>
      </main>

      {/* Footer */}
      <Footer email={EMAIL} />

      {/* Consultation Modal */}
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
