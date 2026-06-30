import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/_authenticated/account/addresses")({
  head: () => ({ meta: [{ title: "Addresses — GARHY | HYPER" }] }),
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <PageHeader eyebrow={t("account.title")} title={t("account.addresses")} />
      <EmptyState
        icon={<MapPin className="h-6 w-6" />}
        title={t("common.empty")}
        description={t("common.noDataYet")}
      />
    </div>
  );
}
