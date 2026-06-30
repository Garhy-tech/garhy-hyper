import { createFileRoute } from "@tanstack/react-router";
import { Ticket } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/_authenticated/account/coupons")({
  head: () => ({ meta: [{ title: "Coupons — GARHY | HYPER" }] }),
  component: CouponsPage,
});

function CouponsPage() {
  const { lang } = useLanguage();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={lang === "ar" ? "العروض" : "Offers"}
        title={lang === "ar" ? "القسائم" : "Coupons"}
      />

      <EmptyState
        icon={<Ticket className="h-6 w-6" />}
        title={lang === "ar" ? "لا توجد قسائم بعد" : "No coupons yet"}
        description={
          lang === "ar"
            ? "ستظهر القسائم والعروض الخاصة بك هنا عند توفرها."
            : "Your coupons and special offers will appear here when they become available."
        }
      />
    </div>
  );
}
