import { useEffect } from "react";
import Lenis from "lenis";
import i18n from "i18next";
import { gsap, ScrollTrigger, menosMovimiento } from "../lib/motion";

/**
 * Scroll suave global (Lenis) sincronizado con el ticker de GSAP.
 *
 * Los dos tienen que compartir reloj. Si Lenis corre en su propio
 * requestAnimationFrame y ScrollTrigger en el suyo, ScrollTrigger lee la
 * posición un frame tarde y todo lo enganchado al scroll va a rastras del
 * contenido.
 *
 * No pinta nada: es solo un efecto con forma de componente, para que el ciclo
 * de vida de Lenis vaya atado al del árbol de React.
 */
export default function SmoothScroll() {
  useEffect(() => {
    // Quien ha pedido menos movimiento no quiere que el scroll tenga inercia.
    // Sin Lenis, ScrollTrigger sigue funcionando contra el scroll nativo.
    if (menosMovimiento()) return;

    const lenis = new Lenis({
      duration: 1.2,
      // Exponencial de salida: arranca rápido y frena largo. Es la curva que
      // hace que el peso se note sin que el scroll parezca lento.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on("scroll", ScrollTrigger.update);

    const avanzar = (tiempo) => lenis.raf(tiempo * 1000);
    gsap.ticker.add(avanzar);
    // El anti-lag de GSAP salta el tiempo transcurrido cuando la pestaña vuelve
    // del segundo plano. Con Lenis eso se ve como un tirón del scroll.
    gsap.ticker.lagSmoothing(0);

    // Los enlaces de ancla los tiene que llevar Lenis: el salto nativo mueve el
    // scrollTop por debajo y Lenis lo deshace en el frame siguiente.
    const alPulsarAncla = (evento) => {
      if (evento.defaultPrevented || evento.button !== 0) return;
      const enlace = evento.target.closest?.('a[href^="#"]');
      const id = enlace?.getAttribute("href")?.slice(1);
      const destino = id && document.getElementById(id);
      if (!destino) return;

      evento.preventDefault();
      // Sin `offset`: Lenis ya descuenta el scroll-margin-top del destino, que
      // es el `scroll-mt-32` (128 px) que las secciones llevan para no quedar
      // debajo del navbar fijo. Pasarle además un offset de -128 lo restaba dos
      // veces y la sección aterrizaba 128 px más abajo de lo debido (medido:
      // 256 px desde el borde superior en vez de 128).
      lenis.scrollTo(destino, { duration: 1.1 });
      history.replaceState(null, "", `#${id}`);

      // Al interceptar el enlace se pierde el traslado de foco que hace el
      // navegador con un ancla. Sin esto, quien navega con teclado sigue
      // tabulando desde el navbar aunque la página ya esté en otra sección.
      if (!destino.hasAttribute("tabindex")) destino.setAttribute("tabindex", "-1");
      destino.focus({ preventScroll: true });
    };

    document.addEventListener("click", alPulsarAncla);

    // Cambiar de idioma cambia el largo de los textos y, con él, la altura de
    // las secciones. Sin recalcular, cada ScrollTrigger se queda disparando en
    // las coordenadas del idioma anterior.
    const recalcular = () => ScrollTrigger.refresh();
    i18n.on("languageChanged", recalcular);

    return () => {
      i18n.off("languageChanged", recalcular);
      document.removeEventListener("click", alPulsarAncla);
      gsap.ticker.remove(avanzar);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return null;
}
