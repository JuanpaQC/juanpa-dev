import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import StackGrid from "../components/StackGrid";
import SplitReveal from "../components/SplitReveal";
// La foto se sirve recortada y en WebP: el original era de 3024x4032 y 7.6 MB para mostrarse a 240 px.
import profile480 from "../assets/opt/juanpa-profile-480.webp";
import profile960 from "../assets/opt/juanpa-profile-960.webp";
import profileFallback from "../assets/opt/juanpa-profile-480.jpg";
import { useTranslation } from "react-i18next";
import useParallax from "../hooks/useParallax";
import { REFERENCIAS } from "../data/referencias";
import useReveal from "../hooks/useReveal";
import FloatingParticles from "../components/FloatingParticles";
import MacWindow from "../components/MacWindow";
import { gsap, menosMovimiento, medible } from "../lib/motion";

export default function About() {

  const { t, i18n } = useTranslation();
  const idioma = i18n.language?.startsWith("en") ? "en" : "es";

  const seccionRef = useRef(null);
  const fotoRef = useRef(null);
  const retratoRef = useRef(null);
  const textoRef = useRef(null);
  const parrafosRef = useRef(null);
  const datosRef = useRef(null);
  const cronologiaRef = useRef(null);
  const lineaRef = useRef(null);
  const referenciasRef = useRef(null);

  // Tres planos a tres velocidades. El marco de la foto sube más despacio que
  // la columna de texto, y el retrato se mueve dentro del marco en sentido
  // contrario al marco: eso último es lo que se nota de verdad, porque el
  // recorte fijo de la ventana hace de ventana real y el contenido se desplaza
  // detrás. Con 40 px en un solo plano, como estaba antes, el efecto existía
  // pero nadie lo veía.
  useParallax(fotoRef, { distancia: 44 });
  useParallax(retratoRef, { distancia: -46 });
  useParallax(textoRef, { distancia: -26 });

  // `:scope >` y no `[data-reveal]` a secas: dentro de este contenedor hay otro
  // useReveal (el de los datos rápidos). Sin acotar a los hijos directos, los
  // dos seleccionaban los mismos nodos, cada uno le creaba su tween de opacidad
  // y el gestor de solapamientos de GSAP mataba tweens a medio camino: tres de
  // los cuatro datos se quedaban invisibles para siempre.
  useReveal(textoRef, { selector: ":scope > [data-reveal]", y: 20, stagger: 0.12 });

  // Los dos párrafos de biografía entran uno por uno con una cortina de
  // izquierda a derecha, no con un fundido: el texto ya está pintado y solo se
  // descubre, así que se lee el gesto de "esto se está escribiendo" en vez de
  // un bloque que aparece de la nada.
  useReveal(parrafosRef, {
    selector: "p",
    x: -18,
    y: 0,
    clip: true,
    duracion: 0.7,
    stagger: 0.16,
    start: "top 86%",
    porElemento: true,
  });

  // Los datos rápidos, con la misma cortina pero más corta: son cuatro líneas
  // de una sola frase y una animación larga sobre algo tan breve se nota como
  // retardo, no como intención.
  useReveal(datosRef, {
    x: -14,
    y: 0,
    clip: true,
    duracion: 0.5,
    stagger: 0.07,
    start: "top 90%",
    porElemento: true,
  });

  useReveal(referenciasRef, { y: 28, rotacionX: -10, stagger: 0.14, porElemento: true });

  // Las dos columnas de abajo bajan a velocidades distintas. Son ±16 px sobre
  // el bloque entero, no sobre cada línea: la guía de movimiento es explícita
  // en que el cuerpo de texto no se parallaxea, y por encima de ~20 px la
  // lectura empieza a resentirse.
  // Mismo sentido y distinta magnitud, no sentidos opuestos: ahora la
  // cronología y las referencias van apiladas en la misma columna, y moviéndose
  // una hacia la otra acabarían tocándose por el centro del recorrido.
  useParallax(cronologiaRef, { distancia: 16 });
  useParallax(referenciasRef, { distancia: 6 });

  // Cronología: la línea se dibuja con el scroll y cada hito aparece cuando la
  // línea lo alcanza.
  //
  // Reparto deliberado: la línea va con `scrub`, atada al progreso del scroll,
  // porque es lo que hace que la sección se sienta viva al bajar. Los hitos NO
  // van con scrub, sino con un disparador propio cada uno. Atarlos al progreso
  // los dejaba a medio revelar cuando la lista entera cabía en pantalla y ya no
  // quedaba scroll que consumir: texto a opacidad 0.4 y sin forma de
  // completarlo. Así se consigue el vínculo con el scroll sin ese riesgo.
  useReveal(cronologiaRef, {
    selector: "li",
    x: -18,
    y: 0,
    duracion: 0.5,
    start: "top 88%",
    porElemento: true,
  });

  useEffect(() => {
    const contenedor = cronologiaRef.current;
    const linea = lineaRef.current;
    if (!contenedor || !linea) return;

    // Sin animación la línea ya está entera: su estado por defecto en CSS es
    // scaleY(1) y solo el tween la encoge para luego dibujarla.
    if (menosMovimiento() || !medible(contenedor)) return;

    const tween = gsap.fromTo(
      linea,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        transformOrigin: "top center",
        scrollTrigger: {
          trigger: contenedor,
          start: "top 82%",
          end: "bottom 65%",
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(linea, { clearProps: "transform" });
    };
  }, []);

  return (
    <section
      id="about"
      ref={seccionRef}
      className="scroll-mt-32 relative w-full min-h-screen px-6 pt-12 pb-20 md:pt-16 md:pb-28 flex flex-col justify-center items-start overflow-hidden text-light-text dark:bg-dark-surface dark:text-dark-text transition-colors"
    >
      {/* Capa de fondo a su propia velocidad. Sin algo que se mueva por detrás,
          el parallax de la foto no tiene contra qué compararse y se lee como un
          desajuste, no como profundidad. */}
      <FloatingParticles className="hidden md:block" />
      {/* Título con ícono */}
      <SplitReveal
        as="h2"
        texto={t("about.title")}
        className="relative font-display text-2xl md:text-[1.75rem] font-bold tracking-[-0.022em] text-center w-full mb-10 text-light-text dark:text-dark-text"
      />


      {/* Dos columnas, y todo el contenido vive dentro de ellas.
          Antes había además dos bandas a todo lo ancho —el stack y el bloque de
          cronología/referencias—, y eso dejaba huecos: a 1400 px el globo de
          440 px tenía ~450 px de vacío a cada lado, y al bajarlo a la columna
          izquierda el hueco se mudó a la derecha, donde el texto se acababa
          400 px antes. Metiendo cronología y referencias en la columna derecha
          las dos columnas terminan a alturas parecidas y el globo queda a la
          altura de las referencias, que es donde tiene que estar. */}
      <div className="relative w-full flex flex-col md:flex-row gap-10 lg:gap-14 items-start">
        {/* Columna izquierda: retrato y, debajo, el globo de tecnologías. */}
        <div className="w-full md:w-1/3 flex flex-col gap-10">
          {/* Centrada, no pegada a la izquierda. El globo de tecnologías que va
              justo debajo se centra en el ancho de la columna, así que con
              `md:justify-start` el marco quedaba descolgado unos 90 px a la
              izquierda del eje de la esfera y las dos piezas no se leían como
              una sola columna. Se quitó también el `translate-x-6`, que era un
              empujón heredado de cuando la foto compartía fila con el texto. */}
          <div ref={fotoRef} className="flex justify-center">
            <MacWindow titulo="~/juanpa.jpeg" className="w-fit">
              {/* El recorte es del contenedor, no de la imagen: el retrato es un
                  12% más grande que su hueco para que el contra-parallax nunca
                  deje ver un borde vacío dentro del marco. */}
              <div className="h-60 w-60 overflow-hidden">
                <picture>
                  <source
                    type="image/webp"
                    srcSet={`${profile480} 480w, ${profile960} 960w`}
                    sizes="240px"
                  />
                  <img
                    ref={retratoRef}
                    src={profileFallback}
                    alt={t("about.photoAlt")}
                    width="240"
                    height="240"
                    loading="lazy"
                    decoding="async"
                    className="h-[112%] w-full -translate-y-[6%] object-cover"
                  />
                </picture>
              </div>
            </MacWindow>
          </div>

          <div className="relative">
            <StackGrid />
          </div>
        </div>

        {/* Columna derecha */}
        <div ref={textoRef} className="w-full md:w-2/3 space-y-8">
          <div ref={parrafosRef} className="grid md:grid-cols-2 gap-6 text-left text-light-subtle dark:text-dark-subtle">
            <p>
              {t("about.description")}
            </p>
            <p>
              {t("about.bio")}
            </p>
          </div>

          {/* Datos rápidos */}
          <div
            ref={datosRef}
            className="grid grid-cols-2 gap-4 text-sm text-light-subtle dark:text-dark-subtle"
          >
            <div data-reveal><strong>{t("about.labels.location")}:</strong> {t("about.location")}</div>
            <div data-reveal><strong>{t("about.labels.major")}:</strong> {t("about.major")}</div>
            <div data-reveal><strong>{t("about.labels.focus")}:</strong> {t("about.rol")}</div>
            <div data-reveal><strong>{t("about.labels.languages")}:</strong> {t("about.languages")}</div>
          </div>

          <p data-reveal className="text-sm text-light-subtle dark:text-dark-subtle max-w-[62ch]">
            {t("about.craft")}
          </p>

          {/* Cronología. El borde izquierdo pasó a ser un <span> propio: un
              border-left no se puede escalar sin escalar también el contenido. */}
          <div ref={cronologiaRef} className="relative pt-2">
            {/* La línea va fuera del <ul>: dentro de una lista solo pueden vivir
                <li>, y un <span> suelto ahí es HTML inválido. */}
            <span
              ref={lineaRef}
              aria-hidden="true"
              className="absolute left-0 top-2 h-[calc(100%-0.5rem)] w-px origin-top bg-gradient-to-b from-light-accent via-light-border to-transparent dark:from-dark-accent dark:via-dark-subtle dark:to-transparent"
            />
            <ul className="space-y-4 pl-4">
              {["2021", "2023", "2024", "2025"].map((anio) => (
                <li key={anio} className="flex gap-3">
                  <span className="font-mono text-xs text-light-accent dark:text-dark-accent pt-0.5 shrink-0">{anio}</span>
                  <span className="text-sm text-light-subtle dark:text-dark-subtle">{t(`about.timeline.${anio}`)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Referencias.
              El hueco se queda; lo que se fue son las dos citas que estaban
              firmadas como "Ana Rodríguez, UX Designer" y "Carlos Méndez, Dev
              Team Lead" y no correspondían a nadie. Con `REFERENCIAS` vacío
              esto no pinta nada en producción —una sección vacía es mejor que
              una sección falsa— y en desarrollo deja un marcador visible para
              que no se olvide. La forma del objeto está documentada en
              src/data/referencias.js. */}
          {(REFERENCIAS.length > 0 || import.meta.env.DEV) && (
            <div ref={referenciasRef} className="space-y-6 w-full [perspective:1000px]">
              <h3 className="font-display text-lg font-semibold tracking-[-0.01em]">
                {t("about.references")}
              </h3>

              {REFERENCIAS.map(({ id, cita, nombre, cargo, enlace }) => (
                <blockquote
                  key={id}
                  data-reveal
                  className="bg-light-surface dark:bg-dark-surface/30 p-6 rounded-xl border border-light-border dark:border-dark-subtle text-sm text-light-subtle dark:text-dark-subtle"
                >
                  {cita[idioma] ?? cita.es}
                  <footer className="mt-3 text-right text-xs text-light-subtle dark:text-dark-subtle">
                    — {enlace ? (
                      <a href={enlace} target="_blank" rel="noopener noreferrer" className="underline">
                        {nombre}
                      </a>
                    ) : nombre}
                    , {cargo[idioma] ?? cargo.es}
                  </footer>
                </blockquote>
              ))}

              {REFERENCIAS.length === 0 && (
                <p
                  data-reveal
                  className="rounded-xl border border-dashed border-light-border-strong dark:border-dark-border-strong p-6 text-sm text-light-subtle dark:text-dark-subtle"
                >
                  Hueco reservado para referencias reales. Solo visible en
                  desarrollo: añade objetos a <code className="font-mono">src/data/referencias.js</code>.
                </p>
              )}
            </div>
          )}

          {/* El botón vivía en un `flex justify-end` sobre un contenedor que se
              encogía al contenido, así que `justify-end` no empujaba nada y
              acababa pegado a la izquierda. Aquí el contenedor ocupa el ancho de
              la columna y la alineación funciona. */}
          <div className="flex justify-end pt-2">
            <motion.a
              // Ruta fija en public/, no un import desde src/. Importándolo, Vite
              // le pone un hash de contenido y la URL cambia en cada build: el
              // enlace que pegue en LinkedIn o en un correo deja de funcionar al
              // siguiente despliegue. Aquí el fichero se copia tal cual y la URL
              // /Juanpa-Quesada-CV.pdf es estable y se puede compartir.
              href="/Juanpa-Quesada-CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-light-accent text-white dark:bg-dark-accent dark:text-black px-6 py-3 rounded-lg font-semibold text-lg transition"
            >
              {t("about.button")}
            </motion.a>
          </div>
        </div>
      </div>

    </section>
  );
}

{/*text-light-accent dark:text-dark-accent*/}
