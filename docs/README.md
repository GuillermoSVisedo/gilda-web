# Documentación de Gilda Web

Índice de la documentación del proyecto. Se actualiza en cada sesión de
desarrollo para que cualquiera (incluida una IA en una sesión futura) pueda
entender cómo está montado el sitio sin tener que releer todo el código.

- [Stack y cómo arrancar el proyecto](./stack.md)
- [Arquitectura y estructura de carpetas](./architecture.md)
- [Sistema de diseño (colores, tipografías)](./design-system.md)
- [Contenido pendiente de rellenar](./content-todos.md)
- [Integración con Loyverse (planificación)](./loyverse-integration.md)
- [Registro de cambios por sesión](./changelog.md)

## Contexto del proyecto

Gilda es una tienda de ropa de mujer. La web nace como una página de
presentación (marca, categorías de producto, contacto) con la idea explícita
de evolucionar a una tienda online completa conectada al inventario que la
tienda gestiona en **Loyverse** (POS). Las decisiones de arquitectura tomadas
desde el principio (Next.js en vez de HTML estático, categorías como fuente
de datos separada del componente que las pinta, etc.) están pensadas para que
ese paso futuro sea una ampliación, no una reescritura.
