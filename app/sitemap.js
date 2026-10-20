// Next.js genera /sitemap.xml automáticamente a partir de este archivo.
// Cuando agreguemos rutas de propiedades (/propiedades/[slug]), hay que
// listarlas aquí también (o generarlas dinámicamente desde el CMS/datos).

const SITE_URL = 'https://www.eldoctorinmobiliario.com';

export default function sitemap() {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
