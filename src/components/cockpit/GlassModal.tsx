import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  icon?: ReactNode;
  size?: "md" | "lg" | "xl";
  children: ReactNode;
  footer?: ReactNode;
  /** Hide internal padding for fully bespoke layouts (e.g. DAG view). */
  bare?: boolean;
}

const SIZE = {
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
};

export function GlassModal({
  open,
  onClose,
  title,
  icon,
  size = "lg",
  children,
  footer,
  bare,
}: GlassModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
      {/* Solid dim backdrop — keeps focus on modal */}
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-[2px] animate-backdrop-in"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "relative w-full surface-glass-strong rounded-2xl shadow-[0_24px_80px_-16px_rgba(0,0,0,0.9)]",
          "animate-modal-in flex flex-col max-h-[88vh]",
          SIZE[size],
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-border/10">
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div className="h-7 w-7 grid place-items-center rounded-md bg-amber/10 border border-amber/30 text-amber shrink-0">
                {icon}
              </div>
            )}
            <h2 className="font-mono text-[12px] tracking-[0.2em] uppercase text-foreground/90 truncate">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 grid place-items-center rounded-md text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-colors"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className={cn("flex-1 overflow-auto", !bare && "p-6")}>{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border/10 bg-background/30 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
