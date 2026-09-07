import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import useMouseTilt from "../hooks/useMouseTilt";
import { menosMovimiento } from "../lib/motion";

/**
 * El avatar del hero, con volumen y con vida propia.
 *
 * El volumen no sale de un modelo 3D. Se descartó: haría falta un glTF riggeado
 * que no se puede generar desde el repositorio, y three.js pesa del orden de
 * 150-180 KB gzip sobre los ~198 KB que pesa hoy todo el bundle. Además el
 * avatar es el elemento LCP (96 ms), y un canvas de WebGL no es candidato a
 * LCP: la métrica se iría al texto y la figura no aparecería hasta que
 * terminaran de cargar el modelo y de compilar los sombreadores.
 *
 * En su lugar, dos cosas que sí caben:
 *
 * 1. La figura se inclina hacia el cursor con perspectiva corta, el resplandor
 *    de detrás se desplaza al revés —eso es lo que separa los planos— y una luz
 *    especular sigue al puntero.
 * 2. El parpadeo y el tecleo son intercambio de fotogramas: la misma
 *    ilustración con los ojos cerrados y con la mano en otra posición. Cuesta
 *    lo que pesen dos WebP y no añade ni una librería.
 *
 * Los fotogramas extra son OPCIONALES. Si los ficheros no están, se comprueba
 * al montar y no pasa nada: el avatar se queda exactamente como estaba, sin
 * peticiones fallidas visibles ni huecos. Para activarlos basta con dejar en
 * `public/` estos dos, mismo encuadre y mismo tamaño que el original:
 *
 *   public/avatar-juanpa-blink-700.webp  -> idéntico, con los ojos cerrados
 *   public/avatar-juanpa-type-700.webp   -> idéntico, con la mano unos píxeles
 *                                           más abajo sobre el portátil
 */

const FOTOGRAMA_PARPADEO = "/avatar-juanpa-blink-700.webp";
const FOTOGRAMA_TECLEO = "/avatar-juanpa-type-700.webp";

const alAzar = (min, max) => min + Math.random() * (max - min);

const cargaBien = (src) =>
  new Promise((resolver) => {
    const img = new Image();
    img.onload = () => resolver(true);
    img.onerror = () => resolver(false);
    img.src = src;
  });

