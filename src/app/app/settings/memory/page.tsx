"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Brain,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from "lucide-react";

export default function MemorySettingsPage() {
  const [clearing, setClearing] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClearMemory = async () => {
    if (
      !confirm(
        "Are you sure you want to delete all conversation history across all 6 specialized agents? This cannot be undone."
      )
    ) {
      return;
    }

    setClearing(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/settings/memory", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message || "Failed to clear memory");
      } else {
        setSuccess(data.message || "All agent conversation memory has been cleared successfully.");
      }
    } catch {
      setError("Network error while clearing memory.");
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/app/settings"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 transition"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Agent Memory</h1>
          <p className="text-xs text-slate-500">
            Manage or purge stored conversation history across all specialized mentors.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Memory Status & Privacy Policy Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Brain className="h-5 w-5 text-purple-600" />
          <h2 className="text-sm font-bold text-slate-900">How Memory Operates in Vidya Sarthi</h2>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Vidya Sarthi stores conversation logs to provide contextual continuity when you consult mentors.
          In accordance with our privacy policy, conversations are strictly isolated to your student account
          and are never used for global model training without consent.
        </p>

        <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 text-xs text-slate-600 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-slate-700">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Privacy Guardrails Active:</span>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-500">
            <li>Zero cross-user data leakage</li>
            <li>No persistent vector embeddings stored in mid-viva version</li>
            <li>Complete permanent deletion available on-demand</li>
          </ul>
        </div>
      </div>

      {/* Clear Memory Action Card */}
      <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-6 shadow-sm">
        <div className="flex items-center gap-2 pb-2 text-rose-900 font-bold text-sm">
          <AlertTriangle className="h-4 w-4 text-rose-600" />
          <span>Purge All Conversation Memory</span>
        </div>
        <p className="text-xs text-rose-800 leading-relaxed mb-4">
          This will permanently delete all past discussions with Study Coach, Project Guide, Career Scout,
          Writing Buddy, Code Mentor, and Interview Coach. Your projects and tasks will not be affected.
        </p>

        <button
          onClick={handleClearMemory}
          disabled={clearing}
          className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700 transition disabled:opacity-50"
        >
          {clearing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Purging Agent Memory...</span>
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              <span>Clear All Chat History</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
