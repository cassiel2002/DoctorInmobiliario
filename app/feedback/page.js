import FeedbackForm from '../../components/forms/FeedbackForm';
import '../forms.css';

// Encuesta de satisfacción. Link para enviar por correo o WhatsApp:
// https://eldoctorinmobiliario.com/feedback?utm_source=email&utm_medium=email&utm_campaign=feedback
export const metadata = {
  title: 'How did we do?',
  description: 'Tell us about your experience with El Doctor Inmobiliario.',
  robots: { index: false, follow: false },
};

export default function FeedbackPage() {
  return <FeedbackForm />;
}
