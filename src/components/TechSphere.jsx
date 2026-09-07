import { useEffect, useMemo, useRef, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../context/theme-context";
import { ScrollTrigger, menosMovimiento, medible } from "../lib/motion";

/**
 * Globo de tecnologías: los logotipos del stack repartidos sobre una jaula de
 * alambre que gira.
 *
 * Vivía en el hero con los nombres escritos y se trajo aquí por dos razones.
 * Una visual: se cruzaba con el avatar y las dos cosas se veían peor. Otra de
 * contenido: repetía, tres pantallas más arriba, exactamente la misma lista que
 * ya estaba en esta sección. Aquí no duplica nada, porque *es* la lista.
 *
 * Los mismos <li> sirven para las dos disposiciones. Por debajo de `md` fluyen
 * como una rejilla envuelta —tal cual estaban— y el efecto no se monta
 * siquiera; a partir de `md` el efecto los coloca en 3D. No hay dos DOM: si
 * hubiera uno por breakpoint, los nombres en sr-only saldrían duplicados para
 * el rastreador y para el lector de pantalla.
 *
 * El nombre de cada tecnología sigue siendo texto en el DOM. Es la invariante
 * de AGENTS.md, y el motivo por el que los logotipos no se dibujan en el
 * canvas: un <svg> no es contenido indexable, y por eso la palabra "React"
 * llegó a aparecer cero veces en un portafolio de React. En el canvas va solo
 * el alambre, que no dice nada que haya que indexar.
 */

const normalizar = ([x, y, z]) => {
  const l = Math.hypot(x, y, z) || 1;
  return [x / l, y / l, z / l];
};

/**
 * Icosaedro subdividido y proyectado sobre la esfera: 42 vértices y 120
 * aristas. Es la jaula que da la forma. Va muy apagada —el techo de opacidad
 * es 0.16— porque el contenido son los logotipos; el alambre solo tiene que
 * dejar claro que hay un volumen, no competir con ellos.
 */
function crearGeodesica(subdivisiones = 1) {
  const t = (1 + Math.sqrt(5)) / 2;
  const vertices = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ].map(normalizar);

  let caras = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ];

  const clave = (a, b) => (a < b ? `${a}_${b}` : `${b}_${a}`);

  for (let paso = 0; paso < subdivisiones; paso += 1) {
    const cache = new Map();
    const medio = (a, b) => {
      const k = clave(a, b);
      if (cache.has(k)) return cache.get(k);
      const [va, vb] = [vertices[a], vertices[b]];
      vertices.push(normalizar([va[0] + vb[0], va[1] + vb[1], va[2] + vb[2]]));
      cache.set(k, vertices.length - 1);
      return vertices.length - 1;
    };

    const nuevas = [];
    for (const [a, b, c] of caras) {
      const ab = medio(a, b);
      const bc = medio(b, c);
      const ca = medio(c, a);
      nuevas.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
    }
    caras = nuevas;
  }

  const aristas = new Set();
  for (const [a, b, c] of caras) {
    aristas.add(clave(a, b));
    aristas.add(clave(b, c));
    aristas.add(clave(c, a));
  }

  return { vertices, aristas: [...aristas].map((k) => k.split("_").map(Number)) };
}

const { vertices: VERTICES, aristas: ARISTAS } = crearGeodesica(1);

/**
 * Reparto de Fibonacci: n puntos casi equidistantes sobre la esfera.
 *
 * Sortear ángulos al azar deja huecos y amontonamientos —y encima cambiaría en
 * cada montaje del componente—. El ángulo áureo los separa siempre igual.
 */
function puntosEsfera(n) {
  const anguloAureo = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: n }, (_, i) => {
    const y = n === 1 ? 0 : 1 - (i / (n - 1)) * 2;
    const radio = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = i * anguloAureo;
    return [Math.cos(theta) * radio, y, Math.sin(theta) * radio];
  });
}

