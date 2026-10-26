// ── CONTENIDO DEL SITIO ──
// Datos extraídos 1:1 del sitio original. No se modificó ningún texto.

export const navLinks = [
  { href: '#truth', label: 'Intelligence' },
  { href: '#macro', label: 'Fundamentals' },
  { href: '#enclaves', label: 'Enclaves' },
  { href: '#portfolio', label: 'Portfolio' },
  { href: '#toolkit', label: 'Resources' },
];

export const tickerItems = [
  '50+ Projects Audited',
  '100% Legal Verification',
  'Zero Speculation Framework',
  'Off-Market Exclusive: 20% Below Market Value',
  'Stabilized Net ROI 7.8–11.2% on Curated Assets',
];

export const macroData = [
  {
    id: 'macro-exp-1',
    number: '+247%',
    title: 'TQO International Airport',
    text: "Increase in international arrivals since 2020. Direct routes from US, Europe & Latin America — positioning Tulum as a tier-1 global destination.",
    linkText: 'View Connectivity Report',
  },
  {
    id: 'macro-exp-2',
    number: '1,500',
    numberSuffix: 'km',
    title: 'Maya Train Network',
    text: 'Fully operational rail corridor connecting the entire Yucatan Peninsula, anchoring long-term regional demand and reducing transit dependency on road infrastructure.',
    linkText: 'View Economic Impact',
  },
  {
    id: 'macro-exp-3',
    number: '9.3%',
    title: 'Quintana Roo GDP Growth',
    text: 'Regional GDP expanding at 4× the national average of 2.1% — the strongest growth corridor in Mexico, underpinned by hard federal infrastructure investment, not speculation.',
    linkText: 'View Full Analysis',
  },
];

export const enclavesData = [
  {
    name: 'Tulum Country Club',
    tag: 'Elite · Golf · Private',
    img: 'TCC-01.png',
    url: 'https://gamma.app/embed/1yxepp65f8nvajs',
  },
  {
    name: 'Aldea Zamá',
    tag: 'Urban · Mixed-Use · Consolidated',
    img: 'aldeazama-01.png',
    url: 'https://gamma.app/embed/2hgnkmlasfnk3i5',
  },
  {
    name: 'El Mirador',
    tag: 'Residential · Premium · Elevated',
    img: 'elmiradortulum-01.png',
    url: 'https://gamma.app/embed/b5s7a3ed24wznxc',
  },
  {
    name: 'KayBé',
    tag: 'Boutique · Jungle · Exclusive',
    img: 'kaybe-01.png',
    url: 'https://gamma.app/embed/ud2ka8pn0lijsy4',
  },
  {
    name: 'Riviera Tulum',
    tag: 'Residential · Community · Families',
    img: 'riviera-tulum-01.png',
    url: 'https://gamma.app/embed/iqhiq8edc2i90iy',
  },
  {
    name: 'Business Deals',
    tag: 'Commercial · High-Yield · Strategic',
    img: 'business-deals-01.png',
    url: 'https://gamma.app/embed/s46d4yczvi7nub4',
  },
];

export const portfolioData = [
  {
    id: 'panamera',
    name: 'Hotel Panamera',
    location: 'Tulum · Luxury Beachfront',
    badge: 'Hotel Beachfront',
    profit: '$1.4M USD',
    cover: 'portfolio-hotel-panamera.png',
    images: [
      'panamera-01-beach-lounge.jpeg',
      'panamera-02-wedding.jpeg',
      'panamera-03-rooftop.jpeg',
      'panamera-04-restaurant.jpeg',
      'panamera-05-dining-sunset.jpeg',
      'panamera-06-pool-sunset.jpeg',
      'panamera-07-beach-chairs.jpeg',
    ],
  },
  {
    id: 'lumina',
    name: 'Lumina House',
    location: 'Elevated Property Business',
    badge: 'Luxury Business Villa',
    profit: '$600K USD',
    cover: 'portfolio-lumina-house.png',
    coverPosition: 'center 20%',
    images: [
      'lumina-01-exterior.png',
      'lumina-02-dining.png',
      'lumina-03-pool.png',
      'lumina-04-stairs.png',
      'lumina-05-bedroom.png',
      'lumina-06-lounge.png',
      'lumina-07-music.png',
    ],
  },
  {
    id: 'soho',
    name: 'Soho Town',
    location: 'Residential & Security',
    badge: 'Residential Home',
    profit: '$50K USD',
    cover: 'portfolio-soho-town.png',
    images: [
      'soho-01-kitchen.jpg',
      'soho-02-bed-green.jpg',
      'soho-03-living.jpg',
      'soho-04-bed-blue.jpg',
    ],
  },
];

