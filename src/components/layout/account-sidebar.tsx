import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  User,
  Package,
  MapPin,
  Bell,
  Settings,
  Heart,
  Wallet,
  Gift,
  Ticket,
  ShieldCheck,
  History,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/use-language";

type Item = { to: string; label: string; icon: LucideIcon; exact?: boolean };

export function AccountSidebar() {
  const { t, lang } = useLanguage();

  const groups: { title: string; items: Item[] }[] = [
    {
      title: lang === "ar" ? "ظ†ط¸ط±ط© ط¹ط§ظ…ط©" : "Overview",
      items: [
        { to: "/account", label: t("account.overview"), icon: LayoutDashboard, exact: true },
        { to: "/account/orders", label: lang === "ar" ? "ط§ظ„ط·ظ„ط¨ط§طھ" : "Orders", icon: Package },
        { to: "/wishlist", label: lang === "ar" ? "ط§ظ„ظ…ظپط¶ظ„ط©" : "Wishlist", icon: Heart },
        {
          to: "/account/recently-viewed",
          label: lang === "ar" ? "ط´ظˆظ‡ط¯ ظ…ط¤ط®ط±ط§ظ‹" : "Recently viewed",
          icon: History,
        },
      ],
    },
    {
      title: lang === "ar" ? "ط§ظ„ظ…ظƒط§ظپط¢طھ ظˆط§ظ„ظ…ط­ظپط¸ط©" : "Rewards & Wallet",
      items: [
        { to: "/account/wallet", label: lang === "ar" ? "ط§ظ„ظ…ط­ظپط¸ط©" : "Wallet", icon: Wallet },
        { to: "/account/rewards", label: lang === "ar" ? "ط§ظ„ظ…ظƒط§ظپط¢طھ" : "Rewards", icon: Gift },
        { to: "/account/coupons", label: lang === "ar" ? "ط§ظ„ظ‚ط³ط§ط¦ظ…" : "Coupons", icon: Ticket },
      ],
    },
    {
      title: lang === "ar" ? "ط§ظ„ط­ط³ط§ط¨" : "Account",
      items: [
        { to: "/account/profile", label: t("account.profile"), icon: User },
        { to: "/account/addresses", label: t("account.addresses"), icon: MapPin },
        { to: "/account/notifications", label: t("account.notifications"), icon: Bell },
        {
          to: "/account/security",
          label: lang === "ar" ? "ط§ظ„ط£ظ…ط§ظ†" : "Security",
          icon: ShieldCheck,
        },
        { to: "/account/settings", label: t("account.settings"), icon: Settings },
      ],
    },
  ];

  return (
    <aside className="lg:w-64 lg:shrink-0">
      <nav className="space-y-5 rounded-2xl border border-hairline bg-card/60 p-3 lg:sticky lg:top-24">
        {groups.map((g) => (
          <div key={g.title}>
            <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              {g.title}
            </p>
            <ul className="space-y-0.5">
              {g.items.map(({ to, label, icon: Icon, exact }) => (
                <li key={to}>
                  <Link
                    to={to}
                    activeOptions={{ exact }}
                    className="group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-brand-soft hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                    activeProps={{ className: "bg-brand-soft text-brand font-semibold" }}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.span
                            layoutId="account-nav-pill"
                            className="absolute inset-0 -z-10 rounded-lg bg-brand-soft"
                            transition={{ type: "spring", stiffness: 380, damping: 32 }}
                          />
                        )}
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{label}</span>
                      </>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}


