// ── ENVÍO DE FORMULARIOS ──
// Único punto de contacto entre los formularios y el servidor
// (functions/api/lead.js). Si el servidor no responde, devuelve ok:false y
// el formulario ofrece WhatsApp como alternativa.

import { getAttribution } from './utm';
import { track } from './track';

const ENDPOINT = '/api/lead';
const TIMEOUT_MS = 10000;

/**
 * @param {string} formId   'rental_inquiry' | 'guide_download'
 * @param {object} fields   datos del formulario
 * @param {object} meta     { startedAt, turnstileToken }
 * @returns {Promise<{ok: true, leadId: string} | {ok: false, error: string}>}
 */
export async function submitLead(formId, fields, meta = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        form_id: formId,
        fields,
        attribution: getAttribution(),
        page: window.location.pathname,
        elapsed_ms: meta.startedAt ? Date.now() - meta.startedAt : null,
        turnstile_token: meta.turnstileToken || null,
      }),
      signal: controller.signal,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) {
      return { ok: false, error: data.error || `http_${response.status}` };
    }

    // Recién acá, con el guardado confirmado, se registra la conversión.
    track('generate_lead', {
      form_id: formId,
      lead_id: data.lead_id,
      interest: fields.interest || null,
      ref: fields.ref || null,
    });
    return { ok: true, leadId: data.lead_id };
  } catch (error) {
    return { ok: false, error: error.name === 'AbortError' ? 'timeout' : 'network' };
  } finally {
    clearTimeout(timer);
  }
}
