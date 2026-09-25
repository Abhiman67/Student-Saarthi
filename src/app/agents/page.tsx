import Link from "next/link";
import { PublicHeader } from "@/components/public/Header";
import { PublicFooter } from "@/components/public/Footer";
import {
  BookOpen,
  Layers,
  Briefcase,
  PenTool,
  Code2,
  MessageSquareQuote,
  ArrowRight,
  Shield,
  CheckCircle2,
} from "lucide-react";

export default function AgentsPublicPage() {
  const agents = [
    {
      id: "study-coach",
      name: "Study Coach",
      role: "Academic & Exam Tutor",
      category: "Studying",
      icon: BookOpen,
      color: "border-blue-200 bg-blue-50/50 text-blue-600",
      description: "Designed to help students build long-term concept retention through active recall, spaced repetition, study schedules, and step-by-step breakdowns.",
      capabilities: [
        "Synthesize difficult textbook chapters into core principles",
        "Generate multi-choice quizzes and revision flashcards",
        "Build customized day-by-day exam preparation schedules",
        "Strictly refuse to cheat or solve live examination questions",
      ],
      prompts: [
        "Explain the CAP theorem in distributed databases using an everyday analogy.",
        "Create a 5-day revision schedule for Operating System scheduling algorithms.",
        "Generate 3 flashcards testing my understanding of Normalization (1NF, 2NF, 3NF).",
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
      id: "career-scout",
      name: "Career Scout",
      role: "Placement & Internship Strategist",
      category: "Career Preparation",
      icon: Briefcase,
      color: "border-emerald-200 bg-emerald-50/50 text-emerald-600",
      description: "Guides students in mapping academic projects to market requirements, optimizing resumes using the STAR framework, and drafting personalized cover letters.",
      capabilities: [
        "Analyze job descriptions to detect technical skill gaps",
        "Format resume bullets using Google's XYZ accomplishment formula",
        "Draft tailored cover letters (requiring student review before sending)",
        "Never auto-apply or submit applications without human oversight",
      ],
      prompts: [
        "How can I rephrase my project bullet to sound more impact-driven?",
        "What skills am I missing for a Junior Frontend Developer position?",
        "Draft a cover letter for an internship at a cloud infrastructure startup.",
      ],
    },
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
        "Format professional correspondence to faculty and internship coordinators",
        "Highlight citation standards and grammatical clarity",
      ],
      prompts: [
        "Review my project abstract for clarity and conciseness.",
        "Draft a polite email to my professor requesting feedback on our draft report.",
        "Rewrite this paragraph to eliminate passive voice.",
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
        "Provide line-by-line debugging guidance without just dumping answer code",
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
    {
      id: "interview-coach",
      name: "Interview Coach",
      role: "Mock Interviewer & Feedback Coach",
      category: "Interview Preparation",
      icon: MessageSquareQuote,
      color: "border-rose-200 bg-rose-50/50 text-rose-600",
      description: "Simulates mock viva examinations and campus placement interviews, offering constructive critique on confidence, depth, and the STAR framework.",
      capabilities: [
        "Conduct interactive behavioral interview simulations",
        "Challenge students with real-world system design questions",
        "Provide actionable scoring on articulation, clarity, and depth",
        "Help students frame project challenges effectively",
      ],
      prompts: [
        "Conduct a mock interview question about handling conflicting team opinions.",
        "Ask me a technical question regarding database transactions and ACID properties.",
        "Evaluate my answer using the STAR framework.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicHeader />

      <main className="flex-1 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">The Specialized AI Team</span>
            <h1 className="mt-2 text-4xl font-extrabold text-slate-900 sm:text-5xl">
              Meet Your Six Academic Mentors
            </h1>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              Every agent in Vidya Sarthi has a dedicated role, specialized system prompt, and built-in safety policy.
              Explore how they collaborate to support your college journey.
            </p>
          </div>

          <div className="mt-16 space-y-12">
            {agents.map((agent) => {
              const IconComp = agent.icon;
              return (
                <div
                  key={agent.id}
                  id={agent.id}
                  className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition scroll-mt-24"
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
                        <Shield className="h-4 w-4 text-indigo-600" /> Suggested Viva & Prep Prompts
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
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
