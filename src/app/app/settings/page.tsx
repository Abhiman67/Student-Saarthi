import Link from "next/link";
import {
  User,
  Brain,
  Shield,
  History,
  ArrowRight,
  Sparkles,
  Download,
  AlertTriangle,
} from "lucide-react";

export default function SettingsHubPage() {
  const sections = [
    {
      title: "Profile & Academic Context",
      description: "Update your name, university, degree, active subjects, and semester goals.",
      href: "/app/settings/profile",
      icon: User,
      color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    },
    {
      title: "AI Memory & Conversation History",
      description: "Manage stored discussion memory or clear all agent conversations.",
      href: "/app/settings/memory",
      icon: Brain,
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      title: "Privacy, Data Export & Account",
      description: "Download a machine-readable copy of your data or manage account deletion.",
      href: "/app/settings/privacy",
      icon: Shield,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      title: "Security Activity & Audit Log",
      description: "Review all workspace interactions, logins, approvals, and file actions.",
      href: "/app/settings/audit",
      icon: History,
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Settings & Governance</h1>
        <p className="mt-1 text-sm text-slate-500">
          Control your student profile, memory retention, privacy exports, and security audit log.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((sec) => {
          const Icon = sec.icon;
          return (
            <Link
              key={sec.href}
              href={sec.href}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition group"
            >
              <div>
                <div className={`inline-flex p-3 rounded-xl border ${sec.color} mb-4`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                  {sec.title}
                </h2>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{sec.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                <span>Manage Settings</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
