import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CodeBlockProps {
  lines: { tag?: "SYS" | "USER" | "OUT"; text: string; prompt?: boolean }[];
  className?: string;
  caret?: boolean;
}

const TAG_COLOR: Record<string, string> = {
  SYS: "text-amber",
  USER: "text-teal",
  OUT: "text-foreground/55",
};

export function CodeBlock({ lines, className, caret }: CodeBlockProps) {
  return (
    <pre
      className={cn(
        "font-mono text-[12px] leading-relaxed bg-background/60 border border-border/10 rounded-lg px-4 py-3 overflow-auto",
        className,
      )}
    >
      {lines.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap break-words">
          {line.tag && (
            <span className={cn(TAG_COLOR[line.tag], "mr-2")}>[{line.tag}]</span>
          )}
          {line.prompt && <span className="text-amber mr-2">{">"}</span>}
          <span className="text-foreground/85">{line.text}</span>
          {caret && i === lines.length - 1 && (
            <span
              className="inline-block w-1.5 h-3 bg-amber/80 ml-1 align-middle"
              style={{ animation: "caret-blink 1s steps(1) infinite" }}
            />
          )}
        </div>
      ))}
    </pre>
  );
}

interface InlineKbdProps { children: ReactNode }
export function Kbd({ children }: InlineKbdProps) {
  return (
    <span className="font-mono text-[10px] tracking-wider px-1.5 py-0.5 rounded bg-foreground/5 border border-border/10 text-foreground/70">
      {children}
    </span>
  );
}
