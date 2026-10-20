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
};

export default nextConfig;
