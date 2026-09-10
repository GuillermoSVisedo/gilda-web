# Registro de cambios por sesión

Log cronológico de decisiones y trabajo realizado. El objetivo es que se
pueda seguir el hilo de *por qué* está cada cosa sin tener que adivinarlo por
el código o por el historial de git.

## 2026-09-10 — Fotos de producto (soporte añadido, casi sin fotos aún)

- El usuario pide comprobar si ya hay fotos subidas en Loyverse. Consulta
  directa a la API: de 1.502 productos, **solo 1 tiene foto**
  ("Camisa abullonada rayas naranja M"). Se verifica que la URL de imagen
  (`api.loyverse.com/image/...`) es pública (200 con y sin token) y es una
  foto real (453KB, no un placeholder).
- Se añade soporte para mostrar la foto cuando exista: `Product.imageUrl`
  en `lib/collections.ts` (desde `item.image_url`), `ProductGrid.tsx` usa
  `next/image` con `fill`/`object-cover` cuando hay foto y sigue mostrando
  "Sin foto" cuando no la hay.
- Hace falta añadir `api.loyverse.com` a `images.remotePatterns` en
  `next.config.ts` (Next.js bloquea con 400 cualquier dominio externo no
  declarado ahí al usar `next/image`).
- Verificado en el navegador (encontrada la página exacta del producto con
  foto vía `curl` en un bucle, para no navegar a mano entre cientos de
  productos): la foto se recorta y encaja bien en la tarjeta; el resto de
  productos sin foto no se ven afectados. Build de producción limpio.
- No hace falta ningún cambio más cuando se suban más fotos en Loyverse —
  aparecerán solas.

## 2026-09-08 — Bug: la nav del header no funcionaba fuera de la home

- El usuario reporta que, estando en una colección (ej.
  `/coleccion/vestidos`), pulsar "Contacto" en el header no llevaba a
  ningún sitio. Causa: `NAV_LINKS` y el logo usaban anclas relativas
  (`#contacto`, `#inicio`...), que solo funcionan si ya estás en `/` — esas
  secciones no existen en `/coleccion/[slug]`.
- Corregido en `Header.tsx`: todos los hrefs de `NAV_LINKS` llevan `/`
  delante (`/#contacto`, etc.) para que funcionen desde cualquier ruta; el
  logo pasa a usar `next/link` apuntando a `/` (lint obligaba a `Link` en
  vez de `<a>` para enlaces internos sin ancla).
- Verificado: navegar a `/#contacto` desde otra ruta carga la home y hace
  scroll hasta la sección de contacto (comprobado con
  `getBoundingClientRect` — el contenido queda justo debajo del header
  sticky).
- Los CTA de `Hero.tsx` (`#colecciones`, `#contacto`) no se tocaron: ese
  componente solo se renderiza en la home, así que las anclas relativas ahí
  sí son correctas.

## 2026-09-08 — Email corregido + filtro "solo en stock"

- El email de contacto que se había dado antes
  (carmenlgperalta@gmail.com) era incorrecto; se corrige a
  gildanavacerrada@gmail.com en `Contact.tsx`.
- Se añade un filtro "Solo en stock" en `/coleccion/[slug]`: un enlace que
  activa/desactiva `?stock=1` en la URL y descarta productos con
  `inStock === 0` antes de paginar. Sin JavaScript de cliente (coherente
  con el resto de la página, que es server-rendered). La paginación
  (`PageLink`) propaga el filtro para no perderlo al cambiar de página.
- Probado en una colección pequeña (Joyería y bisutería: 29 → 20 al
  filtrar) y en una grande (Vestidos, 221 productos: `Siguiente` genera
  `?page=2&stock=1`, confirma que el filtro sobrevive a la paginación).

## 2026-09-08 — Manejo de errores si Loyverse falla

- Se añade `LoyverseApiError` en `lib/loyverse.ts`: envuelve cualquier fallo
  al hablar con Loyverse (timeout de 8s vía `AbortSignal.timeout`, error de
  red, HTTP no-2xx, token ausente) en un tipo identificable.
- Se añade `src/app/coleccion/[slug]/error.tsx` (convención `error.js` de
  Next.js): si falla la carga de una colección, se muestra una pantalla en
  marca con botón "Reintentar", en vez de la página de error genérica de
  Next.
- Se usa el prop `retry()` en vez de `reset()` — al leer la documentación
  local de Next 16 (`node_modules/next/dist/docs/`) se descubrió que Next
  16.3 estabilizó `retry()`, que sí vuelve a pedir los datos al servidor
  (`reset()` no re-ejecuta el fetch, solo limpia el estado de error).
- Probado de verdad: se puso un token inválido en `.env.local`, se
  reinició el servidor de desarrollo, se confirmó que aparece el fallback
  (no el error genérico) y que el servidor loguea `LoyverseApiError` con
  el código HTTP real (401); luego se restauró el token y se confirmó que
  la página vuelve a mostrar productos reales.
- La home no necesita este manejo: no depende de Loyverse (el índice de
  colecciones es estático), así que sigue funcionando aunque Loyverse esté
  caído.

