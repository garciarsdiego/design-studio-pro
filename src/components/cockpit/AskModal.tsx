import { MessageSquare, Check, X } from "lucide-react";
import { GlassModal } from "./GlassModal";
import { ChatComposer } from "./ChatComposer";
import { CodeBlock } from "./CodeBlock";
import { askMessages } from "@/data/mock";
import { cn } from "@/lib/utils";

interface AskModalProps {
  open: boolean;
  onClose: () => void;
}

export function AskModal({ open, onClose }: AskModalProps) {
  return (
    <GlassModal
      open={open}
      onClose={onClose}
      title="Ask · New Thread"
      icon={<MessageSquare className="h-3.5 w-3.5" />}
      size="lg"
    >
      <div className="flex flex-col gap-5">
        {askMessages.map((m) => (
          <div key={m.id} className={cn("flex flex-col gap-2", m.role === "user" ? "items-end" : "items-start")}>
            <div className="flex items-center gap-2">
              <span className="text-mono-label">
                {m.role === "user" ? "YOU" : m.agent ?? "AGENT"}
              </span>
              <span className="font-mono text-[10px] text-foreground/30">{m.time}</span>
            </div>
            <div
              className={cn(
                "max-w-[78%] rounded-2xl px-4 py-3 text-[14px] leading-relaxed",
                m.role === "user"
                  ? "bg-amber/10 border border-amber/20 text-foreground"
                  : "surface-glass text-foreground/90",
              )}
            >
              {m.content}
            </div>

            {m.plan && (
              <div className="w-full max-w-[78%] mt-1 surface-elevated rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-mono-label text-amber/90">PLAN PREVIEW</div>
                  <span className="font-mono text-[10px] text-foreground/40">
                    ~{m.plan.estimatedTokens.toLocaleString()} tokens
                  </span>
                </div>
                <div className="text-[13px] font-medium text-foreground">{m.plan.title}</div>
                <CodeBlock
                  lines={[
                    { tag: "SYS", text: "Director requested batch recovery." },
                    { tag: "SYS", text: "Awaiting manual confirmation for plan execution." },
                    ...m.plan.steps.map((s, i) => ({ prompt: true, text: `step ${i + 1}: ${s}` })),
                  ]}
                />
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button className="px-3.5 py-1.5 rounded-md text-[12px] font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors flex items-center gap-1.5">
                    <X className="h-3.5 w-3.5" /> Deny
                  </button>
                  <button className="px-3.5 py-1.5 rounded-md text-[12px] font-medium bg-amber/10 border border-amber/40 text-amber hover:bg-amber/20 glow-amber-soft transition-all flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5" /> Execute
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="pt-2">
          <ChatComposer
            embedded
            placeholder="Reply to thread…"
            hint="Enter to send"
          />
        </div>
      </div>
    </GlassModal>
  );
}
