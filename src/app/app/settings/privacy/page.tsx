"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Shield,
  Download,
  Trash2,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function PrivacySettingsPage() {
  const router = useRouter();
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleExportData = async () => {
    setExporting(true);
    setError(null);

    try {
      const res = await fetch("/api/settings/export");
      if (!res.ok) {
        setError("Failed to export data");
        setExporting(false);
        return;
      }

      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vidya-sarthi-export-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setError("Network error while exporting data");
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      setError("Please type DELETE to confirm account removal.");
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      const res = await fetch("/api/settings/delete-account", {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error?.message || "Failed to delete account");
        setDeleting(false);
        return;
      }

      // Success -> Redirect to landing page
      router.push("/");
      router.refresh();
    } catch {
      setError("Network error during account deletion.");
      setDeleting(false);
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
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Privacy & Data Controls
          </h1>
          <p className="text-xs text-slate-500">
            Export personal records or manage permanent account deletion.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
          {error}
        </div>
      )}

      {/* Data Export Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Download className="h-5 w-5 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900">Download Personal Workspace Data</h2>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Request a full machine-readable JSON backup containing your profile, projects, task history,
          uploaded document metadata, career applications, and audit records.
        </p>

        <button
          onClick={handleExportData}
          disabled={exporting}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition disabled:opacity-50"
        >
          {exporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Generating JSON Package...</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span>Export Workspace Data (.json)</span>
            </>
          )}
        </button>
      </div>

      {/* Danger Zone: Account Deletion */}
      <div className="rounded-2xl border border-rose-300 bg-rose-50/50 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 text-rose-900 font-bold text-sm">
          <AlertTriangle className="h-5 w-5 text-rose-600" />
          <span>Permanently Delete Student Account</span>
        </div>
        <p className="text-xs text-rose-800 leading-relaxed">
          This action is irreversible. All student profile settings, projects, tasks, conversation history,
          uploaded files, career applications, and audit trails will be permanently deleted from the database.
        </p>

        <div className="rounded-xl bg-white p-4 border border-rose-200 space-y-3">
          <label className="block text-xs font-bold text-slate-800">
            Type <span className="font-mono text-rose-600">DELETE</span> to confirm:
          </label>
          <input
            type="text"
            placeholder="Type DELETE"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            className="block w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-rose-600 focus:ring-1 focus:ring-rose-600 font-mono"
          />

          <button
            onClick={handleDeleteAccount}
            disabled={deleting || deleteConfirmation !== "DELETE"}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 transition disabled:opacity-40"
          >
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Deleting Account...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                <span>Confirm Permanent Deletion</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
