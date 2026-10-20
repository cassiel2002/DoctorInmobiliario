"use client";

import { useRef, useState } from 'react';
import Reveal from '../Reveal';
import { budgetRanges, rentalProperties } from '../../data/rentals';
import { submitLead } from '../../lib/submitLead';
import { track, trackFormStart } from '../../lib/track';
import { WHATSAPP_MESSAGES, whatsappUrl } from '../../lib/site';

const FORM_ID = 'rental_inquiry';

const EMPTY = {
  name: '',
  email: '',
  whatsapp: '',
  country: '',
  move_in: '',
  budget_range: '',
  bedrooms: '',
  pets: '',
  message: '',
  property_id: '',
  consent: false,
  company: '', // campo trampa: invisible para personas, los bots lo completan
};

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Please enter your name.';
  if (!values.email.trim() && !values.whatsapp.trim()) {
    errors.email = 'Leave an email or a WhatsApp number so we can reply.';
  }
  if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'This email does not look valid.';
  }
  if (values.whatsapp.trim() && !/^\+?[\d\s()-]{7,20}$/.test(values.whatsapp.trim())) {
    errors.whatsapp = 'Use digits only, with country code (e.g. +1 555 123 4567).';
  }
  if (!values.country.trim()) errors.country = 'Please tell us where you live now.';
  if (!values.move_in) errors.move_in = 'Approximate month is enough.';
  if (!values.budget_range) errors.budget_range = 'Choose a range.';
  if (!values.consent) errors.consent = 'We need your consent to contact you.';
  return errors;
}

function whatsappSummary(values) {
  const budget = budgetRanges.find((b) => b.value === values.budget_range)?.label;
  const property = rentalProperties.find((p) => p.id === values.property_id)?.name;
  return [
    WHATSAPP_MESSAGES.rentals,
    values.name && `Name: ${values.name}`,
    property && `Home: ${property}`,
    values.move_in && `Move-in: ${values.move_in}`,
    budget && `Budget: ${budget}`,
    values.bedrooms && `Bedrooms: ${values.bedrooms}`,
  ].filter(Boolean).join('\n');
}

export default function RentalInquiryForm({ selectedProperty }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const startedAt = useRef(null);

  // Si la persona tocó "Ask about this home", el formulario llega con esa casa elegida.
  // (Ajuste de estado al cambiar la prop, sin efecto: patrón recomendado por React.)
  const [lastSelected, setLastSelected] = useState(null);
  if (selectedProperty && selectedProperty !== lastSelected) {
    setLastSelected(selectedProperty);
    setValues((v) => ({ ...v, property_id: selectedProperty.id }));
  }

  const onFocus = () => {
    if (!startedAt.current) startedAt.current = Date.now();
    trackFormStart(FORM_ID);
  };

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field]) setErrors((errs) => ({ ...errs, [field]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus('sending');
    const { consent, ...fields } = values;
    const result = await submitLead(
      FORM_ID,
      { ...fields, interest: 'long_term_rental', consent },
      { startedAt: startedAt.current }
    );
    setStatus(result.ok ? 'done' : 'error');
  };

  const waLink = whatsappUrl(whatsappSummary(values));

  return (
    <section id="inquire" className="rentals-inquire">
      <Reveal>
        <div className="section-label">Inquire</div>
        <h2>Tell us how you <em>want to live.</em></h2>
        <div className="gold-rule" />
        <p className="section-intro">
          Two minutes. Augusto reads every request personally and replies with options that fit.
        </p>
      </Reveal>

      {status === 'done' ? (
        <div className="rentals-form rentals-form-done" role="status">
          <h3>Request received.</h3>
          <p>Augusto will reply personally, usually within one business day.</p>
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
            <Field label="Home you are interested in (optional)" id="property_id" wide>
              <select id="property_id" value={values.property_id} onChange={set('property_id')}>
                <option value="">Not sure yet</option>
                {rentalProperties.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
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
