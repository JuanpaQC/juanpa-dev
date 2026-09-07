/**
 * Referencias reales. Hoy está vacío a propósito.
 *
 * Aquí vivían dos testimonios firmados como "Ana Rodríguez, UX Designer" y
 * "Carlos Méndez, Dev Team Lead" que no corresponden a personas reales. Se
 * quitaron, no se ocultaron: `AGENTS.md` prohíbe expresamente los testimonios
 * inventados, y una cita con nombre y cargo es una afirmación verificable. Si
 * alguien la comprueba y no existe, el daño no es a esa sección: es a todo lo
 * demás que dice el sitio.
 *
 * El hueco sigue reservado en el JSX. Con el array vacío, la sección no se
 * pinta en producción; en desarrollo se ve un marcador para que no se olvide.
 *
 * Para publicar una referencia real, añade un objeto con esta forma:
 *
 *   {
 *     id: "nombre-corto",            // clave estable, para el `key` de React
 *     cita: { es: "…", en: "…" },    // literal, entre comillas, sin editar
 *     nombre: "Nombre Apellido",
 *     cargo: { es: "…", en: "…" },   // cargo y organización
 *     enlace: "https://…",           // opcional: LinkedIn o correo verificable
 *   }
 *
 * La cita va aquí y no en `src/locales/` a propósito: no es copy del sitio que
 * se traduce, es la palabra de otra persona. Si la referencia se dio en
 * español, `en` debería ser una traducción marcada como tal o directamente la
 * misma cita en su idioma original; lo que no se puede es inventarle a alguien
 * una frase que no dijo en un idioma que no habló.
 */
export const REFERENCIAS = [];
