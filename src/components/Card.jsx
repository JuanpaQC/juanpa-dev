import { useRef } from "react";
import { useTranslation } from "react-i18next";
import useMouseTilt from "../hooks/useMouseTilt";
import MacWindow from "./MacWindow";

/**
 * Tarjeta de red social, con la misma inclinación al cursor que las de
 * proyectos.
 *
 * El hover ya no lo lleva framer-motion. Su `whileHover` escribe el transform
 * del nodo, y el tilt escribe ese mismo transform en cada movimiento del ratón:
 * conviviendo, gana el último que escriba y la tarjeta pega tirones. La
 * elevación pasa a ser sombra en CSS, que no toca el transform.
 */
export default function Card({ platform, name, username, image, imageAlt, link, icon, ...resto }) {
  const { t } = useTranslation();
  const tarjetaRef = useRef(null);
  const reflejoRef = useRef(null);

  useMouseTilt(tarjetaRef, { max: 5, perspectiva: 900, escala: 1.02, reflejoRef });

  return (
    <div className="[perspective:900px]" {...resto}>
      <MacWindow
        variante="esquina"
        redondeo="rounded-2xl"
        marca={platform}
        interiorRef={tarjetaRef}
        className="group flex w-full flex-col p-8 transition-shadow duration-300 hover:shadow-2xl hover:ring-1 hover:ring-light-accent/30 dark:hover:ring-dark-accent/30"
      >
        {/* Contenido */}
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 mt-7">
          <div className="flex items-center gap-4">
            {image ? (
              <img src={image} alt={imageAlt || ""} width="64" height="64" loading="lazy" className="w-16 h-16 rounded-full" />
            ) : (
              <div className="text-5xl">{icon}</div>
            )}
            <div className="flex flex-col text-center md:text-left">
              <h3 className="text-lg font-bold">{name}</h3>
              <p className="text-sm text-light-subtle dark:text-dark-subtle">{username}</p>
            </div>
          </div>

          {/* Botón */}
          <div className="w-full md:w-auto flex justify-center md:justify-end">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-light-accent text-white dark:bg-dark-accent dark:text-black py-2 px-6 rounded-xl text-sm font-semibold tracking-wide hover:scale-105 hover:brightness-105 transition-all duration-300 min-w-[140px] text-center"
            >
              {platform === "Gmail"
                ? t("contact.social.mail")
                : t("contact.social.button")}
            </a>
          </div>
        </div>

        {/* Reflejo que sigue al cursor. Las variables --mx/--my las escribe
            useMouseTilt sin pasar por React. */}
        <div
          ref={reflejoRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:hidden"
          style={{
            background:
              "radial-gradient(300px circle at var(--mx, 50%) var(--my, 50%), rgba(0,246,237,0.14), transparent 62%)",
          }}
        />
      </MacWindow>
    </div>
  );
}
{/*text-light-accent dark:text-dark-accent*/}
