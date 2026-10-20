'use client';

// ── CARGADOR DE IMÁGENES PARA EXPORTACIÓN ESTÁTICA ──
// Con output: 'export' no existe el optimizador de imágenes de Next.js.
// Como las fotos están en Cloudinary, le pedimos a Cloudinary el tamaño,
// el formato (WebP/AVIF según el navegador) y la calidad automática.

export default function imageLoader({ src, width, quality }) {
  const marker = '/image/upload/';
  if (src.includes('res.cloudinary.com') && src.includes(marker)) {
    const transform = `f_auto,q_${quality || 'auto'},w_${width},c_limit`;
    return src.replace(marker, `${marker}${transform}/`);
  }
  // Archivos de /public u otros orígenes: se sirven tal cual.
  return `${src}${src.includes('?') ? '&' : '?'}w=${width}`;
}
