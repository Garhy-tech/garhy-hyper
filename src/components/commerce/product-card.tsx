"use client";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  Eye,
  Heart,
  ShoppingBag,
  Star,
  Truck,
  Zap,
  Flame,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useRef, useState, type MouseEvent } from "react";
import { useCart, useCountry, useWishlist, type Product } from "@/contexts/commerce-context";
import { QuickViewModal } from "@/components/commerce/quick-view-modal";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";

const BADGE_META = {
  "best-seller": {
    Icon: Flame,
    en: "Best seller",
    ar: "ط§ظ„ط£ظƒط«ط± ظ…ط¨ظٹط¹ط§ظ‹",
    tone: "bg-conversion text-conversion-foreground",
  },
  trending: {
    Icon: TrendingUp,
    en: "Trending",
    ar: "ط±ط§ط¦ط¬",
    tone: "bg-brand text-brand-foreground",
  },
  new: { Icon: Sparkles, en: "New", ar: "ط¬ط¯ظٹط¯", tone: "bg-foreground text-background" },
  limited: {
    Icon: Zap,
    en: "Limited",
    ar: "ظ…ط­ط¯ظˆط¯",
    tone: "bg-destructive text-destructive-foreground",
  },
} as const;

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const { lang } = useLanguage();
  const { add, setOpen } = useCart();
  const { format } = useCountry();
  const wish = useWishlist();
  const [quickOpen, setQuickOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  const discount =
    product.compareAt && product.compareAt > product.price
      ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
      : 0;

  const onAdd = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = btnRef.current?.getBoundingClientRect() ?? null;
    add(product, 1, undefined, rect ?? undefined);
    setOpen(true);
  };

  const onWish = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    wish.toggle(product);
  };

  const onQuick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickOpen(true);
  };

  const isWished = wish.has(product.id);
  const Badge = product.badge ? BADGE_META[product.badge] : null;

  return (
    <>
      <motion.div
        whileHover={{ y: -6 }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        className="group relative h-full"
      >
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="block h-full overflow-hidden rounded-2xl border border-hairline bg-card transition-shadow duration-300 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          {/* IMAGE */}
          <div className="relative aspect-square overflow-hidden bg-surface">
            <motion.img
              src={product.image}
              alt={product.imageAlt || product.title}
              loading={priority ? "eager" : "lazy"}
              className="absolute inset-0 h-full w-full object-cover"
              initial={false}
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Top labels */}
            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
              <div className="flex flex-col gap-1.5">
                {discount > 0 && (
                  <span className="inline-flex items-center rounded-full bg-conversion px-2.5 py-1 text-[11px] font-extrabold text-conversion-foreground shadow-sm">
                    -{discount}%
                  </span>
                )}
                {Badge && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm",
                      Badge.tone,
                    )}
                  >
                    <Badge.Icon className="h-3 w-3" />
                    {lang === "ar" ? Badge.ar : Badge.en}
                  </span>
                )}
              </div>

              <motion.button
                type="button"
                onClick={onWish}
                whileTap={{ scale: 0.8 }}
                aria-label="Wishlist"
                className={cn(
                  "pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/95 backdrop-blur transition-colors",
                  isWished ? "text-destructive" : "text-foreground/70 hover:text-destructive",
                )}
              >
                <motion.span
                  key={isWished ? "on" : "off"}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 18 }}
                >
                  <Heart className="h-4 w-4" fill={isWished ? "currentColor" : "none"} />
                </motion.span>
              </motion.button>
            </div>

            {/* Hover actions */}
            <div className="absolute inset-x-0 bottom-0 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <div className="flex gap-1.5 p-3">
                <button
                  type="button"
                  onClick={onQuick}
                  className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-background/95 text-xs font-semibold text-foreground shadow-soft backdrop-blur transition-colors hover:bg-background"
                >
                  <Eye className="h-3.5 w-3.5" />
                  {lang === "ar" ? "ظ†ط¸ط±ط© ط³ط±ظٹط¹ط©" : "Quick view"}
                </button>
                <button
                  ref={btnRef}
                  type="button"
                  onClick={onAdd}
                  className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-foreground text-xs font-semibold text-background shadow-soft transition-transform hover:scale-[1.02]"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  {lang === "ar" ? "ط£ط¶ظپ" : "Add"}
                </button>
              </div>
            </div>
          </div>

          {/* META */}
          <div className="space-y-2 p-3 sm:p-4">
            {product.brand && (
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                {product.brand}
              </p>
            )}
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{product.title}</h3>

            {(product.rating ?? 0) > 0 && (
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Star className="h-3 w-3 fill-conversion text-conversion" />
                <span className="font-semibold text-foreground">{product.rating?.toFixed(1)}</span>
                {product.reviews ? <span>({product.reviews.toLocaleString()})</span> : null}
              </div>
            )}

            <div className="flex items-baseline gap-2 pt-1">
              <span className="font-display text-base font-extrabold">{format(product.price)}</span>
              {product.compareAt && product.compareAt > product.price && (
                <span className="text-[11px] text-muted-foreground line-through">
                  {format(product.compareAt)}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {product.freeShipping && (
                <span className="inline-flex items-center gap-1 rounded-md bg-brand-soft px-1.5 py-0.5 text-[10px] font-semibold text-brand">
                  <Truck className="h-3 w-3" />
                  {lang === "ar" ? "ط´ط­ظ† ظ…ط¬ط§ظ†ظٹ" : "Free shipping"}
                </span>
              )}
              {product.fastDelivery && (
                <span className="inline-flex items-center gap-1 rounded-md bg-conversion/10 px-1.5 py-0.5 text-[10px] font-semibold text-conversion">
                  <Zap className="h-3 w-3" />
                  {lang === "ar" ? "طھظˆطµظٹظ„ ط³ط±ظٹط¹" : "Fast delivery"}
                </span>
              )}
            </div>
          </div>
        </Link>
      </motion.div>

      <AnimatePresence>
        {quickOpen && <QuickViewModal product={product} onClose={() => setQuickOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

