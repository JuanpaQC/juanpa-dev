import { Fragment, useRef } from "react";
import useSplitTextReveal from "../hooks/useSplitTextReveal";

/**
 * Título que entra palabra por palabra.
 *
 * Las palabras se emiten desde el JSX, no partiendo el nodo de texto desde el
 * DOM como haría SplitText. Con i18next el texto cambia al cambiar de idioma:
 * si los <span> los hubiera insertado un efecto, React reconciliaría contra
 * nodos que él no creó y puede reventar al quitarlos.
 *
 * Entre palabra y palabra va un espacio de verdad, un nodo de texto suelto: es
 * lo que hace que el nombre accesible del encabezado sea "Sobre mí" y no
 * "Sobremí". Meterlo dentro de un <span> lo arreglaba para GSAP pero lo rompía
 * para el cálculo del nombre accesible, que descarta los elementos vacíos de
 * texto útil.
 *
 * El espacio suelto sobrevive porque useSplitTextReveal no anima nada que GSAP
 * no pueda medir; el porqué está explicado en `medible()`, en lib/motion.js.
 * Hay un test que fija los dos extremos.
 */
export default function SplitReveal({
  as: Etiqueta = "h2",
  texto,
  className = "",
  opciones,
  ...resto
}) {
  const ref = useRef(null);
  useSplitTextReveal(ref, opciones);

  const palabras = String(texto ?? "").split(" ");

  return (
    <Etiqueta ref={ref} className={className} {...resto}>
      {palabras.map((palabra, i) => (
        <Fragment key={`${palabra}-${i}`}>
          <span data-palabra className="inline-block">
            {palabra}
          </span>
          {i < palabras.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Etiqueta>
  );
}
