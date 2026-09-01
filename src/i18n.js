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

// El atributo lang del <html> tiene que seguir al idioma real de la interfaz:
// sin esto un lector de pantalla lee el español con pronunciación inglesa (WCAG 3.1.1).
const syncHtmlLang = (lng) => {
  document.documentElement.lang = lng;
};

syncHtmlLang(i18n.language);
i18n.on("languageChanged", syncHtmlLang);

export default i18n;
