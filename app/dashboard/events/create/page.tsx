"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Users, Globe, Tag, ArrowLeft, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { AISuggestionPanel } from "@/components/events/AISuggestionPanel";
import { eventService } from "@/services/events.service";
import { authService } from "@/services/auth.service";
import { useToast } from "@/components/ui/Toast";
import { EventFormData, EventCategory } from "@/types";
import { EVENT_CATEGORY_OPTIONS } from "@/lib/utils";
import Link from "next/link";

const defaultForm: EventFormData = {
  title: "",
  description: "",
  location: "",
  event_date: "",
  event_time: "09:00",
  category: "conference",
  max_attendees: 100,
  is_online: false,
  tags: [],
};

export default function CreateEventPage() {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [form, setForm] = useState<EventFormData>(defaultForm);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof EventFormData, string>>>({});
  const [showAI, setShowAI] = useState(true);

  const update = (field: keyof EventFormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (tag && !form.tags.includes(tag) && form.tags.length < 8) {
      update("tags", [...form.tags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (t: string) => update("tags", form.tags.filter((x) => x !== t));

  const validate = () => {
    const errs: typeof errors = {};
    if (!form.title.trim()) errs.title = "Event title is required";
    if (!form.description.trim()) errs.description = "Description is required";
    if (!form.location.trim() && !form.is_online) errs.location = "Location is required for in-person events";
    if (!form.event_date) errs.event_date = "Event date is required";
    if (form.event_date && new Date(form.event_date) < new Date()) errs.event_date = "Event date must be in the future";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const { user } = await authService.getUser();
    if (!user) { router.push("/auth/login"); return; }
    const { data, error } = await eventService.createEvent(user.id, form);
    if (error) {
      toastError("Failed to create event", error.message);
      setLoading(false);
    } else {
      success("Event created!", `"${form.title}" has been published.`);
      router.push("/dashboard/events");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 animate-fade-up opacity-0" style={{ animationFillMode: "forwards" }}>
        <Link href="/dashboard/events">
          <button className="p-2 rounded-xl transition-colors hover:bg-white/8" style={{ color: "var(--text-secondary)" }}>
            <ArrowLeft className="h-5 w-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Clash Display', sans-serif" }}>Create New Event</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>Fill in the details — or let AI help you craft the perfect event</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main form */}
          <div className="lg:col-span-2 space-y-5">
            {/* Basic info card */}
            <div className="glass-card p-6 animate-fade-up opacity-0" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
              <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
                <span className="h-6 w-6 rounded-md bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-xs font-bold">1</span>
                Basic Information
              </h2>
              <div className="space-y-4">
                <Input
                  label="Event Title *"
                  placeholder="e.g. Annual Tech Summit 2025"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  error={errors.title}
                />
                <Textarea
                  label="Description *"
                  placeholder="Describe your event — what attendees can expect, who it's for, why they should attend..."
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  rows={5}
                  error={errors.description}
                />
                <Select
                  label="Category"
                  value={form.category}
                  onChange={(e) => update("category", e.target.value as EventCategory)}
                  options={EVENT_CATEGORY_OPTIONS.map((o) => ({ value: o.value, label: `${o.emoji} ${o.label}` }))}
                />
              </div>
            </div>

            {/* Date & Location card */}
            <div className="glass-card p-6 animate-fade-up opacity-0" style={{ animationDelay: "150ms", animationFillMode: "forwards" }}>
              <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
                <span className="h-6 w-6 rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xs font-bold">2</span>
                Date, Time & Location
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Event Date *"
                  type="date"
                  value={form.event_date}
                  min={today}
                  onChange={(e) => update("event_date", e.target.value)}
                  icon={<Calendar className="h-4 w-4" />}
                  error={errors.event_date}
                />
                <Input
                  label="Start Time"
                  type="time"
                  value={form.event_time}
                  onChange={(e) => update("event_time", e.target.value)}
                />
              </div>

              {/* Online toggle */}
              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => update("is_online", !form.is_online)}
                  className={`relative h-5 w-9 rounded-full transition-all duration-200 ${form.is_online ? "bg-brand-500" : "bg-white/15"}`}
                >
                  <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-200 ${form.is_online ? "left-4" : "left-0.5"}`} />
                </button>
                <div className="flex items-center gap-1.5">
                  <Globe className="h-4 w-4" style={{ color: form.is_online ? "var(--brand-primary)" : "var(--text-muted)" }} />
                  <span className="text-sm font-medium" style={{ color: form.is_online ? "var(--text-primary)" : "var(--text-secondary)" }}>
                    Online event
                  </span>
                </div>
              </div>

              {!form.is_online && (
                <div className="mt-4">
                  <Input
                    label="Location *"
                    placeholder="e.g. San Francisco Convention Center"
                    value={form.location}
                    onChange={(e) => update("location", e.target.value)}
                    icon={<MapPin className="h-4 w-4" />}
                    error={errors.location}
                  />
                </div>
              )}
              {form.is_online && (
                <div className="mt-4">
                  <Input
                    label="Meeting Link"
                    placeholder="https://zoom.us/j/..."
                    value={form.location}
                    onChange={(e) => update("location", e.target.value)}
                    icon={<Globe className="h-4 w-4" />}
                  />
                </div>
              )}
            </div>

            {/* Capacity & Tags */}
            <div className="glass-card p-6 animate-fade-up opacity-0" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
              <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
                <span className="h-6 w-6 rounded-md bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-xs font-bold">3</span>
                Capacity & Tags
              </h2>
              <div className="space-y-4">
                <Input
                  label="Max Attendees"
                  type="number"
                  placeholder="100"
                  value={form.max_attendees}
                  min={1}
                  max={100000}
                  onChange={(e) => update("max_attendees", parseInt(e.target.value) || 0)}
                  icon={<Users className="h-4 w-4" />}
                />
                <div>
                  <label className="text-sm font-medium mb-1.5 block" style={{ color: "var(--text-secondary)" }}>
                    Tags <span className="text-xs ml-1" style={{ color: "var(--text-muted)" }}>(up to 8)</span>
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Add a tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                      className="input-field flex-1"
                    />
                    <Button type="button" variant="secondary" onClick={addTag} icon={<Tag className="h-3.5 w-3.5" />} size="sm">Add</Button>
                  </div>
                  {form.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {form.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all hover:bg-rose-500/20 hover:border-rose-500/30"
                          style={{ background: "rgba(98,114,245,0.1)", border: "1px solid rgba(98,114,245,0.2)", color: "var(--brand-primary)" }}
                          onClick={() => removeTag(tag)}
                        >
                          #{tag} <span className="opacity-60">×</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3 animate-fade-up opacity-0" style={{ animationDelay: "250ms", animationFillMode: "forwards" }}>
              <Button type="submit" loading={loading} icon={<Save className="h-4 w-4" />} size="lg" className="flex-1 sm:flex-none">
                {loading ? "Publishing..." : "Publish Event"}
              </Button>
              <Link href="/dashboard/events">
                <Button variant="secondary" size="lg">Cancel</Button>
              </Link>
            </div>
          </div>

          {/* AI Panel sidebar */}
          <div className="space-y-4 animate-fade-up opacity-0" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-400" />
                <span className="text-sm font-semibold text-white">AI Assistant</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAI(!showAI)}
                className="text-xs transition-colors"
                style={{ color: "var(--text-muted)" }}
              >
                {showAI ? "Hide" : "Show"}
              </button>
            </div>
            {showAI && (
              <AISuggestionPanel
                category={form.category}
                topic={form.title.split(" ").slice(0, 3).join(" ") || undefined}
                onSelectTitle={(t) => update("title", t)}
                onSelectDescription={(d) => update("description", d)}
              />
            )}

            {/* Tips card */}
            <div className="rounded-2xl p-4 border" style={{ background: "rgba(255,255,255,0.03)", borderColor: "var(--border-subtle)" }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>Pro Tips</p>
              <ul className="space-y-2">
                {[
                  "Use AI to generate multiple title options",
                  "Add 3-5 relevant tags for discoverability",
                  "Include clear location or meeting link",
                  "Set realistic max attendee count",
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                    <span className="text-brand-400 mt-0.5 flex-shrink-0">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
