# juanpa.dev

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

Otros comandos: `npm run build` (producción), `npm run preview` (servir el build), `npm run lint`.

## Estructura

```
src/
├── pages/        Home · About · Projects · Contact
├── components/   Navbar · ProjectsWithFilter · Card · TechCarousel · LanguageToast
├── context/      ThemeContext (modo claro/oscuro)
├── locales/      es · en
├── assets/opt/   derivados de imagen optimizados (WebP)
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

Pendiente: casos de estudio de proyectos, metadatos de compartición y datos
estructurados, `prefers-reduced-motion`, prerender estático y tests.
