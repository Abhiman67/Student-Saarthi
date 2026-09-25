/**
 * Browser LocalStorage Database for Vidya Sarthi
 * Enables 100% frontend-only operation without any external database server.
 * Perfect for Vercel, offline development, and zero-configuration demonstration.
 */

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  onboardingCompleted: boolean;
  createdAt: string;
}

export interface StoredProfile {
  id: string;
  userId: string;
  institution: string;
  degree: string;
  semester: string;
  goals: string;
  subjects: string;
  skills: string;
  interests?: string;
  studyHours?: number;
}

export interface StoredTask {
  id: string;
  userId: string;
  projectId?: string | null;
  agentId?: string | null;
  title: string;
  description?: string | null;
  priority: "Low" | "Medium" | "High";
  status: "Pending" | "In_Progress" | "Completed";
  dueDate?: string | null;
  createdAt: string;
  project?: { id: string; name: string } | null;
  agent?: { id: string; name: string } | null;
}

export interface StoredProject {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  type: string;
  status: "Planning" | "In_Progress" | "Review" | "Completed";
  tags?: string | null;
  createdAt: string;
  updatedAt: string;
  tasks: StoredTask[];
}

export interface StoredFile {
  id: string;
  userId: string;
  filename: string;
  fileType: string;
  fileSize: number;
  content: string;
  summary?: string | null;
  keyConcepts?: string | null;
  createdAt: string;
}

export interface StoredMessage {
  id: string;
  conversationId: string;
  role: "user" | "assistant" | "system";
  content: string;
  citations?: string | null;
  approvalRequired?: boolean;
  approvalId?: string | null;
  createdAt: string;
}

export interface StoredConversation {
  id: string;
  userId: string;
  agentId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: StoredMessage[];
  agent?: {
    id: string;
    name: string;
    category: string;
  };
}

export interface StoredApproval {
  id: string;
  userId: string;
  actionType: string;
  description: string;
  payload: string; // JSON string
  status: "Pending" | "Approved" | "Denied";
  createdAt: string;
  decidedAt?: string | null;
}

export interface StoredAuditEvent {
  id: string;
  userId: string;
  action: string;
  details?: string | null;
  createdAt: string;
}

// -------------------------------------------------------------
// DEFAULT SEEDED DATA
// -------------------------------------------------------------

export const DEFAULT_USER: StoredUser = {
  id: "demo-user-1",
  name: "Abhishek",
  email: "student@university.edu",
  onboardingCompleted: true,
  createdAt: new Date().toISOString(),
};

export const DEFAULT_PROFILE: StoredProfile = {
  id: "demo-profile-1",
  userId: "demo-user-1",
  institution: "National Institute of Technology",
  degree: "B.Tech Computer Science & Engineering",
  semester: "Semester 6",
  goals: "Complete Capstone Architecture & Submit IEEE Paper Draft",
  subjects: "Distributed Systems, Machine Learning, Compiler Design, Database Management",
  skills: "TypeScript, Python, React, Next.js, System Architecture",
  interests: "Artificial Intelligence, Cloud Infrastructure, Developer Tooling",
  studyHours: 4,
};

