import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  FaReact,
  FaHtml5,
  FaCss3Alt,
  FaNodeJs,
  FaGithub,
  FaJsSquare,
} from "react-icons/fa";
import {
  SiFirebase,
  SiTailwindcss,
  SiExpo,
  SiFramer,
  SiNetlify
} from "react-icons/si";
import { useTranslation } from "react-i18next";
import ProjectCard3D from "./ProjectCard3D";
import MacWindow from "./MacWindow";
import FloatingParticles from "./FloatingParticles";
import useReveal from "../hooks/useReveal";
import { gsap, menosMovimiento, medible } from "../lib/motion";

const techIcons = {
  "React Native": <FaReact className="text-cyan-400 text-2xl" />,
  React: <FaReact className="text-cyan-400 text-2xl" />,
  Firebase: <SiFirebase className="text-yellow-400 text-2xl" />,
  Tailwind: <SiTailwindcss className="text-sky-400 text-2xl" />,
  Expo: <SiExpo className="text-light-text dark:text-white text-2xl" />,
  Netlify : <SiNetlify className="text-cyan-400 text-2xl" />,
  "Framer Motion": <SiFramer className="text-fuchsia-500 text-2xl" />,
  JavaScript: <FaJsSquare className="text-yellow-300 text-2xl" />,
  CSS: <FaCss3Alt className="text-blue-500 text-2xl" />,
  HTML: <FaHtml5 className="text-orange-500 text-2xl" />,
  Node: <FaNodeJs className="text-green-500 text-2xl" />,
};

