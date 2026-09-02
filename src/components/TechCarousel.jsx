import { FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaGithub, FaGitAlt } from "react-icons/fa";
import { SiJavascript, SiTypescript, SiTailwindcss, SiFirebase, SiMongodb, SiExpress, SiNextdotjs, SiExpo, SiPostgresql } from "react-icons/si";
import { motion } from "framer-motion";

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
      <div className="relative w-full flex justify-start ">
        <div className="w-[20%] overflow-hidden">
          <motion.div
            className="flex gap-8 w-max"
            animate={{ x: [0, -1000] }}
            transition={{
              duration: 20,
              ease: "linear",
              repeat: Infinity,
            }}
            whileHover={{
              transition: {
                duration: 60,
                ease: "linear",
                repeat: Infinity,
              },
            }}
          >
            {[...technologies, ...technologies].map(({ Icon, name }, index) => (
              <div
                key={index}
                title={name}
                className="text-light-accent dark:text-dark-accent text-4xl hover:scale-110 transition-transform"
              >
                <Icon aria-hidden="true" />
                <span className="sr-only">{name}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    );
  }
  