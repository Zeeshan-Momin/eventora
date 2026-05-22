"use client";

import { useState } from "react";
import { Sparkles, RefreshCw, ChevronDown, ChevronUp, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { aiService } from "@/services/ai.service";
import { EventCategory } from "@/types";
import { cn } from "@/lib/utils";

interface AISuggestionPanelProps {
  category: EventCategory;
  onSelectTitle: (title: string) => void;
  onSelectDescription: (desc: string) => void;
  topic?: string;
}

export function AISuggestionPanel({ category, onSelectTitle, onSelectDescription, topic }: AISuggestionPanelProps) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<{ titles: string[]; descriptions: string[]; tags: string[] } | null>(null);
  const [expanded, setExpanded] = useState(true);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const data = await aiService.getSuggestions(category, topic);
      setSuggestions(data);
      setExpanded(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{ background: "rgba(98, 114, 245, 0.06)", borderColor: "rgba(98, 114, 245, 0.2)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "rgba(98, 114, 245, 0.15)" }}>
        <div className="flex items-center gap-2.5">
          <div
            className="h-7 w-7 flex items-center justify-center rounded-lg"
            style={{ background: "rgba(98, 114, 245, 0.2)" }}
          >
            <Sparkles className="h-3.5 w-3.5 text-brand-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">AI Suggestions</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Powered by Eventora AI</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            loading={loading}
            icon={!loading ? <RefreshCw className="h-3.5 w-3.5" /> : undefined}
            onClick={fetchSuggestions}
            className="text-brand-400 hover:bg-brand-500/10"
          >
            {suggestions ? "Refresh" : "Generate"}
          </Button>
          {suggestions && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              style={{ color: "var(--text-secondary)" }}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Initial state */}
      {!suggestions && !loading && (
        <div className="px-5 py-8 text-center">
          <div className="h-12 w-12 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: "rgba(98, 114, 245, 0.1)" }}>
            <Wand2 className="h-6 w-6 text-brand-400" />
          </div>
          <p className="text-sm font-medium text-white mb-1">Generate AI Suggestions</p>
          <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
            Let our AI create compelling titles and descriptions for your event
          </p>
          <Button size="sm" onClick={fetchSuggestions} loading={loading}>
            Generate Suggestions
          </Button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="px-5 py-6 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 rounded-lg bg-white/5 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
          ))}
        </div>
      )}

      {/* Suggestions */}
      {suggestions && expanded && (
        <div className="px-5 py-4 space-y-5">
          {/* Titles */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2.5" style={{ color: "var(--text-muted)" }}>
              Suggested Titles
            </p>
            <div className="space-y-2">
              {suggestions.titles.map((title, i) => (
                <button
                  key={i}
                  onClick={() => onSelectTitle(title)}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-white transition-all duration-150 hover:scale-[1.01] active:scale-[0.99]"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border-subtle)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(98, 114, 245, 0.12)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(98, 114, 245, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border-subtle)";
                  }}
                >
                  <span className="mr-2 text-brand-400 font-mono text-xs">{String(i + 1).padStart(2, "0")}.</span>
                  {title}
                </button>
              ))}
            </div>
          </div>

          {/* Descriptions */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2.5" style={{ color: "var(--text-muted)" }}>
              Suggested Descriptions
            </p>
            <div className="space-y-2">
              {suggestions.descriptions.map((desc, i) => (
                <button
                  key={i}
                  onClick={() => onSelectDescription(desc)}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs leading-relaxed transition-all duration-150"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-secondary)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(98, 114, 245, 0.08)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(98, 114, 245, 0.25)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border-subtle)";
                  }}
                >
                  {desc}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2.5" style={{ color: "var(--text-muted)" }}>
              Suggested Tags
            </p>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full cursor-pointer transition-all hover:scale-105"
                  style={{
                    background: "rgba(98, 114, 245, 0.1)",
                    border: "1px solid rgba(98, 114, 245, 0.2)",
                    color: "var(--brand-primary)",
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