## 2026-09-08 — Despliegue a producción (Vercel + GitHub)

- Se decide alojar en Vercel (integración nativa con Next.js, build/HTTPS
  automáticos, plan gratuito suficiente) en vez de servidor propio.
- Registro en GitHub y Vercel hechos por el usuario (login/creación de
  cuenta no son acciones que el asistente pueda hacer). El asistente no
  pudo instalar/ejecutar una sugerencia de Vercel para añadir un "plugin"
  (`npx plugins add vercel/vercel-plugin`) sin verificar antes qué era
  exactamente — el usuario indicó ignorarla, queda sin investigar.
- Para el push a GitHub por HTTPS hizo falta que el usuario configurase
  `git config --global credential.helper manager` en su máquina (el
  asistente tiene prohibido tocar la config de git); con eso, Git
  Credential Manager gestionó el login por navegador.
- Repositorio conectado: `git remote add origin
  https://github.com/GuillermoSVisedo/gilda-web.git`, push de los 7
  commits existentes a `main`.
- Verificado `npm run build` limpio antes del despliegue (compila,
  TypeScript sin errores, `/` estático, `/coleccion/[slug]` dinámico según
  lo esperado).
- Vercel importa el repo y despliega automáticamente en cada push a `main`.
  `LOYVERSE_API_TOKEN` configurado como variable de entorno en Vercel
  (Project Settings), no solo en `.env.local`.
- Verificado en `https://gilda-web.vercel.app`: catálogo real (221
  vestidos con precio y stock) cargando correctamente en producción, sin
  errores de consola.
- Se cierra el túnel de Cloudflare local (ya no hace falta: la web tiene
  una URL de producción estable).

## 2026-09-08 — Pantone real de la marca

- Se sustituye el verde oliva "aproximado" elegido inicialmente por el
  Pantone real de Gilda: `#636B2F`. Pasa a ser `--color-olive-dark` en
  `globals.css`; `--color-olive` (fondos claros) y `--color-olive-deep`
  (hover) se recalculan a partir de ese valor para mantener la misma
  relación tonal que antes. Verificado en navegador vía
  `getComputedStyle` (el panel estaba oculto, sin captura visual posible)
  que el color renderizado es exactamente `rgb(99, 107, 47)`.

## 2026-09-08 — Mapa real de la tienda

- Se sustituye el bloque placeholder "Mapa de la tienda (pendiente de
  añadir)" de `Contact.tsx` por un iframe real de Google Maps con la
  dirección de la tienda (`www.google.com/maps?q=...&output=embed` — no
  requiere API key). Se añade también un enlace "Abrir en Google Maps"
  fuera del iframe (envolver el iframe en un `<a>` no funciona: el iframe
  captura los clics).
- Con esto, `Contact.tsx` ya no tiene ningún dato placeholder salvo la foto
  de la tienda/equipo (sigue en `About.tsx`).

## 2026-09-08 — Teléfono/WhatsApp y email reales

- Se sustituye el número de WhatsApp placeholder (`Header.tsx`,
  `ComingSoon.tsx`, `Contact.tsx`) por el real: +34 614 93 49 15.
- Se sustituye el email placeholder de `Contact.tsx` por el real de
  contacto: carmenlgperalta@gmail.com.
- Con esto, todos los datos de contacto de `Contact.tsx` son ya reales
  (dirección, horario, teléfono, email, Instagram) salvo la foto de la
  tienda y el mapa — ver [content-todos.md](./content-todos.md).

## 2026-09-08 — Instagram real + horario real + túnel de Cloudflare

- Se sustituye el Instagram placeholder de `Contact.tsx` por el real:
  instagram.com/gildanavacerrada.
- Se añade el horario real de la tienda: solo abre viernes, sábados y
  domingos (nada de lunes a jueves), con horario de invierno y de verano
  distintos. Se muestran ambos horarios etiquetados en `Contact.tsx` — no
  hay fecha de corte automática entre temporadas, se listan los dos.
- Se levanta un túnel rápido de Cloudflare (`cloudflared tunnel --url
  http://localhost:3210`, sin cuenta) para enseñar la web en red mientras
  el servidor de desarrollo sigue corriendo en local. Es una URL temporal
  de `trycloudflare.com`, sin autenticación — cualquiera con el enlace ve
  el catálogo completo mientras el túnel esté activo. No es para producción,
  solo para previews puntuales.

## 2026-09-08 — Fase 1 de Loyverse implementada: catálogo con stock real

- El usuario genera el token de acceso a la API en el panel de Loyverse y lo
  comparte para guardarlo en `.env.local` (nunca en el repositorio).
- Se prueba la API directamente (curl) antes de escribir código: confirma
  que el token funciona, revela el catálogo real (**más de 1.500
  productos**, no una tienda de prueba) y que la API **no admite filtrar
  `/items` por categoría** (parámetros `category_id`/`category_ids`
  ignorados) — hay que traer todo y filtrar en memoria.
