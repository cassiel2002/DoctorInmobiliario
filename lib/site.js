// ── DATOS DE CONTACTO COMPARTIDOS ──
// Un solo lugar para el teléfono, Calendly y los mensajes de WhatsApp.

export const SITE_URL = 'https://www.eldoctorinmobiliario.com';
export const CALENDLY_URL = 'https://calendly.com/ogostlascan/30min';
export const INSTAGRAM_URL = 'https://www.instagram.com/eldoctor.inmobiliario';

const WHATSAPP_PHONE = '5219841083283';

export const WHATSAPP_MESSAGES = {
  sales: "Hello, I'm interested in learning more about investment opportunities in Tulum.",
  rentals: "Hello, I'm looking for a long-term rental in Tulum.",
};

/** Arma un link de WhatsApp con un mensaje predefinido. */
export function whatsappUrl(message) {
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodeURIComponent(message)}`;
}
