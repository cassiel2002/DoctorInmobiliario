// ── MEDICIÓN ──
// Todos los eventos del sitio pasan por acá. Se envían al dataLayer, que lee
// Google Tag Manager. Mientras GTM no esté instalado, los eventos quedan en
// window.dataLayer sin efecto (se pueden ver en la consola para probar).
//
// Reglas:
// - Nunca mandar nombre, correo ni teléfono: GA4 lo prohíbe.
// - generate_lead se envía solo cuando el servidor confirmó el guardado.

export function track(event, params = {}) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

// Evita enviar form_start más de una vez por formulario y carga de página.
const startedForms = new Set();

export function trackFormStart(formId) {
  if (startedForms.has(formId)) return;
  startedForms.add(formId);
  track('form_start', { form_id: formId });
}
