import { createFileRoute, Link } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/_authenticated/account/orders")({
  head: () => ({ meta: [{ title: "Orders â€” GARHY | HYPER" }] }),
  component: OrdersPage,
});

function OrdersPage() {
  const { t, lang } = useLanguage();
  return (
    <div className="space-y-6">
      <PageHeader eyebrow={t("account.title")} title={t("account.orders")} />
      <EmptyState
        icon={<Package className="h-6 w-6" />}
        title={t("common.empty")}
        description={t("common.noDataYet")}
        action={
          <Button asChild>
            <Link to="/catalog">{lang === "ar" ? "ط§ط¨ط¯ط£ ط§ظ„طھط³ظˆظ‚" : "Start shopping"}</Link>
          </Button>
        }
      />
    </div>
  );
}


