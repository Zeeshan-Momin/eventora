"use client";

import { useState, useEffect } from "react";
import { User, Mail, Calendar, Shield, Camera, Save, Sparkles, Key } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authService } from "@/services/auth.service";
import { eventService } from "@/services/events.service";
import { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase";
import { formatRelativeDate } from "@/lib/utils";

interface AIToggleProps {
  label: string;
  desc: string;
  defaultEnabled: boolean;
}

function AIToggle({ label, desc, defaultEnabled }: AIToggleProps) {
  const [on, setOn] = useState(defaultEnabled);
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-subtle)" }}>
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{desc}</p>
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`relative h-5 w-9 rounded-full transition-all duration-200 ${on ? "bg-brand-500" : "bg-white/15"}`}
      >
        <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-200 ${on ? "left-4" : "left-0.5"}`} />
      </button>
    </div>
  );
}

export default function ProfilePage() {
  const { success, error: toastError } = useToast();
  const [user, setUser] = useState<{ id: string; email: string; full_name: string; created_at?: string } | null>(null);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalEvents: 0, publishedEvents: 0, totalAttendees: 0, upcomingEvents: 0 });

  useEffect(() => {
    authService.getUser().then(({ user }) => {
      if (user) {
        const u = {
          id: user.id,
          email: user.email || "",
          full_name: user.user_metadata?.full_name || "",
          created_at: user.created_at,
        };
        setUser(u);
        setFullName(u.full_name);
        eventService.getDashboardStats(user.id).then((s) => setStats(s));
      }
    });
  }, []);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ data: { full_name: fullName } });
    if (error) {
      toastError("Failed to update profile", error.message);
    } else {
      success("Profile updated!", "Your name has been saved.");
    }
    setLoading(false);
  };

  const initials = (fullName || user?.email || "?").slice(0, 2).toUpperCase();

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="animate-fade-up opacity-0" style={{ animationFillMode: "forwards" }}>
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Clash Display', sans-serif" }}>Your Profile</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Manage your account information and preferences</p>
      </div>

      {/* Avatar + quick info */}
      <div className="glass-card p-6 animate-fade-up opacity-0" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
        <div className="flex items-start gap-5">
          <div className="relative group flex-shrink-0">
            <div
              className="h-20 w-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
              style={{ background: "linear-gradient(135deg, #6272f5, #a855f7)", boxShadow: "0 8px 24px rgba(98,114,245,0.35)" }}
            >
              {initials}
            </div>
            <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
              <Camera className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white mb-0.5">{user?.full_name || "Your Name"}</h2>
            <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>{user?.email}</p>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Account active</span>
              </div>
              {user?.created_at && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 opacity-40" />
                  <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    Member {formatRelativeDate(user.created_at)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-6 pt-5 border-t" style={{ borderColor: "var(--border-subtle)" }}>
          {[
            { label: "Events", value: stats.totalEvents },
            { label: "Published", value: stats.publishedEvents },
            { label: "Attendees", value: stats.totalAttendees },
            { label: "Upcoming", value: stats.upcomingEvents },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold text-white" style={{ fontFamily: "'Clash Display', sans-serif" }}>{value}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Edit profile */}
      <div className="glass-card p-6 animate-fade-up opacity-0" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
        <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
          <User className="h-4 w-4 text-brand-400" />
          Personal Information
        </h3>
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            icon={<User className="h-4 w-4" />}
            placeholder="Your full name"
          />
          <Input
            label="Email Address"
            value={user?.email || ""}
            disabled
            icon={<Mail className="h-4 w-4" />}
            hint="Email cannot be changed. Contact support if needed."
          />
          <div className="flex justify-end pt-2">
            <Button loading={loading} onClick={handleSave} icon={<Save className="h-4 w-4" />}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="glass-card p-6 animate-fade-up opacity-0" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
        <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
          <Shield className="h-4 w-4 text-emerald-400" />
          Security
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-subtle)" }}>
            <div className="flex items-center gap-3">
              <Key className="h-4 w-4 text-brand-400" />
              <div>
                <p className="text-sm font-medium text-white">Password</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Last changed recently</p>
              </div>
            </div>
            <Button variant="secondary" size="sm">Change Password</Button>
          </div>
          <div className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-subtle)" }}>
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-emerald-400" />
              <div>
                <p className="text-sm font-medium text-white">Two-factor Authentication</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Add an extra layer of security</p>
              </div>
            </div>
            <Button variant="secondary" size="sm">Enable 2FA</Button>
          </div>
        </div>
      </div>

      {/* AI Features */}
      <div className="glass-card p-6 animate-fade-up opacity-0" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
        <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-400" />
          AI Preferences
        </h3>
        <div className="space-y-3">
          <AIToggle label="AI Title Suggestions" desc="Auto-generate event titles based on category" defaultEnabled={true} />
          <AIToggle label="Smart Descriptions" desc="AI-assisted event description generation" defaultEnabled={true} />
          <AIToggle label="Attendance Predictions" desc="Forecast attendee numbers using AI (Beta)" defaultEnabled={false} />
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl p-6 border animate-fade-up opacity-0" style={{ background: "rgba(244,63,94,0.04)", borderColor: "rgba(244,63,94,0.15)", animationDelay: "500ms", animationFillMode: "forwards" }}>
        <h3 className="font-semibold text-rose-400 mb-1">Danger Zone</h3>
        <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>Permanently delete your account and all associated data. This cannot be undone.</p>
        <Button variant="danger">Delete Account</Button>
      </div>
    </div>
  );
}
