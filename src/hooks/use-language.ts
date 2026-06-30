import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { isRTL } from "@/lib/i18n";

export function useLanguage() {
  const { i18n, t } = useTranslation();
  const lang = i18n.language || "ar";
  const dir = isRTL(lang) ? "rtl" : "ltr";

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  const toggle = () => {
    const next = lang === "ar" ? "en" : "ar";
    i18n.changeLanguage(next);
  };

  return { lang, dir, t, toggle, setLang: i18n.changeLanguage.bind(i18n) };
}
