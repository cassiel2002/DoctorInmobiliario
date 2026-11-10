import IntakeForm from '../../components/forms/IntakeForm';
import '../forms.css';

// Link para la bio de Instagram y campañas, por ejemplo:
// https://eldoctorinmobiliario.com/start?utm_source=instagram&utm_medium=social&utm_campaign=bio
export const metadata = {
  title: 'Tell us what you are looking for',
  description: 'Three quick questions so Augusto Lascano can prepare real options for you in Tulum.',
  alternates: { canonical: '/start' },
  // Página de campaña: no compite en buscadores con la home.
  robots: { index: false, follow: true },
};

export default function StartPage() {
  return <IntakeForm />;
}
