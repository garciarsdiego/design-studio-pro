import { LayoutGrid, Columns3, List as ListIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { workflowNodes, type WorkflowNode as WN } from "@/data/mock";
import { WorkflowCanvas } from "./WorkflowCanvas";
import { WorkflowKanban } from "./WorkflowKanban";
import { WorkflowList } from "./WorkflowList";
import { EdgePanel } from "./EdgePanel";

type Mode = "canvas" | "kanban" | "list";

const MODES: { id: Mode; icon: typeof LayoutGrid; label: string }[] = [
  { id: "canvas", icon: LayoutGrid, label: "Canvas" },
  { id: "kanban", icon: Columns3, label: "Kanban" },
  { id: "list", icon: ListIcon, label: "List" },
];

interface Props {
  mode: Mode;
  onModeChange: (m: Mode) => void;
  selectedId?: string;
  onSelect: (n: WN | null) => void;
}

export function ConsoleView({ mode, onModeChange, selectedId, onSelect }: Props) {
  const selectedNode =
    workflowNodes.find((n) => n.id === selectedId) ?? null;

  return (
    <section
      role="region"
      aria-label="Console"
      className="absolute inset-0 animate-fade-in"
    >
      {/* View toggle — top right under nav */}
      <div className="absolute top-24 right-6 z-30 inline-flex items-center gap-0.5 surface-glass rounded-full p-1">
        {MODES.map((m) => {
          const Icon = m.icon;
          const isActive = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onModeChange(m.id)}
              aria-label={m.label}
              className={cn(
                "h-8 px-3 grid place-items-center rounded-full transition-all duration-200",
                isActive
                  ? "bg-amber text-amber-foreground glow-amber-soft"
                  : "text-foreground/55 hover:text-foreground hover:bg-foreground/5",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          );
        })}
      </div>

      <div key={mode} className="absolute inset-0 animate-fade-in">
        {mode === "canvas" && (
          <WorkflowCanvas selectedId={selectedId} onSelect={onSelect} />
        )}
        {mode === "kanban" && (
          <WorkflowKanban selectedId={selectedId} onSelect={onSelect} />
        )}
        {mode === "list" && (
          <WorkflowList selectedId={selectedId} onSelect={onSelect} />
        )}
      </div>

      <EdgePanel
        node={selectedNode}
        onClose={() => onSelect(null)}
        onJump={(n) => onSelect(n)}
      />
    </section>
  );
}
