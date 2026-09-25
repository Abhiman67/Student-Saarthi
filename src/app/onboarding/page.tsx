"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  GraduationCap,
  BookOpen,
  Target,
  CheckCircle2,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    institution: "",
    degree: "B.Tech Computer Science",
    semester: "Semester 6",
    goals: "Master distributed systems, complete capstone project with distinction, and secure software engineering placement.",
    subjects: "Database Management, Distributed Systems, Software Engineering, Operating Systems",
    skills: "React, TypeScript, Node.js, Python, SQL, Git",
    interests: "Cloud Architecture, Full Stack Engineering, AI Tooling",
    studyHours: 4,
    careerTarget: "Full Stack Engineer / Systems Engineer",
  });

  const updateField = (field: string, val: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!formData.institution.trim()) {
        setError("Please enter your university or college name.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.goals.trim() || !formData.subjects.trim()) {
        setError("Please specify your academic goals and active subjects.");
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    setError(null);
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message || "Failed to complete onboarding.");
        setLoading(false);
        return;
      }

      // Success -> Redirect to student workspace dashboard
      router.push("/app");
      router.refresh();
    } catch {
      setError("Network error while saving profile.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-slate-900">Vidya Sarthi</span>
        </div>
        <h1 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome to Your Student AI Team
        </h1>
        <p className="mt-2 text-center text-sm text-slate-600">
          Personalize your mentors to align with your university curriculum and viva schedule.
        </p>

        {/* Progress Bar */}
        <div className="mt-8 mb-6">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span className={step >= 1 ? "text-indigo-600" : ""}>1. Academic Identity</span>
            <span className={step >= 2 ? "text-indigo-600" : ""}>2. Subjects & Goals</span>
            <span className={step >= 3 ? "text-indigo-600" : ""}>3. Skills & Career</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white py-8 px-6 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-200">
          {error && (
            <div className="mb-6 rounded-xl bg-rose-50 border border-rose-200 p-3.5 flex items-start gap-2.5 text-sm text-rose-700">
              <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <GraduationCap className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-800">Academic Background</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  College / University Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. National Institute of Technology / Delhi Technological University"
                  value={formData.institution}
                  onChange={(e) => updateField("institution", e.target.value)}
                  className="mt-1.5 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Degree / Program</label>
                  <input
                    type="text"
                    value={formData.degree}
                    onChange={(e) => updateField("degree", e.target.value)}
                    className="mt-1.5 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Current Semester / Year</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => updateField("semester", e.target.value)}
                    className="mt-1.5 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  >
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                    <option value="Semester 3">Semester 3</option>
                    <option value="Semester 4">Semester 4</option>
                    <option value="Semester 5">Semester 5</option>
                    <option value="Semester 6">Semester 6</option>
                    <option value="Semester 7">Semester 7</option>
                    <option value="Semester 8">Semester 8</option>
                    <option value="Postgraduate Year 1">Postgraduate Year 1</option>
                    <option value="Postgraduate Year 2">Postgraduate Year 2</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-800">Curriculum & Study Targets</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Active Subjects & Courses (comma-separated) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Systems, DBMS, Software Engineering"
                  value={formData.subjects}
                  onChange={(e) => updateField("subjects", e.target.value)}
                  className="mt-1.5 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Primary Academic & Semester Goals *
                </label>
                <textarea
                  rows={3}
                  value={formData.goals}
                  onChange={(e) => updateField("goals", e.target.value)}
                  placeholder="What is your main focus this semester?"
                  className="mt-1.5 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Daily Dedicated Study Target: <span className="font-bold text-indigo-600">{formData.studyHours} hours</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={formData.studyHours}
                  onChange={(e) => updateField("studyHours", parseInt(e.target.value))}
                  className="mt-2 w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Target className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-800">Skills & Placement Focus</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Technical Skills & Technologies
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, TypeScript, Python, Docker, SQL"
                  value={formData.skills}
                  onChange={(e) => updateField("skills", e.target.value)}
                  className="mt-1.5 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Academic & Technical Interests
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cloud Infrastructure, System Design, Machine Learning"
                  value={formData.interests}
                  onChange={(e) => updateField("interests", e.target.value)}
                  className="mt-1.5 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Target Career / Internship Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Software Development Engineer (SDE-1)"
                  value={formData.careerTarget}
                  onChange={(e) => updateField("careerTarget", e.target.value)}
                  className="mt-1.5 block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>
            </div>
          )}

          {/* Action Navigation */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            ) : <div />}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition"
              >
                Next Step
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 px-7 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Launch Workspace</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
