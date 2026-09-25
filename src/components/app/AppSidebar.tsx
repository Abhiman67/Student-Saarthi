"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bot,
  FolderKanban,
  CheckSquare,
  FileText,
  Briefcase,
  BarChart3,
  Settings,
  Sparkles,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();

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
    <aside className="hidden lg:flex w-64 flex-col border-r border-slate-200 bg-white min-h-screen">
      {/* Brand */}
      <div className="p-5 border-b border-slate-100 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <span className="font-bold text-slate-900 tracking-tight text-base">Vidya Sarthi</span>
          <span className="block text-[10px] font-semibold text-indigo-600 tracking-wider uppercase">
            Student Workspace
          </span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
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
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive
                  ? "bg-indigo-50 text-indigo-700 font-semibold shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4.5 w-4.5 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="h-4 w-4 text-indigo-500" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer Trust badge */}
      <div className="p-4 border-t border-slate-100">
        <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 mb-1">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Human-in-the-Loop Safe</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            Actions require your explicit approval before modifying workspace data.
          </p>
        </div>
      </div>
    </aside>
  );
}
