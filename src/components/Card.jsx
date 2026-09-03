import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Card({ platform, name, username, image, imageAlt, link, icon }) {
  const { t } = useTranslation();

  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: "0px 10px 20px rgba(0,0,0,0.15)" }}
      transition={{ type: "spring", stiffness: 200 }}
      className="relative flex flex-col bg-white dark:bg-dark-background p-8 rounded-2xl shadow-lg w-full border dark:border-dark-border hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      {/* Header */}
      <div className="absolute top-4 left-4 flex gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,.22)]"></span>
        <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,.22)]"></span>
        <span className="w-2.5 h-2.5 rounded-full bg-[#28C840] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,.22)]"></span>
      </div>

      <div className="absolute top-4 right-4 font-mono text-xs tracking-wide text-light-subtle dark:text-dark-subtle">
        {platform}
      </div>

      {/* Contenido */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-7">
        <div className="flex items-center gap-4">
          {image ? (
            <img src={image} alt={imageAlt || ""} className="w-16 h-16 rounded-full" />
          ) : (
            <div className="text-5xl">{icon}</div>
          )}
          <div className="flex flex-col text-center md:text-left">
            <h3 className="text-lg font-bold">{name}</h3>
            <p className="text-sm text-light-subtle dark:text-dark-subtle">{username}</p>
          </div>
        </div>

        {/* Botón */}
        <div className="w-full md:w-auto flex justify-center md:justify-end">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-light-accent text-white dark:bg-dark-accent dark:text-black py-2 px-6 rounded-xl text-sm font-semibold tracking-wide hover:scale-105 hover:brightness-105 transition-all duration-300 min-w-[140px] text-center"
          >
            {platform === "Gmail"
              ? t("contact.social.mail")
              : t("contact.social.button")}
          </a>
        </div>
      </div>
    </motion.div>
  );
}
{/*text-light-accent dark:text-dark-accent*/}