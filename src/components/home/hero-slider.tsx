import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Globe2,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";

type Slide = {
  id: string;
  eyebrow: { en: string; ar: string };
  title: { en: string; ar: string };
  subtitle: { en: string; ar: string };
  cta: { en: string; ar: string };
  to: string;
  accent: "brand" | "conversion" | "cyan";
  Icon: LucideIcon;
};

const SLIDES: Slide[] = [
  {
    id: "welcome",
    eyebrow: { en: "GARHY | HYPER", ar: "ط؛ط§ط±ظ‡ظٹ | ظ‡ط§ظٹط¨ط±" },
    title: {
      en: "Your destination\nfor authentic shopping.",
      ar: "ظˆط¬ظ‡طھظƒ\nظ„ظ„طھط³ظˆظ‚ ط§ظ„ط£طµظ„ظٹ.",
    },
    subtitle: {
      en: "A curated marketplace bringing original products together in one seamless, trusted experience.",
      ar: "ظ…طھط¬ط± ظ…ط®طھط§ط± ظٹط¬ظ…ط¹ ط§ظ„ظ…ظ†طھط¬ط§طھ ط§ظ„ط£طµظ„ظٹط© ظپظٹ طھط¬ط±ط¨ط© طھط³ظˆظ‚ ظˆط§ط­ط¯ط© ظ…ظˆط«ظˆظ‚ط© ظˆط³ظ„ط³ط©.",
    },
    cta: { en: "Start shopping", ar: "ط§ط¨ط¯ط£ ط§ظ„طھط³ظˆظ‚" },
    to: "/catalog",
    accent: "brand",
    Icon: Globe2,
  },
  {
    id: "trust",
    eyebrow: { en: "Why GARHY", ar: "ظ„ظ…ط§ط°ط§ ط؛ط§ط±ظ‡ظٹ" },
    title: { en: "Authentic products,\nfair prices.", ar: "ظ…ظ†طھط¬ط§طھ ط£طµظ„ظٹط©طŒ\nط¨ط£ط³ط¹ط§ط± ط¹ط§ط¯ظ„ط©." },
    subtitle: {
      en: "Every item is 100% genuine, backed by fast shipping and dependable support.",
      ar: "ظƒظ„ ظ…ظ†طھط¬ ط£طµظ„ظٹ 100%طŒ ظ…ط¹ ط´ط­ظ† ط³ط±ظٹط¹ ظˆط¯ط¹ظ… ظ…ظˆط«ظˆظ‚.",
    },
    cta: { en: "Browse catalog", ar: "طھطµظپظ‘ط­ ط§ظ„ظƒطھط§ظ„ظˆط¬" },
    to: "/catalog",
    accent: "conversion",
    Icon: ShieldCheck,
  },
  {
    id: "new",
    eyebrow: { en: "Now open", ar: "ط§ظپطھطھط­ظ†ط§ ط§ظ„ط¢ظ†" },
    title: {
      en: "Be the first\nto explore.",
      ar: "ظƒظ† ط£ظˆظ„\nظ…ظ† ظٹظƒطھط´ظپ.",
    },
    subtitle: {
      en: "Discover new products as our catalog grows.",
      ar: "ط§ظƒطھط´ظپ ظ…ظ†طھط¬ط§طھ ط¬ط¯ظٹط¯ط© ظ…ط¹ ظ†ظ…ظˆ ظ…طھط¬ط±ظ†ط§.",
    },
    cta: { en: "Explore", ar: "ط§ظƒطھط´ظپ" },
    to: "/catalog",
    accent: "cyan",
    Icon: Sparkles,
  },
];

const ROTATE_MS = 6000;

