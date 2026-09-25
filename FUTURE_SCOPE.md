# Vidya Sarthi - End-Semester Future Scope & Engineering Report

## 1. Features Excluded from Mid-Viva MVP

In accordance with Section 27 of `build.md`, the following advanced features are intentionally excluded from the Mid-Viva MVP and documented here as future work:

- Billing activation and Stripe payment gateways
- Computer control, desktop automation, and browser RPA
- Unrestricted shell command execution
- Automated job applications without human confirmation
- Automated email sending or contacting recruiters directly
- Google Classroom, Google Drive, Calendar, GitHub, and Notion integrations
- MCP (Model Context Protocol) external tool servers
- PostgreSQL migration and `pgvector` extension
- Redis message broker and BullMQ background workers
- S3 / MinIO object storage
- Persistent `AgentRun` orchestration state machine
- Dynamic `AgentStep` execution and Typed `ToolCall` framework
- Autonomous multi-step re-planning loop
- Production-scale APM monitoring and cost analytics

---

## 2. End-Semester Target Architecture

The full production architecture designed for the end-semester deployment transitions Vidya Sarthi from single-turn agent discussions to persistent, multi-step asynchronous autonomous execution:

```text
Next.js Frontend (React Server Components)
        ↓
API Gateway (JWT Edge Verification + Rate Limiting)
        ↓
Agent Orchestrator
   ├── Autonomous Planner
   ├── LLM Gateway (Streaming + Fallback Provider Pool)
   ├── Context & Memory Engine (pgvector + Embeddings)
   ├── Central Permission & Approval Service
   └── Typed Tool Runtime
          ├── Internal Workspace Tools (Projects, Tasks, Flashcards)
          ├── MCP Clients (Remote Context Providers)
          └── Approved External APIs (GitHub, Google Drive)
        ↓
Persistence Layer
   ├── PostgreSQL (Relational Data) + pgvector (Semantic Memory)
   ├── Redis (Job Queues + Transient Run State)
   ├── S3 Compatible Object Storage (Uploaded Documents)
   └── Immutable Audit Event Store
```

### Closed-Loop Execution Workflow

```text
User Goal
   ↓
Create AgentRun (State: Created)
   ↓
Planner Generates Action Plan (AgentSteps)
   ↓
Retrieve Context Chunks via Vector Search
   ↓
Execute Step via Tool Runtime
   ↓
Observe & Evaluate Tool Output
   ↓
Is human approval required?
   ├── YES ──> Emit Approval Card & Pause Run
   │             └── User Approves / Denies
   └── NO ───> Continue Execution
   ↓
Evaluate Milestone Goal (Continue, Retry, or Re-plan)
   ↓
Mark AgentRun Completed & Record Audit Event
```

---

## 3. Complex Engineering Classification (Section 29)

### WP1: Depth of Knowledge Required
The design requires deep knowledge of modern software engineering:
- AI orchestration and prompt guardrailing
- Information retrieval (RAG) and document chunking
- State machines for human-in-the-loop approvals
- Security engineering (JWT HTTP-only sessions, bcrypt hashing, tenant data isolation)
- First-principles web architecture (Next.js App Router, SQLite with Prisma ORM)

### WP2: Conflicting Requirements
The system carefully reconciles multiple competing priorities:
- **Autonomy vs. Human Control**: Agents should be capable of preparing tasks, but must never mutate workspace data without explicit approval.
- **Academic Assistance vs. Academic Integrity**: AI assists conceptual retention and milestone scheduling, but strictly rejects live examination solving and homework completion.
- **Privacy vs. Personalization**: Agents leverage student degree and subject context, but all data remains strictly tenant-isolated with instant purge capabilities.
- **Feature Depth vs. Zero-Cost Accessibility**: The mid-viva demo provides six specialized agents without requiring costly external infrastructure.

### WP3: Novel Problem Solving
There is no single off-the-shelf blueprint for multi-mentor student workspaces. The system defines a novel model for coordinating six dedicated agents with bounded responsibilities, safety constraints, and shared calendar tasks.

### WP4: Persistent Permission-Aware Agents
The system models permission policies tailored specifically to university students: classifying tasks, projects, and career documents into safe read queries vs. gated mutation actions.

### WP5: Governance & AI Safety Controls
The project formalizes governance standards for student AI systems where universal standards do not yet exist, notably establishing audit logging, citation verification, and explicit disclaimers for drafted cover letters.

### WP6: Stakeholder Inclusivity
The platform architecture considers the needs of:
- **Students**: Seeking intuitive study aids, active recall, and placement tracking.
- **Faculty / Supervisors**: Requiring academic integrity and verifiable student ownership.
- **Institutions**: Ensuring data privacy compliance and prevention of unauthorized submissions.

### WP7: Multi-Disciplinary Synthesis
Combines database architecture, authentication, AI safety engineering, reactive web interfaces, document parsing, career workflow tracking, and audit logging into a cohesive product.

---

## 4. Complex Engineering Activities (Section 30)

- **EA1 (Resource Utilization)**: Combines relational schemas, TypeScript type safety, Next.js server components, and deterministic AI fallbacks to achieve a robust demo with zero external service dependencies.
- **EA2 (Conflict Resolution)**: Mitigated the tension between AI autonomy and user trust by implementing an interactive Approval Card state machine.
- **EA3 (Creative Engineering)**: Created six distinct mentor personas with dedicated system prompts and suggested prompts targeting viva defense, capstone design, and STAR interview preparation.
- **EA4 (Risk Mitigation)**: Protected against prompt injection from uploaded files, prevented credential leaks, and blocked live examination cheating attempts.
- **EA5 (Extensibility)**: Engineered modular database schemas (`Approval`, `AuditEvent`, `UsageEvent`) that directly pave the path for end-semester worker queues and vector embeddings without breaking API contracts.
