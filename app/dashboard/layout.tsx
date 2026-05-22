import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardTopNav } from "@/components/layout/DashboardTopNav";
import { ToastProvider } from "@/components/ui/Toast";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const userData = {
    email: user.email || "",
    full_name: user.user_metadata?.full_name || "",
  };

  return (
    <ToastProvider>
      <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
        <DashboardSidebar user={userData} />
        <DashboardTopNav user={userData} />
        <main className="lg:ml-64 min-h-screen">
          <div className="px-6 py-8 max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