export function HeroSlider() {
  const { lang, dir } = useLanguage();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const L = useCallback(
    <T extends { en: string; ar: string }>(o: T) => (lang === "ar" ? o.ar : o.en),
    [lang],
  );

  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(() => setIndex((i) => (i + 1) % SLIDES.length), ROTATE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [index, paused]);

  const goTo = (i: number) => setIndex(((i % SLIDES.length) + SLIDES.length) % SLIDES.length);
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const slide = SLIDES[index];
  const accentBg =
    slide.accent === "conversion"
      ? "from-conversion-soft via-background to-background"
      : slide.accent === "cyan"
        ? "from-brand-soft via-background to-background"
        : "from-brand-soft/70 via-background to-background";

  return (
    <section
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Hero campaigns"
    >
      <div
        className={`absolute inset-0 -z-10 bg-gradient-to-b ${accentBg} transition-colors duration-700`}
      />
      <div
        className="absolute -top-32 end-[-10%] -z-10 h-[520px] w-[520px] rounded-full opacity-40 blur-3xl transition-colors duration-700"
        style={{
          background: `radial-gradient(circle, var(--${slide.accent === "conversion" ? "conversion" : "brand"}) 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute -bottom-40 start-[-10%] -z-10 h-[420px] w-[420px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--cyan-accent) 0%, transparent 70%)" }}
      />

      <div className="mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 sm:pt-16 lg:px-8 lg:pb-20 lg:pt-24">
        <div className="relative min-h-[360px] sm:min-h-[420px] lg:min-h-[480px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 80) {
                  goTo(index + (info.offset.x < 0 ? 1 : -1) * (dir === "rtl" ? -1 : 1));
                }
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]"
            >
              <div>
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur ${
                    slide.accent === "conversion"
                      ? "border-conversion/30 bg-conversion/10 text-conversion"
                      : "border-brand/20 bg-card/80 text-brand"
                  }`}
                >
                  <slide.Icon className="h-3.5 w-3.5" />
                  {L(slide.eyebrow)}
                </span>
                <h1 className="mt-6 font-display text-[2.25rem] font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                  {L(slide.title)
                    .split("\n")
                    .map((line, i) => (
                      <span key={i} className="block">
                        {i === 1 ? <span className="text-gradient-brand">{line}</span> : line}
                      </span>
                    ))}
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {L(slide.subtitle)}
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link to={slide.to}>
                    <Button size="lg" className="h-12 gap-2 px-7 text-base shadow-elevated">
                      {L(slide.cta)}
                      <Arrow className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/catalog">
                    <Button size="lg" variant="outline" className="h-12 px-7 text-base">
                      {lang === "ar" ? "ط§ظƒطھط´ظپ ط§ظ„ط£ظ‚ط³ط§ظ…" : "Browse categories"}
                    </Button>
                  </Link>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-2.5 sm:max-w-md">
                  {[
                    { Icon: ShieldCheck, label: lang === "ar" ? "ط£طµظ„ظٹ 100%" : "100% authentic" },
                    { Icon: Truck, label: lang === "ar" ? "ط´ط­ظ† ط³ط±ظٹط¹" : "Fast shipping" },
                    { Icon: Sparkles, label: lang === "ar" ? "ط¯ط¹ظ… ظ…طھظ…ظٹط²" : "Premium support" },
                  ].map(({ Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2 rounded-xl border border-hairline bg-card/70 px-3 py-2.5 text-xs font-medium backdrop-blur"
                    >
                      <Icon className="h-4 w-4 text-brand" />
                      <span className="truncate">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative hidden lg:block">
                <div className="relative aspect-square rounded-3xl border border-hairline bg-gradient-to-br from-card to-brand-soft p-10 shadow-elevated">
                  <motion.div
                    initial={{ scale: 0.92, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="grid h-full place-items-center"
                  >
                    <div
                      className={`grid h-40 w-40 place-items-center rounded-3xl text-white shadow-elevated ${
                        slide.accent === "conversion" ? "gradient-conversion" : "gradient-brand"
                      }`}
                    >
                      <slide.Icon className="h-20 w-20" strokeWidth={1.4} />
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
                className="group relative h-1.5 overflow-hidden rounded-full bg-hairline transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                style={{ width: i === index ? 44 : 16 }}
              >
                {i === index && (
                  <motion.span
                    key={`bar-${index}-${paused ? "p" : "r"}`}
                    initial={{ width: "0%" }}
                    animate={{ width: paused ? "0%" : "100%" }}
                    transition={{ duration: paused ? 0 : ROTATE_MS / 1000, ease: "linear" }}
                    className="absolute inset-y-0 start-0 bg-brand"
                  />
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => goTo(index - 1)}
              aria-label="Previous slide"
              className="grid h-9 w-9 place-items-center rounded-full border border-hairline transition-colors hover:border-brand/40 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              {dir === "rtl" ? (
                <ArrowRight className="h-4 w-4" />
              ) : (
                <ArrowLeft className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={() => goTo(index + 1)}
              aria-label="Next slide"
              className="grid h-9 w-9 place-items-center rounded-full border border-hairline transition-colors hover:border-brand/40 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              {dir === "rtl" ? (
                <ArrowLeft className="h-4 w-4" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}


