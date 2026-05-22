
import { EventCategory } from "@/types";

const AI_SUGGESTIONS: Record<EventCategory, { titles: string[]; descriptions: string[]; tags: string[] }> = {
  conference: {
    titles: [
      "Future of Tech Summit 2025",
      "Global Innovation Conference",
      "Digital Transformation Forum",
      "Enterprise AI Conference",
      "Web3 & Beyond Summit",
    ],
    descriptions: [
      "Join industry leaders and visionaries for a transformative two-day conference exploring the cutting edge of technology. From AI breakthroughs to sustainable tech, gain insights that will shape the future of your organization.",
      "Discover the future of enterprise technology at our premier annual conference. Connect with 500+ professionals, attend expert-led sessions, and explore how emerging technologies are reshaping every industry.",
    ],
    tags: ["technology", "innovation", "networking", "keynote", "enterprise"],
  },
  workshop: {
    titles: [
      "Hands-On AI Development Workshop",
      "Design Thinking Intensive",
      "Full-Stack Mastery Workshop",
      "Leadership Excellence Bootcamp",
      "Creative Problem Solving Lab",
    ],
    descriptions: [
      "An immersive, hands-on workshop designed to level up your skills. Work directly with expert instructors in small groups, tackle real-world challenges, and leave with practical knowledge you can apply immediately.",
      "This intensive workshop combines theory with practice in a focused learning environment. Bring your toughest challenges and walk away with actionable frameworks, new skills, and a network of like-minded professionals.",
    ],
    tags: ["workshop", "skills", "hands-on", "learning", "professional"],
  },
  meetup: {
    titles: [
      "Monthly Tech Founders Meetup",
      "Startup Ecosystem Gathering",
      "Developer Community Meetup",
      "Design & UX Professionals Night",
      "AI Enthusiasts Casual Meetup",
    ],
    descriptions: [
      "A casual, community-driven meetup for professionals who love what they do. Share ideas, make connections, and be part of a growing community of innovators. Light refreshments and great conversations guaranteed.",
      "Join our vibrant community for an evening of networking, knowledge sharing, and collaboration. Whether you're a seasoned professional or just starting out, this meetup is the perfect place to connect.",
    ],
    tags: ["community", "networking", "casual", "local", "professionals"],
  },
  webinar: {
    titles: [
      "Mastering Remote Team Management",
      "AI Tools for Modern Marketers",
      "The Future of Work: 2025 Edition",
      "Building Scalable Products Live",
      "Data-Driven Decision Making",
    ],
    descriptions: [
      "Join us online for an insightful webinar featuring industry experts sharing actionable strategies and real-world case studies. Interactive Q&A sessions ensure you get answers to your most pressing questions.",
      "A live, interactive webinar that brings together top practitioners to share their expertise. Join from anywhere in the world and gain insights that will transform how you approach your work.",
    ],
    tags: ["online", "webinar", "remote", "live", "interactive"],
  },
  concert: {
    titles: [
      "Summer Sounds Live Festival",
      "Indie Night: Local Artists Showcase",
      "Electronic Music Experience",
      "Jazz Under the Stars",
      "Acoustic Sessions: Unplugged",
    ],
    descriptions: [
      "An unforgettable night of live music featuring both established artists and emerging talent. Join hundreds of music lovers for an evening that will move your soul and create lasting memories.",
      "Experience the magic of live music in an intimate setting. Featuring multiple artists across genres, this concert promises an electric atmosphere and performances that will leave you breathless.",
    ],
    tags: ["music", "live", "entertainment", "festival", "arts"],
  },
  sports: {
    titles: [
      "City Championship 5K Run",
      "Corporate Sports Challenge",
      "Youth Basketball Tournament",
      "Fitness & Wellness Festival",
      "Marathon Training Camp",
    ],
    descriptions: [
      "Push your limits and celebrate the spirit of competition at our annual sports event. Whether you're a seasoned athlete or a first-timer, this event offers categories for all skill levels.",
      "A fun-filled day of athletic competition, team building, and community spirit. Gather your team, bring your competitive edge, and enjoy a day that celebrates health, fitness, and camaraderie.",
    ],
    tags: ["sports", "fitness", "competition", "health", "community"],
  },
  networking: {
    titles: [
      "Executive Leadership Dinner",
      "Founders & Investors Connect",
      "Professional Women in Tech Night",
      "Cross-Industry Innovation Exchange",
      "Alumni Career Networking Event",
    ],
    descriptions: [
      "An exclusive networking event designed to foster meaningful professional connections. Meet decision-makers, potential collaborators, and mentors in a structured yet relaxed setting.",
      "Expand your professional network at this curated gathering of industry leaders. With structured networking activities and open conversation time, you'll leave with valuable new connections.",
    ],
    tags: ["networking", "professional", "connections", "business", "growth"],
  },
  other: {
    titles: [
      "Community Impact Day",
      "Annual Gala & Awards Night",
      "Product Launch Event",
      "Team Building Experience",
      "Special Interest Group Gathering",
    ],
    descriptions: [
      "An exceptional event bringing together people with shared interests and goals. Expect engaging activities, meaningful conversations, and experiences that go beyond the ordinary.",
      "Join us for a unique event that combines learning, networking, and celebration. Carefully curated for maximum impact, this event is designed to create real value for every attendee.",
    ],
    tags: ["event", "community", "special", "gathering", "experience"],
  },
};

