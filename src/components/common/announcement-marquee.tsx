import { Sparkles, Truck, Tag, ShieldCheck, Globe2, Flame } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

const ICONS = [Sparkles, Truck, Tag, ShieldCheck, Globe2, Flame];

export function AnnouncementMarquee() {
  const { t, dir } = useLanguage();
  const messages = [
    t("marquee.m1"),
    t("marquee.m2"),
    t("marquee.m3"),
    t("marquee.m4"),
    t("marquee.m5"),
    t("marquee.m6"),
  ];
  // Duplicate for seamless infinite loop
  const loop = [...messages, ...messages];

  return (
    <div
      className="group relative overflow-hidden bg-gradient-to-r from-brand via-brand to-cyan-accent text-white"
      role="region"
      aria-label="Announcements"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-brand to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-cyan-accent to-transparent" />
      <div
        className="marquee-track flex w-max items-center gap-10 whitespace-nowrap py-2 text-[11px] font-medium sm:text-xs"
        style={{ animationDirection: dir === "rtl" ? "reverse" : "normal" }}
      >
        {loop.map((msg, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <span key={i} className="inline-flex shrink-0 items-center gap-2">
              <Icon className="h-3.5 w-3.5 opacity-90" aria-hidden />
              <span>{msg}</span>
              <span className="mx-2 h-1 w-1 rounded-full bg-white/50" aria-hidden />
            </span>
          );
        })}
      </div>
    </div>
  );
}

