"use client";

import { useEffect, useRef, useState } from 'react';
import Reveal from '../Reveal';
import Expand from '../Expand';
import WhatsAppButton from '../WhatsAppButton';
import { rentalProperties } from '../../data/rentals';
import { villas } from '../../data/villas';
import { buildRef } from '../../lib/ref';
import { submitLead } from '../../lib/submitLead';
import { track, trackFormStart } from '../../lib/track';
import { WHATSAPP_MESSAGES, interestMessage } from '../../lib/site';

// WhatsApp es la vía principal de contacto. Este formulario es la alternativa
// corta ("Prefer email?"): la calificación (presupuesto, mascotas, dormitorios,
// ocasión) la hace Augusto en la conversación.
//
// Dos modos, dos form_id para el servidor (y para medir por separado):
//   home  → rental_inquiry (renta anual)
//   villa → villa_inquiry  (estadía, evento o grupo)
const FORM_IDS = { home: 'rental_inquiry', villa: 'villa_inquiry' };

const EMPTY = {
  name: '', contact: '', message: '',
  move_in: '',                          // casa
  check_in: '', check_out: '', guests: '', // villa
  property_id: '',                      // oculto: llega desde una tarjeta
  consent: false,
  company: '',                          // campo trampa: invisible para personas, los bots lo completan
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s()-]{7,20}$/;

/** Un solo campo "correo o WhatsApp": si tiene @ es correo, si no, teléfono. */
function splitContact(contact) {
  const value = contact.trim();
  return value.includes('@') ? { email: value, whatsapp: '' } : { email: '', whatsapp: value };
}

