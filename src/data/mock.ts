// Centralized mock data for the Omniforge Studio cockpit.
// IDs follow stable prefixes: wf_ workflow, tk_ task, ses_ session, t_ trace,
// dep_ deposit, run_ run, msg_ message, agt_ agent.

import {
  Brain,
  Code2,
  Database,
  Network,
  Search,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type AgentStatus = "active" | "idle" | "error" | "processing";

export interface AgentNode {
  id: string;
  name: string;
  status: AgentStatus;
  statusLabel: string;
  icon: LucideIcon;
  /** Position on the canvas as percentage of viewport (0-100). */
  x: number;
  y: number;
  /** Whether this node is the central anchor of the workflow. */
  central?: boolean;
  description: string;
  uptime: string;
  tasksCompleted: number;
}

export const agentNodes: AgentNode[] = [
  {
    id: "agt_orch",
    name: "Orchestrator",
    status: "active",
    statusLabel: "ROUTING",
    icon: Network,
    x: 50,
    y: 52,
    central: true,
    description: "Routes intents across the active team and brokers approvals.",
    uptime: "14d 06h",
    tasksCompleted: 1284,
  },
  {
    id: "agt_ingest",
    name: "Data_Ingest",
    status: "idle",
    statusLabel: "IDLE",
    icon: Database,
    x: 24,
    y: 30,
    description: "Streams external payloads into the working memory matrix.",
    uptime: "14d 06h",
    tasksCompleted: 412,
  },
  {
    id: "agt_analysis",
    name: "Analysis_Engine",
    status: "processing",
    statusLabel: "ANALYZING",
    icon: Brain,
    x: 48,
    y: 22,
    description: "Performs structural reasoning over ingested deposits.",
    uptime: "9d 21h",
    tasksCompleted: 893,
  },
  {
    id: "agt_codegen",
    name: "CodeGen_v2",
    status: "idle",
    statusLabel: "READY",
    icon: Code2,
    x: 72,
    y: 64,
    description: "Synthesises code artefacts from a vetted plan.",
    uptime: "3d 04h",
    tasksCompleted: 248,
  },
  {
    id: "agt_scraper",
    name: "Web_Scraper",
    status: "error",
    statusLabel: "RATE LIMITED",
    icon: Search,
    x: 22,
    y: 72,
    description: "Captures unstructured signals from configured surfaces.",
    uptime: "0d 02h",
    tasksCompleted: 67,
  },
  {
    id: "agt_tools",
    name: "Tool_Broker",
    status: "idle",
    statusLabel: "IDLE",
    icon: Wrench,
    x: 78,
    y: 32,
    description: "Mediates external tool invocations with audit logs.",
    uptime: "14d 06h",
    tasksCompleted: 156,
  },
];

export interface ActivityEvent {
  id: string;
  time: string;
  agent: string;
  action: string;
  target?: string;
  tone: "default" | "amber" | "teal" | "danger" | "processing";
}

export const recentActivity: ActivityEvent[] = [
  { id: "ev_1", time: "10:42", agent: "Analysis_Engine", action: "completed task", target: "tk_8f92a", tone: "amber" },
  { id: "ev_2", time: "10:40", agent: "Data_Ingest", action: "received payload", target: "24.5mb", tone: "teal" },
  { id: "ev_3", time: "10:35", agent: "Orchestrator", action: "spawned node", target: "CodeGen_v2", tone: "default" },
  { id: "ev_4", time: "10:31", agent: "Web_Scraper", action: "rate limited by host", target: "stripe.com", tone: "danger" },
  { id: "ev_5", time: "10:28", agent: "Tool_Broker", action: "approved invocation", target: "shell.exec", tone: "default" },
  { id: "ev_6", time: "10:24", agent: "Orchestrator", action: "received instruction", target: "ses_4421", tone: "default" },
];

export const systemMetrics = {
  latency: "12ms",
  activeNodes: 4,
  totalNodes: 6,
  tokensPerMin: "1.2k",
  approvalsPending: 2,
};

export interface ChatMessage {
  id: string;
  role: "user" | "agent";
  agent?: string;
  content: string;
  time: string;
  plan?: PlanPreview;
}

export interface PlanPreview {
  title: string;
  steps: string[];
  estimatedTokens: number;
  requiresApproval: boolean;
}

export const askMessages: ChatMessage[] = [
  {
    id: "msg_1",
    role: "user",
    content: "Audit the failing scraper jobs from the last hour and propose a recovery plan.",
    time: "10:31",
  },
  {
    id: "msg_2",
    role: "agent",
    agent: "Orchestrator",
    content:
      "Identified 4 failing jobs on Web_Scraper. Root cause: upstream rate limit on stripe.com (HTTP 429). I prepared a recovery plan that backs off, rotates proxies and re-runs in batches.",
    time: "10:31",
    plan: {
      title: "Recovery — Web_Scraper rate limit",
      steps: [
        "Pause Web_Scraper for 90s and drain queue",
        "Rotate proxy pool (3 → 8 endpoints)",
        "Re-run failed jobs in batches of 12",
        "Notify Orchestrator on completion",
      ],
      estimatedTokens: 4200,
      requiresApproval: true,
    },
  },
];

export interface RunRow {
  id: string;
  name: string;
  status: AgentStatus | "completed";
  agent: string;
  durationMs: number;
  startedAt: string;
  artefacts: number;
}

export const runs: RunRow[] = [
  { id: "run_8f92a", name: "Quarterly competitor audit", status: "completed", agent: "Analysis_Engine", durationMs: 142_000, startedAt: "10:18", artefacts: 4 },
  { id: "run_8f91c", name: "Refactor checkout module", status: "active", agent: "CodeGen_v2", durationMs: 38_000, startedAt: "10:24", artefacts: 1 },
  { id: "run_8f90b", name: "Stripe scrape — products", status: "error", agent: "Web_Scraper", durationMs: 7_400, startedAt: "10:31", artefacts: 0 },
  { id: "run_8f8fa", name: "Embeddings refresh", status: "completed", agent: "Data_Ingest", durationMs: 312_000, startedAt: "09:42", artefacts: 12 },
  { id: "run_8f8e9", name: "Plan: onboarding rewrite", status: "idle", agent: "Orchestrator", durationMs: 0, startedAt: "—", artefacts: 0 },
  { id: "run_8f8d8", name: "Doc summariser batch", status: "processing", agent: "Analysis_Engine", durationMs: 84_000, startedAt: "10:05", artefacts: 2 },
];

export interface DAGNode {
  id: string;
  label: string;
  agent: string;
  status: AgentStatus | "completed";
  x: number;
  y: number;
}

export interface DAGEdge {
  from: string;
  to: string;
}

export const dagNodes: DAGNode[] = [
  { id: "n1", label: "Fetch sources", agent: "Web_Scraper", status: "completed", x: 12, y: 50 },
  { id: "n2", label: "Normalise", agent: "Data_Ingest", status: "completed", x: 32, y: 30 },
  { id: "n3", label: "Embed", agent: "Data_Ingest", status: "completed", x: 32, y: 70 },
  { id: "n4", label: "Reason", agent: "Analysis_Engine", status: "active", x: 56, y: 50 },
  { id: "n5", label: "Synthesise", agent: "CodeGen_v2", status: "idle", x: 78, y: 35 },
  { id: "n6", label: "Report", agent: "Orchestrator", status: "idle", x: 78, y: 65 },
];

export const dagEdges: DAGEdge[] = [
  { from: "n1", to: "n2" },
  { from: "n1", to: "n3" },
  { from: "n2", to: "n4" },
  { from: "n3", to: "n4" },
  { from: "n4", to: "n5" },
  { from: "n4", to: "n6" },
];

export interface MemoryDeposit {
  id: string;
  title: string;
  kind: "doc" | "embedding" | "trace" | "policy";
  size: string;
  updated: string;
  density: number; // 0-1
}

export const memoryDeposits: MemoryDeposit[] = [
  { id: "dep_001", title: "Product knowledge base", kind: "doc", size: "184 MB", updated: "2h ago", density: 0.82 },
  { id: "dep_002", title: "Customer transcripts Q3", kind: "doc", size: "42 MB", updated: "1d ago", density: 0.54 },
  { id: "dep_003", title: "Code embeddings — main", kind: "embedding", size: "1.2 GB", updated: "12m ago", density: 0.94 },
  { id: "dep_004", title: "Approval policy v3", kind: "policy", size: "8 KB", updated: "5d ago", density: 0.21 },
  { id: "dep_005", title: "Run traces — last 30d", kind: "trace", size: "612 MB", updated: "3m ago", density: 0.71 },
];

/** 48×16 matrix with seeded densities for the memory map visualisation. */
export function buildMemoryMatrix(cols = 48, rows = 16): number[][] {
  const matrix: number[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    for (let c = 0; c < cols; c++) {
      // Deterministic-feeling pseudo random, weighted to a few hotspots.
      const seed = Math.sin(r * 12.9898 + c * 78.233) * 43758.5453;
      const base = seed - Math.floor(seed);
      const hot1 = Math.exp(-(((c - 12) ** 2 + (r - 4) ** 2) / 22));
      const hot2 = Math.exp(-(((c - 34) ** 2 + (r - 11) ** 2) / 30));
      row.push(Math.min(1, base * 0.35 + hot1 * 0.85 + hot2 * 0.7));
    }
    matrix.push(row);
  }
  return matrix;
}

export interface ProjectMeta {
  name: string;
  workflow: string;
  team: string;
  models: string[];
}

export const projectMeta: ProjectMeta = {
  name: "Omniforge Studio",
  workflow: "wf_atlas_main",
  team: "core / autonomy",
  models: ["claude-3.7-sonnet", "gpt-4.1", "local/qwen-32b"],
};

export const navItems = [
  { id: "console", label: "Console" },
  { id: "ask", label: "Ask" },
  { id: "runs", label: "Runs" },
  { id: "memory", label: "Memory" },
  { id: "setup", label: "Setup" },
] as const;

export type NavId = (typeof navItems)[number]["id"];

export { Workflow };
