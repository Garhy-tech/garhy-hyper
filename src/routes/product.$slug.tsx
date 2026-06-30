import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Award,
  Heart,
  Minus,
  PackageX,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ProductGallery } from "@/components/commerce/product-gallery";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { useCart, useCountry, useWishlist, type Product } from "@/contexts/commerce-context";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";
import { getProductBySlug, type CatalogProduct } from "@/lib/api/catalog.functions";

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => ({
    meta: [
      {
        title: `${params.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} â€” GARHY | HYPER`,
      },
    ],
  }),
  loader: ({ params }) => getProductBySlug({ data: { slug: params.slug } }),
  component: ProductPage,
});

/** Map a DB CatalogProduct row into the display shape (real fields only). */
function fromDatabase(db: CatalogProduct, lang: string): Product & { description: string | null } {
  const l = lang === "en" ? "en" : "ar";
  return {
    id: db.id,
    slug: db.slug,
    title: l === "ar" ? db.title_ar : db.title_en,
    brand: db.brand_name ?? undefined,
    price: Number(db.price),
    compareAt: db.compare_at_price ? Number(db.compare_at_price) : undefined,
    image: db.image_url,
    imageAlt: l === "ar" ? db.title_ar : db.title_en,
    rating: db.rating,
    reviews: db.review_count,
    badge: db.badge ?? undefined,
    freeShipping: db.free_shipping,
    fastDelivery: db.fast_delivery,
    description: (l === "ar" ? db.description_ar : db.description_en) ?? null,
  };
}

function ProductPage() {
  const dbProduct: CatalogProduct | null = Route.useLoaderData();
  if (!dbProduct) return <ProductNotFound />;
  return <ProductView product={dbProduct} />;
}