export default function TechSphere({ items }) {
  const { t } = useTranslation();
  const tema = useContext(ThemeContext);
  const oscuro = tema?.darkMode ?? true;

  const contenedorRef = useRef(null);
  const listaRef = useRef(null);
  const canvasRef = useRef(null);

  // El scroll y el cursor encima modulan el giro. Van en refs y no en estado:
  // sería un render de React por frame, el mismo defecto que ya se corrigió en
  // el Navbar moviendo la posición de scroll a una ref.
  const empujeScroll = useRef(0);
  const factorVelocidad = useRef(1);

  const posiciones = useMemo(() => puntosEsfera(items.length), [items.length]);

  useEffect(() => {
    const lista = listaRef.current;
    if (!lista) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext?.("2d");
    const colorAlambre = oscuro ? "0, 246, 237" : "0, 105, 94";

    const anchaSuficiente = window.matchMedia("(min-width: 768px)");
    const quieto = menosMovimiento();
    let nodos = [];
    let rafId = 0;
    let montado = false;
    let visible = true;
    let observador;

    let rotX = -0.2;
    let rotY = 0;
    let objX = -0.2;
    let objY = 0;

    const colocar = () => {
      const caja = lista.getBoundingClientRect();
      if (!caja.width || !caja.height) return;

      const cx = caja.width / 2;
      const cy = caja.height / 2;
      const radio = Math.min(caja.width, caja.height) * 0.42;
      const distancia = 3.4;
      // En una columna estrecha el radio baja mucho y dieciséis logotipos de
      // 30 px se amontonan. El tamaño va atado al radio en vez de fijo: a 185 px
      // —el caso ancho— salen a tamaño natural, y por debajo encogen hasta el
      // 62%.
      const factorTamano = Math.min(1, Math.max(0.62, radio / 185));

      const cosX = Math.cos(rotX);
      const senX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const senY = Math.sin(rotY);
      const girar = ([x, y, z]) => {
        const x1 = x * cosY - z * senY;
        const z1 = x * senY + z * cosY;
        const y1 = y * cosX - z1 * senX;
        return [x1, y1, y * senX + z1 * cosX];
      };

      if (ctx) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const anchoDeseado = Math.round(caja.width * dpr);
        if (canvas.width !== anchoDeseado) {
          canvas.width = anchoDeseado;
          canvas.height = Math.round(caja.height * dpr);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        ctx.clearRect(0, 0, caja.width, caja.height);

        const proy = VERTICES.map((v) => {
          const [x, y, z] = girar(v);
          const e = distancia / (distancia + z);
          return [cx + x * radio * e, cy + y * radio * e, z];
        });

        ctx.lineWidth = 1;
        for (const [a, b] of ARISTAS) {
          const pa = proy[a];
          const pb = proy[b];
          const alfa = 0.03 + 0.13 * (1 - ((pa[2] + pb[2]) / 2 + 1) / 2);
          ctx.strokeStyle = `rgba(${colorAlambre}, ${alfa.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(pa[0], pa[1]);
          ctx.lineTo(pb[0], pb[1]);
          ctx.stroke();
        }
      }

      for (let i = 0; i < nodos.length; i += 1) {
        const [x1, y1, z2] = girar(posiciones[i]);
        const escala = distancia / (distancia + z2);
        const frente = 1 - (z2 + 1) / 2;

        const nodo = nodos[i];
        nodo.style.transform =
          `translate3d(${(cx + x1 * radio * escala).toFixed(1)}px, ${(cy + y1 * radio * escala).toFixed(1)}px, 0)` +
          ` translate(-50%, -50%) scale(${((0.68 + 0.45 * escala) * factorTamano).toFixed(3)})`;
        // Suelo de opacidad 0.62, y está medido, no elegido a ojo. Atenuar por
        // profundidad es lo que da volumen, pero también baja el contraste, y
        // WCAG 1.4.11 pide 3:1 para un gráfico que transmite información.
        // Sobre los fondos reales de esta sección (#FAF8F4 en claro, #0A1520 en
        // oscuro), el logotipo más lejano queda en 3.64:1 y 3.49:1. A 0.55 se
        // quedaba en 3.05 y 3.01 —pasa, pero sin margen—, y a 0.38, que es
        // donde estaba, en 1.70 y 2.07.
        nodo.style.opacity = (0.62 + 0.38 * frente).toFixed(3);
        nodo.style.zIndex = String(Math.round(frente * 100));
      }
    };

    const frame = () => {
      objY += (0.0024 + empujeScroll.current) * factorVelocidad.current;
      rotX += (objX - rotX) * 0.05;
      rotY += (objY - rotY) * 0.05;
      colocar();
      rafId = requestAnimationFrame(frame);
    };

    const alMoverCursor = (e) => {
      objX = -0.2 + (e.clientY / window.innerHeight - 0.5) * 0.45;
      objY += (e.movementX || 0) * 0.0003;
    };

    // Al pasar el cursor por encima casi se detiene: los tooltips traen el
    // nombre y no se pueden leer sobre un logotipo en movimiento.
    const frenar = () => { factorVelocidad.current = 0.12; };
    const soltar = () => { factorVelocidad.current = 1; };

    const montar = () => {
      if (montado) return;
      montado = true;
      nodos = [...lista.querySelectorAll("li")];
      lista.dataset.esfera = "on";
      colocar();

      if (quieto) return;

      window.addEventListener("pointermove", alMoverCursor, { passive: true });
      lista.addEventListener("pointerenter", frenar);
      lista.addEventListener("pointerleave", soltar);
      rafId = requestAnimationFrame(frame);

      // Fuera de pantalla no se dibuja: un rAF eterno a media página gasta
      // batería sin que nadie lo vea.
      if (typeof IntersectionObserver === "function") {
        observador = new IntersectionObserver(
          ([entrada]) => {
            if (entrada.isIntersecting === visible) return;
            visible = entrada.isIntersecting;
            if (visible) rafId = requestAnimationFrame(frame);
            else cancelAnimationFrame(rafId);
          },
          { threshold: 0 }
        );
        observador.observe(lista);
      }
    };

    const desmontar = () => {
      if (!montado) return;
      montado = false;
      cancelAnimationFrame(rafId);
      observador?.disconnect();
      observador = undefined;
      window.removeEventListener("pointermove", alMoverCursor);
      lista.removeEventListener("pointerenter", frenar);
      lista.removeEventListener("pointerleave", soltar);
      delete lista.dataset.esfera;
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Se limpian los estilos en línea: por debajo de `md` los <li> vuelven a
      // la rejilla normal y un transform residual los dejaría descolocados.
      for (const nodo of nodos) nodo.removeAttribute("style");
      nodos = [];
    };

    const alCambiarAncho = (e) => (e.matches ? montar() : desmontar());
    if (anchaSuficiente.matches) montar();
    anchaSuficiente.addEventListener("change", alCambiarAncho);
    window.addEventListener("resize", colocar);

    return () => {
      anchaSuficiente.removeEventListener("change", alCambiarAncho);
      window.removeEventListener("resize", colocar);
      desmontar();
    };
  }, [posiciones, oscuro]);

  // El scroll acelera el giro. Es lo que ata el globo a la sección: al bajar
  // por About, gira más rápido en el sentido del desplazamiento.
  useEffect(() => {
    const el = contenedorRef.current;
    if (!el || menosMovimiento() || !medible(el)) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        empujeScroll.current = self.getVelocity() * -0.0000018;
      },
      onLeave: () => { empujeScroll.current = 0; },
      onLeaveBack: () => { empujeScroll.current = 0; },
    });

    return () => {
      trigger.kill();
      empujeScroll.current = 0;
    };
  }, []);

  return (
    <div ref={contenedorRef} className="relative mx-auto w-full">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
      />

      <ul
        ref={listaRef}
        className="relative flex flex-wrap justify-center gap-3 md:block md:h-[clamp(280px,26vw,420px)]"
      >
        {items.map(({ Icon, name, key, hover }) => {
          const etiqueta = name || t(`about.stack.items.${key}`);
          return (
            <li
              key={etiqueta}
              // `md:absolute md:left-0 md:top-0`: el efecto escribe la posición
              // en el transform, así que el origen tiene que ser la esquina de
              // la lista y no el centro, o se sumarían dos desplazamientos.
              className="group relative md:absolute md:left-0 md:top-0"
            >
              {/* En reposo van en tinta, no en color de marca. Siete logotipos
                  con su color real caían por debajo de 3:1 sobre el fondo
                  oscuro —Jest a 1,52:1, Cloudinary a 1,71:1— porque sus marcas
                  son oscuras de origen. El color aparece al pasar el cursor,
                  junto al nombre.
                  En claro se usa `light-text` y no el `light-subtle` de la fila
                  de abajo: aquí la opacidad baja con la profundidad, y partir
                  del gris sutil dejaba el logotipo más lejano en 1.70:1.
                  Partiendo de la tinta, en 3.64:1. */}
              <Icon
                aria-hidden="true"
                className={`text-3xl text-light-text dark:text-dark-subtle ${hover}
                  transition-colors duration-200
                  motion-reduce:transition-none`}
              />
              <span className="sr-only">{etiqueta}</span>

              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-9 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap
                  rounded-md border border-light-border dark:border-dark-border
                  bg-light-surface dark:bg-dark-background
                  px-2 py-1 font-mono text-xs text-light-text dark:text-dark-text
                  opacity-0 shadow-lg transition-opacity duration-150
                  group-hover:opacity-100 motion-reduce:transition-none"
              >
                {etiqueta}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
