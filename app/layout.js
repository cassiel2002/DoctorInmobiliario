import './globals.css';

const SITE_URL = 'https://eldoctorinmobiliario.com';

// Imagen para compartir en redes (Open Graph / Twitter Card). No existe un
// archivo /og-image.jpg en public/: se usa la foto del hero ya alojada en
// Cloudinary, recortada a 1200x630 (tamaño estándar de OG).
const OG_IMAGE =
  'https://res.cloudinary.com/dupkltqnw/image/upload/c_fill,g_auto,w_1200,h_630,f_jpg,q_auto/v1789248706/augusto-hero_htlwzp.jpg';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'El Doctor Inmobiliario | Strategic Capital Allocation – Mexican Caribbean',
    template: '%s | El Doctor Inmobiliario',
  },
  description:
    'Institutional-grade real estate intelligence for the discerning global investor in Tulum, Mexican Caribbean. Curated, audited, off-market opportunities with 7-12% stabilized ROI.',
  keywords: [
    'Tulum real estate',
    'Tulum luxury real estate',
    'Tulum investment properties',
    'Mexican Caribbean real estate',
    'Quintana Roo real estate',
    // Términos de búsqueda en español (mercado local/LATAM de alto perfil)
    'casas en Tulum',
    'casas en venta en Tulum',
    'propiedades en Tulum',
    'invertir en Tulum',
    'departamentos en Tulum en venta',
  ],
  authors: [{ name: 'Augusto Lascano' }],
  creator: 'Augusto Lascano',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['es_MX'],
    url: SITE_URL,
    siteName: 'El Doctor Inmobiliario',
    title: 'El Doctor Inmobiliario | Strategic Capital Allocation – Mexican Caribbean',
    description:
      'Institutional-grade real estate intelligence for the discerning global investor in Tulum, Mexican Caribbean.',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'El Doctor Inmobiliario — Tulum Real Estate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'El Doctor Inmobiliario | Strategic Capital Allocation – Mexican Caribbean',
    description:
      'Institutional-grade real estate intelligence for the discerning global investor in Tulum, Mexican Caribbean.',
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

// Datos estructurados (schema.org) para que Google entienda que esto es
// una organización de real estate y pueda mostrar rich snippets.
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: 'El Doctor Inmobiliario',
  alternateName: 'Augusto Lascano',
  description:
    'Institutional-grade real estate intelligence for the discerning global investor in Tulum, Mexican Caribbean.',
  url: SITE_URL,
  areaServed: {
    '@type': 'City',
    name: 'Tulum',
    containedInPlace: {
      '@type': 'State',
      name: 'Quintana Roo',
    },
  },
  sameAs: ['https://www.instagram.com/eldoctor.inmobiliario'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Mismas fuentes que el sitio original, cargadas igual (link directo) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,600;0,6..96,700;0,6..96,900;1,6..96,400;1,6..96,700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Raleway:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
