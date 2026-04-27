import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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

const NODE_HALF_W = 105; // ~210px wide cards → half width for edge anchoring
const NODE_HALF_H = 28;  // ~56px tall cards → half height (used for vertical anchoring fallback)

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

  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [hovered, setHovered] = useState<HoveredEdge | null>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden bg-grid-dots-tight"
      onMouseLeave={() => setHovered(null)}
    >
      {size.w > 0 && (
        <svg
          className="absolute inset-0 h-full w-full pointer-events-none"
          width={size.w}
          height={size.h}
        >
          <defs>
            {(["processing", "completed", "error", "idle"] as const).map((s) => (
              <marker
                key={s}
                id={`wf-arrow-${s}`}
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path
                  d="M0,1.5 L9,5 L0,8.5 z"
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

            // Center of each card in pixels
            const ax = (a.x / 100) * size.w;
            const ay = (a.y / 100) * size.h;
            const bx = (b.x / 100) * size.w;
            const by = (b.y / 100) * size.h;

            // Anchor on the side of the card facing the peer.
            // Horizontal layout → exit right of source, enter left of target.
            const sourceRight = bx >= ax;
            const x1 = ax + (sourceRight ? NODE_HALF_W : -NODE_HALF_W);
            const y1 = ay;
            const x2 = bx + (sourceRight ? -NODE_HALF_W : NODE_HALF_W);
            const y2 = by;

            // Bezier handle — proportional to horizontal distance, n8n style.
            const handle = Math.max(40, Math.abs(x2 - x1) * 0.5);
            const cx1 = x1 + (sourceRight ? handle : -handle);
            const cx2 = x2 + (sourceRight ? -handle : handle);

            const d = `M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`;

            const stroke = colorForStatus(e.status);
            const opacity = alphaForStatus(e.status);
            const isFlowing = e.status === "active" || e.status === "processing";
            const markerKey = (
              e.status === "active" || e.status === "processing"
                ? "processing"
                : e.status
            ) as "processing" | "completed" | "error" | "idle";

            const onMove = (ev: React.MouseEvent<SVGPathElement>) => {
              const rect = containerRef.current?.getBoundingClientRect();
              setHovered({
                edge: e,
                x: ev.clientX - (rect?.left ?? 0),
                y: ev.clientY - (rect?.top ?? 0),
              });
            };

            return (
              <g key={i}>
                <path
                  d={d}
                  fill="none"
                  stroke={stroke}
                  strokeOpacity={opacity}
                  strokeWidth={isFlowing ? 1.75 : 1.25}
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
                {/* Hit area for hover */}
                <path
                  d={d}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={14}
                  onMouseEnter={onMove}
                  onMouseMove={onMove}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: "help", pointerEvents: "stroke" }}
                />
              </g>
            );
          })}
        </svg>
      )}

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
