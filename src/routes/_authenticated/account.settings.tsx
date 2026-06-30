import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/common/page-header";
import { FadeIn } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/_authenticated/account/settings")({
  head: () => ({ meta: [{ title: "Settings — GARHY | HYPER" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  };

  return (
    <div>
      <PageHeader eyebrow={t("account.title")} title={t("account.settings")} />
      <FadeIn>
        <div className="max-w-2xl rounded-2xl border border-hairline bg-surface-elevated p-6 shadow-soft sm:p-8">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
              <LogOut className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h2 className="font-display text-lg font-semibold">{t("nav.signOut")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">End your current session.</p>
            </div>
          </div>
          <Button variant="outline" className="mt-5 gap-2" onClick={signOut}>
            <LogOut className="h-4 w-4" />
            {t("nav.signOut")}
          </Button>
        </div>
      </FadeIn>
    </div>
  );
}
