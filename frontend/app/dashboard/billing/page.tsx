"use client";

import React, { useState } from "react";
import { DollarSign, FileText, CheckCircle, RefreshCw } from "lucide-react";

interface InvoiceItem {
  id: string;
  client: string;
  type: "Setup Fee" | "Monthly License" | "Module Upsell";
  amount: number;
  dueDate: string;
  status: "Paid" | "Pending" | "Overdue";
}

const mockInvoices: InvoiceItem[] = [
  { id: "INV-2026-001", client: "PaddleYard Sports Club", type: "Setup Fee", amount: 175000, dueDate: "June 15, 2026", status: "Paid" },
  { id: "INV-2026-002", client: "PaddleYard Sports Club", type: "Monthly License", amount: 15000, dueDate: "July 1, 2026", status: "Paid" },
  { id: "INV-2026-003", client: "ActiveSports Gyms", type: "Setup Fee", amount: 75000, dueDate: "July 28, 2026", status: "Pending" },
  { id: "INV-2026-004", client: "Bistro Group PH", type: "Setup Fee", amount: 550000, dueDate: "August 10, 2026", status: "Pending" },
  { id: "INV-2026-005", client: "PaddleYard Sports Club", type: "Module Upsell", amount: 80000, dueDate: "July 10, 2026", status: "Paid" },
];

export default function BillingPage() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>(mockInvoices);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-50 text-emerald-700 border border-emerald-100/50";
      case "Pending":
        return "bg-amber-50 text-amber-700 border border-amber-100/50";
      default:
        return "bg-red-50 text-red-700 border border-red-100/50";
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      <div>
        <h1 className="text-[20px] font-semibold text-slate-900 tracking-tight leading-none">Billing Ledger</h1>
        <p className="text-[13px] text-slate-500 mt-1.5 font-medium">Review invoices, track recurring license billing cycles, and trace GCash/PayMaya transactions.</p>
      </div>

      {/* Invoice list card */}
      <div className="bg-white border border-[#E2E8F0]/70 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0]/70 bg-slate-50/50 text-slate-400 uppercase tracking-wider font-bold text-[10px]">
                <th className="py-3.5 px-6">Invoice ID</th>
                <th className="py-3.5 px-6">Client Installation</th>
                <th className="py-3.5 px-6">Billing Type</th>
                <th className="py-3.5 px-6">Amount</th>
                <th className="py-3.5 px-6">Due Date</th>
                <th className="py-3.5 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]/40">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/20 transition-colors">
                  <td className="py-4 px-6 font-semibold font-mono text-slate-700">{inv.id}</td>
                  <td className="py-4 px-6 font-semibold text-slate-800">{inv.client}</td>
                  <td className="py-4 px-6">
                    <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 bg-slate-50 border border-slate-200/50 text-slate-500 uppercase rounded">
                      {inv.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-800">₱{inv.amount.toLocaleString()}</td>
                  <td className="py-4 px-6 text-slate-550 font-semibold">{inv.dueDate}</td>
                  <td className="py-4 px-6 text-right">
                    <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${getStatusClass(inv.status)}`}>
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
