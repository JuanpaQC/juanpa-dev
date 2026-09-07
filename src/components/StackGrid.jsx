import { useRef } from "react";
import { useTranslation } from "react-i18next";
import useReveal from "../hooks/useReveal";
import TechSphere from "./TechSphere";
import { GRUPOS_STACK } from "../data/stack";

/**
 * Stack por niveles, con logotipo y el nombre al pasar el cursor.
 *
 * El nombre NO vive solo en el tooltip. Cuando el carrusel anterior guardaba las
 * tecnologías únicamente como iconos con atributo `title`, la palabra "React" no
 * aparecía ni una vez en todo el sitio: un <svg> no es contenido indexable y un
 * `title` tampoco. Por eso cada tecnología lleva su nombre en un <span sr-only>,
 * que sí está en el DOM para el rastreador y para el lector de pantalla, y el
 * tooltip visible va aparte marcado como decorativo.
 *
 * Los items no son focusables a propósito: serían 18 paradas de tabulación en
 * una rejilla que no es interactiva, y quien navega con teclado o lector ya
 * recibe el nombre por el sr-only sin necesidad del tooltip.
 *
 * La lista vive en `src/data/stack.js` porque el globo del hero usa la misma.
 */

export default function StackGrid() {
  const { t } = useTranslation();
  const rejillaRef = useRef(null);

  // La onda de entrada se queda solo para la fila de "aprendiendo". Los
  // logotipos del globo no entran aquí a propósito: su posición la escribe el
  // efecto de la esfera en cada frame, y un `from` de GSAP sobre el mismo
  // transform lo pisaría —es el conflicto que ya está documentado en Card.jsx
  // entre framer-motion y GSAP, con otros dos actores.
  useReveal(rejillaRef, {
    selector: '[data-grupo="learning"] li',
    y: 14,
    stagger: 0.03,
    start: "top 92%",
    porElemento: true,
  });

  return (
    <div className="w-full">
      <h3 className="font-display text-lg font-semibold tracking-[-0.01em] mb-5 text-center">
        {t("about.stack.title")}
      </h3>

      <dl ref={rejillaRef} className="space-y-8">
        {GRUPOS_STACK.map(({ id, items }) => (
          <div key={id} data-grupo={id}>
            <dt className="font-mono text-xs uppercase tracking-[0.12em] text-light-accent dark:text-dark-accent mb-3 text-center">
              {t(`about.stack.${id}`)}
            </dt>
            <dd>
              {/* Lo que ya domina va en el globo; lo que está aprendiendo se
                  queda en una fila normal debajo. No es un capricho de
                  maquetación: en el globo los logotipos flotan sueltos, sin un
                  encabezado pegado al lado que los matice, y "TypeScript"
                  girando entre los demás se lee como una más del montón. */}
              {id === "works" ? (
                <TechSphere items={items} />
              ) : (
                <ul className="flex flex-wrap justify-center gap-3">
                  {items.map(({ Icon, name, key, hover }) => {
                    const etiqueta = name || t(`about.stack.items.${key}`);
                    return (
                      <li key={etiqueta} className="group relative">
                        <Icon
                          aria-hidden="true"
                          className={`text-3xl text-light-subtle dark:text-dark-subtle ${hover}
                            transition duration-200 group-hover:-translate-y-0.5
                            motion-reduce:transition-none motion-reduce:group-hover:translate-y-0`}
                        />
                        <span className="sr-only">{etiqueta}</span>

                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap
                            rounded-md border border-light-border dark:border-dark-border
                            bg-light-surface dark:bg-dark-background
                            px-2 py-1 font-mono text-xs text-light-text dark:text-dark-text
                            opacity-0 shadow-lg transition-opacity duration-150
                            group-hover:opacity-100 motion-reduce:transition-none"
                        >
                          {etiqueta}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
