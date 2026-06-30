import { Link, useNavigate } from "@tanstack/react-router";
import { motion, useAnimation } from "framer-motion";
import {
  Heart,
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  LayoutGrid,
  Tag,
  Sparkles,
  Bell,
  ChevronDown,
  Globe2,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Logo } from "@/components/common/logo";
import { LanguageToggle } from "@/components/common/language-toggle";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { AnnouncementMarquee } from "@/components/common/announcement-marquee";
import { SearchOverlay } from "@/components/common/search-overlay";
import { MegaMenu } from "@/components/layout/mega-menu";
import { CountrySwitcher } from "@/components/commerce/country-switcher";
import { useCart, useWishlist } from "@/contexts/commerce-context";

export function SiteHeader() {
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const cart = useCart();
  const wish = useWishlist();
  const bumpCtl = useAnimation();

  useEffect(() => {
    if (cart.bumpNonce === 0) return;
    bumpCtl.start({
      scale: [1, 1.25, 0.95, 1.08, 1],
      rotate: [0, -8, 8, -4, 0],
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    });
  }, [cart.bumpNonce, bumpCtl]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) navigate({ to: "/search" });
    else setSearchOpen(true);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b border-hairline glass-header transition-shadow duration-300 ${
          scrolled ? "shadow-soft" : ""
        }`}
        data-scrolled={scrolled}
      >
        <AnnouncementMarquee />

        {/* Main row */}
        <div
          className={`mx-auto flex max-w-7xl items-center gap-3 px-4 sm:px-6 lg:gap-6 lg:px-8 transition-[height] duration-300 ${
            scrolled ? "h-14 lg:h-16" : "h-16 lg:h-20"
          }`}
        >
          <Logo />

          {/* Search (desktop) â€” opens overlay */}
          <form onSubmit={onSearch} className="hidden flex-1 md:flex">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={`group relative flex w-full items-center rounded-full border border-hairline bg-surface text-start text-sm text-muted-foreground transition-all hover:border-brand/40 hover:bg-background ${
                scrolled ? "h-9" : "h-11"
              }`}
              aria-label={t("nav.search")}
            >
              <Search className="pointer-events-none absolute start-4 h-4 w-4" />
              <span className="ps-11 pe-4 truncate">{t("header.searchPlaceholder")}</span>
              <span className="absolute end-1.5 inline-flex h-7 items-center rounded-full bg-foreground px-3 text-[11px] font-semibold text-background">
                {t("nav.search")}
              </span>
            </button>
          </form>

          <div className="ms-auto flex items-center gap-0.5 sm:gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label={t("nav.search")}
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
            </Button>
            <div className="hidden sm:block">
              <CountrySwitcher compact />
            </div>
            <Link to="/wishlist" className="hidden sm:inline-flex">
              <Button
                variant="ghost"
                size="icon"
                aria-label={t("nav.wishlist")}
                className="relative"
              >
                <Heart className="h-4 w-4" />
                {wish.count > 0 && (
                  <span className="absolute -end-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[9px] font-bold text-destructive-foreground">
                    {wish.count}
                  </span>
                )}
              </Button>
            </Link>
            <Link to="/account/notifications" className="hidden sm:inline-flex">
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="h-4 w-4" />
              </Button>
            </Link>
            <motion.button
              id="cart-target"
              type="button"
              onClick={() => cart.setOpen(true)}
              aria-label={t("nav.cart")}
              animate={bumpCtl}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <ShoppingBag className="h-4 w-4" />
              {cart.count > 0 && (
                <motion.span
                  key={cart.count}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 22 }}
                  className="absolute -end-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-conversion px-1 text-[9px] font-bold text-conversion-foreground"
                >
                  {cart.count}
                </motion.span>
              )}
            </motion.button>
            <Link to="/account" className="hidden sm:inline-flex">
              <Button variant="ghost" size="icon" aria-label={t("nav.account")}>
                <User className="h-4 w-4" />
              </Button>
            </Link>
            <LanguageToggle />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Secondary nav (desktop) â€” host for mega menu */}
        <div className="relative hidden border-t border-hairline md:block">
          <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 sm:px-6 lg:px-8">
            <Link
              to="/"
              activeOptions={{ exact: true }}
              className="inline-flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {t("nav.home")}
            </Link>
            <button
              type="button"
              onMouseEnter={() => setMegaOpen(true)}
              onFocus={() => setMegaOpen(true)}
              onClick={() => setMegaOpen((v) => !v)}
              aria-expanded={megaOpen}
              aria-haspopup="menu"
              className="inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              <LayoutGrid className="h-4 w-4" />
              {t("nav.categories")}
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${megaOpen ? "rotate-180" : ""}`}
              />
            </button>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-semibold text-conversion transition-colors"
            >
              <Tag className="h-4 w-4" />
              {t("nav.offers")}
            </Link>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              <Sparkles className="h-4 w-4" />
              {t("nav.brands")}
            </Link>
            <span className="ms-auto inline-flex items-center text-xs text-muted-foreground">
              <span className="me-2 inline-flex items-center gap-1.5">
                <Globe2 className="h-3.5 w-3.5" aria-hidden />
                {lang === "ar" ? "ظ†ط´ط­ظ† ط¥ظ„ظ‰ 15 ط¯ظˆظ„ط©" : "Shipping to 15 countries"}
              </span>
              آ· {t("header.deliverTo")}
            </span>
          </div>

          <MegaMenu open={megaOpen} onClose={() => setMegaOpen(false)} />
        </div>

        {open && (
          <div className="border-t border-hairline bg-background md:hidden">
            <nav className="flex flex-col px-4 py-2">
              {[
                { to: "/", label: t("nav.home"), exact: true },
                { to: "/catalog", label: t("nav.categories") },
                { to: "/catalog", label: t("nav.offers") },
                { to: "/catalog", label: t("nav.brands") },
                { to: "/wishlist", label: t("nav.wishlist") },
                { to: "/account", label: t("nav.account") },
                {
                  to: "/account/notifications",
                  label: lang === "ar" ? "ط§ظ„ط¥ط´ط¹ط§ط±ط§طھ" : "Notifications",
                },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  activeOptions={{ exact: item.exact }}
                  onClick={() => setOpen(false)}
                  className="py-3 text-sm font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

