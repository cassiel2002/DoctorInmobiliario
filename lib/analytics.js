// ── CONFIGURACIÓN DE GOOGLE ANALYTICS 4 ──
// El ID se lee en el build (exportación estática): se carga como variable de
// entorno NEXT_PUBLIC_GA_ID en Cloudflare Pages (Production). Sin ID, el sitio
// no carga GA4 ni muestra el aviso de cookies.

const raw = process.env.NEXT_PUBLIC_GA_ID || '';

// Solo se acepta un ID con formato válido: se inserta dentro de un script.
export const GA_ID = /^G-[A-Z0-9]{4,15}$/.test(raw) ? raw : '';

export const CONSENT_KEY = 'edi_consent'; // 'granted' | 'denied'

// Países donde la analítica necesita consentimiento previo (EEE, Reino Unido y Suiza).
// En el resto, la analítica arranca activa y la persona puede rechazarla en el aviso.
export const OPT_IN_REGIONS = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT',
  'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO',
  'GB', 'CH',
];

/** Guarda la elección y la aplica en GA4 (Consent Mode v2). */
export function setAnalyticsConsent(choice) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    // Almacenamiento bloqueado: la elección vale solo para esta página.
  }
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', { analytics_storage: choice });
  }
}

export function getAnalyticsConsent() {
  try {
    return window.localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}
