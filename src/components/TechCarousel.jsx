import { FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaGithub, FaGitAlt } from "react-icons/fa";
import { SiJavascript, SiTypescript, SiTailwindcss, SiFirebase, SiMongodb, SiExpress, SiNextdotjs, SiExpo, SiPostgresql } from "react-icons/si";

// Cada icono lleva su nombre: un <svg> suelto no tiene nombre accesible
// (un lector de pantalla solo anuncia "imagen") ni es texto indexable.
const technologies = [
  { Icon: FaHtml5, name: "HTML" },
  { Icon: FaCss3Alt, name: "CSS" },
  { Icon: SiJavascript, name: "JavaScript" },
  { Icon: SiTypescript, name: "TypeScript" },
  { Icon: FaReact, name: "React" },
  { Icon: SiNextdotjs, name: "Next.js" },
  { Icon: SiTailwindcss, name: "Tailwind CSS" },
  { Icon: FaNodeJs, name: "Node.js" },
  { Icon: SiExpress, name: "Express" },
  { Icon: SiFirebase, name: "Firebase" },
  { Icon: SiMongodb, name: "MongoDB" },
  { Icon: SiPostgresql, name: "PostgreSQL" },
  { Icon: FaGitAlt, name: "Git" },
  { Icon: FaGithub, name: "GitHub" },
  { Icon: SiExpo, name: "Expo" },
];

export default function TechCarousel() {
  return (
    // La marquesina pasa de Framer Motion a una animación CSS. Tres motivos:
    //  1. El `whileHover` que había declaraba una `transition` sin ninguna
    //     propiedad que animar, así que no ralentizaba nada: era código muerto.
    //     Con CSS, `animation-play-state: paused` pausa de verdad, y también
    //     al recibir foco de teclado, no solo con el ratón.
    //  2. Animaba `x: [0, -1000]` en píxeles. Mil píxeles es un número
    //     arbitrario que no coincide con el ancho real de la pista, así que el
    //     bucle daba un salto visible al reiniciarse. Con -50% sobre la pista
    //     duplicada, el reinicio es exacto e invisible.
    //  3. Una animación CSS no depende de requestAnimationFrame ni de que
    //     React esté hidratado: sigue funcionando aunque el JS falle.
    <div className="relative w-full flex justify-start">
      <div className="w-[20%] overflow-hidden group">
        <div
          className="flex gap-8 w-max animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] motion-reduce:animate-none"
          role="list"
          aria-label="Tecnologías con las que trabajo"
        >
          {[...technologies, ...technologies].map(({ Icon, name }, index) => (
            <div
              key={index}
              role="listitem"
              title={name}
              className="text-light-accent dark:text-dark-accent text-4xl hover:scale-110 transition-transform motion-reduce:transition-none"
            >
              <Icon aria-hidden="true" />
              <span className="sr-only">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
