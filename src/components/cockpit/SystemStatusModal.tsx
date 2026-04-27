import { Activity } from "lucide-react";
import { GlassModal } from "./GlassModal";
import { recentActivity, systemMetrics } from "@/data/mock";
import { cn } from "@/lib/utils";

interface SystemStatusModalProps {
  open: boolean;
  onClose: () => void;
}

const TONE_COLOR = {
  amber: "text-amber",
  teal: "text-teal",
  danger: "text-danger",
  processing: "text-processing",
  default: "text-foreground/70",
};

export function SystemStatusModal({ open, onClose }: SystemStatusModalProps) {
  return (
    <GlassModal open={open} onClose={onClose} title="System Status" icon={<Activity className="h-3.5 w-3.5" />} size="md">
      <div className="space-y-6">
        {/* Metric grid */}
        <div className="grid grid-cols-2 gap-px bg-border/10 rounded-xl overflow-hidden border border-border/10">
          <Metric label="Latency" value={systemMetrics.latency} />
          <Metric label="Active Nodes" value={`${systemMetrics.activeNodes}`} suffix={`/ ${systemMetrics.totalNodes}`} />
          <Metric label="Tokens / min" value={systemMetrics.tokensPerMin} />
          <Metric label="Pending Approvals" value={`${systemMetrics.approvalsPending}`} accent />
        </div>

        {/* Activity timeline */}
        <div>
          <div className="text-mono-label mb-3">Recent Activity</div>
          <ul className="space-y-3">
            {recentActivity.map((ev) => (
              <li key={ev.id} className="flex items-baseline gap-4">
                <span className="font-mono text-[11px] text-foreground/40 w-12 shrink-0">{ev.time}</span>
                <div className="text-[13px] text-foreground/85 leading-snug">
                  <span className="font-medium">{ev.agent}</span>{" "}
                  <span className="text-foreground/60">{ev.action}</span>
                  {ev.target && (
                    <>
                      {" "}
                      <span className={cn("font-mono text-[11px]", TONE_COLOR[ev.tone])}>
                        {ev.target}
                      </span>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </GlassModal>
  );
}

function Metric({ label, value, suffix, accent }: { label: string; value: string; suffix?: string; accent?: boolean }) {
  return (
    <div className="bg-background/40 px-5 py-4">
      <div className="text-mono-label">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className={cn("text-2xl font-semibold tracking-tight", accent ? "text-amber" : "text-foreground")}>
          {value}
        </span>
        {suffix && <span className="font-mono text-[11px] text-foreground/40">{suffix}</span>}
      </div>
    </div>
  );
}
