import { useTranslation } from "react-i18next";

/**
 * Selector de idioma como control segmentado.
 *
 * Antes eran banderas, y era un problema de fondo, no de estilo:
 *
 *  1. Una bandera es un país, no una lengua. El sitio mostraba la bandera de
 *     España para "español" en un portafolio costarricense, y la de Estados
 *     Unidos para un idioma que hablan cuarenta países más.
 *  2. Mostraba la bandera del idioma DESTINO, no del actual, así que no había
 *     forma de saber si significaba "estás aquí" o "haz clic para ir aquí".
 *  3. Un único botón que alterna esconde el estado: hay que deducirlo.
 *
 * Las dos opciones se ven siempre y la activa va marcada con aria-current, que
 * es lo que anuncia el lector de pantalla. Los nombres accesibles son autónimos
 * —"Español", "English"— y NO se traducen a propósito: quien busca inglés en
 * una página en español necesita encontrar "English", no "Inglés". El atributo
 * lang de cada botón hace que el lector pronuncie cada nombre en su idioma.
 */
const IDIOMAS = [
  { code: "es", corto: "ES", autonimo: "Español" },
  { code: "en", corto: "EN", autonimo: "English" },
];

export default function LanguageSwitch({ onChange, grande = false }) {
  const { i18n } = useTranslation();

  // resolvedLanguage, no language: i18n.js arranca con navigator.language, así
  // que un navegador en francés deja `language` en "fr" mientras el contenido
  // real cae al español por fallbackLng. Comparar contra `language` dejaría el
  // control sin ninguna opción marcada.
  const actual = i18n.resolvedLanguage || i18n.language;

  const seleccionar = (code) => {
    if (code === actual) return;
    i18n.changeLanguage(code);
    localStorage.setItem("lang", code);
    onChange?.(code);
  };

  return (
    <div
      role="group"
      aria-label={i18n.t("a11y.language")}
      className="inline-flex items-center overflow-hidden rounded-lg border
        border-light-border-strong dark:border-dark-border-strong font-mono"
    >
      {IDIOMAS.map(({ code, corto, autonimo }, i) => {
        const activo = code === actual;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            onClick={() => seleccionar(code)}
            aria-label={autonimo}
            aria-current={activo ? "true" : undefined}
            className={`${grande ? "px-4 py-3 text-sm" : "px-2.5 py-1.5 text-xs"}
              ${i > 0 ? "border-l border-light-border-strong dark:border-dark-border-strong" : ""}
              transition-colors duration-200 motion-reduce:transition-none
              ${activo
                ? "bg-light-accent text-white dark:bg-dark-accent dark:text-black font-medium"
                : "text-light-subtle dark:text-dark-subtle hover:text-light-text dark:hover:text-dark-text"}`}
          >
            {corto}
          </button>
        );
      })}
    </div>
  );
}
