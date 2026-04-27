import { ChevronDown, Plus } from "lucide-react";
import { projectMeta } from "@/data/mock";

export function SessionStrip() {
  return (
    <div className="flex items-center justify-between gap-3 surface-glass rounded-full pl-4 pr-1.5 py-1.5">
      <div className="flex items-center gap-3 min-w-0 font-mono text-[11px] tracking-wider text-foreground/55">
        <span className="text-foreground/35">⌘</span>
        <span className="text-amber/90">{projectMeta.workflow}</span>
        <span className="text-foreground/20">·</span>
        <span className="truncate">ses_4421</span>
        <span className="text-foreground/20">·</span>
        <button className="flex items-center gap-1 text-foreground/70 hover:text-foreground transition-colors">
          {projectMeta.models[0]} <ChevronDown className="h-3 w-3" />
        </button>
      </div>
      <button className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors">
        <Plus className="h-3 w-3" /> New session
      </button>
    </div>
  );
}
