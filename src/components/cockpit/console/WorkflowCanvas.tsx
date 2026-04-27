import { useMemo } from "react";
import { workflowNodes, workflowEdges, type WorkflowNode as WN } from "@/data/mock";
import { WorkflowNode } from "./WorkflowNode";

interface Props {
  selectedId?: string;
  onSelect: (n: WN) => void;
}

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
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="hsl(0 0% 100% / 0.22)" />
          </marker>
        </defs>
        {workflowEdges.map((e, i) => {
          const a = byId[e.from];
          const b = byId[e.to];
          if (!a || !b) return null;
          // Bezier curve
          const x1 = a.x;
          const y1 = a.y;
          const x2 = b.x;
          const y2 = b.y;
          const cx = (x1 + x2) / 2;
          const isHot = a.status === "active" || b.status === "active";
          return (
            <path
              key={i}
              d={`M ${x1}% ${y1}% C ${cx}% ${y1}%, ${cx}% ${y2}%, ${x2}% ${y2}%`}
              fill="none"
              stroke={
                isHot
                  ? "hsl(var(--amber) / 0.45)"
                  : "hsl(0 0% 100% / 0.14)"
              }
              strokeWidth={1.5}
              markerEnd="url(#wf-arrow)"
            />
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
    </div>
  );
}