function validate(mode, values) {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Please enter your name.';

  const contact = values.contact.trim();
  if (!contact) {
    errors.contact = 'Leave an email or a WhatsApp number so we can reply.';
  } else if (contact.includes('@')) {
    if (!EMAIL_RE.test(contact)) errors.contact = 'This email does not look valid.';
  } else if (!PHONE_RE.test(contact)) {
    errors.contact = 'Use an email, or a WhatsApp number with country code (e.g. +1 555 123 4567).';
  }

  if (mode === 'home') {
    if (!values.move_in) errors.move_in = 'Approximate month is enough.';
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

/** Mensaje base de WhatsApp (sin el Ref: lo agrega WhatsAppButton al hacer clic). */
function baseMessage(mode, propertyName) {
  if (propertyName) return interestMessage(propertyName);
  return mode === 'home' ? WHATSAPP_MESSAGES.rentals : WHATSAPP_MESSAGES.villas;
}

/** Mensaje de respaldo si el formulario falla: suma lo que la persona ya completó. */
function fallbackMessage(mode, values, propertyName) {
  const details = mode === 'home'
    ? [values.move_in && `Move-in: ${values.move_in}`]
    : [
        values.check_in && `Dates: ${values.check_in} → ${values.check_out || '?'}`,
        values.guests && `Guests: ${values.guests}`,
      ];
  return [baseMessage(mode, propertyName), values.name && `Name: ${values.name}`, ...details]
    .filter(Boolean)
    .join('\n');
}

/**
 * selected: { kind: 'home' | 'villa', item } — llega cuando la persona toca
 * "or by email" en una tarjeta: el formulario se abre con el modo y la
 * propiedad ya elegidos.
 */
export default function RentalInquiryForm({ selected }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('home');
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const startedAt = useRef(null);

  // Ajuste de estado cuando cambia la prop, sin efecto (patrón recomendado por React).
  const [lastSelected, setLastSelected] = useState(null);
  if (selected && selected !== lastSelected) {
    setLastSelected(selected);
    setOpen(true);
    setMode(selected.kind);
    setValues((v) => ({ ...v, property_id: selected.item.id }));
    setErrors({});
  }

  // Medición (no cambia estado): el formulario se abrió desde una tarjeta.
  useEffect(() => {
    if (!selected) return;
    track('form_open', { form_id: FORM_IDS[selected.kind], property_id: selected.item.id, trigger: 'card' });
  }, [selected]);

  const formId = FORM_IDS[mode];
  const list = mode === 'home' ? rentalProperties : villas;
  const propertyName = list.find((p) => p.id === values.property_id)?.name;
  const propertyId = values.property_id || undefined;

  const toggleOpen = () => {
    if (!open) track('form_open', { form_id: formId, trigger: 'toggle' });
    setOpen((isOpen) => !isOpen);
  };

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
    setValues((v) => ({ ...v, property_id: '' })); // la propiedad elegida era del otro tipo
    setErrors({});
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate(mode, values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const { email, whatsapp } = splitContact(values.contact);
    const common = {
      name: values.name, email, whatsapp, message: values.message,
      property_id: values.property_id,
      ref: buildRef(values.property_id), // se calcula al enviar, con los UTM de la sesión
      company: values.company,
    };
    const fields = mode === 'home'
      ? { ...common, move_in: values.move_in, interest: 'long_term_rental' }
      : { ...common, check_in: values.check_in, check_out: values.check_out, guests: values.guests, interest: 'villa_stay' };

    setStatus('sending');
    const result = await submitLead(formId, { ...fields, consent: values.consent }, { startedAt: startedAt.current });
    setStatus(result.ok ? 'done' : 'error');
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <section id="inquire" className="rentals-inquire">
      <Reveal>
        <div className="section-label">Inquire</div>
        <h2>Tell us how you <em>want to stay.</em></h2>
        <div className="gold-rule" />
        <p className="section-intro">
          The easiest way is WhatsApp: Augusto reads every message personally and replies with
          options that fit.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="rentals-wa-block">
          <WhatsAppButton
            className="btn-primary rentals-wa-big"
            message={baseMessage(mode, propertyName)}
            propertyId={propertyId}
            location="final"
          >
            Chat on WhatsApp
          </WhatsAppButton>
          <p className="rentals-wa-note">Opens WhatsApp with your message ready to send.</p>
        </div>

        <div className="rentals-email-alt" id="inquire-email">
          <button
            type="button"
            className="rentals-email-toggle"
            aria-expanded={open}
            aria-controls="inquire-form"
            onClick={toggleOpen}
          >
            Prefer email? <span aria-hidden="true">{open ? '↑' : '→'}</span>
          </button>

          <Expand isOpen={open} paddingTop="1.5rem" paddingBottom="0">
            <div id="inquire-form">
              {status === 'done' ? (
                <div className="rentals-form rentals-form-done" role="status">
                  <h3>Request received.</h3>
                  <p>Augusto will reply personally with options and availability.</p>
                  <p>
                    In a hurry?{' '}
                    <WhatsAppButton
                      className="rentals-link-button"
                      message={fallbackMessage(mode, values, propertyName)}
                      propertyId={propertyId}
                      location="form_done"
                    >
                      Write on WhatsApp
                    </WhatsAppButton>
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

                  {propertyName && (
                    <p className="rentals-form-about">
                      About: <strong>{propertyName}</strong>
                    </p>
                  )}

                  <div className="rentals-form-grid">
                    <Field label="Full name" error={errors.name} id="name">
                      <input id="name" autoComplete="name" value={values.name} onChange={set('name')} />
                    </Field>
                    <Field label="Email or WhatsApp (with country code)" error={errors.contact} id="contact">
                      <input
                        id="contact"
                        inputMode="email"
                        autoCapitalize="none"
                        spellCheck={false}
                        value={values.contact}
                        onChange={set('contact')}
                      />
                    </Field>

                    {mode === 'home' ? (
                      <Field label="Approximate move-in" error={errors.move_in} id="move_in">
                        <input id="move_in" type="month" value={values.move_in} onChange={set('move_in')} />
                      </Field>
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
                      </>
                    )}

                    <Field label="Anything else? (optional)" id="message" wide>
                      <textarea id="message" rows={3} maxLength={1000} value={values.message} onChange={set('message')} />
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
                      <WhatsAppButton
                        className="rentals-link-button"
                        message={fallbackMessage(mode, values, propertyName)}
                        propertyId={propertyId}
                        location="form_error"
                      >
                        send it on WhatsApp
                      </WhatsAppButton>
                      .
                    </div>
                  )}

                  <button type="submit" className="form-submit" disabled={status === 'sending'}>
                    {status === 'sending' ? 'Sending…' : 'Send request →'}
                  </button>
                </form>
              )}
            </div>
          </Expand>
        </div>
      </Reveal>
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
