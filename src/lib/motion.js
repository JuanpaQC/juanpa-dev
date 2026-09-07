import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registro único del plugin. Todo el que anime por scroll importa desde aquí,
// no desde "gsap" directamente: si cada módulo registrara por su cuenta,
// bastaría con que uno olvidara hacerlo para que sus ScrollTrigger fueran
// silenciosamente ignorados.
gsap.registerPlugin(ScrollTrigger);

/**
 * Lee la preferencia de movimiento reducido en el momento de la llamada.
 *
 * No es un hook a propósito: los efectos de GSAP se montan dentro de useEffect
 * y necesitan el valor de forma síncrona. El `useReducedMotion` de framer-motion
 * devuelve null en el primer render, y para entonces la animación ya se habría
 * creado.
 *
 * Sin matchMedia (jsdom, entornos sin DOM) se asume la opción conservadora:
 * no animar.
 */
export function menosMovimiento() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return true;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * ¿Tiene el elemento una caja que GSAP pueda medir?
 *
 * Es la misma condición que usa CSSPlugin internamente, y hace falta saberla de
 * antemano porque su plan B es destructivo: cuando no puede leer la matriz de
 * transformación de un elemento, lo saca del DOM, lo mide colgado de <html> y
 * lo devuelve con `parent.insertBefore(target, target.nextElementSibling)`.
 * Ese `nextElementSibling` se salta los nodos de texto, así que el espacio
 * entre dos <span> de un título termina desplazado al principio: "Sobre mí"
 * se convierte en " Sobremí", y con él el nombre accesible del encabezado.
 *
 * En el navegador esto solo pasa con elementos de ancho cero o dentro de un
 * contenedor oculto —donde la animación no se vería igualmente—, y en jsdom
 * pasa siempre, porque todas las cajas miden 0. En los dos casos la respuesta
 * correcta es la misma: no animar.
 */
export function medible(el) {
  if (!el || typeof el.getBoundingClientRect !== "function") return false;
  return Boolean(el.offsetParent) || el.getBoundingClientRect().width > 0;
}

/** Puntero sin hover real: en táctil el tilt al cursor no tiene sentido. */
export function punteroBasto() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return true;
  }
  return window.matchMedia("(hover: none)").matches;
}

export { gsap, ScrollTrigger };
