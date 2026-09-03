import { useContext, useState, useEffect, useRef } from "react";
import { ThemeContext } from "../context/theme-context";
import { FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import LanguageToast from "../components/LanguageToast";

export default function Navbar() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const [showNavbar, setShowNavbar] = useState(true);
  const [langChangedMsg, setLangChangedMsg] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  // La posición anterior va en una ref, no en estado: como estado obligaba a
  // re-registrar el listener de scroll en cada evento y provocaba un render
  // por frame mientras se hacía scroll.
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const bajando = currentScrollY > lastScrollY.current;
      setShowNavbar(!(bajando && currentScrollY > 80));
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === "es" ? "en" : "es";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
    setLangChangedMsg(newLang === "es" ? "Idioma cambiado a Español" : "Language switched to English");
  };

  return (
    <nav
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 w-[98%] md:w-[90%] lg:w-[80%] px-6 py-4 z-50 rounded-2xl shadow-xl transition-transform duration-300 ease-in-out
        text-light-text dark:text-dark-text border border-light-border dark:border-dark-border
        backdrop-blur-md bg-light-surface/80 dark:bg-dark-background/80
        motion-reduce:transition-none
        ${showNavbar || menuOpen ? "translate-y-0" : "-translate-y-[150%]"}`}
      style={{ boxShadow: '0 0 20px rgba(0, 246, 237, 0.1)' }}
    >
      <div className="container mx-auto flex justify-between items-center gap-6">
        {/* El logotipo no es el encabezado de la página: era un segundo <h1> que
            competía con el del hero. Ahora es un enlace al inicio. */}
        <a
          href="#home"
          aria-label={t("a11y.homeLink")}
          className="font-mono text-xl lg:text-2xl tracking-[-0.01em] whitespace-nowrap"
        >
          <span aria-hidden="true" className="text-light-subtle dark:text-dark-subtle">~/</span>juanpaqc
        </a>

        {/* Botón Hamburguesa */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? t("a11y.closeMenu") : t("a11y.openMenu")}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="text-black dark:text-white"
          >
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Opciones Desktop */}
        <ul className="hidden md:flex space-x-5 lg:space-x-6 items-center font-mono text-sm lg:text-base">
          {['home', 'about', 'projects', 'contact'].map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="relative group whitespace-nowrap transition-colors duration-100 ease-in-out"
            >
              <span className="group-hover:text-light-accent dark:group-hover:text-dark-accent transition-colors duration-300">{t(`navbar.${id}`)}</span>
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-light-accent dark:bg-dark-accent transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}

          <li className="flex items-center gap-3">
            <FaSun className={`text-yellow-400 transition-opacity ${darkMode ? 'opacity-50' : 'opacity-100'}`} />
            <button
              onClick={() => {
                const newMode = !darkMode;
                setDarkMode(newMode);
                localStorage.setItem("theme", newMode ? "dark" : "light");
              }}
              role="switch"
              aria-checked={darkMode}
              aria-label={t("a11y.toggleTheme")}
              className={`relative w-12 h-6 rounded-full transition-all duration-500 ease-in-out ${darkMode ? 'bg-dark-accent' : 'bg-light-border-strong'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all duration-500 ease-in-out ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <FaMoon className={`text-blue-300 transition-opacity ${darkMode ? 'opacity-100' : 'opacity-50'}`} />
            <button
              onClick={toggleLanguage}
              aria-label={i18n.language === "es" ? "Switch to English" : "Cambiar a español"}
              className="ml-1 hover:scale-110 transition-transform duration-300"
            >
              <img
                src={i18n.language === "es" ? "/flags/us.png" : "/flags/es.png"}
                alt={i18n.language === "es" ? "Switch to English" : "Cambiar a español"}
                className="w-6 h-6 rounded-full border border-light-accent dark:border-dark-accent shadow-sm"
              />
            </button>
          </li>
        </ul>
      </div>

      {/* Menú Móvil */}
      {menuOpen && (
        <ul id="mobile-menu" className="flex flex-col space-y-4 mt-4 px-4 md:hidden text-black dark:text-white">
          {['home', 'about', 'projects', 'contact'].map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="text-lg font-semibold"
              onClick={() => setMenuOpen(false)}
            >
              {t(`navbar.${id}`)}
            </a>
          ))}
          <li className="flex items-center gap-3">
            <FaSun className={`text-yellow-400 transition-opacity ${darkMode ? 'opacity-50' : 'opacity-100'}`} />
            <button
              onClick={() => {
                const newMode = !darkMode;
                setDarkMode(newMode);
                localStorage.setItem("theme", newMode ? "dark" : "light");
              }}
              role="switch"
              aria-checked={darkMode}
              aria-label={t("a11y.toggleTheme")}
              className={`relative w-12 h-6 rounded-full transition-all duration-500 ease-in-out ${darkMode ? 'bg-dark-accent' : 'bg-light-border-strong'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all duration-500 ease-in-out ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <FaMoon className={`text-blue-300 transition-opacity ${darkMode ? 'opacity-100' : 'opacity-50'}`} />
            <button
              onClick={toggleLanguage}
              aria-label={i18n.language === "es" ? "Switch to English" : "Cambiar a español"}
              className="ml-1 hover:scale-110 transition-transform duration-300"
            >
              <img
                src={i18n.language === "es" ? "/flags/us.png" : "/flags/es.png"}
                alt={i18n.language === "es" ? "Switch to English" : "Cambiar a español"}
                className="w-6 h-6 rounded-full border border-light-accent dark:border-dark-accent shadow-sm"
              />
            </button>
          </li>
        </ul>
      )}

      <AnimatePresence>
        {langChangedMsg && (
          <LanguageToast message={langChangedMsg} onClose={() => setLangChangedMsg("")} />
        )}
      </AnimatePresence>
    </nav>
  );
}
