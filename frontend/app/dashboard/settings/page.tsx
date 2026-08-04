"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  User, Key, RefreshCw, Check, ShieldAlert, Plus, X, ShieldCheck, Upload, Trash2
} from "lucide-react";

interface EmployeeItem {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "developer" | "sales" | "marketing";
  profile_picture: string | null;
  deleted_at: string | null;
}

const ROLE_TITLES: Record<string, string> = {
  super_admin: "Co-Founder & CEO",
  admin: "Co-Founder & COO",
  developer: "CTO & Lead Developer",
  sales: "Sales & Business Dev",
  marketing: "Marketing & Relations",
};

const ROLE_LABEL: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  developer: "Developer",
  sales: "Sales",
  marketing: "Marketing",
};

const ROLE_COLOR: Record<string, string> = {
  super_admin: "bg-emerald-50 text-emerald-800 border-emerald-100",
  admin: "bg-slate-100 text-slate-800 border-slate-200",
  developer: "bg-indigo-50 text-indigo-800 border-indigo-100",
  sales: "bg-amber-50 text-amber-800 border-amber-100",
  marketing: "bg-rose-50 text-rose-800 border-rose-100",
};

const ACCESS_MATRIX = [
  {
    role: "super_admin",
    dot: "bg-emerald-600",
    pages: [
      "Overview Dashboard — all KPIs, charts, and donut margin graphs",
      "Leads Manager — full create, edit, status-change, and delete",
      "Consultations Scheduler — manage all appointments",
      "Contract Builder — generate and export proposals",
      "Pricing Engine — configure modules and SLA retainers",
      "Active Projects — milestone tracking and repo links",
      "Project Costing — VPS / DB node expense configuration",
      "Gross Income — full MRR and YTD inflow analytics",
      "Billing Ledger — settle invoices and manage payment status",
      "Settings Console — profile, Team Directory, and Access Matrix",
      "System Audit Logs — full event trail of all users",
    ],
  },
  {
    role: "admin",
    dot: "bg-slate-900",
    pages: [
      "Overview Dashboard — operational KPIs only (no financials)",
      "Leads Manager — create, edit, and update lead status",
      "Consultations Scheduler — manage appointments and bookings",
      "Contract Builder — compose and export proposals",
      "Pricing Engine — read-only calculator access",
      "Active Projects — view milestones and dev progress",
      "Project Costing — read-only VPS cost overview",
      "Settings Console — personal profile only",
    ],
  },
  {
    role: "developer",
    dot: "bg-indigo-600",
    pages: [
      "Overview Dashboard — project delivery KPIs only",
      "Active Projects — full milestone updates and repo link edits",
      "Project Costing — configure VPS nodes and DB fees",
      "Pricing Engine — module build complexity configurations",
      "Settings Console — personal profile only",
    ],
  },
  {
    role: "sales",
    dot: "bg-amber-500",
    pages: [
      "Leads Manager — full CRM pipeline and deal tracking",
      "Consultations Scheduler — book and manage client meetings",
      "Contract Builder — compose and send proposal documents",
      "Pricing Engine — generate client quotations and estimates",
      "Billing Ledger — settle invoices and log new billing items",
      "Settings Console — personal profile only",
    ],
  },
  {
    role: "marketing",
    dot: "bg-rose-500",
    pages: [
      "Overview Dashboard — public traffic and lead conversion KPIs",
      "Leads Manager — view and add incoming lead entries",
      "Settings Console — personal profile only",
    ],
  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "team" | "matrix">("profile");
  const [loading, setLoading] = useState(false);
  const [teamLoading, setTeamLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Profile state
  const [nickname, setNickname] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Team state
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", email: "", password: "", role: "sales" as EmployeeItem["role"] });
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
  const getToken = () => localStorage.getItem("novaryn_admin_token");

  useEffect(() => {
    // First populate from localStorage for immediate display
    const savedUser = localStorage.getItem("novaryn_admin_user");
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        setNickname(u.name || "");
        setCurrentUserRole(u.role || "");
        setCurrentAvatarUrl(u.profile_picture || null);
      } catch {}
    }

    // Then re-fetch fresh profile from API to sync corrected URLs
    const token = localStorage.getItem("novaryn_admin_token");
    if (!token) return;
    fetch(`${apiUrl}/auth/me`, {
      headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
    })
      .then(r => r.json())
      .then(json => {
        if (json.user) {
          setNickname(json.user.name || "");
          setCurrentUserRole(json.user.role || "");
          setCurrentAvatarUrl(json.user.profile_picture || null);
          // Update localStorage with fresh data
          localStorage.setItem("novaryn_admin_user", JSON.stringify(json.user));
          window.dispatchEvent(new Event("storage"));
        }
      })
      .catch(() => {});
  }, [apiUrl]);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const fetchEmployees = useCallback(async () => {
    if (currentUserRole !== "super_admin") return;
    setTeamLoading(true);
    setError("");
    try {
      const res = await fetch(`${apiUrl}/auth/users`, {
        headers: { "Authorization": `Bearer ${getToken()}`, "Accept": "application/json" }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to load team roster.");
      setEmployees(json.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setTeamLoading(false);
    }
  }, [currentUserRole, apiUrl]);

  useEffect(() => {
    if (activeTab === "team") fetchEmployees();
  }, [activeTab, fetchEmployees]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (password && password !== passwordConfirmation) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password && !oldPassword) {
      setError("Please enter your current password to set a new one.");
      setLoading(false);
      return;
    }

    try {
      // Use FormData to support file upload
      const formData = new FormData();
      formData.append("name", nickname);
      if (password) {
        formData.append("old_password", oldPassword);
        formData.append("password", password);
        formData.append("password_confirmation", passwordConfirmation);
      }
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      // Laravel needs _method for PUT via FormData
      formData.append("_method", "PUT");

      const res = await fetch(`${apiUrl}/auth/profile`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${getToken()}`,
          "Accept": "application/json",
          // Note: Do NOT set Content-Type when using FormData — browser sets it with boundary
        },
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to update profile.");

      localStorage.setItem("novaryn_admin_user", JSON.stringify(json.user));
      setCurrentAvatarUrl(json.user.profile_picture);
      setAvatarFile(null);
      setAvatarPreview(null);
      setOldPassword("");
      setPassword("");
      setPasswordConfirmation("");
      setSuccess("Profile updated successfully.");
      window.dispatchEvent(new Event("storage"));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/auth/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`,
          "Accept": "application/json"
        },
        body: JSON.stringify(newMember)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to add employee.");
      setIsAddingMember(false);
      setNewMember({ name: "", email: "", password: "", role: "sales" });
      fetchEmployees();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmployeeRow = async (emp: EmployeeItem, nextRole: string, nextStatus: string) => {
    setActionLoadingId(emp.id);
    try {
      const res = await fetch(`${apiUrl}/auth/users/${emp.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`,
          "Accept": "application/json"
        },
        body: JSON.stringify({ role: nextRole, status: nextStatus })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to update employee.");
      setEmployees(prev => prev.map(item =>
        item.id === emp.id
          ? { ...item, role: nextRole as any, deleted_at: nextStatus === "inactive" ? new Date().toISOString() : null }
          : item
      ));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteEmployee = async (emp: EmployeeItem) => {
    const confirmed = window.confirm(
      `Permanently delete "${emp.name}" (${emp.email})?\n\nThis action cannot be undone. The account will be removed from all records.`
    );
    if (!confirmed) return;
    setActionLoadingId(emp.id);
    try {
      const res = await fetch(`${apiUrl}/auth/users/${emp.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${getToken()}`,
          "Accept": "application/json"
        }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to delete account.");
      setEmployees(prev => prev.filter(item => item.id !== emp.id));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const displayAvatar = avatarPreview || currentAvatarUrl;

  return (
    <div className="flex flex-col gap-6 text-left font-sans pb-12">

      {/* Page header */}
      <div>
        <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none">Settings Console</h1>
        <p className="text-[13px] text-slate-500 mt-1.5 font-medium">Manage your profile, coordinate team roles, and review system access boundaries.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-3.5 text-xs text-red-800 flex items-start gap-2.5 max-w-4xl">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 text-xs text-emerald-800 flex items-start gap-2.5 max-w-4xl">
          <Check className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* Tab bar */}
      <div className="flex border-b border-slate-100 gap-0">
        {(["profile", currentUserRole === "super_admin" ? "team" : null, "matrix"] as const).map(tab => {
          if (!tab) return null;
          const labels: Record<string, string> = { profile: "My Profile", team: "Team Directory", matrix: "Access Matrix" };
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-5 py-3.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === tab ? "border-emerald-500 text-emerald-700" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: MY PROFILE ── */}
      {activeTab === "profile" && (
        <form onSubmit={handleUpdateProfile} className="bg-white border border-slate-200 p-7 rounded-2xl shadow-xs flex flex-col gap-7 max-w-2xl">

          {/* Avatar Upload */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" /> Profile Photo
            </h3>
            <div className="flex items-center gap-5">
              {/* Avatar circle preview */}
              <div
                className="w-16 h-16 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden bg-slate-50 cursor-pointer hover:border-emerald-400 transition-colors shrink-0 relative group"
                onClick={() => fileInputRef.current?.click()}
              >
                {displayAvatar ? (
                  <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-emerald-700">{nickname?.charAt(0) || "?"}</span>
                )}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <Upload className="w-4 h-4 text-white" />
                </div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarFileChange} className="hidden" />
              <div className="text-left">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-all"
                >
                  {avatarFile ? "Change Photo" : "Upload Photo"}
                </button>
                {avatarFile && (
                  <p className="text-[10px] text-emerald-700 font-semibold mt-1.5">{avatarFile.name} selected — save to apply</p>
                )}
                <p className="text-[10px] text-slate-400 font-semibold mt-1 leading-snug">JPG, PNG or WebP • Max 4 MB</p>
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-slate-100" />

          {/* Nickname */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Personal Details
            </h3>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Username / Nickname</label>
              <input
                type="text"
                required
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. Super Admin"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="h-[1px] bg-slate-100" />

          {/* Password */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" /> Update Password
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Current Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Your current password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 self-end rounded-xl bg-slate-900 hover:bg-slate-700 text-white font-bold text-xs shadow-md active:scale-98 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            Save Profile Settings
          </button>
        </form>
      )}

      {/* ── TAB 2: TEAM DIRECTORY ── */}
      {activeTab === "team" && currentUserRole === "super_admin" && (
        <div className="flex flex-col gap-5">
          <div className="flex justify-between items-center bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Novaryn Employee Roster</h3>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">CEO controls: manage roles, recruit team members, and suspend logins.</p>
            </div>
            <button
              onClick={() => setIsAddingMember(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-700 text-white font-bold text-[11px] rounded-xl transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Team Member
            </button>
          </div>

          {teamLoading ? (
            <div className="flex items-center justify-center py-16 gap-3">
              <RefreshCw className="w-6 h-6 text-emerald-500 animate-spin" />
              <span className="text-xs text-slate-500">Syncing team directory...</span>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-slate-400 uppercase tracking-wider font-bold text-[9px]">
                    <th className="py-3 px-6">Name</th>
                    <th className="py-3 px-6">Email</th>
                    <th className="py-3 px-6">Role</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-center">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employees.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-xs text-slate-400 font-semibold">No team members found.</td>
                    </tr>
                  )}
                  {employees.map((emp) => {
                    const isSuspended = emp.deleted_at !== null;
                    return (
                      <tr key={emp.id} className={`hover:bg-slate-50/40 transition-colors ${isSuspended ? "opacity-50" : ""}`}>
                        <td className="py-3.5 px-6 font-bold text-slate-800 text-xs">
                          <div className="flex items-center gap-2.5">
                            {emp.profile_picture ? (
                              <img src={emp.profile_picture} alt="" className="w-7 h-7 rounded-full object-cover border border-slate-100 shrink-0" />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs shrink-0">
                                {emp.name.charAt(0)}
                              </div>
                            )}
                            <span>{emp.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-6 font-medium text-slate-500 text-xs">{emp.email}</td>
                        <td className="py-3.5 px-6">
                          <select
                            value={emp.role}
                            onChange={(e) => handleUpdateEmployeeRow(emp, e.target.value, isSuspended ? "inactive" : "active")}
                            disabled={actionLoadingId === emp.id}
                            className="px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                          >
                            {Object.entries(ROLE_TITLES).map(([key, label]) => (
                              <option key={key} value={key}>{label}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3.5 px-6">
                          <select
                            value={isSuspended ? "inactive" : "active"}
                            onChange={(e) => handleUpdateEmployeeRow(emp, emp.role, e.target.value)}
                            disabled={actionLoadingId === emp.id}
                            className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase border focus:outline-none cursor-pointer ${
                              isSuspended ? "bg-red-50 text-red-800 border-red-100" : "bg-emerald-50 text-emerald-800 border-emerald-100"
                            }`}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Suspended</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {actionLoadingId === emp.id
                              ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-400" />
                              : (
                                <button
                                  onClick={() => handleDeleteEmployee(emp)}
                                  title="Permanently delete this account"
                                  className="p-1.5 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )
                            }
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── TAB 3: ACCESS MATRIX ── */}
      {activeTab === "matrix" && (
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-800">Corporate Authorization Matrix</h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Pages and features accessible per employee role.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ACCESS_MATRIX.map((entry) => (
              <div key={entry.role} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${entry.dot}`} />
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{ROLE_TITLES[entry.role]}</h4>
                    <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border mt-0.5 inline-block ${ROLE_COLOR[entry.role]}`}>
                      {ROLE_LABEL[entry.role]}
                    </span>
                  </div>
                </div>
                <div className="h-[1px] bg-slate-100" />
                <ul className="flex flex-col gap-1.5">
                  {entry.pages.map((page) => (
                    <li key={page} className="flex items-start gap-1.5 text-[11px] text-slate-600 font-medium leading-snug">
                      <Check className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" strokeWidth={3} />
                      <span>{page}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ADD MEMBER MODAL ── */}
      {isAddingMember && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
          <div className="bg-white w-full max-w-md rounded-3xl border border-slate-150 p-6 shadow-2xl relative text-left">
            <button onClick={() => setIsAddingMember(false)} className="absolute top-5 right-5 p-1 rounded-full hover:bg-slate-100 cursor-pointer">
              <X className="w-4 h-4 text-slate-400" />
            </button>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <Plus className="w-5 h-5" /> Register Team Member
            </h3>
            <p className="text-xs text-slate-400 mt-1 mb-5">Create a login account for a Novaryn employee.</p>

            <form onSubmit={handleAddTeamMember} className="flex flex-col gap-4">
              {[
                { label: "Full Name", field: "name", type: "text", placeholder: "e.g. John Dela Cruz" },
                { label: "Corporate Email", field: "email", type: "email", placeholder: "e.g. john@novaryn.tech" },
                { label: "Initial Password", field: "password", type: "password", placeholder: "Min. 8 characters" },
              ].map(({ label, field, type, placeholder }) => (
                <div key={field} className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</label>
                  <input
                    type={type}
                    required
                    value={(newMember as any)[field]}
                    onChange={(e) => setNewMember({ ...newMember, [field]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              ))}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Role Assignment</label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value as any })}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {Object.entries(ROLE_TITLES).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-2 rounded-xl bg-slate-900 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5 transition-all"
              >
                {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                Register Team Member
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
