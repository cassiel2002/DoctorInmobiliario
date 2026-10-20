"use client";

import { useRef, useState } from 'react';
import Reveal from '../Reveal';
import { budgetRanges, rentalProperties } from '../../data/rentals';
import { villaOccasions, villas } from '../../data/villas';
import { submitLead } from '../../lib/submitLead';
import { track, trackFormStart } from '../../lib/track';
import { WHATSAPP_MESSAGES, whatsappUrl } from '../../lib/site';

// Dos modos, dos formularios para el servidor (y para medir por separado):
//   home  → rental_inquiry (renta anual)
//   villa → villa_inquiry  (estadía, evento o grupo)
const FORM_IDS = { home: 'rental_inquiry', villa: 'villa_inquiry' };

const EMPTY = {
  name: '', email: '', whatsapp: '', country: '', message: '', property_id: '',
  // renta anual
  move_in: '', budget_range: '', bedrooms: '', pets: '',
  // villa
  check_in: '', check_out: '', guests: '', occasion: '',
  consent: false,
  company: '', // campo trampa: invisible para personas, los bots lo completan
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s()-]{7,20}$/;

function validate(mode, values) {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Please enter your name.';
  if (!values.email.trim() && !values.whatsapp.trim()) {
    errors.email = 'Leave an email or a WhatsApp number so we can reply.';
  }
  if (values.email.trim() && !EMAIL_RE.test(values.email.trim())) errors.email = 'This email does not look valid.';
  if (values.whatsapp.trim() && !PHONE_RE.test(values.whatsapp.trim())) {
    errors.whatsapp = 'Use digits only, with country code (e.g. +1 555 123 4567).';
  }
  if (!values.country.trim()) errors.country = 'Please tell us where you live now.';

  if (mode === 'home') {
    if (!values.move_in) errors.move_in = 'Approximate month is enough.';
    if (!values.budget_range) errors.budget_range = 'Choose a range.';
  } else {
    if (!values.check_in) errors.check_in = 'Choose an arrival date.';
    if (!values.check_out) errors.check_out = 'Choose a departure date.';
    if (values.check_in && values.check_out && values.check_out <= values.check_in) {
      errors.check_out = 'Departure must be after arrival.';
    }
    const guests = Number(values.guests);
    if (!Number.isInteger(guests) || guests < 1 || guests > 60) errors.guests = 'Number of guests (1–60).';
  }

  if (!values.consent) errors.consent = 'We need your consent to contact you.';
  return errors;
}

function whatsappSummary(mode, values) {
  const list = mode === 'home' ? rentalProperties : villas;
  const property = list.find((p) => p.id === values.property_id)?.name;
  if (mode === 'home') {
    const budget = budgetRanges.find((b) => b.value === values.budget_range)?.label;
    return [
      WHATSAPP_MESSAGES.rentals,
      values.name && `Name: ${values.name}`,
      property && `Home: ${property}`,
      values.move_in && `Move-in: ${values.move_in}`,
      budget && `Budget: ${budget}`,
    ].filter(Boolean).join('\n');
  }
  const occasion = villaOccasions.find((o) => o.value === values.occasion)?.label;
  return [
    WHATSAPP_MESSAGES.villas,
    values.name && `Name: ${values.name}`,
    property && `Villa: ${property}`,
    values.check_in && `Dates: ${values.check_in} → ${values.check_out || '?'}`,
    values.guests && `Guests: ${values.guests}`,
    occasion && `Occasion: ${occasion}`,
  ].filter(Boolean).join('\n');
}

/**
 * selected: { kind: 'home' | 'villa', item } — llega cuando la persona toca
 * "Ask about this home/villa" en una tarjeta.
 */
