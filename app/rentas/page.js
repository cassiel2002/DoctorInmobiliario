import RentalsContent from '../../components/rentals/RentalsContent';
import './rentals.css';

export const metadata = {
  title: 'Rentals in Tulum: long-term homes and villas',
  description:
    'Long-term homes in Tulum reviewed before you see them, plus fully staffed villas for stays, events and groups. Personal guidance from Augusto Lascano — El Doctor Inmobiliario.',
  alternates: { canonical: '/rentas' },
  openGraph: {
    title: 'Long-term rentals in Tulum | El Doctor Inmobiliario',
    description: 'Live in Tulum for a year or more, in a home chosen with a doctor’s eye.',
    url: '/rentas',
    // El openGraph de esta página reemplaza por completo al de app/layout.js,
    // así que necesita su propia imagen (si no, /rentas queda sin imagen al compartir).
    images: [
      {
        url: 'https://res.cloudinary.com/dupkltqnw/image/upload/c_fill,g_auto,w_1200,h_630,f_jpg,q_auto/v1789248706/augusto-hero_htlwzp.jpg',
        width: 1200,
        height: 630,
        alt: 'El Doctor Inmobiliario — Tulum Real Estate',
      },
    ],
  },
};

export default function RentalsPage() {
  return <RentalsContent />;
}
