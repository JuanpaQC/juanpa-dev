import { useEffect, useRef } from "react";
import { gsap, menosMovimiento, medible } from "../lib/motion";

/**
 * Línea que se dibuja de izquierda a derecha al entrar en pantalla.
 *
 * Marca el corte entre secciones sin meter un borde duro: las cuatro secciones
 * alternan fondo (background / surface) y el salto de color se notaba como un
 * escalón. El degradado a transparente en los extremos evita que la línea
 * termine en seco contra el borde del viewport.
 */
export default function SectionDivider() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Sin animación no hay nada que hacer: el estado por defecto en CSS ya es
    // la línea entera. Solo el tween la encoge para luego dibujarla.
    if (menosMovimiento() || !medible(el)) return;

    const tween = gsap.fromTo(
      el,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.1,
        ease: "power3.inOut",
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div aria-hidden="true" className="relative h-px w-full overflow-hidden">
      <div
        ref={ref}
        className="h-px w-full origin-left bg-gradient-to-r from-transparent via-light-accent/40 to-transparent dark:via-dark-accent/40"
      />
    </div>
  );
}
