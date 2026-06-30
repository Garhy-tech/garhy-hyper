import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/use-language";

// Returns the next occurrence of midnight local time
function nextMidnight() {
  const d = new Date();
  d.setHours(24, 0, 0, 0);
  return d.getTime();
}

export function FlashCountdown() {
  const { t } = useLanguage();
  const [target] = useState(nextMidnight);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, []);

  const diff = Math.max(0, target - now);
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-hairline bg-card px-3 py-2 shadow-soft sm:px-4 sm:py-3">
      <span className="hidden text-xs font-semibold text-muted-foreground sm:inline">
        {t("flash.endsIn")}
      </span>
      <div className="flex items-center gap-1" dir="ltr" aria-live="polite">
        {[pad(h), pad(m), pad(s)].map((v, i) => (
          <span
            key={i}
            suppressHydrationWarning
            className="grid h-8 w-9 place-items-center rounded-lg bg-foreground font-display text-xs font-bold tabular-nums text-background sm:h-9 sm:w-10 sm:text-sm"
          >
            {v}
          </span>
        ))}
      </div>
    </div>
  );
}

