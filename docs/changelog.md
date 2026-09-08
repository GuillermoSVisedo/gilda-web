# Registro de cambios por sesión

Log cronológico de decisiones y trabajo realizado. El objetivo es que se
pueda seguir el hilo de *por qué* está cada cosa sin tener que adivinarlo por
el código o por el historial de git.

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
