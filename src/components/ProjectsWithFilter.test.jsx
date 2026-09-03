import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProjectsWithFilter from "./ProjectsWithFilter";

describe("ProjectsWithFilter", () => {
  // Regresión del hallazgo S-02: el stack se pintaba solo como iconos SVG,
  // así que la palabra "React" no aparecía ni una vez en el sitio.
  it("nombra las tecnologías en texto, no solo con iconos", () => {
    render(<ProjectsWithFilter />);
    expect(screen.getAllByText("React Native").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Firebase").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Tailwind").length).toBeGreaterThan(0);
  });

  // Regresión del hallazgo C5: los tres enlaces apuntaban a marcadores de
  // posición de plantilla y dos devolvían HTTP 404.
  it("no publica enlaces a marcadores de posición", () => {
    render(<ProjectsWithFilter />);
    const enlaces = screen.queryAllByRole("link");
    for (const a of enlaces) {
      expect(a.getAttribute("href")).not.toMatch(/tuusuario|tusitioweb/);
    }
  });

  it("filtra los proyectos por categoría", async () => {
    const usuario = userEvent.setup();
    render(<ProjectsWithFilter />);

    const cuenta = () => screen.queryAllByRole("heading", { level: 3 }).length;
    const total = cuenta();
    expect(total).toBeGreaterThan(1);

    // "Institucional" agrupa AgriVision y AgroClass: filtrar tiene que reducir
    // el conjunto sin vaciarlo.
    await usuario.click(screen.getByRole("button", { name: /institucional|institutional/i }));
    const filtrado = cuenta();
    expect(filtrado).toBeGreaterThan(0);
    expect(filtrado).toBeLessThan(total);

    await usuario.click(screen.getByRole("button", { name: /^(todos|all)$/i }));
    expect(cuenta()).toBe(total);
  });
});
