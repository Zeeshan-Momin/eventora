"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LayoutDashboard, Calendar, Plus, User, LogOut, Sparkles, Bell } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { authService } from "@/services/auth.service";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, exact: true },
  { label: "My Events", href: "/dashboard/events", icon: Calendar },
  { label: "Create Event", href: "/dashboard/events/create", icon: Plus },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

interface TopNavProps {
  user: { email: string; full_name?: string } | null;
}

export function DashboardTopNav({ user }: TopNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleSignOut = async () => {
    await authService.signOut();
    router.push("/");
    router.refresh();
  };

  const initials = user?.full_name
    ? user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || "?";

  return (
    <>
      <header
        className="lg:hidden flex items-center justify-between px-4 py-3 border-b sticky top-0 z-40"
        style={{ background: "rgba(6, 6, 15, 0.95)", borderColor: "var(--border-subtle)", backdropFilter: "blur(20px)" }}
      >
        <Logo href="/dashboard" size="sm" />
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg" style={{ color: "var(--text-secondary)" }}>
            <Bell className="h-5 w-5" />
          </button>
          <button
            className="p-2 rounded-lg text-white/60 hover:text-white transition-colors"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {open && (
        <div
          className="lg:hidden fixed inset-0 z-30 top-14"
          style={{ background: "rgba(6, 6, 15, 0.97)", backdropFilter: "blur(20px)" }}
        >
          <nav className="p-4 space-y-1">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium mb-4" style={{ background: "rgba(98, 114, 245, 0.1)", border: "1px solid rgba(98, 114, 245, 0.2)" }}>
              <Sparkles className="h-3.5 w-3.5 text-brand-400" />
              <span className="text-brand-300">AI Features Active</span>
            </div>
            {navItems.map(({ label, href, icon: Icon, exact }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  isActive(href, exact) ? "text-white" : ""
                )}
                style={
                  isActive(href, exact)
                    ? { background: "rgba(98, 114, 245, 0.15)", border: "1px solid rgba(98, 114, 245, 0.25)" }
                    : { color: "var(--text-secondary)", border: "1px solid transparent" }
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
            <div className="pt-4 border-t" style={{ borderColor: "var(--border-subtle)" }}>
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "linear-gradient(135deg, #6272f5, #a855f7)" }}>
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{user?.full_name || "User"}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{user?.email}</p>
                </div>
              </div>
              <button onClick={handleSignOut} className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400">
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
