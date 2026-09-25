"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FolderKanban,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Edit3,
  Loader2,
  Sparkles,
  Bot,
  AlertCircle,
  Check,
} from "lucide-react";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Edit fields
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editType, setEditType] = useState("Coursework");
  const [editStatus, setEditStatus] = useState("Planning");
  const [savingEdit, setSavingEdit] = useState(false);

  // New task inline
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("Medium");
  const [addingTask, setAddingTask] = useState(false);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`);
      if (!res.ok) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setProject(data.project);
      setEditName(data.project.name);
      setEditDescription(data.project.description || "");
      setEditType(data.project.type);
      setEditStatus(data.project.status);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingEdit(true);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          description: editDescription,
          type: editType,
          status: editStatus,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setProject((prev: any) => ({ ...prev, ...data.project }));
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!confirm(`Are you sure you want to delete "${project?.name}"?`)) return;
    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/app/projects");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || addingTask) return;

    setAddingTask(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTaskTitle.trim(),
          priority: newTaskPriority,
          status: "Pending",
          projectId,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setProject((prev: any) => ({
          ...prev,
          tasks: [data.task, ...(prev.tasks || [])],
        }));
        setNewTaskTitle("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAddingTask(false);
    }
  };

  const handleToggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Completed" ? "Pending" : "Completed";
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setProject((prev: any) => ({
          ...prev,
          tasks: prev.tasks.map((t: any) =>
            t.id === taskId ? { ...t, status: nextStatus } : t
          ),
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center max-w-lg mx-auto">
        <AlertCircle className="h-10 w-10 text-rose-500 mx-auto mb-3" />
        <h1 className="text-xl font-bold text-slate-900">Project Not Found</h1>
        <p className="mt-1 text-xs text-slate-500">
          The requested project does not exist or you do not have permission to access it.
        </p>
        <div className="mt-6">
          <Link
            href="/app/projects"
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const tasks = project.tasks || [];
  const completed = tasks.filter((t: any) => t.status === "Completed").length;
  const progressPct = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            href="/app/projects"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 transition"
            title="Back to projects"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{project.name}</h1>
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                {project.type}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Status: {project.status}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>{isEditing ? "Cancel" : "Edit"}</span>
          </button>
          <button
            onClick={handleDeleteProject}
            className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </button>
          <Link
            href={`/app/agents/project-guide?conversationId=`}
            className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
          >
            <Bot className="h-3.5 w-3.5" />
            <span>Consult Project Guide</span>
          </Link>
        </div>
      </div>

      {/* Edit Form if active */}
      {isEditing && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-4">Edit Project Details</h2>
          <form onSubmit={handleUpdateProject} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700">Project Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700">Type</label>
                <select
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white"
                >
                  <option value="Coursework">Coursework</option>
                  <option value="Major Project">Major Project</option>
                  <option value="Research">Research</option>
                  <option value="Self-Study">Self-Study</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white"
                >
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Review">Review</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700">Description</label>
              <textarea
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm bg-white"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-xs text-slate-600 rounded-lg hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingEdit}
                className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                {savingEdit ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Project Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Scope & Details</h2>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {project.description || "No detailed description has been added for this project yet."}
          </p>

          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-500">
            {project.targetDate && (
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="h-4 w-4 text-indigo-600" />
                Target Viva: {new Date(project.targetDate).toLocaleDateString()}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-slate-400" />
              Updated {new Date(project.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Milestone Progress Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Milestone Progress
            </h2>
            <div className="text-3xl font-extrabold text-slate-900 mt-2">{progressPct}%</div>
            <p className="text-xs text-slate-500 mt-1">
              {completed} of {tasks.length} tasks completed
            </p>

            <div className="mt-4 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              href={`/app/agents/project-guide?conversationId=`}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              Ask Project Guide for Architecture Review &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Project Tasks & Milestones</h2>
            <p className="text-xs text-slate-500">Break project deliverables into trackable steps.</p>
          </div>
        </div>

        {/* Inline Add Task Form */}
        <form onSubmit={handleAddTask} className="mt-4 flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Add new milestone or task for this project..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-xs"
          />
          <select
            value={newTaskPriority}
            onChange={(e) => setNewTaskPriority(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-700 bg-white"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
          <button
            type="submit"
            disabled={addingTask || !newTaskTitle.trim()}
            className="inline-flex items-center justify-center gap-1 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Task</span>
          </button>
        </form>

        {/* Tasks List */}
        <div className="mt-6 space-y-2.5">
          {tasks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
              No tasks added to this project yet. Use the form above to add milestones.
            </div>
          ) : (
            tasks.map((task: any) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3 hover:bg-white hover:border-slate-200 transition"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleTaskStatus(task.id, task.status)}
                    className={`flex h-5 w-5 items-center justify-center rounded-md border transition ${
                      task.status === "Completed"
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-slate-300 bg-white hover:border-slate-400"
                    }`}
                  >
                    {task.status === "Completed" && <Check className="h-3.5 w-3.5" />}
                  </button>
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
                    {task.description && (
                      <p className="text-[11px] text-slate-500 mt-0.5">{task.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      task.priority === "Urgent"
                        ? "bg-rose-100 text-rose-700"
                        : task.priority === "High"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {task.priority}
                  </span>
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
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
