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

export function WorkflowNode({ node, selected, onClick, positioned }: Props) {
  const Icon = node.icon;
  const isHot = node.status === "active" || node.status === "processing";
  const isError = node.status === "error";

  return (
    <button
      onClick={onClick}
      style={
        positioned
          ? { left: `${node.x}%`, top: `${node.y}%` }
          : undefined
      }
      className={cn(
        positioned && "absolute -translate-x-1/2 -translate-y-1/2",
        "surface-glass-strong rounded-xl px-3.5 py-3 min-w-[180px] text-left",
        "flex items-center gap-3 transition-all duration-200",
        "hover:border-amber/30 hover:scale-[1.02]",
        selected && "border-amber/50 glow-amber-soft",
        isHot && !selected && "border-amber/40 glow-amber-soft",
        isError && !selected && "border-danger/40",
      )}
    >
      <div
        className={cn(
          "h-9 w-9 grid place-items-center rounded-lg shrink-0 border",
          isHot
            ? "bg-amber/10 border-amber/40"
            : isError
              ? "bg-danger/10 border-danger/40"
              : "bg-foreground/[0.04] border-border/15",
        )}
      >
        <Icon
          className={cn(
            "h-4 w-4",
            isHot ? "text-amber" : isError ? "text-danger" : "text-foreground/70",
          )}
          strokeWidth={1.5}
        />
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
}
