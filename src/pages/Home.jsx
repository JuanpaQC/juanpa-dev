import { motion, useAnimation, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import FloatingParticles from "../components/FloatingParticles";
import HeroAvatar from "../components/HeroAvatar";
import useHeroScroll from "../hooks/useHeroScroll";

export default function Home() {
  const { t } = useTranslation();
  const controls = useAnimation();
  const menosMovimientoFM = useReducedMotion();

  const seccionRef = useRef(null);
  const fondoRef = useRef(null);
  const textoRef = useRef(null);
  const subtituloRef = useRef(null);
  const botonRef = useRef(null);
  const avatarRef = useRef(null);

  useEffect(() => {
    async function animateAvatar() {
      // El avatar es el elemento LCP. No se anima la opacidad: el navegador no
      // registra el LCP hasta que el píxel es opaco, y el fundido de 1 s que había
      // aquí antes se sumaba entero a la métrica.
      if (menosMovimientoFM) {
        controls.set({ y: 0 });
        return;
      }

      await controls.start({
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
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
  }, [controls, menosMovimientoFM]);

  useHeroScroll({ seccionRef, fondoRef, textoRef, subtituloRef, botonRef, avatarRef });

  const [typedText, setTypedText] = useState('');
  const [showFinalName, setShowFinalName] = useState(false);
  const fullCode = 'Juanpa Quesada Caballero';

  useEffect(() => {
    // Con menos movimiento pedido, se salta el tecleo entero: eran 3,4 s de
    // texto moviéndose en la primera pantalla.
    if (menosMovimientoFM) {
      setTypedText(fullCode);
      setShowFinalName(true);
      return;
    }

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
  }, [menosMovimientoFM]);

  return (
    <section
      id="home"
      ref={seccionRef}
      className="relative min-h-screen w-full px-6 flex flex-col md:flex-row items-start md:items-center justify-start md:justify-between gap-10 overflow-hidden text-light-text dark:bg-dark-background dark:text-dark-text transition-colors pt-40 md:pt-28"
    >
      {/* Imagen de fondo */}
      <div
        ref={fondoRef}
        className="absolute inset-0 bg-cover bg-center z-0 will-change-transform"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      />

      {/* Overlay azul/turquesa translúcido para dark mode */}
      <div className="absolute inset-0 bg-white/85 dark:bg-[#0D1B2A]/80 backdrop-blur-sm z-10" />

      {/* Capa decorativa: va por encima del velo, si no quedaría tapada por el
          80-85% de opacidad del overlay, pero por debajo del contenido.
          El globo de tecnologías se ha mudado a About: aquí se cruzaba con el
          avatar y repetía una lista que ya estaba tres pantallas más abajo. */}
      <FloatingParticles className="z-20 hidden md:block" />

      {/* Texto */}
      <div
        ref={textoRef}
        className="z-30 md:w-[48%] lg:ml-20 text-left space-y-6"
      >
        {/* El <h1> existe desde el primer frame. Antes solo aparecía al terminar
            la animación, a los ~3,7 s: hasta entonces la página no tenía
            encabezado principal ni para Google ni para un lector de pantalla,
            y el tecleo leía en voz alta los caracteres "<strong>".
            El efecto es decoración, así que va marcado como aria-hidden. */}
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          {!showFinalName ? (
            <>
              {/* Mientras teclea, el nombre real vive aquí para el lector de
                  pantalla y el rastreador; el efecto queda como decoración. */}
              <span className="sr-only">Juanpa Quesada Caballero</span>
              <motion.span
                aria-hidden="true"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="block text-2xl md:text-4xl font-mono font-normal text-left whitespace-pre-wrap leading-tight text-light-text dark:text-white"
              >
                <code>
                  <span className="text-light-accent dark:text-[#00C9B7]">&lt;strong&gt;</span>
                  <span className="text-light-text dark:text-white">{typedText}</span>
                  <span className="text-light-accent dark:text-[#00C9B7]">&lt;/strong&gt;</span>
                  <span className="inline-block w-[1ch] bg-light-text dark:bg-white animate-blink ml-1" />
                </code>
              </motion.span>
            </>
          ) : (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="block font-display text-light-accent dark:text-dark-accent"
            >
              Juanpa Quesada Caballero
            </motion.span>
          )}
        </h1>

        {/* En claro va en tinta, no en el gris sutil. El velo blanco al 85% del
            hero se compone sobre una foto casi negra, así que el fondo real no
            es crema sino un gris de ~#DFDFDE, y sobre él `light-subtle`
            (#6B665D) se queda en torno a 4.2:1 —por debajo del 4.5:1 de AA—.
            No es un fallo de tokens: los tokens entre sí están bien, y por eso
            el ADR 0004 no lo cazó. El fondo variable es lo que lo rompe.
            En oscuro el gris sutil sí pasa de sobra y se queda como estaba. */}
        <p
          ref={subtituloRef}
          className="text-lg md:text-xl text-light-text dark:text-dark-subtle"
        >
          {t("home.subtitle")}
        </p>

        {/* El <div> es de GSAP y el <a> de framer-motion. Tenerlos en el mismo
            nodo no funciona: GSAP pinta el estado inicial del `from` (opacidad
            0) nada más crearse el efecto, framer lo lee como el valor base del
            elemento al montar su VisualElement, y a partir de ahí lo reescribe
            en cada render. Como el hero re-renderiza en cada letra del tecleo,
            el botón se quedaba invisible para siempre. Medido en el navegador:
            opacity 0 permanente hasta separar los dos nodos. */}
        <div ref={botonRef} className="inline-block">
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-light-accent text-white dark:bg-dark-accent dark:text-black px-6 py-3 rounded-lg font-semibold text-lg transition"
          >
            {t("home.button")}
          </motion.a>
        </div>
      </div>

      {/* Avatar. El contenedor es el que anima el scroll y el <img> el que
          flota: si las dos animaciones escribieran el transform del mismo nodo,
          la última en ejecutarse borraría a la otra. */}
      <HeroAvatar contenedorRef={avatarRef} areaRef={seccionRef} controls={controls} />
    </section>
  );
}
