import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Shield, BarChart3, Users, Calendar, Globe, Brain, CheckCircle, Star } from "lucide-react";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";

const features = [
  { icon: Sparkles, title: "AI-Powered Creation", desc: "Generate compelling event titles, descriptions, and smart recommendations with our integrated AI engine.", color: "from-brand-500 to-brand-700" },
  { icon: Calendar, title: "Smart Scheduling", desc: "Intelligent conflict detection, timezone handling, and calendar sync keep your events perfectly organized.", color: "from-violet-500 to-purple-700" },
  { icon: Users, title: "Attendee Management", desc: "Track registrations, send automated reminders, and manage capacity with ease.", color: "from-emerald-500 to-teal-700" },
  { icon: BarChart3, title: "Real-time Analytics", desc: "Deep insights into event performance, attendee engagement, and revenue metrics.", color: "from-cyan-500 to-blue-700" },
  { icon: Shield, title: "Enterprise Security", desc: "Bank-grade encryption, GDPR compliance, and role-based access control built in.", color: "from-orange-500 to-amber-700" },
  { icon: Globe, title: "Hybrid Events", desc: "Seamlessly manage both in-person and online events from a single, unified platform.", color: "from-rose-500 to-pink-700" },
];

const aiCapabilities = [
  "Generate event titles in seconds",
  "Auto-write compelling descriptions",
  "Smart attendee recommendations",
  "Predictive attendance forecasting",
  "Automated follow-up emails",
  "Sentiment analysis from feedback",
];

const stats = [
  { value: "50K+", label: "Events Created" },
  { value: "2.4M", label: "Attendees Managed" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "140+", label: "Countries" },
];

