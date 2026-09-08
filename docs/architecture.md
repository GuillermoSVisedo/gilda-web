# Arquitectura y estructura de carpetas

```
src/
  app/
    layout.tsx      Layout raíz: fuentes, <html>/<body>, metadata (title/description)
    page.tsx         Página única ("/"): monta todas las secciones en orden
    globals.css       Tokens de Tailwind v4 (colores, fuentes) + estilos base
  components/
    Header.tsx        Cabecera sticky: logo, navegación, CTA de WhatsApp
    Hero.tsx           Sección de portada (#inicio)
    About.tsx          Sección "sobre Gilda" (#sobre-gilda)
    CategoryIndex.tsx  Índice de categorías con enlaces ancla (#colecciones)
    CategorySection.tsx  Sección repetible: una por categoría, con productos placeholder
    ComingSoon.tsx     Banner "tienda online muy pronto"
    Contact.tsx        Dirección, horario, contacto, redes (#contacto)
    Footer.tsx         Pie de página
  data/
    categories.ts      Fuente de verdad de las categorías (ver más abajo)
```

## Flujo de la página

`src/app/page.tsx` renderiza las secciones en este orden fijo:

1. `Header` (fuera de `<main>`, sticky)
2. `Hero`
3. `About`
4. `CategoryIndex` — pastillas que enlazan a cada `#slug` de categoría
5. Un `CategorySection` por cada entrada de `CATEGORIES` (bucle `.map`)
6. `ComingSoon`
7. `Contact`
8. `Footer`

Es una página de una sola ruta (`/`) con navegación por anclas (`#inicio`,
`#sobre-gilda`, `#colecciones`, `#<slug-categoría>`, `#contacto`). Todas las
secciones con ancla llevan la clase `scroll-mt-24` para que el contenido no
quede oculto bajo el header sticky al saltar a ellas.

## Categorías como fuente de datos separada

`src/data/categories.ts` exporta un array `CATEGORIES` con `{ slug, name,
description }`. Tanto `CategoryIndex` como el bucle en `page.tsx` leen de ahí
— no hay nombres de categoría hardcodeados en los componentes de UI.

Esto es deliberado: es el punto de enganche pensado para Loyverse. Cuando se
conecte la API, `CATEGORIES` (y los productos placeholder dentro de
`CategorySection`) se sustituirán por datos obtenidos de Loyverse (server
component con `fetch`, o un route handler que haga de proxy/caché). Ver
[loyverse-integration.md](./loyverse-integration.md).

## Componentes: notas concretas

- **Header.tsx**: la navegación (`NAV_LINKS`) es una lista fija de anclas
  generales (Inicio, Sobre nosotras, Colecciones, Contacto). Las categorías
  individuales NO están en el header para evitar que la nav crezca sin
  límite cuando Loyverse traiga muchas categorías; para eso está
  `CategoryIndex` dentro de la propia página.
- **CategorySection.tsx**: recibe una `Category` por props y pinta un grid de
  4 tarjetas placeholder (`PLACEHOLDER_PRODUCTS = 4`). Cuando haya productos
  reales, esta tarjeta placeholder es la que se sustituye por una tarjeta de
  producto real (foto, nombre, precio, disponibilidad).
- **About.tsx / Contact.tsx**: contienen datos de ejemplo (dirección,
  teléfono, historia de la marca) marcados con comentarios `// TODO`. Listado
  completo en [content-todos.md](./content-todos.md).

## Convenciones

- Todo el texto de la UI está en español (público objetivo de la tienda).
- Los comentarios de código en español, breves, solo para marcar TODOs o
  explicar una decisión no obvia — no se documenta lo que ya es evidente por
  el nombre del componente.
- Sin gestor de estado ni librería de componentes externa: Tailwind directo
  sobre HTML semántico.
