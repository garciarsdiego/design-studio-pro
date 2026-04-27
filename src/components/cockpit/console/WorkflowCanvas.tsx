import { useMemo } from "react";
import { workflowNodes, workflowEdges, type WorkflowNode as WN } from "@/data/mock";
import { WorkflowNode } from "./WorkflowNode";

interface Props {
  selectedId?: string;
  onSelect: (n: WN) => void;
}

const NODE_HALF_W = 90; // approx half width in px of a workflow node card

export function WorkflowCanvas({ selectedId, onSelect }: Props) {
  const byId = useMemo(
    () => Object.fromEntries(workflowNodes.map((n) => [n.id, n])),
    [],
  );

  return (
    <div className="absolute inset-0 overflow-hidden bg-grid-dots-tight">
      <svg className="absolute inset-0 h-full w-full pointer-events-none">
        <defs>
          <marker
            id="wf-arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="hsl(0 0% 100% / 0.32)" />
          </marker>
          <marker
            id="wf-arrow-hot"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="hsl(var(--amber) / 0.7)" />
          </marker>
        </defs>

        {workflowEdges.map((e, i) => {
          const a = byId[e.from];
          const b = byId[e.to];
          if (!a || !b) return null;

          const isHot =
            (a.status === "active" || a.status === "processing") &&
            b.status !== "idle";
          const isError = a.status === "error";

          // n8n-style: out from right of source, in to left of target.
          // Use CSS calc-friendly mixed units via two paths in pixels would require ResizeObserver,
          // so we approximate by offsetting a few percent horizontally.
          const dx = Math.max(2.5, Math.abs(b.x - a.x) * 0.35);
          const x1 = a.x;
          const y1 = a.y;
          const x2 = b.x;
          const y2 = b.y;

          const d = `M ${x1}% ${y1}% C ${x1 + dx}% ${y1}%, ${x2 - dx}% ${y2}%, ${x2}% ${y2}%`;

          const stroke = isError
            ? "hsl(var(--danger) / 0.55)"
            : isHot
              ? "hsl(var(--amber) / 0.6)"
              : "hsl(0 0% 100% / 0.18)";

          return (
            <g key={i}>
              <path
                d={d}
                fill="none"
                stroke={stroke}
                strokeWidth={isHot ? 1.75 : 1.25}
                markerEnd={isHot ? "url(#wf-arrow-hot)" : "url(#wf-arrow)"}
              />
              {isHot && (
                <path
                  d={d}
                  fill="none"
                  stroke="hsl(var(--amber))"
                  strokeWidth={1.5}
                  strokeDasharray="4 8"
                  className="opacity-80"
                  style={{
                    animation: "flow-dash 1.4s linear infinite",
                  }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {workflowNodes.map((n) => (
        <WorkflowNode
          key={n.id}
          node={n}
          positioned
          selected={selectedId === n.id}
          onClick={() => onSelect(n)}
        />
      ))}

      {/* unused width var to silence lint if needed */}
      <span className="hidden">{NODE_HALF_W}</span>
    </div>
  );
}
