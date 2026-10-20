// ── MANIFIESTO DE IMÁGENES ──
// Mapea el nombre lógico de cada imagen (el mismo que usa el sitio original)
// a su URL real alojada en Cloudinary.
//
// Cuando Augusto entregue más fotos, solo hay que agregar/actualizar la
// entrada correspondiente aquí — no hace falta tocar ningún componente.
//
// Si una imagen todavía no tiene URL asignada, el helper `img()` cae a
// `/nombre-de-archivo` (carpeta public/), que mostrará el ícono roto hasta
// que se suba el archivo ahí o se agregue su URL acá.

export const IMAGES = {
  // Hero / About Me
  'augusto-hero.png': 'https://res.cloudinary.com/dupkltqnw/image/upload/v1789248706/augusto-hero_htlwzp.jpg',
  'augusto-aboutme.jpeg': 'https://res.cloudinary.com/dupkltqnw/image/upload/v1789248716/augusto-aboutme_d8gbyb.jpg',

  // CTA (Private Investment Briefing)
  'apretonmanos.png': 'https://res.cloudinary.com/dupkltqnw/image/upload/v1789248704/apretonmanos_aje9lg.png',

  // Enclaves
  'TCC-01.png': 'https://res.cloudinary.com/dupkltqnw/image/upload/v1789248712/TCC-01_cfcvdo.jpg',
  'aldeazama-01.png': 'https://res.cloudinary.com/dupkltqnw/image/upload/v1789248704/aldeazama-01_mg5sty.jpg',
  'kaybe-01.png': 'https://res.cloudinary.com/dupkltqnw/image/upload/v1789248706/kaybe-01_hozpbj.jpg',
  'riviera-tulum-01.png': 'https://res.cloudinary.com/dupkltqnw/image/upload/v1789062713/riviera-tulum-01_blektn.jpg',
  'elmiradortulum-01.png': 'https://res.cloudinary.com/dupkltqnw/image/upload/v1789248782/elmiradortulum-01_ziyepg.jpg',
  'business-deals-01.png': 'https://res.cloudinary.com/dupkltqnw/image/upload/v1789248781/business-deals-01_muvd7x.jpg',

  // Portfolio — Hotel Panamera
  'portfolio-hotel-panamera.png': 'https://res.cloudinary.com/dupkltqnw/image/upload/v1789248709/portfolio-hotel-panamera_bywgpm.jpg',
  'panamera-01-beach-lounge.jpeg': 'https://res.cloudinary.com/dupkltqnw/image/upload/v1789248708/panamera-01-beach-lounge_w6r6pq.jpg',
  'panamera-02-wedding.jpeg': 'https://res.cloudinary.com/dupkltqnw/image/upload/v1789248780/panamera-02-wedding_fzipo6.jpg',
  'panamera-03-rooftop.jpeg': 'https://res.cloudinary.com/dupkltqnw/image/upload/v1789248779/panamera-03-rooftop_t6q0py.jpg',
  'panamera-04-restaurant.jpeg': 'https://res.cloudinary.com/dupkltqnw/image/upload/v1789248709/panamera-04-restaurant_uwygzw.jpg',
  'panamera-05-dining-sunset.jpeg': 'https://res.cloudinary.com/dupkltqnw/image/upload/v1789248709/panamera-05-dining-sunset_dt0b9z.jpg',
  'panamera-06-pool-sunset.jpeg': 'https://res.cloudinary.com/dupkltqnw/image/upload/v1789248779/panamera-06-pool-sunset_aqxe1u.jpg',
  'panamera-07-beach-chairs.jpeg': 'https://res.cloudinary.com/dupkltqnw/image/upload/v1789248779/panamera-07-beach-chairs_dihyyd.jpg',

  // Portfolio — Lumina House
  'portfolio-lumina-house.png': 'https://res.cloudinary.com/dupkltqnw/image/upload/v1789248710/portfolio-lumina-house_dhabrt.jpg',
  'lumina-01-exterior.png': 'https://res.cloudinary.com/dupkltqnw/image/upload/v1789248707/lumina-01-exterior_s2koew.jpg',
  'lumina-02-dining.png': 'https://res.cloudinary.com/dupkltqnw/image/upload/v1789248705/lumina-02-dining_flkjvv.jpg',
  'lumina-03-pool.png': 'https://res.cloudinary.com/dupkltqnw/image/upload/v1789248704/lumina-03-pool_cblozi.jpg',
  'lumina-04-stairs.png': 'https://res.cloudinary.com/dupkltqnw/image/upload/v1789248707/lumina-04-stairs_vkscxn.jpg',
  'lumina-05-bedroom.png': 'https://res.cloudinary.com/dupkltqnw/image/upload/v1789248707/lumina-05-bedroom_xwfgrk.jpg',
  'lumina-06-lounge.png': 'https://res.cloudinary.com/dupkltqnw/image/upload/v1789248781/lumina-06-lounge_v2rnnw.jpg',
  'lumina-07-music.png': 'https://res.cloudinary.com/dupkltqnw/image/upload/v1789248711/lumina-07-music_hlztpw.png',

  // Portfolio — Soho Town
  'portfolio-soho-town.png': 'https://res.cloudinary.com/dupkltqnw/image/upload/v1789248779/portfolio-soho-town_qbtpos.jpg',
  'soho-01-kitchen.jpg': 'https://res.cloudinary.com/dupkltqnw/image/upload/v1789248711/soho-01-kitchen.jpg_ares0l.jpg',
  'soho-02-bed-green.jpg': 'https://res.cloudinary.com/dupkltqnw/image/upload/v1789248778/soho-02-bed-green.jpg_fsal2i.jpg',
  'soho-03-living.jpg': 'https://res.cloudinary.com/dupkltqnw/image/upload/v1789248712/soho-03-living.jpg_ooihya.jpg',
  'soho-04-bed-blue.jpg': 'https://res.cloudinary.com/dupkltqnw/image/upload/v1789248712/soho-04-bed-blue.jpg_wy3ot7.jpg',
};

/**
 * Resuelve el nombre lógico de una imagen a su URL final.
 * Si está en el manifiesto, usa esa URL.
 * Si no, cae a /public/<nombre> como fallback.
 */
export function img(name) {
  if (!name) return '';
  if (/^https?:\/\//.test(name)) return name; // URL completa (por ej. fotos de villas)
  return IMAGES[name] || `/${name}`;
}
