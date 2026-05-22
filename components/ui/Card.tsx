import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({ children, className, hover = false, gradient = false, padding = "md" }: CardProps) {
  const paddings = { none: "", sm: "p-4", md: "p-6", lg: "p-8" };
  return (
    <div
      className={cn(
        "glass-card",
        hover && "hover:scale-[1.01] cursor-pointer",
        gradient && "border-gradient",
        paddings[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  color?: string;
  delay?: number;
}

export function StatCard({ label, value, icon, trend, trendUp, color = "from-brand-500 to-brand-700", delay = 0 }: StatCardProps) {
  return (
    <div
      className="glass-card p-5 animate-fade-up opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br", color)}
          style={{ boxShadow: "0 4px 14px rgba(0,0,0,0.3)" }}
        >
          <div className="text-white w-5 h-5">{icon}</div>
        </div>
        {trend && (
          <span className={cn("text-xs font-medium px-2 py-1 rounded-full", trendUp ? "text-emerald-400 bg-emerald-500/10" : "text-rose-400 bg-rose-500/10")}>
            {trend}
          </span>
        )}
      </div>
      <div className="stat-number mb-1">{value}</div>
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}</p>
    </div>
  );
}
