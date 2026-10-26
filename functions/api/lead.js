// ── RECEPCIÓN DE FORMULARIOS: POST /api/lead ──
// Cloudflare Pages Function (corre en Cloudflare, no en el navegador).
//
// Recorrido:
//   1. Revisa origen, tamaño y formato del pedido.
//   2. Descarta bots (campo trampa, envío demasiado rápido y, si está
//      configurado, Cloudflare Turnstile).
//   3. Valida los campos según el formulario.
//   4. Crea un lead_id y manda la fila a la planilla de Augusto (Google Apps
//      Script), que además le avisa por correo.
//   5. Responde { ok: true, lead_id } — recién ahí el sitio registra
//      generate_lead en GA4 con el mismo lead_id.
//
// Variables (Cloudflare → Pages → Settings → Variables and secrets):
//   SHEETS_WEBHOOK_URL    URL de la implementación web del Apps Script   (secreto)
//   SHEETS_WEBHOOK_SECRET clave compartida con el Apps Script            (secreto)
//   ALLOWED_ORIGINS       orígenes permitidos, separados por coma
//                         ej: https://www.eldoctorinmobiliario.com,https://eldoctorinmobiliario.com
//   TURNSTILE_SECRET_KEY  opcional; si está, se exige el token de Turnstile (secreto)

const MAX_BODY_BYTES = 10_000;
const MIN_ELAPSED_MS = 2_500; // una persona no completa el formulario en menos tiempo

const SCHEMAS = {
  // Formularios cortos: WhatsApp es la vía principal y la calificación
  // (presupuesto, mascotas, dormitorios, ocasión) la hace Augusto en la conversación.
  rental_inquiry: {
    required: ['name', 'move_in'],
    oneOf: [['email', 'whatsapp']],
    fields: {
      name: 120, email: 160, whatsapp: 30, move_in: 7, message: 1000,
      property_id: 60, interest: 40, ref: 30,
    },
    enums: {},
    requireConsent: true,
  },
  villa_inquiry: {
    required: ['name', 'check_in', 'check_out', 'guests'],
    oneOf: [['email', 'whatsapp']],
    fields: {
      name: 120, email: 160, whatsapp: 30, check_in: 10, check_out: 10, guests: 3, message: 1000,
      property_id: 60, interest: 40, ref: 30,
    },
    enums: {},
    requireConsent: true,
  },
  guide_download: {
    required: ['name', 'email', 'guide'],
    oneOf: [],
    fields: { name: 120, email: 160, country: 80, guide: 80, interest: 40 },
    enums: {},
    requireConsent: true,
  },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s()-]{7,20}$/;
const ATTRIBUTION_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'landing_page', 'referrer'];

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

/** Evita que un texto se ejecute como fórmula al abrir la planilla (=, +, -, @). */
export function neutralizeFormula(value) {
  const text = String(value ?? '');
  return /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
}

function clean(value, maxLength) {
  return String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, maxLength);
}

/** Devuelve { data } con los campos limpios, o { error } con el motivo. */
export function validateLead(formId, rawFields) {
  const schema = SCHEMAS[formId];
  if (!schema) return { error: 'unknown_form' };
  if (!rawFields || typeof rawFields !== 'object') return { error: 'invalid_fields' };

  const data = {};
  for (const [field, maxLength] of Object.entries(schema.fields)) {
    data[field] = clean(rawFields[field], maxLength);
  }

  for (const field of schema.required) {
    if (!data[field]) return { error: `missing_${field}` };
  }
  for (const group of schema.oneOf) {
    if (!group.some((field) => data[field])) return { error: `missing_${group.join('_or_')}` };
  }
  for (const [field, allowed] of Object.entries(schema.enums)) {
    if (data[field] !== undefined && !allowed.includes(data[field])) return { error: `invalid_${field}` };
  }
  if (data.email && !EMAIL_RE.test(data.email)) return { error: 'invalid_email' };
  if (data.whatsapp && !PHONE_RE.test(data.whatsapp)) return { error: 'invalid_whatsapp' };
  if (data.move_in !== undefined && data.move_in && !/^\d{4}-\d{2}$/.test(data.move_in)) {
    return { error: 'invalid_move_in' };
  }
  if (data.check_in !== undefined) {
    const dateRe = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRe.test(data.check_in)) return { error: 'invalid_check_in' };
    if (!dateRe.test(data.check_out)) return { error: 'invalid_check_out' };
    if (data.check_out <= data.check_in) return { error: 'invalid_dates' };
    const guests = Number(data.guests);
    if (!Number.isInteger(guests) || guests < 1 || guests > 60) return { error: 'invalid_guests' };
  }
  if (schema.requireConsent && rawFields.consent !== true) return { error: 'missing_consent' };

  return { data };
}

