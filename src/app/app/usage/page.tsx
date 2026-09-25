"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  Bot,
  MessageSquare,
  FileText,
  FolderKanban,
  CheckSquare,
  AlertCircle,
  Loader2,
  Info,
  ShieldCheck,
  Cpu,
} from "lucide-react";

export default function UsagePage() {
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/usage")
      .then((res) => res.json())
      .then((data) => {
        if (data.plan) {
          setUsage(data);
        } else {
          setError(data.error?.message || "Failed to load usage");
        }
      })
      .catch(() => setError("Network error loading usage"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !usage) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-xs text-rose-700">
        <AlertCircle className="h-6 w-6 text-rose-600 mx-auto mb-2" />
        <span>{error || "Failed to fetch usage metrics"}</span>
      </div>
    );
  }

  const { stats, limits } = usage;
  const messagePct = Math.round((stats.totalMessages / stats.maxMessages) * 100);
  const filePct = Math.round((stats.totalFiles / stats.maxFiles) * 100);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Usage & Academic Quotas</h1>
        <p className="mt-1 text-sm text-slate-500">
          Monitor your workspace allocation, active specialized agents, and storage limits.
        </p>
      </div>

      {/* Mandatory MVP Non-Billing Notice Banner */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-sm font-bold text-amber-900">
              Billing is not active in this MVP.
            </h2>
            <p className="mt-1 text-xs text-amber-800 leading-relaxed">
              Vidya Sarthi is currently running in its free Mid-Viva Demonstration evaluation mode. 
              All six specialized AI agents, file upload tools, project tracking, and mock viva prep are completely free. 
              No payment processing or credit card activation is enabled.
            </p>
          </div>
        </div>
      </div>

      {/* Current Plan Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Active Tier</span>
            <h2 className="text-xl font-bold text-slate-900">{usage.plan}</h2>
            <p className="text-xs text-slate-500 mt-0.5">Academic Evaluation License</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
            <ShieldCheck className="h-4 w-4 text-emerald-600" /> Free Viva Access
          </span>
        </div>

        {/* Quota Progress Rows */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Agent Messages */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-indigo-600" /> Mentor Interactions
              </span>
              <span>
                {stats.totalMessages} / {stats.maxMessages}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">Total user messages exchanged with mentors</p>
            <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all"
                style={{ width: `${messagePct}%` }}
              />
            </div>
          </div>

          {/* Files Uploaded */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1">
              <span className="flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-blue-600" /> Study File Storage
              </span>
              <span>
                {stats.totalFiles} / {stats.maxFiles} files
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">Maximum file size: {limits.maxFileSizeMb}MB per document</p>
            <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{ width: `${filePct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* System Engine & Workspace Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Cpu className="h-4 w-4 text-indigo-600" />
            <span>AI Provider Configuration</span>
          </h2>
          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-medium text-slate-700">Active Provider</span>
              <span className="font-semibold text-indigo-700">{limits.activeProviders}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-medium text-slate-700">Specialized Mentors</span>
              <span>{stats.agentCount} Available</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-medium text-slate-700">Supported Uploads</span>
              <span>{limits.allowedFormats.join(", ")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-700">Database Engine</span>
              <span>SQLite + Prisma ORM</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-indigo-600" />
            <span>Workspace Overview</span>
          </h2>
          <div className="space-y-3 text-xs text-slate-600">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-medium text-slate-700">Academic Projects</span>
              <span>{stats.projectsCount} Active</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-medium text-slate-700">Tasks & Milestones</span>
              <span>{stats.tasksCount} Logged</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-700">Audit Events Logged</span>
              <span>Active in Real-Time</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