/** Shown for slugs that do not exist in the catalog. */
function ProductNotFound() {
  const { lang } = useLanguage();
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <EmptyState
            icon={<PackageX className="h-6 w-6" />}
            title={lang === "ar" ? "ط§ظ„ظ…ظ†طھط¬ ط؛ظٹط± ظ…ظˆط¬ظˆط¯" : "Product not found"}
            description={
              lang === "ar"
                ? "ظ‡ط°ط§ ط§ظ„ظ…ظ†طھط¬ ط؛ظٹط± ظ…طھظˆظپط± ط£ظˆ طھظ…طھ ط¥ط²ط§ظ„طھظ‡. طھطµظپظ‘ط­ ط§ظ„ظƒطھط§ظ„ظˆط¬ ظ„ط§ظƒطھط´ط§ظپ ظ…ظ†طھط¬ط§طھ ط£ط®ط±ظ‰."
                : "This product is unavailable or has been removed. Browse the catalog to discover other products."
            }
            action={
              <Link to="/catalog">
                <Button size="lg" className="h-11 px-6">
                  {lang === "ar" ? "طھطµظپظ‘ط­ ط§ظ„ظƒطھط§ظ„ظˆط¬" : "Browse catalog"}
                </Button>
              </Link>
            }
          />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function ProductView({ product }: { product: CatalogProduct }) {
  const { lang } = useLanguage();
  const cart = useCart();
  const wish = useWishlist();
  const { format } = useCountry();

  const p = useMemo(() => fromDatabase(product, lang), [product, lang]);
  const images = useMemo(
    () => (product.gallery_urls?.length ? product.gallery_urls : [product.image_url]),
    [product],
  );

  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"desc" | "reviews">("desc");
  const addBtnRef = useRef<HTMLButtonElement>(null);

  const hasReviews = (p.reviews ?? 0) > 0;
  const discount = p.compareAt ? Math.round(((p.compareAt - p.price) / p.compareAt) * 100) : 0;

  const onAdd = () => {
    cart.add(p, qty, undefined, addBtnRef.current?.getBoundingClientRect() ?? undefined);
    cart.setOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 pb-28 sm:pb-12">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
            <ProductGallery images={images} title={p.title} />

            {/* Purchase panel */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="space-y-5">
                <div>
                  {p.brand && (
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                      {p.brand}
                    </p>
                  )}
                  <h1 className="mt-2 font-display text-2xl font-extrabold leading-tight sm:text-3xl">
                    {p.title}
                  </h1>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    {hasReviews ? (
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-conversion text-conversion" />
                        <span className="font-bold text-foreground">{p.rating?.toFixed(1)}</span>
                        <span>
                          ({p.reviews?.toLocaleString()} {lang === "ar" ? "طھظ‚ظٹظٹظ…" : "reviews"})
                        </span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3.5 w-3.5" />
                        {lang === "ar" ? "ظ„ط§ طھظˆط¬ط¯ طھظ‚ظٹظٹظ…ط§طھ ط¨ط¹ط¯" : "No reviews yet"}
                      </span>
                    )}
                    {p.badge === "best-seller" && (
                      <span className="inline-flex items-center gap-1 text-conversion">
                        <Award className="h-3.5 w-3.5" />
                        {lang === "ar" ? "ط§ظ„ط£ظƒط«ط± ظ…ط¨ظٹط¹ط§ظ‹" : "Best seller"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-hairline bg-card p-5">
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-3xl font-extrabold">{format(p.price)}</span>
                    {p.compareAt && (
                      <>
                        <span className="text-base text-muted-foreground line-through">
                          {format(p.compareAt)}
                        </span>
                        <span className="rounded-full bg-conversion px-2 py-0.5 text-[11px] font-extrabold text-conversion-foreground">
                          -{discount}%
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Qty + actions */}
                <div className="flex flex-wrap items-stretch gap-2">
                  <div className="inline-flex items-center rounded-full border border-hairline">
                    <button
                      type="button"
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      aria-label="Decrease"
                      className="grid h-12 w-11 place-items-center rounded-s-full transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/50"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <motion.span
                      key={qty}
                      initial={{ scale: 0.7 }}
                      animate={{ scale: 1 }}
                      className="w-10 text-center text-sm font-bold"
                    >
                      {qty}
                    </motion.span>
                    <button
                      type="button"
                      onClick={() => setQty(qty + 1)}
                      aria-label="Increase"
                      className="grid h-12 w-11 place-items-center rounded-e-full transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <motion.button
                    ref={addBtnRef}
                    type="button"
                    onClick={onAdd}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-foreground text-sm font-semibold text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-base"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    {lang === "ar" ? "ط£ط¶ظپ ط¥ظ„ظ‰ ط§ظ„ط³ظ„ط©" : "Add to cart"}
                  </motion.button>
                  <button
                    type="button"
                    onClick={() => wish.toggle(p)}
                    aria-label="Wishlist"
                    className={cn(
                      "inline-flex h-12 w-12 items-center justify-center rounded-full border border-hairline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                      wish.has(p.id)
                        ? "border-destructive/40 text-destructive"
                        : "hover:border-foreground/30",
                    )}
                  >
                    <Heart className="h-4 w-4" fill={wish.has(p.id) ? "currentColor" : "none"} />
                  </button>
                </div>

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-2 rounded-2xl border border-hairline bg-card p-3 text-center text-[11px]">
                  {[
                    { Icon: Truck, t: lang === "ar" ? "ط´ط­ظ† ط³ط±ظٹط¹" : "Fast shipping" },
                    { Icon: RotateCcw, t: lang === "ar" ? "ط¥ط±ط¬ط§ط¹ ظ،ظ¤ ظٹظˆظ…" : "14-day returns" },
                    { Icon: ShieldCheck, t: lang === "ar" ? "ط¶ظ…ط§ظ† ط£طµظ„ظٹ" : "Authentic" },
                  ].map(({ Icon, t }) => (
                    <div key={t} className="flex flex-col items-center gap-1.5 py-1">
                      <Icon className="h-4 w-4 text-brand" />
                      <span className="font-semibold">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <section className="mt-14">
            <div className="flex gap-1 border-b border-hairline">
              {[
                { id: "desc" as const, label: lang === "ar" ? "ط§ظ„ظˆطµظپ" : "Description" },
                { id: "reviews" as const, label: lang === "ar" ? "ط§ظ„طھظ‚ظٹظٹظ…ط§طھ" : "Reviews" },
              ].map((tItem) => (
                <button
                  key={tItem.id}
                  type="button"
                  onClick={() => setTab(tItem.id)}
                  className={cn(
                    "relative rounded-t-md px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    tab === tItem.id
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tItem.label}
                  {tab === tItem.id && (
                    <motion.span
                      layoutId="prod-tab"
                      className="absolute inset-x-2 -bottom-px h-0.5 bg-foreground"
                    />
                  )}
                </button>
              ))}
            </div>
            <div className="py-6 text-sm leading-relaxed text-muted-foreground">
              {tab === "desc" && (
                <p className="max-w-3xl">
                  {p.description
                    ? p.description
                    : lang === "ar"
                      ? "ظ„ط§ ظٹظˆط¬ط¯ ظˆطµظپ ظ„ظ‡ط°ط§ ط§ظ„ظ…ظ†طھط¬ ط¨ط¹ط¯."
                      : "No description available yet."}
                </p>
              )}
              {tab === "reviews" &&
                (hasReviews ? (
                  <p className="max-w-3xl">
                    {lang === "ar"
                      ? `ظ…طھظˆط³ط· ط§ظ„طھظ‚ظٹظٹظ… ${p.rating?.toFixed(1)} / 5 ظ…ظ† ${p.reviews?.toLocaleString()} طھظ‚ظٹظٹظ….`
                      : `Average rating ${p.rating?.toFixed(1)} / 5 from ${p.reviews?.toLocaleString()} reviews.`}
                  </p>
                ) : (
                  <p className="max-w-3xl">
                    {lang === "ar"
                      ? "ظ„ط§ طھظˆط¬ط¯ طھظ‚ظٹظٹظ…ط§طھ ظ„ظ‡ط°ط§ ط§ظ„ظ…ظ†طھط¬ ط¨ط¹ط¯."
                      : "This product has no reviews yet."}
                  </p>
                ))}
            </div>
          </section>
        </div>

        {/* Mobile floating buy bar */}
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-hairline bg-background/95 px-4 py-3 backdrop-blur sm:hidden">
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <p className="font-display text-lg font-extrabold leading-none">{format(p.price)}</p>
              {p.compareAt && (
                <p className="text-[11px] text-muted-foreground line-through">
                  {format(p.compareAt)}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={onAdd}
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-foreground text-sm font-bold text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Zap className="h-4 w-4" />
              {lang === "ar" ? "ط§ط´طھط±ظٹ ط§ظ„ط¢ظ†" : "Buy now"}
            </button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

