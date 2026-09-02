import { createContext } from "react";

/**
 * Contexto del tema claro/oscuro.
 *
 * Vive en su propio módulo, separado del provider: Fast Refresh de Vite solo
 * funciona si un fichero exporta exclusivamente componentes de React.
 */
export const ThemeContext = createContext(null);
