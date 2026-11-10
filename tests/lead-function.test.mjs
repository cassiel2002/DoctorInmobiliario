// Tests de functions/api/lead.js. Se corren con: pnpm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleLead, neutralizeFormula, validateLead } from '../functions/api/lead.js';

const ORIGIN = 'https://www.eldoctorinmobiliario.com';
const ENV = {
  ALLOWED_ORIGINS: `${ORIGIN},https://eldoctorinmobiliario.com`,
  SHEETS_WEBHOOK_URL: 'https://script.google.com/macros/s/test/exec',
  SHEETS_WEBHOOK_SECRET: 'test-secret',
};

const validRental = {
  name: 'Ana Pérez', email: 'ana@example.com', whatsapp: '',
  move_in: '2027-01', message: 'Hi', property_id: 'halo', ref: 'IG-BIO-HALO',
  interest: 'long_term_rental', consent: true, company: '',
};

function request(body, { origin = ORIGIN, contentType = 'application/json' } = {}) {
  return new Request('https://www.eldoctorinmobiliario.com/api/lead', {
    method: 'POST',
    headers: { Origin: origin, 'Content-Type': contentType },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function payload(fields = validRental, extra = {}) {
  return { form_id: 'rental_inquiry', fields, attribution: { utm_source: 'instagram', utm_medium: 'social' }, page: '/rentas', elapsed_ms: 30000, ...extra };
}

function sheetsMock(response = { ok: true }, status = 200) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, body: JSON.parse(init.body) });
    return new Response(JSON.stringify(response), { status });
  };
  return { calls, fetchImpl };
}

test('guarda una consulta válida y devuelve lead_id', async () => {
  const sheets = sheetsMock();
  const res = await handleLead(request(payload()), ENV, sheets.fetchImpl);
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.ok, true);
  assert.match(body.lead_id, /^[0-9a-f-]{36}$/);
  assert.equal(sheets.calls.length, 1);
  assert.equal(sheets.calls[0].body.secret, 'test-secret');
  assert.equal(sheets.calls[0].body.row.lead_id, body.lead_id);
  assert.equal(sheets.calls[0].body.row.utm_source, 'instagram');
  assert.equal(sheets.calls[0].body.row.company, undefined, 'el campo trampa no se guarda');
});

test('el ref llega a la fila de la planilla', async () => {
  const sheets = sheetsMock();
  const res = await handleLead(request(payload()), ENV, sheets.fetchImpl);
  assert.equal(res.status, 200);
  assert.equal(sheets.calls[0].body.row.ref, 'IG-BIO-HALO');
});

test('el ref se recorta a 30 caracteres y se limpia', async () => {
  const sheets = sheetsMock();
  await handleLead(request(payload({ ...validRental, ref: `IG-${'X'.repeat(50)}` })), ENV, sheets.fetchImpl);
  assert.equal(sheets.calls[0].body.row.ref.length, 30);
});

test('los campos del formulario largo anterior ya no se guardan', async () => {
  const sheets = sheetsMock();
  const old = { ...validRental, country: 'Canada', budget_range: '30_40k', bedrooms: '2', pets: 'no' };
  const res = await handleLead(request(payload(old)), ENV, sheets.fetchImpl);
  assert.equal(res.status, 200, 'un valor viejo no debe hacer fallar el envío');
  const { row } = sheets.calls[0].body;
  assert.equal(row.budget_range, undefined);
  assert.equal(row.bedrooms, undefined);
  assert.equal(row.pets, undefined);
  assert.equal(row.country, undefined);
});

test('rechaza orígenes no permitidos', async () => {
  const sheets = sheetsMock();
  const res = await handleLead(request(payload(), { origin: 'https://evil.example' }), ENV, sheets.fetchImpl);
  assert.equal(res.status, 403);
  assert.equal(sheets.calls.length, 0);
});

test('sin ALLOWED_ORIGINS configurado rechaza todo', async () => {
  const res = await handleLead(request(payload()), { ...ENV, ALLOWED_ORIGINS: '' }, sheetsMock().fetchImpl);
  assert.equal(res.status, 403);
});

test('exige JSON y limita el tamaño', async () => {
  assert.equal((await handleLead(request('a=b', { contentType: 'text/plain' }), ENV)).status, 415);
  const big = payload({ ...validRental, message: 'x'.repeat(20000) });
  assert.equal((await handleLead(request(big), ENV)).status, 413);
  assert.equal((await handleLead(request('{bad json'), ENV)).status, 400);
});

