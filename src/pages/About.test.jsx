import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import About from "./About";

/**
 * Regresión de un fallo que solo existía en producción.
 *
 * El bloque de referencias estuvo condicionado a
 * `REFERENCIAS.length > 0 || import.meta.env.DEV`. En desarrollo se veía; en el
 * build, `DEV` es `false`, así que el hueco existía en el código y no en el
 * sitio. Se subió a git así y no se detectó hasta verlo publicado.
 *
 * `vi.stubEnv("DEV", false)` es lo que hace útil esta prueba: sin eso, vitest
 * corre con `DEV` a `true` y el caso roto pasaría igual.
 */
describe("About · referencias", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("reserva el espacio también en producción", () => {
    vi.stubEnv("DEV", false);
    render(<About />);
    expect(screen.getByRole("heading", { name: /referencias|references/i })).toBeInTheDocument();
    expect(screen.getByText(/disponibles a petición|available on request/i)).toBeInTheDocument();
  });

  it("no publica testimonios sin persona detrás", () => {
    vi.stubEnv("DEV", false);
    const { container } = render(<About />);
    // Si algún día vuelven citas al JSX en duro, esto las caza.
    expect(container.textContent).not.toMatch(/Ana Rodríguez|Carlos Méndez/);
    expect(container.querySelectorAll("blockquote")).toHaveLength(0);
  });
});
