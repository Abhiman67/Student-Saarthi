import { PublicHeader } from "@/components/public/Header";
import { PublicFooter } from "@/components/public/Footer";
import { ShieldCheck, Lock, EyeOff, Trash2 } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicHeader />

      <main className="flex-1 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Privacy & Governance</span>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Vidya Sarthi Privacy Policy
            </h1>
            <p className="mt-2 text-sm text-slate-500">Last updated: September 2026 (Academic MVP)</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm space-y-8 text-slate-700 leading-relaxed text-sm">
            <section>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Lock className="h-5 w-5 text-indigo-600" /> 1. Student Data Ownership & Boundary
              </h2>
              <p className="mt-2">
                All data created in Vidya Sarthi—including profile data, academic goals, projects, tasks, uploaded files, and conversation logs—remains strictly under your individual student account. We do not sell student data, nor do we share academic notes with unauthorized third parties.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <EyeOff className="h-5 w-5 text-indigo-600" /> 2. Treatment of Uploaded Reference Files
              </h2>
              <p className="mt-2">
                Files you upload (PDFs, DOCX, TXT, Markdown) are processed solely for the purpose of generating active recall flashcards, study quizzes, and summaries scoped to your session. Uploaded documents are treated as untrusted reference data with prompt injection sanitization.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-600" /> 3. Human Approval & Audit Trails
              </h2>
              <p className="mt-2">
                Every action proposed by our AI mentors requires explicit human authorization. All logins, password updates, file interactions, and approval decisions are logged in an immutable, user-accessible Audit Trail under your Settings page.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-indigo-600" /> 4. Data Deletion & Portability
              </h2>
              <p className="mt-2">
                Students retain the permanent right to clear conversation history, export all workspace records in machine-readable JSON format, or delete their account permanently at any time from the Settings dashboard.
              </p>
            </section>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
