import { useTranslation } from "react-i18next";
import {
  SiReact, SiExpo, SiFirebase, SiJavascript, SiGit, SiNodedotjs,
  SiCloudinary, SiTailwindcss, SiFigma, SiTypescript, SiJest,
  SiGithubactions, SiOpenjdk, SiPython,
} from "react-icons/si";
import { FaExchangeAlt, FaSitemap, FaSyncAlt } from "react-icons/fa";

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
 * Los items no son focusables a propósito: serían 17 paradas de tabulación en
 * una rejilla que no es interactiva, y quien navega con teclado o lector ya
 * recibe el nombre por el sr-only sin necesidad del tooltip.
 *
 * `name` va tal cual porque son marcas y no se traducen. `key` es para conceptos
 * que sí cambian de idioma.
 */
const niveles = [
  {
    id: "ships",
    items: [
      { Icon: SiReact, name: "React Native", hover: "group-hover:text-[#61DAFB]" },
      { Icon: SiExpo, name: "Expo", hover: "group-hover:text-light-text dark:group-hover:text-white" },
      { Icon: SiFirebase, name: "Firebase", hover: "group-hover:text-[#FFCA28]" },
      { Icon: SiReact, name: "React", hover: "group-hover:text-[#61DAFB]" },
      { Icon: SiJavascript, name: "JavaScript", hover: "group-hover:text-[#E8CE1B]" },
      { Icon: SiGit, name: "Git", hover: "group-hover:text-[#F05032]" },
    ],
  },
  {
    id: "real",
    items: [
      { Icon: SiNodedotjs, name: "Node.js", hover: "group-hover:text-[#6FBF5B]" },
      { Icon: FaExchangeAlt, key: "restApis", hover: "group-hover:text-light-accent dark:group-hover:text-dark-accent" },
      { Icon: SiCloudinary, name: "Cloudinary", hover: "group-hover:text-[#7B8CE8]" },
      { Icon: SiTailwindcss, name: "Tailwind CSS", hover: "group-hover:text-[#06B6D4]" },
      { Icon: SiFigma, name: "Figma", hover: "group-hover:text-[#F24E1E]" },
    ],
  },
  {
    id: "academic",
    items: [
      { Icon: SiOpenjdk, name: "Java", hover: "group-hover:text-[#F89820]" },
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
      { Icon: SiJest, name: "Jest", hover: "group-hover:text-[#E8455A]" },
      { Icon: SiGithubactions, key: "cicd", hover: "group-hover:text-[#4D9BFF]" },
    ],
  },
];

export default function StackGrid() {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <h3 className="font-display text-lg font-semibold tracking-[-0.01em] mb-5">
        {t("about.stack.title")}
      </h3>

      <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
        {niveles.map(({ id, items }) => (
          <div key={id}>
            <dt className="font-mono text-xs uppercase tracking-[0.12em] text-light-accent dark:text-dark-accent mb-3">
              {t(`about.stack.${id}`)}
            </dt>
            <dd>
              <ul className="flex flex-wrap gap-3">
                {items.map(({ Icon, name, key, hover }) => {
                  const etiqueta = name || t(`about.stack.items.${key}`);
                  return (
                    <li key={etiqueta} className="group relative">
                      {/* En reposo van en tinta, no en color de marca. Siete
                          logotipos con su color real caían por debajo de 3:1
                          sobre el fondo oscuro —Jest a 1,52:1, Cloudinary a
                          1,71:1— porque sus marcas son oscuras de origen. El
                          color aparece al pasar el cursor, junto al nombre.
                          Los tonos oscuros llevan una variante aclarada. */}
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
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