export const DEFAULT_PROJECTS: StoredProject[] = [
  {
    id: "proj-1",
    userId: "demo-user-1",
    name: "Autonomous Multi-Agent Workspace (Vidya Sarthi)",
    description: "Capstone project implementing a human-in-the-loop multi-mentor workspace for engineering students.",
    type: "Capstone",
    status: "In_Progress",
    tags: "Next.js, TypeScript, AI, Multi-Agent",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    tasks: [
      {
        id: "task-1",
        userId: "demo-user-1",
        projectId: "proj-1",
        agentId: "project-guide",
        title: "Draft system architecture diagrams and viva presentation slides",
        description: "Include request sequence flow, human approval gating, and entity relationships.",
        priority: "High",
        status: "In_Progress",
        dueDate: new Date(Date.now() + 3 * 86400000).toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        id: "task-2",
        userId: "demo-user-1",
        projectId: "proj-1",
        agentId: "code-mentor",
        title: "Implement unit tests for JWT session edge verification in Vitest",
        description: "Verify correct argument order in jose jwtVerify and signature integrity.",
        priority: "Medium",
        status: "Completed",
        dueDate: new Date(Date.now() - 1 * 86400000).toISOString(),
        createdAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: "proj-2",
    userId: "demo-user-1",
    name: "Distributed Consensus Engine in Rust",
    description: "Coursework implementation of Raft consensus protocol with leader election and log replication.",
    type: "Coursework",
    status: "Planning",
    tags: "Rust, Systems, Distributed Systems",
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    tasks: [],
  },
];

export const DEFAULT_TASKS: StoredTask[] = [
  {
    id: "task-1",
    userId: "demo-user-1",
    projectId: "proj-1",
    agentId: "project-guide",
    title: "Draft system architecture diagrams and viva presentation slides",
    description: "Include request sequence flow, human approval gating, and entity relationships.",
    priority: "High",
    status: "In_Progress",
    dueDate: new Date(Date.now() + 3 * 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    project: { id: "proj-1", name: "Autonomous Multi-Agent Workspace" },
    agent: { id: "project-guide", name: "Project Guide" },
  },
  {
    id: "task-2",
    userId: "demo-user-1",
    projectId: "proj-1",
    agentId: "code-mentor",
    title: "Implement unit tests for JWT session edge verification in Vitest",
    description: "Verify correct argument order in jose jwtVerify and signature integrity.",
    priority: "Medium",
    status: "Completed",
    dueDate: new Date(Date.now() - 1 * 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    project: { id: "proj-1", name: "Autonomous Multi-Agent Workspace" },
    agent: { id: "code-mentor", name: "Code Mentor" },
  },
  {
    id: "task-3",
    userId: "demo-user-1",
    agentId: "writing-buddy",
    title: "Format abstract for IEEE conference paper submission",
    description: "Refactor passive voice sentences and clarify technical methodology section.",
    priority: "High",
    status: "Pending",
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    agent: { id: "writing-buddy", name: "Writing Buddy" },
  },
];

export const DEFAULT_FILES: StoredFile[] = [
  {
    id: "file-1",
    userId: "demo-user-1",
    filename: "Distributed_Systems_Course_Outline.pdf",
    fileType: "application/pdf",
    fileSize: 245000,
    content: "Syllabus covering Vector Clocks, CAP Theorem, Consensus Algorithms, and Byzantine Fault Tolerance.",
    summary: "Comprehensive distributed computing curriculum breakdown covering consensus and replication.",
    keyConcepts: JSON.stringify(["CAP Theorem", "Vector Clocks", "Paxos & Raft", "Consistent Hashing"]),
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

export const DEFAULT_APPROVALS: StoredApproval[] = [
  {
    id: "approval-1",
    userId: "demo-user-1",
    actionType: "CREATE_TASK",
    description: "Writing Buddy proposed adding a task: 'Review IEEE paper draft citations before final submission'",
    payload: JSON.stringify({
      title: "Review IEEE paper draft citations before final submission",
      priority: "Medium",
      dueDate: new Date(Date.now() + 4 * 86400000).toISOString(),
      agentId: "writing-buddy",
    }),
    status: "Pending",
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_AUDIT: StoredAuditEvent[] = [
  {
    id: "audit-1",
    userId: "demo-user-1",
    action: "WORKSPACE_INIT",
    details: "Demo student workspace initialized with active mentors",
    createdAt: new Date().toISOString(),
  },
];

export const ACTIVE_AGENTS = [
  {
    id: "writing-buddy",
    name: "Writing Buddy",
    category: "Academic Writing",
    role: "Paper & Report Specialist",
    description: "Assists with literature review synthesis, IEEE paper formatting, abstract refining, and technical reports without writing dishonesty.",
    isFutureScope: false,
    capabilities: [
      "Critique academic writing for passive voice and precision",
      "Format citations in APA, IEEE, and Chicago styles",
      "Structure literature reviews and methodology sections",
      "Draft professional correspondence to research supervisors",
    ],
  },
  {
    id: "project-guide",
    name: "Project Guide",
    category: "Capstone Guidance",
    role: "Architecture Advisor",
    description: "Mentors engineering students from initial problem formulation through architectural design, milestone scheduling, and viva defense preparation.",
    isFutureScope: false,
    capabilities: [
      "Decompose capstone ideas into actionable milestone tasks",
      "Advise on system trade-offs (microservices vs modular monolith)",
      "Formulate questions professors commonly ask during evaluations",
      "Structure project requirements and design documentation",
    ],
  },
  {
    id: "code-mentor",
    name: "Code Mentor",
    category: "Technical Mentorship",
    role: "Debugging & Architecture Guide",
    description: "Guides algorithmic problem-solving, runtime debugging, clean architecture, and test suite creation without dump-and-run answers.",
    isFutureScope: false,
    capabilities: [
      "Analyze runtime call stacks and algorithmic bottlenecks",
      "Guide data structure selection with time/space complexity",
      "Teach clean architecture and design patterns through Socratic questions",
      "Review pull requests and draft unit tests for critical edge cases",
    ],
  },
];

export const FUTURE_SCOPE_AGENTS = [
  {
    id: "study-coach",
    name: "Study Coach",
    category: "Syllabus & Exams",
    role: "Learning Strategist",
    description: "Will break down complex course syllabi, generate active recall flashcards, and run spaced repetition revision schedules.",
    isFutureScope: true,
  },
  {
    id: "career-scout",
    name: "Career Scout",
    category: "Placement Prep",
    role: "Career Advisor",
    description: "Will analyze engineering resumes with Google XYZ metrics, identify ATS keyword gaps, and organize internship pipelines.",
    isFutureScope: true,
  },
  {
    id: "interview-coach",
    name: "Interview Coach",
    category: "Mock Interviews",
    role: "Interview Specialist",
    description: "Will conduct conversational technical and behavioral mock interviews with structured delivery feedback.",
    isFutureScope: true,
  },
];

// -------------------------------------------------------------
// STORAGE KEYS
// -------------------------------------------------------------

const STORAGE_KEYS = {
  USER: "vidya_sarthi_user",
  PROFILE: "vidya_sarthi_profile",
  PROJECTS: "vidya_sarthi_projects",
  TASKS: "vidya_sarthi_tasks",
  FILES: "vidya_sarthi_files",
  CONVERSATIONS: "vidya_sarthi_conversations",
  APPROVALS: "vidya_sarthi_approvals",
  AUDIT: "vidya_sarthi_audit",
};

// Helper for safe client-side access
function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function getItem<T>(key: string, defaultValue: T): T {
  if (!isBrowser()) return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    // Dispatch a storage event so sibling components update automatically
    window.dispatchEvent(new Event("vidya_sarthi_storage_change"));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

// -------------------------------------------------------------
// PUBLIC STORAGE API
// -------------------------------------------------------------

export const LocalStore = {
  // Initialize default data if not present
  init() {
    if (!isBrowser()) return;
    if (!window.localStorage.getItem(STORAGE_KEYS.USER)) {
      setItem(STORAGE_KEYS.USER, DEFAULT_USER);
    }
    if (!window.localStorage.getItem(STORAGE_KEYS.PROFILE)) {
      setItem(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
    }
    if (!window.localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
      setItem(STORAGE_KEYS.PROJECTS, DEFAULT_PROJECTS);
    }
    if (!window.localStorage.getItem(STORAGE_KEYS.TASKS)) {
      setItem(STORAGE_KEYS.TASKS, DEFAULT_TASKS);
    }
    if (!window.localStorage.getItem(STORAGE_KEYS.FILES)) {
      setItem(STORAGE_KEYS.FILES, DEFAULT_FILES);
    }
    if (!window.localStorage.getItem(STORAGE_KEYS.APPROVALS)) {
      setItem(STORAGE_KEYS.APPROVALS, DEFAULT_APPROVALS);
    }
    if (!window.localStorage.getItem(STORAGE_KEYS.AUDIT)) {
      setItem(STORAGE_KEYS.AUDIT, DEFAULT_AUDIT);
    }
    if (!window.localStorage.getItem(STORAGE_KEYS.CONVERSATIONS)) {
      setItem(STORAGE_KEYS.CONVERSATIONS, []);
    }
  },

  resetDemoData() {
    if (!isBrowser()) return;
    setItem(STORAGE_KEYS.USER, DEFAULT_USER);
    setItem(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
    setItem(STORAGE_KEYS.PROJECTS, DEFAULT_PROJECTS);
    setItem(STORAGE_KEYS.TASKS, DEFAULT_TASKS);
    setItem(STORAGE_KEYS.FILES, DEFAULT_FILES);
    setItem(STORAGE_KEYS.APPROVALS, DEFAULT_APPROVALS);
    setItem(STORAGE_KEYS.AUDIT, DEFAULT_AUDIT);
    setItem(STORAGE_KEYS.CONVERSATIONS, []);
  },

  // User
  getUser(): StoredUser {
    return getItem(STORAGE_KEYS.USER, DEFAULT_USER);
  },
  setUser(user: Partial<StoredUser>): StoredUser {
    const current = this.getUser();
    const updated = { ...current, ...user };
    setItem(STORAGE_KEYS.USER, updated);
    return updated;
  },

  // Profile
  getProfile(): StoredProfile {
    return getItem(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE);
  },
  updateProfile(profile: Partial<StoredProfile>): StoredProfile {
    const current = this.getProfile();
    const updated = { ...current, ...profile };
    setItem(STORAGE_KEYS.PROFILE, updated);
    return updated;
  },

  // Projects
  getProjects(): StoredProject[] {
    return getItem(STORAGE_KEYS.PROJECTS, DEFAULT_PROJECTS);
  },
  getProject(id: string): StoredProject | undefined {
    return this.getProjects().find((p) => p.id === id);
  },
  createProject(data: { name: string; description?: string; type?: string; tags?: string }): StoredProject {
    const projects = this.getProjects();
    const user = this.getUser();
    const newProject: StoredProject = {
      id: "proj-" + Date.now(),
      userId: user.id,
      name: data.name,
      description: data.description || "",
      type: data.type || "Capstone",
      status: "Planning",
      tags: data.tags || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tasks: [],
    };
    projects.unshift(newProject);
    setItem(STORAGE_KEYS.PROJECTS, projects);
    this.addAuditEvent("CREATE_PROJECT", `Created project: ${data.name}`);
    return newProject;
  },
  updateProject(id: string, updates: Partial<StoredProject>): StoredProject | null {
    const projects = this.getProjects();
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) return null;
    projects[index] = { ...projects[index], ...updates, updatedAt: new Date().toISOString() };
    setItem(STORAGE_KEYS.PROJECTS, projects);
    return projects[index];
  },
  deleteProject(id: string): boolean {
    const projects = this.getProjects().filter((p) => p.id !== id);
    setItem(STORAGE_KEYS.PROJECTS, projects);
    return true;
  },

  // Tasks
  getTasks(): StoredTask[] {
    return getItem(STORAGE_KEYS.TASKS, DEFAULT_TASKS);
  },
  createTask(data: {
    title: string;
    description?: string;
    priority?: "Low" | "Medium" | "High";
    dueDate?: string;
    projectId?: string;
    agentId?: string;
  }): StoredTask {
    const tasks = this.getTasks();
    const user = this.getUser();
    const newTask: StoredTask = {
      id: "task-" + Date.now(),
      userId: user.id,
      title: data.title,
      description: data.description || "",
      priority: data.priority || "Medium",
      status: "Pending",
      dueDate: data.dueDate || null,
      projectId: data.projectId || null,
      agentId: data.agentId || null,
      createdAt: new Date().toISOString(),
    };

    if (data.projectId) {
      const proj = this.getProject(data.projectId);
      if (proj) {
        newTask.project = { id: proj.id, name: proj.name };
        this.updateProject(proj.id, { tasks: [...proj.tasks, newTask] });
      }
    }

    if (data.agentId) {
      const agent = ACTIVE_AGENTS.find((a) => a.id === data.agentId);
      if (agent) {
        newTask.agent = { id: agent.id, name: agent.name };
      }
    }

    tasks.unshift(newTask);
    setItem(STORAGE_KEYS.TASKS, tasks);
    this.addAuditEvent("CREATE_TASK", `Created task: ${data.title}`);
    return newTask;
  },
  updateTask(id: string, updates: Partial<StoredTask>): StoredTask | null {
    const tasks = this.getTasks();
    const index = tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;
    tasks[index] = { ...tasks[index], ...updates };
    setItem(STORAGE_KEYS.TASKS, tasks);
    return tasks[index];
  },
  deleteTask(id: string): boolean {
    const tasks = this.getTasks().filter((t) => t.id !== id);
    setItem(STORAGE_KEYS.TASKS, tasks);
    return true;
  },

  // Files
  getFiles(): StoredFile[] {
    return getItem(STORAGE_KEYS.FILES, DEFAULT_FILES);
  },
  createFile(data: { filename: string; fileType: string; fileSize: number; content: string }): StoredFile {
    const files = this.getFiles();
    const user = this.getUser();
    const newFile: StoredFile = {
      id: "file-" + Date.now(),
      userId: user.id,
      filename: data.filename,
      fileType: data.fileType,
      fileSize: data.fileSize,
      content: data.content,
      summary: `Automated summary of ${data.filename}: Key educational references extracted and indexed.`,
      keyConcepts: JSON.stringify(["Academic Concepts", "Core Reference", "Indexed Topics"]),
      createdAt: new Date().toISOString(),
    };
    files.unshift(newFile);
    setItem(STORAGE_KEYS.FILES, files);
    this.addAuditEvent("UPLOAD_FILE", `Uploaded document: ${data.filename}`);
    return newFile;
  },
  deleteFile(id: string): boolean {
    const files = this.getFiles().filter((f) => f.id !== id);
    setItem(STORAGE_KEYS.FILES, files);
    return true;
  },

  // Conversations & Messages
  getConversations(agentId?: string): StoredConversation[] {
    const convs = getItem<StoredConversation[]>(STORAGE_KEYS.CONVERSATIONS, []);
    if (agentId) {
      return convs.filter((c) => c.agentId === agentId);
    }
    return convs;
  },
  getConversation(id: string): StoredConversation | undefined {
    return this.getConversations().find((c) => c.id === id);
  },
  createConversation(agentId: string, title?: string): StoredConversation {
    const convs = this.getConversations();
    const user = this.getUser();
    const agent = ACTIVE_AGENTS.find((a) => a.id === agentId);
    const newConv: StoredConversation = {
      id: "conv-" + Date.now(),
      userId: user.id,
      agentId,
      title: title || `Discussion with ${agent?.name || "Mentor"}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
      agent: agent ? { id: agent.id, name: agent.name, category: agent.category } : undefined,
    };
    convs.unshift(newConv);
    setItem(STORAGE_KEYS.CONVERSATIONS, convs);
    return newConv;
  },
  addMessage(
    convId: string,
    message: {
      role: "user" | "assistant" | "system";
      content: string;
      citations?: string[];
      approvalRequired?: boolean;
      approvalId?: string;
    }
  ): StoredMessage {
    const convs = this.getConversations();
    const index = convs.findIndex((c) => c.id === convId);
    const newMessage: StoredMessage = {
      id: "msg-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
      conversationId: convId,
      role: message.role,
      content: message.content,
      citations: message.citations ? JSON.stringify(message.citations) : null,
      approvalRequired: message.approvalRequired || false,
      approvalId: message.approvalId || null,
      createdAt: new Date().toISOString(),
    };

    if (index !== -1) {
      convs[index].messages.push(newMessage);
      convs[index].updatedAt = new Date().toISOString();
      setItem(STORAGE_KEYS.CONVERSATIONS, convs);
    }
    return newMessage;
  },
  deleteConversation(id: string): boolean {
    const convs = this.getConversations().filter((c) => c.id !== id);
    setItem(STORAGE_KEYS.CONVERSATIONS, convs);
    return true;
  },
  clearAllConversations(): boolean {
    setItem(STORAGE_KEYS.CONVERSATIONS, []);
    return true;
  },

  // Approvals (Human-in-the-loop)
  getApprovals(): StoredApproval[] {
    return getItem(STORAGE_KEYS.APPROVALS, DEFAULT_APPROVALS);
  },
  createApproval(actionType: string, description: string, payload: Record<string, unknown>): StoredApproval {
    const approvals = this.getApprovals();
    const user = this.getUser();
    const newApproval: StoredApproval = {
      id: "approval-" + Date.now(),
      userId: user.id,
      actionType,
      description,
      payload: JSON.stringify(payload),
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    approvals.unshift(newApproval);
    setItem(STORAGE_KEYS.APPROVALS, approvals);
    return newApproval;
  },
  decideApproval(id: string, decision: "Approved" | "Denied"): StoredApproval | null {
    const approvals = this.getApprovals();
    const index = approvals.findIndex((a) => a.id === id);
    if (index === -1) return null;

    approvals[index].status = decision;
    approvals[index].decidedAt = new Date().toISOString();

    if (decision === "Approved") {
      try {
        const payload = JSON.parse(approvals[index].payload);
        if (approvals[index].actionType === "CREATE_TASK") {
          this.createTask({
            title: payload.title || "Agent Generated Task",
            description: payload.description || "Created via approved agent action card",
            priority: payload.priority || "Medium",
            dueDate: payload.dueDate,
            projectId: payload.projectId,
            agentId: payload.agentId,
          });
        } else if (approvals[index].actionType === "CREATE_PROJECT") {
          this.createProject({
            name: payload.name || "Agent Proposed Project",
            description: payload.description || "Created via approved agent action card",
            type: payload.type || "Capstone",
            tags: payload.tags || "AI, Academic",
          });
        }
      } catch (err) {
        console.error("Error executing approved action payload:", err);
      }
    }

    setItem(STORAGE_KEYS.APPROVALS, approvals);
    this.addAuditEvent("DECIDE_APPROVAL", `${decision} agent action: ${approvals[index].description}`);
    return approvals[index];
  },

  // Audit Events
  getAuditEvents(): StoredAuditEvent[] {
    return getItem(STORAGE_KEYS.AUDIT, DEFAULT_AUDIT);
  },
  addAuditEvent(action: string, details?: string): StoredAuditEvent {
    const events = this.getAuditEvents();
    const user = this.getUser();
    const newEvent: StoredAuditEvent = {
      id: "audit-" + Date.now(),
      userId: user.id,
      action,
      details: details || null,
      createdAt: new Date().toISOString(),
    };
    events.unshift(newEvent);
    setItem(STORAGE_KEYS.AUDIT, events);
    return newEvent;
  },
};
