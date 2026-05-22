import { createClient } from "@/lib/supabase";
import { Event, EventFormData } from "@/types";

function getSupabase() {
  return createClient();
}

export const eventService = {
  async getEvents(userId: string): Promise<{ data: Event[] | null; error: Error | null }> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("user_id", userId)
      .order("event_date", { ascending: true });
    return { data, error };
  },

  async getEvent(id: string): Promise<{ data: Event | null; error: Error | null }> {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();
    return { data, error };
  },

  async createEvent(
    userId: string,
    formData: EventFormData
  ): Promise<{ data: Event | null; error: Error | null }> {
    const supabase = getSupabase();
    const eventDateTime = `${formData.event_date}T${formData.event_time || "00:00"}:00`;
    const { data, error } = await supabase
      .from("events")
      .insert({
        user_id: userId,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        event_date: eventDateTime,
        category: formData.category,
        max_attendees: formData.max_attendees,
        is_online: formData.is_online,
        tags: formData.tags,
        status: "published",
        attendees_count: 0,
        cover_color: getRandomGradient(),
      })
      .select()
      .single();
    return { data, error };
  },

  async updateEvent(
    id: string,
    updates: Partial<EventFormData>
  ): Promise<{ data: Event | null; error: Error | null }> {
    const supabase = getSupabase();
    const updateData: Record<string, unknown> = { ...updates, updated_at: new Date().toISOString() };
    if (updates.event_date && updates.event_time) {
      updateData.event_date = `${updates.event_date}T${updates.event_time}:00`;
      delete updateData.event_time;
    }
    const { data, error } = await supabase
      .from("events")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  },

  async deleteEvent(id: string): Promise<{ error: Error | null }> {
    const supabase = getSupabase();
    const { error } = await supabase.from("events").delete().eq("id", id);
    return { error };
  },

  async getDashboardStats(userId: string) {
    const supabase = getSupabase();
    const { data: events } = await supabase
      .from("events")
      .select("*")
      .eq("user_id", userId);

    if (!events) return { totalEvents: 0, publishedEvents: 0, totalAttendees: 0, upcomingEvents: 0 };

    const now = new Date();
    return {
      totalEvents: events.length,
      publishedEvents: events.filter((e) => e.status === "published").length,
      totalAttendees: events.reduce((sum, e) => sum + (e.attendees_count || 0), 0),
      upcomingEvents: events.filter((e) => new Date(e.event_date) > now).length,
    };
  },
};

function getRandomGradient(): string {
  const gradients = [
    "from-blue-500 to-indigo-600",
    "from-violet-500 to-purple-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-cyan-500 to-blue-600",
    "from-orange-500 to-amber-600",
    "from-brand-500 to-brand-700",
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
}
