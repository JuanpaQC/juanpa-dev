import { useContext, useState, useEffect, useRef } from "react";
import { ThemeContext } from "../context/theme-context";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import LanguageToast from "../components/LanguageToast";
import LanguageSwitch from "../components/LanguageSwitch";
import ScrollProgress from "../components/ScrollProgress";

const SECCIONES = ["home", "about", "projects", "contact"];

// Curva de salida rápida: arranca de golpe y frena largo. Es la traducción a
// bezier del `power4.out` que usa el resto del sitio con GSAP, para que el menú
// no se mueva con una física distinta a todo lo demás.
const CURVA = [0.22, 1, 0.36, 1];

const VARIANTES_ITEM = {
  cerrado: { opacity: 0, y: -8 },
  abierto: { opacity: 1, y: 0 },
};

/**
 * Las tres barras que se convierten en aspa.
 *
 * No son dos iconos que se intercambian —así estaba, y por eso el cambio se
 * veía en seco—: son los mismos tres trazos moviéndose. Las de fuera van al
 * centro y giran, la de en medio se desvanece. El gesto explica lo que hace el
 * botón; un salto de glifo, no.
 */
function IconoMenu({ abierto }) {
  const trazo =
    "absolute left-0 block h-[2px] w-6 rounded-full bg-current " +
    "transition-transform duration-300 ease-out motion-reduce:transition-none";
  return (
    <span aria-hidden="true" className="relative block h-6 w-6">
      <span
        className={`${trazo} top-[6px] ${abierto ? "translate-y-[5px] rotate-45" : ""}`}
      />
      <span
        className={`absolute left-0 top-[11px] block h-[2px] w-6 rounded-full bg-current
          transition-opacity duration-200 ease-out motion-reduce:transition-none
          ${abierto ? "opacity-0" : "opacity-100"}`}
      />
      <span
        className={`${trazo} top-[16px] ${abierto ? "-translate-y-[5px] -rotate-45" : ""}`}
      />
    </span>
  );
}

