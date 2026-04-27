import { useState } from "react";
import { CapsuleTabs } from "../CapsuleTabs";
import { RunsPanel } from "./RunsPanel";
import { MemoryPanel } from "./MemoryPanel";
import { DepositsPanel } from "./DepositsPanel";

type DataTab = "runs" | "memory" | "deposits";

const TABS = [
  { id: "runs" as const, label: "Runs" },
  { id: "memory" as const, label: "Memory" },
  { id: "deposits" as const, label: "Deposits" },
];

export function DataView() {
  const [tab, setTab] = useState<DataTab>("runs");

  return (
    <section
      role="region"
      aria-label="Data"
      className="absolute inset-0 overflow-auto px-6 pt-24 pb-32 animate-fade-in"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-mono text-[12px] tracking-[0.2em] uppercase text-foreground/90">
            Data
          </h2>
          <CapsuleTabs<DataTab> items={TABS} active={tab} onChange={setTab} />
        </div>

        {tab === "runs" && <RunsPanel />}
        {tab === "memory" && <MemoryPanel />}
        {tab === "deposits" && <DepositsPanel />}
      </div>
    </section>
  );
}
