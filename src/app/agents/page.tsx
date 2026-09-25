import Link from "next/link";
import { PublicHeader } from "@/components/public/Header";
import { PublicFooter } from "@/components/public/Footer";
import {
  Layers,
  PenTool,
  Code2,
  BookOpen,
  Briefcase,
  MessageSquareQuote,
  ArrowRight,
  Shield,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function AgentsPublicPage() {
  const activeAgents = [
    {
      id: "writing-buddy",
      name: "Writing Buddy",
      role: "Academic & Technical Writer",
      category: "Writing",
      icon: PenTool,
      color: "border-amber-200 bg-amber-50/50 text-amber-600",
      description: "Helps refine engineering reports, capstone documentation, presentation decks, and formal academic correspondence.",
      capabilities: [
        "Transform passive or convoluted sentences into concise active voice",
        "Structure thesis abstracts and IEEE-style research papers",
        "Format professional correspondence to faculty and supervisors",
        "Highlight citation standards and grammatical clarity",
      ],
      prompts: [
        "Review my project abstract for clarity and conciseness.",
        "Draft a polite email to my professor requesting feedback on our draft report.",
        "Rewrite this paragraph to eliminate passive voice.",
      ],
    },
    {
      id: "project-guide",
      name: "Project Guide",
      role: "Architecture & Viva Advisor",
      category: "Academic Projects",
      icon: Layers,
      color: "border-purple-200 bg-purple-50/50 text-purple-600",
      description: "Mentors engineering students from initial problem formulation through architectural design, milestone scheduling, and viva defense presentation.",
      capabilities: [
        "Advise on system design, database schemas, and microservice trade-offs",
        "Break capstone deliverables into actionable task backlogs",
        "Simulate adversarial viva defense evaluation questions",
        "Review project documentation and architectural diagrams",
      ],
      prompts: [
        "What are the pros and cons of choosing SQLite vs PostgreSQL for our semester prototype?",
        "Can you suggest 5 viva questions a professor might ask about our authentication flow?",
        "Break down our e-commerce project into 4 sprint milestones.",
      ],
    },
    {
      id: "code-mentor",
      name: "Code Mentor",
      role: "Software Engineering Tutor",
      category: "Coding",
      icon: Code2,
      color: "border-cyan-200 bg-cyan-50/50 text-cyan-600",
      description: "Assists with algorithmic problem-solving, code readability, performance analysis, and identifying edge case bugs.",
      capabilities: [
        "Provide line-by-line debugging guidance without dumping answer code",
        "Explain time and space complexity (Big-O analysis)",
        "Suggest modular refactoring and test-driven development practices",
        "Encourage sound software engineering principles (DRY, SOLID)",
      ],
      prompts: [
        "Why is my recursive binary search tree traversal exceeding the call stack?",
        "Explain the difference between optimistic and pessimistic locking in databases.",
        "How do I write a Vitest unit test for an asynchronous authentication route?",
      ],
    },
  ];

  const futureScopeAgents = [
    {
      id: "study-coach",
      name: "Study Coach",
      role: "Academic & Exam Tutor",
      category: "Studying",
      icon: BookOpen,
      description: "Personalized study plans, active recall quizzes, and revision schedules. Reserved for the end-semester semantic memory phase.",
    },
    {
      id: "career-scout",
      name: "Career Scout",
      role: "Placement Strategist",
      category: "Career Preparation",
      icon: Briefcase,
      description: "Resume bullet optimization and placement roadmaps. Reserved for the end-semester integration phase.",
    },
    {
      id: "interview-coach",
      name: "Interview Coach",
      role: "Mock Interviewer",
      category: "Interview Preparation",
      icon: MessageSquareQuote,
      description: "Interactive mock interviews using STAR method. Reserved for the end-semester multi-modal audio/interactive phase.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicHeader />

      <main className="flex-1 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">The Student AI Team</span>
            <h1 className="mt-2 text-4xl font-extrabold text-slate-900 sm:text-5xl">
              Specialized Academic Mentors
            </h1>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              Explore our active specialized mentors for writing, project architecture, and coding, along with our planned future scope agents.
            </p>
          </div>

          {/* ACTIVE AGENTS SECTION */}
          <div className="mt-16 space-y-12">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                Active in Current Scope
              </span>
              <span className="text-xs text-slate-500 font-medium">Available now for interactive workspace discussion</span>
            </div>

            {activeAgents.map((agent) => {
              const IconComp = agent.icon;
              return (
                <div
                  key={agent.id}
                  id={agent.id}
                  className="rounded-2xl border-2 border-indigo-200/80 bg-white p-8 shadow-sm hover:shadow-md transition scroll-mt-24"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className={`p-3.5 rounded-xl border ${agent.color}`}>
                        <IconComp className="h-7 w-7" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-2xl font-bold text-slate-900">{agent.name}</h2>
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                            {agent.category}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-500">{agent.role}</p>
                      </div>
                    </div>

                    <Link
                      href={`/signup?agent=${agent.id}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
                    >
                      Chat With {agent.name} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <p className="mt-6 text-sm text-slate-700 leading-relaxed font-normal">
                    {agent.description}
                  </p>

                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Capabilities */}
                    <div className="rounded-xl bg-slate-50 p-5 border border-slate-100">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Key Capabilities
                      </h3>
                      <ul className="space-y-2 text-xs text-slate-600">
                        {agent.capabilities.map((cap, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-indigo-600 font-bold">•</span>
                            <span>{cap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Example Prompts */}
                    <div className="rounded-xl bg-indigo-50/50 p-5 border border-indigo-100/60">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-3 flex items-center gap-1.5">
                        <Shield className="h-4 w-4 text-indigo-600" /> Suggested Prompts
                      </h3>
                      <div className="space-y-2">
                        {agent.prompts.map((prm, i) => (
                          <div
                            key={i}
                            className="rounded-lg bg-white p-2.5 text-xs text-slate-700 border border-slate-200/60 font-mono"
                          >
                            &ldquo;{prm}&rdquo;
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* FUTURE SCOPE AGENTS SECTION */}
          <div className="mt-20">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6">
              <span className="rounded-full bg-slate-200 text-slate-700 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                Planned for End-Semester Scope
              </span>
              <span className="text-xs text-slate-500 font-medium">Documented as future roadmap scope</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {futureScopeAgents.map((agent) => {
                const IconComp = agent.icon;
                return (
                  <div
                    key={agent.id}
                    className="rounded-2xl border border-slate-200 bg-white/60 p-6 opacity-75"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 rounded-xl bg-slate-100 text-slate-600">
                        <IconComp className="h-6 w-6" />
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        <Clock className="h-3 w-3" /> Future Scope
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-800">{agent.name}</h3>
                    <span className="text-xs text-slate-400 block mb-2">{agent.role}</span>
                    <p className="text-xs text-slate-500 leading-relaxed">{agent.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
