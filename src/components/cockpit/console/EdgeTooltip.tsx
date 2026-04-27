import { ArrowRight } from "lucide-react";
import type { WorkflowEdge } from "@/data/mock";
import { cn } from "@/lib/utils";

interface Props {
  edge: WorkflowEdge;
  fromLabel: string;
  toLabel: string;
  x: number;
  y: number;
}

const toneFor = (s: WorkflowEdge["status"]) => {
  switch (s) {
    case "active":
    case "processing":
      return "text-processing border-processing/40";
    case "completed":
      return "text-teal border-teal/40";
    case "error":
      return "text-danger border-danger/40";
    default:
      return "text-foreground/60 border-border/15";
  }
};

export function EdgeTooltip({ edge, fromLabel, toLabel, x, y }: Props) {
  return (
    <div
      className="pointer-events-none absolute z-30 surface-glass-strong rounded-lg px-3 py-2 min-w-[220px] max-w-[300px] animate-fade-in"
      style={{
        left: x + 12,
        top: y + 12,
        // Avoid overflowing right edge
        transform: "translate(0, 0)",
      }}
    >
      <div className="flex items-center gap-1.5 text-[12px] text-foreground">
        <span className="truncate">{fromLabel}</span>
        <ArrowRight className="h-3 w-3 text-foreground/40 shrink-0" />
        <span className="truncate">{toLabel}</span>
      </div>
      <div
        className={cn(
          "mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-mono-label",
          toneFor(edge.status),
        )}
      >
        {edge.status}
      </div>
      <div className="mt-2 font-mono text-[10.5px] text-foreground/70 leading-relaxed break-words">
        {edge.event}
      </div>
      <div className="mt-1 font-mono text-[10px] text-foreground/35">
        {edge.lastTransition}
      </div>
    </div>
  );
}
