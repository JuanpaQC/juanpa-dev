import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CASO_DESTACADO } from "../data/casoDestacado";
import useParallax from "../hooks/useParallax";
import useReveal from "../hooks/useReveal";
import FloatingParticles from "./FloatingParticles";

/**
 * El proyecto grande, contado con el scroll.
 *
 * El marco del teléfono se queda fijo mientras los pasos suben, y cambia cuando
 * el relato llega a cada uno. Es `position: sticky`, no un `pin` de
 * ScrollTrigger: el pin secuestra el scroll —la página deja de avanzar cuando
 * la empujas, y eso se lee como una web rota, no como una web cuidada— mientras
 * que sticky da el mismo efecto sin que el contenido deje de moverse nunca.
 *
 * Ojo con una trampa que ya nos costó una vuelta: `position: sticky` no
 * funciona si algún ancestro tiene `overflow` distinto de `visible`. Por eso
 * las motas de fondo van dentro de su propio envoltorio recortado y la sección
 * se queda solo con `relative`.
 *
 * El paso activo se decide con IntersectionObserver y no con la posición del
 * scroll: son cuatro cambios de estado en toda la sección, así que no hay un
 * render de React por frame.
 */
export default function FeaturedCase() {
  const { t } = useTranslation();
  const seccionRef = useRef(null);
  const pasosRef = useRef(null);
  const marcoRef = useRef(null);
  const [activo, setActivo] = useState(0);

  const { pasos, proporcion, archivo, tech, clave } = CASO_DESTACADO;

  useReveal(pasosRef, { selector: "[data-paso]", y: 22, stagger: 0.1, start: "top 88%", porElemento: true });
  useParallax(marcoRef, { distancia: 18 });

  useEffect(() => {
    const contenedor = pasosRef.current;
    if (!contenedor || typeof IntersectionObserver !== "function") return;

    const nodos = [...contenedor.querySelectorAll("[data-paso]")];
    const observador = new IntersectionObserver(
      (entradas) => {
        const visible = entradas
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActivo(Number(visible.target.dataset.paso));
      },
      // Banda estrecha en el centro de la pantalla: el paso activo es el que
      // el lector tiene delante, no el que asoma por abajo.
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.5, 1] }
    );

    for (const nodo of nodos) observador.observe(nodo);
    return () => observador.disconnect();
  }, []);

  return (
    <section
      id="caso"
      ref={seccionRef}
      className="scroll-mt-32 relative w-full px-6 py-20 md:py-28 bg-light-surface text-light-text dark:bg-dark-background dark:text-dark-text transition-colors"
    >
      {/* El recorte va en este envoltorio y no en la sección: con
          `overflow-hidden` en la sección, el `sticky` de abajo deja de pegarse. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <FloatingParticles className="hidden md:block" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        <header className="mb-10 md:mb-14 grid gap-2">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-light-accent dark:text-dark-accent">
            {t("featured.eyebrow")}
          </p>
          <h2 className="font-display text-2xl md:text-[1.75rem] font-bold tracking-[-0.022em]">
            {t(`projects.titles.${clave}`)}
          </h2>
          <p className="max-w-[62ch] text-light-subtle dark:text-dark-subtle">
            {t("featured.intro")}
          </p>
          <ul className="mt-1 flex flex-wrap gap-2">
            {tech.map((nombre) => (
              <li
                key={nombre}
                className="rounded-full border border-light-border dark:border-dark-border px-2.5 py-1 font-mono text-[0.7rem] text-light-text dark:text-dark-text"
              >
                {nombre}
              </li>
            ))}
          </ul>
        </header>

        <div className="grid gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-14 items-start">
          {/* Escenario fijo */}
          <div className="md:sticky md:top-28">
            <div ref={marcoRef} className="mx-auto w-full max-w-[280px]">
              {/* Marco de teléfono. La proporción se reserva siempre, haya
                  captura o no: es lo que evita que la página pegue un salto
                  cuando la imagen termine de cargar. */}
              <div
                className="vidrio vidrio-desenfoque relative overflow-hidden rounded-[2rem] border-[6px] border-light-border-strong dark:border-dark-border-strong shadow-2xl"
                style={{ aspectRatio: proporcion }}
              >
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-2 z-20 h-1.5 w-16 -translate-x-1/2 rounded-full bg-light-border-strong dark:bg-dark-border-strong"
                />

                {pasos.map((paso, i) => (
                  <div
                    key={paso.id}
                    className={`absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none ${
                      i === activo ? "opacity-100" : "opacity-0"
                    }`}
                    aria-hidden={i !== activo}
                  >
                    {paso.imagen ? (
                      <img
                        src={paso.imagen}
                        alt={paso.alt || ""}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      // Sin captura, el marco no se queda en blanco: enseña el
                      // paso en texto. Ocupa exactamente el mismo hueco, así que
                      // sustituirlo por una imagen no mueve nada.
                      <div className="flex h-full flex-col justify-center gap-3 px-6 text-center">
                        <p className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-light-accent dark:text-dark-accent">
                          {t(`featured.steps.${paso.id}.index`)}
                        </p>
                        <p className="font-display text-lg font-semibold leading-tight">
                          {t(`featured.steps.${paso.id}.title`)}
                        </p>
                        {import.meta.env.DEV && (
                          <p className="mt-2 font-mono text-[0.62rem] leading-relaxed text-light-subtle dark:text-dark-subtle">
                            hueco de captura · {paso.id}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <p className="mt-3 text-center font-mono text-[0.7rem] text-light-subtle dark:text-dark-subtle">
                {archivo}
              </p>
            </div>
          </div>

          {/* Pasos */}
          <ol ref={pasosRef} className="grid gap-px overflow-hidden rounded-xl border border-light-border dark:border-dark-border bg-light-border dark:bg-dark-border">
            {pasos.map((paso, i) => (
              <li
                key={paso.id}
                data-paso={i}
                data-reveal
                className={`grid gap-1.5 px-6 py-10 transition-colors duration-300 motion-reduce:transition-none ${
                  i === activo
                    ? "bg-light-background dark:bg-dark-surface"
                    : "bg-light-surface dark:bg-dark-background"
                }`}
              >
                <p className="font-mono text-xs tracking-[0.12em] text-light-accent dark:text-dark-accent">
                  {t(`featured.steps.${paso.id}.index`)}
                </p>
                <h3 className="font-display text-lg font-semibold tracking-[-0.01em]">
                  {t(`featured.steps.${paso.id}.title`)}
                </h3>
                <p className="max-w-[58ch] text-sm text-light-subtle dark:text-dark-subtle">
                  {t(`featured.steps.${paso.id}.body`)}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Solo en desarrollo: lo que hace falta y todavía no existe. No se
            publica un hueco con texto de relleno, y tampoco se olvida. */}
        {import.meta.env.DEV && (
          <div className="mt-10 rounded-xl border border-dashed border-light-border-strong dark:border-dark-border-strong p-6">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-light-subtle dark:text-dark-subtle">
              {t("featured.pending.title")}
            </p>
            <ul className="mt-3 grid gap-2 text-sm text-light-subtle dark:text-dark-subtle">
              <li>· {t("featured.pending.decision")}</li>
              <li>· {t("featured.pending.evidence")}</li>
              <li>· {t("featured.pending.learned")}</li>
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
