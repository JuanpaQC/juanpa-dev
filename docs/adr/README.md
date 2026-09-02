# Decisiones de arquitectura

Registro de las decisiones con consecuencias duraderas: qué se decidió, con qué
información, y qué se descartó. El valor no está en la decisión sino en el
contexto, porque es lo que se pierde a los tres meses.

Una decisión merece un ADR si tenía alternativas razonables y revertirla costaría
trabajo. Lo demás va en un comentario en el código.

| # | Decisión | Estado |
|---|---|---|
| [0001](0001-prerender-en-vez-de-nextjs.md) | Prerender estático sobre Vite en vez de migrar a Next.js | Aceptada |
| [0002](0002-marca-y-dominio.md) | La marca es el nombre; el handle es `juanpaqc` | Aceptada |
| [0003](0003-no-animar-la-opacidad-del-lcp.md) | No animar la opacidad del elemento LCP | Aceptada |
| [0004](0004-tokens-de-color-y-contraste.md) | Tokens de color por tema y umbral de contraste AA | Aceptada |
| [0005](0005-originales-de-imagen-fuera-del-repo.md) | Los originales de imagen no viven en el repositorio | Aceptada |

## Plantilla

```markdown
# NNNN. Título en una frase

**Estado:** Propuesta | Aceptada | Reemplazada por NNNN
**Fecha:** AAAA-MM-DD

## Contexto
Qué situación obligaba a decidir. Con datos.

## Decisión
Qué se decidió, en presente.

## Consecuencias
Lo bueno y lo malo. Qué se vuelve más difícil.

## Alternativas descartadas
Qué más se consideró y por qué no.
```
