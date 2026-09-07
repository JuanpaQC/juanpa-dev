import {
  SiReact, SiExpo, SiFirebase, SiJavascript, SiGit, SiNodedotjs,
  SiCloudinary, SiTailwindcss, SiFigma, SiTypescript, SiJest,
  SiGithubactions, SiPython,
} from "react-icons/si";
import { FaExchangeAlt, FaSitemap, FaSyncAlt, FaJava } from "react-icons/fa";

/**
 * Única fuente de verdad de "qué sabe hacer".
 *
 * Vive fuera de los componentes porque la usan dos: la rejilla de About
 * (StackGrid) y el globo del hero (TechSphere). Teniéndola duplicada, cualquier
 * tecnología que se añadiera en un sitio y no en el otro dejaría el sitio
 * contradiciéndose a sí mismo.
 *
 * `name` va tal cual porque son marcas y no se traducen. `key` es para conceptos
 * que sí cambian de idioma y se resuelven con `t(\`about.stack.items.${key}\`)`.
 */
export const GRUPOS_STACK = [
  {
    id: "works",
    items: [
      { Icon: SiReact, name: "React Native", hover: "group-hover:text-[#61DAFB]" },
      { Icon: SiExpo, name: "Expo", hover: "group-hover:text-light-text dark:group-hover:text-white" },
      { Icon: SiFirebase, name: "Firebase", hover: "group-hover:text-[#FFCA28]" },
      { Icon: SiReact, name: "React", hover: "group-hover:text-[#61DAFB]" },
      { Icon: SiJavascript, name: "JavaScript", hover: "group-hover:text-[#E8CE1B]" },
      { Icon: SiNodedotjs, name: "Node.js", hover: "group-hover:text-[#6FBF5B]" },
      // Jest va aquí, no en "aprendiendo": el hero ya dice "pruebas con Jest"
      // y lo usa en AgriVision. El stack no puede desmentir al hero.
      { Icon: SiJest, name: "Jest", hover: "group-hover:text-[#E8455A]" },
      { Icon: SiGit, name: "Git", hover: "group-hover:text-[#F05032]" },
      { Icon: FaExchangeAlt, key: "restApis", hover: "group-hover:text-light-accent dark:group-hover:text-dark-accent" },
      { Icon: SiCloudinary, name: "Cloudinary", hover: "group-hover:text-[#7B8CE8]" },
      { Icon: SiTailwindcss, name: "Tailwind CSS", hover: "group-hover:text-[#06B6D4]" },
      { Icon: SiFigma, name: "Figma", hover: "group-hover:text-[#F24E1E]" },
      { Icon: FaJava, name: "Java", hover: "group-hover:text-[#E76F00]" },
      { Icon: SiPython, name: "Python", hover: "group-hover:text-[#5B9BD5]" },
      // Glifo del ciclo de sprint, no el logotipo de Scrum Alliance: usar la
      // marca de la organización insinuaría una certificación que no tiene.
      { Icon: FaSyncAlt, name: "Scrum", hover: "group-hover:text-light-accent dark:group-hover:text-dark-accent" },
      { Icon: FaSitemap, key: "oop", hover: "group-hover:text-light-accent dark:group-hover:text-dark-accent" },
    ],
  },
  {
    id: "learning",
    items: [
      { Icon: SiTypescript, name: "TypeScript", hover: "group-hover:text-[#5B9BD5]" },
      { Icon: SiGithubactions, key: "cicd", hover: "group-hover:text-[#4D9BFF]" },
    ],
  },
];

/** Solo lo que ya domina. Lo de "aprendiendo" se queda fuera del globo del hero
 *  a propósito: ahí no hay etiqueta que lo matice, y una palabra flotando junto
 *  a las demás se lee como una más del montón. En About sí aparece, bajo su
 *  encabezado. */
export const STACK_DOMINADO = GRUPOS_STACK.find((g) => g.id === "works").items;
