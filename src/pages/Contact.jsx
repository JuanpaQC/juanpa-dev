import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import Card from "../components/Card";
import { useTranslation } from "react-i18next";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [githubProfile, setGithubProfile] = useState(null);
  const [toast, setToast] = useState({ show: false, type: "", text: "" });
  const [enviando, setEnviando] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    fetch("https://api.github.com/users/JuanpaQC")
      .then((res) => res.json())
      .then((data) => setGithubProfile(data))
      .catch((err) => console.error("GitHub fetch error:", err));
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      const res = await fetch("https://contact-backend-h7l4.onrender.com/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.json();

      if (res.ok) {
        setToast({ show: true, type: "success", text: t("messages.success") });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setToast({ show: true, type: "error", text: t("messages.error") });
        console.error(result);
      }
    } catch (error) {
      console.error(error);
      setToast({ show: true, type: "error", text: t("messages.network") });
    }

    setEnviando(false);

    if (navigator.vibrate) {
      navigator.vibrate(200);
    }

    setTimeout(() => setToast({ show: false, type: "", text: "" }), 4000);
  };

  return (
    <section
      id="contact"
      className="scroll-mt-32 min-h-screen w-full px-6 py-20 flex flex-col items-center bg-light-background text-light-text dark:bg-dark-surface dark:text-dark-text transition-colors"
    >
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5 }}
        className="font-display text-2xl md:text-[1.75rem] font-bold tracking-[-0.022em] mb-16 text-center text-light-text dark:text-dark-text"
      >
        {t("contact.title")}
      </motion.h2>

      <div className="w-full max-w-7xl flex flex-col md:flex-row gap-20 items-start justify-center">
        {/* Formulario */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2 space-y-8"
        >
          {["name", "email", "message"].map((field) => (
            <div key={field} className="flex flex-col">
              <label htmlFor={field} className="mb-2 text-base font-semibold">
                {field === "name"
                  ? t("contact.form.name")
                  : field === "email"
                  ? t("contact.form.email")
                  : t("contact.form.message")}
              </label>
              {field !== "message" ? (
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  id={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className="px-5 py-3 rounded-xl border border-light-border-strong dark:border-dark-border-strong bg-white dark:bg-dark-background text-black dark:text-dark-text outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-accent dark:focus-visible:outline-dark-accent transition"
                />
              ) : (
                <textarea
                  name={field}
                  id={field}
                  rows="6"
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className="px-5 py-3 rounded-xl border border-light-border-strong dark:border-dark-border-strong bg-white dark:bg-dark-background text-black dark:text-dark-text outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-accent dark:focus-visible:outline-dark-accent transition"
                ></textarea>
              )}
            </div>
          ))}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={enviando}
            aria-busy={enviando}
            className="w-full bg-light-accent text-white dark:bg-dark-accent dark:text-black py-4 rounded-xl font-bold text-lg tracking-wider transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {enviando ? t("contact.form.sending") : t("contact.form.button")}
          </motion.button>
        </motion.form>

        {/* Redes sociales */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2 flex flex-col"
        >
          <p className="text-2xl font-semibold mb-4 text-center md:text-left">
            {t("contact.social.title")}
          </p>

          <div className="flex flex-col gap-5 w-full">
            {githubProfile && (
              <Card
                platform="GitHub"
                name={`@${githubProfile.login}`}
                username={t("contact.social.repos", { n: githubProfile.public_repos })}
                image={githubProfile.avatar_url}
                imageAlt={t("contact.social.avatarAlt", { name: githubProfile.login })}
                link={githubProfile.html_url}
              />
            )}
            <Card
              platform="LinkedIn"
              name="in/juanpaquesadacaballero"
              username={t("contact.social.linkedinTag")}
              icon={<FaLinkedin className="text-blue-600 text-5xl" />}
              link="https://www.linkedin.com/in/juanpaquesadacaballero/"
            />
            <Card
              platform="Gmail"
              name="jpqcaballero@gmail.com"
              username={t("contact.social.mailTag")}
              icon={<SiGmail className="text-red-500 text-5xl" />}
              link="mailto:jpqcaballero@gmail.com"
            />
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5 }}
        className="mt-20 text-center text-xs text-light-subtle dark:text-dark-subtle"
      >
        {t("contact.footer", { year: new Date().getFullYear() })}
      </motion.div>

      {/* Regiones vivas permanentes. Tienen que existir en el DOM ANTES de que
          llegue el mensaje: si se montan a la vez que su contenido, la mayoría
          de lectores de pantalla no anuncian nada.
          El éxito es informativo y espera turno (status/polite); el error
          interrumpe, porque el usuario acaba de perder lo que escribió. */}
      <div role="status" aria-live="polite" className="sr-only">
        {toast.show && toast.type === "success" ? toast.text : ""}
      </div>
      <div role="alert" aria-live="assertive" className="sr-only">
        {toast.show && toast.type !== "success" ? toast.text : ""}
      </div>

      {/* Toast message */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            // El anuncio lo hacen las regiones permanentes de abajo, no este
            // nodo: aquí solo vive la parte visual.
            aria-hidden="true"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.4 }}
            className={`fixed bottom-6 right-6 z-50 max-w-xs px-6 py-4 rounded-xl shadow-lg border text-sm
              ${
                toast.type === "success"
                  ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 border-green-300 dark:border-green-700"
                  : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 border-red-300 dark:border-red-700"
              }
            `}
          >
            <p>{toast.text}</p>
            {/* Un error sin salida deja al usuario atascado: el correo directo
                va como enlace, no como texto que haya que copiar a mano. */}
            {toast.type !== "success" && (
              <a
                href="mailto:jpqcaballero@gmail.com"
                className="mt-2 inline-block font-semibold underline underline-offset-2"
              >
                {t("messages.errorAction")} →
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
