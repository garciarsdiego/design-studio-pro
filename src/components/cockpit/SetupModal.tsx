import { useState } from "react";
import { Settings2 } from "lucide-react";
import { GlassModal } from "./GlassModal";
import { CapsuleTabs } from "./CapsuleTabs";
import { projectMeta } from "@/data/mock";

type SetupTab = "workspace" | "team" | "integrations" | "models" | "data";

interface SetupModalProps {
  open: boolean;
  onClose: () => void;
}

const TABS = [
  { id: "workspace" as const, label: "Workspace" },
  { id: "team" as const, label: "Team" },
  { id: "integrations" as const, label: "Integrations" },
  { id: "models" as const, label: "Models" },
  { id: "data" as const, label: "Data" },
];

export function SetupModal({ open, onClose }: SetupModalProps) {
  const [tab, setTab] = useState<SetupTab>("workspace");

  return (
    <GlassModal
      open={open}
      onClose={onClose}
      title="Setup"
      icon={<Settings2 className="h-3.5 w-3.5" />}
      size="lg"
      footer={
        <>
          <button onClick={onClose} className="px-3.5 py-1.5 rounded-md text-[12px] font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/5">
            Cancel
          </button>
          <button className="px-3.5 py-1.5 rounded-md text-[12px] font-medium bg-amber text-amber-foreground glow-amber-soft hover:scale-[1.02] transition-transform">
            Save changes
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <CapsuleTabs<SetupTab> items={TABS} active={tab} onChange={setTab} />

        {tab === "workspace" && (
          <div className="space-y-4">
            <Field label="Workspace name" value={projectMeta.name} />
            <Field label="Workflow ID" value={projectMeta.workflow} mono />
            <Field label="Default region" value="eu-west-1" />
          </div>
        )}

        {tab === "team" && (
          <div className="space-y-2">
            {[
              { name: "Maya Chen", role: "Owner", email: "maya@omniforge.dev" },
              { name: "Jordan Vega", role: "Operator", email: "jordan@omniforge.dev" },
              { name: "Service Account", role: "Bot", email: "bot@omniforge.dev" },
            ].map((m) => (
              <div key={m.email} className="surface-elevated rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-amber/15 border border-amber/30 grid place-items-center text-[11px] font-medium text-amber">
                  {m.name.split(" ").map((p) => p[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] text-foreground">{m.name}</div>
                  <div className="font-mono text-[10px] text-foreground/40">{m.email}</div>
                </div>
                <span className="font-mono text-[10px] tracking-wider uppercase text-foreground/55">{m.role}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "integrations" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {["GitHub", "Slack", "Linear", "Stripe", "Postgres", "S3"].map((n) => (
              <div key={n} className="surface-elevated rounded-xl px-4 py-4">
                <div className="text-[13px] font-medium text-foreground">{n}</div>
                <div className="font-mono text-[10px] text-foreground/40 mt-0.5 uppercase tracking-wider">
                  not connected
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "models" && (
          <div className="space-y-2">
            {projectMeta.models.map((m) => (
              <div key={m} className="surface-elevated rounded-xl px-4 py-3 flex items-center justify-between">
                <span className="font-mono text-[12px] text-foreground/85">{m}</span>
                <span className="font-mono text-[10px] tracking-wider uppercase text-teal">enabled</span>
              </div>
            ))}
          </div>
        )}

        {tab === "data" && (
          <div className="space-y-3">
            <Field label="Vector store" value="weaviate://core" mono />
            <Field label="Object storage" value="s3://omniforge-artefacts" mono />
            <Field label="Retention" value="90 days" />
          </div>
        )}
      </div>
    </GlassModal>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <label className="block">
      <span className="text-mono-label">{label}</span>
      <div className={`mt-1.5 surface-elevated rounded-lg px-3.5 py-2.5 text-[13px] ${mono ? "font-mono text-foreground/85" : "text-foreground"}`}>
        {value}
      </div>
    </label>
  );
}
