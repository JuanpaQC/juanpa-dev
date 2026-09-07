import { useRef } from "react";
import useMouseTilt from "../hooks/useMouseTilt";

/**
 * Tarjeta que se inclina hacia el cursor, con un reflejo que lo sigue.
 *
 * Son dos capas a propósito. La de fuera lleva la perspectiva y es la que anima
 * la entrada por scroll; la de dentro es la que gira con el ratón. Si el mismo
 * nodo hiciera las dos cosas, el transform de la entrada y el del tilt se
 * pisarían: gana el último que escriba, y el usuario ve la tarjeta dar un salto
 * la primera vez que pasa el cursor por encima.
 *
 * El reflejo se dibuja con un radial-gradient posicionado por las variables
 * --mx/--my, que escribe useMouseTilt. Mover un gradiente no repinta layout;
 * mover un <div> de brillo con top/left, sí.
 */
export default function ProjectCard3D({
  children,
  className = "",
  envoltorio: Envoltorio,
  propsEnvoltorio,
  ...resto
}) {
  const tarjetaRef = useRef(null);
  const reflejoRef = useRef(null);

  useMouseTilt(tarjetaRef, { max: 6, perspectiva: 900, escala: 1.02, reflejoRef });

  // La capa que gira puede ser una ventana de macOS (MacWindow) o un div
  // pelado. Va por parámetro y no dentro: quien decide el material es quien
  // llama, y así la lógica de inclinación no sabe nada del aspecto.
  const contenido = (
    <>
      {children}
      <div
        ref={reflejoRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:hidden"
        style={{
          background:
            "radial-gradient(340px circle at var(--mx, 50%) var(--my, 50%), rgba(0,246,237,0.16), transparent 62%)",
        }}
      />
    </>
  );

  return (
    <div className="[perspective:900px]" {...resto}>
      {Envoltorio ? (
        <Envoltorio
          interiorRef={tarjetaRef}
          className={`group relative ${className}`}
          {...propsEnvoltorio}
        >
          {contenido}
        </Envoltorio>
      ) : (
        <div ref={tarjetaRef} className={`group relative ${className}`}>
          {contenido}
        </div>
      )}
    </div>
  );
}
