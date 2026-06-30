import { createFileRoute } from "@tanstack/react-router";
import { Ticket } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/_authenticated/account/coupons")({
  head: () => ({ meta: [{ title: "Coupons â€” GARHY | HYPER" }] }),
  component: CouponsPage,
});

function CouponsPage() {
  const { lang } = useLanguage();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={lang === "ar" ? "ط§ظ„ط¹ط±ظˆط¶" : "Offers"}
        title={lang === "ar" ? "ط§ظ„ظ‚ط³ط§ط¦ظ…" : "Coupons"}
      />

      <EmptyState
        icon={<Ticket className="h-6 w-6" />}
        title={lang === "ar" ? "ظ„ط§ طھظˆط¬ط¯ ظ‚ط³ط§ط¦ظ… ط¨ط¹ط¯" : "No coupons yet"}
        description={
          lang === "ar"
            ? "ط³طھط¸ظ‡ط± ط§ظ„ظ‚ط³ط§ط¦ظ… ظˆط§ظ„ط¹ط±ظˆط¶ ط§ظ„ط®ط§طµط© ط¨ظƒ ظ‡ظ†ط§ ط¹ظ†ط¯ طھظˆظپط±ظ‡ط§."
            : "Your coupons and special offers will appear here when they become available."
        }
      />
    </div>
  );
}


