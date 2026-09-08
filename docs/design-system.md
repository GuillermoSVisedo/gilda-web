# Sistema de diseño

Definido en [`src/app/globals.css`](../src/app/globals.css) como tokens de
Tailwind v4 (`@theme inline`), no en un `tailwind.config.js` (Tailwind v4 no
lo requiere).

## Color

| Token CSS | Uso | Valor |
| --- | --- | --- |
| `--color-cream` | Fondo general del sitio | `#faf6f1` |
| `--color-olive` | Fondos suaves / tarjetas placeholder (verde oliva claro) | `#dee2c6` |
| `--color-olive-dark` | Color de marca: botones, bordes, enlaces activos, logo | `#6b7049` |
| `--color-olive-deep` | Hover de botones sobre `olive-dark` | `#4f5336` |
| `--color-charcoal` | Texto principal / títulos | `#241f1c` |
| `--color-charcoal-soft` | Texto secundario / párrafos | `#40372f` |
| `--color-line` | Bordes y separadores neutros | `#e2e1d1` |

En Tailwind se usan como clases normales: `bg-olive-dark`, `text-charcoal-soft`,
`border-line/70`, etc. (el sufijo `/NN` es opacidad).

**El verde oliva (`olive-dark`) es el color de marca de Gilda** y es el que
debe usarse para cualquier elemento interactivo o de acento nuevo (botones,
enlaces activos, iconos destacados). `charcoal` se reserva para texto y
elementos de "tinta" (footer oscuro, texto de cuerpo).

## Tipografía

- **Cormorant Garamond** (`font-serif`): serif elegante, para el logo y todos
  los títulos (`h1`, `h2`).
- **Inter** (`font-sans`): sans-serif, para texto de cuerpo, navegación,
  botones. Es la fuente por defecto del `<body>`.

Las etiquetas pequeñas en mayúsculas (kickers tipo "SOBRE NOSOTRAS", "MUY
PRONTO") usan `text-xs tracking-[0.35em] uppercase text-olive-dark` — este
patrón se repite en todas las secciones y debe mantenerse igual si se añaden
nuevas.

## Patrones reutilizados

- **Botón primario**: `rounded-full bg-olive-dark px-8 py-3 text-sm tracking-wide text-cream hover:bg-olive-deep`
- **Botón secundario (outline)**: `rounded-full border border-olive-dark px-8 py-3 text-sm tracking-wide text-charcoal hover:bg-olive-dark hover:text-cream`
- **Tarjeta placeholder** (foto/producto pendiente): `rounded-2xl border border-dashed border-olive-dark/50 bg-olive/40` — el borde discontinuo indica visualmente que es contenido de relleno, no definitivo.
- **Separador entre secciones**: `border-t`/`border-b border-line/70`.

## Responsive

Mobile-first con los breakpoints estándar de Tailwind (`sm`, `md`). La
navegación del header se oculta por debajo de `md` (no hay menú hamburguesa
todavía — pendiente si se añaden más enlaces).
