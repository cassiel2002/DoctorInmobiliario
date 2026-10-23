// ── CONTENIDO DE LA SECCIÓN DE RENTAS (/rentas) ──
//
// Rentas de largo plazo únicamente (contratos anuales). Nunca vacacionales.
//
// ⚠ ANTES DE PUBLICAR:
// - Reemplazar las propiedades de ejemplo (sample: true) por las reales.
//   Las de ejemplo se muestran con la etiqueta "SAMPLE" para que no se
//   confundan con propiedades reales.
// - Las fotos van a Cloudinary y se registran en data/images.js; acá se usa
//   el nombre lógico. Solo fotos reales de cada propiedad y con permiso del dueño.
// - Las respuestas de las preguntas frecuentes las tiene que dar Augusto.
//   Una pregunta sin respuesta (answer: null) no se muestra.

export const rentalsNavLinks = [
  { href: '#homes', label: 'Homes' },
  { href: '#villas', label: 'Villas' },
  { href: '#process', label: 'How it works' },
  { href: '#faq', label: 'FAQ' },
  { href: '#inquire', label: 'Inquire' },
];

export const rentalsFooterLinks = [
  { href: '#homes', label: 'Homes' },
  { href: '#villas', label: 'Villas' },
  { href: '#inquire', label: 'Inquire' },
  { href: '/', label: 'Buy in Tulum' },
];

/**
 * Campos de cada propiedad (los mismos de la planilla de rentas):
 * id, name, zone, bedrooms, bathrooms, areaM2, monthlyRentMXN,
 * minTermMonths, depositMonths, furnished, petsAllowed, availableFrom,
 * cover, images (nombres lógicos de data/images.js), sample
 */
export const rentalProperties = [
  {
    id: 'sample-01',
    sample: true,
    name: 'Sample — 4-bedroom home',
    zone: 'Zone to confirm',
    bedrooms: 4,
    bathrooms: 4,
    areaM2: null,
    monthlyRentMXN: 48000,
    minTermMonths: 12,
    depositMonths: null,
    furnished: null,
    petsAllowed: null,
    availableFrom: null,
    cover: null,
    images: [],
  },
  {
    id: 'sample-02',
    sample: true,
    name: 'Sample — 2-bedroom residence',
    zone: 'Zone to confirm',
    bedrooms: 2,
    bathrooms: 2,
    areaM2: null,
    monthlyRentMXN: 30000,
    minTermMonths: 12,
    depositMonths: null,
    furnished: null,
    petsAllowed: null,
    availableFrom: null,
    cover: null,
    images: [],
  },
];

// Pasos del proceso. Borrador a validar con Augusto antes de publicar.
export const rentalProcess = [
  {
    num: '01',
    title: 'Tell us what you need',
    text: 'Move-in date, budget, bedrooms and how you live. One short form or a WhatsApp message.',
  },
  {
    num: '02',
    title: 'A short list, not a catalogue',
    text: 'You receive only the homes that fit, with what Augusto noticed about each one — good and bad.',
  },
  {
    num: '03',
    title: 'Visit in person or by video',
    text: 'See the home, the street and the area before deciding anything.',
  },
  {
    num: '04',
    title: 'A lease you understand',
    text: 'The contract is reviewed with legal support before you sign or pay a deposit.',
  },
  {
    num: '05',
    title: 'Move in with someone to call',
    text: 'You keep a direct line with Augusto after you move in.',
  },
];

// "Tulum, unfiltered": las dudas reales de los clientes. Respuestas de Augusto.
export const rentalFaq = [
  { question: 'Is Tulum safe to live in?', answer: null },
  { question: 'How do I avoid rental scams in Tulum?', answer: null },
  { question: 'What about sargassum?', answer: null },
  { question: 'How are streets, lighting and public services in each area?', answer: null },
  { question: 'What deposit and documents do I need?', answer: null },
  { question: 'Are pets allowed?', answer: null },
  { question: 'What is the minimum lease term?', answer: null },
];
