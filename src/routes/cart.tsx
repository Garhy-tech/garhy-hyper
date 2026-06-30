import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShieldCheck, ShoppingBag, Tag, Trash2, Truck } from "lucide-react";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { useCart, useCountry } from "@/contexts/commerce-context";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — GARHY | HYPER" }] }),
  component: CartPage,
});

const FREE_SHIPPING = 150;

function CartPage() {
  const { lang, dir } = useLanguage();
  const { lines, subtotal, setQty, remove, count } = useCart();
  const { format } = useCountry();
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState<{ code: string; pct: number } | null>(null);

  const progress = useMemo(() => Math.min(100, (subtotal / FREE_SHIPPING) * 100), [subtotal]);
  const remaining = Math.max(0, FREE_SHIPPING - subtotal);
  const discount = applied ? subtotal * (applied.pct / 100) : 0;
  const total = Math.max(0, subtotal - discount);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-surface/40">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <PageHeader
            title={lang === "ar" ? "السلة" : "Shopping cart"}
            description={`${count} ${lang === "ar" ? "منتج" : "items"}`}
          />

          {lines.length === 0 ? (
            <EmptyState
              icon={<ShoppingBag className="h-6 w-6" />}
              title={lang === "ar" ? "سلتك فارغة" : "Your cart is empty"}
              description={
                lang === "ar"
                  ? "اكتشف الأقسام وأضف ما يعجبك"
                  : "Discover categories and add what you love"
              }
              action={
                <Link
                  to="/catalog"
                  className="inline-flex h-11 items-center rounded-full bg-foreground px-6 text-sm font-semibold text-background transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {lang === "ar" ? "تسوق الآن" : "Start shopping"}
                </Link>
              }
            />
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <ul className="space-y-3">
                <AnimatePresence initial={false}>
                  {lines.map((l) => (
                    <motion.li
                      key={l.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: dir === "rtl" ? -40 : 40 }}
                      transition={{ duration: 0.25 }}
                      className="flex gap-4 rounded-2xl border border-hairline bg-card p-4 sm:p-5"
                    >
                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-surface sm:h-28 sm:w-28">
                        <img
                          src={l.product.image}
                          alt={l.product.title}
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            e.currentTarget.style.visibility = "hidden";
                          }}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            {l.product.brand && (
                              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                {l.product.brand}
                              </p>
                            )}
                            <Link
                              to="/product/$slug"
                              params={{ slug: l.product.slug }}
                              className="line-clamp-2 rounded-sm text-sm font-semibold leading-snug hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 sm:text-base"
                            >
                              {l.product.title}
                            </Link>
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(l.id)}
                            className="rounded-md p-1 text-muted-foreground transition-colors hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                            aria-label="Remove"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="inline-flex items-center rounded-full border border-hairline">
                            <button
                              type="button"
                              onClick={() => setQty(l.id, l.qty - 1)}
                              aria-label="Decrease"
                              className="grid h-8 w-8 place-items-center rounded-s-full transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/50"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <motion.span
                              key={l.qty}
                              initial={{ scale: 0.7 }}
                              animate={{ scale: 1 }}
                              className="w-8 text-center text-sm font-bold"
                            >
                              {l.qty}
                            </motion.span>
                            <button
                              type="button"
                              onClick={() => setQty(l.id, l.qty + 1)}
                              aria-label="Increase"
                              className="grid h-8 w-8 place-items-center rounded-e-full transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/50"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <motion.span
                            key={l.qty}
                            initial={{ y: -4, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="font-display text-base font-extrabold sm:text-lg"
                          >
                            {format(l.product.price * l.qty)}
                          </motion.span>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>

              <aside className="lg:sticky lg:top-28 lg:self-start">
                <div className="space-y-4 rounded-2xl border border-hairline bg-card p-5">
                  <h2 className="font-display text-lg font-bold">
                    {lang === "ar" ? "ملخص الطلب" : "Order summary"}
                  </h2>

                  <div>
                    <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Truck className="h-3 w-3" />
                        {remaining === 0
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
                        className={
                          remaining === 0 ? "h-full bg-conversion" : "h-full gradient-brand"
                        }
                        initial={false}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: "spring", stiffness: 220, damping: 28 }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="pointer-events-none absolute start-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                      <input
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        placeholder={lang === "ar" ? "كود الخصم" : "Coupon code"}
                        aria-label={lang === "ar" ? "كود الخصم" : "Coupon code"}
                        className="h-10 w-full rounded-full border border-hairline bg-background ps-9 pe-3 text-sm outline-none transition-colors focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-ring/50"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const c = coupon.trim().toUpperCase();
                        if (!c) return;
                        setApplied({ code: c, pct: 0 });
                      }}
                      className="h-10 rounded-full bg-foreground px-4 text-xs font-bold text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      {lang === "ar" ? "تطبيق" : "Apply"}
                    </button>
                  </div>
                  {applied && applied.pct === 0 && (
                    <p className="text-[11px] font-semibold text-destructive">
                      {lang === "ar" ? "كود غير صالح" : "Invalid code"}
                    </p>
                  )}

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>{lang === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
                      <span className="font-semibold text-foreground">{format(subtotal)}</span>
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
                        {remaining === 0
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
                        className="font-display text-xl font-extrabold"
                      >
                        {format(total)}
                      </motion.span>
                    </div>
                  </div>

                  <Link
                    to="/checkout"
                    className="inline-flex h-12 w-full items-center justify-center rounded-full bg-foreground font-semibold text-background transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {lang === "ar" ? "إتمام الشراء" : "Proceed to checkout"}
                  </Link>
                  <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                    <ShieldCheck className="h-3 w-3" />
                    {lang === "ar" ? "دفع آمن ومحمي" : "Secure & encrypted checkout"}
                  </p>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
