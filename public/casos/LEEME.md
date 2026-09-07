# Capturas de este directorio

`prueba-01..04.webp` son **sintéticas**. No enseñan AgroClass, enseñan
rectángulos de colores con la proporción de una pantalla de móvil. Existen para
una sola cosa: comprobar que el marco del teléfono de la sección destacada
aguanta imágenes reales sin que la maquetación dé un salto.

## Para verlo con imágenes

En `src/data/casoDestacado.js`, cambia los cuatro `imagen: null` por
`imagen: "/casos/prueba-0N.webp"` con su `alt`. `npm test` **fallará a
propósito** mientras estén conectadas: es la red de seguridad que impide
desplegar capturas falsas (`src/data/casoDestacado.test.js`).

## Para dejarlo listo de verdad

1. Exporta cuatro pantallas reales de AgroClass a WebP, ~900 px de ancho.
2. Déjalas aquí con nombres descriptivos: `agroclass-criterio.webp`, etc.
3. Apúntalas en `src/data/casoDestacado.js` con un `alt` que describa lo que se
   ve, no que repita el título del paso.
4. Borra los `prueba-0N.webp` y este fichero.

## Coste medido

| Tipo de captura | Una | Cuatro |
|---|---|---|
| Interfaz plana | 14,1 KB | 56,5 KB |
| Interfaz con una foto dentro (lo esperable en AgroClass) | 34,8 KB | 139,3 KB |
| Ruido a pantalla completa (tope teórico, no realista) | 952 KB | 3,72 MB |

Con capturas reales de una app —interfaz plana con alguna foto de campo— el
coste está en torno a **140 KB en total**, sobre un presupuesto de 2 MB. Las
imágenes no entran en el bundle de JavaScript y van con `loading="lazy"`, así
que no compiten con la primera pantalla.
