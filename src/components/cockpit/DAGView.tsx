import { dagNodes, dagEdges } from "@/data/mock";
import { cn } from "@/lib/utils";
import { StatusDot } from "./StatusDot";

export function DAGView() {
  return (
    <div className="absolute inset-0">
      <svg className="absolute inset-0 h-full w-full pointer-events-none">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="hsl(0 0% 100% / 0.18)" />
          </marker>
        </defs>
        {dagEdges.map((e, i) => {
          const a = dagNodes.find((n) => n.id === e.from);
          const b = dagNodes.find((n) => n.id === e.to);
          if (!a || !b) return null;
          return (
            <line
              key={i}
              x1={`${a.x}%`}
              y1={`${a.y}%`}
              x2={`${b.x}%`}
              y2={`${b.y}%`}
              stroke="hsl(0 0% 100% / 0.14)"
              strokeWidth={1.25}
              markerEnd="url(#arrow)"
            />
          );
        })}
      </svg>

      {dagNodes.map((n) => (
        <button
          key={n.id}
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
          className={cn(
            "absolute -translate-x-1/2 -translate-y-1/2 surface-elevated rounded-xl px-3.5 py-2.5 min-w-[150px]",
            "flex items-center gap-2.5 hover:border-amber/30 transition-colors",
            n.status === "active" && "border-amber/40 glow-amber-soft",
          )}
        >
          <StatusDot status={n.status} />
          <div className="text-left">
            <div className="text-[12px] text-foreground leading-tight">{n.label}</div>
            <div className="font-mono text-[10px] text-foreground/40 leading-tight mt-0.5">{n.agent}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