- Dado el tamaño real del catálogo, se replantea la arquitectura ya montada
  el día anterior (todo en la home, anclas por categoría) por: una página
  dedicada por colección (`/coleccion/[slug]`) con paginación, y las 35
  categorías reales de Loyverse agrupadas a mano en 10 colecciones
  curadas. Decisión tomada con el usuario antes de tocar código (dos
  preguntas: estructura de navegación y si agrupar categorías).
- Se construye la capa de datos: `lib/loyverse.ts` (cliente de la API con
  paginación por cursor y caché de 5 min) y `lib/collections.ts` (cruce
  colección ↔ categoría real ↔ producto ↔ stock).
- Se sustituyen `CategoryIndex`/`CategorySection` (placeholders) por
  `CollectionIndex` (enlaza a páginas reales) y `ProductGrid` (tarjetas de
  producto con nombre, precio y stock reales).
- Se actualiza `Contact.tsx` con la dirección real de la tienda (obtenida de
  Loyverse: Av. de Madrid, 50, Navacerrada, Madrid) y `ComingSoon.tsx` para
  reflejar que el stock ya es real (antes decía "muy pronto").
- Hallazgos de calidad de datos en Loyverse (no corregidos desde la web,
  solo documentados): un producto sin categoría, uno mal categorizado, y
  productos sin precio. Detalle en
  [loyverse-integration.md](./loyverse-integration.md).
- Verificado en navegador con datos reales (paginación, precios, stock,
  colecciones pequeñas y grandes), sin errores de consola, lint y
  `tsc --noEmit` limpios.

## 2026-09-08 — Preparación de la integración con Loyverse

- Se acuerda el alcance de la fase 1 de Loyverse: solo mostrar stock en
  tiempo real (catálogo informativo), sin checkout ni pago online. Detalle
  en [loyverse-integration.md](./loyverse-integration.md).
- Se confirma que la cuenta de Loyverse es de pago (suscripción mensual).
- **Nota de seguridad**: el usuario compartió por chat el email y la
  contraseña de su cuenta de Loyverse. No se ha usado esa contraseña para
  nada (no se ha iniciado sesión en Loyverse) — es una credencial de cuenta
  de usuario y entrar con ella está fuera de lo que este asistente puede
  hacer, incluso si se pide explícitamente. Se avisó al usuario de que la
  contraseña quedó escrita en el historial del chat y se le recomendó
  cambiarla. En su lugar, se acuerda usar un token de acceso a la API
  (credencial revocable y de alcance limitado, pensada para esto), que el
  usuario añadirá él mismo a `.env.local` — nunca se pide ni se comparte por
  el chat. Ver plantilla en [`.env.example`](../.env.example) y variable
  `LOYVERSE_API_TOKEN`.
- Se inicializa git en el repositorio (antes no tenía control de versiones)
  con un primer commit del estado actual del proyecto.
- Se añade `!.env.example` al `.gitignore` para que la plantilla de
  variables de entorno sí se versione, sin arriesgar que un `.env.local`
  real se suba por error (`.env*` sigue ignorado).

## 2026-09-08 — Estructura por categorías + color de marca

- Se sustituye la sección genérica de "colecciones" (un único grid teaser)
  por una estructura real por categoría: `CategoryIndex` (índice con enlaces
  ancla) + un `CategorySection` por categoría, generados desde
  `data/categories.ts`.
- Se centraliza el listado de categorías en `data/categories.ts` para que
  sea el único sitio a cambiar cuando lleguen datos reales o, más adelante,
  la API de Loyverse.
- Cambio de paleta: de rosa empolvado a verde oliva (color de marca de
  Gilda). Tokens renombrados en `globals.css` (`--color-blush*` →
  `--color-olive*`) y aplicados en botones, bordes, logo y kickers en
  mayúsculas de todos los componentes.
- Se añade `scroll-mt-24` a todas las secciones con ancla para que el header
  sticky no tape el contenido al navegar.
- Verificado en navegador (desktop y móvil), sin errores de consola, lint
  limpio.

## 2026-09-08 — Primera versión: web de presentación

- Se decide el alcance de la fase 1: web de presentación (sin carrito ni
  checkout), preparando el terreno para conectar Loyverse más adelante.
- Se elige Next.js 16 (App Router, TypeScript, Tailwind v4) en vez de HTML
  estático, precisamente para que la futura tienda online sea una ampliación
  del mismo proyecto. Ver [stack.md](./stack.md) para el razonamiento
  completo.
- Proyecto creado con `create-next-app` en
  `C:\Users\kamik\source\repos\gilda-web`.
- Primera versión de las secciones: `Header`, `Hero`, `About`, `Categories`
  (grid teaser genérico, luego sustituido — ver sesión siguiente),
  `ComingSoon`, `Contact`, `Footer`.
- Paleta inicial: crema + rosa empolvado ("blush") + carbón. Tipografía
  Cormorant Garamond (serif) + Inter (sans).
- Todo el contenido específico de la tienda (dirección, teléfono, historia,
  fotos, redes) se deja como placeholder marcado con `// TODO` — ver
  [content-todos.md](./content-todos.md).
- Verificado en navegador, responsive, sin errores de consola, lint limpio.
