import { createFileRoute } from "@tanstack/react-router";
import { Wallet } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/_authenticated/account/wallet")({
  head: () => ({ meta: [{ title: "Wallet — GARHY | HYPER" }] }),
  component: WalletPage,
});

function WalletPage() {
  const { lang } = useLanguage();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={lang === "ar" ? "المالية" : "Finance"}
        title={lang === "ar" ? "المحفظة" : "Wallet"}
      />

      <EmptyState
        icon={<Wallet className="h-6 w-6" />}
        title={lang === "ar" ? "المحفظة قريباً" : "Wallet coming soon"}
        description={
          lang === "ar"
            ? "ستتمكن قريباً من إدارة رصيدك ومدفوعاتك من هنا."
            : "You'll soon be able to manage your balance and payments from here."
        }
      />
    </div>
  );
}
