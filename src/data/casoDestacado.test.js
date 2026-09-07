import { describe, it, expect } from "vitest";
import { CASO_DESTACADO } from "./casoDestacado";

/**
 * Red de seguridad, no una prueba de comportamiento.
 *
 * Para comprobar que el marco del teléfono aguanta imágenes reales se generaron
 * cuatro capturas sintéticas en `public/casos/prueba-0N.webp`. Son útiles para
 * mirar la sección en local y son mentira: no enseñan AgroClass, enseñan
 * rectángulos. Si alguien despliega con ellas puestas, el sitio estaría
 * afirmando algo falso sobre un proyecto, que es justo lo que acabamos de
 * quitar de las referencias.
 *
 * Esta prueba falla mientras sigan conectadas. Es deliberado: es el recordatorio
 * de que hay que sustituirlas por capturas reales o volver a poner `null`.
 */
describe("caso destacado", () => {
  it("no publica capturas de prueba", () => {
    const dePrueba = CASO_DESTACADO.pasos
      .filter((p) => typeof p.imagen === "string" && p.imagen.includes("/casos/prueba-"))
      .map((p) => `${p.id} -> ${p.imagen}`);

    expect(
      dePrueba,
      "Hay capturas sintéticas conectadas. Sustitúyelas por las reales en " +
        "public/casos/, o vuelve a poner `imagen: null` en src/data/casoDestacado.js."
    ).toEqual([]);
  });

  it("cada captura declara un texto alternativo", () => {
    const sinAlt = CASO_DESTACADO.pasos.filter((p) => p.imagen && !p.alt).map((p) => p.id);
    expect(sinAlt).toEqual([]);
  });

  it("reserva una proporción para el marco, que es lo que evita el salto de maquetación", () => {
    expect(CASO_DESTACADO.proporcion).toMatch(/^\d+(\.\d+)?\s*\/\s*\d+(\.\d+)?$/);
  });
});
