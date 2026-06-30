import { createFileRoute } from "@tanstack/react-router";
import { DollarSign, ShoppingCart, Users, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { EmptyState } from "@/components/common/empty-state";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({ meta: [{ title: "Admin — GARHY | HYPER" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { t } = useLanguage();
  return (
    <div>
      <PageHeader eyebrow={t("admin.title")} title={t("admin.dashboard")} />
      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StaggerItem>
          <StatCard label={t("admin.revenue")} value="—" icon={DollarSign} />
        </StaggerItem>
        <StaggerItem>
          <StatCard label={t("admin.pendingOrders")} value="—" icon={ShoppingCart} />
        </StaggerItem>
        <StaggerItem>
          <StatCard label={t("admin.totalCustomers")} value="—" icon={Users} />
        </StaggerItem>
        <StaggerItem>
          <StatCard label={t("admin.lowStock")} value="—" icon={AlertTriangle} />
        </StaggerItem>
      </Stagger>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <FadeIn className="h-full">
          <section className="h-full rounded-2xl border border-hairline bg-card p-6 shadow-soft">
            <h2 className="mb-4 font-display text-lg font-semibold">{t("admin.analytics")}</h2>
            <div className="grid h-56 place-items-center rounded-xl border border-dashed border-hairline px-6 text-center text-sm text-muted-foreground">
              {t("common.noDataYet")}
            </div>
          </section>
        </FadeIn>
        <FadeIn delay={0.08} className="h-full">
          <section className="h-full rounded-2xl border border-hairline bg-card p-6 shadow-soft">
            <h2 className="mb-4 font-display text-lg font-semibold">{t("admin.orders")}</h2>
            <EmptyState title={t("common.empty")} description={t("common.noDataYet")} />
          </section>
        </FadeIn>
      </div>
    </div>
  );
}
