import { useEffect } from "react";
import { gsap, menosMovimiento, medible } from "../lib/motion";

/**
 * Parallax vertical: el elemento se desplaza en sentido contrario al scroll
 * mientras cruza la pantalla, lo que lo hace parecer más lejano o más cercano
 * que lo que tiene al lado.
 *
 * `distancia` es el recorrido en píxeles a cada lado del centro, no un
 * multiplicador de velocidad. Un multiplicador suena más elegante pero depende
 * de la altura del viewport y del alto del propio elemento, así que el mismo
 * 0.8 daba 30 px en móvil y 200 px en un monitor grande.
 *
 * Se anima `y` (transform), nunca `top`: mover el flujo del documento en cada
 * frame de scroll obliga al navegador a rehacer el layout entero.
 */
export default function useParallax(ref, { distancia = 60, activo = true } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !activo || menosMovimiento() || !medible(el)) return;

    const tween = gsap.fromTo(
      el,
      { y: distancia },
      {
        y: -distancia,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(el, { clearProps: "transform" });
    };
  }, [ref, distancia, activo]);
}
