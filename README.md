# Vidya Sarthi - Personal AI Student Team Workspace

> **Mid-Viva Academic Prototype (Version 1.0)**  
> *A personal AI team for students to study smarter, build better projects, and prepare for career placement.*

---

## 1. Project Overview

**Vidya Sarthi** is a student-focused AI SaaS workspace that combines specialized AI mentors with real academic workflows. Unlike generic chatbots that treat each prompt in isolation, Vidya Sarthi grounds conversations in the student's actual curriculum, active subjects, engineering projects, task milestones, uploaded study files, and career applications.

Crucially, Vidya Sarthi enforces **Human-in-the-Loop Governance**: AI agents cannot autonomously modify a student's workspace (such as scheduling tasks or modifying projects) without explicit human approval via interactive approval cards and audit logging.

### Active Mentors (Mid-Viva Scope)
1. **Writing Buddy**: Academic report structuring, IEEE paper formatting, active voice editing, literature review outlining, and formal correspondence.
2. **Project Guide**: Capstone architecture advice, milestone planning, viva defense preparation, and technical trade-off evaluations.
3. **Code Mentor**: Algorithmic problem-solving, runtime debugging, clean architecture guidance, and design pattern mentoring without answer-dumping.

### Planned Mentors (End-Semester Future Scope)
4. **Study Coach**: Syllabus breakdown, exam preparation roadmaps, active recall flashcards, and concept revision.
5. **Career Scout**: Internship tracking, resume bullet review (Google XYZ framework), ATS keyword gap analysis, and cover letter drafts.
6. **Interview Coach**: STAR framework behavioral preparation, technical challenge simulations, and structured delivery critiques.

---

## 2. Technology Stack

- **Framework**: Next.js 14 (App Router)
- **UI & Styling**: React 18, Tailwind CSS, Lucide React
- **Language**: TypeScript
- **Database & ORM**: SQLite (`dev.db`) with Prisma ORM
- **Authentication**: Credentials authentication with bcryptjs password hashing and jose JWT HTTP-only sessions
- **Validation**: Zod
- **Testing**: Vitest (14 automated unit & multi-tenant integration tests)

---

## 3. Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="vidya-sarthi-dev-secret-key-at-least-32-chars-long-12345678"
NEXT_PUBLIC_APP_NAME="Vidya Sarthi"

# Optional: Add an OpenAI API key if live LLM generation is desired.
# When empty, Vidya Sarthi uses a high-quality deterministic mentor response engine.
OPENAI_API_KEY=""
```

---

## 4. Setup & Installation Commands

```bash
# 1. Install dependencies
npm install

# 2. Push Prisma database schema to SQLite
npm run db:push

# 3. Seed default specialized agents into the database
npm run db:seed
```

---

## 5. Development, Testing & Build Commands

```bash
# Run local development server
npm run dev

# Run TypeScript typecheck
npm run typecheck

# Run ESLint validation
npm run lint

# Run Vitest test suite
npm test

# Build production bundle
npm run build
```

---

## 6. Manual Viva Demonstration Flow (Section 25)

Follow this exact sequence for a viva evaluation:

1. **Public Marketing Page**: Open `/` to view the SaaS landing page with hero, agent previews, 3-step workflow, use cases, pricing, and FAQ.
2. **Public Directory**: Navigate to `/agents` to review capabilities and sample prompts for all 6 agents.
3. **How It Works & Pricing**: Open `/how-it-works` and `/pricing` to verify academic evaluation tier (Billing is explicitly disabled in this MVP).
4. **Student Signup**: Click **Get Started** (`/signup`), fill in name, email, and password.
5. **Onboarding Wizard**: In `/onboarding`, complete the 3-step profile (University, Degree, Active Subjects, Goals, Skills).
6. **Workspace Dashboard**: Lands on `/app`, displaying today's focus, project metrics, upcoming tasks, and quick actions.
7. **Agent Chat & Safety Guardrails**: Open `/app/agents/study-coach`. Ask a conceptual query (e.g., *"Explain CAP theorem"*). The agent provides a structured breakdown and citation.
8. **Human-in-the-Loop Approval**: In the chat, send *"Add a task to review database normalization tomorrow"*. The agent generates an interactive **Approval Card**. Click **Approve Action**; the action is executed and logged.
9. **Project Management**: Go to `/app/projects/new`. Create a capstone project. Open `/app/projects/[projectId]` to add milestones and observe progress tracking.
10. **Task Board**: Go to `/app/tasks`. Switch between **All Tasks**, **Today View**, **Week View**, and **Calendar View**. Mark tasks complete.
11. **Study File Extraction & Tools**: Go to `/app/files`. Upload a PDF/TXT/MD document. Click **Generate Summary**, **Active Recall Flashcards**, and **Practice Quiz**.
12. **Career Placement Tracker**: Go to `/app/career`. Add an internship application. Run **Resume & Skill-Gap Analysis** and generate a **Cover Letter Draft** (with user review disclaimer).
13. **Usage & Quotas**: Open `/app/usage` to verify plan metrics and the non-billing MVP status notice.
14. **Settings, Governance & Audit**: Open `/app/settings/audit` to review the audit log. Test `/app/settings/privacy` data export (downloads JSON backup).
15. **Logout & Protection**: Click Logout. Attempting to visit `/app` immediately redirects to `/login`.

---

## 7. Known Limitations (Mid-Viva MVP)

- **Database Engine**: Uses SQLite for local zero-configuration demonstration; migration to PostgreSQL is reserved for final deployment.
- **AI Provider**: When `OPENAI_API_KEY` is not configured, deterministic structured mock responses are returned to guarantee reliable offline demos.
- **File Processing**: Performs text extraction from uploaded files; semantic embeddings and vector chunking belong to future scope.
- **No Background Workers**: Multi-step workflows run synchronously in Next.js route handlers rather than distributed Redis queues.

---

## 8. Features Reserved for End-Semester Scope

See [`FUTURE_SCOPE.md`](file:///Users/abhishek/Desktop/Student%20Saarthi%20/FUTURE_SCOPE.md) for the complete end-semester architectural blueprint, including:
- PostgreSQL + `pgvector` semantic memory
- Persistent `AgentRun`, `AgentStep`, and `ToolCall` state machines
- Multi-step planner & re-planning orchestrator
- Connectors for Google Classroom, Google Drive, and GitHub
- Institutional multi-tenant administration