const testimonials = [
  { name: "Sarah Chen", role: "Head of Events, TechCorp", quote: "Eventora transformed how we run our conferences. The AI suggestions alone saved us 10+ hours per event.", rating: 5 },
  { name: "Marcus Rivera", role: "Community Manager", quote: "The most intuitive event platform I've used. Setup took minutes and the results were incredible.", rating: 5 },
  { name: "Priya Nair", role: "Startup Founder", quote: "From a scrappy meetup to 5,000 attendees — Eventora scaled with us every step of the way.", rating: 5 },
];

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "var(--bg-primary)" }}>
      <PublicNavbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-6 overflow-hidden">
        {/* Background orbs */}
        <div className="orb h-[600px] w-[600px] top-[-100px] left-[-200px] opacity-20" style={{ background: "radial-gradient(circle, #6272f5 0%, transparent 70%)" }} />
        <div className="orb h-[400px] w-[400px] top-[200px] right-[-100px] opacity-15" style={{ background: "radial-gradient(circle, #a855f7 0%, transparent 70%)" }} />
        <div className="orb h-[300px] w-[300px] bottom-[100px] left-[20%] opacity-10" style={{ background: "radial-gradient(circle, #22d3ee 0%, transparent 70%)" }} />

        <div className="relative max-w-5xl mx-auto text-center z-10">
          {/* Announcement badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border animate-fade-in"
            style={{ background: "rgba(98, 114, 245, 0.1)", borderColor: "rgba(98, 114, 245, 0.25)" }}>
            <Sparkles className="h-3.5 w-3.5 text-brand-400" />
            <span className="text-sm font-medium text-brand-300">Introducing AI-powered event creation</span>
            <ArrowRight className="h-3.5 w-3.5 text-brand-400" />
          </div>

          <h1
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.05] animate-fade-up opacity-0"
            style={{ fontFamily: "'Clash Display', sans-serif", animationDelay: "100ms", animationFillMode: "forwards" }}
          >
            Events that{" "}
            <span className="text-gradient">inspire</span>
            <br />
            managed by{" "}
            <span className="text-gradient-cyan">AI</span>
          </h1>

          <p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up opacity-0"
            style={{ color: "var(--text-secondary)", animationDelay: "200ms", animationFillMode: "forwards" }}
          >
            Eventora is the AI-powered platform that helps you create, manage, and grow extraordinary events. From intimate workshops to global conferences — all from one place.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up opacity-0"
            style={{ animationDelay: "300ms", animationFillMode: "forwards" }}
          >
            <Link href="/auth/register">
              <Button size="lg" iconRight={<ArrowRight className="h-4 w-4" />}>
                Start for free
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="secondary" size="lg">
                See how it works
              </Button>
            </Link>
          </div>

          {/* Social proof */}
          <div
            className="flex items-center justify-center gap-6 mt-12 animate-fade-up opacity-0"
            style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
          >
            <div className="flex -space-x-2">
              {["A", "B", "C", "D", "E"].map((l, i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white"
                  style={{
                    borderColor: "var(--bg-primary)",
                    background: ["#6272f5", "#a855f7", "#22d3ee", "#10b981", "#f59e0b"][i],
                  }}
                >
                  {l}
                </div>
              ))}
            </div>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              <span className="text-white font-semibold">2,400+</span> event organizers already using Eventora
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p
                className="text-4xl font-bold mb-1"
                style={{ fontFamily: "'Clash Display', sans-serif", background: "var(--gradient-brand)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
              >
                {value}
              </p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-4 block">Features</span>
            <h2
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              Everything you need to run{" "}
              <span className="text-gradient">great events</span>
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              A complete toolkit for modern event organizers, built with AI at its core.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc, color }, i) => (
              <div
                key={title}
                className="glass-card p-6 hover:scale-[1.02] transition-all duration-300 animate-fade-up opacity-0"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: "forwards" }}
              >
                <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section id="ai" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 border text-sm"
                style={{ background: "rgba(98, 114, 245, 0.1)", borderColor: "rgba(98, 114, 245, 0.25)", color: "var(--brand-primary)" }}>
                <Brain className="h-3.5 w-3.5" />
                <span>AI-Powered Intelligence</span>
              </div>
              <h2
                className="text-4xl md:text-5xl font-bold text-white mb-6"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                Your AI event{" "}
                <span className="text-gradient">co-pilot</span>
              </h2>
              <p className="text-lg mb-8 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                From the moment you start creating an event, Eventora's AI assists you with intelligent suggestions, automated copy, and data-driven recommendations — so you can focus on what matters.
              </p>
              <ul className="space-y-3 mb-8">
                {aiCapabilities.map((cap) => (
                  <li key={cap} className="flex items-center gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    {cap}
                  </li>
                ))}
              </ul>
              <Link href="/auth/register">
                <Button iconRight={<ArrowRight className="h-4 w-4" />}>
                  Try AI Features Free
                </Button>
              </Link>
            </div>

            {/* AI demo card */}
            <div className="relative">
              <div className="orb h-[300px] w-[300px] top-0 right-0 opacity-20" style={{ background: "radial-gradient(circle, #6272f5 0%, transparent 70%)" }} />
              <div className="glass-card p-6 border-gradient relative">
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">AI Title Suggestions</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>For: Tech Conference</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" />
                    <span className="text-xs text-brand-400">Generating...</span>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {[
                    "Future of Tech Summit 2025",
                    "Global Innovation Conference — AI Era",
                    "Digital Transformation Forum 2025",
                    "Enterprise AI & Beyond Summit",
                  ].map((title, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-white cursor-pointer transition-all hover:scale-[1.01]"
                      style={{ background: "rgba(255,255,255,0.04)", borderColor: "var(--border-subtle)" }}
                    >
                      <span className="text-xs font-mono text-brand-400">{String(i + 1).padStart(2, "0")}.</span>
                      {title}
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-5 border-t flex gap-2" style={{ borderColor: "var(--border-subtle)" }}>
                  <div className="flex-1 px-3 py-2 rounded-lg text-xs" style={{ background: "rgba(98, 114, 245, 0.08)", border: "1px solid rgba(98, 114, 245, 0.15)", color: "var(--brand-primary)" }}>
                    <Zap className="h-3 w-3 inline mr-1" />
                    Powered by Eventora AI
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 border-t" style={{ borderColor: "var(--border-subtle)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-4 block">Testimonials</span>
            <h2 className="text-4xl font-bold text-white" style={{ fontFamily: "'Clash Display', sans-serif" }}>
              Loved by event organizers
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map(({ name, role, quote, rating }, i) => (
              <div key={name} className="glass-card p-6">
                <div className="flex gap-1 mb-4">
                  {Array(rating).fill(0).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-secondary)" }}>"{quote}"</p>
                <div className="flex items-center gap-3">
                  <div
                    className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: ["linear-gradient(135deg,#6272f5,#a855f7)", "linear-gradient(135deg,#22d3ee,#6272f5)", "linear-gradient(135deg,#10b981,#22d3ee)"][i] }}
                  >
                    {name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{name}</p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="glass-card p-12 border-gradient relative overflow-hidden"
          >
            <div className="orb h-64 w-64 -top-16 -right-16 opacity-30" style={{ background: "radial-gradient(circle, #6272f5 0%, transparent 70%)" }} />
            <div className="orb h-48 w-48 -bottom-8 -left-8 opacity-20" style={{ background: "radial-gradient(circle, #a855f7 0%, transparent 70%)" }} />
            <div className="relative">
              <Sparkles className="h-8 w-8 text-brand-400 mx-auto mb-4" />
              <h2
                className="text-4xl md:text-5xl font-bold text-white mb-4"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                Ready to create your <span className="text-gradient">first event?</span>
              </h2>
              <p className="text-lg mb-8" style={{ color: "var(--text-secondary)" }}>
                Join thousands of organizers who trust Eventora to power their events.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/auth/register">
                  <Button size="lg" iconRight={<ArrowRight className="h-4 w-4" />}>
                    Get started for free
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="secondary" size="lg">
                    Sign in
                  </Button>
                </Link>
              </div>
              <p className="text-xs mt-4" style={{ color: "var(--text-muted)" }}>No credit card required · Free plan available</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
