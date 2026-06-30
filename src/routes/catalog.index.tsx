import { createFileRoute } from "@tanstack/react-router";
import { PackageOpen, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/catalog/")({
  head: () => ({
    meta: [
      { title: "Shop â€” GARHY | HYPER" },
      { name: "description", content: "Browse our curated luxury catalog." },
    ],
  }),
  component: CatalogIndex,
});

function CatalogIndex() {
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader eyebrow="GARHY Catalog" title={t("catalog.title")} />
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border border-hairline bg-card p-5 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-gold" />
            <h2 className="font-display text-lg font-semibold">{t("catalog.filters")}</h2>
          </div>
          <div className="space-y-5 text-sm">
            <FilterGroup label={t("catalog.category")} />
            <FilterGroup label={t("catalog.brand")} />
            <FilterGroup label={t("catalog.price")} />
            <FilterGroup label={t("catalog.availability")} />
          </div>
          <Button variant="outline" size="sm" className="mt-6 w-full" disabled>
            {t("common.applyFilters")}
          </Button>
        </aside>
        <div>
          <EmptyState
            icon={<PackageOpen className="h-6 w-6" />}
            title={t("catalog.noProducts")}
            description={t("common.noDataYet")}
          />
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label }: { label: string }) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <div className="h-9 rounded-md border border-dashed border-hairline" />
    </div>
  );
}

