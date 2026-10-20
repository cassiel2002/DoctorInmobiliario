// Next.js genera /robots.txt automáticamente a partir de este archivo.

const SITE_URL = 'https://www.eldoctorinmobiliario.com';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
