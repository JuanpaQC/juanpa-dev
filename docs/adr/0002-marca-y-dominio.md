# 0002. La marca es el nombre; el handle es `juanpaqc`

**Estado:** Aceptada
**Fecha:** 2026-09-02

## Contexto

El sitio se llamaba **Juanpa.dev** y así aparecía en el logotipo del navbar.

Al preparar los metadatos se comprobó que `juanpa.dev` **está registrado y no es
nuestro**: pertenece a Juan Pablo (`github.com/juanpablocs`), también software
engineer, con un portafolio en Astro. El dominio resuelve, redirige a
`www.juanpa.dev` y sirve un sitio vivo.

Es decir: el logotipo estaba enviando a quien recordara la marca al portafolio de
un competidor directo con el mismo apodo y el mismo puesto.

Se comprobó por RDAP qué quedaba libre: `juanpaquesada.dev`, `juanpaqc.dev`,
`jpquesada.dev` y `juanpaquesada.com`. `quesada.dev` también estaba cogido.

## Decisión

- **Marca visible: "Juanpa Quesada".** Es lo que teclea quien busca a una persona.
- **Handle: `juanpaqc`**, en todas partes. Ya era el usuario de GitHub.
- URL actual: `https://juanpaqc.netlify.app`. Dominio previsto: `juanpaqc.dev`,
  cuando haya presupuesto.

## Consecuencias

- El `<title>`, el `<h1>` y el `Person` del JSON-LD dicen los tres "Juanpa Quesada
  Caballero". Repetir esa cadena en el logotipo refuerza una sola entidad; usar un
  handle distinto la habría dividido.
- La URL gratuita de hoy y el dominio de mañana son la misma palabra, así que
  migrar no obliga a rehacer nada de lo impreso o compartido.
- El nombre es más largo que "Juanpa.dev", así que el logotipo baja a `text-2xl`
  hasta el breakpoint `lg` para no empeorar la colisión con el menú a 768 px.
- Se pierde un nombre corto y con gancho. Es el precio de que sea nuestro.

## Alternativas descartadas

**Mantener "Juanpa.dev".** La peor opción: manda tráfico y búsquedas a otro.

**`juanpaqc` o `juanpaqc.dev` como logotipo.** Un handle no es un nombre; quien
compara candidatos apunta nombres. Y `juanpaqc.dev` hoy devuelve NXDOMAIN:
anunciaría una dirección que no existe.

**`juanpaquesada.dev`.** Mejor para búsqueda por nombre a primera vista, pero
`juanpaquesada.netlify.app` ya está ocupado, así que la URL gratuita de ahora no
coincidiría con el dominio futuro. Además, lo que asocia el sitio al nombre no es
la cadena del dominio: es el `Person` con `sameAs`, el `<title>` y los backlinks.
