import { useEffect } from "react";
import { gsap, menosMovimiento, punteroBasto, medible } from "../lib/motion";

/**
 * Inclina el elemento hacia el cursor y mueve un reflejo con él.
 *
 * El estado del tilt no vive en React. Guardarlo como estado provocaría un
 * render por cada movimiento del ratón; el mismo error que ya se corrigió en el
 * Navbar con la posición de scroll. Aquí se escribe directamente sobre el
 * transform con `quickTo`, que reutiliza el mismo tween en vez de crear uno
 * nuevo en cada evento.
 *
 * `reflejoRef` es opcional: si se pasa, se le actualizan las variables CSS
 * --mx y --my con la posición del cursor en porcentaje.
 *
 * `areaRef` cambia quién escucha el cursor. Por defecto es el propio elemento,
 * que es lo correcto para una tarjeta. Para una figura suelta en una sección
 * grande —el avatar del hero— conviene que escuche la sección entera: así el
 * personaje se orienta hacia el cursor esté donde esté, en vez de reaccionar
 * solo cuando lo tapas con el ratón.
 *
 * `contraRef` recibe el movimiento contrario, en píxeles. Sirve para el
 * resplandor de detrás: al inclinarse la figura, la luz se queda atrás como si
 * estuviera a otra distancia, y eso es lo que separa los dos planos.
 */
export default function useMouseTilt(
  ref,
  {
    max = 8,
    perspectiva = 800,
    escala = 1.02,
    reflejoRef = null,
    areaRef = null,
    contraRef = null,
    contraDistancia = 16,
  } = {}
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || menosMovimiento() || punteroBasto() || !medible(el)) return;
    const area = areaRef?.current ?? el;

    const aX = gsap.quickTo(el, "rotationX", { duration: 0.4, ease: "power3.out" });
    const aY = gsap.quickTo(el, "rotationY", { duration: 0.4, ease: "power3.out" });
    const aEscala = gsap.quickTo(el, "scale", { duration: 0.4, ease: "power3.out" });
    const contra = contraRef?.current;
    const aContraX = contra && gsap.quickTo(contra, "x", { duration: 0.6, ease: "power3.out" });
    const aContraY = contra && gsap.quickTo(contra, "y", { duration: 0.6, ease: "power3.out" });

    gsap.set(el, { transformPerspective: perspectiva, transformOrigin: "center center" });

    const mover = (e) => {
      const zona = area.getBoundingClientRect();
      if (!zona.width || !zona.height) return;
      // La rotación se mide contra el área que escucha; el reflejo, contra el
      // propio elemento, porque es una luz sobre su superficie.
      const zx = (e.clientX - zona.left) / zona.width - 0.5;
      const zy = (e.clientY - zona.top) / zona.height - 0.5;
      // El eje X se invierte: el cursor arriba tiene que levantar el borde
      // superior, no hundirlo.
      aX(-zy * 2 * max);
      aY(zx * 2 * max);

      if (aContraX) {
        aContraX(-zx * contraDistancia);
        aContraY(-zy * contraDistancia);
      }

      if (reflejoRef?.current) {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) return;
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        reflejoRef.current.style.setProperty("--mx", `${px * 100}%`);
        reflejoRef.current.style.setProperty("--my", `${py * 100}%`);
      }
    };

    const entrar = () => aEscala(escala);
    const salir = () => {
      aX(0);
      aY(0);
      aEscala(1);
      if (aContraX) {
        aContraX(0);
        aContraY(0);
      }
    };

    area.addEventListener("pointerenter", entrar);
    area.addEventListener("pointermove", mover);
    area.addEventListener("pointerleave", salir);

    return () => {
      area.removeEventListener("pointerenter", entrar);
      area.removeEventListener("pointermove", mover);
      area.removeEventListener("pointerleave", salir);
      gsap.killTweensOf(el);
      gsap.set(el, { clearProps: "transform" });
      if (contra) {
        gsap.killTweensOf(contra);
        gsap.set(contra, { clearProps: "transform" });
      }
    };
  }, [ref, max, perspectiva, escala, reflejoRef, areaRef, contraRef, contraDistancia]);
}
