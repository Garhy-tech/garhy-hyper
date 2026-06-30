import { createFileRoute } from "@tanstack/react-router";
import { Send, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Stagger, StaggerItem } from "@/components/motion";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/_authenticated/admin/integrations")({
  head: () => ({ meta: [{ title: "Integrations â€” GARHY | HYPER" }] }),
  component: IntegrationsPage,
});

function IntegrationsPage() {
  const { t } = useLanguage();
  const items = [
    {
      icon: Send,
      title: t("admin.telegram"),
      desc: "Webhook-ready endpoint for Telegram Bot API.",
    },
    {
      icon: Sparkles,
      title: t("admin.aiAssistant"),
      desc: "Pluggable AI assistant for product Q&A and support.",
    },
  ];
  return (
    <div>
      <PageHeader eyebrow={t("admin.title")} title={t("admin.integrations")} />
      <Stagger className="grid gap-4 sm:grid-cols-2">
        {items.map(({ icon: Icon, title, desc }) => (
          <StaggerItem key={title}>
            <div className="flex h-full flex-col rounded-2xl border border-hairline bg-card p-6 shadow-soft transition-shadow hover:shadow-elevated">
              <div className="flex items-start justify-between gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-gold">
                  <Icon className="h-5 w-5" />
                </div>
                <Badge variant="outline">{t("common.notConfigured")}</Badge>
              </div>
              <h2 className="mt-4 font-display text-lg font-semibold">{title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              <Button variant="outline" size="sm" className="mt-4 self-start">
                {t("common.configure")}
              </Button>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}


