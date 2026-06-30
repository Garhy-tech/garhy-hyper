import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Mail, MessageCircle, Phone, Twitter } from "lucide-react";
import { Logo } from "@/components/common/logo";
import { useLanguage } from "@/hooks/use-language";

export function SiteFooter() {
  const { t } = useLanguage();
  // suppressHydrationWarning used on the year span below because the year
  // value from new Date() can differ between SSR and client on timezone boundaries.
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-hairline bg-surface/60">
      {/* Trust strip */}
      <div className="border-b border-hairline bg-background">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 sm:grid-cols-4 sm:px-6 lg:px-8">
          {[
            t("home.trustAuthentic"),
            t("home.trustShipping"),
            t("home.trustPayment"),
            t("home.trustSupport"),
          ].map((label) => (
            <div
              key={label}
              className="flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground sm:text-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              {label}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {t("footer.brandPitch")}
          </p>
          <div className="mt-5 space-y-2 text-sm">
            <a
              href="mailto:owner@garhy.ai"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              dir="ltr"
            >
              <Mail className="h-4 w-4 text-brand" /> owner@garhy.ai
            </a>
            <a
              href="tel:+96801222339088"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              dir="ltr"
            >
              <Phone className="h-4 w-4 text-brand" /> +968 76 454 193
            </a>
            <a
              href="https://wa.me/96801222339088"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              dir="ltr"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" /> WhatsApp
            </a>
          </div>
          <div className="mt-5 flex gap-2">
            {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="social"
                className="grid h-9 w-9 place-items-center rounded-full border border-hairline text-muted-foreground transition-all hover:border-brand hover:text-brand"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <FooterColumn title={t("footer.shop")}>
          <FooterLink to="/catalog">{t("nav.categories")}</FooterLink>
          <FooterLink to="/catalog">{t("nav.offers")}</FooterLink>
          <FooterLink to="/catalog">{t("nav.brands")}</FooterLink>
          <FooterLink to="/search">{t("nav.search")}</FooterLink>
        </FooterColumn>

        <FooterColumn title={t("footer.service")}>
          <FooterLink to="/account">{t("account.overview")}</FooterLink>
          <FooterLink to="/account/orders">{t("account.orders")}</FooterLink>
          <FooterLink to="/wishlist">{t("nav.wishlist")}</FooterLink>
          <FooterLink to="/contact">{t("footer.contact")}</FooterLink>
        </FooterColumn>

        <FooterColumn title={t("footer.policies")}>
          <span className="text-sm text-muted-foreground">{t("footer.privacy")}</span>
          <span className="text-sm text-muted-foreground">{t("footer.terms")}</span>
          <span className="text-sm text-muted-foreground">{t("footer.returns")}</span>
          <span className="text-sm text-muted-foreground">{t("footer.shipping")}</span>
        </FooterColumn>
      </div>

      <div className="border-t border-hairline">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <span suppressHydrationWarning>
            © {year} GARHY | HYPER. {t("footer.rights")}.
          </span>
          <span>Powered by GIS OrbitX</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-foreground">
        {title}
      </h4>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
      {children}
    </Link>
  );
}
