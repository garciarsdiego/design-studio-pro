import { useEffect, useState } from "react";
import { MenuCapsule } from "@/components/cockpit/MenuCapsule";
import { ChatComposer } from "@/components/cockpit/ChatComposer";
import { ChatView } from "@/components/cockpit/chat/ChatView";
import { ConsoleView } from "@/components/cockpit/console/ConsoleView";
import { DataView } from "@/components/cockpit/data/DataView";
import { SystemStatusModal } from "@/components/cockpit/SystemStatusModal";
import { SetupModal } from "@/components/cockpit/SetupModal";
import {
  systemMetrics,
  workflowNodes,
  type NavId,
  type WorkflowNode,
} from "@/data/mock";
import { toast } from "sonner";

type ConsoleMode = "canvas" | "kanban" | "list";

const Index = () => {
  const [active, setActive] = useState<NavId>("chat");
  const [statusOpen, setStatusOpen] = useState(false);
  const [setupOpen, setSetupOpen] = useState(false);

  // Console state — preserved across mode switches and view changes.
  const [consoleMode, setConsoleMode] = useState<ConsoleMode>("canvas");
  const [consoleSelectedId, setConsoleSelectedId] = useState<string | undefined>(
    "wn_reason",
  );

  useEffect(() => {
    document.title = "Omniforge Studio — Agent Cockpit";
  }, []);

  const handleSubmit = (value: string) => {
    toast(`Instruction routed to Orchestrator`, {
      description: value,
      className: "font-mono text-[12px]",
    });
  };

  const handleConsoleSelect = (n: WorkflowNode | null) => {
    setConsoleSelectedId(n?.id);
  };

  return (
    <div className="relative min-h-screen bg-background bg-grid-dots overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, hsl(0 0% 0% / 0.6) 100%)",
        }}
      />

      <h1 className="sr-only">Omniforge Studio — Agent Cockpit</h1>

      <MenuCapsule
        active={active}
        onNavigate={setActive}
        onOpenStatus={() => setStatusOpen(true)}
        onOpenSettings={() => setSetupOpen(true)}
        pendingApprovals={systemMetrics.approvalsPending}
      />

      <main className="relative h-screen">
        {active === "chat" && <ChatView onSubmit={handleSubmit} />}
        {active === "console" && (
          <ConsoleView
            mode={consoleMode}
            onModeChange={setConsoleMode}
            selectedId={consoleSelectedId}
            onSelect={handleConsoleSelect}
          />
        )}
        {active === "data" && <DataView />}
      </main>

      {active === "console" && (
        <ChatComposer onSubmit={handleSubmit} hint="⌘ K" />
      )}

      <SystemStatusModal open={statusOpen} onClose={() => setStatusOpen(false)} />
      <SetupModal open={setupOpen} onClose={() => setSetupOpen(false)} />

      {/* Touch the workflowNodes import so tree-shaking keeps it for lookups */}
      <span className="hidden">{workflowNodes.length}</span>
    </div>
  );
};

export default Index;
