import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { ChatComposer } from "../ChatComposer";
import { CodeBlock } from "../CodeBlock";
import { SessionStrip } from "./SessionStrip";
import { askMessages } from "@/data/mock";
import { cn } from "@/lib/utils";

interface ChatViewProps {
  onSubmit?: (value: string) => void;
}

export function ChatView({ onSubmit }: ChatViewProps) {
  // Session key — bump to force fade-in re-mount when starting a new session.
  const [sessionKey, setSessionKey] = useState(0);
  const [messages, setMessages] = useState(askMessages);

  const startNewSession = () => {
    setMessages([]);
    setSessionKey((k) => k + 1);
  };

  useEffect(() => {
    if (messages.length === 0) {
      // Re-seed mock conversation after a beat for the demo
      const t = setTimeout(() => setMessages(askMessages), 280);
      return () => clearTimeout(t);
    }
  }, [messages.length]);

  const handleSubmit = (value: string) => {
    onSubmit?.(value);
  };

  return (
    <section
      role="region"
      aria-label="Chat"
      className="absolute inset-0 flex flex-col items-center px-4 pt-28 pb-44"
    >
      {/* Floating conversation — no surrounding panel, bubbles breathe over canvas */}
      <div
        key={sessionKey}
        className="w-full max-w-[680px] flex-1 overflow-y-auto py-6 space-y-7 animate-fade-in"
      >
        {messages.map((m, idx) => (
          <article
            key={m.id}
            className={cn(
              "flex flex-col gap-1.5 animate-fade-in",
              m.role === "user" ? "items-end" : "items-start",
            )}
            style={{ animationDelay: `${Math.min(idx * 60, 360)}ms`, animationFillMode: "both" }}
          >
            <div className="flex items-center gap-2 px-1">
              <span className="text-mono-label">
                {m.role === "user" ? "YOU" : m.agent ?? "AGENT"}
              </span>
              <span className="font-mono text-[10px] text-foreground/30">
                {m.time}
              </span>
            </div>

            {/* User: plain text right-aligned. Agent: plain text left-aligned. No heavy bubbles. */}
            <div
              className={cn(
                "max-w-[92%] px-1 text-[14px] leading-relaxed",
                m.role === "user" ? "text-foreground" : "text-foreground/85",
              )}
            >
              {m.content}
            </div>

            {m.plan && (
              <div
                className={cn(
                  "w-full max-w-[92%] mt-2 surface-glass rounded-xl p-4 space-y-3",
                  "animate-fade-in",
                )}
                style={{ animationDelay: "180ms", animationFillMode: "both" }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-mono-label text-amber/90">PLAN PREVIEW</div>
                  <span className="font-mono text-[10px] text-foreground/40">
                    ~{m.plan.estimatedTokens.toLocaleString()} tokens
                  </span>
                </div>
                <div className="text-[13px] font-medium text-foreground">
                  {m.plan.title}
                </div>
                <CodeBlock
                  lines={[
                    { tag: "SYS", text: "Director requested batch recovery." },
                    { tag: "SYS", text: "Awaiting manual confirmation." },
                    ...m.plan.steps.map((s, i) => ({
                      prompt: true,
                      text: `step ${i + 1}: ${s}`,
                    })),
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
          </article>
        ))}

        {messages.length === 0 && (
          <div className="h-full grid place-items-center">
            <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-foreground/30">
              new session · ready
            </div>
          </div>
        )}
      </div>

      {/* Bottom stack: session strip + composer */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-[min(680px,calc(100%-3rem))] flex flex-col gap-2">
        <SessionStrip onNewSession={startNewSession} />
        <ChatComposer
          embedded
          className="!static"
          onSubmit={handleSubmit}
          hint="↵ send"
        />
      </div>
    </section>
  );
}
