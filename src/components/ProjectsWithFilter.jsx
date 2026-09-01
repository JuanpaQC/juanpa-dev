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
  Expo: <SiExpo className="text-white text-2xl" />,
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
    { key: "personal", label: t("projects.type.personal") },
    { key: "desktop", label: t("projects.type.desktop") },
    { key: "mobile", label: t("projects.type.mobile") },
  ];

  const allProjects = [
    {
      title: t("projects.titles.project1"),
      description: t("projects.descriptions.project1"),
      tech: ["React Native", "Firebase", "Expo"],
      link: "https://github.com/tuusuario/campo-app",
      type: "mobile",
      statusIndex: 2,
    },
    {
      title: t("projects.titles.project2"),
      description: t("projects.descriptions.project2"),
      tech: ["React", "Tailwind", "Netlify"],
      link: "https://tusitioweb.netlify.app",
      type: "desktop",
      statusIndex: 1,
    },
    {
      title: t("projects.titles.project3"),
      description: t("projects.descriptions.project3"),
      tech: ["React", "Framer Motion", "Tailwind"],
      link: "https://github.com/tuusuario/portfolio-animado",
      type: "personal",
      statusIndex: 0,
    },
  ];

  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProjects =
    activeCategory === "all"
      ? allProjects
      : allProjects.filter((project) => project.type === activeCategory);

  const stages = ["Diseño", "Desarrollo", "Producción"];
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
        viewport={{ once: false, amount: 0.4 }}
        transition={{ duration: 0.8 }}
        className="text-3xl md:text-4xl font-bold mb-8 text-center text-dark-accent"
      >
        {t("projects.title")}
      </motion.h2>

      {/* Botones de categorías */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-12"
      >
        {categories.map((category) => (
          <button
            key={category.key}
            onClick={() => setActiveCategory(category.key)}
            className={`px-4 py-2 rounded-full border transition text-sm font-semibold ${
              activeCategory === category.key
                ? "bg-dark-accent text-black"
                : "border-dark-accent text-dark-accent hover:bg-dark-accent hover:text-black"
            }`}
          >
            {category.label}
          </button>
        ))}
      </motion.div>

      {/* Grid de proyectos */}
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
            className="relative rounded-xl shadow-lg overflow-hidden border border-gray-500 bg-[#1e1e1e] dark:bg-[#1e1e1e] hover:z-10"
          >
            {/* Header estilo ventana Mac */}
            <div className="flex gap-2 px-3 py-2 bg-[#2c2c2e] border-b border-gray-600">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
            </div>

            {/* Contenido principal del proyecto */}
            <div className="p-5 space-y-3">
              <h3 className="text-xl font-semibold text-white">{project.title}</h3>
              <p className="text-sm text-dark-subtle dark:text-dark-subtle">{project.description}</p>

              {/* Tecnologías usadas */}
              <div className="flex flex-wrap gap-3 mt-2">
                {project.tech.map((tech, i) => (
                  <div key={i} title={tech} className="hover:scale-110 transition-transform">
                    {techIcons[tech] || <span className="text-xs text-gray-400">{tech}</span>}
                  </div>
                ))}
              </div>

              {/* Botón de ver proyecto */}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-sm text-dark-accent hover:underline"
                >
                  {t("projects.button")}
                </a>
              )}
            </div>

            {/* Mini timeline fuera de la tarjeta */}
            <div className="px-5 pt-4 pb-5 border-t border-gray-700">
              <div className="flex items-center justify-between">
                {stages.map((stage, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center text-[10px] text-dark-subtle relative">
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
                    <span className="mt-1">{stage}</span>
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
