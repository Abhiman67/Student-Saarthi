"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckSquare,
  Plus,
  Calendar,
  Clock,
  Trash2,
  Edit3,
  Check,
  AlertCircle,
  Loader2,
  FolderKanban,
  Filter,
} from "lucide-react";

interface TaskItem {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Pending" | "In Progress" | "Completed";
  projectId?: string | null;
  agentId?: string | null;
  project?: { id: string; name: string } | null;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"all" | "today" | "week" | "calendar">("all");
  const [error, setError] = useState<string | null>(null);

  // New task modal/inline
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newPriority, setNewPriority] = useState<"Low" | "Medium" | "High" | "Urgent">("Medium");
  const [newProjectId, setNewProjectId] = useState<string>("");
  const [savingTask, setSavingTask] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const url = view === "all" || view === "calendar" ? "/api/tasks" : `/api/tasks?view=${view}`;
      const [tasksRes, projsRes] = await Promise.all([
        fetch(url),
        fetch("/api/projects"),
      ]);
      const tasksData = await tasksRes.json();
      const projsData = await projsRes.json();

      if (tasksData.tasks) setTasks(tasksData.tasks);
      if (projsData.projects) setProjects(projsData.projects);
    } catch {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [view]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || savingTask) return;

    setError(null);
    setSavingTask(true);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDescription.trim() || undefined,
          dueDate: newDueDate || undefined,
          priority: newPriority,
          status: "Pending",
          projectId: newProjectId || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message || "Failed to add task");
        setSavingTask(false);
        return;
      }

      setTasks((prev) => [data.task, ...prev]);
      setIsModalOpen(false);
      setNewTitle("");
      setNewDescription("");
      setNewDueDate("");
      setNewProjectId("");
    } catch {
      setError("Network error while creating task");
    } finally {
      setSavingTask(false);
    }
  };

  const handleToggleStatus = async (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Completed" ? "Pending" : "Completed";
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      if (res.ok) {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const completedCount = tasks.filter((t) => t.status === "Completed").length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Tasks & Study Calendar</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track daily academic assignments, capstone milestones, and review deadlines.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Task</span>
        </button>
      </div>

      {/* View Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          {(["all", "today", "week", "calendar"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold capitalize transition ${
                view === tab
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {tab === "all" ? "All Tasks" : tab === "today" ? "Today View" : tab === "week" ? "Week View" : "Calendar View"}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          {completedCount} of {tasks.length} tasks completed
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* CALENDAR VIEW */}
      {view === "calendar" ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-indigo-600" />
            <span>Academic Deadline Schedule</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {tasks
              .filter((t) => t.dueDate)
              .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
              .map((task) => (
                <div
                  key={task.id}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-4 hover:border-indigo-200 transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-1 text-[11px] font-bold text-indigo-600">
                      <Clock className="h-3 w-3" />
                      {new Date(task.dueDate!).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        weekday: "short",
                      })}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        task.status === "Completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-800">{task.title}</h3>
                  {task.project && (
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      📁 {task.project.name}
                    </span>
                  )}
                </div>
              ))}
            {tasks.filter((t) => t.dueDate).length === 0 && (
              <p className="text-xs text-slate-400 col-span-3 py-6 text-center">
                No tasks currently have scheduled calendar dates. Add a due date when creating a task!
              </p>
            )}
          </div>
        </div>
      ) : loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : tasks.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <CheckSquare className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <h2 className="text-base font-bold text-slate-800">No Tasks in this View</h2>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            {view === "today"
              ? "No tasks due today. You are all caught up!"
              : view === "week"
              ? "No tasks scheduled for the rest of this week."
              : "Keep your study hours focused by creating actionable milestones."}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition"
          >
            <Plus className="h-4 w-4" /> Add Task
          </button>
        </div>
      ) : (
        /* Tasks List */
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleStatus(task.id, task.status)}
                  className={`flex h-6 w-6 items-center justify-center rounded-lg border transition ${
                    task.status === "Completed"
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-slate-300 bg-white hover:border-slate-400"
                  }`}
                  title="Toggle complete"
                >
                  {task.status === "Completed" && <Check className="h-4 w-4" />}
                </button>

                <div>
                  <h3
                    className={`text-sm font-bold ${
                      task.status === "Completed"
                        ? "line-through text-slate-400"
                        : "text-slate-900"
                    }`}
                  >
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-xs text-slate-500 mt-0.5">{task.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                    {task.project && (
                      <span className="flex items-center gap-1 text-indigo-600 font-medium">
                        <FolderKanban className="h-3 w-3" />
                        {task.project.name}
                      </span>
                    )}
                    {task.dueDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                    task.priority === "Urgent"
                      ? "bg-rose-100 text-rose-800"
                      : task.priority === "High"
                      ? "bg-amber-100 text-amber-800"
                      : task.priority === "Medium"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {task.priority}
                </span>

                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Delete task"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE TASK MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Add Academic Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement Raft leader election algorithm"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Description / Milestone Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Add specific requirements or reference chapters..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e: any) => setNewPriority(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-700 bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-700 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Associate With Project (Optional)
                </label>
                <select
                  value={newProjectId}
                  onChange={(e) => setNewProjectId(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-700 bg-white"
                >
                  <option value="">No Project (General Task)</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingTask}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition disabled:opacity-50"
                >
                  {savingTask ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                  <span>Save Task</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
