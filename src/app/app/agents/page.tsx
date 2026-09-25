import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  Sparkles,
  BookOpen,
  Layers,
  Briefcase,
  PenTool,
  Code2,
  MessageSquareQuote,
  ArrowRight,
  MessageSquare,
  Clock,
} from "lucide-react";

export default async function AppAgentsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [activeAgents, futureScopeAgents, recentConversations] = await Promise.all([
    db.agent.findMany({
      where: { isFutureScope: false },
      orderBy: { name: "asc" },
    }),
    db.agent.findMany({
      where: { isFutureScope: true },
      orderBy: { name: "asc" },
    }),
    db.conversation.findMany({
      where: { userId: user.id },
      include: { agent: true, messages: { take: 1, orderBy: { createdAt: "desc" } } },
      orderBy: { updatedAt: "desc" },
      take: 6,
    }),
  ]);

  const getAgentIcon = (id: string) => {
    switch (id) {
      case "study-coach":
        return <BookOpen className="h-6 w-6 text-blue-600" />;
      case "project-guide":
        return <Layers className="h-6 w-6 text-purple-600" />;
      case "career-scout":
        return <Briefcase className="h-6 w-6 text-emerald-600" />;
      case "writing-buddy":
        return <PenTool className="h-6 w-6 text-amber-600" />;
      case "code-mentor":
        return <Code2 className="h-6 w-6 text-cyan-600" />;
      case "interview-coach":
        return <MessageSquareQuote className="h-6 w-6 text-rose-600" />;
      default:
        return <Sparkles className="h-6 w-6 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider">
          <Sparkles className="h-4 w-4" />
          <span>Active Mentors</span>
        </div>
        <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Specialized Academic AI Mentors
        </h1>
        <p className="mt-1 text-sm text-slate-500 max-w-2xl">
          Choose an active specialized mentor for technical writing, engineering project design, or code review.
        </p>
      </div>

      {/* Active Agents Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold uppercase tracking-wider">
            Active in Workspace ({activeAgents.length})
          </span>
          <span className="text-xs text-slate-500">Live chat & human approval cards enabled</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeAgents.map((agent) => (
            <div
              key={agent.id}
              className="flex flex-col justify-between rounded-2xl border-2 border-indigo-200/80 bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                    {getAgentIcon(agent.id)}
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {agent.category}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900">{agent.name}</h2>
                <span className="text-xs font-semibold text-indigo-600 block mb-2">{agent.role}</span>
                <p className="text-xs text-slate-600 leading-relaxed">{agent.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  href={`/app/agents/${agent.id}`}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 active:scale-95 transition"
                >
                  <span>Open Discussion</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Discussions List */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <MessageSquare className="h-4.5 w-4.5 text-indigo-600" />
          <span>Recent Agent Conversations</span>
        </h2>

        {recentConversations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-400 text-xs">
            No active conversations. Pick an active agent above to start learning or planning a project.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentConversations.map((conv) => (
              <Link
                key={conv.id}
                href={`/app/agents/${conv.agentId}?conversationId=${conv.id}`}
                className="block rounded-xl border border-slate-100 bg-slate-50 p-4 hover:bg-indigo-50/40 hover:border-indigo-200 transition group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition">
                    {conv.agent.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(conv.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-700 truncate">{conv.title}</p>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                  {conv.messages[0]?.content || "No messages yet"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Future Scope Agents Section */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-4 w-4 text-slate-500" />
          <h3 className="text-sm font-bold text-slate-800">Planned for End-Semester Scope</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          The following mentors are scheduled for integration during the end-semester autonomous orchestration phase:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {futureScopeAgents.map((agent) => (
            <div
              key={agent.id}
              className="rounded-xl border border-slate-200 bg-white/80 p-4 opacity-75"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">{agent.name}</span>
                <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  Future Scope
                </span>
              </div>
              <p className="text-[11px] text-slate-500">{agent.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
