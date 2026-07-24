"use client";

import React, { useState, useEffect } from "react";
import { Database, RefreshCw } from "lucide-react";

interface AuditLogItem {
  id: string;
  action: string;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  user?: {
    name: string;
    email: string;
  };
}

export default function LogsPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    setLoading(true);
    const token = localStorage.getItem("novaryn_admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    try {
      const res = await fetch(`${apiUrl}/system/audit-logs`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      const data = await res.json();
      if (res.ok) {
        setAuditLogs(data.data.data || data.data);
      }
    } catch (err) {
      console.error("Error fetching logs:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none">Audit Logs</h1>
          <p className="text-[13px] text-slate-500 mt-1.5 font-medium">Trace logs logging administrator actions, status changes, and settings modifications.</p>
        </div>
        <button
          onClick={fetchAuditLogs}
          disabled={loading}
          className="flex items-center gap-2 bg-[#059669] hover:bg-[#059669]/90 text-white font-semibold text-[13px] h-9 px-4 rounded-lg transition-all shadow-xs cursor-pointer select-none"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Sync Logs</span>
        </button>
      </div>

      {/* Audit table card */}
      <div className="bg-white border border-[#E2E8F0]/70 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0]/70 bg-slate-50/50 text-slate-400 uppercase tracking-wider font-bold text-[10px]">
                <th className="py-3.5 px-6">Timestamp</th>
                <th className="py-3.5 px-6">Administrator</th>
                <th className="py-3.5 px-6">Trigger Event</th>
                <th className="py-3.5 px-6">Network details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]/40">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/20 transition-colors">
                  {/* Timestamp */}
                  <td className="py-4 px-6 text-slate-500 font-semibold font-mono text-[12px]">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  
                  {/* Admin User */}
                  <td className="py-4 px-6">
                    <div className="font-semibold text-slate-800">{log.user?.name || "System Automated"}</div>
                    <div className="text-[11px] text-slate-400 font-medium mt-0.5">{log.user?.email || "api@novaryn.tech"}</div>
                  </td>
                  
                  {/* Action tag */}
                  <td className="py-4 px-6">
                    <span className="inline-block text-[10px] font-bold tracking-wider px-2 py-0.5 rounded bg-slate-50 border border-slate-200/50 text-slate-600 font-mono">
                      {log.action}
                    </span>
                  </td>
                  
                  {/* Network parameters */}
                  <td className="py-4 px-6 text-slate-450 font-semibold leading-normal">
                    <div className="text-slate-600">IP: {log.ip_address || "127.0.0.1"}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-xs font-medium mt-0.5" title={log.user_agent || ""}>
                      {log.user_agent || "CLI Trigger"}
                    </div>
                  </td>
                </tr>
              ))}
              {auditLogs.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-slate-400 font-semibold">
                    No system log records logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
