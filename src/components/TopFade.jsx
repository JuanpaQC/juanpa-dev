/**
 * Velo superior con desenfoque progresivo.
 *
 * Antes esto era una sola franja con `backdrop-blur-md`. El problema es que un
 * backdrop-filter no tiene medias tintas: dentro del elemento el desenfoque
 * está al 100% y un píxel por debajo de su borde está a 0. Eso dibuja una línea
 * horizontal nítida que corta la página en dos.
 *
 * La solución es apilar varias capas. Cada una lleva más desenfoque que la
 * anterior pero está enmascarada para desvanecerse antes, así que cerca del
 * borde superior contribuyen las cuatro y el desenfoque es máximo, mientras que
 * hacia abajo van desapareciendo una a una hasta llegar a cero. El resultado es
 * un degradado de nitidez, no un escalón.
 *
 * La máscara necesita el prefijo -webkit- para Safari.
 */

// `solido`: hasta dónde la capa se aplica entera.
// `fin`: dónde ha desaparecido del todo.
const capas = [
  { blur: "16px", solido: "16%", fin: "38%" },
  { blur: "8px", solido: "40%", fin: "60%" },
  { blur: "4px", solido: "64%", fin: "82%" },
  { blur: "2px", solido: "86%", fin: "100%" },
];

const mascara = (solido, fin) =>
  `linear-gradient(to bottom, black 0%, black ${solido}, transparent ${fin})`;

export default function TopFade() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-40 h-28"
    >
      {capas.map(({ blur, solido, fin }) => (
        <div
          key={blur}
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(${blur})`,
            WebkitBackdropFilter: `blur(${blur})`,
            maskImage: mascara(solido, fin),
            WebkitMaskImage: mascara(solido, fin),
          }}
        />
      ))}

      {/* El tinte que ya tenías, con su propio degradado para que tampoco
          termine en un canto. */}
      <div className="absolute inset-0 bg-gradient-to-b from-light-surface/70 via-light-surface/25 to-transparent dark:from-dark-background/70 dark:via-dark-background/25 dark:to-transparent" />
    </div>
  );
}
