import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionTileProps {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  emphasis?: boolean;
}

export function ActionTile({
  href,
  label,
  description,
  icon: Icon,
  emphasis = false,
}: ActionTileProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative overflow-hidden rounded-2xl border",
        "border-(--gray-6) bg-(--accent-2)",
        "p-5 transition-all duration-200",
        "hover:border-(--accent-6)",
        "hover:shadow-sm",
        "active:scale-[0.985]",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-(--accent-8)",
        emphasis
          ? "bg-(--accent-9) text-(--accent-4) hover:bg-(--accent-10)"
          : "bg-(--accent-2) hover:bg-(--accent-3)",
      )}
    >
      <div
        className={cn(
          "absolute inset-y-0 left-0 w-1 rounded-l-2xl transition-colors duration-200",
          emphasis
            ? "bg-(--accent-10) group-hover:bg-(--accent-12)/50"
            : "bg-(--accent-6) group-hover:bg-(--accent-9)",
        )}
      />

      <div className="flex h-full flex-col justify-between gap-2">
        <div className="flex items-center gap-3">
          <Icon
            size={32}
            strokeWidth={2}
            className={cn(
              "mt-0.5 shrink-0 transition-colors duration-200",
              emphasis ? "text-(--accent-3)" : "text-(--accent-10)",
            )}
          />

          <h3 className="text-lg font-bold leading-none">{label}</h3>
        </div>

        <p
          className={cn(
            "text-sm leading-5",
            emphasis ? "text-(--accent-6) " : "text-(--gray-11)",
          )}
        >
          {description}
        </p>
      </div>
    </Link>
  );
}
