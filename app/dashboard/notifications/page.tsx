"use client";

import { useState } from "react";
import { Bell, Calendar, Users, Zap, Check, Trash2, CheckCheck, Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type NotifType = "event" | "ai" | "system" | "attendee";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "1", type: "ai", title: "AI Insight Ready", message: "Your event 'Tech Summit 2025' has a new AI-generated description ready to review.", time: "2 min ago", read: false },
  { id: "2", type: "event", title: "Event Reminder", message: "Your event 'Design Workshop' is scheduled for tomorrow at 10:00 AM.", time: "1 hour ago", read: false },
  { id: "3", type: "attendee", title: "New Registration", message: "3 new attendees registered for 'AI Developer Meetup'.", time: "3 hours ago", read: false },
  { id: "4", type: "system", title: "Welcome to Eventora!", message: "Your account is set up and ready. Create your first event to get started.", time: "1 day ago", read: true },
  { id: "5", type: "ai", title: "Smart Recommendation", message: "Based on your activity, Thursday evenings get 40% more attendees for tech events.", time: "2 days ago", read: true },
  { id: "6", type: "event", title: "Event Published", message: "Your event 'Product Launch 2025' has been successfully published.", time: "3 days ago", read: true },
  { id: "7", type: "attendee", title: "Milestone Reached", message: "Congratulations! You've reached 100 total attendees across all your events.", time: "5 days ago", read: true },
  { id: "8", type: "system", title: "Platform Update", message: "Eventora has been updated with new AI features and performance improvements.", time: "1 week ago", read: true },
];

const typeConfig: Record<NotifType, { icon: React.ReactNode; color: string; bg: string }> = {
  event: { icon: <Calendar className="h-4 w-4" />, color: "text-brand-400", bg: "rgba(98,114,245,0.15)" },
  ai: { icon: <Zap className="h-4 w-4" />, color: "text-cyan-400", bg: "rgba(34,211,238,0.15)" },
  attendee: { icon: <Users className="h-4 w-4" />, color: "text-emerald-400", bg: "rgba(16,185,129,0.15)" },
  system: { icon: <Info className="h-4 w-4" />, color: "text-violet-400", bg: "rgba(168,85,247,0.15)" },
};

type FilterType = "all" | NotifType;

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<FilterType>("all");

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered = filter === "all" ? notifications : notifications.filter((n) => n.type === filter);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotif = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filters: { id: FilterType; label: string }[] = [
    { id: "all", label: "All" },
    { id: "event", label: "Events" },
    { id: "ai", label: "AI" },
    { id: "attendee", label: "Attendees" },
    { id: "system", label: "System" },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-up opacity-0" style={{ animationFillMode: "forwards" }}>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Clash Display', sans-serif" }}>Notifications</h1>
            {unreadCount > 0 && (
              <span className="h-6 px-2 rounded-full text-xs font-bold text-white flex items-center" style={{ background: "var(--brand-primary)" }}>
                {unreadCount}
              </span>
            )}
          </div>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="secondary" size="sm" icon={<CheckCheck className="h-3.5 w-3.5" />} onClick={markAllRead}>
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="danger" size="sm" icon={<Trash2 className="h-3.5 w-3.5" />} onClick={clearAll}>
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap animate-fade-up opacity-0" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
        {filters.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className="px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200"
            style={{
              background: filter === id ? "rgba(98,114,245,0.15)" : "rgba(255,255,255,0.04)",
              borderColor: filter === id ? "rgba(98,114,245,0.4)" : "var(--border-subtle)",
              color: filter === id ? "white" : "var(--text-secondary)",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="space-y-3 animate-fade-up opacity-0" style={{ animationDelay: "150ms", animationFillMode: "forwards" }}>
        {filtered.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <div className="h-16 w-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(98,114,245,0.1)" }}>
              <Bell className="h-8 w-8 text-brand-400" />
            </div>
            <p className="text-lg font-semibold text-white mb-1">No notifications</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>You're all caught up! New notifications will appear here.</p>
          </div>
        ) : (
          filtered.map((notif, i) => {
            const config = typeConfig[notif.type];
            return (
              <div
                key={notif.id}
                className={cn(
                  "glass-card p-4 flex gap-4 items-start transition-all duration-200 animate-fade-up opacity-0",
                  !notif.read && "border-brand-500/20"
                )}
                style={{
                  animationDelay: `${i * 50}ms`,
                  animationFillMode: "forwards",
                  borderColor: !notif.read ? "rgba(98,114,245,0.25)" : undefined,
                  background: !notif.read ? "rgba(98,114,245,0.04)" : undefined,
                }}
              >
                {/* Icon */}
                <div
                  className={cn("h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0", config.color)}
                  style={{ background: config.bg }}
                >
                  {config.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn("text-sm font-semibold", notif.read ? "text-white/70" : "text-white")}>
                      {notif.title}
                    </p>
                    <span className="text-xs flex-shrink-0" style={{ color: "var(--text-muted)" }}>{notif.time}</span>
                  </div>
                  <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {notif.message}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-1 flex-shrink-0">
                  {!notif.read && (
                    <button
                      onClick={() => markRead(notif.id)}
                      className="p-1.5 rounded-lg transition-colors hover:bg-brand-500/20"
                      title="Mark as read"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotif(notif.id)}
                    className="p-1.5 rounded-lg transition-colors hover:bg-rose-500/20 hover:text-rose-400"
                    title="Delete"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
