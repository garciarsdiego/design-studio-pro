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
  { id: "chat", label: "Chat" },
  { id: "console", label: "Console" },
  { id: "data", label: "Data" },
] as const;

export type NavId = (typeof navItems)[number]["id"];

// ─── Workflow nodes (Console — n8n-style DAG) ────────────────────────────
export interface WorkflowNode {
  id: string;
  label: string;
  agent: string;
  icon: LucideIcon;
  status: AgentStatus | "completed";
  /** Position in workflow grid (percent of canvas). */
  x: number;
  y: number;
  metric?: string;
  lastRun?: string;
}

export interface WorkflowEdge {
  from: string;
  to: string;
  /** Status carried by the edge transition. */
  status: AgentStatus | "completed";
  /** Event/trigger that fired this transition. */
  event: string;
  /** When the transition last fired. */
  lastTransition: string;
}

export const workflowNodes: WorkflowNode[] = [
  { id: "wn_scrape",   label: "Web Scraper",      agent: "Web_Scraper",     icon: Search,   status: "error",      x: 10, y: 50, metric: "0 / 8 urls",  lastRun: "10:31" },
  { id: "wn_normalize",label: "Normalise",        agent: "Data_Ingest",     icon: Database, status: "completed",  x: 28, y: 30, metric: "1.2 MB",      lastRun: "10:19" },
  { id: "wn_embed",    label: "Embed",            agent: "Data_Ingest",     icon: Database, status: "completed",  x: 28, y: 70, metric: "812 vec",     lastRun: "10:20" },
  { id: "wn_reason",   label: "Reason",           agent: "Analysis_Engine", icon: Brain,    status: "active",     x: 50, y: 50, metric: "ctx 8k",      lastRun: "10:21" },
  { id: "wn_synth",    label: "Synthesise",       agent: "CodeGen_v2",      icon: Code2,    status: "idle",       x: 72, y: 35, metric: "—",           lastRun: "—" },
  { id: "wn_report",   label: "Report",           agent: "Orchestrator",    icon: Network,  status: "idle",       x: 72, y: 65, metric: "—",           lastRun: "—" },
  { id: "wn_tools",    label: "Tool Broker",      agent: "Tool_Broker",     icon: Wrench,   status: "idle",       x: 90, y: 50, metric: "ready",       lastRun: "09:50" },
];

export const workflowEdges: WorkflowEdge[] = [
  { from: "wn_scrape",    to: "wn_normalize", status: "error",     event: "fetch.failed → retry.skipped",    lastTransition: "10:31:08" },
  { from: "wn_scrape",    to: "wn_embed",     status: "error",     event: "fetch.failed → embed.skipped",    lastTransition: "10:31:08" },
  { from: "wn_normalize", to: "wn_reason",    status: "completed", event: "payload.normalised(1.2MB)",       lastTransition: "10:19:48" },
  { from: "wn_embed",     to: "wn_reason",    status: "completed", event: "vectors.ready(812)",              lastTransition: "10:20:12" },
  { from: "wn_reason",    to: "wn_synth",     status: "active",    event: "reasoning.partial → synth.warm",  lastTransition: "10:21:30" },
  { from: "wn_reason",    to: "wn_report",    status: "active",    event: "reasoning.partial → report.draft",lastTransition: "10:21:30" },
  { from: "wn_synth",     to: "wn_tools",     status: "idle",      event: "awaiting synth.complete",         lastTransition: "—" },
  { from: "wn_report",    to: "wn_tools",     status: "idle",      event: "awaiting report.complete",        lastTransition: "—" },
];

export { Workflow };
