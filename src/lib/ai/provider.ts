import { db } from "../db";

export interface AIResponse {
  content: string;
  citations?: string[];
  approvalRequired?: boolean;
  approvalData?: {
    actionType: string;
    description: string;
    payload: Record<string, unknown>;
  };
}

export async function generateAgentResponse(params: {
  agentId: string;
  userMessage: string;
  userId: string;
  history?: { role: string; content: string }[];
}): Promise<AIResponse> {
  const { agentId, userMessage, userId } = params;
  const lowerMsg = userMessage.toLowerCase();

  // Safety checks (Section 11 AI safety policy)
  if (
    lowerMsg.includes("leak system prompt") ||
    lowerMsg.includes("ignore previous instructions") ||
    lowerMsg.includes("reveal secret") ||
    lowerMsg.includes("reveal credentials")
  ) {
    return {
      content:
        "I am designed to adhere strictly to Vidya Sarthi safety guidelines. System prompts, credentials, and internal instructions cannot be disclosed. How else can I assist your studies or academic work?",
    };
  }

  if (
    lowerMsg.includes("solve this live exam") ||
    lowerMsg.includes("live exam cheating") ||
    lowerMsg.includes("proctored test answer")
  ) {
    return {
      content:
        "Vidya Sarthi promotes academic integrity. I cannot solve questions during a live examination or proctored test. However, I would be delighted to explain the foundational concepts after your exam or help you practice similar problems!",
    };
  }

  // Check if user is asking the agent to create a task, project, or schedule an action (Human-in-the-loop Approval required)
  const isTaskAction =
    lowerMsg.includes("create a task") ||
    lowerMsg.includes("add a task") ||
    lowerMsg.includes("schedule a task") ||
    lowerMsg.includes("remind me to") ||
    lowerMsg.includes("add task");

  const isProjectAction =
    lowerMsg.includes("create project") ||
    lowerMsg.includes("new project") ||
    lowerMsg.includes("start project");

  if (isTaskAction) {
    // Propose an action requiring user approval
    const taskTitle = userMessage.replace(/(create a task|add a task|add task|schedule a task|to)/gi, "").trim() || "Complete review milestone";
    const approval = await db.approval.create({
      data: {
        userId,
        actionType: "CREATE_TASK",
        description: `Create task: "${taskTitle}" associated with agent ${agentId}`,
        payload: JSON.stringify({
          title: taskTitle,
          priority: "Medium",
          status: "Pending",
          agentId,
        }),
        status: "Pending",
      },
    });

    return {
      content: `I have prepared a new task proposal for you: **"${taskTitle}"**.\n\nAs part of Vidya Sarthi's human-in-the-loop safety policy, workspace actions require your explicit confirmation before being committed to your task list. Please review and approve the action card below.`,
      approvalRequired: true,
      approvalData: {
        actionType: "CREATE_TASK",
        description: `Create task: "${taskTitle}"`,
        payload: {
          approvalId: approval.id,
          title: taskTitle,
          priority: "Medium",
        },
      },
    };
  }

  if (isProjectAction) {
    const projectName = userMessage.replace(/(create project|new project|start project)/gi, "").trim() || "New Academic Initiative";
    const approval = await db.approval.create({
      data: {
        userId,
        actionType: "MODIFY_PROJECT",
        description: `Initialize project plan: "${projectName}"`,
        payload: JSON.stringify({
          name: projectName,
          type: "Coursework",
          status: "Planning",
        }),
        status: "Pending",
      },
    });

    return {
      content: `I've drafted a project workspace initialization for **"${projectName}"**.\n\nPlease verify and approve the configuration below so it can be added to your projects portfolio.`,
      approvalRequired: true,
      approvalData: {
        actionType: "MODIFY_PROJECT",
        description: `Initialize project: "${projectName}"`,
        payload: {
          approvalId: approval.id,
          name: projectName,
        },
      },
    };
  }

  // Real LLM provider check if configured
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith("sk-")) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are an academic mentor in Vidya Sarthi. Focus on structured student learning, clarity, and safety.",
            },
            ...(params.history || []),
            { role: "user", content: userMessage },
          ],
          temperature: 0.7,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) {
          return { content: text };
        }
      }
    } catch (err) {
      console.warn("OpenAI API call failed, falling back to deterministic mock response:", err);
    }
  }

  // Deterministic persona-specific responses
  switch (agentId) {
    case "study-coach":
      return {
        content: `Here is a structured learning breakdown from **Study Coach**:\n\n### 1. Key Concept Breakdown\nWhen exploring this topic, focus on first principles. Break down the core mechanisms and relate them to practical examples you encounter in your syllabus.\n\n### 2. Active Recall & Revision Plan\n- **Phase 1 (Day 1)**: Core theory mapping and flashcards.\n- **Phase 2 (Day 3)**: Solve 3-5 standard practice problems without referring to solutions.\n- **Phase 3 (Day 7)**: Spaced repetition review and self-test.\n\n### 3. Quick Check Question\nCan you explain the main trade-off or core formula in your own words? Try asking me to create a task if you'd like this scheduled on your calendar!`,
        citations: ["Vidya Sarthi Academic Handbook §4.2", "Active Recall & Spaced Repetition Guidelines"],
      };

    case "project-guide":
      return {
        content: `Hello! As your **Project Guide**, here is how to approach this systematically:\n\n### Recommended Architecture & Milestone Roadmap\n1. **Requirements & Scope Definition**: Clarify constraints, required schemas, and demo deliverables for viva evaluation.\n2. **Architecture Separation**: Keep concerns modular (UI Components, API route handlers, Data layer).\n3. **Viva Preparation Tip**: Evaluators often ask about failure modes, scaling limitations, and security boundaries. Be prepared to explain your design trade-offs.\n\nWould you like me to propose a task to add milestone tracking for this project?`,
        citations: ["System Design & Viva Preparation Framework"],
      };

    case "career-scout":
      return {
        content: `As your **Career Scout**, here is my strategic analysis:\n\n### Skill Gap & Market Alignment\n- **Target Skills**: Industry expects strong fundamentals, clean Git hygiene, and demonstrable project experience.\n- **Resume Enhancement**: Use the Google XYZ formula: *"Accomplished [X] as measured by [Y] by doing [Z]"*.\n- **Next Steps**: You can log new internship applications under the **Career** tab to track company statuses and draft customized cover letters.\n\nWould you like me to draft a cover letter or analyze a specific company role?`,
        citations: ["Tech Industry Hiring Trends 2026", "STAR Method Resume Guide"],
      };

    case "writing-buddy":
      return {
        content: `Here are my recommendations from **Writing Buddy** to polish your text:\n\n### Clarity & Academic Tone\n- **Active Voice**: Shift passive constructions to active voice to make your points punchy and direct.\n- **Precision**: Replace vague expressions with concrete metrics and clear conclusions.\n- **Structure**: Ensure each paragraph opens with a topic sentence followed by supporting evidence.\n\nFeel free to paste an abstract, report section, or email draft, and I will critique it line-by-line!`,
      };

    case "code-mentor":
      return {
        content: `Here is advice from **Code Mentor**:\n\n### Technical Analysis\n- **Modularity**: Ensure functions do one thing well (Single Responsibility Principle).\n- **Error Handling**: Always validate inputs early (Guard Clauses) and handle edge cases gracefully.\n- **Debugging Strategy**: Check logs, inspect state transitions, and write unit tests for boundary conditions.\n\nIf you have a specific error trace or code snippet, paste it here and we will diagnose it together!`,
      };

    case "interview-coach":
      return {
        content: `Welcome to mock interview prep with **Interview Coach**!\n\n### The STAR Framework for Viva & Job Interviews:\n- **Situation**: Contextualize the challenge (20 seconds).\n- **Task**: What was your specific responsibility? (20 seconds).\n- **Action**: What tools, architectures, or decisions did you implement? (60 seconds).\n- **Result**: Quantifiable outcome or lesson learned (30 seconds).\n\n**Practice Prompt**: *"Tell me about a difficult bug or architectural challenge you resolved in your recent project."*\n\nGive me your response, and I will evaluate your delivery!`,
      };

    default:
      return {
        content: `Thank you for your question. As your Vidya Sarthi assistant, I am here to help you study, manage projects, and achieve your academic goals. How would you like to proceed?`,
      };
  }
}
