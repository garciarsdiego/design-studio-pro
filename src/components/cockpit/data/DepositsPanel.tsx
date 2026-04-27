import { memoryDeposits } from "@/data/mock";
import { cn } from "@/lib/utils";

export function DepositsPanel() {
  return (
    <div>
      <div className="text-mono-label mb-3">Deposits · {memoryDeposits.length}</div>
      <div className="space-y-2">
        {memoryDeposits.map((d) => (
          <div
            key={d.id}
            className="surface-elevated rounded-xl px-4 py-3 flex items-center gap-4 hover:border-amber/30 transition-colors cursor-pointer"
          >
            <div className="font-mono text-[11px] text-foreground/40 w-20 shrink-0">{d.id}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium text-foreground truncate">{d.title}</div>
              <div className="font-mono text-[10px] text-foreground/40 mt-0.5 uppercase tracking-wider">
                {d.kind} · {d.size}
              </div>
            </div>
            <div className="hidden sm:block w-24 h-1.5 rounded-full bg-foreground/5 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full",
                  d.density > 0.7 ? "bg-amber" : d.density > 0.4 ? "bg-amber/60" : "bg-amber/30",
                )}
                style={{ width: `${d.density * 100}%` }}
              />
            </div>
            <div className="font-mono text-[10px] text-foreground/40 w-16 text-right shrink-0">
              {d.updated}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
