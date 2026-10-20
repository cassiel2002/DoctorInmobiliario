// ── ORIGEN DE LA VISITA (UTMs) ──
// Guarda los UTM de la primera página de la sesión para mandarlos con el
// formulario, aunque la persona haya navegado entre páginas.

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const STORAGE_KEY = 'edi_attribution';

function readStorage() {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** Se llama al cargar cada página. Solo guarda si la sesión todavía no tiene origen. */
export function captureAttribution() {
  if (typeof window === 'undefined' || readStorage()) return;

  const params = new URLSearchParams(window.location.search);
  const attribution = { landing_page: window.location.pathname, referrer: document.referrer || '' };
  UTM_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) attribution[key] = value.slice(0, 100);
  });

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // Navegación privada o almacenamiento bloqueado: se envía sin origen.
  }
}

export function getAttribution() {
  if (typeof window === 'undefined') return {};
  return readStorage() || { landing_page: window.location.pathname };
}
