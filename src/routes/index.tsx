import { createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/layout/site-header";
import { HeroSlider } from "@/components/home/hero-slider";
import { FlashCountdown } from "@/components/home/flash-countdown";
import { SiteFooter } from "@/components/layout/site-footer";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <SiteHeader />

      <main className="min-h-screen bg-background">
        <HeroSlider />

        <section className="mx-auto max-w-7xl px-4 py-10">
          <FlashCountdown />
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16">
          <div className="rounded-3xl border border-hairline bg-card p-10 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
              GARHY | HYPER
            </p>

            <h2 className="mt-4 font-display text-4xl font-bold">
              Enterprise AI Commerce Platform
            </h2>

            <p className="mt-6 max-w-3xl text-muted-foreground">
              Welcome to GARHY | HYPER.
              This homepage is now connected to the real project instead of the
              maintenance page. In the next steps we will build Featured
              Categories, Flash Deals, Best Sellers, AI Recommendations,
              Featured Brands and the complete enterprise marketplace experience.
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