test('bots: campo trampa o envío demasiado rápido no se guardan, pero responden ok', async () => {
  const sheets = sheetsMock();
  const honeypot = await handleLead(request(payload({ ...validRental, company: 'ACME' })), ENV, sheets.fetchImpl);
  const fast = await handleLead(request(payload(validRental, { elapsed_ms: 800 })), ENV, sheets.fetchImpl);
  assert.equal((await honeypot.json()).ok, true);
  assert.equal((await fast.json()).ok, true);
  assert.equal(sheets.calls.length, 0);
});

test('sin elapsed_ms no se descarta', async () => {
  const sheets = sheetsMock();
  await handleLead(request(payload(validRental, { elapsed_ms: null })), ENV, sheets.fetchImpl);
  assert.equal(sheets.calls.length, 1);
});

test('valida campos obligatorios, formatos y consentimiento', () => {
  assert.equal(validateLead('rental_inquiry', { ...validRental, name: '' }).error, 'missing_name');
  assert.equal(validateLead('rental_inquiry', { ...validRental, email: '', whatsapp: '' }).error, 'missing_email_or_whatsapp');
  assert.equal(validateLead('rental_inquiry', { ...validRental, email: 'no-arroba' }).error, 'invalid_email');
  assert.equal(validateLead('rental_inquiry', { ...validRental, move_in: '' }).error, 'missing_move_in');
  assert.equal(validateLead('rental_inquiry', { ...validRental, move_in: 'pronto' }).error, 'invalid_move_in');
  assert.equal(validateLead('rental_inquiry', { ...validRental, consent: 'true' }).error, 'missing_consent');
  assert.equal(validateLead('otro_form', validRental).error, 'unknown_form');
  assert.ok(validateLead('rental_inquiry', { ...validRental, email: '', whatsapp: '+1 555 123 4567' }).data);
});

test('descarga de guía: exige consentimiento', () => {
  const sinConsentimiento = validateLead('guide_download', { name: 'Bo', email: 'bo@example.com', guide: 'Mexico Investment Guide' });
  assert.equal(sinConsentimiento.error, 'missing_consent');

  const { data, error } = validateLead('guide_download', {
    name: 'Bo', email: 'bo@example.com', guide: 'Mexico Investment Guide', consent: true,
  });
  assert.equal(error, undefined);
  assert.equal(data.guide, 'Mexico Investment Guide');
});

test('neutraliza fórmulas de planilla', async () => {
  assert.equal(neutralizeFormula('=HYPERLINK("x")'), `'=HYPERLINK("x")`);
  assert.equal(neutralizeFormula('+54 9 11'), `'+54 9 11`);
  assert.equal(neutralizeFormula('Ana'), 'Ana');
  const sheets = sheetsMock();
  await handleLead(request(payload({ ...validRental, message: '=IMPORTXML("http://x")' })), ENV, sheets.fetchImpl);
  assert.equal(sheets.calls[0].body.row.message, `'=IMPORTXML("http://x")`);
});

test('si la planilla falla, responde error para que el sitio ofrezca WhatsApp', async () => {
  const failing = await handleLead(request(payload()), ENV, sheetsMock({ ok: false, error: 'unauthorized' }).fetchImpl);
  assert.equal(failing.status, 502);
  const down = await handleLead(request(payload()), ENV, async () => { throw new Error('down'); });
  assert.equal(down.status, 502);
  const unconfigured = await handleLead(request(payload()), { ALLOWED_ORIGINS: ORIGIN }, sheetsMock().fetchImpl);
  assert.equal(unconfigured.status, 500);
});

test('con Turnstile configurado exige un token válido', async () => {
  const env = { ...ENV, TURNSTILE_SECRET_KEY: 'ts' };
  const turnstileFails = async (url) => url.includes('turnstile')
    ? new Response(JSON.stringify({ success: false }))
    : new Response(JSON.stringify({ ok: true }));
  const res = await handleLead(request(payload()), env, turnstileFails);
  assert.equal(res.status, 400);
});

const validVilla = {
  name: 'Luis', email: 'luis@example.com', whatsapp: '', check_in: '2027-03-10',
  check_out: '2027-03-14', guests: '18', message: '', property_id: 'akubali', ref: 'DIR-AKUBALI',
  interest: 'villa_stay', consent: true, company: '',
};

test('villa: consulta válida se guarda con fechas y huéspedes', async () => {
  const sheets = sheetsMock();
  const res = await handleLead(request({ ...payload(validVilla), form_id: 'villa_inquiry' }), ENV, sheets.fetchImpl);
  assert.equal(res.status, 200);
  assert.equal(sheets.calls[0].body.row.check_in, '2027-03-10');
  assert.equal(sheets.calls[0].body.row.guests, '18');
  assert.equal(sheets.calls[0].body.row.ref, 'DIR-AKUBALI');
});

