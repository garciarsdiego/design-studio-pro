import { workflowNodes, type WorkflowNode as WN } from "@/data/mock";
import { StatusDot } from "../StatusDot";

interface Props {
  onSelect: (n: WN) => void;
}

export function WorkflowList({ onSelect }: Props) {
  return (
    <div className="absolute inset-0 overflow-auto px-6 pt-24 pb-32">
      <div className="max-w-5xl mx-auto space-y-2">
        <div className="grid grid-cols-12 gap-4 px-4 pb-2 text-mono-label">
          <div className="col-span-3">ID</div>
          <div className="col-span-3">Step</div>
          <div className="col-span-2">Agent</div>
          <div className="col-span-2">Metric</div>
          <div className="col-span-2 text-right">Last run</div>
        </div>
        {workflowNodes.map((n) => (
          <button
            key={n.id}
            onClick={() => onSelect(n)}
            className="w-full grid grid-cols-12 gap-4 px-4 py-3 surface-elevated rounded-xl hover:border-amber/30 transition-colors text-left items-center"
          >
            <div className="col-span-3 flex items-center gap-2.5 min-w-0">
              <StatusDot status={n.status} />
              <span className="font-mono text-[12px] text-foreground/85 truncate">
                {n.id}
              </span>
            </div>
            <div className="col-span-3 text-[13px] text-foreground truncate">
              {n.label}
            </div>
            <div className="col-span-2 font-mono text-[11px] text-foreground/55 truncate">
              {n.agent}
            </div>
            <div className="col-span-2 font-mono text-[11px] text-foreground/55 truncate">
              {n.metric}
            </div>
            <div className="col-span-2 font-mono text-[11px] text-foreground/40 text-right">
              {n.lastRun}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
