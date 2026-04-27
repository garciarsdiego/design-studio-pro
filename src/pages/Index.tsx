import { useEffect, useState } from "react";
import { MenuCapsule } from "@/components/cockpit/MenuCapsule";
import { ChatComposer } from "@/components/cockpit/ChatComposer";
import { ChatView } from "@/components/cockpit/chat/ChatView";
import { ConsoleView } from "@/components/cockpit/console/ConsoleView";
import { DataView } from "@/components/cockpit/data/DataView";
import { NodeInspector } from "@/components/cockpit/NodeInspector";
import { SystemStatusModal } from "@/components/cockpit/SystemStatusModal";
import { SetupModal } from "@/components/cockpit/SetupModal";
import {
  agentNodes,
  systemMetrics,
  type AgentNode,
  type NavId,
  type WorkflowNode,
} from "@/data/mock";
import { toast } from "sonner";

const Index = () => {
  const [active, setActive] = useState<NavId>("chat");
  const [statusOpen, setStatusOpen] = useState(false);
  const [setupOpen, setSetupOpen] = useState(false);
  const [inspectedNode, setInspectedNode] = useState<AgentNode | null>(null);

  useEffect(() => {
    document.title = "Omniforge Studio — Agent Cockpit";
  }, []);

  const handleSubmit = (value: string) => {
    toast(`Instruction routed to Orchestrator`, {
      description: value,
      className: "font-mono text-[12px]",
    });
  };

  // Map workflow node → AgentNode shape for the inspector
  const inspectWorkflowNode = (n: WorkflowNode) => {
    const fallback = agentNodes.find((a) => a.name === n.agent) ?? agentNodes[0];
    setInspectedNode({
      ...fallback,
      id: n.id,
      name: n.label,
      status: n.status === "completed" ? "idle" : n.status,
      statusLabel: n.status.toUpperCase(),
      icon: n.icon,
      x: n.x,
      y: n.y,
      description: `${n.label} step is handled by ${n.agent}.`,
    });
  };

  return (
    <div className="relative min-h-screen bg-background bg-grid-dots overflow-hidden">
      {/* Soft radial vignette */}
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
            selectedId={inspectedNode?.id}
            onSelect={inspectWorkflowNode}
          />
        )}
        {active === "data" && <DataView />}
      </main>

      {/* Composer fixed at bottom for Console only — Chat has its own embedded stack */}
      {active === "console" && (
        <ChatComposer onSubmit={handleSubmit} hint="⌘ K" />
      )}

      <SystemStatusModal open={statusOpen} onClose={() => setStatusOpen(false)} />
      <SetupModal open={setupOpen} onClose={() => setSetupOpen(false)} />
      <NodeInspector node={inspectedNode} onClose={() => setInspectedNode(null)} />
    </div>
  );
};

export default Index;
