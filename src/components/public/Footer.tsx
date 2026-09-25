import Link from "next/link";
import { Sparkles, Shield, GraduationCap, Github } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D97757] text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-[#181614]">Vidya Sarthi</span>
            </Link>
            <p className="mt-3 text-sm text-[#181614]/70 leading-relaxed">
              A personal AI team for students to study smarter, build better engineering projects, and prepare for viva defense.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-[#181614]/50">
              <Shield className="h-4 w-4 text-emerald-600" />
              <span>Built with Academic Integrity & Privacy First</span>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#181614]">Workspace</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
              <li>
                <Link href="/agents" className="hover:text-[#D97757] transition">
                  Specialized Agents
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[#D97757] transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#D97757] transition">
                  Academic Pricing
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-[#D97757] transition">
                  Student Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Specialized Agents */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#181614]">Specialized Mentors</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
              <li>
                <Link href="/agents#writing-buddy" className="hover:text-[#D97757] transition flex items-center gap-1.5">
                  <span>Writing Buddy</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded">Live</span>
                </Link>
              </li>
              <li>
                <Link href="/agents#project-guide" className="hover:text-[#D97757] transition flex items-center gap-1.5">
                  <span>Project Guide</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded">Live</span>
                </Link>
              </li>
              <li>
                <Link href="/agents#code-mentor" className="hover:text-[#D97757] transition flex items-center gap-1.5">
                  <span>Code Mentor</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded">Live</span>
                </Link>
              </li>
              <li>
                <Link href="/agents#future-scope" className="hover:text-[#D97757] transition text-slate-400">
                  <span>+ 3 Planned (End-Sem Roadmap)</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal and Integrity */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Governance & Trust</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-600">
              <li>
                <Link href="/privacy" className="hover:text-indigo-600 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-indigo-600 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <span className="text-xs text-slate-400 block pt-1">
                  Academic Student Edition Version 1.0
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Vidya Sarthi. Academic Project Prototype. All illustrative data labeled.</p>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <Link href="/privacy" className="hover:text-slate-600">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-600">Terms</Link>
            <Link href="/login" className="hover:text-slate-600">Student Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