export default function HeroAvatar({ contenedorRef, areaRef, controls }) {
  const figuraRef = useRef(null);
  const haloRef = useRef(null);
  const brilloRef = useRef(null);

  const [fotogramas, setFotogramas] = useState({ parpadeo: false, tecleo: false });
  const [parpadeando, setParpadeando] = useState(false);
  const [tecleando, setTecleando] = useState(false);

  // La figura se orienta hacia el cursor esté donde esté dentro del hero, no
  // solo cuando lo tapas con el ratón: `areaRef` es la sección entera.
  // `escala: 1` porque el avatar es el elemento LCP: agrandarlo al entrar el
  // cursor cambia el tamaño del candidato a LCP y no aporta nada que no dé ya
  // la inclinación.
  useMouseTilt(figuraRef, {
    max: 14,
    perspectiva: 900,
    escala: 1,
    areaRef,
    reflejoRef: brilloRef,
    contraRef: haloRef,
    contraDistancia: 22,
  });

  // Comprobación de los fotogramas opcionales.
  //
  // Solo a partir de `md` y solo si no se ha pedido menos movimiento. Son dos
  // imágenes de ~33 KB cada una que no aportan nada en un móvil, donde la
  // figura se ve pequeña, y mandarlas por una conexión de datos para animar un
  // parpadeo no sale a cuenta. Se piden con retraso para no competir por ancho
  // de banda con el propio LCP.
  useEffect(() => {
    if (menosMovimiento()) return;
    if (!window.matchMedia("(min-width: 768px)").matches) return;

    let vivo = true;
    const id = setTimeout(async () => {
      const [parpadeo, tecleo] = await Promise.all([
        cargaBien(FOTOGRAMA_PARPADEO),
        cargaBien(FOTOGRAMA_TECLEO),
      ]);
      if (vivo) setFotogramas({ parpadeo, tecleo });
    }, 1500);

    return () => {
      vivo = false;
      clearTimeout(id);
    };
  }, []);

  // Parpadeo: 130 ms cada 3,5-7 s, con doble parpadeo de vez en cuando.
  // Los intervalos son irregulares a propósito: un parpadeo a ritmo fijo se
  // lee como un fallo de la imagen, no como un gesto.
  useEffect(() => {
    if (!fotogramas.parpadeo) return;

    let temporizador;
    const programar = (retraso) => {
      temporizador = setTimeout(() => {
        setParpadeando(true);
        temporizador = setTimeout(() => {
          setParpadeando(false);
          programar(Math.random() < 0.22 ? 220 : alAzar(3500, 7000));
        }, 130);
      }, retraso);
    };

    programar(alAzar(1200, 3000));
    return () => {
      clearTimeout(temporizador);
      setParpadeando(false);
    };
  }, [fotogramas.parpadeo]);

  // Tecleo: rachas de 1,4-2,6 s alternando cada 210 ms, con pausas entre ellas.
  // Alternar sin parar cansa la vista y además no se parece a escribir: quien
  // escribe hace rachas y para a pensar.
  useEffect(() => {
    if (!fotogramas.tecleo) return;

    let temporizador;
    const pausa = () => {
      setTecleando(false);
      temporizador = setTimeout(racha, alAzar(1200, 3200));
    };
    const racha = () => {
      const fin = Date.now() + alAzar(1400, 2600);
      const golpe = () => {
        setTecleando((v) => !v);
        temporizador = Date.now() < fin ? setTimeout(golpe, 210) : setTimeout(pausa, 210);
      };
      golpe();
    };

    temporizador = setTimeout(racha, alAzar(800, 2000));
    return () => {
      clearTimeout(temporizador);
      setTecleando(false);
    };
  }, [fotogramas.tecleo]);

  // Con la pestaña en segundo plano no se anima nada. Los temporizadores
  // seguirían corriendo y provocando renders de React que nadie ve.
  useEffect(() => {
    const alCambiarVisibilidad = () => {
      if (document.visibilityState === "hidden") {
        setParpadeando(false);
        setTecleando(false);
      }
    };
    document.addEventListener("visibilitychange", alCambiarVisibilidad);
    return () => document.removeEventListener("visibilitychange", alCambiarVisibilidad);
  }, []);

  return (
    <div
      ref={contenedorRef}
      className="relative z-30 md:w-1/2 flex justify-center items-center mt-[-20px] md:mt-0"
    >
      {/* Cuatro capas anidadas, y cada una tiene un dueño distinto. Es la única
          forma de que cuatro animaciones convivan sin pisarse el transform:
          quien escribe último gana, y el resultado son tirones.

            contenedorRef -> GSAP, salida por scroll (useHeroScroll)
            figuraRef     -> GSAP, inclinación hacia el cursor (useMouseTilt)
            halo          -> GSAP, contra-desplazamiento del resplandor
            motion.div    -> framer-motion, el flotar de siempre */}
      <div ref={figuraRef} className="group/avatar relative flex items-center justify-center">
        {/* El resplandor se mueve al revés que la figura y un poco menos: al
            inclinarse el conjunto, la luz se queda atrás como si estuviera a
            otra distancia. Es lo que separa los dos planos. */}
        <div
          ref={haloRef}
          aria-hidden="true"
          className="absolute w-[300px] h-[300px] rounded-full bg-light-accent-hover dark:bg-dark-accent blur-3xl opacity-30 z-0"
        />

        {/* El flotar va en el envoltorio, no en el <img>: los fotogramas de
            parpadeo y tecleo tienen que flotar con él, y la sombra proyectada
            se aplica una vez para todos en vez de repetirse por imagen. */}
        <motion.div
          initial={{ y: 30 }}
          animate={controls}
          className="relative z-10 w-full max-w-[250px] md:max-w-[300px] lg:max-w-[350px] drop-shadow-[0_0_12px_#00F6ED80]"
        >
          <img
            src="/avatar-juanpa-700.webp"
            srcSet="/avatar-juanpa-350.webp 350w, /avatar-juanpa-700.webp 700w"
            sizes="(max-width: 768px) 250px, 350px"
            alt="Juanpa Quesada Caballero"
            width="350"
            height="350"
            fetchPriority="high"
            decoding="async"
            className="block h-auto w-full"
          />

          {/* Fotogramas alternativos. Van encima, a tamaño exacto, y se
              encienden de golpe: un fundido entre dos poses no parece un
              parpadeo, parece una imagen fantasma.
              Nunca llevan fetchPriority ni entran en el LCP: mientras están a
              opacidad 0 no son candidatos. */}
          {fotogramas.parpadeo && (
            <img
              src={FOTOGRAMA_PARPADEO}
              alt=""
              aria-hidden="true"
              width="350"
              height="350"
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 block h-auto w-full ${parpadeando ? "opacity-100" : "opacity-0"}`}
            />
          )}
          {fotogramas.tecleo && (
            <img
              src={FOTOGRAMA_TECLEO}
              alt=""
              aria-hidden="true"
              width="350"
              height="350"
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 block h-auto w-full ${tecleando && !parpadeando ? "opacity-100" : "opacity-0"}`}
            />
          )}
        </motion.div>

        {/* Luz especular que sigue al cursor. Es un gradiente radial
            posicionado por las variables --mx/--my que escribe useMouseTilt;
            mover un gradiente no toca el layout, mover un div de brillo con
            top/left sí. `mix-blend-screen` hace que solo aclare, nunca
            ensucie, así que no puede bajar el contraste de nada. */}
        <div
          ref={brilloRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 opacity-0 mix-blend-screen transition-opacity duration-500 group-hover/avatar:opacity-100 motion-reduce:hidden"
          style={{
            background:
              "radial-gradient(200px circle at var(--mx, 50%) var(--my, 50%), rgba(0,246,237,0.28), transparent 62%)",
          }}
        />
      </div>
    </div>
  );
}
