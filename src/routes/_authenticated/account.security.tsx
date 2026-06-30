import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, KeyRound, Smartphone, Monitor } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/_authenticated/account/security")({
  head: () => ({ meta: [{ title: "Security — GARHY | HYPER" }] }),
  component: SecurityPage,
});

function SecurityPage() {
  const { lang } = useLanguage();

  const rows = [
    {
      Icon: KeyRound,
      en: "Password",
      ar: "كلمة المرور",
      hint: lang === "ar" ? "آخر تحديث منذ 30 يوم" : "Last updated 30 days ago",
      action: lang === "ar" ? "تغيير" : "Change",
    },
    {
      Icon: Smartphone,
      en: "Two-factor authentication",
      ar: "التحقق بخطوتين",
      hint: lang === "ar" ? "غير مفعّل" : "Not enabled",
      action: lang === "ar" ? "تفعيل" : "Enable",
    },
    {
      Icon: Monitor,
      en: "Active sessions",
      ar: "الجلسات النشطة",
      hint: lang === "ar" ? "جهاز واحد" : "1 device",
      action: lang === "ar" ? "إدارة" : "Manage",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={lang === "ar" ? "الحساب" : "Account"}
        title={lang === "ar" ? "الأمان" : "Security"}
      />

      <FadeIn>
        <div className="flex items-center gap-4 rounded-2xl border border-hairline bg-gradient-to-r from-emerald-500/10 to-transparent p-5">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <div>
            <p className="font-display font-bold">
              {lang === "ar" ? "حسابك محمي" : "Your account is protected"}
            </p>
            <p className="text-xs text-muted-foreground">
              {lang === "ar"
                ? "نوصي بتفعيل التحقق بخطوتين لمزيد من الأمان."
                : "Enable two-factor authentication for extra security."}
            </p>
          </div>
        </div>
      </FadeIn>

      <Stagger className="space-y-3">
        {rows.map((r) => (
          <StaggerItem key={r.en}>
            <div className="flex items-center gap-4 rounded-2xl border border-hairline bg-card p-4 sm:p-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                <r.Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display font-bold">{lang === "ar" ? r.ar : r.en}</p>
                <p className="truncate text-xs text-muted-foreground">{r.hint}</p>
              </div>
              <button
                type="button"
                className="rounded-full border border-hairline px-3 py-1.5 text-xs font-semibold transition-colors hover:border-brand/40 hover:bg-brand-soft hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                {r.action}
              </button>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
