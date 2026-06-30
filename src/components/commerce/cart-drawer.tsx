"use client";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShieldCheck, ShoppingBag, Tag, Trash2, Truck, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useCart, useCountry } from "@/contexts/commerce-context";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";

const FREE_SHIPPING_THRESHOLD = 150; // USD

export function CartDrawer() {
  const { lines, subtotal, setQty, remove, open, setOpen, count } = useCart();
  const { format, country } = useCountry();
  const { lang, dir } = useLanguage();
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState<{ code: string; pct: number } | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const progress = useMemo(
    () => Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100),
    [subtotal],
  );
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const free = remaining === 0 && subtotal > 0;
  const discount = applied ? subtotal * (applied.pct / 100) : 0;
  const total = Math.max(0, subtotal - discount);

  const applyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    if (!code) return;
    setApplied({ code, pct: 0 });
  };

  const side = dir === "rtl" ? "left-0" : "right-0";
  const slideFrom = dir === "rtl" ? -100 : 100;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[80] bg-foreground/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.aside
            key="panel"
            initial={{ x: `${slideFrom}%` }}
            animate={{ x: 0 }}
            exit={{ x: `${slideFrom}%` }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            className={cn(
              "fixed top-0 z-[81] flex h-full w-full max-w-md flex-col glass-strong",
              side,
            )}
            aria-label={lang === "ar" ? "السلة" : "Cart"}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                <h2 className="font-display text-base font-extrabold">
                  {lang === "ar" ? "السلة" : "Your cart"}
                </h2>
                <span className="rounded-full bg-foreground px-2 py-0.5 text-[11px] font-bold text-background">
                  {count}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-surface"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Shipping progress */}
            <div className="border-b border-hairline px-5 py-3">
              <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Truck className="h-3 w-3" />
                  {free
                    ? lang === "ar"
                      ? "شحن مجاني مفعّل"
                      : "Free shipping unlocked"
                    : lang === "ar"
                      ? `اضف ${format(remaining)} للشحن المجاني`
                      : `Add ${format(remaining)} for free shipping`}
                </span>
                <span className="font-bold text-foreground">{Math.round(progress)}%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface">
                <motion.div
                  className={cn("h-full rounded-full", free ? "bg-conversion" : "gradient-brand")}
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "spring", stiffness: 220, damping: 28 }}
                />
              </div>
            </div>

            {/* Lines */}
            <div className="flex-1 overflow-y-auto">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-12 text-center">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-surface text-muted-foreground">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-base font-bold">
                    {lang === "ar" ? "سلتك فارغة" : "Your cart is empty"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {lang === "ar"
                      ? "اكتشف منتجاتنا وأضف ما يعجبك."
                      : "Discover products you love and add them here."}
                  </p>
                  <Link
                    to="/catalog"
                    onClick={() => setOpen(false)}
                    className="mt-2 inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold text-background"
                  >
                    {lang === "ar" ? "تسوّق الآن" : "Start shopping"}
                  </Link>
                </div>
              ) : (
                <ul className="divide-y divide-hairline px-5">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => (
                      <motion.li
                        key={l.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: dir === "rtl" ? -40 : 40 }}
                        transition={{ duration: 0.25 }}
                        className="flex gap-3 py-4"
                      >
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface">
                          <img
                            src={l.product.image}
                            alt={l.product.title}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <p className="line-clamp-2 text-sm font-semibold leading-snug">
                              {l.product.title}
                            </p>
                            <button
                              type="button"
                              onClick={() => remove(l.id)}
                              className="text-muted-foreground transition-colors hover:text-destructive"
                              aria-label="Remove"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          {l.product.brand && (
                            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                              {l.product.brand}
                            </p>
                          )}
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="inline-flex items-center rounded-full border border-hairline">
                              <button
                                type="button"
                                onClick={() => setQty(l.id, l.qty - 1)}
                                aria-label="Decrease"
                                className="inline-flex h-7 w-7 items-center justify-center text-foreground hover:bg-surface"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <motion.span
                                key={l.qty}
                                initial={{ scale: 0.7, opacity: 0.5 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 500, damping: 22 }}
                                className="w-7 text-center text-xs font-bold"
                              >
                                {l.qty}
                              </motion.span>
                              <button
                                type="button"
                                onClick={() => setQty(l.id, l.qty + 1)}
                                aria-label="Increase"
                                className="inline-flex h-7 w-7 items-center justify-center text-foreground hover:bg-surface"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <motion.span
                              key={l.qty + ":" + l.product.price}
                              initial={{ y: -4, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              className="font-display text-sm font-extrabold"
                            >
                              {format(l.product.price * l.qty)}
                            </motion.span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            {lines.length > 0 && (
              <div className="space-y-3 border-t border-hairline bg-surface/40 px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Tag className="pointer-events-none absolute start-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder={lang === "ar" ? "كود الخصم" : "Coupon code"}
                      className="h-10 w-full rounded-full border border-hairline bg-background ps-9 pe-3 text-sm outline-none transition-colors focus:border-brand"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={applyCoupon}
                    className="h-10 rounded-full bg-foreground px-4 text-xs font-bold text-background"
                  >
                    {lang === "ar" ? "تطبيق" : "Apply"}
                  </button>
                </div>
                {applied && (
                  <p
                    className={cn(
                      "text-[11px] font-semibold",
                      applied.pct > 0 ? "text-conversion" : "text-destructive",
                    )}
                  >
                    {applied.pct > 0
                      ? lang === "ar"
                        ? `تم تطبيق ${applied.code} (-${applied.pct}%)`
                        : `${applied.code} applied (-${applied.pct}%)`
                      : lang === "ar"
                        ? "كود غير صالح"
                        : "Invalid code"}
                  </p>
                )}

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>{lang === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
                    <motion.span
                      key={subtotal}
                      initial={{ y: -3, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="font-semibold text-foreground"
                    >
                      {format(subtotal)}
                    </motion.span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-conversion">
                      <span>{lang === "ar" ? "الخصم" : "Discount"}</span>
                      <span>-{format(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-muted-foreground">
                    <span>{lang === "ar" ? "الشحن" : "Shipping"}</span>
                    <span>
                      {free
                        ? lang === "ar"
                          ? "مجاني"
                          : "Free"
                        : lang === "ar"
                          ? "يُحسب عند الدفع"
                          : "At checkout"}
                    </span>
                  </div>
                  <div className="mt-1 flex items-baseline justify-between border-t border-hairline pt-2">
                    <span className="font-display text-sm font-bold">
                      {lang === "ar" ? "الإجمالي" : "Total"}
                    </span>
                    <motion.span
                      key={total}
                      initial={{ y: -3, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="font-display text-lg font-extrabold"
                    >
                      {format(total)}
                    </motion.span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-foreground font-semibold text-background transition-transform hover:scale-[1.01]"
                >
                  {lang === "ar" ? "إتمام الشراء" : "Checkout"}
                </Link>

                <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                  <ShieldCheck className="h-3 w-3" />
                  {lang === "ar"
                    ? `دفع آمن • شحن إلى ${country.nameAr}`
                    : `Secure checkout • Shipping to ${country.name}`}
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
