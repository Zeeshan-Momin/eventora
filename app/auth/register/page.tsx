"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, CheckCircle } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { authService } from "@/services/auth.service";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabels = ["", "Weak", "Good", "Strong"];
  const strengthColors = ["", "bg-rose-500", "bg-amber-500", "bg-emerald-500"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    const { error } = await authService.signUp(email, password, fullName);
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
        <div className="glass-card p-10 max-w-sm w-full text-center">
          <div className="h-16 w-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-emerald-500/20 border border-emerald-500/30">
            <CheckCircle className="h-8 w-8 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Clash Display', sans-serif" }}>Account created!</h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Redirecting you to your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg-primary)" }}>
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-12"
        style={{ background: "rgba(98,114,245,0.06)", borderRight: "1px solid var(--border-subtle)" }}>
        <div className="orb h-96 w-96 top-[-50px] left-[-50px] opacity-25" style={{ background: "radial-gradient(circle, #6272f5, transparent 70%)" }} />
        <div className="orb h-64 w-64 bottom-20 right-[-30px] opacity-15" style={{ background: "radial-gradient(circle, #a855f7, transparent 70%)" }} />
        <div className="relative max-w-sm w-full">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Clash Display', sans-serif" }}>
              Start creating events that matter
            </h2>
            <p style={{ color: "var(--text-secondary)" }}>Join 2,400+ event organizers building remarkable experiences with Eventora.</p>
          </div>

          {/* Mini dashboard preview */}
          <div className="glass-card p-5 border-gradient">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                  <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Your Dashboard</p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>Ready in seconds</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[["4", "Events"], ["120", "Attendees"], ["2", "Upcoming"], ["98%", "Satisfaction"]].map(([val, lbl]) => (
                <div key={lbl} className="p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-subtle)" }}>
                  <p className="text-lg font-bold text-white" style={{ fontFamily: "'Clash Display', sans-serif" }}>{val}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{lbl}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {["Tech Meetup 2025", "Design Workshop", "AI Summit"].map((ev, i) => (
                <div key={ev} className="flex items-center gap-2.5 px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className={`h-2 w-2 rounded-full ${["bg-brand-400", "bg-emerald-400", "bg-amber-400"][i]}`} />
                  <span className="text-xs text-white flex-1">{ev}</span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>Published</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Logo className="mb-8" />
            <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Clash Display', sans-serif" }}>Create your free account</h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Already have an account?{" "}
              <Link href="/auth/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">Sign in</Link>
            </p>
          </div>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm text-rose-400 border border-rose-500/20 bg-rose-500/10">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full name"
              type="text"
              placeholder="Jane Smith"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              icon={<User className="h-4 w-4" />}
              required
              autoComplete="name"
            />
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-4 w-4" />}
              required
              autoComplete="email"
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Password</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-10"
                  required
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-80 transition-opacity">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3].map((lvl) => (
                      <div key={lvl} className={`h-1 flex-1 rounded-full transition-colors ${passwordStrength >= lvl ? strengthColors[passwordStrength] : "bg-white/10"}`} />
                    ))}
                  </div>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{strengthLabels[passwordStrength]}</span>
                </div>
              )}
            </div>

            <Button type="submit" loading={loading} className="w-full mt-2" size="lg" iconRight={<ArrowRight className="h-4 w-4" />}>
              Create account
            </Button>
          </form>

          <p className="text-xs text-center mt-6" style={{ color: "var(--text-muted)" }}>
            By creating an account, you agree to our{" "}
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            {" "}and{" "}
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
