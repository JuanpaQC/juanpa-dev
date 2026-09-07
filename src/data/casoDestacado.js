/**
 * El caso que se cuenta entero: AgroClass.
 *
 * Es el proyecto más grande y el más avanzado, así que es el que se lleva una
 * sección propia en vez de una tarjeta. El resto siguen en la rejilla.
 *
 * Los cuatro pasos son la descripción que ya estaba en `src/locales`, cortada
 * en cuatro. No hay ni un hecho nuevo: se reordenó lo que ya decía. Las claves
 * viven en los locales porque son copy del sitio y tienen que existir en los
 * dos idiomas.
 *
 * `imagen` es opcional en cada paso. Si no hay fichero, el marco del teléfono
 * pinta el diagrama de texto y reserva exactamente el mismo espacio, así que
 * añadir capturas más tarde no mueve nada de sitio.
 *
 * Para añadir una captura:
 *   1. Exporta la pantalla del móvil a WebP, ~900 px de ancho.
 *   2. Déjala en `public/casos/`.
 *   3. Pon aquí `imagen: "/casos/agroclass-01.webp"` y su `alt`.
 * El `alt` describe lo que se ve, no repite el título del paso.
 */
export const CASO_DESTACADO = {
  clave: "agroclass",
  archivo: "agroclass/survey/Flow.jsx",
  tech: ["React Native", "Expo", "Node", "Firebase"],
  // Relación de aspecto del marco. Se reserva en CSS aunque no haya imagen:
  // es lo que evita que la página dé un salto cuando la captura termine de
  // cargar (CLS).
  proporcion: "9 / 19.5",
  pasos: [
    { id: "criterio", imagen: null, alt: null },
    { id: "flujo", imagen: null, alt: null },
    { id: "campo", imagen: null, alt: null },
    { id: "informe", imagen: null, alt: null },
  ],
};
