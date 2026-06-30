import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/common/logo";
import { LanguageToggle } from "@/components/common/language-toggle";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { supabase } from "@/integrations/supabase/client";
import { verifyAdmin } from "@/lib/api/auth.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async () => {
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData.user) throw redirect({ to: "/auth" });
    const { data, error } = await supabase.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (error || !data) throw redirect({ to: "/" });
    // Defense-in-depth: re-validate admin authorization at the server boundary
    // so the section cannot be entered on the client-only check alone.
    try {
      await verifyAdmin();
    } catch {
      throw redirect({ to: "/" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-hairline bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Logo />
          <span className="ms-3 hidden text-xs font-medium uppercase tracking-[0.2em] text-gold sm:inline">
            {t("admin.title")}
          </span>
          <div className="ms-auto flex items-center gap-1">
            <Link to="/">
              <Button variant="ghost" size="sm">
                {t("nav.home")}
              </Button>
            </Link>
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            <AdminSidebar />
            <div className="min-w-0 flex-1">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


