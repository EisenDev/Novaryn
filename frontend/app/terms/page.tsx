"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import FloatingHeader from "../components/FloatingHeader";
import Footer from "../components/Footer";
import ConsultationModal from "../components/ConsultationModal";

const EMAIL = "novarynph@gmail.com";

export default function TermsOfService() {
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
              Terms of Service
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
                1. Acceptance of Terms
              </h2>
              <p>
                These Terms of Service ("Terms") govern your access to and use of the website 
                <a href="https://novaryn.tech" className="text-emerald-600 hover:underline font-semibold mx-1">novaryn.tech</a> 
                and all software engineering, custom platform development, hosting integration, and Service Level Agreement (SLA) support services provided by Novaryn Technologies ("we," "our," "us," or "Novaryn").
              </p>
              <p>
                By accessing this website, requesting quotations, signing service contracts, or logging into our administrative dashboards, you agree to be bound by these Terms, all applicable laws, and regulations. If you do not agree to these Terms, you are prohibited from using or accessing our website and services.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-4">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider">
                2. Scope of Services
              </h2>
              <p>
                Novaryn offers premium custom digital platform engineering, database structures, business portals, mobile apps, and administrative tooling. The exact specifications, delivery schedules, and technical requirements of any project are detailed in separate service contracts or digital project quotation scopes generated via our Pricing Engine.
              </p>
              <p>
                Our services are provided to businesses, corporations, and enterprise entities. We do not offer direct consumer-facing platforms or standard commercial off-the-shelf software packages. All applications are custom-compiled, standalone, or dockerized installations.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-4">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider">
                3. User Onboarding & Administrative Accounts
              </h2>
              <p>
                To access administrative dashboards (e.g., Lead Managers, Billing Ledgers, Project Costing, or Pricing Engines), you must register for an account. By doing so, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate, current, and complete information during registration.</li>
                <li>Maintain the security and confidentiality of your login credentials (username, password, session tokens).</li>
                <li>Notify us immediately of any unauthorized access to your account or security breaches.</li>
                <li>Accept sole responsibility for all activities that occur under your administrative profile.</li>
              </ul>
              <p>
                Novaryn reserves the right to suspend or terminate administrative access to our dashboards at any time if we detect credential-sharing, security exploits, or billing defaults.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-4">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider">
                4. Financial Terms, Pricing, and Installments
              </h2>
              <p>
                Novaryn utilizes a transparent and contract-based pricing structure to ensure professional clarity:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>System Pricing:</strong> The total valuation of the custom digital platform is based on selected build modules (e.g., appointment booking engines, patient CRMs, custom POS billing, etc.) and is computed in Philippine Pesos (PHP).
                </li>
                <li>
                  <strong>Downpayment Schedule:</strong> A downpayment representing a percentage (ranging from 30% to 70%, with a standard baseline of 30% or 50% as selected in the quotation) is payable prior to development kickoff or immediately upon project go-live, as stipulated in the contract.
                </li>
                <li>
                  <strong>Monthly Installments:</strong> The remaining contract value is divided into twelve (12) monthly installments, commencing upon launch or as determined by the signed contract.
                </li>
                <li>
                  <strong>Cloud Hosting Costs:</strong> Monthly hosting costs (e.g., Azure compute, database nodes, third-party mailer configurations) are passed through to the client as fixed fees in addition to the monthly development installments.
                </li>
                <li>
                  <strong>Late Payments & Suspension:</strong> Failure to settle monthly invoices within fifteen (15) calendar days of the due date may result in a formal notice of default. If default continues for over thirty (30) days, Novaryn reserves the right to suspend host server services and restrict access to the dashboard.
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-4">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider">
                5. Intellectual Property & Source Code Ownership
              </h2>
              <p>
                Our intellectual property rights are managed with strict professionalism:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Client Deliverable Ownership:</strong> Upon full settlement of all contractual development values and monthly installments, all custom code, layout systems, specific database architectures, and graphical user interfaces engineered specifically for the client shall become the sole property of the client.
                </li>
                <li>
                  <strong>Novaryn Core Libraries:</strong> Novaryn retains ownership of any pre-existing software engines, utility classes, routing codes, or framework architectures ("Core Libraries") utilized to compile the client platform. We grant the client a perpetual, royalty-free, non-exclusive license to use, modify, and run the Core Libraries solely as embedded within the delivered platform.
                </li>
                <li>
                  <strong>Restrictions:</strong> Clients may not deconstruct, package, or resell the Core Libraries as separate standalone products or licensing frameworks.
                </li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider">
                6. Service Level Agreement (SLA) & Maintenance
              </h2>
              <p>
                All platform deliveries include a standard maintenance period, as specified:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Included SLA Scope:</strong> Standard maintenance includes security vulnerability patching, automated database backups, endpoint uptime monitoring, and critical hotfixes for system-locking bugs.
                </li>
                <li>
                  <strong>SLA Exclusions:</strong> SLA maintenance does not cover the coding of new features, redesigns of active user interfaces, database restoration due to client-side credential sharing, or integration of new third-party tools. These additions require a separate project quotation.
                </li>
                <li>
                  <strong>Year 2 Maintenance:</strong> After the initial contract year, maintenance transitions to a pay-as-you-go structure, meaning the client pays ₱0 unless a ticket is raised and solved, or the client opts for a recurring support contract.
                </li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider">
                7. Prohibited Uses & System Abuse
              </h2>
              <p>
                You represent and warrant that you will not use our platform or dashboards for any unlawful, fraudulent, or harmful purposes. You must not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Attempt to bypass security constraints, scan ports, or launch DDoS attacks on Novaryn VM structures.</li>
                <li>Use administrative credentials to upload malicious scripts, trojans, or ransomware.</li>
                <li>Input fraudulent client leads, false billing ledgers, or dummy records designed to inflate analytics metrics.</li>
                <li>Modify backend system configurations or Docker scripts without written technical clearance from Novaryn.</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section className="space-y-4">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider">
                8. Warranties & Disclaimers
              </h2>
              <p>
                OUR SERVICES, Dashboards, and PLATFORMS ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
              </p>
              <p>
                Novaryn does not warrant that the website or platforms will operate entirely error-free, uninterrupted, or free of data latency due to third-party network providers (such as Cloudflare or AWS DB nodes). While we take every measure to ensure database integrity, we cannot be held liable for losses resulting from server outages beyond our direct control.
              </p>
            </section>

            {/* Section 9 */}
            <section className="space-y-4">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider">
                9. Limitation of Liability
              </h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL NOVARYN TECHNOLOGIES, ITS CO-FOUNDERS, DEVELOPERS, OR OFFICERS BE LIABLE FOR ANY INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES (INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, LOSS OF REVENUE, LOSS OF CUSTOMER DATA, OR BUSINESS INTERRUPTION) ARISING OUT OF THE USE OR INABILITY TO USE THE DIGITAL PLATFORMS, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              </p>
              <p>
                Our aggregate liability for any claims arising under these Terms or specific project contracts shall not exceed the total amount paid by the client to Novaryn during the twelve (12) months preceding the event giving rise to the claim.
              </p>
            </section>

            {/* Section 10 */}
            <section className="space-y-4">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider">
                10. Termination & Contract Exit
              </h2>
              <p>
                Service agreements may be terminated under the following conditions:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>By the Client:</strong> A client may exit the contract early by settling all remaining monthly installments in a single lump-sum payoff, or by providing sixty (60) days written notice and settling termination exit fees.
                </li>
                <li>
                  <strong>By Novaryn:</strong> We may terminate service agreements and withdraw server support if the client breaches these Terms, fails to settle invoices, or uses the platform for unauthorized purposes.
                </li>
                <li>
                  <strong>Post-Termination Data:</strong> Upon termination, Novaryn will deliver a final archive of all client-owned databases and source repositories, after which all client instances hosted on our servers will be purged.
                </li>
              </ul>
            </section>

            {/* Section 11 */}
            <section className="space-y-4">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider">
                11. Governing Law & Dispute Resolution
              </h2>
              <p>
                These Terms and any dispute or claim arising out of or in connection with them shall be governed by and construed in accordance with the laws of the Republic of the Philippines.
              </p>
              <p>
                Any legal action, suit, or proceeding arising out of these Terms shall be instituted exclusively in the competent courts of Metro Manila, Philippines. Both parties consent to the personal jurisdiction and venue of such courts.
              </p>
            </section>

            {/* Section 12 */}
            <section className="space-y-4">
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider">
                12. Contact Information
              </h2>
              <p>
                If you have questions regarding these Terms or need to request technical support, please contact us at:
              </p>
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-6 mt-2 space-y-1 font-mono text-xs text-slate-650">
                <p className="font-bold text-slate-900">Novaryn Technologies</p>
                <p>Attention: Operations & Legal Compliance</p>
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
