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
// Se usa resolvedLanguage y no el `lng` del evento: con el navegador en un
// idioma sin traducción (p. ej. "fr") el contenido cae al español por
// fallbackLng, pero el atributo se quedaba en "fr" y el lector de pantalla
// leía español con fonética francesa. Justo lo que WCAG 3.1.1 evita.
const syncHtmlLang = () => {
  document.documentElement.lang = i18n.resolvedLanguage || i18n.language;
};

syncHtmlLang(i18n.language);
i18n.on("languageChanged", syncHtmlLang);

export default i18n;
