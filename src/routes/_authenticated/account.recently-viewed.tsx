import { createFileRoute, Link } from "@tanstack/react-router";
import { History } from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/common/page-header";
import { FadeIn } from "@/components/motion";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/_authenticated/account/recently-viewed")({
  head: () => ({ meta: [{ title: "Recently viewed â€” GARHY | HYPER" }] }),
  component: RecentlyViewedPage,
});

function RecentlyViewedPage() {
  const { lang } = useLanguage();
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={lang === "ar" ? "ط§ظ„ط³ط¬ظ„" : "History"}
        title={lang === "ar" ? "ط´ظˆظ‡ط¯ ظ…ط¤ط®ط±ط§ظ‹" : "Recently viewed"}
      />
      <FadeIn>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-hairline bg-surface/40 px-6 py-16 text-center">
          <motion.div
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="grid h-14 w-14 place-items-center rounded-full bg-brand-soft text-brand"
          >
            <History className="h-6 w-6" />
          </motion.div>
          <h2 className="mt-4 font-display text-lg font-bold">
            {lang === "ar" ? "ظ„ط§ طھظˆط¬ط¯ ظ…ظ†طھط¬ط§طھ ط¨ط¹ط¯" : "Nothing here yet"}
          </h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {lang === "ar"
              ? "ط§ظ„ظ…ظ†طھط¬ط§طھ ط§ظ„طھظٹ طھط¹ط±ط¶ظ‡ط§ ط³طھط¸ظ‡ط± ظ‡ظ†ط§ ظ„ظ„ظˆطµظˆظ„ ط§ظ„ط³ط±ظٹط¹."
              : "Products you browse will appear here for quick access."}
          </p>
          <Link
            to="/catalog"
            className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-bold text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {lang === "ar" ? "ط§ط¨ط¯ط£ ط§ظ„طھطµظپط­" : "Start browsing"}
          </Link>
        </div>
      </FadeIn>
    </div>
  );
}

