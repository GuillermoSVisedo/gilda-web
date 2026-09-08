# Stack técnico

- **Next.js 16** (App Router, TypeScript, `src/` dir) — generado con
  `create-next-app`.
- **React 19** (viene con Next 16).
- **Tailwind CSS v4** — sin `tailwind.config.js`; los tokens de tema se
  definen directamente en [`src/app/globals.css`](../src/app/globals.css)
  con `@theme inline`.
- **ESLint** (config de `eslint-config-next`).
- Fuentes: `next/font/google` — Cormorant Garamond (serif, títulos) + Inter
  (sans, texto). Ver [design-system.md](./design-system.md).

No hay backend ni base de datos todavía: es un sitio 100% estático (sin
`fetch` a APIs externas). Eso llegará con la integración de Loyverse.

## Por qué Next.js y no HTML estático

Se eligió Next.js desde el primer commit aunque la fase 1 es solo una web de
presentación, porque el plan ya confirmado es evolucionar a tienda online
conectada a Loyverse. Con Next.js, ese paso es añadir *route handlers*
(`src/app/api/.../route.ts`) para hablar con la API de Loyverse y componentes
de carrito/checkout, sin tener que migrar de stack ni reescribir el sitio
existente.

## Cómo arrancar en local

```bash
npm install
npm run dev
```

Por defecto Next arranca en `http://localhost:3000`. En las sesiones de
desarrollo con el navegador integrado de Claude Code se ha usado el puerto
3210 para no chocar con otros proyectos (`npm run dev -- --port 3210`); no es
un requisito del proyecto, solo una costumbre de esta sesión.

Otros comandos:

```bash
npm run lint     # ESLint
npm run build    # build de producción (incluye chequeo de tipos)
```

## Variables de entorno

El proyecto no necesitaba ninguna hasta ahora. Con la integración de
Loyverse en marcha, hace falta `LOYVERSE_API_TOKEN` (token de acceso a la
API de Loyverse). Ver plantilla en [`.env.example`](../.env.example) y
detalle de la integración en [loyverse-integration.md](./loyverse-integration.md).

**Regla fija: ninguna credencial (token, contraseña, clave de API) se pega
en el chat ni se escribe en el repositorio.** Van siempre en `.env.local`
(ya excluido en `.gitignore`), que cada persona rellena en su propia
máquina.

## Notas sobre la versión de Next.js

El proyecto usa Next.js 16, que introdujo cambios relevantes respecto a
versiones anteriores (`params`/`searchParams` como promesas, helpers
`LayoutProps`/`PageProps` autogenerados, etc.). El propio `node_modules`
incluye la documentación oficial en
`node_modules/next/dist/docs/` — conviene consultarla antes de asumir
comportamientos de versiones anteriores de Next.js.
