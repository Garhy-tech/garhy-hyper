import { createFileRoute } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/_authenticated/account/wallet")({
  head: () => ({ meta: [{ title: "Wallet â€” GARHY | HYPER" }] }),
  component: WalletPage,
});

function WalletPage() {
  const { lang } = useLanguage();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={lang === "ar" ? "ط§ظ„ظ…ط§ظ„ظٹط©" : "Finance"}
        title={lang === "ar" ? "ط§ظ„ظ…ط­ظپط¸ط©" : "Wallet"}
      />

      <EmptyState
        icon={<Wallet className="h-6 w-6" />}
        title={lang === "ar" ? "ط§ظ„ظ…ط­ظپط¸ط© ظ‚ط±ظٹط¨ط§ظ‹" : "Wallet coming soon"}
        description={
          lang === "ar"
            ? "ط³طھطھظ…ظƒظ† ظ‚ط±ظٹط¨ط§ظ‹ ظ…ظ† ط¥ط¯ط§ط±ط© ط±طµظٹط¯ظƒ ظˆظ…ط¯ظپظˆط¹ط§طھظƒ ظ…ظ† ظ‡ظ†ط§."
            : "You'll soon be able to manage your balance and payments from here."
        }
      />
    </div>
  );
}


