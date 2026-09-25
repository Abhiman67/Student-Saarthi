import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  Sparkles,
  Bot,
  FolderKanban,
  CheckSquare,
  FileText,
  Briefcase,
  ArrowRight,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Layers,
  BookOpen,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default async function AppDashboard() {
  const user = await getCurrentUser();
  if (!user) return null;

  // Load user data in parallel
  const [profile, projects, tasks, files, conversations, applications, pendingApprovals] =
    await Promise.all([
      db.profile.findUnique({ where: { userId: user.id } }),
      db.project.findMany({
        where: { userId: user.id },
        include: { tasks: true },
        orderBy: { updatedAt: "desc" },
        take: 3,
      }),
      db.task.findMany({
        where: { userId: user.id },
        include: { project: true, agent: true },
        orderBy: [{ status: "asc" }, { dueDate: "asc" }],
        take: 5,
      }),
      db.file.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 4,
      }),
      db.conversation.findMany({
        where: { userId: user.id },
        include: { agent: true, messages: { take: 1, orderBy: { createdAt: "desc" } } },
        orderBy: { updatedAt: "desc" },
        take: 3,
      }),
      db.application.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: "desc" },
        take: 3,
      }),
      db.approval.findMany({
        where: { userId: user.id, status: "Pending" },
        take: 2,
      }),
    ]);

  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const pendingTasks = tasks.filter((t) => t.status !== "Completed").length;

  const todayStr = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2A2421] via-[#38302B] to-[#1E1A17] p-6 sm:p-8 text-[#FAF8F5] shadow-lg border border-[#3D3631]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-[#D97757] text-xs font-semibold uppercase tracking-wider mb-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{todayStr}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FAF8F5]">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="mt-2 text-[#E8E2D9]/80 text-sm max-w-xl">
              {profile?.institution ? (
                <span>
                  {profile.institution} • {profile.degree || "Student"} • {profile.semester || "Semester"}
                </span>
              ) : (
                <span>Your AI student team is ready to assist your coursework, coding, and viva defense.</span>
              )}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/app/tasks"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-[#FAF8F5] transition border border-white/10"
            >
              <Plus className="h-3.5 w-3.5" /> New Task
            </Link>
            <Link
              href="/app/projects/new"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-[#FAF8F5] transition border border-white/10"
            >
              <Plus className="h-3.5 w-3.5" /> New Project
            </Link>
            <Link
              href="/app/files"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-[#FAF8F5] transition border border-white/10"
            >
              <FileText className="h-3.5 w-3.5" /> Upload File
            </Link>
            <Link
              href="/app/agents"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#D97757] hover:bg-[#C96442] px-4 py-2 text-xs font-semibold text-white shadow-sm transition"
            >
              <Sparkles className="h-3.5 w-3.5" /> Chat Agents
            </Link>
          </div>
        </div>
      </div>

      {/* Pending Approvals Alert Banner (Human-in-the-loop) */}
      {pendingApprovals.length > 0 && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="rounded-lg bg-amber-200/80 p-2 text-amber-800">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-900">
                  Human Approvals Required ({pendingApprovals.length} pending)
                </h3>
                <p className="text-xs text-amber-800">
                  An agent has proposed a workspace modification that requires your review.
                </p>
              </div>
            </div>
            <Link
              href="/app/settings/audit"
              className="inline-flex items-center gap-1 rounded-xl bg-amber-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-amber-700 transition"
            >
              Review Actions <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Today&apos;s Focus</span>
            <BookOpen className="h-4 w-4 text-indigo-600" />
          </div>
          <p className="mt-2 text-xl font-extrabold text-slate-900">
            {profile?.goals ? "Target Active" : "Set Goals"}
          </p>
          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
            {profile?.goals || "Complete onboarding profile"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Tasks Pending</span>
            <CheckSquare className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-xl font-extrabold text-slate-900">{pendingTasks}</p>
          <p className="text-xs text-slate-500 mt-1">
            {completedTasks} completed this session
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Projects</span>
            <FolderKanban className="h-4 w-4 text-purple-600" />
          </div>
          <p className="mt-2 text-xl font-extrabold text-slate-900">{projects.length}</p>
          <p className="text-xs text-slate-500 mt-1">
            Academic capstone & coursework
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Career Apps</span>
            <Briefcase className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-xl font-extrabold text-slate-900">{applications.length}</p>
          <p className="text-xs text-slate-500 mt-1">
            Internship tracking pipeline
          </p>
        </div>
      </div>

      {/* Main Grid: Projects & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Projects Widget */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FolderKanban className="h-5 w-5 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900">Current Projects</h2>
              </div>
              <Link
                href="/app/projects"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                View all ({projects.length}) <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {projects.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
                  <FolderKanban className="h-8 w-8 text-slate-300 mx-auto" />
                  <p className="mt-2 text-sm font-semibold text-slate-700">No active projects yet</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Organize your semester coursework or capstone with milestone tracking.
                  </p>
                  <Link
                    href="/app/projects/new"
                    className="mt-3 inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-100 transition"
                  >
                    <Plus className="h-3 w-3" /> Create First Project
                  </Link>
                </div>
              ) : (
                projects.map((proj) => {
                  const total = proj.tasks.length;
                  const done = proj.tasks.filter((t) => t.status === "Completed").length;
                  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                  return (
                    <Link
                      key={proj.id}
                      href={`/app/projects/${proj.id}`}
                      className="block rounded-xl border border-slate-100 bg-slate-50/70 p-4 hover:border-indigo-200 hover:bg-indigo-50/30 transition group"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">
                          {proj.name}
                        </h3>
                        <span className="text-[11px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                          {proj.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                        {proj.description || `${proj.type} Project`}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Progress: {pct}%</span>
                        <span>{done}/{total} tasks complete</span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              href="/app/projects/new"
              className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <Plus className="h-3.5 w-3.5" /> Start New Academic Project
            </Link>
          </div>
        </div>

        {/* Tasks & Deadlines Widget */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-amber-600" />
                <h2 className="text-base font-bold text-slate-900">Upcoming Tasks & Deadlines</h2>
              </div>
              <Link
                href="/app/tasks"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                View all ({tasks.length}) <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="mt-4 space-y-2.5">
              {tasks.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
                  <CheckSquare className="h-8 w-8 text-slate-300 mx-auto" />
                  <p className="mt-2 text-sm font-semibold text-slate-700">No tasks added</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Keep track of assignments, code reviews, and viva preparation.
                  </p>
                  <Link
                    href="/app/tasks"
                    className="mt-3 inline-flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-100 transition"
                  >
                    <Plus className="h-3 w-3" /> Add First Task
                  </Link>
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3 hover:bg-white hover:border-slate-200 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-2.5 w-2.5 rounded-full ${
                          task.status === "Completed"
                            ? "bg-emerald-500"
                            : task.priority === "Urgent"
                            ? "bg-rose-500"
                            : task.priority === "High"
                            ? "bg-amber-500"
                            : "bg-blue-400"
                        }`}
                      />
                      <div>
                        <p
                          className={`text-xs font-bold ${
                            task.status === "Completed"
                              ? "line-through text-slate-400"
                              : "text-slate-800"
                          }`}
                        >
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                          {task.project && <span>{task.project.name}</span>}
                          {task.dueDate && (
                            <span className="flex items-center gap-1 text-slate-500">
                              <Clock className="h-2.5 w-2.5" />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        task.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              href="/app/tasks"
              className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <Plus className="h-3.5 w-3.5" /> Add Task to Calendar
            </Link>
          </div>
        </div>
      </div>

      {/* Row: Available Agents & Recent Files */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Available Agents Quick Access (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D9]">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-[#D97757]" />
              <h2 className="text-base font-bold text-[#181614]">Your Specialized AI Team</h2>
              <span className="rounded-full bg-[#D97757]/10 px-2 py-0.5 text-[10px] font-bold text-[#D97757]">
                Mid-Viva Scope
              </span>
            </div>
            <Link
              href="/app/agents"
              className="text-xs font-semibold text-[#D97757] hover:text-[#C96442] flex items-center gap-1"
            >
              All Agents <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: "writing-buddy", name: "Writing Buddy", cat: "Reports & Papers", tag: "Active" },
              { id: "project-guide", name: "Project Guide", cat: "Architecture & Viva", tag: "Active" },
              { id: "code-mentor", name: "Code Mentor", cat: "Debugging & Code", tag: "Active" },
            ].map((agent) => (
              <Link
                key={agent.id}
                href={`/app/agents/${agent.id}`}
                className="rounded-xl border border-[#E8E2D9] bg-[#FAF8F5] p-3.5 hover:bg-white hover:border-[#D97757]/40 hover:shadow-xs transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#181614] group-hover:text-[#D97757] transition">
                    {agent.name}
                  </span>
                  <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{agent.cat}</p>
              </Link>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-dashed border-[#E8E2D9] bg-white/60 p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#181614]/5 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                Future Scope
              </span>
              <span className="text-slate-600 text-[11px]">
                Study Coach, Career Scout & Interview Coach planned for End-Semester
              </span>
            </div>
            <Link
              href="/app/agents#future-scope"
              className="text-[11px] font-semibold text-[#D97757] hover:underline"
            >
              View Roadmap →
            </Link>
          </div>
        </div>

        {/* Recent Study Files (1 col) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900">Study Files</h2>
              </div>
              <Link
                href="/app/files"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                Files ({files.length}) <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="mt-4 space-y-2.5">
              {files.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center">
                  <FileText className="h-6 w-6 text-slate-300 mx-auto" />
                  <p className="mt-2 text-xs font-semibold text-slate-700">No documents uploaded</p>
                  <Link
                    href="/app/files"
                    className="mt-2 inline-block text-[11px] font-bold text-indigo-600 hover:underline"
                  >
                    Upload notes or syllabus
                  </Link>
                </div>
              ) : (
                files.map((file) => (
                  <Link
                    key={file.id}
                    href="/app/files"
                    className="block rounded-lg border border-slate-100 bg-slate-50 p-2.5 hover:bg-slate-100 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 truncate max-w-[150px]">
                        {file.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {(file.size / 1024).toFixed(0)} KB
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <Link
              href="/app/files"
              className="w-full flex items-center justify-center gap-1 rounded-xl bg-slate-50 hover:bg-slate-100 py-2 text-xs font-semibold text-slate-700 transition"
            >
              Manage Study Materials
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
