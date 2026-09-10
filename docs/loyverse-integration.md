# Integración con Loyverse

Estado: **fase 1 implementada** (2026-09-08). El catálogo de la web muestra
productos, precios y stock reales leídos de Loyverse. Sin checkout ni pago
online — eso sigue fuera de alcance (ver abajo).

## Decisiones tomadas

- **Cuenta de Loyverse**: de pago, con suscripción mensual. El acceso a la
  API REST está incluido.
- **Alcance de la fase 1**: solo mostrar stock en tiempo real (catálogo
  informativo). **Sin checkout ni pago online**.
- **Gestión del token**: el usuario generó una "Ficha de acceso" (token) en
  el panel de Loyverse y lo compartió directamente en el chat para que se
  guardase en `.env.local` (variable `LOYVERSE_API_TOKEN`) — nunca se sube
  al repositorio (`.gitignore` ya excluye `.env*`). Plantilla en
  [`.env.example`](../.env.example).

## Lo que se descubrió al conectar con datos reales

- **Catálogo grande**: más de 1.500 productos activos (no una tienda de
  prueba). Esto obligó a replantear la navegación: en vez de listar
  categorías/productos en la home, cada colección tiene su propia página
  paginada (`/coleccion/[slug]`) — ver
  [architecture.md](./architecture.md).
- **35 categorías reales en Loyverse**, muy desiguales (de 1 a 220+
  productos): CHALECOS, PONCHO, MONO, PINZA, BERMUDA, TOPS, COLETEROS,
  MONEDEROS, PULSERAS, SUDADERA, Bisuteria, PERFUMES, CAPAS, CINTURONES,
  BUFANDA, BLUSA/CAMISA, VESTIDO, PACK GORRO+BUFANDA, ABRIGO, ZAPATOS,
  PAÑUELOS, GUANTES, GORRO, BOLSO, CALCETINES, CADENA, PENDIENTE, COLLAR,
  JERSEY, CHAQUETA, AMERICANA, CAMISETA, VAQUERO, FALDA, PANTALON. Se
  agruparon a mano en 10 colecciones para la web — mapeo completo en
  [`data/collections.ts`](../src/data/collections.ts).
- **Ningún producto tiene foto subida en Loyverse.** Las tarjetas de
  producto muestran un bloque "Sin foto" en vez de imagen — pendiente de que
  se suban fotos en Loyverse (no es algo que se pueda arreglar desde la web).
- **La API no permite filtrar `/items` por categoría** (se probó con
  `category_id` y `category_ids`, ambos ignorados). Hay que traer todo el
  catálogo paginado y filtrar en memoria — ver detalle técnico en
  [architecture.md](./architecture.md).
- **Una sola tienda** en la cuenta: "Gilda", en Av. de Madrid, 50,
  Navacerrada, Madrid (28491) — ya usada como dirección real en
  `Contact.tsx`. No hay problema de multi-tienda que resolver.
- **Calidad de los datos de Loyverse** (para que el usuario lo sepa, no algo
  que se vaya a "arreglar" desde el código): al menos un producto está mal
  categorizado en Loyverse (una blusa apareciendo dentro de la categoría de
  bisutería) y al menos un producto no tiene precio (`default_price` nulo,
  por lo que su tarjeta no muestra precio). Son datos a revisar directamente
  en Loyverse si se quiere corregir.

## Limitaciones de Loyverse (no arreglables desde la web)

- **Loyverse solo permite 1 foto por producto.** No hay forma de subir
  varias fotos de un mismo artículo desde la web — es una limitación del
  propio Loyverse, no de este proyecto.
- **Loyverse no modela tallas ni colores como variantes.** No usan el
  sistema de "opciones" de Loyverse (`option1_name` etc. están vacíos en
  todos los productos comprobados) — cada talla de un mismo artículo está
  cargada como un producto suelto distinto, con la talla escrita a mano al
  final del nombre casi siempre (ej. "Vestido azul M", "Vestido azul S").
  Ver [architecture.md](./architecture.md#agrupado-por-talla-mismo-artículo-varias-tallas)
  para cómo se agrupan en la web a partir del nombre.

## Cómo funciona ahora mismo (resumen técnico)

- `src/lib/loyverse.ts`: cliente de la API (categorías, items, inventario,
  tienda), con paginación por `cursor` y caché de 5 minutos
  (`next: { revalidate: 300 }`).
- `src/lib/collections.ts`: cruza colección ↔ categorías de Loyverse ↔
  productos ↔ stock, y devuelve la lista de productos de una colección con
  precio mínimo y unidades en stock.
- `src/app/coleccion/[slug]/page.tsx`: página server-rendered por colección,
  con paginación propia (24 productos/página vía `?page=N`).
- Todo ocurre en Server Components — el token nunca llega al navegador, no
  hay una API route propia de por medio (no hace falta todavía, no hay
  interacción en el cliente).
- Si Loyverse no responde (caída, timeout, token inválido), la página de
  colección muestra un fallback en marca con botón "Reintentar" en vez de
  romperse — ver detalle en [architecture.md](./architecture.md).

## Fuera de alcance (para más adelante)

Checkout con pago online, creación de pedidos en Loyverse, evitar
sobreventa entre tienda física y web, fotos de producto, filtros/buscador en
el cliente. Documentado aquí solo como referencia para cuando se aborde esa
fase.

## Próximo paso

Ninguno pendiente para la fase 1 (ya en marcha). Cuando el usuario quiera
avanzar a checkout, retomar este documento para planificar esa fase.
