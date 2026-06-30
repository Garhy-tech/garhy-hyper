import { Link } from "@tanstack/react-router";
import { Home, LayoutGrid, Tag, User, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export function MobileBottomNav() {
  const { t } = useLanguage();
  const items = [
    { to: "/" as const, label: t("nav.home"), icon: Home, exact: true },
    { to: "/catalog" as const, label: t("nav.categories"), icon: LayoutGrid },
    { to: "/catalog" as const, label: t("nav.offers"), icon: Tag, highlight: true },
    { to: "/account" as const, label: t("nav.account"), icon: User },
    { to: "/cart" as const, label: t("nav.cart"), icon: ShoppingBag },
  ];

  return (
    <nav
      aria-label="Primary mobile"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline glass-header pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="mx-auto grid max-w-7xl grid-cols-5">
        {items.map(({ to, label, icon: Icon, exact, highlight }) => (
          <li key={label}>
            <Link
              to={to}
              activeOptions={{ exact }}
              className="flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-semibold text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-brand" }}
            >
              <span
                className={`grid h-9 w-9 place-items-center rounded-xl transition-colors ${
                  highlight ? "bg-conversion/10 text-conversion" : ""
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}


