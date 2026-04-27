import { Bell, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems, type NavId } from "@/data/mock";

interface MenuCapsuleProps {
  active: NavId;
  onNavigate: (id: NavId) => void;
  onOpenStatus: () => void;
  onOpenSettings: () => void;
  pendingApprovals?: number;
}

export function MenuCapsule({
  active,
  onNavigate,
  onOpenStatus,
  onOpenSettings,
  pendingApprovals = 0,
}: MenuCapsuleProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-6 z-40 flex justify-center px-4">
      <div className="pointer-events-auto flex items-center gap-1 surface-glass-strong rounded-full p-1.5 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.8)]">
        {/* Brand mark */}
        <div className="flex items-center gap-2 pl-3 pr-4 border-r border-border/10">
          <div className="relative h-5 w-5">
            <div className="absolute inset-0 rounded-sm border border-amber/70 rotate-45" />
            <div className="absolute inset-1 rounded-[2px] bg-amber/30" />
          </div>
          <span className="font-mono text-[11px] tracking-[0.18em] text-foreground/90">
            OMNIFORGE
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex items-center gap-0.5 px-1">
          {navItems.map((item) => {
            const isActive = item.id === active;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "relative px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 ease-out-expo",
                  isActive
                    ? "bg-amber text-amber-foreground glow-amber-soft"
                    : "text-foreground/55 hover:text-foreground/90 hover:bg-foreground/5",
                )}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-1 pl-2 ml-1 border-l border-border/10">
          <button
            onClick={onOpenStatus}
            className="relative h-9 w-9 grid place-items-center rounded-full text-foreground/55 hover:text-foreground hover:bg-foreground/5 transition-colors"
            aria-label="System status"
          >
            <Bell className="h-4 w-4" />
            {pendingApprovals > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber shadow-[0_0_8px_hsl(var(--amber))]" />
            )}
          </button>
          <button
            onClick={onOpenSettings}
            className="h-9 w-9 grid place-items-center rounded-full text-foreground/55 hover:text-foreground hover:bg-foreground/5 transition-colors"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            className="h-9 w-9 grid place-items-center rounded-full bg-foreground/5 text-foreground/80 hover:bg-foreground/10 transition-colors"
            aria-label="Account"
          >
            <User className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
