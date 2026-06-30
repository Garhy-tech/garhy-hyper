import { createFileRoute } from "@tanstack/react-router";
import { Gift } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/_authenticated/account/rewards")({
  head: () => ({ meta: [{ title: "Rewards — GARHY | HYPER" }] }),
  component: RewardsPage,
});

function RewardsPage() {
  const { lang } = useLanguage();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={lang === "ar" ? "ولاء" : "Loyalty"}
        title={lang === "ar" ? "المكافآت" : "Rewards"}
      />

      <EmptyState
        icon={<Gift className="h-6 w-6" />}
        title={lang === "ar" ? "برنامج المكافآت قريباً" : "Rewards coming soon"}
        description={
          lang === "ar"
            ? "نعمل على برنامج مكافآت يكافئك على مشترياتك. ترقّب الإطلاق قريباً."
            : "We're building a rewards program that gives back on your purchases. Stay tuned."
        }
      />
    </div>
  );
}
