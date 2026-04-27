import { cn } from "@/lib/utils";

interface CapsuleTabsProps<T extends string> {
  items: { id: T; label: string }[];
  active: T;
  onChange: (id: T) => void;
  className?: string;
}

export function CapsuleTabs<T extends string>({
  items,
  active,
  onChange,
  className,
}: CapsuleTabsProps<T>) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 surface-glass rounded-full p-1",
        className,
      )}
    >
      {items.map((item) => {
        const isActive = item.id === active;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200",
              isActive
                ? "bg-amber text-amber-foreground glow-amber-soft"
                : "text-foreground/55 hover:text-foreground/90 hover:bg-foreground/5",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
