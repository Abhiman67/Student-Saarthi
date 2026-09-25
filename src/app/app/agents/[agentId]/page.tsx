"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  Loader2,
  Sparkles,
  BookOpen,
  Layers,
  Briefcase,
  PenTool,
  Code2,
  MessageSquareQuote,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trash2,
  Quote,
  Check,
} from "lucide-react";

interface MessageItem {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  citations?: string | null;
  approvalRequired?: boolean;
  approvalId?: string | null;
  createdAt: string;
}

interface ApprovalItem {
  id: string;
  actionType: string;
  description: string;
  payload: string;
  status: "Pending" | "Approved" | "Denied";
}

export default function AgentChatPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const agentId = (params.agentId as string) || "study-coach";
  const initialConvId = searchParams.get("conversationId");

  const [agent, setAgent] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(initialConvId);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingApprovals, setPendingApprovals] = useState<Record<string, ApprovalItem>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested prompts for each agent
  const promptMap: Record<string, string[]> = {
    "study-coach": [
      "Explain the CAP Theorem for distributed systems with real-world examples.",
      "Create a 4-day revision roadmap for Database Normalization.",
      "Add a task to schedule a 2-hour Operating Systems review tomorrow.",
    ],
    "project-guide": [
      "Propose an architecture design for a student portfolio tracker using Next.js & SQLite.",
      "What viva questions will the external examiner ask about authentication security?",
      "Create a task to build database migrations and seed scripts.",
    ],
    "career-scout": [
      "Review my resume summary using the Google XYZ accomplishment formula.",
      "What top 5 technical skills should I highlight for a Junior Backend role?",
      "Add a task to apply for 3 summer software engineering internships.",
    ],
    "writing-buddy": [
      "Critique this project abstract for active voice and technical clarity.",
      "Draft an outline for an IEEE-style engineering conference paper.",
      "How should I write an email to my project supervisor requesting code review?",
    ],
    "code-mentor": [
      "Explain the difference between optimistic and pessimistic concurrency control.",
      "Why is my recursive binary search tree hitting maximum call stack size?",
      "How do I write unit tests for protected Next.js API route handlers in Vitest?",
    ],
    "interview-coach": [
      "Conduct a mock interview question on resolving conflicts in team engineering projects.",
      "Ask me a technical question on ACID database properties and evaluate my response.",
      "How do I structure my answer using the STAR method for a viva defense?",
    ],
  };

  useEffect(() => {
    // Fetch agent info & conversations
    setInitialLoading(true);
    fetch(`/api/agents/${agentId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.agent) {
          setAgent(data.agent);
          setConversations(data.conversations || []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setInitialLoading(false));
  }, [agentId]);

  useEffect(() => {
    // If conversationId is active, load its messages
    if (activeConvId) {
      fetch(`/api/conversations/${activeConvId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.conversation) {
            setMessages(data.conversation.messages || []);
          }
        })
        .catch((err) => console.error(err));
    } else {
      setMessages([]);
    }
  }, [activeConvId]);

  useEffect(() => {
    // Fetch user approvals to match approvalId
    fetch("/api/approvals")
      .then((res) => res.json())
      .then((data) => {
        if (data.approvals) {
          const map: Record<string, ApprovalItem> = {};
          data.approvals.forEach((app: ApprovalItem) => {
            map[app.id] = app;
          });
          setPendingApprovals(map);
        }
      })
      .catch(() => {});
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || loading) return; // Prevent duplicate submit or empty message

    setError(null);
    setInputMessage("");

    // Optimistic user message
    const tempUserMsg: MessageItem = {
      id: "temp-" + Date.now(),
      role: "user",
      content: textToSend,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId,
          conversationId: activeConvId || undefined,
          message: textToSend,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message || "Failed to receive response from mentor.");
        setLoading(false);
        return;
      }

      if (data.conversationId && !activeConvId) {
        setActiveConvId(data.conversationId);
      }

      setMessages((prev) => {
        const withoutTemp = prev.filter((m) => m.id !== tempUserMsg.id);
        return [...withoutTemp, data.userMessage, data.assistantMessage];
      });

      // Refresh conversations list
      fetch(`/api/conversations?agentId=${agentId}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.conversations) setConversations(d.conversations);
        });

      setLoading(false);
    } catch {
      setError("Network error. Please try sending your message again.");
      setLoading(false);
    }
  };

  const handleApprovalDecision = async (approvalId: string, decision: "Approved" | "Denied") => {
    try {
      const res = await fetch(`/api/approvals/${approvalId}/decide`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });

      const data = await res.json();
      if (res.ok && data.approval) {
        setPendingApprovals((prev) => ({
          ...prev,
          [approvalId]: data.approval,
        }));
      }
    } catch (err) {
      console.error("Error making approval decision:", err);
    }
  };

  const handleDeleteConversation = async (convId: string) => {
    if (!confirm("Are you sure you want to delete this discussion?")) return;
    try {
      await fetch(`/api/conversations/${convId}`, { method: "DELETE" });
      setConversations((prev) => prev.filter((c) => c.id !== convId));
      if (activeConvId === convId) {
        setActiveConvId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    }
  };

  const getAgentIcon = (id: string) => {
    switch (id) {
      case "study-coach":
        return <BookOpen className="h-5 w-5 text-blue-600" />;
      case "project-guide":
        return <Layers className="h-5 w-5 text-purple-600" />;
      case "career-scout":
        return <Briefcase className="h-5 w-5 text-emerald-600" />;
      case "writing-buddy":
        return <PenTool className="h-5 w-5 text-amber-600" />;
      case "code-mentor":
        return <Code2 className="h-5 w-5 text-cyan-600" />;
      case "interview-coach":
        return <MessageSquareQuote className="h-5 w-5 text-rose-600" />;
      default:
        return <Sparkles className="h-5 w-5 text-indigo-600" />;
    }
  };

  if (initialLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <Link
            href="/app/agents"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200/60 transition"
            title="Back to agents list"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="rounded-xl bg-white p-2 border border-slate-200 shadow-xs">
            {getAgentIcon(agentId)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900">{agent?.name || "Academic Mentor"}</h1>
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600">
                {agent?.category || "Specialized Agent"}
              </span>
            </div>
            <p className="text-xs text-slate-500">{agent?.role}</p>
          </div>
        </div>

        {activeConvId && (
          <button
            onClick={() => handleDeleteConversation(activeConvId)}
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-rose-600 transition p-1.5 rounded-lg hover:bg-rose-50"
            title="Delete this discussion"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>
        )}
      </div>

      {/* Main Conversation & Sidebar Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat History Drawer */}
        <div className="hidden md:flex w-64 flex-col border-r border-slate-100 bg-slate-50/30 p-3 overflow-y-auto">
          <button
            onClick={() => {
              setActiveConvId(null);
              setMessages([]);
            }}
            className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/60 py-2 px-3 text-xs font-bold text-indigo-700 hover:bg-indigo-100/60 transition mb-3"
          >
            <Sparkles className="h-3.5 w-3.5" /> New Discussion
          </button>

          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-1">
            Previous Sessions
          </span>

          <div className="space-y-1">
            {conversations.length === 0 ? (
              <p className="text-[11px] text-slate-400 px-2 py-3 text-center">No past chats yet</p>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`w-full text-left rounded-lg px-2.5 py-2 text-xs font-medium transition truncate ${
                    activeConvId === conv.id
                      ? "bg-white font-bold text-indigo-700 shadow-xs border border-slate-200"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {conv.title}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Message Stream Area */}
        <div className="flex flex-1 flex-col overflow-hidden bg-slate-50/20">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.length === 0 ? (
              /* Empty State with Suggested Prompts */
              <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto py-8">
                <div className="rounded-2xl bg-white p-4 border border-slate-200 shadow-xs mb-3">
                  {getAgentIcon(agentId)}
                </div>
                <h2 className="text-lg font-bold text-slate-800">
                  Discuss with {agent?.name || "your mentor"}
                </h2>
                <p className="mt-1 text-xs text-slate-500 max-w-md">
                  {agent?.description || "Ask conceptual queries, request project breakdowns, or review your study material."}
                </p>

                {/* Suggested Prompts */}
                <div className="mt-6 w-full space-y-2 text-left">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Suggested Academic Prompts:
                  </span>
                  {(promptMap[agentId] || []).map((promptText, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(promptText)}
                      className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700 hover:border-indigo-400 hover:bg-indigo-50/30 transition text-left shadow-xs flex items-center justify-between group"
                    >
                      <span>&ldquo;{promptText}&rdquo;</span>
                      <Send className="h-3 w-3 text-slate-300 group-hover:text-indigo-600 transition flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => {
                const isUser = msg.role === "user";
                let citationsList: string[] = [];
                if (msg.citations) {
                  try {
                    citationsList = JSON.parse(msg.citations);
                  } catch {}
                }

                // Check for linked approval
                const approval = msg.approvalId ? pendingApprovals[msg.approvalId] : null;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-2xl rounded-2xl p-4 text-sm leading-relaxed ${
                        isUser
                          ? "bg-indigo-600 text-white rounded-br-xs shadow-xs"
                          : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.content}</div>

                      {/* Citations Footer */}
                      {citationsList.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                          <span className="font-semibold flex items-center gap-1 text-[11px] text-indigo-600 mb-1">
                            <Quote className="h-3 w-3" /> Grounded References & Citations:
                          </span>
                          <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                            {citationsList.map((cite, idx) => (
                              <li key={idx}>{cite}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Human-In-The-Loop Approval Card */}
                      {approval && (
                        <div className="mt-4 rounded-xl border-2 border-amber-300 bg-amber-50/90 p-3.5 text-slate-900">
                          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-1">
                            <ShieldAlert className="h-4 w-4 text-amber-600" />
                            <span>Human-In-The-Loop Approval Required</span>
                          </div>
                          <p className="text-xs text-slate-700">{approval.description}</p>
                          <span className="text-[10px] text-slate-500 block mt-1">
                            Proposed Action: <span className="font-mono">{approval.actionType}</span>
                          </span>

                          <div className="mt-3 pt-2 border-t border-amber-200/80 flex items-center justify-between">
                            <span className="text-xs font-bold">
                              Status:{" "}
                              <span
                                  className={`uppercase text-[10px] px-2 py-0.5 rounded ${
                                    approval.status === "Approved"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : approval.status === "Denied"
                                      ? "bg-rose-100 text-rose-800"
                                      : "bg-amber-200 text-amber-900"
                                  }`}
                              >
                                {approval.status}
                              </span>
                            </span>

                            {approval.status === "Pending" ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleApprovalDecision(approval.id, "Denied")}
                                  className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition"
                                >
                                  <XCircle className="h-3.5 w-3.5" /> Deny
                                </button>
                                <button
                                  onClick={() => handleApprovalDecision(approval.id, "Approved")}
                                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs transition"
                                >
                                  <Check className="h-3.5 w-3.5" /> Approve Action
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-500 italic">
                                Action recorded in Audit Log
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                );
              })
            )}

            {/* Typing State */}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 max-w-xs shadow-xs">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                <span>{agent?.name} is thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Error Banner with Retry */}
          {error && (
            <div className="mx-4 mb-2 rounded-xl bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-700 flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => handleSendMessage()}
                className="inline-flex items-center gap-1 font-bold text-rose-800 hover:underline"
              >
                <RotateCcw className="h-3 w-3" /> Retry
              </button>
            </div>
          )}

          {/* Input Box */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Ask ${agent?.name || "your mentor"} (e.g. explain a concept, create a task)...`}
                disabled={loading}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 shadow-xs"
              />
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>Encourages academic learning. System prompts & secrets are protected.</span>
              <span>Human Approval required for workspace changes.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
