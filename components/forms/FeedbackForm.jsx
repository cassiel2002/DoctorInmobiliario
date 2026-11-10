"use client";

import { useRef, useState } from 'react';
import Link from 'next/link';
import FormPage, { Choices, Field, Honeypot } from './FormPage';
import { buildRef } from '../../lib/ref';
import { submitLead } from '../../lib/submitLead';
import { trackFormStart } from '../../lib/track';

// Página /feedback: encuesta de satisfacción. Se guarda en la pestaña
// "Feedback" de la planilla (no en Leads). Nombre y correo son opcionales.
// Los valores tienen que coincidir con functions/api/lead.js (feedback).
const FORM_ID = 'feedback';

const RATINGS = ['1', '2', '3', '4', '5'];
const FEELINGS = [
  { value: 'confident', label: 'Confident and well guided' },
  { value: 'informed', label: 'Well informed' },
  { value: 'undecided', label: 'Still undecided' },
  { value: 'overwhelmed', label: 'Overwhelmed or confused' },
];
const RECOMMEND = [
  { value: 'yes', label: 'Yes' },
  { value: 'maybe', label: 'Maybe' },
  { value: 'no', label: 'No' },
];
const EMPTY = { rating: '', feeling: '', recommend: '', comment: '', name: '', email: '', consent: false, company: '' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(v) {
  const e = {};
  if (!v.rating) e.rating = 'Choose a score from 1 to 5.';
  if (!v.feeling) e.feeling = 'Choose one option.';
  if (!v.recommend) e.recommend = 'Choose one option.';
  if (v.email.trim() && !EMAIL_RE.test(v.email.trim())) e.email = 'This email does not look valid.';
  if ((v.name.trim() || v.email.trim()) && !v.consent) e.consent = 'We need your consent to keep your name or email.';
  return e;
}

export default function FeedbackForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const startedAt = useRef(null);

  const update = (field, value) => {
    setValues((v) => ({ ...v, [field]: value }));
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
    const result = await submitLead(
      FORM_ID,
      { ...values, name: values.name.trim(), email: values.email.trim(), ref: buildRef() },
      { startedAt: startedAt.current },
    );
    setStatus(result.ok ? 'done' : 'error');
  };

  if (status === 'done') {
    return (
      <FormPage label="Thank you" title={<>Thank you for your <em>time.</em></>}>
        <div className="fp-card" role="status">
          <p>Your answers help us improve every conversation. Augusto reads each one personally.</p>
          <div className="fp-actions">
            <Link href="/" className="btn-ghost">Back to the site</Link>
          </div>
        </div>
      </FormPage>
    );
  }

  return (
    <FormPage
      label="Your experience"
      title={<>How did we <em>do?</em></>}
      intro="Less than a minute. Your honest answer helps us serve you — and the next investor — better."
    >
      <form className="fp-card" onSubmit={onSubmit} onFocus={onFocus} noValidate>
        <fieldset className="fp-choices">
          <legend>1. How would you rate your experience with us?</legend>
          <div className="fp-rating" role="radiogroup" aria-label="Score from 1 (poor) to 5 (excellent)">
            {RATINGS.map((r) => (
              <label key={r} className={values.rating === r ? 'active' : ''}>
                <input type="radio" name="rating" value={r} checked={values.rating === r} onChange={() => update('rating', r)} />
                {r}
              </label>
            ))}
          </div>
          <div className="fp-rating-legend"><span>Poor</span><span>Excellent</span></div>
          {errors.rating && <p className="fp-error">{errors.rating}</p>}
        </fieldset>

        <Choices legend="2. How did you feel during the process?" name="feeling" options={FEELINGS}
          value={values.feeling} onChange={(v) => update('feeling', v)} error={errors.feeling} />
        <Choices legend="3. Would you recommend El Doctor Inmobiliario to a friend?" name="recommend" options={RECOMMEND}
          value={values.recommend} onChange={(v) => update('recommend', v)} error={errors.recommend} />

        <Field label="What could we do better? (optional)" id="comment">
          <textarea id="comment" rows={4} maxLength={1000} value={values.comment} onChange={onInput('comment')} />
        </Field>
        <Field label="Name (optional)" id="name">
          <input id="name" autoComplete="name" value={values.name} onChange={onInput('name')} />
        </Field>
        <Field label="Email (optional)" id="email" error={errors.email}>
          <input id="email" type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} value={values.email} onChange={onInput('email')} />
        </Field>

        <Honeypot value={values.company} onChange={onInput('company')} />

        {(values.name.trim() || values.email.trim()) && (
          <label className="rentals-consent">
            <input type="checkbox" checked={values.consent} onChange={onInput('consent')} />
            <span>
              I agree that El Doctor Inmobiliario keeps my name and email with this answer, as described in
              the <a href="/privacy" target="_blank" rel="noopener">privacy notice</a>.
            </span>
          </label>
        )}
        {errors.consent && <p className="fp-error">{errors.consent}</p>}

        {status === 'error' && (
          <div className="fp-alert" role="alert">We could not send your answers. Please try again in a moment.</div>
        )}

        <button type="submit" className="form-submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send feedback →'}
        </button>
      </form>
    </FormPage>
  );
}
