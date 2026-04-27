import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import type { WorkflowNode as WN } from "@/data/mock";
import { StatusDot } from "../StatusDot";

interface Props {
  node: WN;
  selected?: boolean;
  onClick?: () => void;
  /** When true, positions absolutely using node.x/y. */
  positioned?: boolean;
}

/**
 * Status-driven ring/glow:
 * - selected → amber (overrides everything)
 * - active / processing → blue (in progress)
 * - completed → teal (success)
 * - error → red
 * - idle → neutral border
 */
function statusStyles(node: WN, selected?: boolean) {
  if (selected) {
    return {
      ring: "border-amber/60",
      glow: "shadow-[0_0_0_1px_hsl(var(--amber)/0.45),0_0_28px_-4px_hsl(var(--amber)/0.55)]",
      iconBg: "bg-amber/10 border-amber/40",
      iconText: "text-amber",
    };
  }
  switch (node.status) {
    case "active":
    case "processing":
      return {
        ring: "border-processing/40",
        glow: "shadow-[0_0_0_1px_hsl(var(--processing)/0.35),0_0_24px_-4px_hsl(var(--processing)/0.5)]",
        iconBg: "bg-processing/10 border-processing/40",
        iconText: "text-processing",
      };
    case "completed":
      return {
        ring: "border-teal/35",
        glow: "shadow-[0_0_0_1px_hsl(var(--teal)/0.3),0_0_18px_-4px_hsl(var(--teal)/0.4)]",
        iconBg: "bg-teal/10 border-teal/40",
        iconText: "text-teal",
      };
    case "error":
      return {
        ring: "border-danger/45",
        glow: "shadow-[0_0_0_1px_hsl(var(--danger)/0.4),0_0_22px_-4px_hsl(var(--danger)/0.55)]",
        iconBg: "bg-danger/10 border-danger/40",
        iconText: "text-danger",
      };
    default:
      return {
        ring: "border-border/15",
        glow: "",
        iconBg: "bg-foreground/[0.04] border-border/15",
        iconText: "text-foreground/70",
      };
  }
}

export const WorkflowNode = forwardRef<HTMLButtonElement, Props>(
  function WorkflowNode({ node, selected, onClick, positioned }, ref) {
    const Icon = node.icon;
    const s = statusStyles(node, selected);

    return (
      <button
        ref={ref}
        onClick={onClick}
        data-node-id={node.id}
        style={
          positioned
            ? { left: `${node.x}%`, top: `${node.y}%` }
            : undefined
        }
        className={cn(
          positioned && "absolute -translate-x-1/2 -translate-y-1/2",
          "surface-glass-strong rounded-xl px-3.5 py-3 min-w-[180px] text-left border",
          "flex items-center gap-3 transition-all duration-200",
          "hover:scale-[1.02]",
          s.ring,
          s.glow,
        )}
      >
        <div className={cn("h-9 w-9 grid place-items-center rounded-lg shrink-0 border", s.iconBg)}>
          <Icon className={cn("h-4 w-4", s.iconText)} strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <StatusDot status={node.status} />
            <span className="text-[12.5px] text-foreground truncate">
              {node.label}
            </span>
          </div>
          <div className="font-mono text-[10px] text-foreground/40 mt-0.5 truncate">
            {node.agent} · {node.metric}
          </div>
        </div>
      </button>
    );
  },
);

