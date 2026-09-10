# Contenido pendiente de rellenar

Todo lo listado aquí es contenido de ejemplo/placeholder marcado con
comentarios `// TODO` en el código. Buscar `TODO` en el repo para localizarlo
exactamente (`grep -rn "TODO" src/`).

| Dato | Dónde | Valor actual |
| --- | --- | --- |
| Número de WhatsApp | [`Header.tsx`](../src/components/Header.tsx), [`Contact.tsx`](../src/components/Contact.tsx), [`ComingSoon.tsx`](../src/components/ComingSoon.tsx) | ✅ Real: +34 614 93 49 15 |
| Historia / texto de marca | [`About.tsx`](../src/components/About.tsx) | Texto genérico de ejemplo |
| Foto de tienda/equipo | [`About.tsx`](../src/components/About.tsx) | Bloque con borde discontinuo |
| Dirección | [`Contact.tsx`](../src/components/Contact.tsx) | ✅ Real, desde Loyverse: Av. de Madrid, 50, Navacerrada |
| Horario | [`Contact.tsx`](../src/components/Contact.tsx) | ✅ Real: viernes, sábados y domingos, con horario de invierno y de verano (solo abre esos tres días) |
| Teléfono / email | [`Contact.tsx`](../src/components/Contact.tsx) | ✅ Real: +34 614 93 49 15 / gildanavacerrada@gmail.com |
| Instagram | [`Contact.tsx`](../src/components/Contact.tsx) | ✅ Real: instagram.com/gildanavacerrada |
| Mapa de la tienda | [`Contact.tsx`](../src/components/Contact.tsx) | ✅ Real: iframe de Google Maps con la dirección real (sin API key) |
| Favicon / logo real | `src/app/favicon.ico`, `public/` | Icono por defecto de Next.js |
| **Fotos de producto** | [`ProductGrid.tsx`](../src/components/ProductGrid.tsx) | 🟡 Ya soportado: si el producto tiene `image_url` en Loyverse se muestra automáticamente (comprobado el 2026-09-10 con la única foto subida hasta ahora). El resto sigue mostrando "Sin foto" — se van mostrando solas a medida que se suban fotos en Loyverse, no requiere ningún cambio aquí. |

Cuando se disponga de estos datos reales, avisar para sustituirlos — no
requiere cambios de estructura, solo edición de contenido (excepto las fotos
de producto, que se suben directamente en Loyverse).

## Datos que ya vienen de Loyverse (no son placeholder)

Nombre, precio y stock de cada producto, y las 35 categorías agrupadas en 10
colecciones. Los productos se agrupan además por talla (mismo artículo,
tallas disponibles) a partir del nombre — ver
[architecture.md](./architecture.md#agrupado-por-talla-mismo-artículo-varias-tallas).
Ver [loyverse-integration.md](./loyverse-integration.md) para el detalle y
los problemas de calidad de datos detectados (algún producto mal
categorizado, sin precio, o con la talla en medio del nombre en vez de al
final, que por eso no se agrupa con sus hermanos).
