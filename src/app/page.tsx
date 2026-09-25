import Link from "next/link";
import { PublicHeader } from "@/components/public/Header";
import { PublicFooter } from "@/components/public/Footer";
import {
  Sparkles,
  BookOpen,
  Layers,
  Briefcase,
  PenTool,
  Code2,
  MessageSquareQuote,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  FileCheck2,
  Check,
  HelpCircle,
} from "lucide-react";

export default function LandingPage() {
  const activeAgents = [
    {
      id: "writing-buddy",
      name: "Writing Buddy",
      role: "Academic & Technical Writer",
      description: "Structure research reports, eliminate passive voice, and polish seminar presentation decks.",
      icon: PenTool,
      color: "from-amber-500 to-orange-600",
      bgLight: "bg-amber-50 text-amber-600",
    },
    {
      id: "project-guide",
      name: "Project Guide",
      role: "Architecture & Viva Advisor",
      description: "Break complex course capstones into milestones, refine engineering designs, and rehearse defense questions.",
      icon: Layers,
      color: "from-purple-500 to-indigo-600",
      bgLight: "bg-purple-50 text-purple-600",
    },
    {
      id: "code-mentor",
      name: "Code Mentor",
      role: "Software Engineering Tutor",
      description: "Deep dive into algorithms, trace elusive runtime bugs, and understand system architecture principles.",
      icon: Code2,
      color: "from-cyan-500 to-blue-600",
      bgLight: "bg-cyan-50 text-cyan-600",
    },
  ];

  const futureAgents = [
    {
      id: "study-coach",
      name: "Study Coach",
      role: "Academic & Exam Tutor",
      description: "Structured revision plans, active recall quizzes, and foundational explanations without shortcuts.",
      icon: BookOpen,
      bgLight: "bg-blue-50 text-blue-600",
    },
    {
      id: "career-scout",
      name: "Career Scout",
      role: "Placement Strategist",
      description: "Match skill gaps for dream tech companies, review resume bullet points, and draft tailored cover letters.",
      icon: Briefcase,
      bgLight: "bg-emerald-50 text-emerald-600",
    },
    {
      id: "interview-coach",
      name: "Interview Coach",
      role: "Mock Interviewer",
      description: "Practice technical and behavioral viva questions using the structured STAR framework with real-time feedback.",
      icon: MessageSquareQuote,
      bgLight: "bg-rose-50 text-rose-600",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Set Up Your Academic Profile",
      desc: "Tell Vidya Sarthi your university, degree, active subjects, upcoming viva dates, and target tech roles.",
    },
    {
      step: "02",
      title: "Collaborate With Specialized Mentors",
      desc: "Chat with targeted agents for coding, project documentation, file summarization, and interview prep.",
    },
    {
      step: "03",
      title: "Stay In Control With Human Approvals",
      desc: "Every workspace modification—from scheduling a task to logging a project—requires your explicit confirmation.",
    },
  ];

  const faqs = [
    {
      q: "How does Vidya Sarthi differ from a generic chatbot?",
      a: "Generic chatbots give isolated responses. Vidya Sarthi integrates 6 specialized student mentors directly into a unified academic workspace with your subjects, deadlines, project tasks, files, and placement applications.",
    },
    {
      q: "Does Vidya Sarthi solve live exams for me?",
      a: "No. Vidya Sarthi enforces an explicit AI safety policy. We promote foundational comprehension, active recall, and project design. We do not participate in live exam solving or academic misconduct.",
    },
    {
      q: "What is Human-in-the-Loop Approval?",
      a: "Autonomous AI agents can sometimes make unintended changes. In Vidya Sarthi, whenever an agent proposes creating a task or changing a project, an approval card is presented so you retain full authority.",
    },
    {
      q: "Is there any cost for students in this version?",
      a: "No. The mid-viva version is completely free for academic evaluation. Billing is intentionally disabled in this MVP.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicHeader />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),theme(colors.slate.50))]" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
              <span>Next-Gen Academic AI Workspace</span>
              <span className="rounded bg-indigo-600/10 px-1.5 py-0.5 text-[10px] text-indigo-800">Mid-Viva MVP</span>
            </div>

            {/* Headline */}
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl max-w-4xl mx-auto leading-tight">
              Your Personal AI Team to{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-800 bg-clip-text text-transparent">
                Study Smarter, Build Projects,
              </span>{" "}
              & Ace Placements.
            </h1>

            {/* Subheading */}
            <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Vidya Sarthi is not just a chatbot. It combines six specialized AI mentors with your personal curriculum,
              project tasks, study files, and career tracking with human-in-the-loop control.
            </p>

            {/* Action buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 active:scale-95 transition"
              >
                Launch Student Workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/how-it-works"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-7 py-3.5 text-base font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
              >
                See How It Works
              </Link>
            </div>

            {/* Trust highlights */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 100% Free Mid-Viva Evaluation Tier
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-indigo-600" /> Human Approval for All Agent Actions
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-slate-600" /> Private & User-Scoped Data
              </span>
            </div>

            {/* Visual-only Product Dashboard Mockup Preview */}
            <div className="mt-14 mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl sm:p-4">
              <div className="rounded-xl border border-slate-100 bg-slate-900/5 p-2">
                <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5 rounded-t-lg">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-rose-400" />
                    <div className="h-3 w-3 rounded-full bg-amber-400" />
                    <div className="h-3 w-3 rounded-full bg-emerald-400" />
                    <span className="ml-3 text-xs font-medium text-slate-400">vidyasarthi.app/workspace (Visual Preview)</span>
                  </div>
                  <span className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600">
                    Illustrative Mockup
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 text-left rounded-b-lg">
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">Today&apos;s Focus</span>
                      <BookOpen className="h-4 w-4 text-indigo-600" />
                    </div>
                    <p className="mt-2 text-sm font-bold text-slate-800">Database Systems Viva Prep</p>
                    <p className="text-xs text-slate-500 mt-1">Study Coach created 4 flashcards and 1 quiz</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">Active Project</span>
                      <Layers className="h-4 w-4 text-purple-600" />
                    </div>
                    <p className="mt-2 text-sm font-bold text-slate-800">Distributed File System</p>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full w-2/3 bg-purple-600 rounded-full" />
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-500">Human Approval Pending</span>
                      <Zap className="h-4 w-4 text-amber-600" />
                    </div>
                    <p className="mt-2 text-sm font-bold text-slate-800">Create Task: Benchmarking</p>
                    <span className="mt-1 inline-block rounded bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                      Requires Approval
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SPECIALIZED AGENTS SECTION */}
        <section id="agents" className="py-20 bg-white border-y border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">The Student AI Team</span>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                Active Specialized Mentors
              </h2>
              <p className="mt-4 text-base text-slate-600">
                Vidya Sarthi provides dedicated agents with distinct personas, grounded context, and safety constraints.
              </p>
            </div>

            {/* 3 Active Agents */}
            <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
              {activeAgents.map((agent) => {
                const IconComponent = agent.icon;
                return (
                  <div
                    key={agent.id}
                    className="relative flex flex-col justify-between rounded-2xl border-2 border-indigo-200/80 bg-white p-6 shadow-sm hover:shadow-md hover:border-indigo-400 transition group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`inline-flex p-3 rounded-xl ${agent.bgLight}`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                          Active Now
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition">
                        {agent.name}
                      </h3>
                      <span className="text-xs font-semibold text-slate-400 block mb-2">{agent.role}</span>
                      <p className="text-sm text-slate-600 leading-relaxed">{agent.description}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        href={`/agents#${agent.id}`}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                      >
                        Explore capabilities <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Future Scope Agents Preview */}
            <div className="mt-16 rounded-2xl border border-slate-200 bg-slate-50/60 p-8">
              <div className="text-center max-w-xl mx-auto mb-8">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Roadmap</span>
                <h3 className="text-lg font-bold text-slate-800 mt-1">Planned for End-Semester Scope</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Additional mentors reserved for the end-semester autonomous orchestration phase.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {futureAgents.map((agent) => {
                  const IconComponent = agent.icon;
                  return (
                    <div
                      key={agent.id}
                      className="rounded-xl border border-slate-200 bg-white/70 p-5 opacity-80"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className={`inline-flex p-2.5 rounded-lg ${agent.bgLight}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <span className="rounded-full bg-slate-100 text-slate-500 px-2 py-0.5 text-[10px] font-bold">
                          Future Scope
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">{agent.name}</h4>
                      <span className="text-[11px] text-slate-400 block mb-1">{agent.role}</span>
                      <p className="text-xs text-slate-500 line-clamp-2">{agent.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* THREE-STEP WORKFLOW */}
        <section id="workflow" className="py-20 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">System Workflow</span>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                How Vidya Sarthi Powers Your Semester
              </h2>
            </div>

            <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((st) => (
                <div key={st.step} className="rounded-2xl border border-slate-200 bg-white p-8 relative shadow-sm">
                  <div className="text-3xl font-black text-indigo-200/80 mb-4">{st.step}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{st.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{st.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* USE CASES SECTION */}
        <section id="use-cases" className="py-20 bg-white border-t border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Student Use Cases</span>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                Built Specifically for Engineering & College Life
              </h2>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-100 p-2 text-indigo-600">
                    <FileCheck2 className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">Document Summarization & Active Recall</h3>
                </div>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  Upload lecture notes, textbook chapters, or lab manuals. Generate instant study summaries, 
                  active recall flashcards, and practice quizzes to test your understanding before mid-terms.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-purple-100 p-2 text-purple-600">
                    <Layers className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">Project Milestone Architecture & Viva Defense</h3>
                </div>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  Define your capstone project goals. Project Guide helps you structure architecture diagrams,
                  assign development tasks with due dates, and simulate professor viva defense questions.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">Internship & Placement Pipeline</h3>
                </div>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  Track every application from wishlist to offer. Run ATS resume keyword gap analysis
                  and generate tailored cover letter drafts without automated risky submissions.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-rose-100 p-2 text-rose-600">
                    <MessageSquareQuote className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">STAR Method Technical & Behavioral Mocks</h3>
                </div>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  Practice tricky behavioral prompts and technical questions with Interview Coach.
                  Receive constructive critiques on articulation, clarity, and depth.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING PREVIEW */}
        <section id="pricing" className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Pricing & Evaluation</span>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                Free for Academic Evaluation
              </h2>
              <p className="mt-3 text-sm text-slate-500">
                Billing is intentionally disabled in this mid-viva MVP.
              </p>
            </div>

            <div className="mt-12 max-w-lg mx-auto rounded-3xl border-2 border-indigo-600 bg-white p-8 shadow-xl relative">
              <div className="absolute -top-3.5 right-8 rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
                Mid-Viva Scholar Tier
              </div>
              <h3 className="text-xl font-bold text-slate-900">Student Scholar</h3>
              <p className="text-sm text-slate-500 mt-1">Full access to all 6 specialized agents and workspace tools</p>
              <div className="mt-6 flex items-baseline">
                <span className="text-5xl font-extrabold text-slate-900">₹0</span>
                <span className="ml-2 text-sm text-slate-500">/ semester (Academic Demo)</span>
              </div>

              <ul className="mt-8 space-y-3.5 text-sm text-slate-700">
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>Access to all 6 Specialized AI Mentors</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>Full Project & Task Management Board</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>File uploads (PDF, DOCX, TXT, MD) up to 10MB</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>Study Summary, Flashcard & Quiz Generation</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span>Human-in-the-Loop Approval & Full Audit Log</span>
                </li>
              </ul>

              <div className="mt-8">
                <Link
                  href="/signup"
                  className="block w-full text-center rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition"
                >
                  Create Student Account
                </Link>
              </div>
              <p className="mt-3 text-center text-[11px] text-slate-400">
                No credit card required. Illustrative evaluation metrics.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="py-20 bg-white border-t border-slate-200">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Frequently Asked Questions</span>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
                Questions on AI Safety & Academic Integrity
              </h2>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
                  <h3 className="font-bold text-slate-900 text-base flex items-start gap-2.5">
                    <HelpCircle className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span>{faq.q}</span>
                  </h3>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed pl-7.5">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL SIGNUP CTA */}
        <section className="py-16 bg-gradient-to-tr from-indigo-700 to-violet-800 text-white text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Ready to Upgrade Your Academic Performance?
            </h2>
            <p className="mt-4 text-indigo-100 max-w-2xl mx-auto">
              Join Vidya Sarthi now to get your personal team of study, coding, project, and interview mentors.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-bold text-indigo-700 shadow-md hover:bg-indigo-50 transition"
              >
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