export const aiService = {
  async getSuggestions(category: EventCategory, topic?: string) {
    // Simulate AI processing delay
    await new Promise((r) => setTimeout(r, 800));
    const base = AI_SUGGESTIONS[category] || AI_SUGGESTIONS.other;

    if (topic) {
      const topicLower = topic.toLowerCase();
      return {
        titles: base.titles.map((t) =>
          t.includes("2025") ? t : `${t} — ${topic.charAt(0).toUpperCase() + topic.slice(1)}`
        ).slice(0, 3),
        descriptions: base.descriptions,
        tags: [...base.tags, ...topicLower.split(" ").slice(0, 2)],
      };
    }

    return base;
  },

  async generateDescription(title: string, category: EventCategory): Promise<string> {
    await new Promise((r) => setTimeout(r, 600));
    const base = AI_SUGGESTIONS[category] || AI_SUGGESTIONS.other;
    const desc = base.descriptions[Math.floor(Math.random() * base.descriptions.length)];
    return `${title} — ${desc}`;
  },

  getAIInsights(stats: { totalEvents: number; upcomingEvents: number; totalAttendees: number }) {
    const insights = [];

    if (stats.upcomingEvents === 0) {
      insights.push({
        icon: "🎯",
        title: "Schedule Your Next Event",
        text: "You have no upcoming events. Create one to keep your audience engaged.",
        action: "Create Event",
        href: "/dashboard/events/create",
        color: "from-blue-500/20 to-indigo-500/20",
      });
    } else {
      insights.push({
        icon: "🚀",
        title: "Momentum Building",
        text: `You have ${stats.upcomingEvents} upcoming event${stats.upcomingEvents > 1 ? "s" : ""}. Great job staying active!`,
        action: "View Events",
        href: "/dashboard/events",
        color: "from-emerald-500/20 to-teal-500/20",
      });
    }

    if (stats.totalAttendees > 50) {
      insights.push({
        icon: "🌟",
        title: "Growing Community",
        text: `${stats.totalAttendees} total attendees across your events. Consider launching a loyalty program.`,
        action: "Learn More",
        href: "#",
        color: "from-violet-500/20 to-purple-500/20",
      });
    }

    insights.push({
      icon: "🤖",
      title: "AI Title Generator Ready",
      text: "Use our AI to generate compelling event titles and descriptions in seconds.",
      action: "Try AI Features",
      href: "/dashboard/events/create",
      color: "from-cyan-500/20 to-blue-500/20",
    });

    return insights;
  },
};
