import { createFileRoute } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { FadeIn } from "@/components/motion";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  head: () => ({ meta: [{ title: "Admin â€” GARHY | HYPER" }] }),
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useLanguage();
  return (
    <div>
      <PageHeader eyebrow={t("admin.title")} title={t("admin.orders")} />
      <FadeIn>
        <EmptyState
          icon={<ShoppingCart className="h-6 w-6" />}
          title={t("common.empty")}
          description={t("common.noDataYet")}
        />
      </FadeIn>
    </div>
  );
}

