import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/catalog/$category")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.category} â€” GARHY | HYPER` },
      { name: "description", content: `Shop ${params.category} at GARHY | HYPER.` },
    ],
  }),
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useParams();
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader eyebrow={t("catalog.category")} title={category} />
      <EmptyState title={t("catalog.noProducts")} description={t("common.noDataYet")} />
    </div>
  );
}

