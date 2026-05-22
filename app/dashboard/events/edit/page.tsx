"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save, Sparkles, Calendar, MapPin, Users, Globe, Tag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { AISuggestionPanel } from "@/components/events/AISuggestionPanel";
import { eventService } from "@/services/events.service";
import { useToast } from "@/components/ui/Toast";
import { EventFormData, EventCategory, Event } from "@/types";
import { EVENT_CATEGORY_OPTIONS } from "@/lib/utils";
import { format } from "date-fns";

export default function EditEventPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { success, error: toastError } = useToast();

  const [event, setEvent] = useState<Event | null>(null);
  const [form, setForm] = useState<EventFormData>({
    title: "", description: "", location: "", event_date: "",
    event_time: "09:00", category: "conference", max_attendees: 100,
    is_online: false, tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<keyof EventFormData, string>>>({});

  useEffect(() => {
    if (!id) { router.push("/dashboard/events"); return; }
    eventService.getEvent(id).then(({ data, error }) => {
      if (error || !data) { router.push("/dashboard/events"); return; }
      setEvent(data);
      const d = new Date(data.event_date);
      setForm({
        title: data.title,
        description: data.description || "",
        location: data.location || "",
        event_date: format(d, "yyyy-MM-dd"),
        event_time: format(d, "HH:mm"),
        category: data.category || "conference",
        max_attendees: data.max_attendees || 100,
        is_online: data.is_online || false,
        tags: data.tags || [],
      });
      setFetching(false);
    });
  }, [id, router]);

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
    if (!form.location.trim() && !form.is_online) errs.location = "Location is required";
    if (!form.event_date) errs.event_date = "Event date is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !id) return;
    setLoading(true);
    const { error } = await eventService.updateEvent(id, form);
    if (error) {
      toastError("Failed to update event", error.message);
      setLoading(false);
    } else {
      success("Event updated!", "Your changes have been saved.");
      router.push("/dashboard/events");
    }
  };

  if (fetching) {
    return (
      <div className="space-y-6 max-w-5xl animate-pulse">
        <div className="h-10 w-64 rounded-xl bg-white/8" />
        <div className="h-64 rounded-2xl bg-white/5" />
        <div className="h-48 rounded-2xl bg-white/5" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4 animate-fade-up opacity-0" style={{ animationFillMode: "forwards" }}>
        <Link href="/dashboard/events">
          <button className="p-2 rounded-xl transition-colors hover:bg-white/8" style={{ color: "var(--text-secondary)" }}>
            <ArrowLeft className="h-5 w-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Clash Display', sans-serif" }}>Edit Event</h1>
          <p className="text-sm mt-0.5 line-clamp-1" style={{ color: "var(--text-secondary)" }}>{event?.title}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="glass-card p-6 animate-fade-up opacity-0" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
              <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
                <span className="h-6 w-6 rounded-md bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-xs font-bold">1</span>
                Basic Information
              </h2>
              <div className="space-y-4">
                <Input label="Event Title *" placeholder="Event title" value={form.title} onChange={(e) => update("title", e.target.value)} error={errors.title} />
                <Textarea label="Description *" placeholder="Describe your event..." value={form.description} onChange={(e) => update("description", e.target.value)} rows={5} error={errors.description} />
                <Select label="Category" value={form.category} onChange={(e) => update("category", e.target.value as EventCategory)}
                  options={EVENT_CATEGORY_OPTIONS.map((o) => ({ value: o.value, label: `${o.emoji} ${o.label}` }))} />
              </div>
            </div>

            <div className="glass-card p-6 animate-fade-up opacity-0" style={{ animationDelay: "150ms", animationFillMode: "forwards" }}>
              <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
                <span className="h-6 w-6 rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xs font-bold">2</span>
                Date, Time & Location
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Event Date *" type="date" value={form.event_date} onChange={(e) => update("event_date", e.target.value)} icon={<Calendar className="h-4 w-4" />} error={errors.event_date} />
                <Input label="Start Time" type="time" value={form.event_time} onChange={(e) => update("event_time", e.target.value)} />
              </div>
              <div className="mt-4 flex items-center gap-3">
                <button type="button" onClick={() => update("is_online", !form.is_online)}
                  className={`relative h-5 w-9 rounded-full transition-all duration-200 ${form.is_online ? "bg-brand-500" : "bg-white/15"}`}>
                  <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-200 ${form.is_online ? "left-4" : "left-0.5"}`} />
                </button>
                <div className="flex items-center gap-1.5">
                  <Globe className="h-4 w-4" style={{ color: form.is_online ? "var(--brand-primary)" : "var(--text-muted)" }} />
                  <span className="text-sm font-medium" style={{ color: form.is_online ? "var(--text-primary)" : "var(--text-secondary)" }}>Online event</span>
                </div>
              </div>
              <div className="mt-4">
                <Input
                  label={form.is_online ? "Meeting Link" : "Location *"}
                  placeholder={form.is_online ? "https://zoom.us/j/..." : "Event venue address"}
                  value={form.location}
                  onChange={(e) => update("location", e.target.value)}
                  icon={form.is_online ? <Globe className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                  error={errors.location}
                />
              </div>
            </div>

            <div className="glass-card p-6 animate-fade-up opacity-0" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
              <h2 className="font-semibold text-white mb-5 flex items-center gap-2">
                <span className="h-6 w-6 rounded-md bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-xs font-bold">3</span>
                Capacity & Tags
              </h2>
              <div className="space-y-4">
                <Input label="Max Attendees" type="number" value={form.max_attendees} min={1} onChange={(e) => update("max_attendees", parseInt(e.target.value) || 0)} icon={<Users className="h-4 w-4" />} />
                <div>
                  <label className="text-sm font-medium mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" placeholder="Add a tag..." value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} className="input-field flex-1" />
                    <Button type="button" variant="secondary" onClick={addTag} icon={<Tag className="h-3.5 w-3.5" />} size="sm">Add</Button>
                  </div>
                  {form.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {form.tags.map((tag) => (
                        <span key={tag} onClick={() => removeTag(tag)} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:bg-rose-500/20"
                          style={{ background: "rgba(98,114,245,0.1)", border: "1px solid rgba(98,114,245,0.2)", color: "var(--brand-primary)" }}>
                          #{tag} <span className="opacity-60">×</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 animate-fade-up opacity-0" style={{ animationDelay: "250ms", animationFillMode: "forwards" }}>
              <Button type="submit" loading={loading} icon={<Save className="h-4 w-4" />} size="lg">
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              <Link href="/dashboard/events">
                <Button variant="secondary" size="lg">Cancel</Button>
              </Link>
            </div>
          </div>

          {/* AI sidebar */}
          <div className="space-y-4 animate-fade-up opacity-0" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-400" />
              <span className="text-sm font-semibold text-white">AI Assistant</span>
            </div>
            <AISuggestionPanel
              category={form.category}
              onSelectTitle={(t) => update("title", t)}
              onSelectDescription={(d) => update("description", d)}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
