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
  },
};

export default function RentalsPage() {
  return <RentalsContent />;
}
