export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
}

export interface Event {
  id: string;
  user_id: string;
  title: string;
  description: string;
  location: string;
  event_date: string;
  event_time?: string;
  category?: EventCategory;
  status: EventStatus;
  attendees_count?: number;
  max_attendees?: number;
  is_online?: boolean;
  cover_color?: string;
  tags?: string[];
  created_at: string;
  updated_at?: string;
}

export type EventCategory =
  | "conference"
  | "workshop"
  | "meetup"
  | "webinar"
  | "concert"
  | "sports"
  | "networking"
  | "other";

export type EventStatus = "draft" | "published" | "cancelled" | "completed";

export interface EventFormData {
  title: string;
  description: string;
  location: string;
  event_date: string;
  event_time: string;
  category: EventCategory;
  max_attendees: number;
  is_online: boolean;
  tags: string[];
}

export interface AIsuggestion {
  titles: string[];
  descriptions: string[];
  tags: string[];
}

export interface DashboardStats {
  totalEvents: number;
  publishedEvents: number;
  totalAttendees: number;
  upcomingEvents: number;
}
