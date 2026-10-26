// Next.js genera /robots.txt automáticamente a partir de este archivo.

// Requerido con output: 'export': se genera una sola vez en el build.
export const dynamic = 'force-static';

const SITE_URL = 'https://eldoctorinmobiliario.com';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