test('villa: valida fechas y huéspedes', () => {
  assert.equal(validateLead('villa_inquiry', { ...validVilla, check_out: '2027-03-09' }).error, 'invalid_dates');
  assert.equal(validateLead('villa_inquiry', { ...validVilla, check_in: 'marzo' }).error, 'invalid_check_in');
  assert.equal(validateLead('villa_inquiry', { ...validVilla, guests: '0' }).error, 'invalid_guests');
  assert.equal(validateLead('villa_inquiry', { ...validVilla, guests: '2.5' }).error, 'invalid_guests');
  assert.equal(validateLead('villa_inquiry', { ...validVilla, consent: false }).error, 'missing_consent');
});

const validIntake = {
  name: 'Ana', email: 'ana@example.com', whatsapp: '+1 555 123 4567',
  interest: 'invest', timeline: '3_6_months', budget_range: 'buy_300k_600k',
  message: '', ref: 'IG-BIO', consent: true, company: '',
};

test('/start: guarda contacto, preguntas y permiso de novedades', async () => {
  const sheets = sheetsMock();
  const res = await handleLead(
    request({ ...payload({ ...validIntake, marketing_opt_in: true }), form_id: 'profile_intake', page: '/start' }),
    ENV, sheets.fetchImpl,
  );
  assert.equal(res.status, 200);
  const { row } = sheets.calls[0].body;
  assert.equal(row.form_id, 'profile_intake');
  assert.equal(row.timeline, '3_6_months');
  assert.equal(row.budget_range, 'buy_300k_600k');
  assert.equal(row.marketing_ok, 'Sí');
});

test('/start: nombre, correo y teléfono son obligatorios', () => {
  assert.equal(validateLead('profile_intake', { ...validIntake, whatsapp: '' }).error, 'missing_whatsapp');
  assert.equal(validateLead('profile_intake', { ...validIntake, email: '' }).error, 'missing_email');
  assert.equal(validateLead('profile_intake', { ...validIntake, consent: false }).error, 'missing_consent');
  assert.equal(validateLead('profile_intake', validIntake).data.marketing_ok, 'No', 'sin la casilla no hay permiso');
});

test('/start: el presupuesto tiene que corresponder a lo que busca', () => {
  assert.equal(validateLead('profile_intake', { ...validIntake, budget_range: '' }).error, 'missing_budget_range');
  assert.equal(validateLead('profile_intake', { ...validIntake, budget_range: 'rent_2k_4k' }).error, 'invalid_budget_range');
  assert.equal(validateLead('profile_intake', { ...validIntake, interest: 'otra' }).error, 'invalid_interest');
  assert.equal(validateLead('profile_intake', { ...validIntake, timeline: 'ya' }).error, 'invalid_timeline');
  const rent = validateLead('profile_intake', { ...validIntake, interest: 'rent_long_term', budget_range: 'rent_2k_4k' });
  assert.equal(rent.error, undefined);
  const villa = validateLead('profile_intake', { ...validIntake, interest: 'villa_stay', budget_range: '' });
  assert.equal(villa.error, undefined, 'para villas no se pregunta presupuesto');
  const villaWithBudget = validateLead('profile_intake', { ...validIntake, interest: 'villa_stay', budget_range: 'buy_over_1m' });
  assert.equal(villaWithBudget.error, 'invalid_budget_range');
});

const validFeedback = { rating: '5', feeling: 'confident', recommend: 'yes', comment: 'Great', name: '', email: '', company: '' };

test('encuesta: anónima se guarda sin consentimiento', async () => {
  const sheets = sheetsMock();
  const res = await handleLead(request({ ...payload(validFeedback), form_id: 'feedback', page: '/feedback' }), ENV, sheets.fetchImpl);
  assert.equal(res.status, 200);
  assert.equal(sheets.calls[0].body.row.rating, '5');
  assert.equal(sheets.calls[0].body.row.form_id, 'feedback');
});

test('encuesta: valida respuestas y pide consentimiento si deja datos', () => {
  assert.equal(validateLead('feedback', { ...validFeedback, rating: '6' }).error, 'invalid_rating');
  assert.equal(validateLead('feedback', { ...validFeedback, rating: '' }).error, 'missing_rating');
  assert.equal(validateLead('feedback', { ...validFeedback, feeling: 'meh' }).error, 'invalid_feeling');
  assert.equal(validateLead('feedback', { ...validFeedback, email: 'a@b.co' }).error, 'missing_consent');
  assert.equal(validateLead('feedback', { ...validFeedback, email: 'a@b.co', consent: true }).error, undefined);
  assert.equal(validateLead('feedback', { ...validFeedback, email: 'mal' , consent: true }).error, 'invalid_email');
});