export default function ProjectsWithFilter() {
  const { t } = useTranslation();
  const menosMovimientoFM = useReducedMotion();
  const tituloRef = useRef(null);
  const rejillaRef = useRef(null);

  const categories = [
    { key: "all", label: t("projects.type.all") },
    { key: "academic", label: t("projects.type.academic") },
    { key: "freelance", label: t("projects.type.freelance") },
    { key: "personal", label: t("projects.type.personal") },
  ];

  // `link: null` oculta el botón "Ver Proyecto" de la tarjeta.
  // Los tres apuntaban a marcadores de posición de plantilla
  // (github.com/tuusuario/..., tusitioweb.netlify.app) que devolvían 404.
  // Para publicar uno: sustituir null por la URL real del repo o de la demo.
  // `link: null` oculta el botón de la tarjeta. Se sustituye por la URL real
  // (repo o demo) cuando el proyecto sea público.
  // AgroClass va primera. Antes iba AgriVision, con el argumento de que su
  // motor de sincronización es la pieza técnica más difícil; lo sigue siendo,
  // pero el orden lo manda el proyecto más grande y más avanzado, y ese es
  // AgroClass. Es también el que se cuenta entero en la sección destacada.
  const allProjects = [
    {
      key: "agroclass",
      tech: ["React Native", "Expo", "Node", "Firebase"],
      file: "agroclass/survey/Flow.jsx",
      link: null, // TODO: repo o demo de AgroClass
      type: "academic",
      // Estaba en 1 (desarrollo). Lo subo a 2 porque Juanpa dice que está más
      // avanzado que AgriVision, que ya estaba en 2. Es su dato, no una
      // medición: si el estado real es otro, este es el número que hay que
      // cambiar.
      statusIndex: 2,
    },
    {
      key: "agrivision",
      tech: ["React Native", "Expo", "Firebase", "Jest"],
      file: "agrivision/sync/resolver.js",
      link: null, // TODO: repo o demo de AgriVision
      type: "academic",
      statusIndex: 2,
    },
    {
      key: "instaladores",
      tech: ["React", "Tailwind", "Netlify"],
      file: "instaladores/index.jsx",
      link: null, // TODO: URL del sitio del cliente
      type: "freelance",
      statusIndex: 2,
    },
    {
      key: "portfolio",
      tech: ["React", "Framer Motion", "Tailwind"],
      file: "juanpaqc/Hero.jsx",
      link: "https://github.com/JuanpaQC/juanpa-dev",
      type: "personal",
      statusIndex: 2,
    },
  ];

  const [activeCategory, setActiveCategory] = useState("all");

  // El título entra grande y se asienta al acercarse a su sitio. Va con scrub
  // porque el efecto es precisamente que el usuario lo "coloque" con el scroll;
  // el `end` se cierra al 45% del viewport para que termine mucho antes de que
  // la sección se acabe y nunca se quede a medio camino.
  //
  // Solo escala, sin opacidad. Un scrub no tiene estado final garantizado: si
  // alguien suelta el scroll a media animación, ese valor intermedio se queda
  // ahí de forma indefinida, así que es el estado que hay que auditar. Con el
  // 0.3 de opacidad que había aquí antes, ese estado daba 2.39:1 en oscuro y
  // 1.72:1 en claro, cuando el umbral para texto grande es 3:1 (medido sobre
  // #E5E5E5/#0D1B2A y #3A3A2D/#F5F0E6). La sensación de "colocar el título"
  // la da la escala; la opacidad solo aportaba el riesgo.
  useEffect(() => {
    const el = tituloRef.current;
    if (!el || menosMovimiento() || !medible(el)) return;

    const tween = gsap.fromTo(
      el,
      { scale: 1.35 },
      {
        scale: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          end: "top 45%",
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(el, { clearProps: "transform" });
    };
  }, []);

  // `revision` cuelga del filtro: al cambiar de categoría el grid monta nodos
  // nuevos que el efecto anterior nunca vio, y sin rehacerlo entrarían de golpe.
  useReveal(rejillaRef, {
    y: 60,
    rotacionX: 6,
    // 0.06 y 0.55, no 0.12 y 0.7: con los valores anteriores la última tarjeta
    // de la fila terminaba de aparecer a 0.7 + 3x0.12 = 1.06 s desde que entra
    // en pantalla. Por encima de un segundo la animación deja de leerse como
    // cuidado y empieza a leerse como carga lenta. Ahora la última cierra en
    // 0.55 + 3x0.06 = 0.73 s.
    stagger: 0.06,
    duracion: 0.55,
    start: "top 88%",
    // Un disparador por tarjeta: la rejilla es más alta que la pantalla y con
    // un solo disparador en el contenedor la segunda fila terminaba de animarse
    // antes de que nadie la viera.
    porElemento: true,
    revision: activeCategory,
  });

  const filteredProjects =
    activeCategory === "all"
      ? allProjects
      : allProjects.filter((project) => project.type === activeCategory);

  // Antes estaban clavadas en español: con la interfaz en inglés el resto de la
  // tarjeta se traducía y estas tres no.
  const stages = ["design", "development", "production"];
  const colors = ["bg-[#22C55E]", "bg-[#EAB308]", "bg-[#3B82F6]"];

  return (
    <section
      id="projects"
      className="scroll-mt-32 relative overflow-hidden bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text px-6 py-20"
    >
      {/* Mismo recurso que en About: algo que se mueve más despacio por detrás
          para que la entrada en 3D de las tarjetas tenga contra qué medirse. */}
      <FloatingParticles className="hidden md:block" />
      {/* Título de la sección */}
      <h2
        ref={tituloRef}
        className="relative font-display text-2xl md:text-[1.75rem] font-bold tracking-[-0.022em] mb-8 text-center text-light-text dark:text-dark-text"
      >
        {t("projects.title")}
      </h2>

      {/* Botones de categorías. El fondo de la píldora activa es un único nodo
          compartido con layoutId: se desliza de una categoría a otra en vez de
          desaparecer de un sitio y aparecer en otro. El texto va en una capa
          aparte por encima, si no el fondo animado lo arrastraría con él. */}
      <div className="relative flex flex-wrap justify-center gap-2 sm:gap-4 mb-12">
        {categories.map((category) => {
          const activa = activeCategory === category.key;
          return (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              aria-pressed={activa}
              className={`relative px-4 py-2 rounded-full border transition-colors text-sm font-semibold ${
                activa
                  ? "border-transparent text-white dark:text-black"
                  : "border-light-accent dark:border-dark-accent text-light-accent dark:text-dark-accent hover:bg-light-accent hover:text-white dark:hover:bg-dark-accent dark:hover:text-black"
              }`}
            >
              {activa && (
                <motion.span
                  layoutId="filtro-activo"
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-light-accent dark:bg-dark-accent"
                  transition={
                    menosMovimientoFM
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 380, damping: 32 }
                  }
                />
              )}
              {/* Posicionado para que quede por encima de la píldora: los dos
                  están posicionados y aquí manda el orden del DOM. */}
              <span className="relative">{category.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid de proyectos */}
      {filteredProjects.length === 0 && (
        <p className="text-center text-sm text-light-subtle dark:text-dark-subtle py-10">
          {t("projects.empty")}
        </p>
      )}

      <div ref={rejillaRef} className="relative grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <ProjectCard3D
            key={project.key}
            data-reveal
            className="transition-shadow duration-300 hover:z-10"
            envoltorio={MacWindow}
            propsEnvoltorio={{ titulo: project.file }}
          >

            {/* Contenido principal del proyecto */}
            <div className="p-5 space-y-3">
              <h3 className="text-xl font-semibold text-light-text dark:text-white">{t(`projects.titles.${project.key}`)}</h3>
              <p className="text-sm text-light-subtle dark:text-dark-subtle">{t(`projects.descriptions.${project.key}`)}</p>

              {/* Tecnologías usadas. El nombre va en texto junto al icono, no solo
                  como atributo title: un SVG no es contenido indexable, así que
                  antes la palabra "React" no aparecía ni una vez en todo el sitio. */}
              <ul className="flex flex-wrap gap-2 mt-2">
                {project.tech.map((tech) => (
                  <li
                    key={tech}
                    className="inline-flex items-center gap-1.5 rounded-full border border-light-border dark:border-dark-border bg-light-background/60 dark:bg-white/5 px-2.5 py-1 text-xs font-medium text-light-text dark:text-dark-text"
                  >
                    <span aria-hidden="true" className="[&>svg]:text-base [&>svg]:block">
                      {techIcons[tech]}
                    </span>
                    {tech}
                  </li>
                ))}
              </ul>

              {/* Botón de ver proyecto */}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-sm text-light-accent dark:text-dark-accent hover:underline"
                >
                  {t("projects.button")}
                </a>
              )}
            </div>

            {/* Mini timeline fuera de la tarjeta */}
            <div className="px-5 pt-4 pb-5 border-t border-light-border dark:border-dark-border">
              <div className="flex items-center justify-between">
                {stages.map((stage, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center text-[10px] text-light-subtle dark:text-dark-subtle relative">
                    {i !== 0 && (
                      <div
                        className={`absolute left-[-50%] top-1.5 h-0.5 w-[50%] ${
                          i <= project.statusIndex ? colors[i - 1] : "bg-gray-500"
                        }`}
                      ></div>
                    )}
                    <div
                      className={`w-3 h-3 rounded-full z-10 ${
                        i <= project.statusIndex ? colors[i] : "bg-gray-500"
                      }`}
                    />
                    {i !== stages.length - 1 && (
                      <div
                        className={`absolute right-[-50%] top-1.5 h-0.5 w-[50%] ${
                          i < project.statusIndex ? colors[i] : "bg-gray-500"
                        }`}
                      ></div>
                    )}
                    <span className="mt-1">{t(`projects.stages.${stage}`)}</span>
                  </div>
                ))}
              </div>
            </div>
          </ProjectCard3D>
        ))}
      </div>
    </section>
  );
}
