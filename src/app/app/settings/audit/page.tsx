"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  History,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  Zap,
  Check,
} from "lucide-react";

interface AuditEventItem {
  id: string;
  action: string;
  details?: string | null;
  ipAddress?: string | null;
  createdAt: string;
}

interface ApprovalItem {
  id: string;
  actionType: string;
  description: string;
  payload: string;
  status: "Pending" | "Approved" | "Denied";
  createdAt: string;
  decidedAt?: string | null;
}

export default function AuditSettingsPage() {
  const [auditEvents, setAuditEvents] = useState<AuditEventItem[]>([]);
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [auditRes, approvalsRes] = await Promise.all([
        fetch("/api/audit"),
        fetch("/api/approvals"),
      ]);
      const auditData = await auditRes.json();
      const approvalsData = await approvalsRes.json();

      if (auditData.auditEvents) setAuditEvents(auditData.auditEvents);
      if (approvalsData.approvals) setApprovals(approvalsData.approvals);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprovalDecision = async (approvalId: string, decision: "Approved" | "Denied") => {
    try {
      const res = await fetch(`/api/approvals/${approvalId}/decide`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });
      if (res.ok) {
        // Refresh data
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const pendingApprovals = approvals.filter((a) => a.status === "Pending");

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/app/settings"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 transition"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Security & Human Approvals Audit
          </h1>
          <p className="text-xs text-slate-500">
            Transparent record of all AI proposals, human approval decisions, logins, and workspace mutations.
          </p>
        </div>
      </div>

      {/* Human Approvals Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Human-in-the-Loop Approvals ({pendingApprovals.length} Pending)
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">
            Explicit confirmation prevents unauthorized AI mutations
          </span>
        </div>

        {approvals.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
            No approval requests recorded yet. When an agent proposes creating tasks or projects, they appear here.
          </div>
        ) : (
          <div className="space-y-3">
            {approvals.map((app) => (
              <div
                key={app.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] font-bold uppercase bg-white border border-slate-200 px-2 py-0.5 rounded">
                      {app.actionType}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        app.status === "Approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : app.status === "Denied"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-900"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800">{app.description}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Requested: {new Date(app.createdAt).toLocaleString()}
                    {app.decidedAt && ` • Decided: ${new Date(app.decidedAt).toLocaleTimeString()}`}
                  </span>
                </div>

                {app.status === "Pending" ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprovalDecision(app.id, "Denied")}
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition"
                    >
                      <XCircle className="h-3.5 w-3.5" /> Deny
                    </button>
                    <button
                      onClick={() => handleApprovalDecision(app.id, "Approved")}
                      className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs transition"
                    >
                      <Check className="h-3.5 w-3.5" /> Approve Action
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 font-medium">Logged in Audit</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Security Audit Events Trail */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <History className="h-5 w-5 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900">Immutable Audit Trail ({auditEvents.length})</h2>
        </div>

        {auditEvents.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
            No audit records found.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {auditEvents.map((event) => (
              <div key={event.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-slate-900 font-mono text-[11px]">
                      {event.action}
                    </span>
                  </div>
                  {event.details && <p className="text-slate-600 text-xs">{event.details}</p>}
                </div>
                <div className="text-right text-[10px] text-slate-400 flex-shrink-0">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(event.createdAt).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
