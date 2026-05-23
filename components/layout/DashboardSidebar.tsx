"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Plus,
  User,
  LogOut,
  ChevronRight,
  Sparkles,
  Settings,
  Bell,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { authService } from "@/services/auth.service";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "My Events", href: "/dashboard/events", icon: Calendar },
  { label: "Create Event", href: "/dashboard/events/create", icon: Plus },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

const bottomItems = [
  { label: "Settings", href: "#", icon: Settings },
  { label: "Notifications", href: "#", icon: Bell },
];

interface SidebarProps {
  user: { email: string; full_name?: string } | null;
}

export function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    await authService.signOut();
    router.push("/");
    router.refresh();
  };

  const initials = user?.full_name
    ? user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || "?";

  return (
    <aside
      className="hidden lg:flex h-screen w-64 flex-col fixed left-0 top-0 border-r"
      style={{
        background: "rgba(6, 6, 15, 0.95)",
        borderColor: "var(--border-subtle)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: "var(--border-subtle)" }}>
        <Logo href="/dashboard" size="md" />
      </div>

      {/* AI badge */}
      <div className="px-4 py-3">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium"
          style={{ background: "rgba(98, 114, 245, 0.1)", border: "1px solid rgba(98, 114, 245, 0.2)" }}
        >
          <Sparkles className="h-3.5 w-3.5 text-brand-400" />
          <span className="text-brand-300">AI Features Active</span>
          <div className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                active
                  ? "text-white"
                  : "hover:bg-white/5"
              )}
              style={
                active
                  ? { background: "rgba(98, 114, 245, 0.15)", border: "1px solid rgba(98, 114, 245, 0.25)", color: "white" }
                  : { color: "var(--text-secondary)", border: "1px solid transparent" }
              }
            >
              <Icon className={cn("h-4 w-4 flex-shrink-0", active ? "text-brand-400" : "group-hover:text-white/70")} />
              {label}
              {active && <ChevronRight className="h-3.5 w-3.5 ml-auto text-brand-400" />}
            </Link>
          );
        })}

        <div className="pt-4 pb-1">
          <p className="px-3 text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
            More
          </p>
          {bottomItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-white/5"
              style={{ color: "var(--text-secondary)" }}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* User profile + sign out */}
      <div className="p-3 border-t" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 glass-card">
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #6272f5, #a855f7)" }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.full_name || "User"}</p>
            <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-rose-500/10 group"
          style={{ color: "var(--text-secondary)" }}
        >
          <LogOut className="h-4 w-4 group-hover:text-rose-400 transition-colors" />
          <span className="group-hover:text-rose-400 transition-colors">
            {signingOut ? "Signing out..." : "Sign out"}
          </span>
        </button>
      </div>
    </aside>
  );
}
