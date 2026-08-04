"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Briefcase, Eye, RefreshCw,
  Trash2, Plus, X, Edit3, ShieldAlert, ExternalLink, Search,
  ChevronDown, GitBranch, Layers, CheckCircle2
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  client_name: string | null;
  stage: string;
  progress: number;
  repo_url: string | null;
  dev_lead: string | null;
  status: string;
  industry: string | null;
  tech_stack: string[];
  features: string[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MILESTONE_STAGES = ["Discovery", "Planning", "Design", "Dev", "Deployment", "Support"];

const STAGE_COLORS: Record<string, { bar: string; text: string }> = {
  Discovery:  { bar: "bg-violet-500",  text: "text-violet-600" },
  Planning:   { bar: "bg-blue-500",    text: "text-blue-600" },
  Design:     { bar: "bg-indigo-500",  text: "text-indigo-600" },
  Dev:        { bar: "bg-amber-500",   text: "text-amber-600" },
  Deployment: { bar: "bg-orange-500",  text: "text-orange-600" },
  Support:    { bar: "bg-emerald-500", text: "text-emerald-600" },
};

const STATUS_CONFIG: Record<string, { label: string; dot: string; text: string; bg: string; border: string }> = {
  draft:     { label: "In Dev",    dot: "bg-amber-400",   text: "text-amber-700",   bg: "bg-amber-50",   border: "border-amber-200" },
  published: { label: "Live",      dot: "bg-emerald-400", text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  featured:  { label: "Featured",  dot: "bg-violet-400",  text: "text-violet-700",  bg: "bg-violet-50",  border: "border-violet-200" },
};

const inputCls = "w-full px-3 py-2 rounded-lg border border-slate-200 text-[12px] text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400 transition-all font-medium";

// ─── FormField sub-component ──────────────────────────────────────────────────

function FormField({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

// ─── ProjectCard sub-component ────────────────────────────────────────────────

function ProjectCard({
  project, onEdit, onDelete, onToggle
}: {
  project: ProjectItem;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const statusCfg  = STATUS_CONFIG[project.status] || STATUS_CONFIG.draft;
  const currentIdx = MILESTONE_STAGES.indexOf(project.stage);
  const stageClr   = STAGE_COLORS[project.stage] || { bar: "bg-slate-400", text: "text-slate-600" };

  return (
    <div className={`bg-white border rounded-2xl overflow-hidden shadow-sm transition-all ${
      project.status === "published" ? "border-emerald-200/70" : "border-slate-200/80"
    }`}>

      {/* Colored stage strip */}
      <div className={`h-0.5 w-full ${stageClr.bar}`} />

      {/* Card body */}
      <div className="p-4 flex flex-col gap-3">

        {/* Row 1: Icon + Title + Status */}
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            project.status === "published" ? "bg-emerald-50 border border-emerald-100" : "bg-slate-50 border border-slate-200"
          }`}>
            <Briefcase className={`w-4 h-4 ${project.status === "published" ? "text-emerald-600" : "text-slate-500"}`} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 flex-wrap">
              <h3 className="text-[13px] font-bold text-slate-900 tracking-tight leading-snug">{project.title}</h3>
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wide shrink-0 ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusCfg.dot}`} />
                {statusCfg.label}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wide truncate">
              {project.client_name || "Internal"}{project.industry ? ` · ${project.industry}` : ""}
            </p>
          </div>
        </div>

        {/* Row 2: Milestone pipeline */}
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">
            {MILESTONE_STAGES.map((step, idx) => {
              const done    = idx < currentIdx;
              const current = idx === currentIdx;
              return (
                <div
                  key={step}
                  title={step}
                  className={`flex-1 h-1.5 rounded-full transition-all ${
                    done ? "bg-emerald-400" : current ? stageClr.bar : "bg-slate-100"
                  }`}
                />
              );
            })}
          </div>
          <div className="flex">
            {MILESTONE_STAGES.map((step, idx) => (
              <div key={step} className={`flex-1 text-center text-[7px] font-bold uppercase tracking-wide ${
                idx === currentIdx ? "text-slate-700" : "text-slate-300"
              }`}>
                {step.substring(0, 3)}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-0.5">
            <span className={`text-[10px] font-bold ${stageClr.text}`}>Stage: {project.stage}</span>
            <span className="text-[10px] font-semibold text-slate-400">{project.progress}% complete</span>
          </div>
        </div>

        {/* Row 3: Dev lead + Repo */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <GitBranch className="w-3 h-3 text-slate-400 shrink-0" />
            <span>
              <span className="text-slate-400">Lead: </span>
              <span className="font-bold text-slate-700">{project.dev_lead || "Unassigned"}</span>
            </span>
          </div>
          {project.repo_url && (
            <a
              href={project.repo_url.startsWith("http") ? project.repo_url : `https://${project.repo_url}`}
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 max-w-[160px] truncate"
            >
              <ExternalLink className="w-3 h-3 shrink-0" />
              <span className="truncate">{project.repo_url.replace(/^https?:\/\//, "")}</span>
            </a>
          )}
        </div>

        {/* Row 4: Tech stack */}
        {project.tech_stack?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.tech_stack.slice(0, 5).map(tech => (
              <span key={tech} className="px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-[8px] font-bold text-slate-600 uppercase tracking-wide">
                {tech}
              </span>
            ))}
            {project.tech_stack.length > 5 && (
              <span className="px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-[8px] font-bold text-slate-400">
                +{project.tech_stack.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Expandable section */}
        {expanded && (
          <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 animate-fade-in">
            {project.description && (
              <p className="text-[11px] text-slate-500 leading-relaxed">{project.description}</p>
            )}
            {project.features?.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Features</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {project.features.map(feat => (
                    <div key={feat} className="flex items-center gap-1.5 text-[10px] text-slate-600">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action tray */}
      <div className="flex border-t border-slate-100 divide-x divide-slate-100">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] font-bold text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
          {expanded ? "Collapse" : "Details"}
        </button>
        <button
          onClick={onToggle}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] font-bold transition-colors cursor-pointer hover:bg-slate-50 ${
            project.status === "published" ? "text-emerald-600" : "text-slate-500"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          {project.status === "published" ? "Showcased" : "Showcase"}
        </button>
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] font-bold text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-3.5 flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProjectsPage() {
  const [projects, setProjects]           = useState<ProjectItem[]>([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState("");
  const [isEditing, setIsEditing]         = useState(false);
  const [isCreating, setIsCreating]       = useState(false);
  const [selectedProject, setSelected]   = useState<ProjectItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form fields
  const [title, setTitle]               = useState("");
  const [clientName, setClientName]     = useState("");
  const [description, setDescription]   = useState("");
  const [industry, setIndustry]         = useState("Technology");
  const [stage, setStage]               = useState("Discovery");
  const [progress, setProgress]         = useState(0);
  const [repoUrl, setRepoUrl]           = useState("");
  const [devLead, setDevLead]           = useState("");
  const [status, setStatus]             = useState("draft");
  const [techStackInput, setTechStack]  = useState("");
  const [featuresInput, setFeatures]    = useState("");

  // Filter state
  const [searchQuery, setSearchQuery]   = useState("");
  const [stageFilter, setStageFilter]   = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filtersOpen, setFiltersOpen]   = useState(false);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q ||
        p.title.toLowerCase().includes(q) ||
        (p.client_name?.toLowerCase().includes(q)) ||
        (p.dev_lead?.toLowerCase().includes(q));
      const matchStage  = stageFilter  === "all" || p.stage  === stageFilter;
      const matchStatus = statusFilter === "all" || p.status === statusFilter;
      return matchSearch && matchStage && matchStatus;
    });
  }, [projects, searchQuery, stageFilter, statusFilter]);

  const getToken = () => localStorage.getItem("novaryn_admin_token");
  const apiBase  = () => process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  const fetchProjects = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${apiBase()}/projects`, {
        headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
      });
      if (res.status === 401) { window.location.href = "/login"; return; }
      if (!res.ok) throw new Error("Unable to retrieve project records.");
      const json = await res.json();
      setProjects(json.data || []);
    } catch (e: any) {
      setError(e.message || "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const openCreate = () => {
    setSelected(null); setIsCreating(true); setIsEditing(false);
    setTitle(""); setClientName(""); setDescription(""); setIndustry("Technology");
    setStage("Discovery"); setProgress(0); setRepoUrl(""); setDevLead("");
    setStatus("draft"); setTechStack(""); setFeatures("");
  };

  const openEdit = (p: ProjectItem) => {
    setSelected(p); setIsEditing(true); setIsCreating(false);
    setTitle(p.title); setClientName(p.client_name || "");
    setDescription(p.description || ""); setIndustry(p.industry || "Technology");
    setStage(p.stage || "Discovery"); setProgress(p.progress || 0);
    setRepoUrl(p.repo_url || ""); setDevLead(p.dev_lead || "");
    setStatus(p.status || "draft");
    setTechStack(p.tech_stack?.join(", ") || "");
    setFeatures(p.features?.join(", ") || "");
  };

  const closeForm = () => { setIsEditing(false); setIsCreating(false); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setActionLoading(true);
    const payload = {
      title, client_name: clientName || null, description: description || null,
      industry: industry || "Technology", stage,
      progress: parseInt(progress as any, 10) || 0,
      repo_url: repoUrl || null, dev_lead: devLead || null, status,
      tech_stack: techStackInput ? techStackInput.split(",").map(t => t.trim()).filter(Boolean) : [],
      features: featuresInput ? featuresInput.split(",").map(f => f.trim()).filter(Boolean) : [],
    };
    try {
      const url    = isCreating ? `${apiBase()}/projects` : `${apiBase()}/projects/${selectedProject?.id}`;
      const method = isCreating ? "POST" : "PUT";
      const res    = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { const j = await res.json(); throw new Error(j.message || "Save failed."); }
      closeForm(); fetchProjects();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Archive this project? All milestones will be removed.")) return;
    try {
      const res = await fetch(`${apiBase()}/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Unable to delete.");
      fetchProjects();
    } catch (e: any) { alert(e.message); }
  };

  const handleToggle = async (p: ProjectItem) => {
    const nextStatus = p.status === "published" ? "draft" : "published";
    try {
      const res = await fetch(`${apiBase()}/projects/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}`, Accept: "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error("Toggle failed.");
      fetchProjects();
    } catch (e: any) { alert(e.message); }
  };

  if (loading && projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <RefreshCw className="w-7 h-7 text-emerald-500 animate-spin" />
        <p className="text-[12px] text-slate-400 font-medium">Loading project builds...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 pb-24">

      {/* Page Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <Briefcase className="w-4 h-4 text-emerald-500 shrink-0" />
            <h1 className="text-[17px] font-bold text-slate-900 tracking-tight">Active Projects</h1>
          </div>
          <p className="text-[11px] text-slate-400 font-medium leading-snug">
            Milestones, repositories &amp; portfolio showcases.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={fetchProjects}
            className="p-2 border border-slate-200 bg-white rounded-xl text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Sync"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-3.5 text-[11px] text-red-700 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Search + Filters */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-slate-100">
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search projects, clients, leads..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 text-[12px] font-medium text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
          />
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer shrink-0 ${
              filtersOpen || stageFilter !== "all" || statusFilter !== "all"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : "bg-slate-50 text-slate-500 border border-slate-200"
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Filter</span>
            {(stageFilter !== "all" || statusFilter !== "all") && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-0.5" />
            )}
          </button>
        </div>
        {filtersOpen && (
          <div className="flex gap-2 px-3 py-2.5 bg-slate-50/60 flex-wrap border-t border-slate-100">
            <select
              value={stageFilter}
              onChange={e => setStageFilter(e.target.value)}
              className="flex-1 min-w-[130px] px-2.5 py-1.5 border border-slate-200 bg-white rounded-lg text-[11px] font-semibold text-slate-700 cursor-pointer focus:outline-none"
            >
              <option value="all">All Stages</option>
              {MILESTONE_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="flex-1 min-w-[130px] px-2.5 py-1.5 border border-slate-200 bg-white rounded-lg text-[11px] font-semibold text-slate-700 cursor-pointer focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="draft">In Development</option>
              <option value="published">Showcase Live</option>
              <option value="featured">Featured</option>
            </select>
            {(stageFilter !== "all" || statusFilter !== "all") && (
              <button
                onClick={() => { setStageFilter("all"); setStatusFilter("all"); }}
                className="px-2.5 py-1.5 border border-red-100 bg-white text-red-500 rounded-lg text-[11px] font-semibold hover:bg-red-50 transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* Count */}
      <div className="flex items-center justify-between px-0.5">
        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">
          {filteredProjects.length} Project{filteredProjects.length !== 1 ? "s" : ""}
        </p>
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="text-[10px] text-emerald-600 font-bold cursor-pointer hover:underline">
            Clear search
          </button>
        )}
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3">
        {filteredProjects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            onEdit={() => openEdit(project)}
            onDelete={() => handleDelete(project.id)}
            onToggle={() => handleToggle(project)}
          />
        ))}
        {filteredProjects.length === 0 && !loading && (
          <div className="py-16 bg-white border border-slate-200 rounded-2xl text-center flex flex-col items-center gap-2.5">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-[12px] font-semibold text-slate-400">No projects match your filters.</p>
            <button
              onClick={() => { setSearchQuery(""); setStageFilter("all"); setStatusFilter("all"); }}
              className="text-[11px] text-emerald-600 font-bold cursor-pointer hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Editor — bottom sheet on mobile, centered modal on desktop */}
      {(isEditing || isCreating) && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50" onClick={closeForm} />
          <div className="fixed inset-x-0 bottom-0 sm:inset-0 z-[60] sm:flex sm:items-center sm:justify-center sm:p-4">
            <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl border-t sm:border border-slate-200 shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh] animate-slide-up sm:animate-none sm:animate-scale-up">

              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 bg-slate-200 rounded-full" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div>
                  <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">
                    {isCreating ? "New Project" : "Edit Project"}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {isCreating ? "Bootstrap a new active development pipeline." : `Updating: ${title}`}
                  </p>
                </div>
                <button onClick={closeForm} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable form */}
              <div className="flex-1 overflow-y-auto no-scrollbar">
                <form onSubmit={handleSave} className="flex flex-col gap-4 p-5 text-[12px]">

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField label="Project Title" required>
                      <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="PaddleYard E-Commerce" className={inputCls} />
                    </FormField>
                    <FormField label="Client Name">
                      <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="PaddleYard Sports Club" className={inputCls} />
                    </FormField>
                  </div>

                  <FormField label="Description">
                    <textarea rows={2} value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the system scope and modules..." className={`${inputCls} resize-none`} />
                  </FormField>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField label="Industry / Sector">
                      <input type="text" value={industry} onChange={e => setIndustry(e.target.value)} placeholder="Sports, Retail, Health..." className={inputCls} />
                    </FormField>
                    <FormField label="Dev Lead">
                      <input type="text" value={devLead} onChange={e => setDevLead(e.target.value)} placeholder="Alexander Reyes" className={inputCls} />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField label="Milestone Stage">
                      <select value={stage} onChange={e => setStage(e.target.value)} className={`${inputCls} bg-white cursor-pointer`}>
                        {MILESTONE_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </FormField>
                    <FormField label={`Progress — ${progress}%`}>
                      <div className="flex flex-col gap-1.5 pt-1">
                        <input type="range" min="0" max="100" step="5" value={progress} onChange={e => setProgress(parseInt(e.target.value, 10))} className="w-full accent-emerald-600" />
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${progress}%` }} />
                        </div>
                      </div>
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormField label="Repository URL">
                      <input type="text" value={repoUrl} onChange={e => setRepoUrl(e.target.value)} placeholder="github.com/novaryn/repo" className={`${inputCls} font-mono`} />
                    </FormField>
                    <FormField label="Showcase Status">
                      <select value={status} onChange={e => setStatus(e.target.value)} className={`${inputCls} bg-white cursor-pointer`}>
                        <option value="draft">In Development (Draft)</option>
                        <option value="published">Showcase Live (Published)</option>
                        <option value="featured">Featured Hero</option>
                      </select>
                    </FormField>
                  </div>

                  <FormField label="Tech Stack (comma separated)">
                    <input type="text" value={techStackInput} onChange={e => setTechStack(e.target.value)} placeholder="React, Next.js, Laravel, PostgreSQL" className={inputCls} />
                  </FormField>

                  <FormField label="Key Features (comma separated)">
                    <input type="text" value={featuresInput} onChange={e => setFeatures(e.target.value)} placeholder="GCash Integration, RFID Access, Scheduler" className={inputCls} />
                  </FormField>

                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-[12px] shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {actionLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                    {isCreating ? "Create Project" : "Save Changes"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
