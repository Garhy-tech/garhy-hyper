import { createFileRoute } from "@tanstack/react-router";
import { Gift } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/_authenticated/account/rewards")({
  head: () => ({ meta: [{ title: "Rewards â€” GARHY | HYPER" }] }),
  component: RewardsPage,
});

function RewardsPage() {
  const { lang } = useLanguage();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={lang === "ar" ? "ظˆظ„ط§ط،" : "Loyalty"}
        title={lang === "ar" ? "ط§ظ„ظ…ظƒط§ظپط¢طھ" : "Rewards"}
      />

      <EmptyState
        icon={<Gift className="h-6 w-6" />}
        title={lang === "ar" ? "ط¨ط±ظ†ط§ظ…ط¬ ط§ظ„ظ…ظƒط§ظپط¢طھ ظ‚ط±ظٹط¨ط§ظ‹" : "Rewards coming soon"}
        description={
          lang === "ar"
            ? "ظ†ط¹ظ…ظ„ ط¹ظ„ظ‰ ط¨ط±ظ†ط§ظ…ط¬ ظ…ظƒط§ظپط¢طھ ظٹظƒط§ظپط¦ظƒ ط¹ظ„ظ‰ ظ…ط´طھط±ظٹط§طھظƒ. طھط±ظ‚ظ‘ط¨ ط§ظ„ط¥ط·ظ„ط§ظ‚ ظ‚ط±ظٹط¨ط§ظ‹."
            : "We're building a rewards program that gives back on your purchases. Stay tuned."
        }
      />
    </div>
  );
}

