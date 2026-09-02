# 0004. Tokens de color por tema y umbral de contraste AA

**Estado:** Aceptada
**Fecha:** 2026-08-31

## Contexto

`tailwind.config.js` definía una paleta clara completa (`light-background`,
`light-accent`, `light-subtle`, `light-border`) que el 60% de los componentes
nunca usaba. El patrón repetido era escribir el color oscuro sin prefijo y
repetirlo con `dark:`:

```jsx
className="... text-dark-subtle dark:text-dark-subtle"
```

El resultado: el modo claro heredaba los colores del oscuro. Ratios reales
medidos sobre el fondo crema `#F5F0E6`:

| Elemento | Ratio | Mínimo AA |
|---|---:|---:|
| Titulares con `#00F6ED` | **1.20:1** | 4.5:1 |
| Todo el texto de párrafo | 2.26–2.56:1 | 4.5:1 |
| Borde de los inputs | 1.09:1 | 3:1 |

No era un modo claro mejorable. Era un modo claro inutilizable.

## Decisión

- Todo color se escribe como par: `text-light-* dark:text-dark-*`. Nunca un color
  de un tema sin la variante del otro.
- Umbral obligatorio: **4.5:1 en texto normal, 3:1 en texto grande y controles**,
  en ambos temas, verificado con el ratio calculado y no a ojo.
- `light-accent` pasa de `#008275` a **`#00695E`**. El anterior daba 4.15:1 sobre
  el fondo crema: suficiente para titulares grandes, insuficiente para las
  píldoras de filtro y los enlaces, que son de 14 px.
- Los botones con acento claro llevan texto **blanco**, no negro: 4.45:1 → 6.60:1.
- Nuevo token `light-border-strong` (`#8C8375`) para bordes de control, que por
  WCAG 1.4.11 necesitan 3:1 y no pueden usar el `light-border` decorativo.

## Consecuencias

- Las 11 comprobaciones de contraste del modo claro pasan AA. El oscuro no cambió.
- Las tarjetas de proyecto dejan de ser rectángulos casi negros sobre fondo crema:
  la ventana macOS tiene ahora su versión clara, como en macOS real.
- El verde de acento es ligeramente más oscuro que el elegido originalmente.

## Alternativas descartadas

**Mantener `#008275` y agrandar los textos.** Habría condicionado la tipografía a
un problema de color.

**Modo oscuro forzado.** Se descartó: el sistema de temas ya existía y funcionaba;
el defecto estaba en cómo se aplicaba, no en la idea.

## Trampa conocida

Al hacer sustituciones masivas con regex, cuidado con las variantes. Una pasada
sobre `text-dark-accent` transformó `group-hover:text-dark-accent` en
`group-hover:text-light-accent dark:text-dark-accent`, dejando los enlaces del
navbar acentuados de forma permanente en lugar de solo al pasar el cursor.
