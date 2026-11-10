"use client";

import { useRef, useState } from 'react';
import FormPage, { Choices, Field, Honeypot } from './FormPage';
import WhatsAppButton from '../WhatsAppButton';
import { buildRef } from '../../lib/ref';
import { submitLead } from '../../lib/submitLead';
import { track, trackFormStart } from '../../lib/track';
import { CALENDLY_URL } from '../../lib/site';

// Página /start: el link de la bio de Instagram (o de cualquier campaña).
// Pide nombre, correo y teléfono + 3 preguntas para que Augusto llegue a la
// primera conversación sabiendo qué busca la persona. Los valores tienen que
// coincidir con los de functions/api/lead.js (profile_intake).
const FORM_ID = 'profile_intake';

const INTERESTS = [
  { value: 'invest', label: 'Buy to invest' },
  { value: 'live', label: 'Buy a home to live in' },
  { value: 'rent_long_term', label: 'Rent long-term (1 year+)' },
  { value: 'villa_stay', label: 'A villa for a stay or event' },
];
const BUDGETS = {
  buy: [
    { value: 'buy_under_300k', label: 'Under US$300k' },
    { value: 'buy_300k_600k', label: 'US$300k – 600k' },
    { value: 'buy_600k_1m', label: 'US$600k – 1M' },
    { value: 'buy_over_1m', label: 'Over US$1M' },
  ],
  rent: [
    { value: 'rent_under_2k', label: 'Under US$2,000 / month' },
    { value: 'rent_2k_4k', label: 'US$2,000 – 4,000 / month' },
    { value: 'rent_over_4k', label: 'Over US$4,000 / month' },
  ],
};
const BUDGET_KIND = { invest: 'buy', live: 'buy', rent_long_term: 'rent' };
const TIMELINES = [
  { value: '0_3_months', label: 'In the next 3 months' },
  { value: '3_6_months', label: '3 – 6 months' },
  { value: '6_12_months', label: '6 – 12 months' },
  { value: 'exploring', label: 'Just exploring' },
];

const EMPTY = {
  name: '', email: '', whatsapp: '', interest: '', budget_range: '', timeline: '', message: '',
  consent: false, marketing_opt_in: false, company: '',
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s()-]{7,20}$/;

function validate(v) {
  const e = {};
  if (!v.name.trim()) e.name = 'Please enter your name.';
  if (!EMAIL_RE.test(v.email.trim())) e.email = 'Please enter a valid email.';
  if (!PHONE_RE.test(v.whatsapp.trim())) e.whatsapp = 'WhatsApp or phone with country code (e.g. +1 555 123 4567).';
  if (!v.interest) e.interest = 'Choose one option.';
  if (BUDGET_KIND[v.interest] && !v.budget_range) e.budget_range = 'Choose a range.';
  if (!v.timeline) e.timeline = 'Choose one option.';
  if (!v.consent) e.consent = 'We need your consent to contact you.';
  return e;
}

