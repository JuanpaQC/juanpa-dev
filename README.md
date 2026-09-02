# juanpa.dev

[![CI](https://github.com/JuanpaQC/juanpa-dev/actions/workflows/ci.yml/badge.svg)](https://github.com/JuanpaQC/juanpa-dev/actions/workflows/ci.yml)

Portafolio personal de **Juanpa Quesada Caballero** — Software Engineer, Costa Rica.
Estudiante de Ingeniería en Computación en el TEC.

Sitio de una sola página, bilingüe (es/en), con modo claro y oscuro.

## Stack

| Área | Herramienta |
|---|---|
| UI | React 19 |
| Build | Vite 6 |
| Estilos | Tailwind CSS 3.4 |
| Animación | Framer Motion 12 |
| i18n | i18next + react-i18next |
| Iconos | react-icons |

## Desarrollo

```bash
npm install
npm run dev
```

| Comando | Para qué |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run preview` | Sirve el build |
| `npm run lint` | ESLint |
| `npm test` | Vitest |

## Cómo está documentado

Este repositorio se desarrolla con agentes de codificación, y el contexto que
necesitan está versionado junto al código:

| Fichero | Qué contiene |
|---|---|
| [`AGENTS.md`](AGENTS.md) | Contexto del proyecto en el formato abierto [agents.md](https://agents.md): comandos, estructura, convenciones y los **invariantes** que no se pueden romper |
| [`CLAUDE.md`](CLAUDE.md) | Cómo trabajar aquí concretamente con Claude Code |
| [`docs/adr/`](docs/adr/) | Decisiones de arquitectura: qué se decidió, con qué datos y qué se descartó |
| [`docs/specs/`](docs/specs/) | Especificaciones escritas **antes** de implementar |

Los invariantes de `AGENTS.md` no son estilo: cada uno corrigió un defecto real y
medido, y está para que no vuelva.

## Estructura

```
src/
├── pages/        Home · About · Projects · Contact
├── components/   Navbar · ProjectsWithFilter · Card · TechCarousel · LanguageToast
├── context/      theme-context.js (contexto) · ThemeContext.jsx (provider)
├── locales/      es · en
├── assets/opt/   derivados de imagen optimizados (WebP)
├── test/         configuración de Vitest
└── i18n.js
```

Los originales de imagen en alta resolución no están en el repo: el sitio sirve
únicamente los derivados de `src/assets/opt/` y `public/`.

## Estado

El proyecto está en una refactorización por fases a partir de una auditoría de
rendimiento, accesibilidad y SEO. Completado hasta ahora:

- **Peso del build: 9.30 MB → 728 KB.** Imágenes redimensionadas y servidas en
  WebP, con `width`/`height`, `loading="lazy"` y `preload` del elemento LCP.
- **LCP: 1132 ms → 96 ms** en las mismas condiciones de medición. La mayor parte
  de la mejora vino de eliminar un fundido de opacidad de 1000 ms sobre el
  elemento LCP: el navegador no registra la métrica hasta que el píxel es opaco.
- **Modo claro accesible.** 11 de 11 comprobaciones de contraste pasan WCAG 2.2 AA.
- **Foco visible**, nombres accesibles en todos los controles y atributo `lang`
  sincronizado con el idioma de la interfaz.
- **Indexable y compartible.** `<head>` completo, Open Graph, Twitter Card,
  JSON-LD (`Person` + `ProfilePage` + `WebSite`), `robots.txt`, `sitemap.xml` y un
  `<noscript>` de respaldo para los rastreadores que no ejecutan JavaScript.
- **El stack se nombra en texto**, no solo con iconos: la palabra "React" pasó de
  aparecer 0 veces a 7.
- **CI en verde**: lint, tests y build en cada push, más un límite de peso del
  build que falla si vuelve a colarse una imagen sin optimizar.

Pendiente: casos de estudio de proyectos, la sección sobre el flujo con agentes
(especificada en `docs/specs/0001`), `prefers-reduced-motion`, prerender estático
y las tipografías, que están declaradas pero nunca llegan a cargarse.
