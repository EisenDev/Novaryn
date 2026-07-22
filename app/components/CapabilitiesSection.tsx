import React from "react";
import {
  Code,
  CalendarDays,
  Briefcase,
  Users,
  CreditCard,
  UserCheck,
  TrendingUp,
  Database,
  Link2,
  CloudLightning,
  ShieldCheck,
  LifeBuoy
} from "lucide-react";

interface Capability {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CAPABILITIES: Capability[] = [
  {
    title: "Custom Web Platforms",
    description: "Tailor-made web applications designed from the ground up to solve your specific operational bottlenecks.",
    icon: Code
  },
  {
    title: "Booking Systems",
    description: "Smart reservation engines with real-time slot availability, automated reminders, and calendar syncing.",
    icon: CalendarDays
  },
  {
    title: "Business Management Systems",
    description: "Centralized platforms to manage inventories, staff scheduling, resource allocations, and business operations.",
    icon: Briefcase
  },
  {
    title: "Membership Platforms",
    description: "Flexible tier management, member portals, digital check-in passes, and subscription billing lifecycles.",
    icon: Users
  },
  {
    title: "POS Systems",
    description: "Custom point-of-sale configurations optimized for rapid checkout, receipt generation, and offline operations.",
    icon: CreditCard
  },
  {
    title: "Customer Portals",
    description: "Self-service client spaces where they can book, download invoices, request changes, and track requests.",
    icon: UserCheck
  },
  {
    title: "Payment Integration",
    description: "Secure gateway setups (GCash, PayMaya, Stripe, PayPal) with automatic invoicing and split payment routing.",
    icon: CreditCard
  },
  {
    title: "Dashboard & Analytics",
    description: "Interactive data visualizations, exportable CSV reports, and intelligence trackers monitoring performance.",
    icon: TrendingUp
  },
  {
    title: "CRM Systems",
    description: "Client databases that capture touchpoints, log notes, automate follow-ups, and organize lead pipes.",
    icon: Database
  },
  {
    title: "API Integrations",
    description: "Seamless connections to your existing accounting, messaging, ERP, or marketing software stacks.",
    icon: Link2
  },
  {
    title: "Cloud Deployment",
    description: "Production-ready hosting on Vercel, AWS, or GCP with automated backups, SSL certificates, and autoscaling.",
    icon: CloudLightning
  },
  {
    title: "Maintenance & Support",
    description: "Continuous monitoring, minor feature updates, security patches, and guaranteed SLAs for peace of mind.",
    icon: LifeBuoy
  }
];

export default function CapabilitiesSection() {
  return (
    <section id="capabilities" className="py-24 bg-slate-50 border-y border-slate-200/50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            OUR CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
            We build software for businesses who demand the absolute best.
          </h2>
          <p className="text-base text-slate-500 mt-4 leading-relaxed">
            Every business is unique. We don't believe in forcing generic templates. Instead, we design, architect, and code custom software platforms built specifically for your workflows.
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CAPABILITIES.map((cap) => {
            const Icon = cap.icon;
            return (
              <div
                key={cap.title}
                className="group relative bg-white border border-slate-200/60 p-7 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col gap-4 text-left"
              >
                {/* Icon wrapper */}
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-250/20 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors duration-300">
                  <Icon className="w-5 h-5 text-slate-500 group-hover:text-emerald-600 transition-colors duration-300" />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors duration-300">
                    {cap.title}
                  </h3>
                  <p className="text-sm text-slate-550 leading-relaxed">
                    {cap.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
