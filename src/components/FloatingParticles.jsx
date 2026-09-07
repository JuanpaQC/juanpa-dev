import { useRef } from "react";
import useParallax from "../hooks/useParallax";

/**
 * Motas de luz de fondo.
 *
 * Se mueven con @keyframes de CSS, no con JavaScript: son doce elementos
 * flotando indefinidamente y hacerlo desde el hilo principal significaría
 * mantener un rAF vivo toda la sesión para algo puramente decorativo. El bloque
 * de `prefers-reduced-motion` de index.css ya detiene cualquier animación CSS,
 * así que estas se paran solas sin código extra.
 *
 * Las posiciones están escritas a mano en vez de sorteadas con Math.random:
 * un aleatorio se rehace en cada render y las motas darían un salto cada vez
 * que el componente se vuelva a montar (cambio de idioma, de tema).
 */
const MOTAS = [
  { x: "8%", y: "22%", tam: 6, dur: 11, retardo: 0, opacidad: 0.22 },
  { x: "16%", y: "68%", tam: 4, dur: 14, retardo: 1.4, opacidad: 0.16 },
  { x: "27%", y: "12%", tam: 5, dur: 9, retardo: 2.6, opacidad: 0.2 },
  { x: "35%", y: "82%", tam: 3, dur: 13, retardo: 0.8, opacidad: 0.14 },
  { x: "44%", y: "38%", tam: 7, dur: 16, retardo: 3.2, opacidad: 0.18 },
  { x: "53%", y: "74%", tam: 4, dur: 10, retardo: 1.1, opacidad: 0.15 },
  { x: "62%", y: "18%", tam: 5, dur: 12, retardo: 2.1, opacidad: 0.21 },
  { x: "71%", y: "56%", tam: 3, dur: 15, retardo: 0.4, opacidad: 0.13 },
  { x: "79%", y: "28%", tam: 6, dur: 11, retardo: 3.7, opacidad: 0.19 },
  { x: "86%", y: "76%", tam: 4, dur: 9, retardo: 1.9, opacidad: 0.16 },
  { x: "92%", y: "44%", tam: 5, dur: 14, retardo: 2.9, opacidad: 0.17 },
  { x: "5%", y: "50%", tam: 3, dur: 12, retardo: 4.3, opacidad: 0.12 },
];

export default function FloatingParticles({ className = "" }) {
  const ref = useRef(null);
  useParallax(ref, { distancia: 40 });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {MOTAS.map(({ x, y, tam, dur, retardo, opacidad }) => (
        <span
          key={`${x}-${y}`}
          className="animate-flotar absolute rounded-full bg-light-accent dark:bg-dark-accent"
          style={{
            left: x,
            top: y,
            width: `${tam}px`,
            height: `${tam}px`,
            opacity: opacidad,
            animationDuration: `${dur}s`,
            animationDelay: `${retardo}s`,
          }}
        />
      ))}
    </div>
  );
}
