import { workflowNodes, type WorkflowNode as WN } from "@/data/mock";
import { WorkflowNode } from "./WorkflowNode";

interface Props {
  onSelect: (n: WN) => void;
}

const COLUMNS: { key: WN["status"]; label: string }[] = [
  { key: "idle", label: "Idle" },
  { key: "processing", label: "Processing" },
  { key: "active", label: "Active" },
  { key: "error", label: "Error" },
  { key: "completed", label: "Completed" },
];

export function WorkflowKanban({ onSelect }: Props) {
  return (
    <div className="absolute inset-0 overflow-auto px-6 pt-24 pb-32">
      <div className="grid grid-cols-5 gap-4 min-w-[1100px]">
        {COLUMNS.map((col) => {
          const items = workflowNodes.filter((n) => n.status === col.key);
          return (
            <div key={col.key} className="flex flex-col gap-3 min-h-[300px]">
              <div className="flex items-center justify-between px-1">
                <span className="text-mono-label">{col.label}</span>
                <span className="font-mono text-[10px] text-foreground/35">
                  {items.length}
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                {items.map((n) => (
                  <WorkflowNode key={n.id} node={n} onClick={() => onSelect(n)} />
                ))}
                {items.length === 0 && (
                  <div className="surface-glass rounded-xl border-dashed h-20 grid place-items-center font-mono text-[10px] text-foreground/25">
                    empty
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
