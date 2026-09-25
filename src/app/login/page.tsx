"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message || "Invalid credentials. Please try again.");
        setLoading(false);
        return;
      }

      // If user hasn't completed onboarding -> /onboarding, else -> /app
      if (!data.user?.onboardingCompleted) {
        router.push("/onboarding");
      } else {
        router.push("/app");
      }
      router.refresh();
    } catch {
      setError("Network error. Please check your connection.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">Vidya Sarthi</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-slate-900">
          Sign in to your student workspace
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Don&apos;t have an account yet?{" "}
          <Link href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Sign up free
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-200/80">
          {error && (
            <div className="mb-6 rounded-xl bg-rose-50 border border-rose-200 p-3.5 flex items-start gap-2.5 text-sm text-rose-700">
              <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email Address
              </label>
              <div className="mt-1.5">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 text-sm shadow-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="mt-1.5">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 text-sm shadow-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 rounded-xl bg-[#D97757] py-3 px-4 text-sm font-semibold text-white shadow-md hover:bg-[#C96442] focus:outline-none active:scale-95 disabled:opacity-70 transition"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying session...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Workspace</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-[#E8E2D9] text-center">
            <button
              type="button"
              onClick={() => {
                try {
                  const { LocalStore } = require("@/lib/storage");
                  LocalStore.init();
                } catch {}
                router.push("/app");
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-50/70 py-2.5 px-4 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition shadow-xs"
            >
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span>⚡ Instant Demo Workspace (No Login Needed)</span>
            </button>
            <p className="mt-2 text-[11px] text-slate-400">
              Pre-loaded with Writing Buddy, Project Guide, Code Mentor & sample capstones
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
