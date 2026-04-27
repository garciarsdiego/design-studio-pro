import { useMemo } from "react";
import { buildMemoryMatrix } from "@/data/mock";

export function MemoryPanel() {
  const matrix = useMemo(() => buildMemoryMatrix(48, 16), []);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-mono-label">FIELD DENSITY · 48 × 16</div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-foreground/45">
          <span>cold</span>
          <div className="flex">
            {[0.1, 0.3, 0.5, 0.7, 0.9].map((d) => (
              <div key={d} className="h-3 w-3" style={{ background: `hsl(18 86% 58% / ${d})` }} />
            ))}
          </div>
          <span>hot</span>
        </div>
      </div>
      <div className="surface-elevated rounded-xl p-4 overflow-auto">
        <div
          className="grid gap-[2px]"
          style={{ gridTemplateColumns: "repeat(48, minmax(10px, 1fr))" }}
        >
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
  );
}