export default function RentalInquiryForm({ selected }) {
  const [mode, setMode] = useState('home');
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const startedAt = useRef(null);

  // Ajuste de estado cuando cambia la prop, sin efecto (patrón recomendado por React).
  const [lastSelected, setLastSelected] = useState(null);
  if (selected && selected !== lastSelected) {
    setLastSelected(selected);
    setMode(selected.kind);
    setValues((v) => ({ ...v, property_id: selected.item.id }));
    setErrors({});
  }

  const formId = FORM_IDS[mode];

  const onFocus = () => {
    if (!startedAt.current) startedAt.current = Date.now();
    trackFormStart(formId);
  };

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((errs) => ({ ...errs, [field]: undefined }));
  };

  const switchMode = (next) => {
    if (next === mode) return;
    setMode(next);
    setValues((v) => ({ ...v, property_id: '' }));
    setErrors({});
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(mode, values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const common = {
      name: values.name, email: values.email, whatsapp: values.whatsapp, country: values.country,
      message: values.message, property_id: values.property_id, company: values.company,
    };
    const fields = mode === 'home'
      ? { ...common, move_in: values.move_in, budget_range: values.budget_range, bedrooms: values.bedrooms, pets: values.pets, interest: 'long_term_rental' }
      : { ...common, check_in: values.check_in, check_out: values.check_out, guests: values.guests, occasion: values.occasion, interest: 'villa_stay' };

    setStatus('sending');
    const result = await submitLead(formId, { ...fields, consent: values.consent }, { startedAt: startedAt.current });
    setStatus(result.ok ? 'done' : 'error');
  };

  const waLink = whatsappUrl(whatsappSummary(mode, values));
  const options = mode === 'home' ? rentalProperties : villas;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <section id="inquire" className="rentals-inquire">
      <Reveal>
        <div className="section-label">Inquire</div>
        <h2>Tell us how you <em>want to stay.</em></h2>
        <div className="gold-rule" />
        <p className="section-intro">
          Two minutes. Augusto reads every request personally and replies with options that fit.
        </p>
      </Reveal>

      {status === 'done' ? (
        <div className="rentals-form rentals-form-done" role="status">
          <h3>Request received.</h3>
          <p>Augusto will reply personally with options and availability.</p>
          <p>
            In a hurry?{' '}
            <a href={waLink} target="_blank" rel="noopener" onClick={() => track('whatsapp_click', { cta_location: 'form_done' })}>
              Write on WhatsApp
            </a>
            .
          </p>
        </div>
      ) : (
        <form className="rentals-form" onSubmit={onSubmit} onFocus={onFocus} noValidate>
          <fieldset className="rentals-mode">
            <legend>What are you looking for?</legend>
            <label className={mode === 'home' ? 'active' : ''}>
              <input type="radio" name="mode" value="home" checked={mode === 'home'} onChange={() => switchMode('home')} />
              A home for a year or more
            </label>
            <label className={mode === 'villa' ? 'active' : ''}>
              <input type="radio" name="mode" value="villa" checked={mode === 'villa'} onChange={() => switchMode('villa')} />
              A villa for a stay or event
            </label>
          </fieldset>

          <div className="rentals-form-grid">
            <Field label="Full name" error={errors.name} id="name">
              <input id="name" autoComplete="name" value={values.name} onChange={set('name')} />
            </Field>
            <Field label="Country of residence" error={errors.country} id="country">
              <input id="country" autoComplete="country-name" value={values.country} onChange={set('country')} />
            </Field>
            <Field label="Email" error={errors.email} id="email">
              <input id="email" type="email" autoComplete="email" value={values.email} onChange={set('email')} />
            </Field>
            <Field label="WhatsApp (with country code)" error={errors.whatsapp} id="whatsapp">
              <input id="whatsapp" type="tel" autoComplete="tel" value={values.whatsapp} onChange={set('whatsapp')} />
            </Field>

            {mode === 'home' ? (
              <>
                <Field label="Approximate move-in" error={errors.move_in} id="move_in">
                  <input id="move_in" type="month" value={values.move_in} onChange={set('move_in')} />
                </Field>
                <Field label="Monthly budget" error={errors.budget_range} id="budget_range">
                  <select id="budget_range" value={values.budget_range} onChange={set('budget_range')}>
                    <option value="">Choose a range</option>
                    {budgetRanges.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
                  </select>
                </Field>
                <Field label="Bedrooms (optional)" id="bedrooms">
                  <select id="bedrooms" value={values.bedrooms} onChange={set('bedrooms')}>
                    <option value="">Any</option>
                    {['1', '2', '3', '4+'].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </Field>
                <Field label="Pets (optional)" id="pets">
                  <select id="pets" value={values.pets} onChange={set('pets')}>
                    <option value="">No answer</option>
                    <option value="no">No pets</option>
                    <option value="yes">Yes, I have pets</option>
                  </select>
                </Field>
              </>
            ) : (
              <>
                <Field label="Arrival" error={errors.check_in} id="check_in">
                  <input id="check_in" type="date" min={today} value={values.check_in} onChange={set('check_in')} />
                </Field>
                <Field label="Departure" error={errors.check_out} id="check_out">
                  <input id="check_out" type="date" min={values.check_in || today} value={values.check_out} onChange={set('check_out')} />
                </Field>
                <Field label="Number of guests" error={errors.guests} id="guests">
                  <input id="guests" type="number" min={1} max={60} inputMode="numeric" value={values.guests} onChange={set('guests')} />
                </Field>
                <Field label="Occasion (optional)" id="occasion">
                  <select id="occasion" value={values.occasion} onChange={set('occasion')}>
                    <option value="">Choose one</option>
                    {villaOccasions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </Field>
              </>
            )}

            <Field label={mode === 'home' ? 'Home you are interested in (optional)' : 'Villa you are interested in (optional)'} id="property_id" wide>
              <select id="property_id" value={values.property_id} onChange={set('property_id')}>
                <option value="">Not sure yet</option>
                {options.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </Field>
            <Field label="Anything else? (optional)" id="message" wide>
              <textarea id="message" rows={4} maxLength={1000} value={values.message} onChange={set('message')} />
            </Field>
          </div>

          {/* Campo trampa contra bots: oculto para personas y lectores de pantalla */}
          <div className="rentals-hp" aria-hidden="true">
            <label htmlFor="company">Company</label>
            <input id="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={set('company')} />
          </div>

          <label className="rentals-consent">
            <input type="checkbox" checked={values.consent} onChange={set('consent')} />
            <span>
              I agree that El Doctor Inmobiliario uses my details to reply to this request, as described
              in the <a href="/privacy" target="_blank" rel="noopener">privacy notice</a>.
            </span>
          </label>
          {errors.consent && <p className="rentals-field-error">{errors.consent}</p>}

          {status === 'error' && (
            <div className="rentals-form-error" role="alert">
              We could not send your request. Please try again, or{' '}
              <a href={waLink} target="_blank" rel="noopener" onClick={() => track('whatsapp_click', { cta_location: 'form_error' })}>
                send it on WhatsApp
              </a>
              .
            </div>
          )}

          <button type="submit" className="form-submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send request →'}
          </button>
        </form>
      )}
    </section>
  );
}

function Field({ label, error, id, wide, children }) {
  return (
    <div className={`form-field ${wide ? 'rentals-field-wide' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <p className="rentals-field-error" id={`${id}-error`}>{error}</p>}
    </div>
  );
}
