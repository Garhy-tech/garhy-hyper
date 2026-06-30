import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  Banknote,
  Check,
  ChevronRight,
  CreditCard,
  Lock,
  PartyPopper,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Truck,
  Wallet,
} from "lucide-react";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { EmptyState } from "@/components/common/empty-state";
import { CountrySwitcher } from "@/components/commerce/country-switcher";
import { useCart, useCountry } from "@/contexts/commerce-context";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout â€” GARHY | HYPER" }] }),
  component: CheckoutPage,
});

type Step = 0 | 1 | 2 | 3;

function CheckoutPage() {
  const { lang } = useLanguage();
  const { lines, subtotal, clear } = useCart();
  const { format, country } = useCountry();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(0);
  const [done, setDone] = useState(false);
  const [shipping, setShipping] = useState("standard");
  const [payment, setPayment] = useState("card");
  const [form, setForm] = useState({
    email: "",
    name: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const steps = [
    { id: 0, label: lang === "ar" ? "ط§ظ„ط¹ظ†ظˆط§ظ†" : "Address" },
    { id: 1, label: lang === "ar" ? "ط§ظ„ط´ط­ظ†" : "Shipping" },
    { id: 2, label: lang === "ar" ? "ط§ظ„ط¯ظپط¹" : "Payment" },
    { id: 3, label: lang === "ar" ? "ط§ظ„ظ…ط±ط§ط¬ط¹ط©" : "Review" },
  ];

  const shippingMethods = [
    {
      id: "standard",
      label: lang === "ar" ? "ظ‚ظٹط§ط³ظٹ" : "Standard",
      price: 0,
      days: country.shipping,
    },
    { id: "express", label: lang === "ar" ? "ط³ط±ظٹط¹" : "Express", price: 12, days: "1â€“2 days" },
    { id: "same", label: lang === "ar" ? "ظ†ظپط³ ط§ظ„ظٹظˆظ…" : "Same day", price: 25, days: "Today" },
  ];
  const shipCost = shippingMethods.find((s) => s.id === shipping)?.price ?? 0;
  const total = subtotal + shipCost;

  const addressValid = useMemo(
    () => !!(form.email && form.name && form.phone && form.address && form.city),
    [form],
  );

  const canNext =
    step === 0 ? addressValid : step === 1 ? !!shipping : step === 2 ? !!payment : true;

  const placeOrder = () => {
    setDone(true);
    setTimeout(() => {
      clear();
      navigate({ to: "/" });
    }, 4000);
  };

  if (lines.length === 0 && !done) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 bg-surface/40">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
            <EmptyState
              icon={<ShoppingBag className="h-6 w-6" />}
              title={lang === "ar" ? "ط³ظ„طھظƒ ظپط§ط±ط؛ط©" : "Your cart is empty"}
              description={
                lang === "ar" ? "ط£ط¶ظپ ظ…ظ†طھط¬ط§طھ ظ„ظ„ظ…طھط§ط¨ط¹ط©" : "Add products before checking out"
              }
              action={
                <Link
                  to="/catalog"
                  className="inline-flex h-11 items-center rounded-full bg-foreground px-6 text-sm font-semibold text-background transition-transform hover:scale-[1.01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {lang === "ar" ? "طھطµظپظ‘ط­ ط§ظ„ظ…طھط¬ط±" : "Browse the shop"}
                </Link>
              }
            />
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-surface/40">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Stepper */}
          <div className="mb-8 flex items-center justify-between gap-2">
            {steps.map((s, i) => {
              const active = step === s.id;
              const completed = step > s.id;
              return (
                <div key={s.id} className="flex flex-1 items-center gap-2">
                  <div className="flex flex-col items-center gap-1.5">
                    <motion.div
                      animate={{
                        backgroundColor: completed
                          ? "var(--conversion)"
                          : active
                            ? "var(--foreground)"
                            : "var(--surface)",
                        color: completed || active ? "white" : "var(--muted-foreground)",
                        scale: active ? 1.1 : 1,
                      }}
                      className="grid h-9 w-9 place-items-center rounded-full text-sm font-bold"
                    >
                      {completed ? <Check className="h-4 w-4" /> : i + 1}
                    </motion.div>
                    <span
                      className={cn(
                        "text-[11px] font-semibold",
                        active ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-surface">
                      <motion.div
                        className="absolute inset-y-0 start-0 bg-conversion"
                        initial={false}
                        animate={{ width: step > s.id ? "100%" : "0%" }}
                        transition={{ type: "spring", stiffness: 220, damping: 30 }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-2xl border border-hairline bg-card p-5 sm:p-6"
                >
                  {step === 0 && (
                    <>
                      <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-display text-lg font-bold">
                          {lang === "ar" ? "ط¹ظ†ظˆط§ظ† ط§ظ„ط´ط­ظ†" : "Shipping address"}
                        </h2>
                        <CountrySwitcher compact />
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {(
                          [
                            ["email", lang === "ar" ? "ط§ظ„ط¨ط±ظٹط¯ ط§ظ„ط¥ظ„ظƒطھط±ظˆظ†ظٹ" : "Email", "email"],
                            ["name", lang === "ar" ? "ط§ظ„ط§ط³ظ… ط§ظ„ظƒط§ظ…ظ„" : "Full name", "text"],
                            ["phone", lang === "ar" ? "ط±ظ‚ظ… ط§ظ„ط¬ظˆط§ظ„" : "Phone", "tel"],
                            ["zip", lang === "ar" ? "ط§ظ„ط±ظ…ط² ط§ظ„ط¨ط±ظٹط¯ظٹ" : "Postal code", "text"],
                            ["address", lang === "ar" ? "ط§ظ„ط¹ظ†ظˆط§ظ†" : "Address", "text"],
                            ["city", lang === "ar" ? "ط§ظ„ظ…ط¯ظٹظ†ط©" : "City", "text"],
                          ] as const
                        ).map(([key, label, type]) => {
                          const v = form[key];
                          const invalid = touched[key] && !v;
                          return (
                            <label
                              key={key}
                              className={cn(
                                "text-xs font-semibold",
                                key === "address" && "sm:col-span-2",
                              )}
                            >
                              <span className="mb-1 block text-muted-foreground">{label}</span>
                              <input
                                type={type}
                                value={v}
                                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                onBlur={() => setTouched({ ...touched, [key]: true })}
                                className={cn(
                                  "h-11 w-full rounded-xl border bg-background px-3 text-sm font-normal outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/50",
                                  invalid
                                    ? "border-destructive focus:border-destructive"
                                    : "border-hairline focus:border-brand",
                                )}
                              />
                            </label>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {step === 1 && (
                    <>
                      <h2 className="mb-4 font-display text-lg font-bold">
                        {lang === "ar" ? "ط·ط±ظٹظ‚ط© ط§ظ„ط´ط­ظ†" : "Shipping method"}
                      </h2>
                      <div className="space-y-2">
                        {shippingMethods.map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setShipping(m.id)}
                            className={cn(
                              "flex w-full items-center justify-between gap-3 rounded-xl border p-4 text-start transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                              shipping === m.id
                                ? "border-foreground bg-surface"
                                : "border-hairline hover:border-foreground/30",
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <Truck className="h-4 w-4 text-brand" />
                              <div>
                                <p className="text-sm font-bold">{m.label}</p>
                                <p className="text-[11px] text-muted-foreground">{m.days}</p>
                              </div>
                            </div>
                            <span className="font-display text-sm font-extrabold">
                              {m.price === 0 ? (lang === "ar" ? "ظ…ط¬ط§ظ†ظٹ" : "Free") : format(m.price)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <h2 className="mb-4 font-display text-lg font-bold">
                        {lang === "ar" ? "ط·ط±ظٹظ‚ط© ط§ظ„ط¯ظپط¹" : "Payment method"}
                      </h2>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {[
                          {
                            id: "card",
                            label: lang === "ar" ? "ط¨ط·ط§ظ‚ط© ط§ط¦طھظ…ط§ظ†" : "Credit card",
                            Icon: CreditCard,
                          },
                          {
                            id: "wallet",
                            label: lang === "ar" ? "ظ…ط­ظپط¸ط© ط¥ظ„ظƒطھط±ظˆظ†ظٹط©" : "Digital wallet",
                            Icon: Wallet,
                          },
                          { id: "apple", label: "Apple Pay", Icon: Smartphone },
                          {
                            id: "cod",
                            label: lang === "ar" ? "ط§ظ„ط¯ظپط¹ ط¹ظ†ط¯ ط§ظ„ط§ط³طھظ„ط§ظ…" : "Cash on delivery",
                            Icon: Banknote,
                          },
                        ].map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setPayment(m.id)}
                            className={cn(
                              "flex items-center gap-3 rounded-xl border p-4 text-start transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                              payment === m.id
                                ? "border-foreground bg-surface"
                                : "border-hairline hover:border-foreground/30",
                            )}
                          >
                            <m.Icon className="h-4 w-4 text-brand" />
                            <span className="text-sm font-bold">{m.label}</span>
                          </button>
                        ))}
                      </div>
                      <p className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Lock className="h-3 w-3" />
                        {lang === "ar" ? "ط¬ظ…ظٹط¹ ط§ظ„ظ…ط¹ط§ظ…ظ„ط§طھ ظ…ط´ظپظ‘ط±ط©" : "All transactions are encrypted"}
                      </p>
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <h2 className="mb-4 font-display text-lg font-bold">
                        {lang === "ar" ? "ط±ط§ط¬ط¹ ط·ظ„ط¨ظƒ" : "Review your order"}
                      </h2>
                      <ul className="divide-y divide-hairline">
                        {lines.map((l) => (
                          <li key={l.id} className="flex gap-3 py-3">
                            <div className="h-14 w-14 overflow-hidden rounded-lg bg-surface">
                              <img
                                src={l.product.image}
                                alt=""
                                loading="lazy"
                                decoding="async"
                                onError={(e) => {
                                  e.currentTarget.style.visibility = "hidden";
                                }}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="line-clamp-1 text-sm font-semibold">
                                {l.product.title}
                              </p>
                              <p className="text-[11px] text-muted-foreground">x{l.qty}</p>
                            </div>
                            <span className="self-center text-sm font-bold">
                              {format(l.product.price * l.qty)}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 rounded-xl bg-surface p-3 text-xs">
                        <p>
                          <strong>{form.name}</strong> آ· {form.phone}
                        </p>
                        <p className="text-muted-foreground">
                          {form.address}, {form.city} {form.zip} آ· {country.name}
                        </p>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(0, s - 1) as Step)}
                  disabled={step === 0}
                  className="h-11 rounded-full border border-hairline px-5 text-sm font-semibold transition-colors hover:border-foreground/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-40"
                >
                  {lang === "ar" ? "ط§ظ„ط³ط§ط¨ظ‚" : "Back"}
                </button>
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (step === 0 && !addressValid) {
                        setTouched({
                          email: true,
                          name: true,
                          phone: true,
                          address: true,
                          city: true,
                          zip: true,
                        });
                        return;
                      }
                      setStep((s) => (s + 1) as Step);
                    }}
                    disabled={!canNext}
                    className="inline-flex h-11 items-center gap-1.5 rounded-full bg-foreground px-6 text-sm font-bold text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-40"
                  >
                    {lang === "ar" ? "ظ…طھط§ط¨ط¹ط©" : "Continue"}
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={placeOrder}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-conversion px-6 text-sm font-bold text-conversion-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    {lang === "ar" ? `ط§ط¯ظپط¹ ${format(total)}` : `Pay ${format(total)}`}
                  </button>
                )}
              </div>
            </div>

            {/* Summary */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="space-y-3 rounded-2xl border border-hairline bg-card p-5">
                <h3 className="font-display text-base font-bold">
                  {lang === "ar" ? "ط§ظ„ظ…ظ„ط®طµ" : "Summary"}
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>{lang === "ar" ? "ط§ظ„ظ…ظ†طھط¬ط§طھ" : "Items"}</span>
                    <span className="font-semibold text-foreground">{format(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>{lang === "ar" ? "ط§ظ„ط´ط­ظ†" : "Shipping"}</span>
                    <span>
                      {shipCost === 0 ? (lang === "ar" ? "ظ…ط¬ط§ظ†ظٹ" : "Free") : format(shipCost)}
                    </span>
                  </div>
                  <div className="mt-1 flex items-baseline justify-between border-t border-hairline pt-2">
                    <span className="font-display text-sm font-bold">
                      {lang === "ar" ? "ط§ظ„ط¥ط¬ظ…ط§ظ„ظٹ" : "Total"}
                    </span>
                    <span className="font-display text-lg font-extrabold">{format(total)}</span>
                  </div>
                </div>
                <div className="mt-2 space-y-1.5 text-[11px] text-muted-foreground">
                  <p className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3 w-3" />{" "}
                    {lang === "ar" ? "ط­ظ…ط§ظٹط© ط§ظ„ظ…ط´طھط±ظٹ" : "Buyer protection"}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Lock className="h-3 w-3" /> {lang === "ar" ? "ط¯ظپط¹ ظ…ط´ظپظ‘ط±" : "Encrypted payment"}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Truck className="h-3 w-3" />{" "}
                    {lang === "ar" ? `ط´ط­ظ† ط¥ظ„ظ‰ ${country.nameAr}` : `Shipping to ${country.name}`}
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Success modal */}
        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[120] flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="relative w-full max-w-md overflow-hidden rounded-2xl bg-card p-8 text-center shadow-elevated"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.1 }}
                  className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-conversion text-conversion-foreground"
                >
                  <Check className="h-10 w-10" strokeWidth={3} />
                </motion.div>
                <motion.div
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="mt-5 inline-flex items-center gap-2 font-display text-2xl font-extrabold">
                    <PartyPopper className="h-5 w-5 text-conversion" />
                    {lang === "ar" ? "طھظ… ط§ظ„ط·ظ„ط¨ ط¨ظ†ط¬ط§ط­" : "Order placed!"}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {lang === "ar"
                      ? "ط³ظٹطھظ… طھط­ظˆظٹظ„ظƒ ط¥ظ„ظ‰ ط§ظ„طµظپط­ط© ط§ظ„ط±ط¦ظٹط³ظٹط©"
                      : "Redirecting you home shortly"}
                  </p>
                </motion.div>
                {/* Confetti */}
                {Array.from({ length: 14 }).map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                    animate={{
                      x: Math.cos((i / 14) * Math.PI * 2) * 140,
                      y: Math.sin((i / 14) * Math.PI * 2) * 140,
                      opacity: 0,
                      scale: 1,
                    }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 rounded-full"
                    style={{
                      background: [
                        "var(--conversion)",
                        "var(--cyan-accent)",
                        "var(--brand)",
                        "var(--gold)",
                      ][i % 4],
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <SiteFooter />
    </div>
  );
}