function originAllowed(request, env) {
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((o) => o.trim()).filter(Boolean);
  if (allowed.length === 0) return false; // sin configurar: se rechaza todo
  return allowed.includes(request.headers.get('Origin') || '');
}

async function verifyTurnstile(token, request, env, fetchImpl) {
  const body = new FormData();
  body.append('secret', env.TURNSTILE_SECRET_KEY);
  body.append('response', token || '');
  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) body.append('remoteip', ip);
  const res = await fetchImpl('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  const outcome = await res.json().catch(() => ({}));
  return outcome.success === true;
}

export async function handleLead(request, env, fetchImpl = fetch) {
  if (!originAllowed(request, env)) return json({ ok: false, error: 'forbidden_origin' }, 403);
  if (!(request.headers.get('Content-Type') || '').includes('application/json')) {
    return json({ ok: false, error: 'unsupported_media_type' }, 415);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json({ ok: false, error: 'payload_too_large' }, 413);

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }

  const fields = payload.fields || {};

  // Bots: se responde "ok" para no darles pistas, pero no se guarda nada.
  // Si no se sabe cuánto tardó (elapsed_ms ausente), no se descarta.
  const elapsed = payload.elapsed_ms == null ? NaN : Number(payload.elapsed_ms);
  if (fields.company || (Number.isFinite(elapsed) && elapsed < MIN_ELAPSED_MS)) {
    return json({ ok: true, lead_id: crypto.randomUUID() });
  }

  if (env.TURNSTILE_SECRET_KEY) {
    const human = await verifyTurnstile(payload.turnstile_token, request, env, fetchImpl);
    if (!human) return json({ ok: false, error: 'turnstile_failed' }, 400);
  }

  const { data, error } = validateLead(payload.form_id, fields);
  if (error) return json({ ok: false, error }, 422);

  if (!env.SHEETS_WEBHOOK_URL || !env.SHEETS_WEBHOOK_SECRET) {
    return json({ ok: false, error: 'not_configured' }, 500);
  }

  const attribution = payload.attribution || {};
  const leadId = crypto.randomUUID();
  const row = {
    lead_id: leadId,
    received_at: new Date().toISOString(),
    form_id: payload.form_id,
    page: clean(payload.page, 100),
    ...Object.fromEntries(ATTRIBUTION_KEYS.map((key) => [key, clean(attribution[key], 200)])),
    ...data,
    country_cf: request.headers.get('CF-IPCountry') || '',
  };
  const safeRow = Object.fromEntries(Object.entries(row).map(([k, v]) => [k, neutralizeFormula(v)]));

  try {
    const res = await fetchImpl(env.SHEETS_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: env.SHEETS_WEBHOOK_SECRET, row: safeRow }),
      redirect: 'follow',
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok || result.ok !== true) return json({ ok: false, error: 'storage_failed' }, 502);
  } catch {
    return json({ ok: false, error: 'storage_unreachable' }, 502);
  }

  return json({ ok: true, lead_id: leadId });
}

export const onRequestPost = ({ request, env }) => handleLead(request, env);

export const onRequest = () => json({ ok: false, error: 'method_not_allowed' }, 405);
