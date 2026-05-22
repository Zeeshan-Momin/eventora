import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
}

const sizes = {
  sm: { icon: "h-7 w-7 text-sm", text: "text-lg" },
  md: { icon: "h-8 w-8 text-base", text: "text-xl" },
  lg: { icon: "h-10 w-10 text-lg", text: "text-2xl" },
};

export function Logo({ className, size = "md", href = "/" }: LogoProps) {
  const s = sizes[size];
  return (
    <Link href={href} className={cn("flex items-center gap-2.5 group", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-xl font-bold text-white transition-all duration-300 group-hover:scale-105",
          s.icon
        )}
        style={{
          background: "linear-gradient(135deg, #6272f5 0%, #a855f7 100%)",
          boxShadow: "0 4px 16px rgba(98, 114, 245, 0.4)",
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-[60%] h-[60%]">
          <path
            d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 14l1.5 1.5L15 10"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span
        className={cn("font-bold tracking-tight text-white display-font", s.text)}
        style={{ fontFamily: "'Clash Display', sans-serif" }}
      >
        Eventora
      </span>
    </Link>
  );
}
