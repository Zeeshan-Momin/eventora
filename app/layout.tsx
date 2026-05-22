import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eventora — AI-Powered Event Management",
  description: "Create, manage, and grow your events with the power of AI. Eventora is the modern platform for event organizers.",
  keywords: ["event management", "AI events", "event platform", "session management"],
  openGraph: {
    title: "Eventora — AI-Powered Event Management",
    description: "Create, manage, and grow your events with the power of AI.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
