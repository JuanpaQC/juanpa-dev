import { motion } from "framer-motion";
import TechCarousel from "../components/TechCarousel";
// La foto se sirve recortada y en WebP: el original era de 3024x4032 y 7.6 MB para mostrarse a 240 px.
import profile480 from "../assets/opt/juanpa-profile-480.webp";
import profile960 from "../assets/opt/juanpa-profile-960.webp";
import profileFallback from "../assets/opt/juanpa-profile-480.jpg";
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
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6 }}
        className="font-display text-2xl md:text-[1.75rem] font-bold tracking-[-0.022em] text-center w-full mb-10 text-light-text dark:text-dark-text"
      >
        {t("about.title")}
      </motion.h2>


      {/* Imagen + texto */}
      <div className="w-full flex flex-col md:flex-row gap-10 items-start">
        {/* Imagen */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/3 flex justify-center md:justify-start"
        >
          <div className="translate-x-6 md:translate-x-12 bg-light-surface dark:bg-dark-border-mac rounded-xl shadow-lg overflow-hidden border border-light-border dark:border-gray-600 w-fit">
            <div className="flex items-center gap-2 px-3 py-2 bg-light-border dark:bg-[#2c2c2e] border-b border-light-border dark:border-gray-600">
              <span className="w-3 h-3 rounded-full bg-[#FF5F57] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,.22)]"></span>
              <span className="w-3 h-3 rounded-full bg-[#FEBC2E] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,.22)]"></span>
              <span className="w-3 h-3 rounded-full bg-[#28C840] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,.22)]"></span>
              <span className="ml-2 font-mono text-xs tracking-wide text-light-subtle dark:text-dark-subtle">~/juanpa.jpeg</span>
            </div>
            <picture>
              <source
                type="image/webp"
                srcSet={`${profile480} 480w, ${profile960} 960w`}
                sizes="240px"
              />
              <img
                src={profileFallback}
                alt={t("about.photoAlt")}
                width="240"
                height="240"
                loading="lazy"
                decoding="async"
                className="w-60 h-60 object-cover"
              />
            </picture>
          </div>
        </motion.div>



        {/* Texto + datos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="md:w-2/3 space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-6 text-left text-light-subtle dark:text-dark-subtle">
            <p>
              {t("about.description")}
            </p>
            <p>
              {t("about.bio")}
            </p>
          </div>

          {/* Datos rápidos */}
          <div className="grid grid-cols-2 gap-4 text-sm text-light-subtle dark:text-dark-subtle">
            <div><strong>{t("about.labels.location")}:</strong> {t("about.location")}</div>
            <div><strong>{t("about.labels.major")}:</strong> {t("about.major")}</div>
            <div><strong>{t("about.labels.focus")}:</strong> {t("about.rol")}</div>
            <div><strong>{t("about.labels.languages")}:</strong> {t("about.languages")}</div>
          </div>
        </motion.div>
      </div>

      {/* Tecnologías */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-wrap gap-4 mt-12"
      >
        <TechCarousel />
      </motion.div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-6 grid md:grid-cols-2 gap-10 items-start w-full"
      >
        {/* Timeline */}
        <ul className="space-y-4 border-l border-dark-border dark:border-dark-subtle pl-4 mt-14">
          {["2021", "2023", "2024", "2025"].map((anio) => (
            <li key={anio} className="flex gap-3">
              <span className="font-mono text-xs text-light-accent dark:text-dark-accent pt-0.5 shrink-0">{anio}</span>
              <span className="text-sm text-light-subtle dark:text-dark-subtle">{t(`about.timeline.${anio}`)}</span>
            </li>
          ))}
        </ul>

        {/* Testimonios */}
        <div className="space-y-6 mt-10 md:mt-0 w-full md:w-auto md:ml-[-180px]">

          <h3 className="text-2xl font-semibold text-center md:text-left">
            {t("about.references")}
          </h3>

          <blockquote className="bg-light-surface dark:bg-dark-surface/30 p-6 rounded-xl border border-dark-border dark:border-dark-subtle text-sm text-light-subtle dark:text-dark-subtle">
            {t("about.referencesDescription#1")}
            <footer className="mt-3 text-right text-xs text-light-subtle dark:text-dark-subtle">— Ana Rodríguez, UX Designer</footer>
          </blockquote>

          <blockquote className="bg-light-surface dark:bg-dark-surface/30 p-6 rounded-xl border border-dark-border dark:border-dark-subtle text-sm text-light-subtle dark:text-dark-subtle">
            {t("about.referencesDescription#2")}
            <footer className="mt-3 text-right text-xs text-light-subtle dark:text-dark-subtle">— Carlos Méndez, Dev Team Lead</footer>
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
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-light-accent text-white dark:bg-dark-accent dark:text-black px-6 py-3 rounded-lg font-semibold text-lg transition"
        >
          {t("about.button")}
        </motion.a>
      </div>


    </section>
  );
}

{/*text-light-accent dark:text-dark-accent*/}