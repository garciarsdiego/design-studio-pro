import { Cpu } from "lucide-react";
import { GlassModal } from "./GlassModal";
import { CodeBlock } from "./CodeBlock";
import { StatusDot } from "./StatusDot";
import type { AgentNode } from "@/data/mock";

interface NodeInspectorProps {
  node: AgentNode | null;
  onClose: () => void;
}

export function NodeInspector({ node, onClose }: NodeInspectorProps) {
  return (
    <GlassModal
      open={!!node}
      onClose={onClose}
      title={node ? `Node · ${node.name}` : "Node"}
      icon={<Cpu className="h-3.5 w-3.5" />}
      size="md"
      footer={
        <>
          <button onClick={onClose} className="px-3.5 py-1.5 rounded-md text-[12px] font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/5">
            Close
          </button>
          <button className="px-3.5 py-1.5 rounded-md text-[12px] font-medium bg-amber/10 border border-amber/40 text-amber hover:bg-amber/20 glow-amber-soft">
            Open in Console
          </button>
        </>
      }
    >
      {node && (
        <div className="space-y-5">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 grid place-items-center rounded-xl bg-amber/10 border border-amber/30 shrink-0">
              <node.icon className="h-5 w-5 text-amber" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <div className="text-[16px] font-medium text-foreground">{node.name}</div>
              <div className="mt-1 flex items-center gap-2">
                <StatusDot status={node.status} />
                <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-foreground/60">
                  {node.statusLabel}
                </span>
              </div>
              <p className="mt-3 text-[13px] text-foreground/70 leading-relaxed">{node.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-px bg-border/10 rounded-xl overflow-hidden border border-border/10">
            <Stat label="Uptime" value={node.uptime} />
            <Stat label="Tasks" value={node.tasksCompleted.toLocaleString()} />
            <Stat label="ID" value={node.id} mono />
          </div>

          <div>
            <div className="text-mono-label mb-2">Last trace</div>
            <CodeBlock
              caret
              lines={[
                { tag: "SYS", text: `${node.name} initialised in pool` },
                { tag: "USER", text: "exec → recovery_plan(intent='retry')" },
                { tag: "OUT", text: "queued 4 tasks · awaiting orchestrator" },
              ]}
            />
          </div>
        </div>
      )}
    </GlassModal>
  );
}

function Stat({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="bg-background/40 px-4 py-3">
      <div className="text-mono-label">{label}</div>
      <div className={`mt-0.5 text-[13px] ${mono ? "font-mono text-foreground/85" : "text-foreground"}`}>{value}</div>
    </div>
  );
}
