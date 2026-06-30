import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Package,
  Heart,
  Wallet,
  Gift,
  Ticket,
  MapPin,
  Bell,
  ShieldCheck,
  History,
  ArrowUpRight,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedCounter, FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { useCart, useCountry, useWishlist } from "@/contexts/commerce-context";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/_authenticated/account/")({
  head: () => ({ meta: [{ title: "Account â€” GARHY | HYPER" }] }),
  component: AccountOverview,
});

function AccountOverview() {
  const { lang, t } = useLanguage();
  const wish = useWishlist();
  const cart = useCart();
  const { format } = useCountry();

  return (
    <div className="space-y-8">
      {/* HERO */}
      <FadeIn>
        <div className="relative overflow-hidden rounded-3xl border border-hairline bg-gradient-to-br from-brand via-brand to-brand-glow p-6 text-brand-foreground shadow-elevated sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.22),transparent_55%)]" />
          <div className="relative grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] opacity-80">
                {t("account.welcome")}
              </p>
              <h1 className="mt-2 font-display text-2xl font-extrabold leading-tight sm:text-3xl">
                {lang === "ar" ? "ظ„ظˆط­ط© ط§ظ„طھط­ظƒظ… ط§ظ„ط®ط§طµط© ط¨ظƒ" : "Your premium dashboard"}
              </h1>
              <p className="mt-2 max-w-md text-sm opacity-90">
                {lang === "ar"
                  ? "طھط§ط¨ط¹ ط·ظ„ط¨ط§طھظƒطŒ ظ…ظƒط§ظپط¢طھظƒطŒ ظˆظ…ط­ظپط¸طھظƒ ظپظٹ ظ…ظƒط§ظ† ظˆط§ط­ط¯."
                  : "Track orders, rewards and wallet â€” all in one elegant place."}
              </p>
            </div>
            <div className="rounded-2xl bg-background/15 p-4 backdrop-blur sm:min-w-[220px]">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] opacity-90">
                <Sparkles className="h-3.5 w-3.5" />
                {lang === "ar" ? "ط§ظ„ظ…ظƒط§ظپط¢طھ" : "Rewards"}
              </div>
              <p className="mt-2 font-display text-2xl font-extrabold">
                {lang === "ar" ? "ظ‚ط±ظٹط¨ط§ظ‹" : "Coming soon"}
              </p>
              <p className="mt-1.5 text-[11px] opacity-90">
                {lang === "ar"
                  ? "ط¨ط±ظ†ط§ظ…ط¬ ط§ظ„ظ…ظƒط§ظپط¢طھ ظ‚ظٹط¯ ط§ظ„ط¥ط¹ط¯ط§ط¯."
                  : "Our rewards program is on the way."}
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* STATS */}
      <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile
          label={lang === "ar" ? "ط§ظ„ط·ظ„ط¨ط§طھ" : "Orders"}
          value={0}
          icon={Package}
          accent="brand"
        />
        <StatTile
          label={lang === "ar" ? "ظپظٹ ط§ظ„ظ…ظپط¶ظ„ط©" : "Wishlist"}
          value={wish.count}
          icon={Heart}
          accent="conversion"
        />
        <StatTile
          label={lang === "ar" ? "ط§ظ„ط¹ط±ط¨ط©" : "Cart"}
          value={cart.count}
          icon={ArrowUpRight}
          accent="cyan"
        />
        <StatTile
          label={lang === "ar" ? "ط§ظ„ظ…ط­ظپط¸ط©" : "Wallet"}
          valueText={format(0)}
          icon={Wallet}
          accent="gold"
        />
      </Stagger>

      {/* QUICK ACTIONS */}
      <section>
        <SectionTitle
          eyebrow={lang === "ar" ? "ط§ط®طھطµط§ط±ط§طھ" : "Quick actions"}
          title={lang === "ar" ? "ظƒظ„ ظ…ط§ طھط­طھط§ط¬ظ‡" : "Everything in one tap"}
        />
        <Stagger className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {QUICK_LINKS(lang === "ar" ? "ar" : "en").map((q) => (
            <StaggerItem key={q.to}>
              <QuickCard {...q} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* INSIGHTS */}
      <section className="grid gap-4 lg:grid-cols-3">
        <FadeIn className="lg:col-span-2">
          <div className="rounded-2xl border border-hairline bg-card p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  {lang === "ar" ? "ظ†ط´ط§ط· ط­ط³ط§ط¨ظƒ" : "Activity"}
                </p>
                <h3 className="mt-1 font-display text-lg font-bold">
                  {lang === "ar" ? "ط§ظ„ط·ظ„ط¨ط§طھ ط§ظ„ط£ط®ظٹط±ط©" : "Recent orders"}
                </h3>
              </div>
              <Link
                to="/account/orders"
                className="rounded text-xs font-semibold text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                {lang === "ar" ? "ط¹ط±ط¶ ط§ظ„ظƒظ„" : "View all"}
              </Link>
            </div>
            <div className="mt-5 grid place-items-center rounded-xl border border-dashed border-hairline bg-surface/40 px-6 py-10 text-center">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="grid h-12 w-12 place-items-center rounded-full bg-brand-soft text-brand"
              >
                <Package className="h-5 w-5" />
              </motion.div>
              <p className="mt-3 text-sm font-semibold">
                {lang === "ar" ? "ظ„ط§ طھظˆط¬ط¯ ط·ظ„ط¨ط§طھ ط¨ط¹ط¯" : "No orders yet"}
              </p>
              <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                {lang === "ar"
                  ? "ط§ط¨ط¯ط£ ط§ظ„طھط³ظˆظ‚ ظ„ط±ط¤ظٹط© ط·ظ„ط¨ط§طھظƒ ظ‡ظ†ط§."
                  : "Start shopping to see your orders here."}
              </p>
              <Link
                to="/catalog"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-bold text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {lang === "ar" ? "ط§ط¨ط¯ط£ ط§ظ„طھط³ظˆظ‚" : "Start shopping"}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="flex h-full flex-col rounded-2xl border border-hairline bg-card p-5 sm:p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              {lang === "ar" ? "ظ…ظˆطµظ‰ ظ„ظƒ" : "Recommended"}
            </p>
            <h3 className="mt-1 font-display text-lg font-bold">
              {lang === "ar" ? "ط£ظƒظ…ظ„ ظ…ظ„ظپظƒ ط§ظ„ط´ط®طµظٹ" : "Complete your profile"}
            </h3>
            <div className="mt-4 space-y-3">
              {[
                { en: "Add a shipping address", ar: "ط£ط¶ظپ ط¹ظ†ظˆط§ظ† ط§ظ„ط´ط­ظ†", to: "/account/addresses" },
                { en: "Verify phone number", ar: "طھط­ظ‚ظ‚ ظ…ظ† ط±ظ‚ظ… ط§ظ„ظ‡ط§طھظپ", to: "/account/security" },
                {
                  en: "Set notification preferences",
                  ar: "طھظپط¶ظٹظ„ط§طھ ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ",
                  to: "/account/notifications",
                },
              ].map((step, i) => (
                <Link
                  key={step.en}
                  to={step.to}
                  className="group flex items-center justify-between rounded-xl border border-hairline px-3 py-2.5 text-sm transition-colors hover:border-brand/40 hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-soft text-[10px] font-bold text-brand">
                      {i + 1}
                    </span>
                    <span className="font-medium">{lang === "ar" ? step.ar : step.en}</span>
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
                </Link>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}

/* ============================================================ */
function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
        {eyebrow}
      </p>
      <h2 className="mt-1 font-display text-xl font-extrabold">{title}</h2>
    </div>
  );
}

function StatTile({
  label,
  value,
  valueText,
  icon: Icon,
  accent,
}: {
  label: string;
  value?: number;
  valueText?: string;
  icon: LucideIcon;
  accent: "brand" | "conversion" | "cyan" | "gold";
}) {
  const tone: Record<typeof accent, string> = {
    brand: "from-brand/12 to-brand/0 text-brand",
    conversion: "from-conversion/15 to-conversion/0 text-conversion",
    cyan: "from-cyan-500/15 to-cyan-500/0 text-cyan-600 dark:text-cyan-400",
    gold: "from-amber-400/20 to-amber-400/0 text-amber-600 dark:text-amber-400",
  };
  return (
    <StaggerItem>
      <div
        className={`relative overflow-hidden rounded-2xl border border-hairline bg-card p-4 sm:p-5`}
      >
        <div
          className={`absolute inset-x-0 -top-10 h-24 bg-gradient-to-b ${tone[accent]}`}
          aria-hidden
        />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              {label}
            </p>
            <p className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">
              {valueText ?? <AnimatedCounter value={value ?? 0} />}
            </p>
          </div>
          <span
            className={`grid h-9 w-9 place-items-center rounded-xl bg-background/80 ${tone[accent].split(" ").pop()}`}
          >
            <Icon className="h-4 w-4" />
          </span>
        </div>
      </div>
    </StaggerItem>
  );
}

function QuickCard({
  to,
  label,
  Icon,
  hint,
  tone,
}: {
  to: string;
  label: string;
  Icon: LucideIcon;
  hint: string;
  tone: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
    >
      <Link
        to={to}
        className="group flex h-full items-center gap-3 rounded-2xl border border-hairline bg-card p-4 transition-shadow hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${tone}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-bold">{label}</p>
          <p className="truncate text-[11px] text-muted-foreground">{hint}</p>
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
      </Link>
    </motion.div>
  );
}

function QUICK_LINKS(lang: "en" | "ar") {
  const L = (en: string, ar: string) => (lang === "ar" ? ar : en);
  return [
    {
      to: "/account/orders",
      label: L("Orders", "ط§ظ„ط·ظ„ط¨ط§طھ"),
      hint: L("Track shipments", "طھطھط¨ط¹ ط§ظ„ط´ط­ظ†ط§طھ"),
      Icon: Package,
      tone: "bg-brand-soft text-brand",
    },
    {
      to: "/wishlist",
      label: L("Wishlist", "ط§ظ„ظ…ظپط¶ظ„ط©"),
      hint: L("Saved items", "ط§ظ„ط¹ظ†ط§طµط± ط§ظ„ظ…ط­ظپظˆط¸ط©"),
      Icon: Heart,
      tone: "bg-conversion/15 text-conversion",
    },
    {
      to: "/account/wallet",
      label: L("Wallet", "ط§ظ„ظ…ط­ظپط¸ط©"),
      hint: L("Balance & top-ups", "ط§ظ„ط±طµظٹط¯ ظˆط§ظ„ط´ط­ظ†"),
      Icon: Wallet,
      tone: "bg-amber-400/15 text-amber-600 dark:text-amber-400",
    },
    {
      to: "/account/rewards",
      label: L("Rewards", "ط§ظ„ظ…ظƒط§ظپط¢طھ"),
      hint: L("Tiers & perks", "ط§ظ„ظ…ط³طھظˆظٹط§طھ ظˆط§ظ„ظ…ظ…ظٹط²ط§طھ"),
      Icon: Gift,
      tone: "bg-fuchsia-400/15 text-fuchsia-600 dark:text-fuchsia-400",
    },
    {
      to: "/account/coupons",
      label: L("Coupons", "ط§ظ„ظ‚ط³ط§ط¦ظ…"),
      hint: L("Active discounts", "ط§ظ„ط®طµظˆظ…ط§طھ ط§ظ„ظپط¹ظ‘ط§ظ„ط©"),
      Icon: Ticket,
      tone: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400",
    },
    {
      to: "/account/addresses",
      label: L("Addresses", "ط§ظ„ط¹ظ†ط§ظˆظٹظ†"),
      hint: L("Shipping book", "ط¯ظپطھط± ط§ظ„ط¹ظ†ط§ظˆظٹظ†"),
      Icon: MapPin,
      tone: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    },
    {
      to: "/account/notifications",
      label: L("Notifications", "ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ"),
      hint: L("What to alert you", "ظ…ط§ط°ط§ ظ†ظ†ط¨ظ‡ظƒ ط¹ظ†ظ‡"),
      Icon: Bell,
      tone: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400",
    },
    {
      to: "/account/security",
      label: L("Security", "ط§ظ„ط£ظ…ط§ظ†"),
      hint: L("Passwords & 2FA", "ظƒظ„ظ…ط§طھ ط§ظ„ظ…ط±ظˆط± ظˆط§ظ„طھط­ظ‚ظ‚"),
      Icon: ShieldCheck,
      tone: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
    },
  ] as const;
}

