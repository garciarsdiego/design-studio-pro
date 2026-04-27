import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Bug, Play, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  workflowEdges,
  workflowNodes,
  type WorkflowEdge,
  type WorkflowNode as WN,
} from "@/data/mock";
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

type Side = "right" | "left" | "top" | "bottom";

interface Anchor {
  x: number;
  y: number;
  side: Side;
}

interface Rect {
  cx: number;
  cy: number;
  w: number;
  h: number;
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

/** Pick the side of a rect closest to the line toward `target`. */
function pickSide(from: Rect, target: Rect): Side {
  const dx = target.cx - from.cx;
  const dy = target.cy - from.cy;
  return Math.abs(dx) >= Math.abs(dy)
    ? dx >= 0
      ? "right"
      : "left"
    : dy >= 0
      ? "bottom"
      : "top";
}

/** Anchor at the mid-point of a side, with optional perpendicular offset for spread. */
function anchorOnSide(rect: Rect, side: Side, offset: number): Anchor {
  switch (side) {
    case "right":
      return { x: rect.cx + rect.w / 2, y: rect.cy + offset, side };
    case "left":
      return { x: rect.cx - rect.w / 2, y: rect.cy + offset, side };
    case "top":
      return { x: rect.cx + offset, y: rect.cy - rect.h / 2, side };
    case "bottom":
      return { x: rect.cx + offset, y: rect.cy + rect.h / 2, side };
  }
}

/** Tangent vector pointing AWAY from the card on each side. */
function sideTangent(side: Side): { x: number; y: number } {
  switch (side) {
    case "right":
      return { x: 1, y: 0 };
    case "left":
      return { x: -1, y: 0 };
    case "top":
      return { x: 0, y: -1 };
    case "bottom":
      return { x: 0, y: 1 };
  }
}

export function WorkflowCanvas({ selectedId, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [rects, setRects] = useState<Record<string, Rect>>({});
  const [hovered, setHovered] = useState<HoveredEdge | null>(null);
  const [debug, setDebug] = useState(false);

  // Simulation state — overrides each edge status while playing.
  const [simStatus, setSimStatus] = useState<Record<number, WorkflowEdge["status"]> | null>(null);
  const simRef = useRef<number | null>(null);

  const measure = useCallback(() => {
    const host = containerRef.current;
    if (!host) return;
    const hostRect = host.getBoundingClientRect();
    const next: Record<string, Rect> = {};
    for (const n of workflowNodes) {
      const el = nodeRefs.current[n.id];
      if (!el) continue;
      const r = el.getBoundingClientRect();
      next[n.id] = {
        cx: r.left - hostRect.left + r.width / 2,
        cy: r.top - hostRect.top + r.height / 2,
        w: r.width,
        h: r.height,
      };
    }
    setRects(next);
  }, []);

  useLayoutEffect(() => {
    measure();
    const host = containerRef.current;
    if (!host) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(host);
    Object.values(nodeRefs.current).forEach((el) => el && ro.observe(el));
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  // Group edges by (nodeId + side) and sort by the perpendicular position of
  // the OTHER endpoint, so anchors come out in the same order they fan toward —
  // this minimises visual crossings when many edges share a face.
  const sideGroups = useMemo(() => {
    if (!Object.keys(rects).length) return null;
    type Entry = { idx: number; key: number };
    const out: Record<string, Record<Side, Entry[]>> = {};
    const ensure = (nid: string) =>
      (out[nid] ??= { right: [], left: [], top: [], bottom: [] });

    workflowEdges.forEach((e, i) => {
      const a = rects[e.from];
      const b = rects[e.to];
      if (!a || !b) return;
      const sideA = pickSide(a, b);
      const sideB = pickSide(b, a);
      // Sort key = position of the *other* endpoint along the perpendicular axis.
      ensure(e.from)[sideA].push({
        idx: i,
        key: sideA === "left" || sideA === "right" ? b.cy : b.cx,
      });
      ensure(e.to)[sideB].push({
        idx: i,
        key: sideB === "left" || sideB === "right" ? a.cy : a.cx,
      });
    });

    // Sort each bucket so neighbours along the face stay in monotonic order.
    for (const nid of Object.keys(out)) {
      for (const side of ["right", "left", "top", "bottom"] as Side[]) {
        out[nid][side].sort((a, b) => a.key - b.key);
      }
    }
    return out;
  }, [rects]);

  /** Returns the perpendicular offset for edge i on a given (node, side). */
  const offsetFor = (nid: string, side: Side, edgeIdx: number, rect: Rect) => {
    const list = sideGroups?.[nid]?.[side];
    if (!list || list.length === 0) return 0;
    const k = list.findIndex((e) => e.idx === edgeIdx);
    const n = list.length;
    if (n <= 1) return 0;
    // Reserve a generous margin so anchors never touch the corners.
    const faceLen = side === "left" || side === "right" ? rect.h : rect.w;
    const margin = Math.max(10, faceLen * 0.18);
    const extent = faceLen - margin * 2;
    // Adaptive step — keep at least 10px between anchors when possible.
    const step = extent / (n - 1);
    return -extent / 2 + k * step;
  };

  // ── Simulation ────────────────────────────────────────────────────────────
  /** Topological order of edges: respect dependencies, fall back to array order. */
  const simOrder = useMemo(() => {
    const indeg: Record<string, number> = {};
    const adj: Record<string, string[]> = {};
    const nodeIds = workflowNodes.map((n) => n.id);
    nodeIds.forEach((id) => {
      indeg[id] = 0;
      adj[id] = [];
    });
    workflowEdges.forEach((e) => {
      if (indeg[e.to] === undefined) indeg[e.to] = 0;
      if (!adj[e.from]) adj[e.from] = [];
      adj[e.from].push(e.to);
      indeg[e.to] = (indeg[e.to] ?? 0) + 1;
    });

    // Kahn — stable: keep insertion order of ready nodes.
    const queue: string[] = nodeIds.filter((id) => (indeg[id] ?? 0) === 0);
    const nodeOrder: string[] = [];
    while (queue.length) {
      const n = queue.shift()!;
      nodeOrder.push(n);
      for (const m of adj[n] ?? []) {
        indeg[m] -= 1;
        if (indeg[m] === 0) queue.push(m);
      }
    }
    const rank: Record<string, number> = {};
    nodeOrder.forEach((id, i) => (rank[id] = i));

    // Order edges by (rank(from), rank(to)); unknowns sink to the end.
    const fallback = nodeOrder.length;
    return workflowEdges
      .map((e, i) => ({
        i,
        a: rank[e.from] ?? fallback,
        b: rank[e.to] ?? fallback,
      }))
      .sort((x, y) => x.a - y.a || x.b - y.b)
      .map((e) => e.i);
  }, []);

  const startSim = useCallback(() => {
    if (simRef.current) window.clearInterval(simRef.current);
    const order = simOrder;
    let i = 0;
    setSimStatus(Object.fromEntries(order.map((k) => [k, "idle" as const])));
    simRef.current = window.setInterval(() => {
      setSimStatus((prev) => {
        const next: Record<number, WorkflowEdge["status"]> = { ...(prev ?? {}) };
        if (i > 0) next[order[i - 1]] = "completed";
        if (i < order.length) next[order[i]] = "active";
        return next;
      });
      i += 1;
      if (i > order.length) {
        if (simRef.current) {
          window.clearInterval(simRef.current);
          simRef.current = null;
        }
      }
    }, 900);
  }, [simOrder]);

  const stopSim = useCallback(() => {
    if (simRef.current) {
      window.clearInterval(simRef.current);
      simRef.current = null;
    }
    setSimStatus(null);
  }, []);

  useEffect(() => () => {
    if (simRef.current) window.clearInterval(simRef.current);
  }, []);

  const isSimming = simStatus !== null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden bg-grid-dots-tight"
      onMouseLeave={() => setHovered(null)}
    >
      {/* Top-left tools */}
      <div className="absolute top-24 left-6 z-30 inline-flex items-center gap-1 surface-glass rounded-full p-1">
        <button
          onClick={isSimming ? stopSim : startSim}
          aria-label={isSimming ? "Stop simulation" : "Run simulation"}
          className={cn(
            "h-8 px-3 inline-flex items-center gap-1.5 rounded-full text-[11px] font-mono uppercase tracking-wider transition",
            isSimming
              ? "bg-amber text-amber-foreground glow-amber-soft"
              : "text-foreground/60 hover:text-foreground hover:bg-foreground/5",
          )}
        >
          {isSimming ? <Square className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          {isSimming ? "Stop" : "Simulate"}
        </button>
        <button
          onClick={() => setDebug((d) => !d)}
          aria-label="Toggle debug overlay"
          className={cn(
            "h-8 px-3 inline-flex items-center gap-1.5 rounded-full text-[11px] font-mono uppercase tracking-wider transition",
            debug
              ? "bg-foreground text-background"
              : "text-foreground/60 hover:text-foreground hover:bg-foreground/5",
          )}
        >
          <Bug className="h-3 w-3" />
          Debug
        </button>
      </div>

      {Object.keys(rects).length > 0 && (
        <svg className="absolute inset-0 h-full w-full pointer-events-none">
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
            const a = rects[e.from];
            const b = rects[e.to];
            if (!a || !b) return null;

            const sideA = pickSide(a, b);
            const sideB = pickSide(b, a);

            const oA = offsetFor(e.from, sideA, i, a);
            const oB = offsetFor(e.to, sideB, i, b);

            const A = anchorOnSide(a, sideA, oA);
            const B = anchorOnSide(b, sideB, oB);

            const tA = sideTangent(sideA);
            const tB = sideTangent(sideB);

            const dist = Math.hypot(B.x - A.x, B.y - A.y);
            const handle = Math.max(40, dist * 0.45);

            const c1x = A.x + tA.x * handle;
            const c1y = A.y + tA.y * handle;
            const c2x = B.x + tB.x * handle;
            const c2y = B.y + tB.y * handle;

            const d = `M ${A.x} ${A.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${B.x} ${B.y}`;

            const status = simStatus?.[i] ?? e.status;
            const stroke = colorForStatus(status);
            const opacity = alphaForStatus(status);
            const isFlowing = status === "active" || status === "processing";
            const markerKey = (
              status === "active" || status === "processing"
                ? "processing"
                : status
            ) as "processing" | "completed" | "error" | "idle";

            const onMove = (ev: React.MouseEvent<SVGPathElement>) => {
              const rect = containerRef.current?.getBoundingClientRect();
              setHovered({
                edge: { ...e, status },
                x: ev.clientX - (rect?.left ?? 0),
                y: ev.clientY - (rect?.top ?? 0),
              });
            };

            const isActive = status === "active" || status === "processing";
            const isCompleted = status === "completed";
            const isHighlight = isSimming && (isActive || isCompleted);

            return (
              <g key={i}>
                {/* Soft outer glow for the currently active edge during simulation. */}
                {isSimming && isActive && (
                  <path
                    d={d}
                    fill="none"
                    stroke={stroke}
                    strokeLinecap="round"
                    style={{
                      filter: "blur(2px)",
                      animation: "edge-active-glow 1.2s ease-in-out infinite",
                    }}
                  />
                )}
                <path
                  d={d}
                  fill="none"
                  stroke={stroke}
                  strokeOpacity={isHighlight ? undefined : opacity}
                  strokeWidth={isActive ? 1.75 : isCompleted ? 1.6 : 1.25}
                  strokeDasharray={status === "idle" ? "3 5" : undefined}
                  markerEnd={`url(#wf-arrow-${markerKey})`}
                  style={
                    isSimming && isActive
                      ? { animation: "edge-active-pulse 1.2s ease-in-out infinite" }
                      : isSimming && isCompleted
                        ? { animation: "edge-completed-flash 0.6s ease-out both" }
                        : undefined
                  }
                />
                {isActive && (
                  <path
                    d={d}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={1.5}
                    strokeDasharray="4 8"
                    className="opacity-90"
                    style={{ animation: "flow-dash 1.4s linear infinite" }}
                  />
                )}
                {/* Hover hit area — narrow so close edges stay distinguishable. */}
                <path
                  d={d}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={8}
                  onMouseEnter={onMove}
                  onMouseMove={onMove}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: "help", pointerEvents: "stroke" }}
                />

                {debug && (
                  <g>
                    {/* Anchors */}
                    <circle cx={A.x} cy={A.y} r={3.5} fill="hsl(var(--amber))" />
                    <circle cx={B.x} cy={B.y} r={3.5} fill="hsl(var(--teal))" />
                    {/* Bezier control points + handles */}
                    <line
                      x1={A.x}
                      y1={A.y}
                      x2={c1x}
                      y2={c1y}
                      stroke="hsl(var(--amber) / 0.55)"
                      strokeDasharray="2 3"
                    />
                    <line
                      x1={B.x}
                      y1={B.y}
                      x2={c2x}
                      y2={c2y}
                      stroke="hsl(var(--teal) / 0.55)"
                      strokeDasharray="2 3"
                    />
                    <circle cx={c1x} cy={c1y} r={2.5} fill="hsl(var(--amber) / 0.9)" />
                    <circle cx={c2x} cy={c2y} r={2.5} fill="hsl(var(--teal) / 0.9)" />
                  </g>
                )}
              </g>
            );
          })}

          {/* Debug: draw measured rect borders */}
          {debug &&
            Object.entries(rects).map(([id, r]) => (
              <rect
                key={id}
                x={r.cx - r.w / 2}
                y={r.cy - r.h / 2}
                width={r.w}
                height={r.h}
                fill="none"
                stroke="hsl(var(--amber) / 0.35)"
                strokeDasharray="2 3"
              />
            ))}
        </svg>
      )}

      {workflowNodes.map((n) => (
        <WorkflowNode
          key={n.id}
          ref={(el) => {
            nodeRefs.current[n.id] = el;
          }}
          node={n}
          positioned
          selected={selectedId === n.id}
          onClick={() => onSelect(n)}
        />
      ))}

      {hovered && (
        <EdgeTooltip
          edge={hovered.edge}
          fromLabel={rects[hovered.edge.from] ? (workflowNodes.find((n) => n.id === hovered.edge.from)?.label ?? hovered.edge.from) : hovered.edge.from}
          toLabel={workflowNodes.find((n) => n.id === hovered.edge.to)?.label ?? hovered.edge.to}
          x={hovered.x}
          y={hovered.y}
        />
      )}
    </div>
  );
}
