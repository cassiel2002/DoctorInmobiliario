import RentalsContent from '../../components/rentals/RentalsContent';
import './rentals.css';

export const metadata = {
  title: 'Long-term rentals in Tulum',
  description:
    'Long-term homes in Tulum, reviewed before you see them. Annual leases, personal guidance from Augusto Lascano — El Doctor Inmobiliario.',
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
