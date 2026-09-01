import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { AnimatePresence } from "framer-motion";
import LanguageToast from "../components/LanguageToast";

export default function Navbar() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [langChangedMsg, setLangChangedMsg] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const toggleLanguage = () => {
    const newLang = i18n.language === "es" ? "en" : "es";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
    setLangChangedMsg(newLang === "es" ? "Idioma cambiado a Español" : "Language switched to English");
  };

  return (
    <nav
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 w-[98%] md:w-[90%] lg:w-[80%] px-6 py-4 z-50 rounded-2xl shadow-xl transition-all duration-100 ease-in-out
        text-light-text dark:text-dark-text border border-light-border dark:border-dark-border
        backdrop-blur-md bg-light-surface/80 dark:bg-dark-background/80`}
      style={{ boxShadow: '0 0 20px rgba(0, 246, 237, 0.1)' }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl md:text-4xl tracking-tight">Juanpa.dev</h1>

        {/* Botón Hamburguesa */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-black dark:text-white">
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Opciones Desktop */}
        <ul className="hidden md:flex space-x-6 items-center font-pixel text-lg md:text-xl">
          {['home', 'about', 'projects', 'contact'].map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="relative group transition-colors duration-100 ease-in-out"
            >
              <span className="group-hover:text-dark-accent transition-colors duration-300">{t(`navbar.${id}`)}</span>
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-dark-accent transition-all duration-300 group-hover:w-full"></span>
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
              className={`relative w-12 h-6 rounded-full transition-all duration-500 ease-in-out ${darkMode ? 'bg-dark-accent' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all duration-500 ease-in-out ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <FaMoon className={`text-blue-300 transition-opacity ${darkMode ? 'opacity-100' : 'opacity-50'}`} />
            <button onClick={toggleLanguage} className="ml-1 hover:scale-110 transition-transform duration-300">
              <img
                src={i18n.language === "es" ? "/flags/us.png" : "/flags/es.png"}
                alt={i18n.language === "es" ? "Switch to English" : "Cambiar a español"}
                className="w-6 h-6 rounded-full border border-dark-accent shadow-sm"
              />
            </button>
          </li>
        </ul>
      </div>

      {/* Menú Móvil */}
      {menuOpen && (
        <ul className="flex flex-col space-y-4 mt-4 px-4 md:hidden text-black dark:text-white">
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
              className={`relative w-12 h-6 rounded-full transition-all duration-500 ease-in-out ${darkMode ? 'bg-dark-accent' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all duration-500 ease-in-out ${darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <FaMoon className={`text-blue-300 transition-opacity ${darkMode ? 'opacity-100' : 'opacity-50'}`} />
            <button onClick={toggleLanguage} className="ml-1 hover:scale-110 transition-transform duration-300">
              <img
                src={i18n.language === "es" ? "/flags/us.png" : "/flags/es.png"}
                alt={i18n.language === "es" ? "Switch to English" : "Cambiar a español"}
                className="w-6 h-6 rounded-full border border-dark-accent shadow-sm"
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
