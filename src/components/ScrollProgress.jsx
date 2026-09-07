import { useRef } from "react";
import useScrollProgress from "../hooks/useScrollProgress";

/**
 * Barra de progreso de lectura, pegada al borde superior del navbar.
 *
 * Va marcada como decorativa: el dato ya lo tiene el navegador en su propia
 * barra de scroll, y anunciarlo como progressbar en vivo haría que un lector de
 * pantalla lo cantara en cada movimiento.
 */
export default function ScrollProgress() {
  const ref = useRef(null);
  useScrollProgress(ref);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden rounded-t-2xl"
    >
      <div
        ref={ref}
        className="h-px w-full origin-left bg-gradient-to-r from-light-accent to-light-accent/20 dark:from-dark-accent dark:to-dark-accent/20"
      />
    </div>
  );
}
