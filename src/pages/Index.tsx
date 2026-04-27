import { useEffect, useState } from "react";
import { MenuCapsule } from "@/components/cockpit/MenuCapsule";
import { ChatComposer } from "@/components/cockpit/ChatComposer";
import { NodeCanvas } from "@/components/cockpit/NodeCanvas";
import { NodeInspector } from "@/components/cockpit/NodeInspector";
import { SystemStatusModal } from "@/components/cockpit/SystemStatusModal";
import { AskModal } from "@/components/cockpit/AskModal";
import { MemoryModal } from "@/components/cockpit/MemoryModal";
import { SetupModal } from "@/components/cockpit/SetupModal";
import { RunsModal } from "@/components/cockpit/RunsModal";
import { agentNodes, systemMetrics, type AgentNode, type NavId } from "@/data/mock";
import { toast } from "sonner";

const Index = () => {
  const [active, setActive] = useState<NavId>("console");
  const [statusOpen, setStatusOpen] = useState(false);
  const [setupOpen, setSetupOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const [runsOpen, setRunsOpen] = useState(false);
  const [memoryOpen, setMemoryOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<AgentNode | null>(null);

  // Document title for SEO
  useEffect(() => {
    document.title = "Omniforge Studio — Agent Cockpit";
  }, []);

  const handleNavigate = (id: NavId) => {
    setActive(id);
    if (id === "console") return;
    if (id === "ask") setAskOpen(true);
    if (id === "runs") setRunsOpen(true);
    if (id === "memory") setMemoryOpen(true);
    if (id === "setup") setSetupOpen(true);
  };

  // When a modal is closed, return active to console
  const closeModal = (setter: (v: boolean) => void) => () => {
    setter(false);
    setActive("console");
  };

  const handleSubmit = (value: string) => {
    toast(`Instruction routed to Orchestrator`, {
      description: value,
      className: "font-mono text-[12px]",
    });
  };

  return (
    <div className="relative min-h-screen bg-background bg-grid-dots overflow-hidden">
      {/* Soft radial vignette to focus the canvas */}
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
        onNavigate={handleNavigate}
        onOpenStatus={() => setStatusOpen(true)}
        onOpenSettings={() => setSetupOpen(true)}
        pendingApprovals={systemMetrics.approvalsPending}
      />

      {/* Canvas with nodes */}
      <main className="relative h-screen">
        <NodeCanvas
          nodes={agentNodes}
          selectedId={selectedNode?.id}
          onSelect={(n) => setSelectedNode(n)}
        />
      </main>

      <ChatComposer onSubmit={handleSubmit} hint="⌘ K" />

      {/* Modals */}
      <SystemStatusModal open={statusOpen} onClose={() => setStatusOpen(false)} />
      <AskModal open={askOpen} onClose={closeModal(setAskOpen)} />
      <MemoryModal open={memoryOpen} onClose={closeModal(setMemoryOpen)} />
      <SetupModal open={setupOpen} onClose={closeModal(setSetupOpen)} />
      <RunsModal open={runsOpen} onClose={closeModal(setRunsOpen)} />
      <NodeInspector node={selectedNode} onClose={() => setSelectedNode(null)} />
    </div>
  );
};

export default Index;
