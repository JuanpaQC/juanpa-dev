import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SplitReveal from "./SplitReveal";

// El título se parte en un <span> por palabra para poder animarlas por
// separado. El riesgo de trocear un encabezado es perder los espacios: si las
// palabras quedan pegadas, el nombre accesible y lo que indexa el rastreador
// pasan de "Sobre mí" a "Sobremí".
describe("SplitReveal", () => {
  it("conserva el texto completo, con sus espacios, en un solo encabezado", () => {
    render(<SplitReveal as="h2" texto="Sobre mí" />);
    const encabezados = screen.getAllByRole("heading", { level: 2 });
    expect(encabezados).toHaveLength(1);
    expect(encabezados[0]).toHaveAccessibleName("Sobre mí");
    expect(encabezados[0].textContent).toBe("Sobre mí");
  });

  it("emite una palabra por span animable", () => {
    render(<SplitReveal as="h2" texto="Hablemos de trabajo" />);
    const h2 = screen.getByRole("heading", { level: 2 });
    expect(h2.querySelectorAll("[data-palabra]")).toHaveLength(3);
  });
});