export default function IntakeForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const startedAt = useRef(null);

  const update = (field, value) => {
    setValues((v) => ({
      ...v,
      [field]: value,
      // El presupuesto depende de lo que busca: al cambiar, se vuelve a elegir.
      ...(field === 'interest' && BUDGET_KIND[value] !== BUDGET_KIND[v.interest] ? { budget_range: '' } : {}),
    }));
    if (errors[field]) setErrors((errs) => ({ ...errs, [field]: undefined }));
  };
  const onInput = (field) => (e) => update(field, e.target.type === 'checkbox' ? e.target.checked : e.target.value);

  const onFocus = () => {
    if (!startedAt.current) startedAt.current = Date.now();
    trackFormStart(FORM_ID);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus('sending');
    const fields = {
      ...values,
      name: values.name.trim(), email: values.email.trim(), whatsapp: values.whatsapp.trim(),
      budget_range: BUDGET_KIND[values.interest] ? values.budget_range : '',
      ref: buildRef(),
    };
    const result = await submitLead(FORM_ID, fields, { startedAt: startedAt.current });
    setStatus(result.ok ? 'done' : 'error');
  };

  const budgetKind = BUDGET_KIND[values.interest];
  const wantsRental = values.interest === 'rent_long_term' || values.interest === 'villa_stay';
  const label = INTERESTS.find((o) => o.value === values.interest)?.label;
  const whatsappText = `Hello Augusto, I'm ${values.name || 'interested'}. I'm looking for: ${label || 'information'}.`;

  if (status === 'done') {
    return (
      <FormPage label="Thank you" title={<>We&apos;ll be in <em>touch.</em></>}>
        <div className="fp-card" role="status">
          <p>Augusto received your answers and will contact you personally.</p>
          <p>Want to move faster? Pick the next step:</p>
          <div className="fp-actions">
            {wantsRental ? (
              <a href="/rentas" className="btn-primary" onClick={() => track('cta_click', { cta_id: 'start_to_rentals', cta_location: 'start_done' })}>
                See rentals & villas
              </a>
            ) : (
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener"
                className="btn-primary"
                onClick={() => track('cta_click', { cta_id: 'start_schedule_call', cta_location: 'start_done' })}
              >
                Schedule a strategy call
              </a>
            )}
            <WhatsAppButton className="btn-ghost" message={whatsappText} location="start_done">
              Chat on WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      </FormPage>
    );
  }

  return (
    <FormPage
      label="Tulum · Real Estate"
      title={<>Tell us what you&apos;re <em>looking for.</em></>}
      intro="Three quick questions so Augusto can come to your first conversation with real options. It takes less than a minute."
    >
      <form className="fp-card" onSubmit={onSubmit} onFocus={onFocus} noValidate>
        <Field label="Full name" id="name" error={errors.name}>
          <input id="name" autoComplete="name" value={values.name} onChange={onInput('name')} />
        </Field>
        <Field label="Email" id="email" error={errors.email}>
          <input id="email" type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} value={values.email} onChange={onInput('email')} />
        </Field>
        <Field label="WhatsApp / phone (with country code)" id="whatsapp" error={errors.whatsapp}>
          <input id="whatsapp" type="tel" autoComplete="tel" inputMode="tel" placeholder="+1 555 123 4567" value={values.whatsapp} onChange={onInput('whatsapp')} />
        </Field>

        <Choices
          legend="1. What are you looking for?"
          name="interest"
          options={INTERESTS}
          value={values.interest}
          onChange={(v) => update('interest', v)}
          error={errors.interest}
        />
        {budgetKind && (
          <Choices
            legend={budgetKind === 'buy' ? '2. Approximate budget' : '2. Monthly rent budget'}
            name="budget_range"
            options={BUDGETS[budgetKind]}
            value={values.budget_range}
            onChange={(v) => update('budget_range', v)}
            error={errors.budget_range}
          />
        )}
        <Choices
          legend={`${budgetKind ? '3' : '2'}. When are you planning to move forward?`}
          name="timeline"
          options={TIMELINES}
          value={values.timeline}
          onChange={(v) => update('timeline', v)}
          error={errors.timeline}
        />

        <Field label="Anything else? (optional)" id="message">
          <textarea id="message" rows={3} maxLength={1000} value={values.message} onChange={onInput('message')} />
        </Field>

        <Honeypot value={values.company} onChange={onInput('company')} />

        <label className="rentals-consent">
          <input type="checkbox" checked={values.consent} onChange={onInput('consent')} />
          <span>
            I agree that El Doctor Inmobiliario uses my details to contact me about this request, as described in
            the <a href="/privacy" target="_blank" rel="noopener">privacy notice</a>.
          </span>
        </label>
        {errors.consent && <p className="fp-error">{errors.consent}</p>}
        <label className="rentals-consent">
          <input type="checkbox" checked={values.marketing_opt_in} onChange={onInput('marketing_opt_in')} />
          <span>Optional: send me occasional market updates and new opportunities by email.</span>
        </label>

        {status === 'error' && (
          <div className="fp-alert" role="alert">
            We could not send your answers. Please try again, or{' '}
            <WhatsAppButton className="rentals-link-button" message={whatsappText} location="start_error">
              send them on WhatsApp
            </WhatsAppButton>
            .
          </div>
        )}

        <button type="submit" className="form-submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send →'}
        </button>
      </form>
    </FormPage>
  );
}
