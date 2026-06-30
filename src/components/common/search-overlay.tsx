import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, X, Clock, Sparkles, LayoutGrid, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/use-language";
import { getNavCategories, type CatalogCategory } from "@/lib/api/catalog.functions";

const RECENT_KEY = "rw_recent_searches";
const MAX_RECENT = 6;

type SpeechRecognitionInstance = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: () => void;
  onerror: () => void;
  onend: () => void;
  onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
  start: () => void;
};
type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, lang, dir } = useLanguage();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const [listening, setListening] = useState(false);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);

  useEffect(() => {
    if (!open) return;
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      setRecent(raw ? JSON.parse(raw) : []);
    } catch {
      setRecent([]);
    }
    let active = true;
    getNavCategories()
      .then((rows) => {
        if (active) setCategories(rows);
      })
      .catch(() => {
        if (active) setCategories([]);
      });
    const tm = setTimeout(() => inputRef.current?.focus(), 50);
    document.body.style.overflow = "hidden";
    return () => {
      active = false;
      clearTimeout(tm);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const commit = (term: string) => {
    const q = term.trim();
    if (!q) return;
    const next = [q, ...recent.filter((r) => r.toLowerCase() !== q.toLowerCase())].slice(
      0,
      MAX_RECENT,
    );
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    setRecent(next);
    onClose();
    navigate({ to: "/search" });
  };

  const startVoice = () => {
    if (typeof window === "undefined") return;
    const w = window as typeof window & {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) {
      toast.info(
        lang === "ar"
          ? "البحث الصوتي غير مدعوم في هذا المتصفح"
          : "Voice search not supported in this browser",
      );
      return;
    }
    try {
      const rec = new SR();
      rec.lang = lang === "ar" ? "ar-SA" : "en-US";
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onstart = () => setListening(true);
      rec.onerror = () => setListening(false);
      rec.onend = () => setListening(false);
      rec.onresult = (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => {
        const text = e.results[0][0].transcript;
        setQuery(text);
        setListening(false);
      };
      rec.start();
    } catch {
      setListening(false);
    }
  };

  const suggestions = query
    ? [
        `${query} — ${lang === "ar" ? "أفضل العروض" : "best deals"}`,
        `${query} — ${lang === "ar" ? "الأكثر مبيعاً" : "best sellers"}`,
        `${query} — ${lang === "ar" ? "وصل حديثاً" : "new arrivals"}`,
      ]
    : [];

  const hasContent = recent.length > 0 || categories.length > 0 || query.length > 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={t("nav.search")}
        >
          <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="mx-auto mt-3 max-h-[92vh] w-[min(100%-1rem,720px)] overflow-hidden rounded-2xl glass-strong sm:mt-10"
            dir={dir}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                commit(query);
              }}
              className="relative flex items-center border-b border-hairline"
            >
              <Search className="pointer-events-none absolute start-4 h-4 w-4 text-muted-foreground" />
              <input
                ref={inputRef}
                suppressHydrationWarning
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("header.searchPlaceholder")}
                className="h-14 w-full bg-transparent ps-12 pe-24 text-sm outline-none sm:text-base"
                aria-label={t("nav.search")}
              />
              <div className="absolute end-2 flex items-center gap-1">
                <motion.button
                  type="button"
                  onClick={startVoice}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Voice search"
                  className={`grid h-9 w-9 place-items-center rounded-full transition-colors ${
                    listening
                      ? "bg-conversion text-conversion-foreground"
                      : "text-muted-foreground hover:bg-surface"
                  }`}
                >
                  <Mic className="h-4 w-4" />
                  {listening && (
                    <motion.span
                      className="absolute h-9 w-9 rounded-full border-2 border-conversion"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                    />
                  )}
                </motion.button>
                <button
                  type="button"
                  onClick={onClose}
                  className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-surface"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </form>

            <div className="grid max-h-[70vh] grid-cols-1 gap-6 overflow-y-auto p-5 sm:grid-cols-2">
              {!hasContent && (
                <div className="flex flex-col items-center justify-center px-6 py-12 text-center sm:col-span-2">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="grid h-14 w-14 place-items-center rounded-full bg-brand-soft text-brand"
                  >
                    <Search className="h-6 w-6" />
                  </motion.div>
                  <p className="mt-3 font-display text-base font-bold">
                    {lang === "ar" ? "ابدأ البحث" : "Start searching"}
                  </p>
                  <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                    {lang === "ar"
                      ? "اكتب اسم المنتج الذي تبحث عنه."
                      : "Type the name of a product you're looking for."}
                  </p>
                </div>
              )}

              {recent.length > 0 && (
                <Section
                  title={lang === "ar" ? "عمليات بحث سابقة" : "Recent searches"}
                  icon={Clock}
                >
                  <Chips items={recent} onPick={commit} />
                </Section>
              )}

              {query && (
                <Section title={lang === "ar" ? "اقتراحات" : "Suggestions"} icon={Sparkles}>
                  <ul className="space-y-1.5 text-sm">
                    {suggestions.map((s) => (
                      <li key={s}>
                        <button
                          onClick={() => commit(s)}
                          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-start transition-colors hover:bg-surface"
                        >
                          <Sparkles className="h-3.5 w-3.5 text-brand" />
                          <span>{s}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {categories.length > 0 && (
                <Section
                  title={lang === "ar" ? "أقسام مقترحة" : "Suggested categories"}
                  icon={LayoutGrid}
                >
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          onClose();
                          navigate({ to: "/catalog/$category", params: { category: c.slug } });
                        }}
                        className="rounded-full border border-hairline px-3 py-1.5 text-xs font-medium transition-colors hover:border-brand/40 hover:bg-brand-soft hover:text-brand"
                      >
                        {lang === "ar" ? c.name_ar : c.name_en}
                      </button>
                    ))}
                  </div>
                </Section>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-brand" />
        {title}
      </div>
      {children}
    </div>
  );
}

function Chips({ items, onPick }: { items: string[]; onPick: (s: string) => void }) {
  if (items.length === 0) return <p className="text-xs text-muted-foreground">—</p>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((s) => (
        <button
          key={s}
          onClick={() => onPick(s)}
          className="rounded-full border border-hairline px-3 py-1.5 text-xs font-medium transition-colors hover:border-brand/40 hover:bg-surface"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
