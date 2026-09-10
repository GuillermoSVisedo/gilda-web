# Arquitectura y estructura de carpetas

```
src/
  app/
    layout.tsx           Layout raíz: fuentes, <html>/<body>, metadata (title/description)
    page.tsx              Home ("/"): hero, sobre nosotras, índice de colecciones, contacto
    globals.css            Tokens de Tailwind v4 (colores, fuentes) + estilos base
    coleccion/[slug]/
      page.tsx              Página de una colección: productos reales + paginación
      error.tsx              Fallback en marca si falla la llamada a Loyverse
    buscar/
      page.tsx              Buscador: resultados por nombre en TODO el catálogo
  components/
    Header.tsx             Cabecera sticky: logo, navegación, icono de buscar, CTA de WhatsApp
    Hero.tsx                Sección de portada (#inicio)
    About.tsx                Sección "sobre Gilda" (#sobre-gilda)
    CollectionIndex.tsx      Índice de las 10 colecciones, enlaza a /coleccion/[slug] (#colecciones)
    ProductGrid.tsx           Grid de tarjetas de producto (colección y búsqueda)
    Pagination.tsx             Paginación genérica (recibe un buildHref)
    StockFilterToggle.tsx      Botón "Solo en stock" genérico (colección y búsqueda)
    ComingSoon.tsx           Banner "cómo comprar ahora mismo"
    Contact.tsx               Dirección, horario, contacto, redes (#contacto)
    Footer.tsx                Pie de página
  data/
    collections.ts           Las 10 colecciones curadas y a qué categorías de Loyverse
                               corresponde cada una (ver más abajo)
  lib/
    loyverse.ts                Cliente de la API de Loyverse (fetch + paginación + tipos)
    products.ts                  Tipo `Product` + helpers compartidos: mapeo item→Product,
                                   paginación, y agrupado por talla (`groupProductsBySize`)
    collections.ts              Cruza colecciones ↔ categorías/productos/stock reales de Loyverse
    search.ts                    Busca por nombre en todo el catálogo (todas las categorías)
```

## Flujo de páginas

**Home (`/`)**: `Header`, `Hero`, `About`, `CollectionIndex` (enlaza a cada
colección), `ComingSoon`, `Contact`, `Footer`. Es la web de presentación
original — no lista productos directamente.

**Colección (`/coleccion/[slug]`)**: una página por colección
(`/coleccion/vestidos`, `/coleccion/zapatos`, etc.), generada dinámicamente a
partir de `data/collections.ts`. Cada página:

1. Resuelve la colección por `slug` (404 con `notFound()` si no existe).
2. Pide a Loyverse (vía `lib/collections.ts` → `lib/loyverse.ts`) las
   categorías, todos los productos y todo el inventario.
3. Filtra los productos cuya categoría de Loyverse pertenece a esa colección.
4. Si el visitante ha activado el filtro (parámetro `?stock=1`), descarta
   los productos con `inStock === 0` antes de paginar.
5. Pagina el resultado en el servidor (24 productos por página, parámetro
   `?page=N` en la URL) y pinta `ProductGrid`.

El filtro "Solo en stock" es un enlace que añade/quita `?stock=1` en la URL
— sin JavaScript de cliente, coherente con que toda la página es server-
rendered. `PageLink` (paginación) propaga `stock=1` si está activo, para no
perder el filtro al cambiar de página.

Se eligió **una página por colección** (en vez de todo en una sola página
larga) porque el catálogo real tiene más de 1.500 productos — comprobado el
2026-09-08 vía API. Ver [loyverse-integration.md](./loyverse-integration.md).

**Buscador (`/buscar`)**: mismo patrón que la colección (server-rendered,
paginado, filtro de stock), pero en vez de filtrar por categoría busca por
coincidencia de texto en `item_name` sobre **todos** los productos
(`lib/search.ts` → `searchProducts`), sin importar a qué categoría
pertenezcan. Es intencional: sirve para encontrar directamente un producto
por nombre sin tener que saber en qué colección está.

El formulario de búsqueda del header (`Header.tsx`) es un icono que enlaza a
`/buscar`; el input real vive en la propia página `/buscar` (`<form
action="/buscar" method="get">`, sin JavaScript — el envío genera
`/buscar?q=...` como cualquier formulario HTML). `Pagination.tsx` y
`StockFilterToggle.tsx` se extrajeron de la página de colección para
reutilizarlos aquí sin duplicar la lógica de "página anterior/siguiente" ni
la del botón de stock.

## Agrupado por talla (mismo artículo, varias tallas)

