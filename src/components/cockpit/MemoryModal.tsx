import { useMemo } from "react";
import { Layers } from "lucide-react";
import { GlassModal } from "./GlassModal";
import { buildMemoryMatrix, memoryDeposits } from "@/data/mock";
import { cn } from "@/lib/utils";

interface MemoryModalProps {
  open: boolean;
  onClose: () => void;
}

export function MemoryModal({ open, onClose }: MemoryModalProps) {
  const matrix = useMemo(() => buildMemoryMatrix(48, 16), []);

  return (
    <GlassModal
      open={open}
      onClose={onClose}
      title="Memory Matrix"
      icon={<Layers className="h-3.5 w-3.5" />}
      size="xl"
    >
      <div className="space-y-6">
        {/* Matrix */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="text-mono-label">FIELD DENSITY · 48 × 16</div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-foreground/45">
              <span>cold</span>
              <div className="flex">
                {[0.1, 0.3, 0.5, 0.7, 0.9].map((d) => (
                  <div
                    key={d}
                    className="h-3 w-3"
                    style={{ background: `hsl(18 86% 58% / ${d})` }}
                  />
                ))}
              </div>
              <span>hot</span>
            </div>
          </div>
          <div className="surface-elevated rounded-xl p-4 overflow-auto">
            <div className="grid gap-[2px]" style={{ gridTemplateColumns: "repeat(48, minmax(10px, 1fr))" }}>
              {matrix.flatMap((row, r) =>
                row.map((d, c) => (
                  <div
                    key={`${r}-${c}`}
                    className="aspect-square rounded-[2px] transition-transform hover:scale-150 hover:z-10 relative"
                    style={{
                      background: `hsl(18 86% 58% / ${Math.max(0.04, d)})`,
                      boxShadow: d > 0.7 ? "0 0 4px hsl(18 86% 58% / 0.6)" : undefined,
                    }}
                    title={`r${r} c${c} · ${(d * 100).toFixed(0)}%`}
                  />
                )),
              )}
            </div>
          </div>
        </div>

        {/* Deposits */}
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
                {/* Density bar */}
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
      </div>
    </GlassModal>
  );
}
