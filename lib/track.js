// ── MEDICIÓN ──
// Todos los eventos del sitio pasan por acá. Con GA4 cargado
// (components/Analytics.jsx), se envían con gtag('event'). Sin GA4 (desarrollo
// o NEXT_PUBLIC_GA_ID sin cargar), quedan en window.dataLayer para verlos en
// la consola.
//
// Reglas:
// - Nunca mandar nombre, correo ni teléfono: GA4 lo prohíbe.
// - generate_lead se envía solo cuando el servidor confirmó el guardado.

export function track(event, params = {}) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, params);
    return;
  }
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
