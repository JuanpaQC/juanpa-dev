import { motion } from "framer-motion";
import TechCarousel from "../components/TechCarousel";
import { FaReact, FaCss3Alt, FaHtml5, FaNodeJs } from "react-icons/fa";
import { SiTailwindcss, SiFirebase, SiJavascript } from "react-icons/si";
import profileImg from "../assets/juanpa-profile.jpg"; // Asegúrate de tener esta imagen en tu carpeta de assets
import { useTranslation } from "react-i18next";
import curriculum from "../pdf//Juanpa_Quesada_Profile.pdf"; // Asegúrate de tener este PDF en tu carpeta de pdf

export default function About() {

  const { t } = useTranslation();

  return (
    <section
      id="about"
      className="scroll-mt-32 relative w-full min-h-screen px-6 pt-12 pb-20 md:pt-16 md:pb-28 flex flex-col justify-center items-start text-light-text dark:bg-dark-surface dark:text-dark-text transition-colors"
    >
      {/* Título con ícono */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold text-center w-full text-accent mb-10 text-light-accent dark:text-dark-accent"
      >
        {t("about.title")}
      </motion.h2>


      {/* Imagen + texto */}
      <div className="w-full flex flex-col md:flex-row gap-10 items-start">
        {/* Imagen */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 35 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/3 flex justify-center md:justify-start"
        >
          <div className="translate-x-6 md:translate-x-12 bg-white dark:bg-dark-border-mac rounded-xl shadow-lg overflow-hidden border border-gray-600 w-fit">
            <div className="flex gap-2 px-3 py-2 bg-[#2c2c2e] border-b border-gray-600">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
            </div>
            <img
              src={profileImg}
              alt="Foto de Juanpa"
              className="w-60 h-60 object-cover"
            />
          </div>
        </motion.div>



        {/* Texto + datos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="md:w-2/3 space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-6 text-left text-dark-subtle dark:text-dark-subtle">
            <p>
              {t("about.description")}
            </p>
            <p>
              {t("about.bio")}
            </p>
          </div>

          {/* Datos rápidos */}
          <div className="grid grid-cols-2 gap-4 text-sm text-dark-subtle">
            <div><strong>📍 Ubicación:</strong> {t("about.location")}</div>
            <div><strong>🎓 Carrera:</strong> {t("about.major")}</div>
            <div><strong>💼 Rol:</strong> {t("about.rol")}</div>
            <div><strong>🌐 Idiomas:</strong> {t("about.languages")}</div>
          </div>
        </motion.div>
      </div>

      {/* Tecnologías */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-wrap gap-4 mt-12"
      >
        <TechCarousel />
      </motion.div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-6 grid md:grid-cols-2 gap-10 items-start w-full"
      >
        {/* Timeline */}
        <ul className="space-y-4 border-l border-dark-border dark:border-dark-subtle pl-4 mt-14">
          <li>
            <div className="text-sm text-dark-subtle">{t("about.timeline.2021.description")}</div>
          </li>
          <li>
            <div className="text-sm text-dark-subtle">{t("about.timeline.2023.description")}</div>
          </li>
          <li>
            <div className="text-sm text-dark-subtle">{t("about.timeline.2024.description")}</div>
          </li>
        </ul>

        {/* Testimonios */}
        <div className="space-y-6 mt-10 md:mt-0 w-full md:w-auto md:ml-[-180px]">

          <h3 className="text-2xl font-semibold text-accent text-center md:text-left">
            {t("about.references")}
          </h3>

          <blockquote className="bg-white/10 dark:bg-dark-surface/30 p-6 rounded-xl border border-dark-border dark:border-dark-subtle text-sm text-dark-subtle">
            {t("about.referencesDescription#1")}
            <footer className="mt-3 text-right text-xs text-dark-subtle">— Ana Rodríguez, UX Designer</footer>
          </blockquote>

          <blockquote className="bg-white/10 dark:bg-dark-surface/30 p-6 rounded-xl border border-dark-border dark:border-dark-subtle text-sm text-dark-subtle">
            {t("about.referencesDescription#2")}
            <footer className="mt-3 text-right text-xs text-dark-subtle">— Carlos Méndez, Dev Team Lead</footer>
          </blockquote>
        </div>

      </motion.div>


      {/* Botón de descarga de CV */}
      <div className="flex justify-end mt-4 mr-999">
        <motion.a
          href={curriculum}
          target="_blank"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-light-accent dark:bg-dark-accent text-black px-6 py-3 rounded-lg font-semibold text-lg transition"
        >
          {t("about.button")}
        </motion.a>
      </div>


    </section>
  );
}

{/*text-light-accent dark:text-dark-accent*/}