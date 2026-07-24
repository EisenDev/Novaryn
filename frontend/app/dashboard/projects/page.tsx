"use client";

import React, { useState } from "react";
import { Briefcase, Link as LinkIcon, Code, Eye, RefreshCw, Layers } from "lucide-react";

interface ProjectItem {
  id: string;
  name: string;
  client: string;
  plan: string;
  stage: "Discovery" | "Planning" | "Design" | "Dev" | "Deployment" | "Support";
  progress: number; // percentage
  repoUrl: string;
  devLead: string;
  showcaseStatus: "Deployed" | "Draft" | "Archived";
}

const mockProjects: ProjectItem[] = [
  {
    id: "1",
    name: "PaddleYard",
    client: "PaddleYard Sports Inc.",
    plan: "Professional Plan",
    stage: "Support",
    progress: 100,
    repoUrl: "github.com/novaryn/paddleyard-web",
    devLead: "Alexander Reyes",
    showcaseStatus: "Deployed", // Deployed and in production
  },
  {
    id: "2",
    name: "ActiveSports Booking",
    client: "ActiveSports Gyms",
    plan: "Starter Plan",
    stage: "Dev",
    progress: 65,
    repoUrl: "github.com/novaryn/activesports-portal",
    devLead: "Sophia Cruz",
    showcaseStatus: "Draft",
  },
  {
    id: "3",
    name: "Bistro Group Kiosk",
    client: "Bistro Group PH",
    plan: "Enterprise Plan",
    stage: "Planning",
    progress: 25,
    repoUrl: "github.com/novaryn/bistro-kiosk-app",
    devLead: "Marcus Lopez",
    showcaseStatus: "Draft",
  },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>(mockProjects);

  const toggleShowcase = (id: string) => {
    setProjects(
      projects.map((p) =>
        p.id === id
          ? {
              ...p,
              showcaseStatus: p.showcaseStatus === "Deployed" ? "Draft" : "Deployed",
            }
          : p
      )
    );
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div>
        <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none">Projects</h1>
        <p className="text-[13px] text-slate-500 mt-1.5 font-medium">Monitor active client builds across your development cycles and configure case study showcase states.</p>
      </div>

      {/* Projects Grid List */}
      <div className="flex flex-col gap-5">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="bg-white border border-[#E2E8F0]/70 p-6 rounded-2xl shadow-xs flex flex-col gap-5"
          >
            {/* Header info */}
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-650 shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-slate-900 tracking-tight">{project.name}</h3>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-450 font-medium">
                    <span>{project.client}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span>{project.plan}</span>
                  </div>
                </div>
              </div>

              {/* Showcase status controls */}
              <div className="flex items-center gap-3">
                <span className={`inline-block text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  project.showcaseStatus === "Deployed" 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-150" 
                    : "bg-slate-50 text-slate-500 border border-slate-200"
                }`}>
                  {project.showcaseStatus}
                </span>
                <button
                  onClick={() => toggleShowcase(project.id)}
                  className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200 bg-white rounded-lg text-[10px] font-bold text-slate-650 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Toggle Showcase</span>
                </button>
              </div>
            </div>

            {/* 6 Craftsmanship Milestones Tracker */}
            <div className="flex flex-col gap-2 mt-1">
              <div className="flex justify-between text-[11px] font-semibold text-slate-450">
                <span>Milestones Cycle</span>
                <span className="text-[#059669]">Stage: {project.stage} ({project.progress}%)</span>
              </div>
              
              {/* Progress bars sequence */}
              <div className="grid grid-cols-6 gap-1.5 h-2 rounded-full overflow-hidden bg-slate-100">
                {["Discovery", "Planning", "Design", "Dev", "Deployment", "Support"].map((step, idx) => {
                  const stages = ["Discovery", "Planning", "Design", "Dev", "Deployment", "Support"];
                  const currentIdx = stages.indexOf(project.stage);
                  const isCompleted = idx < currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div 
                      key={step} 
                      className={`h-full rounded-full transition-colors ${
                        isCompleted 
                          ? "bg-emerald-500" 
                          : isCurrent 
                            ? "bg-emerald-450 animate-pulse" 
                            : "bg-slate-200/50"
                      }`}
                      title={`${step}: ${isCompleted ? "Completed" : isCurrent ? "Active" : "Upcoming"}`}
                    />
                  );
                })}
              </div>
              <div className="grid grid-cols-6 gap-1.5 text-[9px] font-bold text-slate-400 text-center uppercase tracking-wide">
                <span>Discovery</span>
                <span>Planning</span>
                <span>Design</span>
                <span>Dev</span>
                <span>Deploy</span>
                <span>Support</span>
              </div>
            </div>

            {/* Links & metadata footer block */}
            <div className="flex items-center gap-6 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-550">
              <div className="flex items-center gap-1.5">
                <Code className="w-4 h-4 text-slate-400" />
                <span>Dev Lead: <span className="text-slate-800 font-bold">{project.devLead}</span></span>
              </div>
              <div className="flex items-center gap-1.5">
                <LinkIcon className="w-4 h-4 text-slate-400" />
                <a href={`https://${project.repoUrl}`} target="_blank" className="hover:underline text-emerald-600 font-bold">
                  {project.repoUrl}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
