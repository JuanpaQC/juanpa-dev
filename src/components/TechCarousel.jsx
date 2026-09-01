import { FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaGithub, FaGitAlt } from "react-icons/fa";
import { SiJavascript, SiTypescript, SiTailwindcss, SiFirebase, SiMongodb, SiExpress, SiNextdotjs, SiExpo, SiPostgresql } from "react-icons/si";
import { motion } from "framer-motion";

const technologies = [
  FaHtml5, FaCss3Alt, SiJavascript, SiTypescript, FaReact, SiNextdotjs,
  SiTailwindcss, FaNodeJs, SiExpress, SiFirebase, SiMongodb, SiPostgresql,
  FaGitAlt, FaGithub, SiExpo
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
            {[...technologies, ...technologies].map((Icon, index) => (
              <div
                key={index}
                className="text-light-accent dark:text-dark-accent text-4xl hover:scale-110 transition-transform"
              >
                <Icon />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    );
  }
  