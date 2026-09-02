# 0001. Prerender estático sobre Vite en vez de migrar a Next.js

**Estado:** Aceptada
**Fecha:** 2026-08-31

## Contexto

Una auditoría de SEO encontró que el HTML servido era literalmente
`<div id="root"></div>` más un `<script>`. Googlebot ejecuta JavaScript, pero en
una segunda pasada con presupuesto limitado; los rastreadores de LinkedIn,
WhatsApp, Slack y Bing no lo ejecutan en absoluto. Para ellos la página estaba
vacía.

La recomendación habitual para esto es migrar a Next.js. Antes de aceptarla se
midió el build real:

| Concepto | Peso | % del total |
|---|---:|---:|
| Imágenes | 8.82 MB | **94.8%** |
| JavaScript | 408 KB (115 KB brotli) | 4.4% |
| CSS | 25 KB (4 KB brotli) | 0.3% |

El problema de rendimiento no era el framework. Era una foto de 7.6 MB.

## Decisión

No se migra a Next.js. Se mantiene React + Vite y se resuelve la indexabilidad
con prerender estático en el build, más un `<noscript>` de respaldo mientras
tanto.

## Consecuencias

- El coste estimado baja de 3–6 días a 2–4 horas, y no añade complejidad
  operativa permanente.
- Se conservan Vite, Tailwind, Framer Motion e i18next sin tocarlos.
- El prerender permitirá emitir `/` (español) y `/en/` (inglés) como HTML
  separados, que es lo que desbloquea `hreflang` de verdad. Con una sola URL
  sirviendo dos idiomas no hay nada válido que declarar.
- A cambio: si algún día aparecen rutas dinámicas o datos por usuario, esta
  decisión habrá que revisarla. Hoy no hay ninguna de las dos cosas.

## Alternativas descartadas

**Next.js.** Resuelve contenido dinámico, rutas, auth y datos por petición. Aquí
no hay nada de eso. El beneficio en indexabilidad sería idéntico al del prerender.

**Astro.** Mejor motor de blog y JS de partida cercano a cero. Se reconsiderará
**solo si el blog llega a existir**; hasta entonces es sobreingeniería.

**No hacer nada.** Descartada: sin HTML servido, compartir el enlace en LinkedIn
produce una tarjeta gris y vacía, justo en el canal donde más se comparte.
