import { cn } from "@/lib/utils";
import type { AgentNode } from "@/data/mock";
import { StatusDot } from "./StatusDot";

interface NodeCanvasProps {
  nodes: AgentNode[];
  selectedId?: string;
  onSelect: (node: AgentNode) => void;
}

export function NodeCanvas({ nodes, selectedId, onSelect }: NodeCanvasProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* SVG connections from central node to peripherals — extremely subtle */}
      <svg className="absolute inset-0 h-full w-full pointer-events-none">
        {nodes
          .filter((n) => !n.central)
          .map((n) => {
            const central = nodes.find((c) => c.central);
            if (!central) return null;
            return (
              <line
                key={`edge-${n.id}`}
                x1={`${central.x}%`}
                y1={`${central.y}%`}
                x2={`${n.x}%`}
                y2={`${n.y}%`}
                stroke="hsl(0 0% 100% / 0.05)"
                strokeWidth={1}
                strokeDasharray="2 6"
              />
            );
          })}
      </svg>

      {nodes.map((node) => {
        const isSelected = selectedId === node.id;
        const Icon = node.icon;

        if (node.central) {
          return (
            <button
              key={node.id}
              onClick={() => onSelect(node)}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2",
                "surface-glass-strong rounded-2xl px-8 py-6 min-w-[220px]",
                "flex flex-col items-center gap-3 transition-all duration-300 ease-out-expo",
                "hover:scale-[1.02]",
                "animate-[node-pulse_3s_ease-in-out_infinite]",
              )}
            >
              <div className="relative h-12 w-12 grid place-items-center rounded-xl bg-amber/10 border border-amber/30">
                <Icon className="h-6 w-6 text-amber" strokeWidth={1.5} />
                <div className="absolute inset-0 rounded-xl glow-amber-soft pointer-events-none" />
              </div>
              <div className="text-center">
                <div className="text-[15px] font-medium text-foreground">{node.name}</div>
                <div className="mt-1.5 flex items-center justify-center gap-1.5">
                  <StatusDot status={node.status} />
                  <span className="font-mono text-[10px] tracking-[0.18em] text-teal">
                    {node.statusLabel}
                  </span>
                </div>
              </div>
            </button>
          );
        }

        return (
          <button
            key={node.id}
            onClick={() => onSelect(node)}
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              animation: `float-y ${4 + (node.x % 3)}s ease-in-out infinite`,
              animationDelay: `${node.y * 0.02}s`,
            }}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2",
              "flex flex-col items-center gap-2 group",
              "transition-all duration-200",
              isSelected && "scale-110",
            )}
          >
            <div
              className={cn(
                "relative h-11 w-11 grid place-items-center rounded-full",
                "border transition-all duration-200",
                node.status === "active" || node.status === "processing"
                  ? "bg-amber/10 border-amber/40"
                  : node.status === "error"
                    ? "bg-danger/10 border-danger/40"
                    : "bg-foreground/[0.04] border-border/15",
                "group-hover:bg-foreground/[0.08] group-hover:border-border/25",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  node.status === "active" || node.status === "processing"
                    ? "text-amber"
                    : node.status === "error"
                      ? "text-danger"
                      : "text-foreground/70",
                )}
                strokeWidth={1.5}
              />
              <span
                className="absolute -bottom-0.5 -right-0.5"
                aria-label={node.statusLabel}
              >
                <StatusDot status={node.status} />
              </span>
            </div>
            <span
              className={cn(
                "font-mono text-[10px] tracking-wider transition-colors",
                node.status === "error"
                  ? "text-danger/80"
                  : node.status === "active" || node.status === "processing"
                    ? "text-amber/80"
                    : "text-foreground/55 group-hover:text-foreground/80",
              )}
            >
              {node.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
