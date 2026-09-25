import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  FolderKanban,
  Plus,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
} from "lucide-react";

export default async function ProjectsListPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const projects = await db.project.findMany({
    where: { userId: user.id },
    include: {
      tasks: {
        select: { id: true, status: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Academic Projects</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your coursework milestones, engineering capstone, and viva preparations.
          </p>
        </div>
        <Link
          href="/app/projects/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
        >
          <Plus className="h-4 w-4" />
          <span>New Project</span>
        </Link>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
            <FolderKanban className="h-6 w-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900">No Academic Projects Yet</h2>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Create a project space for your semester capstone or subject assignment to track tasks and link AI mentors.
          </p>
          <div className="mt-6">
            <Link
              href="/app/projects/new"
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition"
            >
              <Plus className="h-4 w-4" /> Create First Project
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => {
            const totalTasks = proj.tasks.length;
            const completedTasks = proj.tasks.filter((t) => t.status === "Completed").length;
            const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

            return (
              <div
                key={proj.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded-md bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
                      {proj.type}
                    </span>
                    <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                      {proj.status}
                    </span>
                  </div>

                  <Link href={`/app/projects/${proj.id}`}>
                    <h2 className="text-lg font-bold text-slate-900 hover:text-indigo-600 transition">
                      {proj.name}
                    </h2>
                  </Link>

                  <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {proj.description || "No project description provided."}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
                      <span>Milestones: {progress}%</span>
                      <span>
                        {completedTasks}/{totalTasks} completed
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  {proj.targetDate ? (
                    <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                      <Calendar className="h-3.5 w-3.5" />
                      Target: {new Date(proj.targetDate).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[11px]">No target deadline</span>
                  )}

                  <Link
                    href={`/app/projects/${proj.id}`}
                    className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    Open Workspace <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
