# CLAUDE.md

El contexto del proyecto está en **[AGENTS.md](./AGENTS.md)**: comandos,
estructura, invariantes y convenciones. Léelo primero. Este fichero solo añade lo
específico de cómo trabajar aquí con Claude Code.

## Antes de tocar nada

Lee `docs/adr/` completo. Son cinco decisiones cortas y explican por qué el
proyecto es como es. Varias cosas que parecen mejorables ya se evaluaron y se
descartaron con una razón: no hay TypeScript, no hay router, no se migra a
Next.js, y el dominio no es el que parece.

## Verifica, no supongas

Es la regla más importante de este repositorio.

El sitio se puede inspeccionar en vivo con las herramientas del navegador. Úsalas
para comprobar lo que cambias: contraste con ratios calculados, geometría con
`getBoundingClientRect`, métricas con `PerformanceObserver`.

Pero desconfía de las mediciones de pintado cuando el panel del navegador está
oculto. Ya han dado tres falsos positivos en este proyecto:

- Una transición de color congelada a mitad, leída como un fallo de contraste.
- `requestAnimationFrame` que nunca disparaba y colgaba el script.
- Eventos de `scroll` que no se despachaban, haciendo parecer que una función
  recién implementada no funcionaba.

Los datos de `PerformanceResourceTiming` y de `getComputedStyle` sobre propiedades
no animadas sí son fiables. Cuando dudes, mide dos veces o cámbialo por una
comprobación estructural. **Si no puedes medirlo, dilo en vez de estimarlo.**

## Al reportar

- Da números, no adjetivos. "LCP 1132 ms → 96 ms", no "mucho más rápido".
- Si algo no se pudo verificar, dilo explícitamente.
- Si introduces una regresión, dilo antes de que la encuentre él.

## Alcance

Este portafolio se está reconstruyendo por fases a partir de una auditoría. Haz la
fase que se te pide y no te adelantes: hay hallazgos conocidos y todavía sin
arreglar (las tipografías que no cargan, el carrusel que desborda, el solapamiento
en tablet). Están documentados y tienen su turno. Si te encuentras uno, menciónalo
y sigue con lo tuyo.

## Su contexto

Juanpa es estudiante del TEC de Costa Rica y le quedan unos dos años de carrera.
Busca una pasantía en una transnacional y se posiciona como desarrollador con
soltura trabajando con agentes. Su stack real es móvil e IA aplicada.

No infles su perfil. No añadas tecnologías que no domina a los textos del sitio,
ni al README, ni a los datos estructurados. Un portafolio que promete lo que el
candidato no puede defender en una entrevista es peor que uno modesto.
