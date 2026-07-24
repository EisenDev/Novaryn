"use client";

import React, { useState } from "react";
import { Users, FileText, UserPlus, CheckCircle, Clock } from "lucide-react";

interface Candidate {
  id: string;
  name: string;
  role: string;
  source: string;
  stage: "Applied" | "Assessment" | "Interview" | "Offer";
  codingScore?: string;
  experience: string;
}

const mockCandidates: Candidate[] = [
  {
    id: "1",
    name: "John Doe",
    role: "Senior Full Stack Dev (Next.js/Laravel)",
    source: "LinkedIn Referral",
    stage: "Assessment",
    codingScore: "95 / 100",
    experience: "5 years",
  },
  {
    id: "2",
    name: "Sarah Jenkins",
    role: "UI/UX Designer",
    source: "Portfolio Submission",
    stage: "Interview",
    experience: "3 years",
  },
  {
    id: "3",
    name: "Kenji Sato",
    role: "QA Automation Engineer",
    source: "Direct Application",
    stage: "Applied",
    experience: "4 years",
  },
  {
    id: "4",
    name: "Maria Santos",
    role: "Backend Laravel Engineer",
    source: "Indeed",
    stage: "Offer",
    codingScore: "98 / 100",
    experience: "6 years",
  },
];

export default function HiringPage() {
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);

  const moveCandidate = (id: string, nextStage: "Applied" | "Assessment" | "Interview" | "Offer") => {
    setCandidates(
      candidates.map((c) => (c.id === id ? { ...c, stage: nextStage } : c))
    );
  };

  const getStageCount = (stage: string) => {
    return candidates.filter((c) => c.stage === stage).length;
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div>
        <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none">Hiring Pipeline</h1>
        <p className="text-[13px] text-slate-500 mt-1.5 font-medium">Track developer candidates and designer partners through screening, code assessments, and interviews.</p>
      </div>

      {/* Kanban Board — horizontal scroll on mobile */}
      <div className="-mx-1 overflow-x-auto pb-2">
      <div className="flex gap-3 md:grid md:grid-cols-4 min-w-[640px] md:min-w-0 mt-2">
        {/* Column 1: Applied */}
        <div className="bg-slate-50/50 border border-slate-200/50 rounded-2xl p-4 flex flex-col gap-4 min-h-[450px]">
          <div className="flex justify-between items-center px-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Applied</span>
            <span className="text-[10px] bg-slate-200/50 px-1.5 py-0.5 rounded font-mono font-bold text-slate-650">
              {getStageCount("Applied")}
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {candidates
              .filter((c) => c.stage === "Applied")
              .map((item) => (
                <div key={item.id} className="bg-white border border-slate-200/60 p-3.5 rounded-xl shadow-xs flex flex-col gap-3">
                  <div>
                    <h4 className="text-[12px] font-semibold text-slate-800 leading-tight">{item.name}</h4>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">{item.role}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 mt-0.5 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                    <span>Exp: {item.experience}</span>
                    <button 
                      onClick={() => moveCandidate(item.id, "Assessment")}
                      className="text-emerald-600 hover:underline cursor-pointer"
                    >
                      Assess →
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Column 2: Tech Assessment */}
        <div className="bg-slate-50/50 border border-slate-200/50 rounded-2xl p-4 flex flex-col gap-4 min-h-[450px]">
          <div className="flex justify-between items-center px-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Assessment</span>
            <span className="text-[10px] bg-slate-200/50 px-1.5 py-0.5 rounded font-mono font-bold text-slate-650">
              {getStageCount("Assessment")}
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {candidates
              .filter((c) => c.stage === "Assessment")
              .map((item) => (
                <div key={item.id} className="bg-white border border-slate-200/60 p-3.5 rounded-xl shadow-xs flex flex-col gap-3">
                  <div>
                    <h4 className="text-[12px] font-semibold text-slate-800 leading-tight">{item.name}</h4>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">{item.role}</p>
                    {item.codingScore && (
                      <span className="inline-block mt-2 text-[9px] font-bold px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded">
                        Score: {item.codingScore}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 mt-0.5 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                    <span>Exp: {item.experience}</span>
                    <button 
                      onClick={() => moveCandidate(item.id, "Interview")}
                      className="text-emerald-600 hover:underline cursor-pointer"
                    >
                      Interview →
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Column 3: Interview */}
        <div className="bg-slate-50/50 border border-slate-200/50 rounded-2xl p-4 flex flex-col gap-4 min-h-[450px]">
          <div className="flex justify-between items-center px-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Interview</span>
            <span className="text-[10px] bg-slate-200/50 px-1.5 py-0.5 rounded font-mono font-bold text-slate-650">
              {getStageCount("Interview")}
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {candidates
              .filter((c) => c.stage === "Interview")
              .map((item) => (
                <div key={item.id} className="bg-white border border-slate-200/60 p-3.5 rounded-xl shadow-xs flex flex-col gap-3">
                  <div>
                    <h4 className="text-[12px] font-semibold text-slate-800 leading-tight">{item.name}</h4>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">{item.role}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 mt-0.5 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                    <span>Exp: {item.experience}</span>
                    <button 
                      onClick={() => moveCandidate(item.id, "Offer")}
                      className="text-emerald-600 hover:underline cursor-pointer"
                    >
                      Offer →
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Column 4: Offer */}
        <div className="bg-slate-50/50 border border-slate-200/50 rounded-2xl p-4 flex flex-col gap-4 min-h-[450px]">
          <div className="flex justify-between items-center px-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Offer</span>
            <span className="text-[10px] bg-slate-200/50 px-1.5 py-0.5 rounded font-mono font-bold text-slate-650">
              {getStageCount("Offer")}
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {candidates
              .filter((c) => c.stage === "Offer")
              .map((item) => (
                <div key={item.id} className="bg-white border border-slate-200/60 p-3.5 rounded-xl shadow-xs flex flex-col gap-3">
                  <div>
                    <h4 className="text-[12px] font-semibold text-slate-800 leading-tight">{item.name}</h4>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">{item.role}</p>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 mt-0.5 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                    <span className="text-emerald-600 font-extrabold uppercase">Decided</span>
                    <button 
                      onClick={() => moveCandidate(item.id, "Applied")}
                      className="text-slate-450 hover:underline cursor-pointer"
                    >
                      Reset ↺
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
