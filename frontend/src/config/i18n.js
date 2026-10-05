import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector"; // 🔹 ajoute ce module

import en from "../locales/en.json";
import fr from "../locales/fr.json";
import ar from "../locales/ar.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      ar: { translation: ar },
    },
    fallbackLng: "en",
    interpolation: { escapeValue: false },

    detection: {
      order: ["localStorage", "navigator", "cookie", "htmlTag", "path", "subdomain"],
      caches: ["localStorage", "cookie"],
      lookupLocalStorage: "i18nextLng",
      lookupCookie: "i18next",
    },
  });

export default i18n;