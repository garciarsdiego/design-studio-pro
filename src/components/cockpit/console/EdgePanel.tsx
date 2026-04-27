import { ArrowRight, ArrowLeft, X } from "lucide-react";
import { workflowEdges, workflowNodes, type WorkflowNode, type WorkflowEdge } from "@/data/mock";
import { StatusDot } from "../StatusDot";
import { cn } from "@/lib/utils";

interface Props {
  node: WorkflowNode | null;
  onClose: () => void;
  onJump: (n: WorkflowNode) => void;
}

const toneFor = (s: WorkflowEdge["status"]) => {
  switch (s) {
    case "active":
    case "processing":
      return "text-processing";
    case "completed":
      return "text-teal";
    case "error":
      return "text-danger";
    default:
      return "text-foreground/55";
  }
};

export function EdgePanel({ node, onClose, onJump }: Props) {
  if (!node) return null;

  const byId = Object.fromEntries(workflowNodes.map((n) => [n.id, n]));
  const incoming = workflowEdges.filter((e) => e.to === node.id);
  const outgoing = workflowEdges.filter((e) => e.from === node.id);

  return (
    <aside
      className="absolute top-24 right-6 bottom-24 w-[340px] z-20 surface-glass-strong rounded-2xl flex flex-col animate-fade-in shadow-[0_24px_80px_-16px_rgba(0,0,0,0.85)]"
      role="complementary"
      aria-label={`Edges for ${node.label}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-4 py-3 border-b border-border/10">
        <div className="min-w-0">
          <div className="text-mono-label">SELECTED · {node.id}</div>
          <div className="mt-1 flex items-center gap-2 min-w-0">
            <StatusDot status={node.status} />
            <span className="text-[13px] font-medium text-foreground truncate">
              {node.label}
            </span>
          </div>
          <div className="font-mono text-[10px] text-foreground/40 mt-0.5 truncate">
            {node.agent}
          </div>
        </div>
        <button
          onClick={onClose}
          className="h-7 w-7 grid place-items-center rounded-md text-foreground/50 hover:text-foreground hover:bg-foreground/5"
          aria-label="Close edges panel"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto p-4 space-y-5">
        <Section
          icon={<ArrowLeft className="h-3 w-3" />}
          label={`Incoming · ${incoming.length}`}
        >
          {incoming.length === 0 ? (
            <Empty />
          ) : (
            incoming.map((e, i) => {
              const peer = byId[e.from];
              return (
                <EdgeRow
                  key={i}
                  edge={e}
                  peer={peer}
                  direction="in"
                  onJump={() => peer && onJump(peer)}
                />
              );
            })
          )}
        </Section>

        <Section
          icon={<ArrowRight className="h-3 w-3" />}
          label={`Outgoing · ${outgoing.length}`}
        >
          {outgoing.length === 0 ? (
            <Empty />
          ) : (
            outgoing.map((e, i) => {
              const peer = byId[e.to];
              return (
                <EdgeRow
                  key={i}
                  edge={e}
                  peer={peer}
                  direction="out"
                  onJump={() => peer && onJump(peer)}
                />
              );
            })
          )}
        </Section>
      </div>
    </aside>
  );
}

function Section({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-mono-label mb-2">
        {icon}
        {label}
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function EdgeRow({
  edge,
  peer,
  direction,
  onJump,
}: {
  edge: WorkflowEdge;
  peer?: WorkflowNode;
  direction: "in" | "out";
  onJump: () => void;
}) {
  return (
    <button
      onClick={onJump}
      className="w-full text-left surface-elevated rounded-lg p-3 hover:border-amber/30 transition-colors"
    >
      <div className="flex items-center gap-2 min-w-0">
        {peer && <StatusDot status={peer.status} />}
        <span className="text-[12.5px] text-foreground truncate">
          {peer?.label ?? edge[direction === "in" ? "from" : "to"]}
        </span>
        <span className={cn("ml-auto text-mono-label", toneFor(edge.status))}>
          {edge.status}
        </span>
      </div>
      <div className="mt-1.5 font-mono text-[10.5px] text-foreground/65 leading-relaxed break-words">
        {edge.event}
      </div>
      <div className="mt-1 font-mono text-[10px] text-foreground/35">
        {edge.lastTransition}
      </div>
    </button>
  );
}

function Empty() {
  return (
    <div className="surface-elevated rounded-lg px-3 py-4 text-center font-mono text-[10px] text-foreground/30 border-dashed">
      no edges
    </div>
  );
}
