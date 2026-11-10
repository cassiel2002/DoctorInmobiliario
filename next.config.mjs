import { readdirSync } from 'node:fs';

// PDFs presentes en public/ al momento del build. El sitio solo muestra los
// botones de documentos que existen (credenciales, guías): así nunca hay un
// botón que lleve a un 404. Para publicar un PDF nuevo basta con agregarlo a
// public/ con el nombre esperado y volver a desplegar.
const publicPdfs = readdirSync(new URL('./public', import.meta.url))
  .filter((name) => name.toLowerCase().endsWith('.pdf'));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exportación estática: `next build` genera la carpeta `out/` con HTML, CSS
  // y JS. Cloudflare Pages la sirve, y el formulario lo recibe la función de
  // `functions/api/lead.js` (las rutas de API de Next.js no existen en este modo).
  output: 'export',
  images: {
    // Sin servidor no hay optimizador de Next.js: Cloudinary ajusta tamaño y formato.
    loader: 'custom',
    loaderFile: './lib/image-loader.js',
  },
  env: {
    PUBLIC_PDF_FILES: publicPdfs.join(','),
  },
};

export default nextConfig;
