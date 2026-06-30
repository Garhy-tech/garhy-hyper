import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";
import { AppProviders } from "@/components/providers";
import { WhatsAppFloat } from "@/components/common/whatsapp-float";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-gold">404</p>
        <h1 className="mt-4 font-display text-4xl font-semibold">Page not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          هذه الصفحة غير موجودة. The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            Home / الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">Please try refreshing the page.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Try again
          </button>
          <a href="/" className="rounded-md border border-input px-4 py-2 text-sm font-medium">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "GARHY | HYPER | كل ما تحتاجه في وجهة تسوق واحدة" },
      {
        name: "description",
        content: "اكتشف منتجات أصلية مختارة مع شحن سريع ودفع آمن ودعم احترافي.",
      },
      { property: "og:title", content: "GARHY | HYPER | كل ما تحتاجه في وجهة تسوق واحدة" },
      {
        property: "og:description",
        content: "اكتشف منتجات أصلية مختارة مع شحن سريع ودفع آمن ودعم احترافي.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "GARHY | HYPER" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "GARHY | HYPER | كل ما تحتاجه في وجهة تسوق واحدة" },
      {
        name: "twitter:description",
        content: "اكتشف منتجات أصلية مختارة مع شحن سريع ودفع آمن ودعم احترافي.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=Tajawal:wght@400;500;700;900&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  // suppressHydrationWarning on <html> because LangSync updates lang/dir
  // client-side via useEffect after hydration (i18n language detection).
  // Default to "en"/"ltr" to match the SSR i18n fallback language.
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AppProviders>
        <Outlet />
        <WhatsAppFloat />
        <MobileBottomNav />
      </AppProviders>
    </QueryClientProvider>
  );
}
