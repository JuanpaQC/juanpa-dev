import { useState } from "react";
import { motion } from "framer-motion";
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
  // AgriVision va primera a propósito: el motor de sincronización con
  // resolución de conflictos es la pieza técnica más difícil del portafolio.
  const allProjects = [
    {
      key: "agrivision",
      tech: ["React Native", "Expo", "Firebase", "Jest"],
      file: "agrivision/sync/resolver.js",
      link: null, // TODO: repo o demo de AgriVision
      type: "academic",
      statusIndex: 2,
    },
    {
      key: "agroclass",
      tech: ["React Native", "Expo", "Node", "Firebase"],
      file: "agroclass/survey/Flow.jsx",
      link: null, // TODO: repo o demo de AgroClass
      type: "academic",
      statusIndex: 1,
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
      className="scroll-mt-32 bg-light-background text-light-text dark:bg-dark-background dark:text-dark-text px-6 py-20"
    >
      {/* Título de la sección */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8 }}
        className="font-display text-2xl md:text-[1.75rem] font-bold tracking-[-0.022em] mb-8 text-center text-light-text dark:text-dark-text"
      >
        {t("projects.title")}
      </motion.h2>

      {/* Botones de categorías */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-12"
      >
        {categories.map((category) => (
          <button
            key={category.key}
            onClick={() => setActiveCategory(category.key)}
            className={`px-4 py-2 rounded-full border transition text-sm font-semibold ${
              activeCategory === category.key
                ? "bg-light-accent text-white dark:bg-dark-accent dark:text-black"
                : "border-light-accent dark:border-dark-accent text-light-accent dark:text-dark-accent hover:bg-light-accent hover:text-white dark:hover:bg-dark-accent dark:hover:text-black"
            }`}
          >
            {category.label}
          </button>
        ))}
      </motion.div>

      {/* Grid de proyectos */}
      {filteredProjects.length === 0 && (
        <p className="text-center text-sm text-light-subtle dark:text-dark-subtle py-10">
          {t("projects.empty")}
        </p>
      )}

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.key}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
            className="relative rounded-xl shadow-lg overflow-hidden border border-light-border dark:border-gray-500 bg-light-surface dark:bg-[#1e1e1e] hover:z-10"
          >
            {/* Header estilo ventana Mac */}
            <div className="flex items-center gap-2 px-3 py-2 bg-light-border dark:bg-[#2c2c2e] border-b border-light-border dark:border-gray-600">
              <span className="w-3 h-3 rounded-full bg-[#FF5F57] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,.22)]"></span>
              <span className="w-3 h-3 rounded-full bg-[#FEBC2E] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,.22)]"></span>
              <span className="w-3 h-3 rounded-full bg-[#28C840] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,.22)]"></span>
              <span className="ml-2 font-mono text-xs tracking-wide text-light-subtle dark:text-dark-subtle truncate">
                {project.file}
              </span>
            </div>

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
                    className="inline-flex items-center gap-1.5 rounded-full border border-light-border dark:border-gray-700 bg-light-background/60 dark:bg-white/5 px-2.5 py-1 text-xs font-medium text-light-text dark:text-dark-text"
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
            <div className="px-5 pt-4 pb-5 border-t border-light-border dark:border-gray-700">
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
          </motion.div>
        ))}
      </div>
    </section>
  );
}
