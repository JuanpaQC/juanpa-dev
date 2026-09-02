# 0005. Los originales de imagen no viven en el repositorio

**Estado:** Aceptada
**Fecha:** 2026-08-31

## Contexto

`src/assets/juanpa-profile.jpg` pesaba 7.6 MB a 3024×4032 px y se mostraba a
240×240. `minimal.png` pesaba 980 KB a 1024×1024 y se usaba como favicon de
32×32. Entre los dos, 8.5 MB que no aportaban un píxel visible.

El build entero pesaba 9.30 MB, del cual el 94.8% eran imágenes. En una conexión
4G lenta eso son unos 46 segundos de descarga.

## Decisión

Los originales en alta resolución salen del repositorio. Se versionan únicamente
los derivados que se sirven: WebP en `src/assets/opt/` e iconos en `public/`.

Los originales quedan en `~/Documents/portafolio-juanpa-originales/`.
`.gitignore` bloquea `src/assets/*.jpg`.

El CI comprueba que `dist/` no supere los 2 MB, para que la regla se sostenga sola.

## Consecuencias

- Build de **9.30 MB a 728 KB**. Primera carga de 9.16 MB a 184 KB.
- Para regenerar tamaños hay que ir a la carpeta de originales, no al repo. Está
  documentado en `AGENTS.md`.
- El commit inicial todavía contiene los blobs originales, así que el historial
  pesa unos 9 MB aunque el árbol de trabajo esté limpio. Se decidió no reescribir
  el historial: el coste de clonar 9 MB una vez es menor que el de reescribir una
  rama ya publicada.

## Alternativas descartadas

**Reescribir el historial.** Habría dejado el repo por debajo del megabyte, pero
reescribe commits ya empujados y arriesga perder el archivo fuente.

**Git LFS.** Sobredimensionado para tres archivos en un portafolio personal.
