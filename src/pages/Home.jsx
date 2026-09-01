import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import avatarImg from "../assets/avatarjuanpa-removebg.png";

export default function Home() {
  const { t } = useTranslation();
  const controls = useAnimation();

  useEffect(() => {
    async function animateAvatar() {
      await controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 1 },
      });

      controls.start({
        y: [0, -8, 0],
        transition: {
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        },
      });
    }

    animateAvatar();
  }, []);

  const [typedText, setTypedText] = useState('');
  const [showFinalName, setShowFinalName] = useState(false);
  const fullCode = 'Juanpa Quesada Caballero';

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullCode.substring(0, index));
      index++;

      if (index > fullCode.length) {
        clearInterval(interval);
        setTimeout(() => {
          setShowFinalName(true);
        }, 1000);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen w-full px-6 flex flex-col md:flex-row items-start md:items-center justify-start md:justify-between gap-10 text-light-text dark:bg-dark-background dark:text-dark-text transition-colors pt-40 md:pt-28"
    >
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      />

      {/* Overlay azul/turquesa translúcido para dark mode */}
      <div className="absolute inset-0 bg-white/70 dark:bg-[#0D1B2A]/80 backdrop-blur-sm z-10" />

      {/* Texto */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-10 md:w-[48%] lg:ml-20 text-left space-y-6"
      >
        {!showFinalName ? (
          <motion.pre
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-2xl md:text-4xl font-mono text-left whitespace-pre-wrap leading-tight text-white"
          >
            <code>
              <span className="text-[#00C9B7]">&lt;strong&gt;</span>
              <span className="text-white">{typedText}</span>
              <span className="text-[#00C9B7]">&lt;/strong&gt;</span>
              <span className="inline-block w-[1ch] bg-white animate-blink ml-1" />
            </code>
          </motion.pre>
        ) : (
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold tracking-tight font-orbitron text-accent"
          >
            Juanpa Quesada Caballero
          </motion.h1>
        )}

        <p className="text-lg md:text-xl text-dark-subtle">
          {t("home.subtitle")}
        </p>

        <motion.a
          href="#projects"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block bg-dark-accent text-black px-6 py-3 rounded-lg font-semibold text-lg transition"
        >
          {t("home.button")}
        </motion.a>
      </motion.div>

      {/* Avatar */}
      <div className="relative z-10 md:w-1/2 flex justify-center items-center mt-[-20px] md:mt-0">
        <div className="absolute w-[300px] h-[300px] bg-[#00F6ED] rounded-full blur-3xl opacity-30 z-0" />
        <motion.img
          src={avatarImg}
          alt="Juanpa avatar"
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          className="relative z-10 max-w-[250px] md:max-w-[300px] lg:max-w-[350px] drop-shadow-[0_0_12px_#00F6ED80]"
        />
      </div>
    </section>
  );
}
