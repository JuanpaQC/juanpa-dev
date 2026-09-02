import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./Home";

// Regresión de la auditoría (hallazgos A2 y S-10): la página tenía dos <h1> y,
// a la vez, ninguno durante los primeros ~3,7 s, porque el del hero no se
// montaba hasta que terminaba la animación de máquina de escribir.
describe("Home", () => {
  it("expone exactamente un h1 con el nombre completo desde el primer render", () => {
    render(<Home />);
    const encabezados = screen.getAllByRole("heading", { level: 1 });
    expect(encabezados).toHaveLength(1);
    expect(encabezados[0]).toHaveAccessibleName("Juanpa Quesada Caballero");
  });

  it("oculta a la accesibilidad los caracteres de marcado del efecto de tecleo", () => {
    render(<Home />);
    const h1 = screen.getByRole("heading", { level: 1 });
    // El <strong> literal que se teclea es decoración. Sigue estando en el DOM
    // (es lo que se ve), pero va marcado aria-hidden, así que no entra en el
    // nombre accesible: un lector de pantalla no debe deletrear la etiqueta.
    expect(h1.textContent).toContain("<strong>");
    expect(h1.querySelector('[aria-hidden="true"]')).not.toBeNull();
    expect(h1).toHaveAccessibleName("Juanpa Quesada Caballero");
  });

  it("marca el avatar como prioritario para no penalizar el LCP", () => {
    render(<Home />);
    const avatar = screen.getByAltText("Juanpa Quesada Caballero");
    expect(avatar).toHaveAttribute("fetchpriority", "high");
    expect(avatar).toHaveAttribute("width");
    expect(avatar).toHaveAttribute("height");
  });
});
