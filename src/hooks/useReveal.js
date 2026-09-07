import { useEffect } from "react";
import { gsap, menosMovimiento, medible } from "../lib/motion";

/**
 * Revela en cascada los descendientes marcados con `data-reveal`.
 *
 * Se usa `gsap.from`, no `gsap.to` desde una clase CSS que esconda el elemento.
 * La diferencia importa: con `from`, el contenido está visible en el HTML y solo
 * el JavaScript lo oculta para animarlo. Si el script falla o tarda, se ve el
 * texto. Al revés —opacidad 0 en CSS y JS que la sube— un fallo deja la sección
 * en blanco, y eso es lo que ve un rastreador que no ejecuta scripts.
 *
 * Dos modos:
 *
 * - Por defecto, **un disparador para todo el grupo**: la cascada arranca cuando
 *   el contenedor entra en pantalla. Sirve para bloques que caben de una vez.
 * - Con `porElemento`, **un disparador por hijo**: cada uno se anima cuando entra
 *   él. Es lo que hace falta en rejillas más altas que la pantalla. Con el
 *   disparador en el contenedor, la rejilla de proyectos animaba las cuatro
 *   tarjetas a la vez al asomar la primera fila, y para cuando bajabas a la
 *   segunda ya estaba todo quieto: parecía que no pasaba nada.
 *
 * `once: true` porque re-animar al volver a subir marea y no aporta nada.
 *
 * Cuidado al anidar: `querySelectorAll` baja por todo el subárbol, así que dos
 * useReveal uno dentro de otro seleccionan los mismos nodos y se pisan la
 * opacidad. Cuando eso pase, acota el de fuera con `:scope > [data-reveal]`.
 *
 * `revision` es un valor cualquiera que, al cambiar, rehace la animación. Hace
 * falta cuando la lista de hijos cambia sin que cambie el contenedor: al filtrar
 * proyectos aparecen nodos nuevos que el efecto anterior nunca vio.
 */
export default function useReveal(
  ref,
  {
    selector = "[data-reveal]",
    y = 24,
    x = 0,
    rotacionX = 0,
    perspectiva = 900,
    clip = false,
    duracion = 0.6,
    stagger = 0.08,
    start = "top 85%",
    porElemento = false,
    activo = true,
    revision = null,
  } = {}
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !activo || menosMovimiento() || !medible(el)) return;

    const objetivos = [...el.querySelectorAll(selector)];
    if (!objetivos.length) return;

    const desde = { opacity: 0, y, x, duration: duracion, ease: "power3.out" };
    if (clip) {
      // Cortina de izquierda a derecha. Va en un tween de una sola pasada, con
      // `once`, nunca atado a scrub: un clip-path a medio camino recorta el
      // texto, y el estado intermedio de un scrub es un estado permanente
      // posible. Como termina solo, no hay forma de dejarlo cortado.
      desde.clipPath = "inset(0 100% 0 0)";
    }
    if (rotacionX) {
      desde.rotationX = rotacionX;
      // Sin perspectiva, un rotationX se ve como un aplastamiento vertical.
      desde.transformPerspective = perspectiva;
    }

    const origen = el.getBoundingClientRect().left;
    const izquierda = (nodo) => nodo.getBoundingClientRect().left - origen;

    const tweens = porElemento
      ? objetivos.map((objetivo) =>
          gsap.from(objetivo, {
            ...desde,
            // El retardo sale de la posición horizontal, no del índice: los
            // hermanos de una misma fila entran en pantalla a la vez, y el
            // índice no sabe cuántas columnas hay en este breakpoint. Con la
            // posición la onda va de izquierda a derecha sea cual sea la
            // rejilla.
            //
            // Se mide con getBoundingClientRect y no con offsetLeft: offsetLeft
            // es relativo al offsetParent —el ancestro posicionado más cercano—,
            // que aquí casi nunca es el contenedor del ref. Los <li> del stack
            // cuelgan de <section id="about" class="relative">, así que su
            // offsetLeft incluía el padding lateral de la página entera y la
            // onda salía comprimida hacia el final del rango en vez de
            // repartida. El rect es la distancia real entre los dos, sin
            // depender de quién esté posicionado.
            delay: (izquierda(objetivo) / (el.offsetWidth || 1)) * stagger * 3,
            scrollTrigger: { trigger: objetivo, start, once: true },
          })
        )
      : [
          gsap.from(objetivos, {
            ...desde,
            stagger,
            scrollTrigger: { trigger: el, start, once: true },
          }),
        ];

    return () => {
      for (const tween of tweens) {
        tween.scrollTrigger?.kill();
        tween.kill();
      }
      gsap.set(objetivos, { clearProps: "opacity,transform,clipPath" });
    };
  }, [ref, selector, y, x, rotacionX, perspectiva, clip, duracion, stagger, start, porElemento, activo, revision]);
}
