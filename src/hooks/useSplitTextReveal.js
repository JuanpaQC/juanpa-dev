import { useEffect } from "react";
import { gsap, menosMovimiento, medible } from "../lib/motion";

/**
 * Anima palabra por palabra los `[data-palabra]` que haya dentro del ref.
 *
 * El troceado del texto NO se hace aquí. Partir el nodo de texto desde el DOM
 * es lo habitual con SplitText, pero React es dueño de esos hijos: al cambiar
 * de idioma reconciliaría contra unos <span> que él no puso. Las palabras se
 * emiten desde el JSX (ver SplitReveal) y este hook solo las anima.
 */
export default function useSplitTextReveal(
  ref,
  { y = "100%", duracion = 0.7, stagger = 0.05, start = "top 85%", activo = true } = {}
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !activo || menosMovimiento() || !medible(el)) return;

    const palabras = el.querySelectorAll("[data-palabra]");
    if (!palabras.length) return;

    const tween = gsap.from(palabras, {
      yPercent: parseFloat(y),
      opacity: 0,
      duration: duracion,
      stagger,
      ease: "power4.out",
      scrollTrigger: { trigger: el, start, once: true },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(palabras, { clearProps: "opacity,transform" });
    };
  }, [ref, y, duracion, stagger, start, activo]);
}
