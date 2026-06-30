import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import i18n from "@/lib/i18n";
import { useLanguage } from "@/hooks/use-language";
import { Toaster } from "@/components/ui/sonner";
import { CommerceProvider } from "@/contexts/commerce-context";
import { CartDrawer } from "@/components/commerce/cart-drawer";
import { FlyToCart } from "@/components/commerce/fly-to-cart";

function LangSync({ children }: { children: ReactNode }) {
  const { lang, dir } = useLanguage();

  // SSR + the first client render are both "en" (see i18n.ts) so hydration
  // matches. Once mounted, apply the user's detected/stored language.
  useEffect(() => {
    const detector = i18n.services?.languageDetector as
      | { detect?: () => string | string[] | undefined }
      | undefined;
    const detected = detector?.detect?.();
    const raw = Array.isArray(detected) ? detected[0] : detected;
    // Normalize regional locales (e.g. "ar-OM", "en-US") to the base language.
    const target = raw?.split("-")[0];
    if (target && (target === "ar" || target === "en") && target !== i18n.language) {
      void i18n.changeLanguage(target);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);
  return <>{children}</>;
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <MotionConfig reducedMotion="user">
        <LangSync>
          <CommerceProvider>
            {children}
            <CartDrawer />
            <FlyToCart />
            <Toaster richColors position="top-center" />
          </CommerceProvider>
        </LangSync>
      </MotionConfig>
    </ThemeProvider>
  );
}


