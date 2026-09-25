"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Vidya Sarthi</span>
            <span className="block text-[10px] font-medium tracking-wider uppercase text-indigo-600">AI Student Team</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="/agents" className="transition hover:text-indigo-600">
            Specialized Agents
          </Link>
          <Link href="/how-it-works" className="transition hover:text-indigo-600">
            How It Works
          </Link>
          <Link href="/pricing" className="transition hover:text-indigo-600">
            Student Tier
          </Link>
          <Link href="/#use-cases" className="transition hover:text-indigo-600">
            Use Cases
          </Link>
          <Link href="/#faq" className="transition hover:text-indigo-600">
            FAQ
          </Link>
        </nav>

        {/* Auth CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-lg transition"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
