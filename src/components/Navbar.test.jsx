import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  // El menú móvil pasó de aparecer de golpe a animarse. El cambio trajo dos
  // riesgos que estas pruebas fijan.
  describe("menú móvil", () => {
    const abrir = async () => {
      const usuario = userEvent.setup();
      montar();
      const boton = screen.getAllByRole("button", { name: /men[uú]/i })[0];
      await usuario.click(boton);
      return { usuario, boton };
    };

    it("los enlaces cuelgan de un <li>, no del <ul>", async () => {
      await abrir();
      const lista = document.getElementById("mobile-menu").querySelector("ul");
      const hijosSueltos = [...lista.children].filter((n) => n.tagName !== "LI");
      expect(hijosSueltos).toEqual([]);
      expect(lista.querySelectorAll("li > a").length).toBe(4);
    });

    it("Escape lo cierra y devuelve el foco al botón", async () => {
      const { usuario, boton } = await abrir();
      expect(boton).toHaveAttribute("aria-expanded", "true");
      await usuario.keyboard("{Escape}");
      expect(boton).toHaveAttribute("aria-expanded", "false");
      expect(boton).toHaveFocus();
    });

    // Se intentó dejar el menú montado con `inert` para poder animar la altura
    // sin desmontar. Eso deja el interruptor de tema y el de idioma en el DOM
    // de forma permanente, duplicando los del menú de escritorio.
    //
    // Abierto sí hay dos, y es correcto: en el navegador el breakpoint oculta
    // uno de los dos menús con `display:none`, así que solo uno llega al árbol
    // de accesibilidad. Aquí se ven los dos porque vitest corre con `css:
    // false`. Lo que hay que fijar es el estado cerrado.
    it("cerrado, no deja controles duplicados montados", async () => {
      const { usuario, boton } = await abrir();
      expect(screen.getAllByRole("switch")).toHaveLength(2);
      await usuario.keyboard("{Escape}");
      expect(boton).toHaveAttribute("aria-expanded", "false");
      await waitFor(() => expect(screen.getAllByRole("switch")).toHaveLength(1));
    });
  });
});
