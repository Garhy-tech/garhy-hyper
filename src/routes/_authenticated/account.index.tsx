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
  head: () => ({ meta: [{ title: "Account — GARHY | HYPER" }] }),
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
                {lang === "ar" ? "لوحة التحكم الخاصة بك" : "Your premium dashboard"}
              </h1>
              <p className="mt-2 max-w-md text-sm opacity-90">
                {lang === "ar"
                  ? "تابع طلباتك، مكافآتك، ومحفظتك في مكان واحد."
                  : "Track orders, rewards and wallet — all in one elegant place."}
              </p>
            </div>
            <div className="rounded-2xl bg-background/15 p-4 backdrop-blur sm:min-w-[220px]">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] opacity-90">
                <Sparkles className="h-3.5 w-3.5" />
                {lang === "ar" ? "المكافآت" : "Rewards"}
              </div>
              <p className="mt-2 font-display text-2xl font-extrabold">
                {lang === "ar" ? "قريباً" : "Coming soon"}
              </p>
              <p className="mt-1.5 text-[11px] opacity-90">
                {lang === "ar"
                  ? "برنامج المكافآت قيد الإعداد."
                  : "Our rewards program is on the way."}
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* STATS */}
      <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile
          label={lang === "ar" ? "الطلبات" : "Orders"}
          value={0}
          icon={Package}
          accent="brand"
        />
        <StatTile
          label={lang === "ar" ? "في المفضلة" : "Wishlist"}
          value={wish.count}
          icon={Heart}
          accent="conversion"
        />
        <StatTile
          label={lang === "ar" ? "العربة" : "Cart"}
          value={cart.count}
          icon={ArrowUpRight}
          accent="cyan"
        />
        <StatTile
          label={lang === "ar" ? "المحفظة" : "Wallet"}
          valueText={format(0)}
          icon={Wallet}
          accent="gold"
        />
      </Stagger>

      {/* QUICK ACTIONS */}
      <section>
        <SectionTitle
          eyebrow={lang === "ar" ? "اختصارات" : "Quick actions"}
          title={lang === "ar" ? "كل ما تحتاجه" : "Everything in one tap"}
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
                  {lang === "ar" ? "نشاط حسابك" : "Activity"}
                </p>
                <h3 className="mt-1 font-display text-lg font-bold">
                  {lang === "ar" ? "الطلبات الأخيرة" : "Recent orders"}
                </h3>
              </div>
              <Link
                to="/account/orders"
                className="rounded text-xs font-semibold text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                {lang === "ar" ? "عرض الكل" : "View all"}
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
                {lang === "ar" ? "لا توجد طلبات بعد" : "No orders yet"}
              </p>
              <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                {lang === "ar"
                  ? "ابدأ التسوق لرؤية طلباتك هنا."
                  : "Start shopping to see your orders here."}
              </p>
              <Link
                to="/catalog"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-bold text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {lang === "ar" ? "ابدأ التسوق" : "Start shopping"}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="flex h-full flex-col rounded-2xl border border-hairline bg-card p-5 sm:p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              {lang === "ar" ? "موصى لك" : "Recommended"}
            </p>
            <h3 className="mt-1 font-display text-lg font-bold">
              {lang === "ar" ? "أكمل ملفك الشخصي" : "Complete your profile"}
            </h3>
            <div className="mt-4 space-y-3">
              {[
                { en: "Add a shipping address", ar: "أضف عنوان الشحن", to: "/account/addresses" },
                { en: "Verify phone number", ar: "تحقق من رقم الهاتف", to: "/account/security" },
                {
                  en: "Set notification preferences",
                  ar: "تفضيلات الإشعارات",
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
      label: L("Orders", "الطلبات"),
      hint: L("Track shipments", "تتبع الشحنات"),
      Icon: Package,
      tone: "bg-brand-soft text-brand",
    },
    {
      to: "/wishlist",
      label: L("Wishlist", "المفضلة"),
      hint: L("Saved items", "العناصر المحفوظة"),
      Icon: Heart,
      tone: "bg-conversion/15 text-conversion",
    },
    {
      to: "/account/wallet",
      label: L("Wallet", "المحفظة"),
      hint: L("Balance & top-ups", "الرصيد والشحن"),
      Icon: Wallet,
      tone: "bg-amber-400/15 text-amber-600 dark:text-amber-400",
    },
    {
      to: "/account/rewards",
      label: L("Rewards", "المكافآت"),
      hint: L("Tiers & perks", "المستويات والمميزات"),
      Icon: Gift,
      tone: "bg-fuchsia-400/15 text-fuchsia-600 dark:text-fuchsia-400",
    },
    {
      to: "/account/coupons",
      label: L("Coupons", "القسائم"),
      hint: L("Active discounts", "الخصومات الفعّالة"),
      Icon: Ticket,
      tone: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400",
    },
    {
      to: "/account/addresses",
      label: L("Addresses", "العناوين"),
      hint: L("Shipping book", "دفتر العناوين"),
      Icon: MapPin,
      tone: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    },
    {
      to: "/account/notifications",
      label: L("Notifications", "الإشعارات"),
      hint: L("What to alert you", "ماذا ننبهك عنه"),
      Icon: Bell,
      tone: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400",
    },
    {
      to: "/account/security",
      label: L("Security", "الأمان"),
      hint: L("Passwords & 2FA", "كلمات المرور والتحقق"),
      Icon: ShieldCheck,
      tone: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
    },
  ] as const;
}
