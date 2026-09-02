# 0003. No animar la opacidad del elemento LCP

**Estado:** Aceptada
**Fecha:** 2026-08-31

## Contexto

El avatar del hero entraba con Framer Motion desde
`initial={{ opacity: 0, y: 30 }}` hasta opacidad 1 en `duration: 1`.

Medido con `PerformanceObserver`, ese avatar era el elemento LCP, y el LCP salía
a **1132 ms incluso con caché caliente, latencia cero y CPU de escritorio**. Más
de un segundo no venía de la red.

La causa: el navegador no registra el Largest Contentful Paint hasta que el píxel
es **opaco**. Un fundido de entrada de 1000 ms sobre el elemento más grande de la
pantalla se suma íntegro a la métrica.

## Decisión

El elemento LCP no anima su opacidad. Entra con `transform` (`y`), que no afecta
al momento en que el píxel se considera pintado. Además se precarga con
`<link rel="preload" as="image">` y `fetchpriority="high"`.

## Consecuencias

- LCP de **1132 ms a 96 ms** en condiciones idénticas de medición.
- El avatar aparece de golpe en lugar de fundirse. Visualmente se nota poco
  porque el desplazamiento vertical sigue ahí.
- Regla general para el proyecto: en lo que se pinta primero, anima `transform`,
  nunca `opacity`.

## Alternativas descartadas

**Bajar la duración a 250 ms.** Habría recuperado 750 ms de los 1000. No hay razón
para pagar los otros 250.

**Quitar la animación entera.** Innecesario: el desplazamiento no penaliza.
