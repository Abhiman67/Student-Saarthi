import Link from "next/link";
import { PublicHeader } from "@/components/public/Header";
import { PublicFooter } from "@/components/public/Footer";
import {
  Sparkles,
  ArrowRight,
  ShieldAlert,
  UserCheck,
  CheckCircle2,
  FileText,
  Lock,
  Cpu,
} from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicHeader />

      <main className="flex-1 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Product Mechanics</span>
            <h1 className="mt-2 text-4xl font-extrabold text-slate-900 sm:text-5xl">
              How Vidya Sarthi Operates
            </h1>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              Understand our human-in-the-loop workflow, specialized multi-agent structure,
              and strict academic integrity guardrails.
            </p>
          </div>

          {/* Workflow Steps */}
          <div className="mt-16 space-y-12 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 items-start rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white font-extrabold text-lg">
                1
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Student Profile & Goal Grounding</h2>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  During onboarding, you define your university, degree, current semester, subjects, and study target hours.
                  Every agent in Vidya Sarthi references this context so discussions remain grounded in your actual syllabus
                  rather than generic or irrelevant concepts.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-purple-600 text-white font-extrabold text-lg">
                2
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Multi-Agent Specialization with Domain Prompts</h2>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Unlike generic models that try to handle all domains with a single persona, Vidya Sarthi splits academic life into
                  specialized pillars: Study Coach, Project Guide, Career Scout, Writing Buddy, Code Mentor, and Interview Coach.
                  Each agent is restricted by dedicated system instructions and guidelines.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white font-extrabold text-lg">
                3
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Human-In-The-Loop Approval Cards</h2>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Autonomous agents can generate erratic or unintended mutations if left unchecked. In Vidya Sarthi,
                  whenever an agent proposes creating a task, scheduling a milestone, or creating a project entry,
                  it generates an interactive <strong>Approval Card</strong>. The student must review and click <strong>Approve</strong> or <strong>Deny</strong> before any workspace data changes.
                </p>
              </div>
            </div>
          </div>

          {/* AI Safety Policy Banner */}
          <div className="mt-16 max-w-4xl mx-auto rounded-2xl border border-indigo-200 bg-indigo-50/60 p-8">
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-6 w-6 text-indigo-700" />
              <h2 className="text-lg font-bold text-indigo-950">Academic Integrity & Safety Policy</h2>
            </div>
            <p className="mt-3 text-sm text-indigo-900/80 leading-relaxed">
              Vidya Sarthi is committed to fostering authentic learning. Our system:
            </p>
            <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-indigo-950 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>Never completes live examination questions</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>Explains reasoning instead of dumping answers</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>Treats user uploads as untrusted reference material</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>Logs all actions in a transparent user audit log</span>
              </li>
            </ul>
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-bold text-white shadow-lg hover:bg-indigo-700 transition"
            >
              Try Vidya Sarthi Free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
