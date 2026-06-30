import { Mail, Headphones, Shield, LineChart, ShieldCheck, Settings } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

const CONTACTS = [
  {
    email: "owner@garhy.ai",
    title: { ar: "الاستفسارات العامة", en: "General inquiries" },
    desc: {
      ar: "للأسئلة العامة وطلبات المعلومات",
      en: "For general questions and information requests",
    },
    icon: Mail,
  },
  {
    email: "owner@garhy.ai",
    title: { ar: "قسم الأسواق", en: "Markets" },
    desc: {
      ar: "للشراكات التجارية وفرص السوق",
      en: "For business partnerships and market opportunities",
    },
    icon: LineChart,
  },
  {
    email: "owner@garhy.ai",
    title: { ar: "الدعم الفني", en: "Technical support" },
    desc: {
      ar: "مساعدة فنية للعملاء على مدار الساعة",
      en: "Round-the-clock technical assistance for customers",
    },
    icon: Headphones,
  },
  {
    email: "founder@garhy.ai",
    title: { ar: "الإدارة", en: "Management" },
    desc: {
      ar: "للتواصل المباشر مع الإدارة التنفيذية",
      en: "A direct line to executive management",
    },
    icon: Settings,
  },
  {
    email: "owner@garhy.ai",
    title: { ar: "الأمان والامتثال", en: "Security & compliance" },
    desc: {
      ar: "للإبلاغ عن مشكلات الأمان والخصوصية",
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
            {ar ? "مركز التواصل" : "Contact center"}
          </p>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            {ar ? "تواصل مع الفريق المناسب" : "Reach the right team"}
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            {ar
              ? "فرق متخصصة جاهزة لخدمتك على مدار الساعة. اختر القناة الأنسب لاستفسارك."
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
              {ar ? "دعم مؤسسي مخصص" : "Dedicated enterprise support"}
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {ar
                ? "فريق متخصص لإدارة حسابات الشركات والاحتياجات المؤسسية الكبيرة."
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
