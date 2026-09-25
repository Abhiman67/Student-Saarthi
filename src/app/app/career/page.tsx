"use client";

import { useState, useEffect } from "react";
import {
  Briefcase,
  Plus,
  ArrowRight,
  ExternalLink,
  Trash2,
  Edit3,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Shield,
  Bot,
} from "lucide-react";

interface ApplicationItem {
  id: string;
  company: string;
  role: string;
  url?: string | null;
  status: "Wishlist" | "Applied" | "Interviewing" | "Offer" | "Rejected";
  notes?: string | null;
  createdAt: string;
}

export default function CareerPage() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New Application Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<ApplicationItem["status"]>("Applied");
  const [notes, setNotes] = useState("");
  const [savingApp, setSavingApp] = useState(false);

  // Keyword Analyzer state
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [studentSkills, setStudentSkills] = useState("React, TypeScript, SQL, Node.js, Git, Problem Solving");
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Cover Letter state
  const [clCompany, setClCompany] = useState("");
  const [clRole, setClRole] = useState("");
  const [clNotes, setClNotes] = useState("");
  const [clDraft, setClDraft] = useState<string | null>(null);
  const [draftingCl, setDraftingCl] = useState(false);

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/career");
      const data = await res.json();
      if (data.applications) setApplications(data.applications);
    } catch {
      setError("Failed to load career applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleCreateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim() || savingApp) return;

    setError(null);
    setSavingApp(true);

    try {
      const res = await fetch("/api/career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: company.trim(),
          role: role.trim(),
          url: url.trim() || undefined,
          status,
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message || "Failed to add application");
        setSavingApp(false);
        return;
      }

      setApplications((prev) => [data.application, ...prev]);
      setIsModalOpen(false);
      setCompany("");
      setRole("");
      setUrl("");
      setNotes("");
    } catch {
      setError("Network error adding application");
    } finally {
      setSavingApp(false);
    }
  };

  const handleDeleteApplication = async (id: string) => {
    if (!confirm("Are you sure you want to delete this application?")) return;
    try {
      const res = await fetch(`/api/career/${id}`, { method: "DELETE" });
      if (res.ok) {
        setApplications((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnalyzeKeywords = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRole.trim() || !jobDescription.trim() || analyzing) return;

    setAnalyzing(true);
    setAnalysisResult(null);
    try {
      const res = await fetch("/api/career/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roleTitle: targetRole,
          jobDescription,
          skillsList: studentSkills,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setAnalysisResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDraftCoverLetter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clCompany.trim() || !clRole.trim() || draftingCl) return;

    setDraftingCl(true);
    setClDraft(null);
    try {
      const res = await fetch("/api/career/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: clCompany,
          role: clRole,
          notes: clNotes,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setClDraft(data.draft);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDraftingCl(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Career & Placement Preparation
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track internship and job applications, evaluate resume skill gaps, and draft cover letters with Career Scout.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Add Application</span>
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Applications Pipeline Grid */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-indigo-600" />
          <span>Application Pipeline ({applications.length})</span>
        </h2>

        {loading ? (
          <div className="flex h-36 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
          </div>
        ) : applications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
            No job or internship applications tracked yet. Click Add Application above!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/60 p-4 hover:bg-white hover:shadow-xs transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        app.status === "Offer"
                          ? "bg-emerald-100 text-emerald-800"
                          : app.status === "Interviewing"
                          ? "bg-purple-100 text-purple-800"
                          : app.status === "Applied"
                          ? "bg-blue-100 text-blue-800"
                          : app.status === "Wishlist"
                          ? "bg-slate-200 text-slate-700"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {app.status}
                    </span>

                    <button
                      onClick={() => handleDeleteApplication(app.id)}
                      className="text-slate-400 hover:text-rose-600 transition"
                      title="Delete application"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{app.company}</h3>
                  <p className="text-xs text-indigo-600 font-semibold">{app.role}</p>

                  {app.notes && (
                    <p className="text-[11px] text-slate-500 mt-2 line-clamp-2">{app.notes}</p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  {app.url ? (
                    <a
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-indigo-600 hover:underline font-medium"
                    >
                      Job Posting <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-slate-400">No URL</span>
                  )}
                  <span className="text-slate-400">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Two columns: Resume Skill-Gap Analyzer & Cover Letter Drafter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Keyword & Skill-Gap Analysis Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Resume & Skill-Gap Analysis</h2>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Compare your skillset against any target job description to pinpoint missing requirements.
          </p>

          <form onSubmit={handleAnalyzeKeywords} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Target Role Title</label>
              <input
                type="text"
                placeholder="e.g. Junior Backend Engineer / SDE-1"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Your Current Skills (comma-separated)
              </label>
              <input
                type="text"
                value={studentSkills}
                onChange={(e) => setStudentSkills(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Job Description Snippet</label>
              <textarea
                rows={3}
                placeholder="Paste key requirements from the job posting..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={analyzing || !targetRole.trim() || !jobDescription.trim()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {analyzing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              <span>Analyze Skill Gaps</span>
            </button>
          </form>

          {analysisResult && (
            <div className="mt-5 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  Alignment Match Score:
                </span>
                <span className="text-sm font-black text-indigo-700">
                  {analysisResult.matchScore}%
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-emerald-700 block">Matched Keywords:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {analysisResult.matchedKeywords.map((kw: string, i: number) => (
                    <span key={i} className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] text-emerald-800 font-semibold">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-rose-700 block">Identified Skill Gaps:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {analysisResult.missingKeywords.map((kw: string, i: number) => (
                    <span key={i} className="rounded bg-rose-100 px-2 py-0.5 text-[10px] text-rose-800 font-semibold">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-indigo-100">
                <span className="text-[11px] font-bold text-slate-700 block mb-1">Recommendations:</span>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                  {analysisResult.recommendations.map((rec: string, i: number) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Cover Letter Drafter Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Custom Cover Letter Drafter</h2>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Draft tailored cover letters. As per our safety policy, all drafts require human review and are never auto-submitted.
          </p>

          <form onSubmit={handleDraftCoverLetter} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700">Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Cloud Corp"
                  value={clCompany}
                  onChange={(e) => setClCompany(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700">Role</label>
                <input
                  type="text"
                  placeholder="e.g. Software Intern"
                  value={clRole}
                  onChange={(e) => setClRole(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Key Accomplishment / Notes (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Mention specific projects or university achievements to feature..."
                value={clNotes}
                onChange={(e) => setClNotes(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={draftingCl || !clCompany.trim() || !clRole.trim()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {draftingCl ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
              <span>Draft Cover Letter</span>
            </button>
          </form>

          {clDraft && (
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 pb-2 border-b border-slate-200">
                <span>Draft for {clRole} at {clCompany}</span>
                <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                  Requires Review
                </span>
              </div>
              <div className="text-xs font-mono text-slate-700 whitespace-pre-wrap max-h-56 overflow-y-auto leading-relaxed">
                {clDraft}
              </div>
              <p className="text-[10px] text-slate-400 italic">
                Vidya Sarthi never automatically submits applications or emails recruiters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CREATE APPLICATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Add Job / Internship Application</h2>
            <form onSubmit={handleCreateApplication} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google / Microsoft / Razorpay"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Position / Role *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Software Engineer Intern (Summer 2026)"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Application Status
                  </label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-700 bg-white"
                  >
                    <option value="Wishlist">Wishlist</option>
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Job Posting URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-700 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Notes & Interview Dates
                </label>
                <textarea
                  rows={2}
                  placeholder="Referral contact, application date, or recruiter feedback..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingApp}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition disabled:opacity-50"
                >
                  {savingApp ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                  <span>Save Application</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
