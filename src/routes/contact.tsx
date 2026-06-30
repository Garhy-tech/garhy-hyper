import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ContactCenter } from "@/components/common/contact-center";
import { useLanguage } from "@/hooks/use-language";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact â€” GARHY | HYPER" },
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
              {ar ? "ظ…ط±ظƒط² ط§ظ„طھظˆط§طµظ„" : "Contact center"}
            </p>
            <h1 className="font-display text-4xl font-extrabold sm:text-5xl">
              {ar ? "ظ†ط­ظ† ظ‡ظ†ط§ ظ„ظ…ط³ط§ط¹ط¯طھظƒ" : "Weâ€™re here to help"}
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              {ar
                ? "ظپط±ظ‚ ظ…طھط®طµطµط© ط¬ط§ظ‡ط²ط© ظ„ط®ط¯ظ…طھظƒ ظپظٹ ط¬ظ…ظٹط¹ ط§ظ„ط£ظˆظ‚ط§طھ."
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