Loyverse no modela tallas como variantes de un mismo producto: cada talla es
un *item* suelto, con la talla escrita a mano casi siempre al final del
nombre (`"Vestido azul M"`, `"Alpargata burdeos 36"`). `groupProductsBySize`
en `src/lib/products.ts` agrupa esos productos sueltos en una sola tarjeta
con una lista de tallas, aplicando esto después de obtener la lista plana de
`Product[]` (tanto en `/coleccion/[slug]` como en `/buscar`, antes de
paginar).

**Cómo detecta la talla**: compara la última palabra del nombre contra una
lista cerrada de tallas conocidas (`TU, XS, S, M, L, XL, XXL, XXXL, SM, ML`,
más números de 2 cifras y `T` + número de 2 cifras para calzado). Si
coincide, esa palabra se quita y el resto del nombre es la "clave" de
agrupación; todos los productos que comparten esa clave se funden en una
`GroupedProduct` con sus tallas ordenadas (`XS→XXXL`/`TU` para ropa,
numérico ascendente para calzado).

**Por qué no agrupa por color también**: el usuario pidió agrupar por talla,
no por color — y hacerlo también por color exigiría adivinar qué palabra del
nombre es el color (con un vocabulario mucho más abierto que el de tallas),
arriesgando mezclar artículos que no tienen nada que ver. Comprobado con
datos reales: "Alpargata burdeos", "Alpargata camel", "Alpargata crudo"...
quedan como artículos separados, cada uno con sus propias tallas — correcto.

**Casos que se escapan (calidad de los datos de Loyverse, no del código)**:

- Si la talla no va al final del nombre (ej. `"Blusón XL granate"`, con la
  talla en medio), ese producto no se agrupa con sus hermanos de otra talla
  y aparece suelto. Detectado el 2026-09-10; no se ha corregido porque
  habría que adivinar la posición de la talla dentro del nombre con mucho
  más riesgo de falsos positivos.
- Cuando hay productos duplicados con nombre y talla idénticos (pasa en
  Loyverse — comprobado con "Camisa blanca cuello", con "S" repetido 3
  veces), su stock se **suma** en la misma talla en vez de mostrarse por
  separado.
- La foto del grupo es la de cualquiera de sus tallas que tenga una (dado
  que casi ningún producto tiene foto todavía, ver
  [loyverse-integration.md](./loyverse-integration.md)).

## Colecciones curadas vs. categorías reales de Loyverse

Loyverse tiene 35 categorías reales, muy desiguales en tamaño (desde 1 hasta
más de 200 productos). Se decidió **agruparlas a mano en 10 colecciones**
para la navegación de la web, en vez de mostrar las 35 tal cual.

`src/data/collections.ts` exporta `COLLECTIONS`: cada colección tiene
`slug`, `name`, `description` y `loyverseCategoryNames` (los nombres de
categoría de Loyverse que agrupa, ej. `"chaquetas-y-abrigos"` agrupa
`CHAQUETA`, `ABRIGO`, `AMERICANA`, `CAPAS`, `PONCHO`).

`src/lib/collections.ts` (`getCollectionProducts`) hace el cruce en tiempo
de ejecución: pide categorías + items + inventario a Loyverse, resuelve qué
`category_id` de Loyverse corresponde a los nombres de la colección, y
filtra/enriquece los productos con precio y stock real.

**Mantenimiento**: si en Loyverse se crea una categoría nueva que no encaje
en ninguna de las 10, sus productos no aparecerán en la web hasta que se
añada su nombre a `loyverseCategoryNames` del grupo correspondiente en
`data/collections.ts` (o se cree un grupo nuevo). No hay lógica automática
de "categoría nueva → aparece sola": fue una decisión consciente a cambio de
una navegación más cuidada (ver discusión en el changelog del 2026-09-08).

## Qué pasa si Loyverse falla

`src/lib/loyverse.ts` define `LoyverseApiError` (subclase de `Error`) y la
usa para envolver cualquier fallo al hablar con Loyverse: timeout (8s,
`AbortSignal.timeout`), error de red, respuesta no-2xx, o token ausente.
Como todo pasa por `loyverseFetch`, cualquier fallo de cualquiera de los
tres endpoints (`getCategories`, `getAllItems`, `getAllInventory`) acaba
siendo un `LoyverseApiError`.

