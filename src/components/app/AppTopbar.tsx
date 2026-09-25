"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LogOut,
  User,
  ShieldAlert,
  Menu,
  X,
  Sparkles,
  LayoutDashboard,
  Bot,
  FolderKanban,
  CheckSquare,
  FileText,
  Briefcase,
  BarChart3,
  Settings,
} from "lucide-react";

export function AppTopbar({ userName }: { userName: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingApprovals, setPendingApprovals] = useState(0);

  useEffect(() => {
    // Check pending approvals count
    fetch("/api/approvals?status=Pending")
      .then((res) => res.json())
      .then((data) => {
        if (data.approvals) {
          setPendingApprovals(data.approvals.length);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    }
  };

  const navItems = [
    { label: "Dashboard", href: "/app", icon: LayoutDashboard },
    { label: "AI Agents", href: "/app/agents", icon: Bot },
    { label: "Projects", href: "/app/projects", icon: FolderKanban },
    { label: "Tasks", href: "/app/tasks", icon: CheckSquare },
    { label: "Study Files", href: "/app/files", icon: FileText },
    { label: "Career & Placement", href: "/app/career", icon: Briefcase },
    { label: "Usage & Quota", href: "/app/usage", icon: BarChart3 },
    { label: "Settings & Privacy", href: "/app/settings", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Mobile hamburger & Brand/Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="flex items-center gap-2 lg:hidden">
          <Sparkles className="h-5 w-5 text-indigo-600" />
          <span className="font-bold text-slate-900 text-sm">Vidya Sarthi</span>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-400">
          <span>Student Portal</span>
          <span>/</span>
          <span className="text-slate-700 capitalize font-semibold">
            {pathname === "/app" ? "Dashboard" : pathname.replace("/app/", "").split("/")[0]}
          </span>
        </div>
      </div>

      {/* Right: Approvals notification, User name, Logout */}
      <div className="flex items-center gap-4">
        {/* Approvals quick link */}
        <Link
          href="/app/settings/audit"
          className="relative inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
        >
          <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
          <span className="hidden sm:inline">Approvals & Audit</span>
          {pendingApprovals > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
              {pendingApprovals}
            </span>
          )}
        </Link>

        {/* User avatar / profile button */}
        <Link
          href="/app/settings/profile"
          className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100 transition"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs">
            {userName ? userName.slice(0, 2).toUpperCase() : "VS"}
          </div>
          <span className="hidden md:inline text-xs font-semibold text-slate-700 max-w-[120px] truncate">
            {userName || "Student"}
          </span>
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-x-0 top-16 z-50 border-b border-slate-200 bg-white p-4 shadow-xl lg:hidden">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/app"
                  ? pathname === "/app"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 font-semibold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
