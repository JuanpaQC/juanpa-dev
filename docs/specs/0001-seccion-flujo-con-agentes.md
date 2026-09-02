# 0001. Sección "Cómo trabajo con agentes"

**Estado:** Borrador
**Fecha:** 2026-09-02

## Problema

El diferenciador declarado de Juanpa es su soltura trabajando con agentes de IA,
y el sitio no lo menciona en ningún sitio.

Decir "trabajo con agentes" en una lista de habilidades ya no vale nada: en 2026
la fluidez con asistentes de código es línea base, no mérito. Lo que casi nadie
enseña es el **artefacto**: la especificación escrita antes de que el agente
tocara código, el registro de decisiones, y el caso concreto donde el agente se
equivocó y la persona lo detectó.

Ese último punto es el que más pesa y el más contraintuitivo. Un portafolio que
dice "lo hice con IA y fue rapidísimo" genera dudas sobre el criterio del
candidato. Uno que dice "el agente propuso X, lo rechacé porque Y, lo verifiqué
con Z" demuestra exactamente el criterio que se está evaluando.

## Objetivo

Que alguien que evalúa candidatos entienda, sin salir de la página, **cómo**
trabaja y por qué eso lo hace más rápido sin ser menos riguroso. Y que pueda
comprobarlo: cada afirmación enlaza a un fichero real del repositorio.

## Fuera de alcance

- Explicar qué es un agente de IA. El público objetivo ya lo sabe.
- Métricas de productividad inventadas. Nada de "3× más rápido" sin medición.
- Convertir la sección en un tutorial.

## Comportamiento

Sección nueva entre el hero y "Sobre mí". Va arriba a propósito: si es el
diferenciador, no puede estar debajo del pliegue.

Tres bloques, en el estilo de ventana macOS que ya usa el resto del sitio:

1. **El flujo.** Spec → Plan → Implementación → Verificación, en cuatro pasos
   breves. Cada paso enlaza al artefacto real de este mismo repositorio:
   `docs/specs/`, `docs/adr/`, `AGENTS.md`, el workflow de CI.

2. **Un caso real, con el error incluido.** Un ejemplo concreto y verificable de
   este proyecto. Candidato: la pasada de color del modo claro, donde una regex
   sobre `text-dark-accent` rompió `group-hover:text-dark-accent` y dejó los
   enlaces del navbar acentuados de forma permanente; se detectó comparando el
   render, y está documentado en `docs/adr/0004`.

3. **Qué cambia en el resultado.** Cifras reales de la auditoría, con enlace al
   commit: build de 9.30 MB a 728 KB, LCP de 1132 ms a 96 ms, 11 de 11
   comprobaciones de contraste pasando AA.

## Restricciones

- Todo el texto en `src/locales/es` y `src/locales/en`, con paridad de claves.
- Se reutiliza el motivo de ventana macOS existente. No se introduce un lenguaje
  visual nuevo.
- Las cifras deben coincidir con lo medido y registrado en `docs/adr/`. Si una
  cifra no se puede verificar, no se pone.
- Aplican los invariantes de `AGENTS.md`: encabezados por debajo del `<h1>`,
  contraste AA en ambos temas, sin cadenas fuera de los locales.

## Criterios de aceptación

- [ ] La sección aparece entre el hero y "Sobre mí", con `id="agentes"` y su
      entrada en el navbar.
- [ ] Cada afirmación sobre el flujo enlaza a un fichero real del repositorio.
- [ ] Incluye al menos un caso donde el agente se equivocó y qué se hizo.
- [ ] Todas las cifras son trazables a un ADR o a un commit.
- [ ] Contraste AA verificado con ratios calculados en modo claro y oscuro.
- [ ] Sin cadenas de texto fuera de `src/locales/`; paridad es/en.
- [ ] `npm run lint && npm test && npm run build` en verde.

## Notas de implementación

- Ficheros: `src/pages/Agents.jsx` (nuevo), `src/App.jsx`,
  `src/components/Navbar.jsx`, ambos `translation.json`.
- Trampa conocida: el navbar recorre un array literal de secciones
  (`['home','about','projects','contact']`) en dos sitios, escritorio y móvil.
  Hay que actualizar los dos, o extraerlo a una constante compartida.
- La sección añade contenido textual real, lo que también ayuda al problema de
  contenido escaso: el sitio tiene 288 palabras y necesita entre 800 y 1500.