`src/app/coleccion/[slug]/error.tsx` es el *error boundary* de esa ruta
(convención `error.js` de Next.js): si el Server Component de la página
lanza mientras carga, en vez del error genérico de Next se muestra una
pantalla en marca ("No hemos podido cargar esta colección") con un botón
**Reintentar**. Ese botón usa el prop `retry()` (estable desde Next
16.3, ver `node_modules/next/dist/docs/.../error.md`) — no `reset()` —
porque `retry()` sí vuelve a pedir los datos al servidor; `reset()` solo
limpiaría el estado de error sin re-ejecutar el fetch.

La home (`/`) no necesita este manejo: no llama a Loyverse (`CollectionIndex`
solo lee `data/collections.ts`, que es estático), así que sigue funcionando
aunque Loyverse esté caído — el usuario solo pierde el catálogo, no la web
entera.

Probado manualmente: token inválido temporal → la página muestra el
fallback y el servidor loguea `LoyverseApiError: Loyverse API error 401 en
/inventory...`; con el token restaurado, la página vuelve a cargar los
productos reales.

## Por qué no hay una API route de por medio

La lectura de datos de Loyverse ocurre directamente en Server Components
(`src/app/coleccion/[slug]/page.tsx`, `src/app/buscar/page.tsx`), no a
través de un route handler propio (`/api/loyverse/...`). Motivo: toda
interacción (paginar, filtrar por stock, buscar) es una navegación HTML
normal vía `searchParams`, sin JavaScript de cliente — con Server Components
el token de Loyverse nunca sale del servidor y no hace falta una capa extra.
Si en el futuro se necesita autocompletado en vivo mientras se escribe (con
JavaScript en el cliente), ahí sí tendrá sentido añadir un route handler.

## Caché y paginación contra la API de Loyverse

- La API de Loyverse **no admite filtrar `/items` por categoría** (los
  parámetros `category_id`/`category_ids` se probaron manualmente y se
  ignoran). Por eso `lib/loyverse.ts` trae **todos** los productos e
  inventario (paginando con el `cursor` que devuelve la API) y el filtrado
  por colección se hace en memoria, en `lib/collections.ts`.
- Cada `fetch` a Loyverse usa `next: { revalidate: 300 }` (5 minutos). Es un
  catálogo informativo de solo lectura — no hace falta consultar Loyverse en
  cada visita; Next.js cachea la respuesta y la reutiliza entre peticiones
  durante esos 5 minutos.
- El stock (`in_stock`) vive en el endpoint `/inventory`, separado de
  `/items`, y se cruza por `variant_id`.

## Componentes: notas concretas

- **Header.tsx**: la navegación (`NAV_LINKS`) es una lista fija de anclas a
  secciones de la home (Inicio, Sobre nosotras, Colecciones, Contacto). El
  header se renderiza en todas las páginas (incluidas las de colección), así
  que los hrefs llevan `/` delante (`/#contacto`, no `#contacto`) — si no,
  el enlace no hace nada estando fuera de la home. Las 10 colecciones NO
  están en el header — para eso está `CollectionIndex` dentro de la home.
- **ProductGrid.tsx**: recibe `GroupedProduct[]` (no `Product[]` directo) y
  pinta nombre, precio, foto y, si `product.sizes` no es `null`, una fila de
  pastillas — una por talla, resaltada si tiene stock y tachada/apagada si
  está agotada (con `title` con el detalle al pasar el ratón). Si `sizes` es
  `null` (no se detectó talla en el nombre), cae al comportamiento anterior:
  una sola línea "En stock (N)" / "Agotado". Si `product.imageUrl` existe
  (viene de `item.image_url` en Loyverse) se muestra con `next/image` (`fill`
  + `object-cover`); si no, bloque "Sin foto". Las fotos se sirven
  directamente desde `api.loyverse.com/image/...` — es una URL pública (sin
  token), comprobado con `curl` — por eso hace falta tenerla en
  `images.remotePatterns` de `next.config.ts`. A fecha 2026-09-10 solo hay 1
  producto de 1.502 con foto subida; el resto se irán mostrando solas según
  se suban en Loyverse.
- **About.tsx / Contact.tsx**: contienen datos de ejemplo, salvo la
  dirección de `Contact.tsx` (ya es la real, obtenida de Loyverse). Listado
  completo en [content-todos.md](./content-todos.md).

## Convenciones

- Todo el texto de la UI está en español (público objetivo de la tienda).
- Los comentarios de código en español, breves, solo para marcar TODOs o
  explicar una decisión no obvia — no se documenta lo que ya es evidente por
  el nombre del componente.
- Sin gestor de estado ni librería de componentes externa: Tailwind directo
  sobre HTML semántico.
