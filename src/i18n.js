import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en/translation.json";
import es from "./locales/es/translation.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    lng: localStorage.getItem("lang") || navigator.language.split("-")[0] || "es",
    fallbackLng: "es",
    
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
