import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
// Inicializa i18next: los componentes usan useTranslation y sin esto
// devolverían la clave en vez del texto.
import "../i18n";

// jsdom no implementa matchMedia, que ThemeContext usa para leer
// prefers-color-scheme.
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
}

// framer-motion usa IntersectionObserver para whileInView.
if (!window.IntersectionObserver) {
  window.IntersectionObserver = class {
    constructor(cb) {
      this.cb = cb;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  };
}

if (!window.scrollTo) window.scrollTo = () => {};

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});
