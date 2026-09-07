import { useEffect } from "react";
import { gsap, menosMovimiento, medible } from "../lib/motion";

/**
 * Secuencia del hero: la entrada al cargar y la salida al hacer scroll.
 *
 * El plan pedía fijar (pin) la sección durante 100vh y animarla por dentro.
 * Se descartó: quien evalúa un portafolio hace scroll deprisa, y una sección
 * que no avanza cuando se empuja se lee como una web rota, no como una web
 * cuidada. El efecto se consigue igual con parallax y scrub, sin secuestrar el
 * scroll.
 *
 * El <h1> no entra aquí a propósito. Su animación es el tecleo, que es la
 * identidad del sitio, y además es de lo primero que se pinta: cualquier
 * animación de opacidad sobre él se sumaría al LCP.
 *
 * Del avatar se anima el contenedor, no la imagen. La imagen es el elemento
 * LCP y ya tiene su propio flotar con framer-motion; dos librerías escribiendo
 * el transform del mismo nodo se pisan, y gana la última en ejecutarse.
 */
export default function useHeroScroll({ seccionRef, fondoRef, textoRef, subtituloRef, botonRef, avatarRef }) {
  // Entrada escalonada al cargar.
  useEffect(() => {
    if (menosMovimiento() || !medible(seccionRef.current)) return;

    const linea = gsap.timeline({ delay: 0.15 });

    if (subtituloRef.current) {
      linea.from(subtituloRef.current, {
        // Cortina de izquierda a derecha. Es clip-path, no opacity: el texto ya
        // está pintado y solo se descubre, así que no hay un frame en el que la
        // primera pantalla esté vacía.
        clipPath: "inset(0 100% 0 0)",
        duration: 0.65,
        ease: "power3.out",
      });
    }

    if (botonRef.current) {
      linea.from(
        botonRef.current,
        { y: 26, opacity: 0, duration: 0.55, ease: "back.out(1.6)" },
        "-=0.35"
      );
    }

    return () => linea.kill();
  }, [seccionRef, subtituloRef, botonRef]);

  // Salida por scroll.
  useEffect(() => {
    if (menosMovimiento() || !medible(seccionRef.current)) return;

    const comun = {
      ease: "none",
      scrollTrigger: {
        trigger: seccionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 0.5,
        invalidateOnRefresh: true,
      },
    };

    const tweens = [
      // El fondo se acerca más despacio de lo que sube el contenido: ese
      // desfase es todo el efecto de profundidad.
      fondoRef.current && gsap.to(fondoRef.current, { scale: 1.15, ...comun }),
      textoRef.current && gsap.to(textoRef.current, { x: -90, opacity: 0, ...comun }),
      avatarRef.current && gsap.to(avatarRef.current, { y: -70, scale: 1.08, ...comun }),
    ].filter(Boolean);

    return () => {
      for (const tween of tweens) {
        tween.scrollTrigger?.kill();
        tween.kill();
      }
    };
  }, [seccionRef, fondoRef, textoRef, avatarRef]);
}
