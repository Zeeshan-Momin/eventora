import { clsx, type ClassValue } from "clsx";
import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from "date-fns";
import { EventCategory } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatEventDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isToday(date)) return `Today, ${format(date, "h:mm a")}`;
  if (isTomorrow(date)) return `Tomorrow, ${format(date, "h:mm a")}`;
  return format(date, "MMM d, yyyy · h:mm a");
}

export function formatRelativeDate(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
}

export function isEventPast(dateStr: string): boolean {
  return isPast(new Date(dateStr));
}

export const CATEGORY_COLORS: Record<EventCategory, string> = {
  conference: "from-blue-500 to-indigo-600",
  workshop: "from-emerald-500 to-teal-600",
  meetup: "from-violet-500 to-purple-600",
  webinar: "from-cyan-500 to-blue-600",
  concert: "from-rose-500 to-pink-600",
  sports: "from-orange-500 to-amber-600",
  networking: "from-brand-500 to-brand-700",
  other: "from-slate-500 to-slate-700",
};

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  conference: "Conference",
  workshop: "Workshop",
  meetup: "Meetup",
  webinar: "Webinar",
  concert: "Concert",
  sports: "Sports",
  networking: "Networking",
  other: "Other",
};

export function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export const EVENT_CATEGORY_OPTIONS: { value: EventCategory; label: string; emoji: string }[] = [
  { value: "conference", label: "Conference", emoji: "🎯" },
  { value: "workshop", label: "Workshop", emoji: "🛠️" },
  { value: "meetup", label: "Meetup", emoji: "🤝" },
  { value: "webinar", label: "Webinar", emoji: "💻" },
  { value: "concert", label: "Concert", emoji: "🎵" },
  { value: "sports", label: "Sports", emoji: "⚡" },
  { value: "networking", label: "Networking", emoji: "🌐" },
  { value: "other", label: "Other", emoji: "✨" },
];
