import { useEffect, useState } from "react";
import { ThemeContext } from "./theme-context";

/**
 * El color de la barra de estado del móvil, por tema.
 *
 * Son los mismos que pinta <html> en index.css. Si se cambian ahí, hay que
 * cambiarlos aquí: son los dos únicos sitios donde vive este color, y no se
 * pueden leer de Tailwind desde JavaScript sin arrastrar la configuración
 * entera al bundle.
 */
const COLOR_BARRA = { dark: "#0D1B2A", light: "#FAF8F4" };

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) return storedTheme === "dark";

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Aplica clase y guarda en localStorage
  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    // La barra de estado del móvil y la interfaz del navegador siguen al tema
    // del sitio, no al del sistema operativo. Antes eran dos metas con
    // `prefers-color-scheme`, así que con el sistema en claro y el sitio en
    // oscuro la barra se quedaba clara. El script en línea de index.html pinta
    // la primera; esta la actualiza en cada cambio.
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", COLOR_BARRA[darkMode ? "dark" : "light"]);
  }, [darkMode]);

  // Escucha cambios del sistema operativo
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemChange = (e) => {
      const newDarkMode = e.matches;
      setDarkMode(newDarkMode);
      localStorage.setItem("theme", newDarkMode ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleSystemChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemChange);
    };
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
