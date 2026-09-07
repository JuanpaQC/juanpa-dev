import { useEffect } from "react";
import { gsap, menosMovimiento, medible } from "../lib/motion";

/**
 * Escala horizontalmente el elemento del ref según el progreso de scroll del
 * documento: 0 arriba del todo, 1 al final.
 *
 * El hook no devuelve el progreso como estado. Devolverlo obligaría a un render
 * de React por frame de scroll, que es exactamente el defecto que se corrigió
 * en el Navbar moviendo `lastScrollY` a una ref. Aquí GSAP escribe el `scaleX`
 * sobre el nodo y React no se entera.
 *
 * Esta barra no es decoración: informa de cuánto queda de página. Por eso sigue
 * activa con movimiento reducido; lo único que se quita es el suavizado del
 * scrub, que es lo que produce el deslizamiento.
 */
export default function useScrollProgress(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !medible(el)) return;

    const tween = gsap.fromTo(
      el,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        transformOrigin: "left center",
        scrollTrigger: {
          start: 0,
          end: "max",
          scrub: menosMovimiento() ? true : 0.25,
          invalidateOnRefresh: true,
        },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [ref]);
}
