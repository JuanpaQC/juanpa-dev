import { describe, it, expect, beforeEach } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * El tema antes del primer pintado, y el color de la barra de estado.
 *
 * Regresión de dos defectos que se veían como uno solo: al pasarse de largo con
 * el scroll asomaba un blanco por detrás del sitio, y en el móvil la barra de
 * notificaciones salía blanca.
 *
 * Las causas eran tres:
 *   1. <html> no tenía fondo. El navegador propaga el fondo de <html> al lienzo
 *      —la zona del rebote elástico—, y sin fondo lo pinta blanco.
 *   2. Las metas `theme-color` iban con `prefers-color-scheme`, así que seguían
 *      al sistema operativo y no a la elección guardada del sitio. Y el valor
 *      claro era #FFFFFF, blanco puro, no el #FAF8F4 del sitio.
 *   3. La clase `dark` se añadía en un useEffect, o sea después de pintar, así
 *      que el primer fotograma salía claro aunque el tema fuera oscuro.
 *
 * Esta prueba no simula la lógica: extrae el script en línea de index.html y lo
 * ejecuta tal cual. Si alguien lo cambia o lo borra, falla aquí.
 */

const html = readFileSync(resolve(process.cwd(), "index.html"), "utf8");

function scriptDelTema() {
  // El script del tema es el único en línea del <head> que toca classList.
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const encontrado = scripts.find((s) => s.includes('classList.add("dark")'));
  if (!encontrado) throw new Error("No está el script de tema en línea de index.html");
  return encontrado;
}

function montar({ guardado, sistemaOscuro }) {
  document.documentElement.className = "";
  document.head.innerHTML = '<meta name="theme-color" content="#FAF8F4" />';
  localStorage.clear();
  if (guardado) localStorage.setItem("theme", guardado);
  window.matchMedia = (consulta) => ({
    matches: consulta.includes("prefers-color-scheme: dark") ? sistemaOscuro : false,
    media: consulta,
    addEventListener() {}, removeEventListener() {},
    addListener() {}, removeListener() {}, dispatchEvent: () => false,
  });
  new Function(scriptDelTema())();
  return {
    oscuro: document.documentElement.classList.contains("dark"),
    barra: document.querySelector('meta[name="theme-color"]').getAttribute("content"),
  };
}

const CLARO = "#FAF8F4";
const OSCURO = "#0D1B2A";

describe("tema antes del primer pintado", () => {
  beforeEach(() => { document.documentElement.className = ""; });

  it("la elección guardada manda sobre el sistema, en los dos sentidos", () => {
    // Este es el caso que estaba roto: sistema en claro, sitio en oscuro.
    expect(montar({ guardado: "dark", sistemaOscuro: false }))
      .toEqual({ oscuro: true, barra: OSCURO });
    expect(montar({ guardado: "light", sistemaOscuro: true }))
      .toEqual({ oscuro: false, barra: CLARO });
  });

  it("sin nada guardado, sigue al sistema", () => {
    expect(montar({ guardado: null, sistemaOscuro: true }))
      .toEqual({ oscuro: true, barra: OSCURO });
    expect(montar({ guardado: null, sistemaOscuro: false }))
      .toEqual({ oscuro: false, barra: CLARO });
  });

  it("la barra de estado nunca es blanco puro", () => {
    for (const caso of [
      { guardado: "dark", sistemaOscuro: false },
      { guardado: "light", sistemaOscuro: true },
      { guardado: null, sistemaOscuro: false },
    ]) {
      expect(montar(caso).barra.toUpperCase()).not.toBe("#FFFFFF");
    }
  });

  it("no queda ninguna meta theme-color atada a prefers-color-scheme", () => {
    expect(html).not.toMatch(/theme-color[^>]*prefers-color-scheme/);
  });
});

describe("fondo del lienzo", () => {
  const css = readFileSync(resolve(process.cwd(), "src/index.css"), "utf8");

  it("<html> pinta un fondo en los dos temas", () => {
    expect(css).toMatch(/html\s*\{[^}]*background-color:\s*theme\('colors\.light-surface'\)/s);
    expect(css).toMatch(/html\.dark\s*\{[^}]*background-color:\s*theme\('colors\.dark-background'\)/s);
  });

  it("declara color-scheme, que es lo que pinta barras de scroll y controles", () => {
    expect(css).toMatch(/html\s*\{[^}]*color-scheme:\s*light/s);
    expect(css).toMatch(/html\.dark\s*\{[^}]*color-scheme:\s*dark/s);
  });
});
