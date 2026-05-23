"use client";

import { useState } from "react";
import { Bell, Globe, Shield, Palette, Zap, Save, Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

interface ToggleRowProps {
  label: string;
  desc: string;
  defaultValue?: boolean;
}

function ToggleRow({ label, desc, defaultValue = false }: ToggleRowProps) {
  const [on, setOn] = useState(defaultValue);
  return (
    <div className="flex items-center justify-between py-3.5 border-b last:border-0" style={{ borderColor: "var(--border-subtle)" }}>
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{desc}</p>
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`relative h-5 w-9 rounded-full transition-all duration-200 flex-shrink-0 ml-4 ${on ? "bg-brand-500" : "bg-white/15"}`}
      >
        <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-200 ${on ? "left-4" : "left-0.5"}`} />
      </button>
    </div>
  );
}

const themes = [
  { id: "dark", label: "Dark", icon: Moon },
  { id: "light", label: "Light", icon: Sun },
  { id: "system", label: "System", icon: Monitor },
];

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "hi", label: "हिन्दी" },
];

export default function SettingsPage() {
  const { success } = useToast();
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("Asia/Kolkata");

  const handleSave = () => {
    success("Settings saved!", "Your preferences have been updated.");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="animate-fade-up opacity-0" style={{ animationFillMode: "forwards" }}>
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Clash Display', sans-serif" }}>Settings</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Manage your app preferences and configurations</p>
      </div>

      {/* Appearance */}
      <div className="glass-card p-6 animate-fade-up opacity-0" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
        <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
          <Palette className="h-4 w-4 text-brand-400" />
          Appearance
        </h3>
        <div className="space-y-5">
          <div>
            <p className="text-sm font-medium mb-3" style={{ color: "var(--text-secondary)" }}>Theme</p>
            <div className="grid grid-cols-3 gap-3">
              {themes.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTheme(id)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200"
                  style={{
                    background: theme === id ? "rgba(98,114,245,0.12)" : "rgba(255,255,255,0.04)",
                    borderColor: theme === id ? "rgba(98,114,245,0.4)" : "var(--border-subtle)",
                  }}
                >
                  <Icon className="h-5 w-5" style={{ color: theme === id ? "var(--brand-primary)" : "var(--text-secondary)" }} />
                  <span className="text-sm font-medium" style={{ color: theme === id ? "white" : "var(--text-secondary)" }}>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Localization */}
      <div className="glass-card p-6 animate-fade-up opacity-0" style={{ animationDelay: "150ms", animationFillMode: "forwards" }}>
        <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
          <Globe className="h-4 w-4 text-emerald-400" />
          Localization
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="input-field w-full appearance-none"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              {languages.map((l) => (
                <option key={l.value} value={l.value} className="bg-[#0d0d1f]">{l.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block" style={{ color: "var(--text-secondary)" }}>Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="input-field w-full appearance-none"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              {["Asia/Kolkata", "America/New_York", "Europe/London", "Asia/Tokyo", "Australia/Sydney", "America/Los_Angeles"].map((tz) => (
                <option key={tz} value={tz} className="bg-[#0d0d1f]">{tz.replace("_", " ")}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card p-6 animate-fade-up opacity-0" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Bell className="h-4 w-4 text-amber-400" />
          Notification Preferences
        </h3>
        <div>
          <ToggleRow label="Email notifications" desc="Receive updates about your events via email" defaultValue={true} />
          <ToggleRow label="Event reminders" desc="Get reminded 24 hours before your events" defaultValue={true} />
          <ToggleRow label="New attendee alerts" desc="Notify when someone registers for your event" defaultValue={false} />
          <ToggleRow label="Weekly digest" desc="Receive a weekly summary of your event activity" defaultValue={false} />
          <ToggleRow label="Marketing emails" desc="Product updates, tips and special offers" defaultValue={false} />
        </div>
      </div>

      {/* Privacy */}
      <div className="glass-card p-6 animate-fade-up opacity-0" style={{ animationDelay: "250ms", animationFillMode: "forwards" }}>
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="h-4 w-4 text-violet-400" />
          Privacy
        </h3>
        <div>
          <ToggleRow label="Public profile" desc="Allow others to find your profile and events" defaultValue={true} />
          <ToggleRow label="Analytics tracking" desc="Help us improve by sharing anonymous usage data" defaultValue={true} />
          <ToggleRow label="Third-party integrations" desc="Allow connected apps to access your event data" defaultValue={false} />
        </div>
      </div>

      {/* AI Settings */}
      <div className="glass-card p-6 animate-fade-up opacity-0" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="h-4 w-4 text-cyan-400" />
          AI & Automation
        </h3>
        <div>
          <ToggleRow label="AI suggestions" desc="Show AI-powered title and description suggestions" defaultValue={true} />
          <ToggleRow label="Smart scheduling" desc="AI recommends best dates based on your history" defaultValue={true} />
          <ToggleRow label="Auto-save drafts" desc="Automatically save event drafts as you type" defaultValue={true} />
          <ToggleRow label="Predictive analytics" desc="Use AI to forecast event attendance (Beta)" defaultValue={false} />
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end animate-fade-up opacity-0" style={{ animationDelay: "350ms", animationFillMode: "forwards" }}>
        <Button onClick={handleSave} icon={<Save className="h-4 w-4" />} size="lg">
          Save Settings
        </Button>
      </div>
    </div>
  );
}
