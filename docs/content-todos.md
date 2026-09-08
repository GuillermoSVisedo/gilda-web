# Contenido pendiente de rellenar

Todo lo listado aquí es contenido de ejemplo/placeholder marcado con
comentarios `// TODO` en el código. Buscar `TODO` en el repo para localizarlo
exactamente (`grep -rn "TODO" src/`).

| Dato | Dónde | Valor actual |
| --- | --- | --- |
| Número de WhatsApp | [`Header.tsx`](../src/components/Header.tsx), [`Contact.tsx`](../src/components/Contact.tsx), [`ComingSoon.tsx`](../src/components/ComingSoon.tsx) | Placeholder `+34 600 000 000` |
| Historia / texto de marca | [`About.tsx`](../src/components/About.tsx) | Texto genérico de ejemplo |
| Foto de tienda/equipo | [`About.tsx`](../src/components/About.tsx) | Bloque con borde discontinuo |
| Dirección | [`Contact.tsx`](../src/components/Contact.tsx) | ✅ Real, desde Loyverse: Av. de Madrid, 50, Navacerrada |
| Horario | [`Contact.tsx`](../src/components/Contact.tsx) | ✅ Real: viernes, sábados y domingos, con horario de invierno y de verano (solo abre esos tres días) |
| Teléfono / email | [`Contact.tsx`](../src/components/Contact.tsx) | Placeholder `hola@gilda.com` |
| Instagram | [`Contact.tsx`](../src/components/Contact.tsx) | ✅ Real: instagram.com/gildanavacerrada |
| Mapa de la tienda | [`Contact.tsx`](../src/components/Contact.tsx) | Bloque con borde discontinuo (pendiente iframe de Google Maps, ya con la dirección real) |
| Favicon / logo real | `src/app/favicon.ico`, `public/` | Icono por defecto de Next.js |
| **Fotos de producto** | [`ProductGrid.tsx`](../src/components/ProductGrid.tsx) | Bloque "Sin foto" — ningún producto tiene `image_url` en Loyverse todavía. Sustituir subiendo fotos en Loyverse, no aquí. |

Cuando se disponga de estos datos reales, avisar para sustituirlos — no
requiere cambios de estructura, solo edición de contenido (excepto las fotos
de producto, que se suben directamente en Loyverse).

## Datos que ya vienen de Loyverse (no son placeholder)

Nombre, precio y stock de cada producto, y las 35 categorías agrupadas en 10
colecciones. Ver [loyverse-integration.md](./loyverse-integration.md) para
el detalle y los problemas de calidad de datos detectados (algún producto
mal categorizado o sin precio en Loyverse).
