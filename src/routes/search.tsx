import { createFileRoute } from "@tanstack/react-router";
import { Search as SearchIcon } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "Search â€” GARHY | HYPER" }] }),
  component: SearchPage,
});

function SearchPage() {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
          <PageHeader eyebrow="GARHY" title={t("nav.search")} />
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="h-12 ps-10" placeholder={t("common.search")} />
          </div>
          <div className="mt-10">
            <EmptyState title={t("common.empty")} description={t("common.noDataYet")} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}


