// ── CÓDIGO DE REFERENCIA ──
// Un código corto que viaja dentro del mensaje de WhatsApp (y del formulario)
// para que Augusto sepa de dónde llegó la persona y por qué propiedad pregunta.
// Ejemplos: IG-BIO, IG-HISTORIAS-HALO, DIR-AKUBALI.
//
// Se arma con los UTM guardados de la primera página de la sesión (lib/utm.js).
// No contiene datos personales.

import { getAttribution } from './utm';

const SOURCE_CODES = {
  instagram: 'IG',
  tiktok: 'TT',
  google: 'GO',
  whatsapp: 'WA',
};

/** Deja solo letras y números, en mayúsculas. */
function alnum(value) {
  return String(value ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function sourceCode({ utm_source: source, utm_medium: medium } = {}) {
  if (String(medium ?? '').toLowerCase() === 'referral') return 'REF';
  const key = String(source ?? '').trim().toLowerCase();
  if (!key) return 'DIR';
  return SOURCE_CODES[key] || alnum(key).slice(0, 4) || 'DIR';
}

/**
 * @param {string} [propertyId]  id de la propiedad (ej. 'halo'); opcional
 * @returns {string} ej. 'IG-BIO-HALO'
 */
export function buildRef(propertyId) {
  const attribution = getAttribution();
  return [
    sourceCode(attribution),
    alnum(attribution.utm_campaign).slice(0, 12),
    alnum(propertyId),
  ].filter(Boolean).join('-');
}
