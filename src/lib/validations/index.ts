import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  newPassword: z.string().min(6, "Password must be at least 6 characters long"),
});

export const onboardingSchema = z.object({
  institution: z.string().min(2, "Institution is required"),
  degree: z.string().min(2, "Degree is required"),
  semester: z.string().min(1, "Semester is required"),
  goals: z.string().min(3, "Please describe your academic goals"),
  subjects: z.string().min(2, "Please enter at least one subject"),
  skills: z.string().optional(),
  interests: z.string().optional(),
  studyHours: z.coerce.number().min(1).max(24).optional().default(3),
  careerTarget: z.string().optional(),
});

export const projectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  description: z.string().optional(),
  type: z.enum(["Coursework", "Major Project", "Research", "Self-Study", "Capstone"]).default("Coursework"),
  status: z.enum(["Planning", "In Progress", "Review", "Completed"]).default("Planning"),
  targetDate: z.string().optional().nullable(),
  linkedAgentIds: z.array(z.string()).optional(),
});

export const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  dueDate: z.string().optional().nullable(),
  priority: z.enum(["Low", "Medium", "High", "Urgent"]).default("Medium"),
  status: z.enum(["Pending", "In Progress", "Completed"]).default("Pending"),
  projectId: z.string().optional().nullable(),
  agentId: z.string().optional().nullable(),
});

export const applicationSchema = z.object({
  company: z.string().min(1, "Company name is required"),
  role: z.string().min(1, "Role is required"),
  url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  status: z.enum(["Wishlist", "Applied", "Interviewing", "Offer", "Rejected"]).default("Applied"),
  notes: z.string().optional(),
});

export const approvalDecisionSchema = z.object({
  approvalId: z.string().min(1, "Approval ID is required"),
  decision: z.enum(["Approved", "Denied"]),
  decisionNotes: z.string().optional(),
});

export const chatMessageSchema = z.object({
  conversationId: z.string().optional(),
  agentId: z.string().min(1, "Agent ID is required"),
  message: z.string().min(1, "Message cannot be empty"),
});
