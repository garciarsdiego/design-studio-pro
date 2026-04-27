import { Send, Sparkles } from "lucide-react";
import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";

interface ChatComposerProps {
  placeholder?: string;
  onSubmit?: (value: string) => void;
  className?: string;
  /** When embedded inside a modal, removes the fixed positioning. */
  embedded?: boolean;
  hint?: string;
}

export function ChatComposer({
  placeholder = "Instruct the active nodes…",
  onSubmit,
  className,
  embedded,
  hint,
}: ChatComposerProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit?.(value.trim());
    setValue("");
  };

  return (
    <div
      className={cn(
        !embedded &&
          "fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-[min(880px,calc(100%-3rem))]",
        className,
      )}
    >
      <form
        onSubmit={handleSubmit}
        className={cn(
          "group flex items-center gap-2 surface-glass-strong rounded-full pl-4 pr-1.5 py-1.5",
          "shadow-[0_12px_48px_-16px_rgba(0,0,0,0.85)]",
          "transition-all duration-200 ease-out-expo focus-within:border-amber/40 focus-within:shadow-[0_12px_48px_-16px_hsl(var(--amber)/0.4)]",
        )}
      >
        <Sparkles className="h-4 w-4 text-amber/70 shrink-0" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-0 outline-none text-[14px] text-foreground placeholder:text-foreground/35 py-2"
        />
        {hint && (
          <span className="hidden md:inline font-mono text-[10px] tracking-wider text-foreground/35 px-2">
            {hint}
          </span>
        )}
        <button
          type="submit"
          disabled={!value.trim()}
          className={cn(
            "h-9 w-9 grid place-items-center rounded-full transition-all duration-200",
            value.trim()
              ? "bg-amber text-amber-foreground glow-amber-soft hover:scale-105"
              : "bg-foreground/5 text-foreground/30",
          )}
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
