// ── VILLAS PARA ESTADÍAS, EVENTOS Y GRUPOS (sección de /rentas) ──
//
// Alternativa a las rentas anuales. Fuente: documento "DESCRIPCION DE LAS
// VILLAS" del Drive de Augusto (29/09/2026).
//
// Ajustes respecto del documento original, a confirmar con Augusto:
// - Se quitaron afirmaciones que no se pueden respaldar hoy ("award-winning",
//   "Tulum's iconic", "best example of contemporary Mexican architecture").
// - Se quitó "Direct bookings through Prestigia" (Villa Piedras Negras): las
//   consultas de esta web van a Augusto.
//
// Fotos: se suben a Cloudinary con el public ID  villas/<id>/00, villas/<id>/01, …
// (la 00 es la portada) y acá se indica cuántas hay en `photos`. Con 0, la
// tarjeta muestra "Photos coming soon". Solo fotos con permiso del dueño.

const CLOUDINARY_BASE = 'https://res.cloudinary.com/dupkltqnw/image/upload';
function photos(id, count) {
  return Array.from({ length: count }, (_, i) => `${CLOUDINARY_BASE}/villas/${id}/${String(i).padStart(2, '0')}`);
}

const villaData = [
  {
    id: 'akubali',  // Drive: 12 fotos (00–11)
    name: 'Casa Akubali',
    style: 'Jungle sanctuary',
    guests: 20, suites: 9, bathrooms: '12',
    summary:
      'An architectural jungle sanctuary of stone arches, water features and quiet courtyards, four minutes from the beach. Nine suites around an 18-meter lagoon pool, with an indoor cinema, an event space and a rooftop pool overlooking the canopy.',
    services: 'Private chef, personal butler, concierge, daily housekeeping and 24/7 security included.',
    goodFor: ['Retreats', 'Weddings', 'Private gatherings'],
    amenities: [
      '18-meter lagoon pool', 'Rooftop pool with 360° canopy views', 'Rooftop yoga shala & stargazing firepit',
      'Indoor cinema & event space', 'Stone arches & inner courtyards',
    ],
    photos: 0,
  },
  {
    id: 'el-gaston',
    name: 'Casa El Gaston',
    style: 'Cinematic Roman',
    guests: 18, suites: 7, bathrooms: '9',
    summary:
      'A villa with bold Roman-inspired architecture in a gated community minutes from the beach. Seven en-suite bedrooms — including a round-bed suite with hot tub and an underground aquarium-style suite — plus an indoor cinema, library and games areas.',
    services: 'Private chef, butler, concierge, daily cleaning and evening security.',
    goodFor: ['Large groups', 'Events', 'Celebrations'],
    amenities: [
      'Cenote-style pool with waterfall & stage', 'Speakeasy bar with stage', 'Indoor cinema & library',
      'Roman bath jacuzzi with waterfall', 'Chandelier lounge, poker & pool table',
    ],
    photos: 0,
  },
  {
    id: 'medina',
    name: 'Hacienda Medina',
    style: 'Beachfront hacienda',
    guests: 24, suites: 12, bathrooms: '13',
    summary:
      'A large oceanfront estate that works as a private resort. Twelve ocean-view suites with double-height ceilings open onto a beachfront deck, a 25-meter pool and a cliffside terrace with 360° views.',
    services: 'Private chef, butler, concierge team, daily housekeeping and professional night security on site.',
    goodFor: ['Weddings', 'Retreats', 'Group gatherings'],
    amenities: [
      '25-meter oceanfront pool', 'Expansive beachfront deck', 'Cliffside terrace with 360° ocean views',
      'Rooftop terraces with BBQs', 'Double-height indoor-outdoor living',
    ],
    photos: 0,
  },
  {
    id: 'don-rey',
    name: 'Casa Don Rey',
    style: 'Jungle palace',
    guests: 26, suites: 10, bathrooms: '10+',
    summary:
      'A fully staffed jungle mansion eight minutes from the beach, built for the biggest groups: two pools, two sunken outdoor living rooms, firepits, a stadium-seating theatre, a cabana lounge, a full bar and an indoor nightclub.',
    services: '24/7 staff. On call: private chef, in-villa massages, yoga, IV therapy, day tours and transportation.',
    goodFor: ['Large groups', 'Celebrations', 'Events'],
    amenities: [
      '2 pools', 'Indoor nightclub', 'Stadium-seating theatre', '2 sunken outdoor living rooms', 'Firepits & full bar',
    ],
    photos: 0,
  },
  {
    id: 'halo',
    name: 'Casa Halo',
    style: 'Contemporary',
    guests: 13, suites: 6, bathrooms: '6.5',
    summary:
      'A contemporary concrete house in the jungle, built in 2021: six bedrooms, three rooftops, a bespoke nightclub and a heated pool, in a secure gated community five minutes from beaches, restaurants and nightlife.',
    services: 'House manager and daily cleaning included.',
    goodFor: ['Groups', 'Celebrations'],
    amenities: ['3 rooftops', 'Bespoke nightclub', 'Heated pool', 'Gym & billiards', 'Sonos sound throughout', 'Gated community · 24/7 security'],
    photos: 0,
  },
  {
    id: 'arca',
    name: 'Casa Arca',
    style: 'Sculptural retreat',
    guests: 19, suites: 8, bathrooms: '8',
    summary:
      'Known as the "Jungle Castle": eight suites around arched stone corridors, sunken lounges, shaded courtyards and two pools, in a private guarded neighborhood five minutes from the beach.',
    services: 'Private chef, butler, daily housekeeping and a dedicated concierge team.',
    goodFor: ['Wellness groups', 'Workshops', 'Weddings'],
    amenities: ['2 pools', 'Arched stone corridors', 'Sunken lounges', 'Workshop space', 'Wellness program', '24/7 surveillance'],
    photos: 0,
  },
  {
    id: 'piedras-negras',
    name: 'Villa Piedras Negras',
    style: 'Three-story estate',
    guests: 16, suites: 6, bathrooms: '6',
    summary:
      'A three-story villa in the gated El Mirador community, steps from the Parque Nacional del Jaguar. Six suites with canopy views and indoor-outdoor living, laid out for families and intimate groups.',
    services: 'Concierge on call for private chef experiences, transportation and local reservations.',
    goodFor: ['Families', 'Intimate groups'],
    amenities: ['Private pool', 'Outdoor dining area', 'Canopy views on 3 floors', 'Gated El Mirador community', 'Access to communal amenities'],
    photos: 0,
  },
  {
    id: 'w',
    name: 'Casa W',
    style: 'Hidden retreat',
    guests: 20, suites: 8, bathrooms: '8',
    summary:
      'An eight-bedroom villa in a private gated community, five minutes by car from the center: total seclusion without giving up the nightlife. Two pools and a hot tub anchor the outdoor areas.',
    services: 'Private chef service included, with a dedicated concierge on call.',
    goodFor: ['Groups', 'Private stays'],
    amenities: ['2 pools', 'Hot tub', 'Private gated community', '5 minutes to centro & nightlife', 'Spacious outdoor areas'],
    photos: 0,
  },
  {
    id: 'romero',
    name: 'Villa Romero',
    style: 'Mediterranean brutalism',
    guests: 10, suites: 5, bathrooms: '5+',
    summary:
      'An architectural villa for groups that want atmosphere and privacy: five en-suite bedrooms linked by indoor-outdoor spaces, a rooftop plunge pool, a sunny pool deck and an outdoor bar.',
    services: null,
    goodFor: ['Small groups', 'Hosting'],
    amenities: ['Rooftop plunge pool', 'Pool deck & lounge', 'Outdoor bar', 'Indoor-outdoor layout'],
    photos: 0,
  },
  {
    id: 'xata',
    name: 'Casa Xata',
    style: 'Modern luxury',
    guests: 14, suites: 5, bathrooms: '7',
    summary:
      'A modern villa in Losantos, Aldea Zamá, between Tulum Centro and the beach, designed for retreats and private celebrations, close to dining, boutiques and padel courts.',
    services: '24/7 community security.',
    goodFor: ['Retreats', 'Celebrations'],
    amenities: ['Private rooftop pool', 'Jacuzzi & sun loungers', 'Gym & spa area', 'Gated Losantos community'],
    photos: 0,
  },
  {
    id: 'boko',
    name: 'Casa Boko',
    style: 'Zen minimalism',
    guests: 16, suites: 6, bathrooms: '7',
    summary:
      'A designer jungle villa in Aldea Zamá for private events and dinners: soundproof living spaces that open through glass walls to the jungle, an indoor cenote, a private bar and an open chef’s kitchen. The rooftop, with pool, BBQ and bar, is the main gathering space.',
    services: null,
    goodFor: ['Private events', 'Dinner parties'],
    amenities: ['Rooftop pool & lounge', 'Rooftop BBQ & bar', 'Indoor cenote', 'Soundproof event space', 'Open chef’s kitchen'],
    photos: 0,
  },
];

export const villas = villaData.map((villa) => ({ ...villa, images: photos(villa.id, villa.photos) }));

// Tipo de ocasión en el formulario de villas.
export const villaOccasions = [
  { value: 'vacation', label: 'Vacation' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'retreat', label: 'Retreat / wellness' },
  { value: 'celebration', label: 'Celebration' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'other', label: 'Other' },
];
