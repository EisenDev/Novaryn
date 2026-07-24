"use client";

import React, { useState } from "react";
import { UserPlus, Plus, Briefcase, Trash2, Eye, EyeOff } from "lucide-react";

interface JobOpening {
  id: string;
  title: string;
  department: string;
  status: "Open" | "Draft" | "Closed";
  type: string;
  applicants: number;
}

const mockJobs: JobOpening[] = [
  { id: "1", title: "Senior Full Stack Dev (Next.js/Laravel)", department: "Engineering", status: "Open", type: "Full-Time", applicants: 12 },
  { id: "2", title: "Lead Product UI/UX Designer", department: "Design", status: "Open", type: "Full-Time", applicants: 8 },
  { id: "3", title: "QA Automation Engineer", department: "Engineering", status: "Draft", type: "Part-Time", applicants: 0 },
];

export default function JobsCMSPage() {
  const [jobs, setJobs] = useState<JobOpening[]>(mockJobs);
  const [newTitle, setNewTitle] = useState("");
  const [newDept, setNewDept] = useState("Engineering");

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newJob: JobOpening = {
      id: Date.now().toString(),
      title: newTitle,
      department: newDept,
      status: "Draft",
      type: "Full-Time",
      applicants: 0,
    };
    setJobs([...jobs, newJob]);
    setNewTitle("");
  };

  const toggleStatus = (id: string) => {
    setJobs(
      jobs.map((j) =>
        j.id === id
          ? { ...j, status: j.status === "Open" ? "Draft" : "Open" }
          : j
      )
    );
  };

  const deleteJob = (id: string) => {
    setJobs(jobs.filter((j) => j.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div>
        <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none">Job Openings</h1>
        <p className="text-[13px] text-slate-500 mt-1.5 font-medium">Publish and configure active job openings displayed on your public recruitment channels.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Jobs list table */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white border border-[#E2E8F0]/70 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-[13px] text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F0]/70 bg-slate-50/50 text-slate-400 uppercase tracking-wider font-bold text-[10px]">
                  <th className="py-3.5 px-6">Role Details</th>
                  <th className="py-3.5 px-6">Department</th>
                  <th className="py-3.5 px-6 text-center">Applicants</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]/40">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/20 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-800">{job.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 font-medium">{job.type}</div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-600">{job.department}</td>
                    <td className="py-4 px-6 text-center font-bold text-slate-700">{job.applicants}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleStatus(job.id)}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            job.status === "Open"
                              ? "bg-emerald-50 border-emerald-200 text-emerald-650"
                              : "bg-white border-slate-200 text-slate-400 hover:border-slate-350"
                          }`}
                          title={job.status === "Open" ? "Close Role" : "Open Role"}
                        >
                          {job.status === "Open" ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => deleteJob(job.id)}
                          className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-450 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add role form */}
        <div>
          <form onSubmit={handleAddJob} className="bg-white border border-[#E2E8F0]/70 p-5 rounded-2xl shadow-xs flex flex-col gap-4">
            <h3 className="text-[13px] font-semibold text-slate-800 tracking-tight">Create Job Posting</h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Job Title</label>
              <input
                type="text"
                placeholder="e.g. Lead Devops Architect"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-semibold text-slate-800"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Department</label>
              <select 
                value={newDept}
                onChange={(e) => setNewDept(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white font-semibold text-xs text-slate-800 outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer shadow-xs"
              >
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Operations">Operations</option>
              </select>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full py-2.5 mt-2 rounded-xl bg-[#059669] hover:bg-[#059669]/90 text-white font-bold text-xs shadow-xs active:scale-98 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Opening</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
