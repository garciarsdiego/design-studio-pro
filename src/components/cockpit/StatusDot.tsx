import { cn } from "@/lib/utils";
import type { AgentStatus } from "@/data/mock";

interface StatusDotProps {
  status: AgentStatus | "completed";
  className?: string;
  silent?: boolean;
}

const toneFor = (status: AgentStatus | "completed") => {
  switch (status) {
    case "active":
    case "processing":
      return "bg-amber shadow-[0_0_8px_hsl(var(--amber)/0.8)]";
    case "completed":
    case "idle":
      return "bg-teal shadow-[0_0_8px_hsl(var(--teal)/0.7)]";
    case "error":
      return "bg-danger shadow-[0_0_8px_hsl(var(--danger)/0.8)]";
    default:
      return "bg-foreground/40";
  }
};

const ringFor = (status: AgentStatus | "completed") => {
  switch (status) {
    case "active":
    case "processing":
      return "before:bg-amber/60";
    case "completed":
    case "idle":
      return "before:bg-teal/60";
    case "error":
      return "before:bg-danger/60";
    default:
      return "before:bg-foreground/30";
  }
};

export function StatusDot({ status, className, silent }: StatusDotProps) {
  return (
    <span
      className={cn(
        "relative inline-flex h-2 w-2 rounded-full",
        toneFor(status),
        !silent &&
          cn(
            "before:absolute before:inset-0 before:rounded-full before:content-['']",
            ringFor(status),
          ),
        className,
      )}
      style={
        !silent
          ? ({
              ["--tw-shadow" as string]: undefined,
            } as React.CSSProperties)
          : undefined
      }
    >
      {!silent && (
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 rounded-full",
            status === "active" || status === "processing"
              ? "bg-amber/50"
              : status === "error"
                ? "bg-danger/50"
                : "bg-teal/50",
          )}
          style={{
            animation: "status-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          }}
        />
      )}
    </span>
  );
}
