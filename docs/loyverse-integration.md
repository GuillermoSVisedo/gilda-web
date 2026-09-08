# Integración con Loyverse (planificación)

Estado: **fase 1 acordada, sin empezar a implementar todavía**. Este
documento recoge las decisiones tomadas y las que faltan por tomar antes de
escribir código. Se irá actualizando a medida que avance la integración real
(sustituir "sin empezar" por lo que se implemente en cada paso).

## Decisiones ya tomadas

- **Cuenta de Loyverse**: de pago, con suscripción mensual (confirmado
  2026-09-08). El acceso a la API REST debería estar incluido, pero queda
  por verificar en el panel de Loyverse (*Ajustes → Acceso a la API*) al
  generar el token.
- **Alcance de la fase 1**: solo mostrar stock en tiempo real (catálogo
  informativo). **Sin checkout ni pago online** en esta fase — la compra
  sigue siendo por WhatsApp/en tienda. Ver "Idea de arquitectura" abajo, que
  ya está acotada a este alcance.
- **Gestión del token de acceso**: nunca se comparte en el chat ni se
  escribe en el repositorio. El usuario lo genera desde el panel de Loyverse
  y lo añade él mismo a un archivo `.env.local` (no versionado — ver
  `.gitignore`) siguiendo la plantilla de [`.env.example`](../.env.example),
  bajo la variable `LOYVERSE_API_TOKEN`.

## Objetivo (fase 1)

Sustituir los datos estáticos de [`data/categories.ts`](../src/data/categories.ts)
y las tarjetas de producto placeholder de
[`CategorySection.tsx`](../src/components/CategorySection.tsx) por
categorías, productos, precios y stock reales leídos de Loyverse. Sin
carrito ni pago — solo lectura y visualización.

## Idea de arquitectura (borrador, sin implementar)

1. Route handler en `src/app/api/loyverse/...` que haga de proxy autenticado
   a la API de Loyverse usando `LOYVERSE_API_TOKEN` desde el servidor (el
   token nunca llega al cliente/navegador).
2. Cachear/revalidar la respuesta con la caché de datos de Next.js (para un
   catálogo informativo no hace falta consultar Loyverse en cada request).
3. `data/categories.ts` deja de ser estático: se sustituye por una función
   `getCategories()` (Server Component / route handler) que llama a
   Loyverse.
4. `CategorySection.tsx` recibe productos reales en vez de generar 4
   placeholders — mismo componente y mismo diseño, cambia solo la fuente de
   datos.

## Riesgos / dudas abiertas

- Límites de rate-limit de la API de Loyverse con tráfico real de la web.
- Multi-tienda: si Gilda tiene más de una ubicación en Loyverse, decidir de
  cuál se lee el stock que se muestra en la web.
- Qué pasa si Loyverse no responde (mostrar el catálogo con el último dato
  cacheado, o un estado de error) — a decidir al implementar.

## Fuera de alcance (fase 1, para más adelante)

Checkout con pago online, creación de pedidos en Loyverse, y evitar
sobreventa entre tienda física y web — documentado aquí solo como
referencia para cuando se aborde esa fase, no forma parte de este trabajo.

## Próximo paso

Generar el token de acceso a la API en el panel de Loyverse y añadirlo a
`.env.local` (variable `LOYVERSE_API_TOKEN`). En cuanto esté disponible,
empezar por el route handler que liste categorías y productos.
