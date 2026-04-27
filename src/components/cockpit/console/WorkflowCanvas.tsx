import { useMemo, useState } from "react";
import { workflowNodes, workflowEdges, type WorkflowNode as WN, type WorkflowEdge } from "@/data/mock";
import { WorkflowNode } from "./WorkflowNode";
import { EdgeTooltip } from "./EdgeTooltip";

interface Props {
  selectedId?: string;
  onSelect: (n: WN) => void;
}

interface HoveredEdge {
  edge: WorkflowEdge;
  x: number;
  y: number;
}

const colorForStatus = (s: WorkflowEdge["status"]) => {
  switch (s) {
    case "active":
    case "processing":
      return "hsl(var(--processing))";
    case "completed":
      return "hsl(var(--teal))";
    case "error":
      return "hsl(var(--danger))";
    default:
      return "hsl(0 0% 100% / 0.45)";
  }
};

const alphaForStatus = (s: WorkflowEdge["status"]) => {
  switch (s) {
    case "active":
    case "processing":
      return 0.9;
    case "completed":
      return 0.7;
    case "error":
      return 0.85;
    default:
      return 1;
  }
};

export function WorkflowCanvas({ selectedId, onSelect }: Props) {
  const byId = useMemo(
    () => Object.fromEntries(workflowNodes.map((n) => [n.id, n])),
    [],
  );

  const [hovered, setHovered] = useState<HoveredEdge | null>(null);

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-grid-dots-tight"
      onMouseLeave={() => setHovered(null)}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          {(["processing", "completed", "error", "idle"] as const).map((s) => (
            <marker
              key={s}
              id={`wf-arrow-${s}`}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto"
              markerUnits="userSpaceOnUse"
            >
              <path
                d="M0,0 L10,5 L0,10 z"
                fill={colorForStatus(s)}
                opacity={alphaForStatus(s)}
              />
            </marker>
          ))}
        </defs>

        {workflowEdges.map((e, i) => {
          const a = byId[e.from];
          const b = byId[e.to];
          if (!a || !b) return null;

          const dx = Math.max(2.5, Math.abs(b.x - a.x) * 0.35);
          const x1 = a.x;
          const y1 = a.y;
          const x2 = b.x;
          const y2 = b.y;

          const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

          const stroke = colorForStatus(e.status);
          const opacity = alphaForStatus(e.status);
          const isFlowing = e.status === "active" || e.status === "processing";
          const markerKey = (
            e.status === "active" || e.status === "processing"
              ? "processing"
              : e.status
          ) as "processing" | "completed" | "error" | "idle";

          const onMove = (ev: React.MouseEvent<SVGPathElement>) => {
            const host = ev.currentTarget.ownerSVGElement?.parentElement;
            const rect = host?.getBoundingClientRect();
            setHovered({
              edge: e,
              x: ev.clientX - (rect?.left ?? 0),
              y: ev.clientY - (rect?.top ?? 0),
            });
          };

          return (
            <g key={i}>
              {/* Visible stroke */}
              <path
                d={d}
                fill="none"
                stroke={stroke}
                strokeOpacity={opacity}
                strokeWidth={isFlowing ? 2 : 1.5}
                strokeDasharray={e.status === "idle" ? "3 5" : undefined}
                markerEnd={`url(#wf-arrow-${markerKey})`}
                pointerEvents="none"
              />
              {isFlowing && (
                <path
                  d={d}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={1.5}
                  strokeDasharray="4 8"
                  className="opacity-90"
                  style={{ animation: "flow-dash 1.4s linear infinite" }}
                  pointerEvents="none"
                />
              )}
              {/* Invisible thick hit area for hover */}
              <path
                d={d}
                fill="none"
                stroke="transparent"
                strokeWidth={14}
                onMouseEnter={onMove}
                onMouseMove={onMove}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "help" }}
              >
                <title>
                  {`${a.label} → ${b.label}\nstatus: ${e.status}\nevent: ${e.event}\nat: ${e.lastTransition}`}
                </title>
              </path>
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

      {hovered && (
        <EdgeTooltip
          edge={hovered.edge}
          fromLabel={byId[hovered.edge.from]?.label ?? hovered.edge.from}
          toLabel={byId[hovered.edge.to]?.label ?? hovered.edge.to}
          x={hovered.x}
          y={hovered.y}
        />
      )}
    </div>
  );
}
