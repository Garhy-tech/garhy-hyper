import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Star,
  Zap,
  BarChart3,
  Bell,
  Plug,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/use-language";

export function AdminSidebar() {
  const { t } = useLanguage();
  const items = [
    { to: "/admin" as const, label: t("admin.dashboard"), icon: LayoutDashboard, exact: true },
    { to: "/admin/products" as const, label: t("admin.inventory"), icon: Package },
    { to: "/admin/orders" as const, label: t("admin.orders"), icon: ShoppingCart },
    { to: "/admin/customers" as const, label: t("admin.customers"), icon: Users },
    { to: "/admin/categories" as const, label: t("admin.categories"), icon: Tag },
    { to: "/admin/brands" as const, label: t("admin.brands"), icon: Star },
    { to: "/admin/flash-deals" as const, label: t("admin.flashDeals"), icon: Zap },
    { to: "/admin/analytics" as const, label: t("admin.analytics"), icon: BarChart3 },
    { to: "/admin/notifications" as const, label: t("admin.notifications"), icon: Bell },
    { to: "/admin/integrations" as const, label: t("admin.integrations"), icon: Plug },
    { to: "/admin/settings" as const, label: t("admin.settings"), icon: Settings },
  ];
  return (
    <aside className="lg:w-64">
      <nav className="flex gap-1 overflow-x-auto rounded-xl border border-hairline bg-surface/40 p-2 lg:flex-col lg:overflow-visible">
        {items.map(({ to, label, icon: Icon, exact }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact }}
            className="group relative flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            activeProps={{ className: "text-foreground font-semibold" }}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="admin-nav-pill"
                    className="absolute inset-0 -z-10 rounded-lg bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon className="h-4 w-4 shrink-0 text-gold" />
                <span className="whitespace-nowrap">{label}</span>
              </>
            )}
          </Link>
        ))}
      </nav>
    </aside>
  );
}


