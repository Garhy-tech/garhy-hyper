import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { ar } from "./locales/ar";
import { en } from "./locales/en";

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        ar: { translation: ar },
        en: { translation: en },
      },
      // Force the initial language to "en" on BOTH server and client so the
      // first (hydrating) render is identical and React doesn't throw a
      // hydration mismatch. The user's preferred language (localStorage /
      // navigator) is applied AFTER hydration in LangSync via the detector.
      fallbackLng: "en",
      lng: "en",
      supportedLngs: ["ar", "en"],
      interpolation: { escapeValue: false },
      initAsync: false,
      detection: {
        order: ["localStorage", "navigator"],
        lookupLocalStorage: "rw_lang",
        caches: ["localStorage"],
      },
    });
}

export default i18n;
export const RTL_LANGS = ["ar"];
export const isRTL = (lng: string) => RTL_LANGS.includes(lng);
