import { useEffect, useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import { ChatComposer } from "../ChatComposer";
import { CodeBlock } from "../CodeBlock";
import { SessionStrip } from "./SessionStrip";
import { askMessages, type ChatMessage } from "@/data/mock";
import { cn } from "@/lib/utils";

interface ChatViewProps {
  onSubmit?: (value: string) => void;
}

interface DisplayMessage extends ChatMessage {
  /** Timestamp (ms) when message entered the view — used to gate the fade-in. */
  appearAt: number;
}

const stamp = (m: ChatMessage, t: number): DisplayMessage => ({ ...m, appearAt: t });

export function ChatView({ onSubmit }: ChatViewProps) {
  const initial = useMemo(() => {
    const t = Date.now();
    return askMessages.map((m, i) => stamp(m, t + i));
  }, []);

  const [messages, setMessages] = useState<DisplayMessage[]>(initial);
  const [sessionToken, setSessionToken] = useState(0);

  const startNewSession = () => {
    setMessages([]);
    setSessionToken((t) => t + 1);
    // Re-seed the demo conversation right after to show fade-in.
    setTimeout(() => {
      const t = Date.now();
      setMessages(askMessages.map((m, i) => stamp(m, t + i * 80)));
    }, 200);
  };

  // Ctrl+N / Cmd+N → new session
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        startNewSession();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSubmit = (value: string) => {
    const now = Date.now();
    const userMsg: DisplayMessage = stamp(
      {
        id: `msg_${now}`,
        role: "user",
        content: value,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
      now,
    );
    setMessages((prev) => [...prev, userMsg]);

    // Mock agent reply with its own appearAt for staggered fade-in.
    setTimeout(() => {
      const t = Date.now();
      setMessages((prev) => [
        ...prev,
        stamp(
          {
            id: `msg_${t}`,
            role: "agent",
            agent: "Orchestrator",
            content: "Acknowledged. Routing to the active node and standing by for confirmation.",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
          t,
        ),
      ]);
    }, 520);

    onSubmit?.(value);
  };

  return (
    <section
      role="region"
      aria-label="Chat"
      className="absolute inset-0 flex flex-col items-center px-4 pt-28 pb-44"
    >
      <div
        key={sessionToken}
        className="w-full max-w-[680px] flex-1 overflow-y-auto py-6 space-y-7"
      >
        {messages.map((m) => (
          <Message key={m.id} m={m} />
        ))}

        {messages.length === 0 && (
          <div className="h-full grid place-items-center animate-fade-in">
            <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-foreground/30">
              new session · ready
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-[min(680px,calc(100%-3rem))] flex flex-col gap-2">
        <SessionStrip onNewSession={startNewSession} />
        <ChatComposer
          embedded
          className="!static"
          onSubmit={handleSubmit}
          hint="↵ send · ⌃N new"
        />
      </div>
    </section>
  );
}

function Message({ m }: { m: DisplayMessage }) {
  // Each message keys its own animation off appearAt — no parent re-mount needed.
  return (
    <article
      key={m.appearAt}
      className={cn(
        "flex flex-col gap-1.5 animate-fade-in",
        m.role === "user" ? "items-end" : "items-start",
      )}
    >
      <div className="flex items-center gap-2 px-1">
        <span className="text-mono-label">
          {m.role === "user" ? "YOU" : m.agent ?? "AGENT"}
        </span>
        <span className="font-mono text-[10px] text-foreground/30">{m.time}</span>
      </div>

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
          className="w-full max-w-[92%] mt-2 surface-glass rounded-xl p-4 space-y-3 animate-fade-in"
          style={{ animationDelay: "180ms", animationFillMode: "both" }}
        >
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
  );
}
