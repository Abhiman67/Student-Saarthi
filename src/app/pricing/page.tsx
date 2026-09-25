import Link from "next/link";
import { PublicHeader } from "@/components/public/Header";
import { PublicFooter } from "@/components/public/Footer";
import { Check, ArrowRight, ShieldCheck, Info } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicHeader />

      <main className="flex-1 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Fair Academic Access</span>
            <h1 className="mt-2 text-4xl font-extrabold text-slate-900 sm:text-5xl">
              Student Pricing & Viva Evaluation Tier
            </h1>
            <p className="mt-4 text-base text-slate-600">
              Vidya Sarthi is currently in its Mid-Viva Academic Demonstration phase. All features are 100% free for educational evaluation.
            </p>
          </div>

          {/* MVP Non-Billing Notice Banner */}
          <div className="mt-10 max-w-2xl mx-auto rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-amber-800 font-semibold text-sm">
              <Info className="h-4 w-4" />
              <span>Billing is not active in this MVP.</span>
            </div>
            <p className="mt-1 text-xs text-amber-700">
              No credit card or payments required. Paid subscription plans are documented for end-semester future scope only.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Active Tier */}
            <div className="rounded-3xl border-2 border-indigo-600 bg-white p-8 shadow-lg relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">Student Scholar (Active MVP)</h2>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                    Active
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  Full student workspace with six specialized AI mentors and human-in-the-loop approvals.
                </p>

                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-black text-slate-900">₹0</span>
                  <span className="ml-2 text-sm text-slate-500">/ semester</span>
                </div>

                <ul className="mt-8 space-y-3 text-sm text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>All 6 Specialized AI Agents</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>Interactive Chat with Citation & Safety Guardrails</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>Project & Task Management with Calendar views</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>Study File Text Extraction & Flashcard/Quiz Tools</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>Career Placement Tracker & Skill-gap Analyzer</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-emerald-600" />
                    <span>Full Audit Logging & Data Privacy Controls</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <Link
                  href="/signup"
                  className="block w-full text-center rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
                >
                  Get Started Now
                </Link>
              </div>
            </div>

            {/* Future Scope Tier */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50/60 p-8 shadow-sm flex flex-col justify-between opacity-80">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-700">Campus Pro (Future Scope)</h2>
                  <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-600">
                    End-Semester Plan
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  Institutional multi-step orchestrator, pgvector semantic memory, and university LMS sync.
                </p>

                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-black text-slate-400">₹499</span>
                  <span className="ml-2 text-sm text-slate-400">/ semester (Illustrative)</span>
                </div>

                <ul className="mt-8 space-y-3 text-sm text-slate-500">
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-slate-400" />
                    <span>Persistent AgentRun & Step State Machine</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-slate-400" />
                    <span>pgvector Semantic Embeddings & Context Builder</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-slate-400" />
                    <span>Google Drive, Classroom & GitHub Connectors</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-slate-400" />
                    <span>Automated Multi-step Closed-loop Execution</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <button
                  disabled
                  className="block w-full text-center rounded-xl bg-slate-200 py-3 text-sm font-semibold text-slate-500 cursor-not-allowed"
                >
                  Reserved for End-Semester
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
