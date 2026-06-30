import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ContactCenter } from "@/components/common/contact-center";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — GARHY | HYPER" },
      {
        name: "description",
        content: "Reach the right GARHY | HYPER team through the channel that fits your inquiry.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { lang } = useLanguage();
  const ar = lang === "ar";
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <div className="border-b border-hairline bg-gradient-to-b from-brand-soft/50 to-background">
          <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand">
              {ar ? "مركز التواصل" : "Contact center"}
            </p>
            <h1 className="font-display text-4xl font-extrabold sm:text-5xl">
              {ar ? "نحن هنا لمساعدتك" : "We’re here to help"}
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              {ar
                ? "فرق متخصصة جاهزة لخدمتك في جميع الأوقات."
                : "Dedicated teams ready to serve you at any time."}
            </p>
          </div>
        </div>
        <ContactCenter />
      </main>
      <SiteFooter />
    </div>
  );
}
