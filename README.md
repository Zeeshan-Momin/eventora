# 🎯 Eventora — AI-Powered Event Management SaaS

A production-ready, full-stack event management platform built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

---

## ✨ Features

### Core
- **Landing Page** — Hero, features, AI showcase, testimonials, CTA
- **Authentication** — Email/password sign-up & sign-in via Supabase Auth
- **Protected Dashboard** — Middleware-enforced route protection
- **Event Management** — Full CRUD (create, read, update, delete)
- **Event Cards** — Responsive grid with status, category, tags, progress bars
- **AI Suggestions** — AI-generated titles, descriptions & tags per category

### AI Capabilities
- Category-aware title generation
- Smart description writing
- Tag recommendations
- Personalized dashboard insights
- Future-ready AI architecture (plug in OpenAI/Anthropic easily)

### UI/UX
- Deep-space dark theme with gradient accents
- Glassmorphism cards with hover effects
- Custom fonts: Clash Display + Cabinet Grotesk
- CSS animations (fade-up, float, shimmer)
- Fully responsive (mobile sidebar + desktop layout)
- Toast notification system

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone <your-repo>
cd eventora
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste `supabase-schema.sql` → **Run**
3. Go to **Settings → API** → copy URL and anon key

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Fill in your Supabase URL and anon key in `.env.local`.

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Folder Structure

```
eventora/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Design tokens & animations
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx              # Protected layout + sidebar
│   │   ├── page.tsx                # Dashboard home
│   │   ├── events/
│   │   │   ├── page.tsx            # Events list
│   │   │   ├── create/page.tsx     # Create event
│   │   │   └── edit/page.tsx       # Edit event
│   │   └── profile/page.tsx        # User profile
│   └── api/
│       └── auth/callback/route.ts
├── components/
│   ├── ui/
│   │   ├── Logo.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx               # Input, Textarea, Select
│   │   ├── Card.tsx                # Card, StatCard
│   │   ├── Badge.tsx               # Badge, StatusBadge, CategoryBadge
│   │   └── Toast.tsx               # Toast notification system
│   ├── layout/
│   │   ├── PublicNavbar.tsx
│   │   ├── DashboardSidebar.tsx
│   │   ├── DashboardTopNav.tsx
│   │   └── Footer.tsx
│   └── events/
│       ├── EventCard.tsx
│       └── AISuggestionPanel.tsx
├── services/
│   ├── auth.service.ts
│   ├── events.service.ts
│   └── ai.service.ts
├── lib/
│   ├── supabase.ts                 # Browser client
│   ├── supabase-server.ts          # Server client
│   └── utils.ts
├── types/
│   └── index.ts
├── middleware.ts                    # Route protection
└── supabase-schema.sql             # Database schema
```

---

## 🗄️ Database Schema

```sql
events (
  id UUID PRIMARY KEY,
  user_id UUID → auth.users,
  title TEXT,
  description TEXT,
  location TEXT,
  event_date TIMESTAMPTZ,
  category TEXT,         -- conference|workshop|meetup|webinar|...
  status TEXT,           -- draft|published|cancelled|completed
  attendees_count INT,
  max_attendees INT,
  is_online BOOLEAN,
  cover_color TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

Row Level Security (RLS) ensures users only access their own data.

---

## 🤖 Integrating Real AI (OpenAI / Anthropic)

The `ai.service.ts` is designed for easy swap-in:

```typescript
// services/ai.service.ts — replace getSuggestions() with:
const response = await fetch("https://api.anthropic.com/v1/messages", {
  headers: {
    "x-api-key": process.env.ANTHROPIC_API_KEY!,
    "anthropic-version": "2023-06-01",
    "content-type": "application/json",
  },
  method: "POST",
  body: JSON.stringify({
    model: "claude-opus-4-5",
    max_tokens: 500,
    messages: [{
      role: "user",
      content: `Generate 5 creative event titles for a ${category} event about ${topic}. Return as JSON.`
    }]
  }),
});
```

---

## 🔮 Future Scope

| Feature | Status |
|---|---|
| QR Attendance System | Planned |
| Event Analytics Dashboard | Planned |
| AI Attendee Recommendations | Planned |
| Push Notifications | Planned |
| Role-based Access Control | Planned |
| Stripe Payment Integration | Planned |
| Session / Track Management | Planned |
| Certificate Generation (PDF) | Planned |
| Public Event Pages | Planned |
| Calendar Export (.ics) | Planned |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Backend | Supabase (Auth + PostgreSQL) |
| Icons | Lucide React |
| Dates | date-fns |
| Fonts | Clash Display, Cabinet Grotesk |

---

## 📄 License

MIT — built with ❤️ using Eventora
