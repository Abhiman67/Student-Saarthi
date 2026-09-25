import { PublicHeader } from "@/components/public/Header";
import { PublicFooter } from "@/components/public/Footer";
import { BookOpen, ShieldAlert, Award, AlertTriangle } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicHeader />

      <main className="flex-1 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Ethics & Compliance</span>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Terms of Service & Academic Policy
            </h1>
            <p className="mt-2 text-sm text-slate-500">Effective: Academic Year 2026</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm space-y-8 text-slate-700 leading-relaxed text-sm">
            <section>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Award className="h-5 w-5 text-indigo-600" /> 1. Academic Purpose & Integrity
              </h2>
              <p className="mt-2">
                Vidya Sarthi is provided as a student educational assistant to facilitate deep learning, technical understanding, milestone management, and viva defense preparation. It is not intended to bypass homework or circumvent academic standards.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-rose-600" /> 2. Prohibition of Live Examination Misconduct
              </h2>
              <p className="mt-2">
                Users agree strictly NOT to utilize Vidya Sarthi during live examinations, invigilated quizzes, or proctored assessments. Our agents are programmed to reject requests that attempt live exam cheating.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" /> 3. Nature of AI Advice & Hallucinations
              </h2>
              <p className="mt-2">
                While Vidya Sarthi applies prompt guardrails and deterministic fallbacks, artificial intelligence can make errors or exhibit uncertainty. Students must cross-reference technical outputs with their university textbooks, official lecture notes, and faculty advice before submitting academic reports.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-600" /> 4. Non-Commercial Academic Scope
              </h2>
              <p className="mt-2">
                This version represents an academic evaluation build. Billing and subscriptions are intentionally disabled. You may use this software for evaluation, demonstration, and personal academic workflows.
              </p>
            </section>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
