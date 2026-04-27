import { useState } from "react";
import { ChevronLeft, GitBranch, Play } from "lucide-react";
import { GlassModal } from "./GlassModal";
import { CapsuleTabs } from "./CapsuleTabs";
import { CodeBlock } from "./CodeBlock";
import { StatusDot } from "./StatusDot";
import { DAGView } from "./DAGView";
import { runs, type RunRow, dagNodes } from "@/data/mock";
import { cn } from "@/lib/utils";

interface RunsModalProps {
  open: boolean;
  onClose: () => void;
}

type RunTab = "overview" | "structure" | "activity" | "conversations" | "artifacts" | "logs";
const TABS = [
  { id: "overview" as const, label: "Overview" },
  { id: "structure" as const, label: "Structure" },
  { id: "activity" as const, label: "Activity" },
  { id: "conversations" as const, label: "Conversations" },
  { id: "artifacts" as const, label: "Artifacts" },
  { id: "logs" as const, label: "Logs" },
];

const formatDuration = (ms: number) => {
  if (ms === 0) return "—";
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}m ${r}s`;
};

export function RunsModal({ open, onClose }: RunsModalProps) {
  const [selected, setSelected] = useState<RunRow | null>(null);
  const [tab, setTab] = useState<RunTab>("overview");

  const handleClose = () => {
    setSelected(null);
    setTab("overview");
    onClose();
  };

  return (
    <GlassModal
      open={open}
      onClose={handleClose}
      title={selected ? `Run · ${selected.id}` : "Runs"}
      icon={<Play className="h-3.5 w-3.5" />}
      size="xl"
      bare={!!selected}
    >
      {!selected ? (
        <RunsList runs={runs} onSelect={(r) => setSelected(r)} />
      ) : (
        <div className="flex flex-col h-full">
          {/* Sub-header */}
          <div className="flex items-center justify-between gap-4 px-6 py-3 border-b border-border/10">
            <button
              onClick={() => setSelected(null)}
              className="flex items-center gap-1.5 text-[12px] font-medium text-foreground/60 hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> All runs
            </button>
            <div className="flex items-center gap-3 min-w-0">
              <StatusDot status={selected.status} />
              <span className="text-[13px] font-medium text-foreground truncate">{selected.name}</span>
              <span className="font-mono text-[10px] text-foreground/40 hidden md:inline">
                · {selected.agent} · {formatDuration(selected.durationMs)}
              </span>
            </div>
            <CapsuleTabs<RunTab> items={TABS} active={tab} onChange={setTab} />
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-hidden">
            {tab === "overview" && <OverviewTab run={selected} />}
            {tab === "structure" && <StructureTab />}
            {tab === "activity" && <ActivityTab />}
            {tab === "conversations" && <ConversationsTab />}
            {tab === "artifacts" && <ArtifactsTab />}
            {tab === "logs" && <LogsTab />}
          </div>
        </div>
      )}
    </GlassModal>
  );
}

function RunsList({ runs, onSelect }: { runs: RunRow[]; onSelect: (r: RunRow) => void }) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-12 gap-4 px-4 pb-2 text-mono-label">
        <div className="col-span-3">ID</div>
        <div className="col-span-4">Name</div>
        <div className="col-span-2">Agent</div>
        <div className="col-span-2">Duration</div>
        <div className="col-span-1 text-right">Started</div>
      </div>
      {runs.map((r) => (
        <button
          key={r.id}
          onClick={() => onSelect(r)}
          className="w-full grid grid-cols-12 gap-4 px-4 py-3 surface-elevated rounded-xl hover:border-amber/30 transition-colors text-left items-center"
        >
          <div className="col-span-3 flex items-center gap-2.5 min-w-0">
            <StatusDot status={r.status} />
            <span className="font-mono text-[12px] text-foreground/85 truncate">{r.id}</span>
          </div>
          <div className="col-span-4 text-[13px] text-foreground truncate">{r.name}</div>
          <div className="col-span-2 font-mono text-[11px] text-foreground/55 truncate">{r.agent}</div>
          <div className="col-span-2 font-mono text-[11px] text-foreground/55">{formatDuration(r.durationMs)}</div>
          <div className="col-span-1 font-mono text-[11px] text-foreground/40 text-right">{r.startedAt}</div>
        </button>
      ))}
    </div>
  );
}

function OverviewTab({ run }: { run: RunRow }) {
  return (
    <div className="p-6 space-y-5 overflow-auto h-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border/10 rounded-xl overflow-hidden border border-border/10">
        <Stat label="Status" value={run.status} />
        <Stat label="Agent" value={run.agent} mono />
        <Stat label="Duration" value={formatDuration(run.durationMs)} mono />
        <Stat label="Artefacts" value={`${run.artefacts}`} />
      </div>
      <div>
        <div className="text-mono-label mb-2">Summary</div>
        <p className="text-[13px] text-foreground/75 leading-relaxed max-w-prose">
          {run.name} executed in 6 stages across {run.agent}. The orchestrator brokered 3 approval gates and committed
          {" "}
          {run.artefacts} artefact{run.artefacts === 1 ? "" : "s"} to the deposits store.
        </p>
      </div>
    </div>
  );
}

function StructureTab() {
  return (
    <div className="grid grid-cols-[1fr,280px] h-full">
      <div className="relative bg-grid-dots-tight">
        <DAGView />
      </div>
      <aside className="border-l border-border/10 overflow-auto p-4 space-y-2 bg-background/40">
        <div className="text-mono-label mb-2">Nodes · {dagNodes.length}</div>
        {dagNodes.map((n) => (
          <div key={n.id} className="surface-elevated rounded-lg px-3 py-2.5 flex items-center gap-2.5">
            <StatusDot status={n.status} />
            <div className="flex-1 min-w-0">
              <div className="text-[12px] text-foreground truncate">{n.label}</div>
              <div className="font-mono text-[10px] text-foreground/40 truncate">{n.agent}</div>
            </div>
            <span className="font-mono text-[10px] text-foreground/40">{n.id}</span>
          </div>
        ))}
      </aside>
    </div>
  );
}

function ActivityTab() {
  const events = [
    { t: "10:18:02", who: "Orchestrator", what: "spawned plan", id: "pl_4421" },
    { t: "10:18:14", who: "Web_Scraper", what: "fetched sources", id: "8 urls" },
    { t: "10:19:01", who: "Data_Ingest", what: "normalised payloads", id: "1.2 MB" },
    { t: "10:19:48", who: "Data_Ingest", what: "embedded chunks", id: "812 vectors" },
    { t: "10:20:12", who: "Analysis_Engine", what: "started reasoning", id: "ctx=8k" },
    { t: "10:21:30", who: "Analysis_Engine", what: "completed", id: "tk_8f92a" },
  ];
  return (
    <div className="p-6 overflow-auto h-full">
      <ul className="space-y-3">
        {events.map((e, i) => (
          <li key={i} className="flex items-baseline gap-4 text-[13px]">
            <span className="font-mono text-[11px] text-foreground/40 w-20 shrink-0">{e.t}</span>
            <span className="font-medium text-foreground">{e.who}</span>
            <span className="text-foreground/55">{e.what}</span>
            <span className="font-mono text-[11px] text-amber/80 ml-auto">{e.id}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ConversationsTab() {
  return (
    <div className="p-6 space-y-3 overflow-auto h-full">
      {[
        { from: "Orchestrator", to: "Analysis_Engine", text: "Reason over normalised payload, return top 5 risk vectors." },
        { from: "Analysis_Engine", to: "Orchestrator", text: "Returning 5 vectors. Confidence 0.86." },
        { from: "Orchestrator", to: "CodeGen_v2", text: "Draft mitigation snippet for vector #2." },
      ].map((c, i) => (
        <div key={i} className="surface-elevated rounded-xl p-4">
          <div className="font-mono text-[10px] text-foreground/40 uppercase tracking-wider">
            {c.from} <span className="text-foreground/30">→</span> {c.to}
          </div>
          <div className="mt-1.5 text-[13px] text-foreground/85">{c.text}</div>
        </div>
      ))}
    </div>
  );
}

function ArtifactsTab() {
  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-auto h-full">
      {[
        { name: "risk-report.md", size: "12 KB" },
        { name: "vectors.json", size: "184 KB" },
        { name: "mitigation.diff", size: "4 KB" },
        { name: "trace.ndjson", size: "62 KB" },
      ].map((a) => (
        <div key={a.name} className="surface-elevated rounded-xl px-4 py-3 flex items-center justify-between">
          <div>
            <div className="font-mono text-[12px] text-foreground/85">{a.name}</div>
            <div className="font-mono text-[10px] text-foreground/40 mt-0.5">{a.size}</div>
          </div>
          <button className="text-[11px] font-mono uppercase tracking-wider text-amber hover:text-amber-glow">
            download
          </button>
        </div>
      ))}
    </div>
  );
}

function LogsTab() {
  return (
    <div className="p-6 overflow-auto h-full">
      <CodeBlock
        caret
        lines={[
          { tag: "SYS", text: "run_8f92a · acquired lease (ttl=600s)" },
          { tag: "SYS", text: "Orchestrator → spawn(plan=pl_4421)" },
          { tag: "OUT", text: "Web_Scraper · 8 urls in 12.4s" },
          { tag: "OUT", text: "Data_Ingest · normalised 1.2MB → 812 chunks" },
          { tag: "OUT", text: "Analysis_Engine · ctx=8192 · model=claude-3.7-sonnet" },
          { tag: "SYS", text: "approval gate #2 cleared by maya@omniforge.dev" },
          { tag: "OUT", text: "completed in 142s · 4 artefacts committed" },
        ]}
      />
    </div>
  );
}

function Stat({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="bg-background/40 px-4 py-3">
      <div className="text-mono-label">{label}</div>
      <div className={cn("mt-0.5 text-[13px]", mono ? "font-mono text-foreground/85" : "text-foreground capitalize")}>
        {value}
      </div>
    </div>
  );
}
