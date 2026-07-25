import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlaceholderPanelProps {
  title: string;
  hint: string;
  icon: LucideIcon;
  className?: string;
}

export function PlaceholderPanel({
  title,
  hint,
  icon: Icon,
  className,
}: PlaceholderPanelProps) {
  return (
    <div
      className={cn(
        "flex min-h-35 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-(--accent-11)/80 bg-(--accent-4)/50 p-5 text-center",
        className,
      )}
    >
      <Icon
        aria-hidden
        className="h-5 w-5 text-muted-foreground"
        strokeWidth={1.75}
      />
      <p className="text-sm font-bold text-muted-foreground">{title}</p>
      <p className="text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}
