import { createFileRoute } from "@tanstack/react-router";
import { Settings } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { FadeIn } from "@/components/motion";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  head: () => ({ meta: [{ title: "Admin â€” GARHY | HYPER" }] }),
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useLanguage();
  return (
    <div>
      <PageHeader eyebrow={t("admin.title")} title={t("admin.settings")} />
      <FadeIn>
        <EmptyState
          icon={<Settings className="h-6 w-6" />}
          title={t("common.empty")}
          description={t("common.noDataYet")}
        />
      </FadeIn>
    </div>
  );
}


