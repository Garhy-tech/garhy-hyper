import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import { useCart, useCountry, useWishlist } from "@/contexts/commerce-context";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — GARHY | HYPER" }] }),
  component: WishlistPage,
});

function WishlistPage() {
  const { lang } = useLanguage();
  const wish = useWishlist();
  const { format } = useCountry();
  const cart = useCart();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-surface/40">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <PageHeader
            title={lang === "ar" ? "المفضلة" : "Wishlist"}
            description={`${wish.count} ${lang === "ar" ? "منتج محفوظ" : "saved items"}`}
          />

          {wish.count === 0 ? (
            <EmptyState
              icon={<Heart className="h-6 w-6" />}
              title={lang === "ar" ? "لا توجد منتجات محفوظة" : "No saved items"}
              description={
                lang === "ar"
                  ? "اضغط على القلب لحفظ منتجاتك المفضلة"
                  : "Tap the heart on any product to save it here"
              }
              action={
                <Link
                  to="/catalog"
                  className="inline-flex h-11 items-center rounded-full bg-foreground px-6 text-sm font-semibold text-background transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {lang === "ar" ? "تصفح المتجر" : "Browse the shop"}
                </Link>
              }
            />
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              <AnimatePresence>
                {wish.items.map((p) => (
                  <motion.li
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group overflow-hidden rounded-2xl border border-hairline bg-card"
                  >
                    <Link
                      to="/product/$slug"
                      params={{ slug: p.slug }}
                      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/50"
                    >
                      <div className="aspect-square overflow-hidden bg-surface">
                        <img
                          src={p.image}
                          alt={p.title}
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            e.currentTarget.style.visibility = "hidden";
                          }}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    </Link>
                    <div className="space-y-2 p-3">
                      <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{p.title}</h3>
                      <p className="font-display text-base font-extrabold">{format(p.price)}</p>
                      <div className="flex gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            cart.add(p);
                            cart.setOpen(true);
                          }}
                          className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-foreground text-xs font-semibold text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" />
                          {lang === "ar" ? "أضف" : "Add"}
                        </button>
                        <button
                          type="button"
                          onClick={() => wish.remove(p.id)}
                          aria-label="Remove"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-muted-foreground transition-colors hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
