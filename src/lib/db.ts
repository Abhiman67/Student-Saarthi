import { PrismaClient } from "@prisma/client";
import {
  DEFAULT_USER,
  DEFAULT_PROFILE,
  DEFAULT_PROJECTS,
  DEFAULT_TASKS,
  DEFAULT_FILES,
  DEFAULT_APPROVALS,
  DEFAULT_AUDIT,
  ACTIVE_AGENTS,
  FUTURE_SCOPE_AGENTS,
} from "./storage";

// In-Memory store for deployment environments without a live SQL database (e.g. Vercel serverless)
class MockDatabase {
  users: any[];
  profiles: any[];
  agents: any[];
  projects: any[];
  tasks: any[];
  files: any[];
  conversations: any[];
  messages: any[];
  applications: any[];
  approvals: any[];
  usageEvents: any[];
  auditEvents: any[];

  constructor() {
    this.users = [
      {
        ...DEFAULT_USER,
        passwordHash: "$2a$10$wT19K9Z1tqU4Lw9X3kZ6eOXm7t6U5XGqX0vI2mF0R1n2s3t4u5v6w",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    this.profiles = [{ ...DEFAULT_PROFILE, createdAt: new Date(), updatedAt: new Date() }];
    this.agents = [...ACTIVE_AGENTS, ...FUTURE_SCOPE_AGENTS];
    this.projects = DEFAULT_PROJECTS.map((p) => ({
      ...p,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
    }));
    this.tasks = DEFAULT_TASKS.map((t) => ({
      ...t,
      createdAt: new Date(t.createdAt),
      dueDate: t.dueDate ? new Date(t.dueDate) : null,
    }));
    this.files = DEFAULT_FILES.map((f) => ({
      ...f,
      createdAt: new Date(f.createdAt),
    }));
    this.conversations = [];
    this.messages = [];
    this.applications = [];
    this.approvals = DEFAULT_APPROVALS.map((a) => ({
      ...a,
      createdAt: new Date(a.createdAt),
    }));
    this.usageEvents = [];
    this.auditEvents = DEFAULT_AUDIT.map((e) => ({
      ...e,
      createdAt: new Date(e.createdAt),
    }));
  }

  // Model helper
  createModelRepo(collectionName: string) {
    const getCollection = () => (this as any)[collectionName] as any[];

    return {
      findUnique: async (args: any) => {
        const col = getCollection();
        const where = args?.where || {};
        return (
          col.find((item: any) => {
            return Object.entries(where).every(([k, v]) => item[k] === v);
          }) || null
        );
      },
      findFirst: async (args: any) => {
        const col = getCollection();
        const where = args?.where || {};
        return (
          col.find((item: any) => {
            return Object.entries(where).every(([k, v]) => item[k] === v);
          }) || null
        );
      },
      findMany: async (args?: any) => {
        let col = [...getCollection()];
        const where = args?.where;
        if (where) {
          col = col.filter((item: any) => {
            return Object.entries(where).every(([k, v]) => {
              if (v === undefined) return true;
              return item[k] === v;
            });
          });
        }
        if (args?.take) {
          col = col.slice(0, args.take);
        }
        return col;
      },
      create: async (args: any) => {
        const col = getCollection();
        const data = args?.data || {};
        const newItem = {
          id: data.id || `${collectionName.slice(0, 4)}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          ...data,
          createdAt: data.createdAt || new Date(),
          updatedAt: new Date(),
        };
        col.unshift(newItem);
        return newItem;
      },
      update: async (args: any) => {
        const col = getCollection();
        const where = args?.where || {};
        const data = args?.data || {};
        const index = col.findIndex((item: any) => {
          return Object.entries(where).every(([k, v]) => item[k] === v);
        });
        if (index === -1) return null;
        col[index] = { ...col[index], ...data, updatedAt: new Date() };
        return col[index];
      },
      upsert: async (args: any) => {
        const col = getCollection();
        const where = args?.where || {};
        const index = col.findIndex((item: any) => {
          return Object.entries(where).every(([k, v]) => item[k] === v);
        });
        if (index !== -1) {
          col[index] = { ...col[index], ...(args?.update || {}), updatedAt: new Date() };
          return col[index];
        } else {
          const newItem = {
            id: `${collectionName.slice(0, 4)}-${Date.now()}`,
            ...(args?.create || {}),
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          col.unshift(newItem);
          return newItem;
        }
      },
      delete: async (args: any) => {
        const col = getCollection();
        const where = args?.where || {};
        const index = col.findIndex((item: any) => {
          return Object.entries(where).every(([k, v]) => item[k] === v);
        });
        if (index !== -1) {
          const [removed] = col.splice(index, 1);
          return removed;
        }
        return null;
      },
      deleteMany: async (args?: any) => {
        const col = getCollection();
        const where = args?.where || {};
        const initialLen = col.length;
        const remaining = col.filter((item: any) => {
          return !Object.entries(where).every(([k, v]) => item[k] === v);
        });
        (this as any)[collectionName] = remaining;
        return { count: initialLen - remaining.length };
      },
      count: async (args?: any) => {
        const col = getCollection();
        const where = args?.where;
        if (!where) return col.length;
        return col.filter((item: any) => {
          return Object.entries(where).every(([k, v]) => item[k] === v);
        }).length;
      },
      aggregate: async () => {
        return { _sum: { tokensUsed: 1540 } };
      },
    };
  }

  // Model accessors
  get user() {
    return this.createModelRepo("users");
  }
  get profile() {
    return this.createModelRepo("profiles");
  }
  get agent() {
    return this.createModelRepo("agents");
  }
  get project() {
    return this.createModelRepo("projects");
  }
  get task() {
    return this.createModelRepo("tasks");
  }
  get file() {
    return this.createModelRepo("files");
  }
  get conversation() {
    return this.createModelRepo("conversations");
  }
  get message() {
    return this.createModelRepo("messages");
  }
  get application() {
    return this.createModelRepo("applications");
  }
  get approval() {
    return this.createModelRepo("approvals");
  }
  get usageEvent() {
    return this.createModelRepo("usageEvents");
  }
  get auditEvent() {
    return this.createModelRepo("auditEvents");
  }
}

// Global instance management
const globalStore = globalThis as unknown as {
  mockDbInstance: MockDatabase | undefined;
  realPrisma: PrismaClient | undefined;
};

if (!globalStore.mockDbInstance) {
  globalStore.mockDbInstance = new MockDatabase();
}

// If DATABASE_URL is defined and not on Vercel serverless without DB, we can instantiate PrismaClient
let prismaClientInstance: PrismaClient | undefined;
try {
  if (process.env.DATABASE_URL && !process.env.VERCEL) {
    if (!globalStore.realPrisma) {
      globalStore.realPrisma = new PrismaClient({
        log: ["error"],
      });
    }
    prismaClientInstance = globalStore.realPrisma;
  }
} catch {
  // Gracefully fallback
}

// Export a smart proxy that defaults to real Prisma when available, and seamlessly falls back to MockDatabase
export const db = (prismaClientInstance || globalStore.mockDbInstance) as unknown as PrismaClient;
