import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  Gamepad2,
  Shirt,
  Home,
  Car,
  Sparkles,
  Watch,
  Laptop,
  Plane,
  Heart,
  Headphones,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { getNavCategories, type CatalogCategory } from "@/lib/api/catalog.functions";

/** Maps a category slug to an icon. Unknown slugs fall back to a grid icon. */
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  electronics: Laptop,
  smartphones: Smartphone,
  gaming: Gamepad2,
  fashion: Shirt,
  beauty: Sparkles,
  home: Home,
  "home-living": Home,
  sports: Heart,
  travel: Plane,
  automotive: Car,
  accessories: Watch,
  audio: Headphones,
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function MegaMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang, dir } = useLanguage();
  // `null` = not yet loaded, `[]` = loaded but empty.
  const [categories, setCategories] = useState<CatalogCategory[] | null>(null);

  useEffect(() => {
    if (!open || categories !== null) return;
    let active = true;
    getNavCategories()
      .then((rows) => active && setCategories(rows))
      .catch(() => active && setCategories([]));
    return () => {
      active = false;
    };
  }, [open, categories]);

  const loading = categories === null;
  const isEmpty = categories !== null && categories.length === 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 top-0 z-30 bg-foreground/20 backdrop-blur-[2px]"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="absolute inset-x-0 top-full z-40 glass-strong"
            dir={dir}
            onMouseLeave={onClose}
            role="menu"
            aria-label="Categories"
          >
            <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_280px] lg:px-8">
              {loading ? (
                <ul className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <li key={i} className="rounded-xl p-3">
                      <div className="flex items-start gap-3">
                        <span className="shimmer h-10 w-10 shrink-0 rounded-lg" />
                        <div className="min-w-0 flex-1 space-y-2 py-1">
                          <div className="shimmer h-3 w-2/3 rounded" />
                          <div className="shimmer h-2.5 w-1/2 rounded" />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : isEmpty ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-hairline bg-surface/40 px-6 py-12 text-center">
                  <span className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-brand-soft text-brand">
                    <LayoutGrid className="h-5 w-5" />
                  </span>
                  <p className="font-display text-sm font-bold">
                    {lang === "ar" ? "ظ„ط§ طھظˆط¬ط¯ ط£ظ‚ط³ط§ظ… ط¨ط¹ط¯" : "No categories yet"}
                  </p>
                  <p className="mt-1 max-w-xs text-[12px] text-muted-foreground">
                    {lang === "ar"
                      ? "ط³طھط¸ظ‡ط± ط§ظ„ط£ظ‚ط³ط§ظ… ظ‡ظ†ط§ ط¨ظ…ط¬ط±ط¯ ط¥ط¶ط§ظپطھظ‡ط§."
                      : "Categories will appear here once they are added."}
                  </p>
                </div>
              ) : (
                <motion.ul
                  initial="hidden"
                  animate="show"
                  variants={{ hidden: {}, show: { transition: { staggerChildren: 0.025 } } }}
                  className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4"
                >
                  {categories!.map((cat) => {
                    const Icon = CATEGORY_ICONS[cat.slug] ?? LayoutGrid;
                    const name = lang === "ar" ? cat.name_ar : cat.name_en;
                    return (
                      <motion.li
                        key={cat.id}
                        variants={{
                          hidden: { opacity: 0, y: 8 },
                          show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE } },
                        }}
                      >
                        <Link
                          to="/catalog/$category"
                          params={{ category: cat.slug }}
                          onClick={onClose}
                          className="group block rounded-xl p-3 transition-colors hover:bg-brand-soft"
                        >
                          <div className="flex items-start gap-3">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
                              <Icon className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                              <p className="font-display text-sm font-bold">{name}</p>
                              <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                                {lang === "ar" ? "طھط³ظˆظ‚ ط§ظ„ط¢ظ†" : "Shop now"}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              )}

              <motion.aside
                initial={{ opacity: 0, x: dir === "rtl" ? -12 : 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, ease: EASE, delay: 0.1 }}
                className="relative hidden overflow-hidden rounded-2xl gradient-brand p-6 text-white lg:block"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.25),transparent_60%)]" />
                <div className="relative">
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-80">
                    GARHY | HYPER
                  </p>
                  <h3 className="mt-2 font-display text-xl font-extrabold leading-tight">
                    {lang === "ar" ? "ظƒظ„ ظ…ط§ طھط­طھط§ط¬ظ‡ ظپظٹ ظ…ظƒط§ظ† ظˆط§ط­ط¯" : "Everything in one place"}
                  </h3>
                  <p className="mt-2 text-sm opacity-90">
                    {lang === "ar"
                      ? "طھطµظپظ‘ط­ ط§ظ„ظƒطھط§ظ„ظˆط¬ ط§ظ„ظƒط§ظ…ظ„ ظˆط§ظƒطھط´ظپ ظ…ظ†طھط¬ط§طھظ†ط§."
                      : "Browse the full catalog and discover our products."}
                  </p>
                  <Link
                    to="/catalog"
                    onClick={onClose}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-brand"
                  >
                    {lang === "ar" ? "طھطµظپظ‘ط­ ط§ظ„ظƒطھط§ظ„ظˆط¬" : "Browse catalog"}
                  </Link>
                </div>
              </motion.aside>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

