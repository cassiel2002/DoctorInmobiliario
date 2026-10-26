# El Doctor Inmobiliario

Sitio de Augusto Lascano, asesor inmobiliario en Tulum. Next.js (App Router) con
exportación estática (`output: 'export'`), publicado en Cloudflare Pages. Incluye
la página de ventas y `/rentas` (rentas anuales y villas), con formularios recibidos
por una función de Cloudflare (`functions/api/lead.js`).

## Comandos

```bash
pnpm dev      # servidor de desarrollo, http://localhost:3000
pnpm test     # tests de functions/api/lead.js (node:test)
pnpm lint     # eslint
pnpm build    # genera la carpeta out/ para publicar
pnpm preview  # sirve out/ localmente, para revisar el build antes de publicar
```

## Despliegue

Se publica en Cloudflare Pages desde la rama `feat/whatsapp-cta-rentas`. El comando
de build es `pnpm build` y la carpeta de salida es `out`; `functions/` se despliega
sola como Cloudflare Pages Functions.

## Backend de formularios

Ver [`docs/BACKEND.md`](docs/BACKEND.md): arquitectura, puesta en marcha (planilla,
Apps Script, variables de Cloudflare) y qué hacer si algo falla.
