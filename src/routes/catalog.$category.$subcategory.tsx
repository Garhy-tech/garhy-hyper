import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/catalog/$category/$subcategory")({
  head: ({ params }) => ({
    meta: [{ title: `${params.subcategory} â€” GARHY | HYPER` }],
  }),
  component: SubcategoryPage,
});

function SubcategoryPage() {
  const { category, subcategory } = Route.useParams();
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <PageHeader eyebrow={category} title={subcategory} />
      <EmptyState title={t("catalog.noProducts")} description={t("common.noDataYet")} />
    </div>
  );
}

