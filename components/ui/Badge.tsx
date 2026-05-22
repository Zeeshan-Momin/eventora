import { cn } from "@/lib/utils";
import { EventCategory, EventStatus } from "@/types";
import { CATEGORY_LABELS } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "purple";

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-white/8 text-white/70 border border-white/10",
  success: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  warning: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  danger: "bg-rose-500/15 text-rose-400 border border-rose-500/20",
  info: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20",
  purple: "bg-violet-500/15 text-violet-400 border border-violet-500/20",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

export function Badge({ children, variant = "default", className, dot }: BadgeProps) {
  return (
    <span className={cn("badge", variantStyles[variant], className)}>
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full", {
        "bg-white/60": variant === "default",
        "bg-emerald-400": variant === "success",
        "bg-amber-400": variant === "warning",
        "bg-rose-400": variant === "danger",
        "bg-cyan-400": variant === "info",
        "bg-violet-400": variant === "purple",
      })} />}
      {children}
    </span>
  );
}

const statusVariants: Record<EventStatus, BadgeVariant> = {
  published: "success",
  draft: "warning",
  cancelled: "danger",
  completed: "info",
};

export function StatusBadge({ status }: { status: EventStatus }) {
  return (
    <Badge variant={statusVariants[status]} dot>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

export function CategoryBadge({ category }: { category: EventCategory }) {
  return (
    <Badge variant="purple">
      {CATEGORY_LABELS[category]}
    </Badge>
  );
}
