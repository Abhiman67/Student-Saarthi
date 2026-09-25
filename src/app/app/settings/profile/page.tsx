"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  GraduationCap,
  BookOpen,
  Target,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Save,
} from "lucide-react";

export default function ProfileSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [semester, setSemester] = useState("");
  const [goals, setGoals] = useState("");
  const [subjects, setSubjects] = useState("");
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [studyHours, setStudyHours] = useState(3);
  const [careerTarget, setCareerTarget] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setName(data.user.name || "");
          if (data.profile) {
            setInstitution(data.profile.institution || "");
            setDegree(data.profile.degree || "");
            setSemester(data.profile.semester || "");
            setGoals(data.profile.goals || "");
            setSubjects(data.profile.subjects || "");
            setSkills(data.profile.skills || "");
            setInterests(data.profile.interests || "");
            setStudyHours(data.profile.studyHours || 3);
            setCareerTarget(data.profile.careerTarget || "");
          }
        }
      })
      .catch(() => setError("Failed to load profile data"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const res = await fetch("/api/settings/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          institution,
          degree,
          semester,
          goals,
          subjects,
          skills,
          interests,
          studyHours,
          careerTarget,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message || "Failed to update profile");
      } else {
        setSuccess("Profile settings successfully updated.");
      }
    } catch {
      setError("Network error while updating profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
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
            Profile & Educational Context
          </h1>
          <p className="text-xs text-slate-500">
            This context shapes how all 6 specialized agents personalize responses for your semester.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Details */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <User className="h-5 w-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Personal Details</h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-xs"
            />
          </div>
        </div>

        {/* Education Context */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <GraduationCap className="h-5 w-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">University & Degree</h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">Institution / College</label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Degree Program</label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">Semester</label>
              <input
                type="text"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Curriculum & Goals */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Curriculum & Goals</h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">Active Subjects</label>
            <input
              type="text"
              value={subjects}
              onChange={(e) => setSubjects(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">Semester Academic Goals</label>
            <textarea
              rows={3}
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Daily Study Hours: <span className="font-bold text-indigo-600">{studyHours} hrs</span>
            </label>
            <input
              type="range"
              min={1}
              max={12}
              value={studyHours}
              onChange={(e) => setStudyHours(parseInt(e.target.value))}
              className="mt-2 w-full accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Skills & Career Focus */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Target className="h-5 w-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Skills & Career Targets</h2>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">Technical Skills</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">Target Role / Ambition</label>
            <input
              type="text"
              value={careerTarget}
              onChange={(e) => setCareerTarget(e.target.value)}
              className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-xs"
            />
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
