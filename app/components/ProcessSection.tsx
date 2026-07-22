import React from "react";
import { Search, Eye, Palette, Terminal, Send, ShieldAlert } from "lucide-react";

interface Step {
  num: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: Step[] = [
  {
    num: "01",
    title: "Discovery",
    description: "We interview your team, shadow your current workflows, and extract detailed requirements to understand exactly what challenges need solving.",
    icon: Search
  },
  {
    num: "02",
    title: "Planning",
    description: "We scope features, define database architectures, prepare user stories, and present a detailed product specification outlining exact scopes.",
    icon: Eye
  },
  {
    num: "03",
    title: "Design",
    description: "Our design team builds high-fidelity interactive Figma mockups. We iterate with you until every view feels intuitive, premium, and beautiful.",
    icon: Palette
  },
  {
    num: "04",
    title: "Development",
    description: "Using Next.js, React, Tailwind, and industry-standard backend stacks, our engineers write clean, documentable, and robust codebases.",
    icon: Terminal
  },
  {
    num: "05",
    title: "Deployment",
    description: "We handle DNS mappings, environment configurations, and launch your platform to secure production servers with automated backup plans.",
    icon: Send
  },
  {
    num: "06",
    title: "Continuous Support",
    description: "We keep your platform lightning-fast and secure. Post-launch support guarantees bugs are fixed immediately and updates are rolled out smoothly.",
    icon: ShieldAlert
  }
];

export default function ProcessSection() {
  return (
    <section id="process" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-2xl mb-16 text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
            OUR CRAFTSMANSHIP PROCESS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 tracking-tight">
            How we turn complex business logic into smooth digital software.
          </h2>
          <p className="text-base text-slate-500 mt-4 leading-relaxed">
            Building software should never be a guessing game. We follow a strict, transparent development roadmap that guarantees your system is built correctly, on time, and within budget.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          {/* Connector Line for Desktop */}
          <div className="hidden lg:block absolute top-[44px] left-[5%] right-[5%] h-[1px] bg-slate-200 -z-10" />

          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="flex flex-col gap-4 text-left relative bg-white pr-4"
              >
                {/* Step Marker Bubble */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-250 flex items-center justify-center font-mono font-bold text-sm text-slate-600 shadow-sm relative z-10 hover:border-emerald-500 hover:text-emerald-600 transition-colors duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-mono font-black text-2xl text-slate-200 tracking-wider">
                    {step.num}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2 mt-2">
                  <h3 className="text-base font-bold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {step.description}
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
