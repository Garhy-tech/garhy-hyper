"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, ShoppingBag, Star, Truck, X, Zap } from "lucide-react";
import { useEffect, useRef } from "react";
import { useCart, useCountry, useWishlist, type Product } from "@/contexts/commerce-context";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";

export function QuickViewModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const { lang } = useLanguage();
  const { add, setOpen } = useCart();
  const { format } = useCountry();
  const wish = useWishlist();
  const addRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const discount =
    product.compareAt && product.compareAt > product.price
      ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
      : 0;

  const onAdd = () => {
    const r = addRef.current?.getBoundingClientRect() ?? null;
    add(product, 1, undefined, r ?? undefined);
    onClose();
    setOpen(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] flex items-center justify-center bg-foreground/40 px-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 24, scale: 0.96, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 24, scale: 0.96, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
          className="relative grid w-full max-w-3xl overflow-hidden rounded-2xl glass-strong sm:grid-cols-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute end-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/95 text-foreground shadow-soft transition-transform hover:scale-105"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative aspect-square bg-surface sm:aspect-auto">
            <img
              src={product.image}
              alt={product.imageAlt || product.title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
            {discount > 0 && (
              <span className="absolute start-3 top-3 rounded-full bg-conversion px-2.5 py-1 text-[11px] font-extrabold text-conversion-foreground">
                -{discount}%
              </span>
            )}
          </div>

          <div className="flex flex-col gap-4 p-6">
            {product.brand && (
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                {product.brand}
              </p>
            )}
            <h2 className="font-display text-xl font-extrabold leading-tight">{product.title}</h2>

            {(product.rating ?? 0) > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Star className="h-3.5 w-3.5 fill-conversion text-conversion" />
                <span className="font-semibold text-foreground">{product.rating?.toFixed(1)}</span>
                {product.reviews ? (
                  <span>
                    · {product.reviews.toLocaleString()} {lang === "ar" ? "تقييم" : "reviews"}
                  </span>
                ) : null}
              </div>
            )}

            <div className="flex items-baseline gap-3">
              <span className="font-display text-2xl font-extrabold">{format(product.price)}</span>
              {product.compareAt && product.compareAt > product.price && (
                <span className="text-sm text-muted-foreground line-through">
                  {format(product.compareAt)}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {product.freeShipping && (
                <span className="inline-flex items-center gap-1 rounded-md bg-brand-soft px-2 py-1 text-[11px] font-semibold text-brand">
                  <Truck className="h-3 w-3" />
                  {lang === "ar" ? "شحن مجاني" : "Free shipping"}
                </span>
              )}
              {product.fastDelivery && (
                <span className="inline-flex items-center gap-1 rounded-md bg-conversion/10 px-2 py-1 text-[11px] font-semibold text-conversion">
                  <Zap className="h-3 w-3" />
                  {lang === "ar" ? "توصيل سريع" : "Fast delivery"}
                </span>
              )}
            </div>

            <div className="mt-auto flex gap-2 pt-4">
              <button
                ref={addRef}
                type="button"
                onClick={onAdd}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-foreground text-sm font-semibold text-background transition-transform hover:scale-[1.02]"
              >
                <ShoppingBag className="h-4 w-4" />
                {lang === "ar" ? "أضف إلى السلة" : "Add to cart"}
              </button>
              <button
                type="button"
                onClick={() => wish.toggle(product)}
                aria-label="Wishlist"
                className={cn(
                  "inline-flex h-11 w-11 items-center justify-center rounded-full border border-hairline transition-colors",
                  wish.has(product.id)
                    ? "border-destructive/40 text-destructive"
                    : "text-foreground hover:border-foreground/30",
                )}
              >
                <Heart className="h-4 w-4" fill={wish.has(product.id) ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
