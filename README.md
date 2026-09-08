# Gilda — web

Web de la tienda de ropa de mujer Gilda, con catálogo conectado en tiempo
real al inventario de Loyverse (solo lectura por ahora — sin checkout).

**Producción**: [gilda-web.vercel.app](https://gilda-web.vercel.app)

## Arrancar en local

```bash
npm install
cp .env.example .env.local   # y rellena LOYVERSE_API_TOKEN
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Documentación

Toda la documentación del proyecto (stack, arquitectura, sistema de diseño,
contenido pendiente de rellenar, plan de integración con Loyverse, despliegue
y registro de cambios por sesión) está en **[`docs/`](./docs/README.md)**.
