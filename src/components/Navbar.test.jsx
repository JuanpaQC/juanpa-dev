import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Navbar from "./Navbar";
import { ThemeProvider } from "../context/ThemeContext";

const montar = () =>
  render(
    <ThemeProvider>
      <Navbar />
    </ThemeProvider>
  );

// Regresión de los hallazgos A3 y S-09: tres botones sin nombre accesible,
// y el logotipo como segundo <h1> compitiendo con el del hero.
describe("Navbar", () => {
  it("da nombre accesible a los tres controles", () => {
    montar();
    expect(screen.getByRole("switch")).toHaveAccessibleName();
    expect(screen.getAllByRole("button", { name: /idioma|language|español|english/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: /men[uú]/i }).length).toBeGreaterThan(0);
  });

  it("expone el estado del tema, no solo su apariencia", () => {
    montar();
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked");
  });

  // El logotipo muestra el handle para no repetir el nombre, que ya está en el
  // <h1> del hero. Pero el nombre completo tiene que seguir llegando al lector
  // de pantalla y al rastreador: eso lo garantiza el aria-label.
  it("el logotipo es un enlace al inicio, no un encabezado", () => {
    montar();
    expect(screen.queryByRole("heading", { level: 1 })).toBeNull();
    const logo = screen.getByRole("link", { name: /Juanpa Quesada Caballero/ });
    expect(logo).toHaveAttribute("href", "#home");
    expect(logo).toHaveTextContent("juanpaqc");
  });

  it("el botón de menú declara si está desplegado", () => {
    montar();
    const hamburguesa = screen.getAllByRole("button", { name: /men[uú]/i })[0];
    expect(hamburguesa).toHaveAttribute("aria-expanded", "false");
  });
});
