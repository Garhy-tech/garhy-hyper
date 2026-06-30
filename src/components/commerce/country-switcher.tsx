"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCountry } from "@/contexts/commerce-context";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";

export function CountrySwitcher({ compact = false }: { compact?: boolean }) {
  const { country, countries, setCountry } = useCountry();
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-hairline bg-background px-2.5 text-xs font-semibold transition-colors hover:border-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          compact ? "h-8" : "h-9",
        )}
      >
        <span className="text-sm leading-none" aria-hidden>
          {country.flag}
        </span>
        <span className="hidden sm:inline">{lang === "ar" ? country.nameAr : country.code}</span>
        <span className="text-[10px] font-bold text-muted-foreground">{country.currency}</span>
        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute end-0 z-50 mt-2 w-72 overflow-hidden rounded-2xl glass-popover"
            role="listbox"
          >
            <div className="flex items-center gap-2 border-b border-hairline px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <Globe className="h-3.5 w-3.5" />
              {lang === "ar" ? "ط§ط®طھط± ط§ظ„ظˆط¬ظ‡ط©" : "Ship to"}
            </div>
            <ul className="max-h-72 overflow-y-auto py-1">
              {countries.map((c) => {
                const active = c.code === country.code;
                return (
                  <li key={c.code}>
                    <button
                      type="button"
                      onClick={() => {
                        setCountry(c.code);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-2.5 text-start text-sm transition-colors hover:bg-surface focus-visible:outline-none focus-visible:bg-surface focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/50",
                        active && "bg-brand-soft",
                      )}
                    >
                      <span className="text-lg leading-none">{c.flag}</span>
                      <span className="flex-1 truncate font-semibold">
                        {lang === "ar" ? c.nameAr : c.name}
                      </span>
                      <span className="text-[11px] font-bold text-muted-foreground">
                        {c.currency}
                      </span>
                      {active && <Check className="h-3.5 w-3.5 text-brand" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


