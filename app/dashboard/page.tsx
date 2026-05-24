import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { eventService } from "@/services/events.service";
import { aiService } from "@/services/ai.service";
import { StatCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Calendar, Users, TrendingUp, Zap, Plus, ArrowRight, Sparkles, Brain } from "lucide-react";
import { formatRelativeDate, cn } from "@/lib/utils";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [{ data: events }, stats] = await Promise.all([
    eventService.getEvents(user.id),
    eventService.getDashboardStats(user.id),
  ]);

  const insights = aiService.getAIInsights(stats);
  const firstName = user.user_metadata?.full_name?.split(" ")[0] || "there";
  const upcomingEvents = (events || [])
    .filter((e) => new Date(e.event_date) > new Date())
    .slice(0, 3);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6 pb-8">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-up opacity-0" style={{ animationFillMode: "forwards" }}>
        <div>
          <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>{greeting} 👋</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: "'Clash Display', sans-serif" }}>
            Welcome back, <span className="text-gradient">{firstName}</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            {stats.upcomingEvents > 0
              ? `You have ${stats.upcomingEvents} upcoming event${stats.upcomingEvents > 1 ? "s" : ""}. Keep it up!`
              : "Your dashboard is ready. Start by creating your first event."}
          </p>
        </div>
        <Link href="/dashboard/events/create" className="flex-shrink-0">
          <Button icon={<Plus className="h-4 w-4" />} iconRight={<ArrowRight className="h-4 w-4" />}>
            New Event
          </Button>
        </Link>
      </div>

      {/* Stats grid — 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <StatCard label="Total Events" value={stats.totalEvents} icon={<Calendar className="h-5 w-5" />} color="from-brand-500 to-brand-700" delay={100} />
        <StatCard label="Published" value={stats.publishedEvents} icon={<Zap className="h-5 w-5" />} color="from-emerald-500 to-teal-600" trend={stats.publishedEvents > 0 ? "Active" : undefined} trendUp={true} delay={200} />
        <StatCard label="Attendees" value={stats.totalAttendees} icon={<Users className="h-5 w-5" />} color="from-violet-500 to-purple-700" delay={300} />
        <StatCard label="Upcoming" value={stats.upcomingEvents} icon={<TrendingUp className="h-5 w-5" />} color="from-cyan-500 to-blue-600" delay={400} />
      </div>

      {/* Two-column row */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* AI Insights */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-brand-400" />
              <h2 className="font-semibold text-white">AI Insights</h2>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(98,114,245,0.15)", color: "var(--brand-primary)", border: "1px solid rgba(98,114,245,0.25)" }}>
              Personalized
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {insights.map((insight, i) => (
              <div
                key={i}
                className="rounded-2xl p-4 border flex gap-3 items-start animate-fade-up opacity-0 transition-all hover:scale-[1.01]"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  borderColor: "rgba(255,255,255,0.08)",
                  animationDelay: `${i * 100 + 200}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <span className="text-xl flex-shrink-0 mt-0.5">{insight.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm mb-0.5">{insight.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{insight.text}</p>
                </div>
                <Link href={insight.href} className="flex-shrink-0">
                  <Button variant="secondary" size="sm" className="text-xs whitespace-nowrap">
                    {insight.action}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Upcoming</h2>
            <Link href="/dashboard/events">
              <button className="text-xs text-brand-400 hover:text-brand-300 transition-colors">View all →</button>
            </Link>
          </div>
          {upcomingEvents.length === 0 ? (
            <div className="glass-card p-6 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium text-white mb-1">No upcoming events</p>
              <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>Create your first event to get started</p>
              <Link href="/dashboard/events/create">
                <Button size="sm" icon={<Plus className="h-3.5 w-3.5" />}>Create Event</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((event, i) => (
                <div
                  key={event.id}
                  className="glass-card p-4 hover:scale-[1.01] transition-all duration-200 animate-fade-up opacity-0"
                  style={{ animationDelay: `${i * 100}ms`, animationFillMode: "forwards" }}
                >
                  <div className={cn("h-1 w-8 rounded-full mb-3 bg-gradient-to-r", event.cover_color || "from-brand-500 to-brand-700")} />
                  <p className="text-sm font-semibold text-white mb-1 line-clamp-1">{event.title}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{formatRelativeDate(event.event_date)}</p>
                  {event.location && (
                    <p className="text-xs mt-1 truncate" style={{ color: "var(--text-muted)" }}>📍 {event.location}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="glass-card p-5 animate-fade-up opacity-0" style={{ animationDelay: "500ms", animationFillMode: "forwards" }}>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-brand-400" />
          <h2 className="font-semibold text-white">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Create Event", href: "/dashboard/events/create", icon: "✨", border: "rgba(98,114,245,0.25)" },
            { label: "View All Events", href: "/dashboard/events", icon: "📅", border: "rgba(16,185,129,0.2)" },
            { label: "Edit Profile", href: "/dashboard/profile", icon: "👤", border: "rgba(168,85,247,0.2)" },
            { label: "AI Suggestions", href: "/dashboard/events/create", icon: "🤖", border: "rgba(34,211,238,0.2)" },
          ].map(({ label, href, icon, border }) => (
            <Link key={label} href={href}>
              <div
                className="rounded-xl p-4 text-center transition-all hover:scale-[1.03] cursor-pointer border"
                style={{ background: "rgba(255,255,255,0.04)", borderColor: border }}
              >
                <span className="text-2xl mb-2 block">{icon}</span>
                <p className="text-xs font-medium text-white">{label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
