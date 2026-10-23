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
    // Fotos reales subidas directo (nombres con sufijo aleatorio de Cloudinary).
    // ⚠ Falta la 00 (portada) — las recibidas van de 01 a 11 (11 fotos, no 12
    // como indicaba el Drive). Confirmar con Augusto si falta subir la 00.
    images: [
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524141/01_jo0xzx.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524141/02_kwg0v0.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524142/03_bkz9ml.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524141/04_e1isdy.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524141/05_q1i0u4.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524142/06_hwrwur.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524142/07_jbwzfk.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524142/08_mhwjxo.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524142/09_jz6erj.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524143/10_f2zyxg.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524143/11_dkjpwm.jpg',
    ],
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
    // Fotos reales subidas directo (nombres con sufijo aleatorio de Cloudinary). 00 = portada.
    images: [
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524357/00_ecragk.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524351/01_nleofw.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524351/02_edwzbd.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524353/03_o6ixwj.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524351/04_leqsqn.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524353/05_duf54h.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524353/06_et6nco.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524353/07_ww8sqa.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524352/08_l01swc.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524354/09_w04zyb.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524355/10_nyrpjx.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524354/11_i0oywh.jpg',
    ],
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
    // Fotos reales subidas directo (nombres con sufijo aleatorio de Cloudinary). 00 = portada.
    images: [
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524131/00_s3pwjk.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524131/01_zqly8e.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524132/02_ovduht.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524133/03_vqw7r3.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524132/04_boggec.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524132/05_peg7yi.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524132/06_zgdtst.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524132/07_ibx9y9.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524133/08_qbu8xt.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524133/09_uy7wko.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524133/10_msokvg.jpg',
    ],
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
    // Fotos reales subidas directo (nombres con sufijo aleatorio de Cloudinary). 00 = portada.
    images: [
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524152/00_pcbdde.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524169/01_lcdqcb.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524211/02_gpgdpw.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524238/03_xrc53h.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524272/04_df4qwp.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524306/05_s8wuet.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524340/06_cdwssr.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524350/07_rc8mfq.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524350/08_nye4jt.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524351/09_fvmwww.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524350/10_aor7ul.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524350/11_jy0kxa.jpg',
    ],
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
    // Fotos reales subidas directo (nombres con sufijo aleatorio de Cloudinary). 00 = portada.
    images: [
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524123/00_mnwy5a.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524131/01_qrkvvk.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524123/02_gti1lq.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524123/03_ciramx.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524123/04_kvzygs.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524123/05_kwfulc.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524124/06_thtn91.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524124/07_lqswa0.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524124/08_hfce7g.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524124/09_k7guxb.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524124/10_cm675r.jpg',
    ],
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
    // Fotos reales subidas directo (nombres con sufijo aleatorio de Cloudinary). 00 = portada.
    images: [
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524144/00_n6fre4.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524145/01_hcb6nd.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524144/02_yldfk1.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524144/03_lvelrh.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524144/04_jdbqu9.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524144/05_nhuin9.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524145/06_ja5ery.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524145/07_pnlsrf.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524145/08_cqkfnq.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524146/09_yrovyp.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524146/10_yph5s8.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524147/11_sdfyod.jpg',
    ],
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
    // Fotos reales subidas directo (nombres con sufijo aleatorio de Cloudinary). 00 = portada.
    images: [
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524134/00_wjmgcg.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524134/01_s1sur5.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524134/02_vd1mnm.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524136/03_s3iifi.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524135/04_upcyzw.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524135/05_rtfm2r.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524136/06_xxkq1s.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524135/07_gsmk6h.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524135/08_dcvdvz.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524136/09_c8wt2u.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524136/10_dthrmm.jpg',
    ],
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
    // Fotos reales subidas directo (nombres con sufijo aleatorio de Cloudinary). 00 = portada.
    images: [
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524124/00_kxxnbv.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524125/01_gycxov.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524125/02_ovhl3y.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524126/03_esi2ev.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524126/04_h7rt3y.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524126/05_umbdbr.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524126/06_y6byav.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524126/07_i1fp9e.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524126/08_f63253.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524127/09_ptbjyg.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524127/10_mvnwfy.jpg',
    ],
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
    // Fotos reales subidas directo (no siguen la convención villas/<id>/NN
    // porque Cloudinary les agregó un sufijo aleatorio al nombre). 00 = portada.
    images: [
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524136/00_humpry.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524136/01_mbvxau.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524137/02_usmwn1.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524137/03_wtlg57.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524137/04_nl3dlt.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524137/05_uziasl.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524138/06_dotoxl.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524138/07_svugdd.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524139/08_c333cl.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524140/09_h1nw7w.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524140/10_al41ww.jpg',
    ],
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
    // Fotos reales subidas directo (nombres con sufijo aleatorio de Cloudinary). 00 = portada.
    images: [
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524129/00_ydp9ic.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524128/01_fckkow.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524129/02_whqx4c.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524129/03_a9meuj.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524128/04_jp6jso.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524129/05_zax0ek.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524130/06_dttnbg.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524129/07_njojng.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524131/08_qmj25h.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524131/09_snshjx.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524131/10_pgoehz.jpg',
    ],
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
    // Fotos reales subidas directo (nombres con sufijo aleatorio de Cloudinary). 00 = portada.
    images: [
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524149/00_i901o0.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524148/01_lry5ti.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524148/02_fgfmh4.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524148/03_gxfqin.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524148/04_xszaam.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524148/05_exwrv2.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524149/06_vgq6vx.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524149/07_j9bbtm.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524149/08_uewtrk.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524150/09_blvnvt.jpg',
      'https://res.cloudinary.com/dupkltqnw/image/upload/v1792524150/10_r3bxwi.jpg',
    ],
  },
];

// Si la villa ya trae `images` (fotos reales con nombres que no siguen la
// convención villas/<id>/NN), se usan tal cual. Si no, se generan a partir
// de `photos: N` siguiendo la convención.
export const villas = villaData.map((villa) => ({
  ...villa,
  images: villa.images || photos(villa.id, villa.photos),
}));
