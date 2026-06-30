import { Mail, Headphones, Shield, LineChart, ShieldCheck, Settings } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

const CONTACTS = [
  {
    email: "owner@garhy.ai",
    title: { ar: "ط§ظ„ط§ط³طھظپط³ط§ط±ط§طھ ط§ظ„ط¹ط§ظ…ط©", en: "General inquiries" },
    desc: {
      ar: "ظ„ظ„ط£ط³ط¦ظ„ط© ط§ظ„ط¹ط§ظ…ط© ظˆط·ظ„ط¨ط§طھ ط§ظ„ظ…ط¹ظ„ظˆظ…ط§طھ",
      en: "For general questions and information requests",
    },
    icon: Mail,
  },
  {
    email: "owner@garhy.ai",
    title: { ar: "ظ‚ط³ظ… ط§ظ„ط£ط³ظˆط§ظ‚", en: "Markets" },
    desc: {
      ar: "ظ„ظ„ط´ط±ط§ظƒط§طھ ط§ظ„طھط¬ط§ط±ظٹط© ظˆظپط±طµ ط§ظ„ط³ظˆظ‚",
      en: "For business partnerships and market opportunities",
    },
    icon: LineChart,
  },
  {
    email: "owner@garhy.ai",
    title: { ar: "ط§ظ„ط¯ط¹ظ… ط§ظ„ظپظ†ظٹ", en: "Technical support" },
    desc: {
      ar: "ظ…ط³ط§ط¹ط¯ط© ظپظ†ظٹط© ظ„ظ„ط¹ظ…ظ„ط§ط، ط¹ظ„ظ‰ ظ…ط¯ط§ط± ط§ظ„ط³ط§ط¹ط©",
      en: "Round-the-clock technical assistance for customers",
    },
    icon: Headphones,
  },
  {
    email: "founder@garhy.ai",
    title: { ar: "ط§ظ„ط¥ط¯ط§ط±ط©", en: "Management" },
    desc: {
      ar: "ظ„ظ„طھظˆط§طµظ„ ط§ظ„ظ…ط¨ط§ط´ط± ظ…ط¹ ط§ظ„ط¥ط¯ط§ط±ط© ط§ظ„طھظ†ظپظٹط°ظٹط©",
      en: "A direct line to executive management",
    },
    icon: Settings,
  },
  {
    email: "owner@garhy.ai",
    title: { ar: "ط§ظ„ط£ظ…ط§ظ† ظˆط§ظ„ط§ظ…طھط«ط§ظ„", en: "Security & compliance" },
    desc: {
      ar: "ظ„ظ„ط¥ط¨ظ„ط§ط؛ ط¹ظ† ظ…ط´ظƒظ„ط§طھ ط§ظ„ط£ظ…ط§ظ† ظˆط§ظ„ط®طµظˆطµظٹط©",
      en: "To report security and privacy issues",
    },
    icon: ShieldCheck,
  },
];

export function ContactCenter() {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  return (
    <section className="border-t border-hairline bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand">
            {ar ? "ظ…ط±ظƒط² ط§ظ„طھظˆط§طµظ„" : "Contact center"}
          </p>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            {ar ? "طھظˆط§طµظ„ ظ…ط¹ ط§ظ„ظپط±ظٹظ‚ ط§ظ„ظ…ظ†ط§ط³ط¨" : "Reach the right team"}
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            {ar
              ? "ظپط±ظ‚ ظ…طھط®طµطµط© ط¬ط§ظ‡ط²ط© ظ„ط®ط¯ظ…طھظƒ ط¹ظ„ظ‰ ظ…ط¯ط§ط± ط§ظ„ط³ط§ط¹ط©. ط§ط®طھط± ط§ظ„ظ‚ظ†ط§ط© ط§ظ„ط£ظ†ط³ط¨ ظ„ط§ط³طھظپط³ط§ط±ظƒ."
              : "Dedicated teams ready around the clock. Pick the channel that best fits your inquiry."}
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CONTACTS.map(({ email, title, desc, icon: Icon }) => (
            <a
              key={email}
              href={`mailto:${email}`}
              className="group relative overflow-hidden rounded-2xl border border-hairline bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold">{ar ? title.ar : title.en}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{ar ? desc.ar : desc.en}</p>
              <p
                className="mt-4 text-sm font-semibold text-brand transition-colors group-hover:text-cyan-accent"
                dir="ltr"
              >
                {email}
              </p>
            </a>
          ))}
          <div className="relative overflow-hidden rounded-2xl border border-brand/20 bg-gradient-to-br from-brand-soft to-transparent p-6">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-brand-foreground">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-bold">
              {ar ? "ط¯ط¹ظ… ظ…ط¤ط³ط³ظٹ ظ…ط®طµطµ" : "Dedicated enterprise support"}
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {ar
                ? "ظپط±ظٹظ‚ ظ…طھط®طµطµ ظ„ط¥ط¯ط§ط±ط© ط­ط³ط§ط¨ط§طھ ط§ظ„ط´ط±ظƒط§طھ ظˆط§ظ„ط§ط­طھظٹط§ط¬ط§طھ ط§ظ„ظ…ط¤ط³ط³ظٹط© ط§ظ„ظƒط¨ظٹط±ط©."
                : "A specialized team for corporate accounts and large enterprise needs."}
            </p>
            <a
              href="mailto:founder@garhy.ai"
              className="mt-4 inline-block rounded-md text-sm font-semibold text-brand transition-colors hover:text-cyan-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              dir="ltr"
            >
              founder@garhy.ai
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

