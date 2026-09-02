# AGENTS.md

Contexto para agentes de codificación que trabajen en este repositorio.
Formato [AGENTS.md](https://agents.md), bajo la Agentic AI Foundation.

## Qué es esto

Portafolio personal de Juanpa Quesada Caballero, Software Engineer en Costa Rica.
Página única, bilingüe (es/en), con modo claro y oscuro.

Producción: <https://juanpaqc.netlify.app> · Despliegue continuo desde `main`.

**Objetivo del sitio.** Conseguir una pasantía en una empresa transnacional. Cada
cambio debe medirse contra eso: si no ayuda a que alguien que evalúa candidatos
entienda el nivel técnico en 30 segundos, no es prioritario.

## Comandos

| Comando | Para qué |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción a `dist/` |
| `npm run preview` | Sirve el build de producción |
| `npm run lint` | ESLint. **Debe salir sin errores** |
| `npm test` | Vitest, una pasada |
| `npm run test:watch` | Vitest en modo watch |

Antes de dar por terminado cualquier cambio: `npm run lint && npm test && npm run build`.
Es exactamente lo que ejecuta el CI.

## Stack

React 19 · Vite 6 · Tailwind CSS 3.4 · Framer Motion 12 · i18next 25 · Vitest 4

No hay TypeScript, ni router, ni SSR. Es deliberado: ver `docs/adr/0001-prerender-en-vez-de-nextjs.md`.

## Estructura

```
src/
├── pages/        Home · About · Projects · Contact  (secciones, no rutas)
├── components/   Navbar · ProjectsWithFilter · Card · TechCarousel · LanguageToast
├── context/
│   ├── theme-context.js    solo el createContext
│   └── ThemeContext.jsx    solo el provider  (separados por Fast Refresh)
├── locales/      es/translation.json · en/translation.json
├── assets/opt/   derivados de imagen optimizados (WebP)
├── test/setup.js configuración de jsdom para Vitest
└── i18n.js
public/           robots.txt · sitemap.xml · og-image.png · iconos · avatar del hero
docs/adr/         decisiones de arquitectura, con su contexto y sus consecuencias
docs/specs/       especificaciones escritas antes de implementar
```

## Invariantes

Estas reglas salen de una auditoría de rendimiento, accesibilidad y SEO. Cada una
corrigió un defecto real y medido. **Romperlas es una regresión, no una opción de
diseño.** Si un cambio las contradice, párate y pregunta.

### Rendimiento

- **Ninguna imagen sin optimizar entra al repo.** El original de la foto de perfil
  pesaba 7.6 MB (3024×4032) para mostrarse a 240 px: era el 81.8% del build.
  Los originales viven fuera del repositorio. Se sirven derivados WebP desde
  `src/assets/opt/` o `public/`. El CI falla si `dist/` supera los 2 MB.
- **Toda `<img>` lleva `width`, `height` y `loading`.** Sin dimensiones
  intrínsecas, la imagen desplaza el contenido al cargar y dispara el CLS.
- **No animes la opacidad del elemento LCP.** El avatar del hero tenía un fundido
  de 1000 ms; el navegador no registra el LCP hasta que el píxel es opaco, así que
  ese segundo entero se sumaba a la métrica. LCP pasó de 1132 ms a 96 ms al
  quitarlo. Anima `transform`, nunca `opacity`, en lo que se pinta primero.

### Accesibilidad

- **Un solo `<h1>` por página, presente desde el primer render.** El del hero se
  montaba a los 3,7 s, cuando terminaba la animación de tecleo; hasta entonces la
  página no tenía encabezado principal. El logotipo del navbar es un `<a>`, no un
  encabezado.
- **Todo control tiene nombre accesible.** Un `<button>` con solo un icono dentro
  necesita `aria-label`. Un `<svg>` decorativo va con `aria-hidden="true"` y su
  nombre en un `<span class="sr-only">` al lado.
- **Nunca `focus:outline-none` sin un sustituto visible.** Usa `focus-visible`.
  Hay una red de seguridad en `src/index.css` que cubre todo lo interactivo.
- **Contraste mínimo 4.5:1 en texto normal, 3:1 en texto grande y controles.**
  En ambos temas. Se verificó con ratios calculados, no a ojo.

### Color y temas

- **Nunca escribas un color de modo oscuro sin su variante clara.** El error
  original era `text-dark-subtle dark:text-dark-subtle`, que aplicaba el color
  oscuro también en modo claro. El patrón correcto es
  `text-light-subtle dark:text-dark-subtle`.
- Usa los tokens de `tailwind.config.js`. No metas hex sueltos en el JSX.
- **Cuidado con las variantes al hacer sustituciones masivas.** Una regex sobre
  `text-dark-accent` ya rompió una vez `group-hover:text-dark-accent`, dejando el
  enlace acentuado de forma permanente en lugar de solo al pasar el cursor.

### Contenido e i18n

- **Todo texto visible vive en `src/locales/`.** Nada de cadenas en el JSX. Ambos
  ficheros deben tener exactamente las mismas claves.
- **Ninguna URL de marcador de posición llega a producción.** Los tres enlaces
  "Ver Proyecto" apuntaban a `github.com/tuusuario/...` y dos daban 404. Si un
  proyecto no tiene URL real, `link: null` y la tarjeta se muestra sin botón.
- **Las tecnologías se nombran en texto, no solo con iconos.** Un `<svg>` con
  atributo `title` no es contenido indexable: la palabra "React" llegó a aparecer
  cero veces en un portafolio de React.
- **No inventes credenciales ni experiencia.** Nada de tecnologías que no domina,
  ni testimonios, ni métricas sin fuente. Ante la duda, pregunta.

### SEO

- La URL base aparece en `index.html` (canonical, `og:url`, `og:image`,
  `twitter:image`, JSON-LD), `public/robots.txt` y `public/sitemap.xml`. Al
  cambiar de dominio hay que actualizarla en los tres sitios.
- El JSON-LD no debe apuntar a URLs inexistentes. Datos estructurados que llevan a
  un 404 son peores que no tener ninguno.

## Convenciones

- Comentarios y mensajes de commit en **español**. Nombres de código en inglés.
- Commits en formato Conventional Commits (`feat:`, `fix:`, `perf:`, `docs:`,
  `chore:`), con un cuerpo que explique **por qué**, no qué.
- Los comentarios explican decisiones y advierten de trampas. No narres lo que el
  código ya dice.
- Componentes en `PascalCase.jsx`, tests junto al componente como
  `Componente.test.jsx`.

## Cómo trabajar aquí

1. Para cualquier cambio que no sea trivial, escribe primero la especificación en
   `docs/specs/`. Ver la plantilla en `docs/specs/PLANTILLA.md`.
2. Si la decisión tiene alternativas razonables y consecuencias duraderas, deja un
   ADR en `docs/adr/`.
3. Implementa, y añade un test de regresión si arreglas un defecto.
4. Verifica en el navegador lo que sea observable. **No des por bueno lo que no has
   medido**: varias veces en este proyecto una medición aparentemente clara resultó
   ser un artefacto del entorno (transiciones congeladas, eventos de scroll que no
   se despachaban). Comprueba dos veces antes de afirmar una mejora.
5. `npm run lint && npm test && npm run build`.

## Lo que no se toca sin preguntar

- **La identidad visual.** Las ventanas estilo macOS con los tres puntos, el hero
  de terminal con el efecto de tecleo, y el cian sobre azul profundo son decisión
  del autor. Se refina la ejecución, no la identidad.
- El copy de `src/locales/`: son sus palabras.
- La marca. Ver `docs/adr/0002-marca-y-dominio.md`; hay una razón concreta por la
  que el sitio ya no se llama "Juanpa.dev".
