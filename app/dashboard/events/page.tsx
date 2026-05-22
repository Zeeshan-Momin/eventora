"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Plus, Search, Filter, Calendar, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EventCard, EventCardSkeleton } from "@/components/events/EventCard";
import { eventService } from "@/services/events.service";
import { authService } from "@/services/auth.service";
import { useToast } from "@/components/ui/Toast";
import { Event, EventCategory, EventStatus } from "@/types";
import { cn, CATEGORY_LABELS, EVENT_CATEGORY_OPTIONS } from "@/lib/utils";

type FilterStatus = "all" | EventStatus;

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filtered, setFiltered] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | EventCategory>("all");
  const [showFilters, setShowFilters] = useState(false);
  const { success, error: toastError } = useToast();

  const fetchEvents = useCallback(async () => {
    const { user } = await authService.getUser();
    if (!user) return;
    setLoading(true);
    const { data } = await eventService.getEvents(user.id);
    setEvents(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  useEffect(() => {
    let result = [...events];
    if (search) result = result.filter((e) => e.title.toLowerCase().includes(search.toLowerCase()) || e.description?.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== "all") result = result.filter((e) => e.status === statusFilter);
    if (categoryFilter !== "all") result = result.filter((e) => e.category === categoryFilter);
    setFiltered(result);
  }, [events, search, statusFilter, categoryFilter]);

  const handleDelete = async (id: string) => {
    const { error } = await eventService.deleteEvent(id);
    if (error) {
      toastError("Failed to delete event", error.message);
    } else {
      success("Event deleted", "The event has been removed.");
      setEvents((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const upcoming = events.filter((e) => new Date(e.event_date) > new Date()).length;
  const past = events.filter((e) => new Date(e.event_date) <= new Date()).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-up opacity-0" style={{ animationFillMode: "forwards" }}>
        <div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Clash Display', sans-serif" }}>My Events</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            {events.length} total · {upcoming} upcoming · {past} past
          </p>
        </div>
        <Link href="/dashboard/events/create">
          <Button icon={<Plus className="h-4 w-4" />}>New Event</Button>
        </Link>
      </div>

      {/* Search + Filters */}
      <div className="glass-card p-4 space-y-3 animate-fade-up opacity-0" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 opacity-40" />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>
          <Button
            variant="secondary"
            icon={<SlidersHorizontal className="h-4 w-4" />}
            onClick={() => setShowFilters(!showFilters)}
            className={cn(showFilters && "border-brand-500/40 bg-brand-500/10")}
          >
            Filters
          </Button>
        </div>

        {showFilters && (
          <div className="grid sm:grid-cols-2 gap-3 pt-3 border-t" style={{ borderColor: "var(--border-subtle)" }}>
            <div>
              <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>Status</p>
              <div className="flex gap-2 flex-wrap">
                {(["all", "published", "draft", "cancelled", "completed"] as FilterStatus[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={cn("px-3 py-1 rounded-full text-xs font-medium border transition-all", statusFilter === s
                      ? "text-white border-brand-500/40 bg-brand-500/20"
                      : "border-transparent bg-white/5 hover:bg-white/10")}
                    style={{ color: statusFilter === s ? "white" : "var(--text-secondary)" }}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>Category</p>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setCategoryFilter("all")}
                  className={cn("px-3 py-1 rounded-full text-xs font-medium border transition-all", categoryFilter === "all"
                    ? "text-white border-brand-500/40 bg-brand-500/20"
                    : "border-transparent bg-white/5 hover:bg-white/10")}
                  style={{ color: categoryFilter === "all" ? "white" : "var(--text-secondary)" }}
                >
                  All
                </button>
                {EVENT_CATEGORY_OPTIONS.map(({ value, label, emoji }) => (
                  <button
                    key={value}
                    onClick={() => setCategoryFilter(value)}
                    className={cn("px-3 py-1 rounded-full text-xs font-medium border transition-all", categoryFilter === value
                      ? "text-white border-brand-500/40 bg-brand-500/20"
                      : "border-transparent bg-white/5 hover:bg-white/10")}
                    style={{ color: categoryFilter === value ? "white" : "var(--text-secondary)" }}
                  >
                    {emoji} {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Events grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array(6).fill(0).map((_, i) => <EventCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-16 text-center animate-fade-up opacity-0" style={{ animationFillMode: "forwards" }}>
          <div className="h-16 w-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(98,114,245,0.1)" }}>
            <Calendar className="h-8 w-8 text-brand-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {events.length === 0 ? "No events yet" : "No events match your filters"}
          </h3>
          <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
            {events.length === 0 ? "Create your first event and let AI help you craft a compelling experience." : "Try adjusting your search or filter criteria."}
          </p>
          {events.length === 0 && (
            <Link href="/dashboard/events/create">
              <Button icon={<Plus className="h-4 w-4" />}>Create your first event</Button>
            </Link>
          )}
          {events.length > 0 && (
            <Button variant="secondary" onClick={() => { setSearch(""); setStatusFilter("all"); setCategoryFilter("all"); }}>
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((event, i) => (
            <EventCard key={event.id} event={event} onDelete={handleDelete} delay={i * 60} />
          ))}
        </div>
      )}
    </div>
  );
}
