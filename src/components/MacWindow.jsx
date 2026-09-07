/**
 * La ventana de macOS del sitio, en un solo sitio.
 *
 * Existía tres veces con tres aspectos distintos: los perfiles de Contacto en
 * el azul de marca, las tarjetas de proyecto en un gris `#1e1e1e` y el marco de
 * la foto en otro gris, con bordes `gray-500`, `gray-600` y `gray-700` según
 * dónde mirases. Eran hex sueltos, que además es lo que prohíbe la invariante
 * de color de AGENTS.md. Ahora el material sale de `.vidrio` en index.css y
 * este componente es el único que dibuja el marco.
 *
 * Dos variantes, porque el sitio necesita las dos:
 *
 * - `barra` — con barra de título. Es la de las tarjetas de proyecto y el marco
 *   de la foto: la ruta del fichero es contenido, no adorno.
 * - `esquina` — los tres puntos flotando sobre el contenido, sin barra. Es la
 *   de las tarjetas de perfil, donde el contenido ya empieza arriba del todo.
 */

function Puntos({ tamano = "w-3 h-3" }) {
  return (
    <>
      <span className={`${tamano} rounded-full bg-[#FF5F57] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,.22)]`} />
      <span className={`${tamano} rounded-full bg-[#FEBC2E] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,.22)]`} />
      <span className={`${tamano} rounded-full bg-[#28C840] shadow-[inset_0_0_0_0.5px_rgba(0,0,0,.22)]`} />
    </>
  );
}

export default function MacWindow({
  variante = "barra",
  titulo,
  marca,
  redondeo = "rounded-xl",
  desenfoque = true,
  className = "",
  interiorRef,
  children,
  ...resto
}) {
  const material = `vidrio ${desenfoque ? "vidrio-desenfoque" : ""} ${redondeo}`;

  if (variante === "esquina") {
    return (
      <div
        ref={interiorRef}
        className={`${material} relative overflow-hidden ${className}`}
        {...resto}
      >
        {/* Los tres puntos son decorativos: no dan información que no esté ya
            en el contenido, y anunciarlos sería ruido en un lector de pantalla. */}
        <div aria-hidden="true" className="absolute top-4 left-4 flex gap-2">
          <Puntos tamano="w-2.5 h-2.5" />
        </div>
        {marca && (
          <div className="absolute top-4 right-4 font-mono text-xs tracking-wide text-light-subtle dark:text-dark-subtle">
            {marca}
          </div>
        )}
        {children}
      </div>
    );
  }

  return (
    <div
      ref={interiorRef}
      className={`${material} overflow-hidden ${className}`}
      {...resto}
    >
      <div className="vidrio-barra flex items-center gap-2 px-3 py-2">
        <span aria-hidden="true" className="flex items-center gap-2">
          <Puntos />
        </span>
        {titulo && (
          <span className="ml-2 truncate font-mono text-xs tracking-wide text-light-subtle dark:text-dark-subtle">
            {titulo}
          </span>
        )}
        {marca && (
          <span className="ml-auto font-mono text-xs tracking-wide text-light-subtle dark:text-dark-subtle">
            {marca}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