export default function Navbar() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { t } = useTranslation();
  const [showNavbar, setShowNavbar] = useState(true);
  const [langChangedMsg, setLangChangedMsg] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [desplazado, setDesplazado] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState("home");
  const menosMovimiento = useReducedMotion();
  const botonMenuRef = useRef(null);

  // La posición anterior va en una ref, no en estado: como estado obligaba a
  // re-registrar el listener de scroll en cada evento y provocaba un render
  // por frame mientras se hacía scroll.
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const bajando = currentScrollY > lastScrollY.current;
      setShowNavbar(!(bajando && currentScrollY > 80));
      // Booleano, no un valor continuo: el plan pedía subir el desenfoque de 4
      // a 16 px de forma progresiva con el scroll, pero backdrop-filter obliga
      // a recomponer la capa entera en cada frame en el que cambia, y son 16 px
      // de blur sobre todo el ancho del navbar. Dos estados dan el mismo efecto
      // percibido y solo repintan dos veces en toda la página.
      setDesplazado(currentScrollY > 40);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sección visible. Con IntersectionObserver y no con la posición del scroll:
  // el estado solo cambia cuatro veces en toda la página, así que no hay un
  // render por frame.
  useEffect(() => {
    if (typeof IntersectionObserver !== "function") return;

    const observador = new IntersectionObserver(
      (entradas) => {
        const visible = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setSeccionActiva(visible.target.id);
      },
      // El margen superior descuenta el navbar: sin él, la sección que asoma
      // por debajo de la barra ya cuenta como activa.
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );

    const nodos = SECCIONES.map((id) => document.getElementById(id)).filter(
      Boolean,
    );
    for (const nodo of nodos) observador.observe(nodo);

    return () => observador.disconnect();
  }, []);

  // Escape cierra el menú y devuelve el foco al botón que lo abrió. Sin esto,
  // quien navega con teclado se queda dentro de un menú abierto sin salida
  // evidente, y el foco se pierde al final de la lista.
  useEffect(() => {
    if (!menuOpen) return;
    const alPulsarTecla = (evento) => {
      if (evento.key !== "Escape") return;
      setMenuOpen(false);
      botonMenuRef.current?.focus();
    };
    document.addEventListener("keydown", alPulsarTecla);
    return () => document.removeEventListener("keydown", alPulsarTecla);
  }, [menuOpen]);

  const avisarCambioIdioma = (lng) =>
    setLangChangedMsg(
      lng === "es"
        ? "Idioma cambiado a Español"
        : "Language switched to English",
    );

  return (
    <nav
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 w-[98%] md:w-[90%] lg:w-[80%] px-6 py-4 z-50 rounded-2xl shadow-xl transition-transform duration-300 ease-in-out
        text-light-text dark:text-dark-text border border-light-border dark:border-dark-border
        ${desplazado ? "backdrop-blur-xl bg-light-surface/90 dark:bg-dark-background/90" : "backdrop-blur-md bg-light-surface/80 dark:bg-dark-background/80"}
        motion-reduce:transition-none
        ${showNavbar || menuOpen ? "translate-y-0" : "-translate-y-[150%]"}`}
      style={{ boxShadow: "0 0 20px rgba(0, 246, 237, 0.1)" }}
    >
      <ScrollProgress />

      <div className="container mx-auto flex justify-between items-center gap-6">
        {/* El logotipo no es el encabezado de la página: era un segundo <h1> que
            competía con el del hero. Ahora es un enlace al inicio. */}
        <a
          href="#home"
          aria-label={t("a11y.homeLink")}
          className="font-mono text-xl lg:text-2xl tracking-[-0.01em] whitespace-nowrap"
        >
          <span
            aria-hidden="true"
            className="text-light-subtle dark:text-dark-subtle"
          >
            ~/
          </span>
          juanpaqc
        </a>

        {/* Botón Hamburguesa */}
        <div className="md:hidden">
          <button
            ref={botonMenuRef}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? t("a11y.closeMenu") : t("a11y.openMenu")}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            // `p-2 -m-2` agranda el área táctil sin mover nada: el icono mide
            // 24x24, por debajo de los 44x44 que recomienda WCAG 2.5.8 para un
            // objetivo de toque. El margen negativo devuelve el hueco.
            className="-m-2 p-2 text-light-text dark:text-dark-text"
          >
            <IconoMenu abierto={menuOpen} />
          </button>
        </div>

        {/* Opciones Desktop */}
        <ul className="hidden md:flex space-x-5 lg:space-x-6 items-center font-mono text-sm lg:text-base">
          {SECCIONES.map((id) => {
            const activa = seccionActiva === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                // aria-current es lo que convierte el subrayado en información:
                // sin él, quien usa lector de pantalla no tiene forma de saber
                // en qué sección está.
                aria-current={activa ? "true" : undefined}
                className="relative group whitespace-nowrap transition-colors duration-100 ease-in-out"
              >
                <span
                  className={`transition-colors duration-300 group-hover:text-light-accent dark:group-hover:text-dark-accent ${
                    activa ? "text-light-accent dark:text-dark-accent" : ""
                  }`}
                >
                  {t(`navbar.${id}`)}
                </span>
                <span
                  aria-hidden="true"
                  className={`absolute left-0 -bottom-1 h-0.5 bg-light-accent dark:bg-dark-accent transition-all duration-300 group-hover:w-full ${
                    activa ? "w-full" : "w-0"
                  }`}
                />
              </a>
            );
          })}

          <li className="flex items-center gap-3">
            <FaSun
              className={`text-yellow-400 transition-opacity ${darkMode ? "opacity-50" : "opacity-100"}`}
            />
            <button
              onClick={() => {
                const newMode = !darkMode;
                setDarkMode(newMode);
                localStorage.setItem("theme", newMode ? "dark" : "light");
              }}
              role="switch"
              aria-checked={darkMode}
              aria-label={t("a11y.toggleTheme")}
              className={`relative w-12 h-6 rounded-full transition-all duration-500 ease-in-out ${darkMode ? "bg-dark-accent" : "bg-light-border-strong"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all duration-500 ease-in-out ${darkMode ? "translate-x-6" : "translate-x-0"}`}
              />
            </button>
            <FaMoon
              className={`text-blue-300 transition-opacity ${darkMode ? "opacity-100" : "opacity-50"}`}
            />
            <LanguageSwitch onChange={avisarCambioIdioma} />
          </li>
        </ul>
      </div>

      {/* Menú móvil.
          Antes era `{menuOpen && <ul>}`: aparecía y desaparecía de golpe, sin
          transición. Ahora es el propio panel del navbar el que crece, y los
          enlaces entran detrás escalonados. Se anima el contenedor y no cada
          enlace por su cuenta a propósito: el navbar es una ventana flotante,
          así que tiene que leerse como un objeto que se abre, no como una lista
          que cae encima.

          Se desmonta al cerrar, con AnimatePresence para que la salida también
          se anime. Se probó a dejarlo montado con `inert`, y es peor: duplica
          en el DOM el interruptor de tema y el de idioma, que ya existen en el
          menú de escritorio. En el navegador no se solapan nunca porque uno de
          los dos está en `display:none` según el breakpoint, pero basta con que
          `inert` no esté soportado —Safari por debajo de 15.5— para tener dos
          controles con el mismo papel a la vez. Desmontar no depende de nada. */}
      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            key="menu-movil"
            id="mobile-menu"
            className="overflow-hidden md:hidden"
            initial="cerrado"
            animate="abierto"
            exit="cerrado"
            variants={{
              abierto: {
                height: "auto",
                transition: menosMovimiento
                  ? { duration: 0 }
                  : {
                      duration: 0.34,
                      ease: CURVA,
                      staggerChildren: 0.045,
                      delayChildren: 0.06,
                    },
              },
              cerrado: {
                height: 0,
                transition: menosMovimiento
                  ? { duration: 0 }
                  : {
                      duration: 0.28,
                      ease: CURVA,
                      staggerChildren: 0.03,
                      staggerDirection: -1,
                    },
              },
            }}
          >
            <ul className="flex flex-col space-y-4 px-4 pt-4 pb-1 text-light-text dark:text-dark-text">
              {SECCIONES.map((id) => (
                // Un <li> por enlace: antes los <a> colgaban directamente del <ul>,
                // que es HTML inválido y hace que el árbol de accesibilidad no
                // cuente bien los elementos de la lista.
                <motion.li
                  key={id}
                  variants={menosMovimiento ? undefined : VARIANTES_ITEM}
                >
                  <a
                    href={`#${id}`}
                    aria-current={seccionActiva === id ? "true" : undefined}
                    className={`block text-lg font-semibold ${
                      seccionActiva === id
                        ? "text-light-accent dark:text-dark-accent"
                        : ""
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {t(`navbar.${id}`)}
                  </a>
                </motion.li>
              ))}
              <motion.li
                variants={menosMovimiento ? undefined : VARIANTES_ITEM}
                className="flex items-center gap-3 pt-1"
              >
                <FaSun
                  aria-hidden="true"
                  className={`text-yellow-400 transition-opacity ${darkMode ? "opacity-50" : "opacity-100"}`}
                />
                <button
                  onClick={() => {
                    const newMode = !darkMode;
                    setDarkMode(newMode);
                    localStorage.setItem("theme", newMode ? "dark" : "light");
                  }}
                  role="switch"
                  aria-checked={darkMode}
                  aria-label={t("a11y.toggleTheme")}
                  className={`relative w-12 h-6 rounded-full transition-all duration-500 ease-in-out ${darkMode ? "bg-dark-accent" : "bg-light-border-strong"}`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all duration-500 ease-in-out ${darkMode ? "translate-x-6" : "translate-x-0"}`}
                  />
                </button>
                <FaMoon
                  aria-hidden="true"
                  className={`text-blue-300 transition-opacity ${darkMode ? "opacity-100" : "opacity-50"}`}
                />
                <LanguageSwitch onChange={avisarCambioIdioma} grande />
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Región permanente para el cambio de idioma, por el mismo motivo. */}
      <div role="status" aria-live="polite" className="sr-only">
        {langChangedMsg}
      </div>

      <AnimatePresence>
        {langChangedMsg && (
          <LanguageToast
            message={langChangedMsg}
            onClose={() => setLangChangedMsg("")}
          />
        )}
      </AnimatePresence>
    </nav>
  );
}