export const auditData = [
  {
    id: 'due-exp-1',
    num: '01',
    icon: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    name: 'Developer Track Record',
    text: 'Minimum 5 years of completed projects with documented delivery timelines and verifiable client results. No first-time developers — ever.',
  },
  {
    id: 'due-exp-2',
    num: '02',
    icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
    name: 'Title Insurance',
    text: 'Clear title with international insurance options. Zero hidden encumbrances or outstanding liens. Every property verified by a certified Notario Público.',
  },
  {
    id: 'due-exp-3',
    num: '03',
    icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
    name: 'Fideicomiso Structure',
    text: 'Trust documentation with full beneficiary rights and succession protocols. Constitutional Article 27 compliance verified. 95% of our portfolio is on non-ejidal, titled land.',
  },
  {
    id: 'due-exp-4',
    num: '04',
    icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
    name: 'Delivery Penalties',
    text: 'Daily penalty clauses for delays and clear exit strategies built into every contract. Your capital is protected from day one — in writing, notarized, and legally enforceable in Mexico.',
  },
  {
    id: 'due-exp-5',
    num: '05',
    icon: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
    name: 'Independent Oversight',
    text: "Monthly progress reports with photographic documentation and independent quality verification. Your capital released in escrow tranches tied to verified milestones — not the developer's word.",
  },
];

export const toolkitData = [
  {
    id: 'mexico-guide',
    guideName: 'Mexico Investment Guide',
    icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
    docType: 'PDF · Legal Guide',
    title: 'Mexico Investment Guide',
    desc: 'Legal framework, closing costs, fideicomiso structure, and tax implications for foreign buyers in the Mexican Caribbean.',
    file: 'Mexico-Real-Estate-Investment-Guide.pdf',
    available: true,
  },
  {
    id: 'moxi-guide',
    guideName: 'MoXi Mortgage Solutions',
    icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75',
    docType: 'PDF · Financing Guide',
    title: 'Mortgage Solutions via MoXi',
    desc: 'Financing options available to US & Canadian citizens. Rates, qualifications, and step-by-step process timeline.',
    file: 'MoXi-Mortgage-Solutions.pdf',
    // No existe el PDF todavía en public/: no se muestra hasta tenerlo (ver Toolkit.jsx).
    available: false,
  },
];

export const resilienceData = [
  {
    title: 'Sargassum Mitigation',
    text: "Sargassum is a managed variable, not a permanent risk. Tulum's premier resorts and developments maintain dedicated barrier systems and daily mechanical removal protocols. Our curated enclaves are selected in part for their mitigation infrastructure. Historical data from AirDNA shows zero correlation between seasonal sargassum and rental yield depression in tier-1 properties.",
  },
  {
    title: 'Infrastructure Autonomy',
    text: 'Each enclave in our portfolio operates its own independent water, electricity, and road infrastructure. This eliminates dependence on municipal grid instability — a critical differentiator. Properties with autonomous systems command a consistent 15–22% premium and maintain superior occupancy stability in third-party management studies.',
  },
  {
    title: 'Shield Stability — 7–12% ROI',
    text: 'Our ROI projections are built on conservative AirDNA occupancy data, not developer projections. We model three scenarios (base, stress, upside) and only present assets that meet our minimum return threshold under the stress scenario. This "Shield" methodology is the same framework institutional REITs apply to emerging market allocations.',
  },
];

export const metricsData = [
  { target: 5, label: ['Years in', 'Tulum'] },
  { target: 50, suffix: '+', label: ['Projects', 'Audited'] },
  { target: 30, suffix: '+', label: ['Properties', 'Sold'] },
  { target: 0, label: ['Complaints', '100% Fiduciary'] },
];

export const aboutCredentials = [
  'Board-Certified Ophthalmologist',
  'AMPI Certified Real Estate Advisor',
  'CONOCER · Gobierno de México',
  '5 Years · Quintana Roo Market',
];

export const aboutPillars = [
  {
    name: 'Surgical Focus',
    desc: 'I specialize in the private residential market with absolute legal shielding.',
  },
  {
    name: 'Off-Market Deals',
    desc: 'Weekly screenings to find exclusive opportunities up to 20% below market value.',
  },
  {
    name: 'Global Reach',
    desc: 'Serving entrepreneurs in Mexico, the U.S., and Europe with deep local intelligence.',
  },
];
