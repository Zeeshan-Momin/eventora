"use client";

import Link from "next/link";
import { Calendar, MapPin, Users, Edit2, Trash2, MoreVertical, Globe, Clock } from "lucide-react";
import { Event } from "@/types";
import { StatusBadge, CategoryBadge } from "@/components/ui/Badge";
import { formatEventDate, isEventPast, CATEGORY_COLORS } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface EventCardProps {
  event: Event;
  onDelete?: (id: string) => void;
  delay?: number;
}

export function EventCard({ event, onDelete, delay = 0 }: EventCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const past = isEventPast(event.event_date);
  const gradientClass = event.cover_color || "from-brand-500 to-brand-700";

  const handleDelete = async () => {
    if (!onDelete) return;
    setDeleting(true);
    await onDelete(event.id);
    setDeleting(false);
    setMenuOpen(false);
  };

  return (
    <div
      className="glass-card overflow-hidden animate-fade-up opacity-0 group"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      {/* Color banner */}
      <div className={cn("h-2 bg-gradient-to-r", gradientClass)} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {event.category && <CategoryBadge category={event.category} />}
              <StatusBadge status={past ? "completed" : event.status} />
              {event.is_online && (
                <span className="badge bg-cyan-500/10 text-cyan-400 border border-cyan-500/15">
                  <Globe className="h-3 w-3" /> Online
                </span>
              )}
            </div>
            <h3 className="font-semibold text-white text-base leading-snug line-clamp-2 group-hover:text-brand-300 transition-colors">
              {event.title}
            </h3>
          </div>

          {/* Menu */}
          <div className="relative flex-shrink-0 ml-3">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white/10"
              style={{ color: "var(--text-secondary)" }}
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div
                  className="absolute right-0 top-8 z-20 min-w-[140px] rounded-xl border py-1 shadow-2xl"
                  style={{ background: "rgba(13, 13, 31, 0.98)", borderColor: "var(--border-medium)" }}
                >
                  <Link
                    href={`/dashboard/events/edit?id=${event.id}`}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-white/8"
                    style={{ color: "var(--text-secondary)" }}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Edit2 className="h-3.5 w-3.5" /> Edit Event
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {deleting ? "Deleting..." : "Delete Event"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: "var(--text-secondary)" }}>
          {event.description || "No description provided."}
        </p>

        {/* Meta */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
            <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{formatEventDate(event.event_date)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{event.location || "No location set"}</span>
          </div>
          {event.max_attendees && (
            <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
              <Users className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{event.attendees_count || 0} / {event.max_attendees} attendees</span>
              {/* Progress bar */}
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-card-hover)" }}>
                <div
                  className={cn("h-full rounded-full bg-gradient-to-r", gradientClass, "transition-all")}
                  style={{ width: `${Math.min(100, ((event.attendees_count || 0) / event.max_attendees) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {event.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-md"
                style={{ background: "var(--bg-card-hover)", color: "var(--text-muted)", border: "1px solid var(--border-subtle)" }}
              >
                #{tag}
              </span>
            ))}
            {event.tags.length > 3 && (
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>+{event.tags.length - 3} more</span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t" style={{ borderColor: "var(--border-subtle)" }}>
          <Link href={`/dashboard/events/edit?id=${event.id}`} className="flex-1">
            <Button variant="secondary" size="sm" className="w-full" icon={<Edit2 className="h-3.5 w-3.5" />}>
              Edit
            </Button>
          </Link>
          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 className="h-3.5 w-3.5" />}
            loading={deleting}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="glass-card overflow-hidden animate-pulse">
      <div className="h-2 bg-white/10" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded-full bg-white/8" />
          <div className="h-5 w-20 rounded-full bg-white/8" />
        </div>
        <div className="h-5 w-3/4 rounded bg-white/8" />
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-white/5" />
          <div className="h-3 w-5/6 rounded bg-white/5" />
        </div>
        <div className="space-y-2 pt-2">
          <div className="h-3 w-40 rounded bg-white/5" />
          <div className="h-3 w-32 rounded bg-white/5" />
        </div>
        <div className="h-8 rounded-xl bg-white/5 mt-4" />
      </div>
    </div>
  );
}
