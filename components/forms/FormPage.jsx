"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { captureAttribution } from '../../lib/utm';

/**
 * Página simple de formulario (/start, /feedback): sin menú ni distracciones,
 * pensada para llegar desde un link (bio de Instagram, correo).
 */
export default function FormPage({ label, title, intro, children }) {
  useEffect(() => {
    captureAttribution();
  }, []);

  return (
    <div className="fp">
      <header className="fp-header">
        <Link href="/" className="fp-logo">
          El Doctor Inmobiliario
          <span>Augusto Lascano · Tulum</span>
        </Link>
      </header>
      <main className="fp-main">
        <div className="section-label">{label}</div>
        <h1 className="fp-title">{title}</h1>
        <div className="gold-rule" />
        {intro && <p className="fp-intro">{intro}</p>}
        {children}
      </main>
      <footer className="fp-footer">
        <span>© El Doctor Inmobiliario</span>
        <a href="/privacy">Privacy notice</a>
      </footer>
    </div>
  );
}

/** Grupo de opciones (radio) con estilo de botones. */
export function Choices({ legend, name, options, value, onChange, error }) {
  return (
    <fieldset className="fp-choices" aria-describedby={error ? `${name}-error` : undefined}>
      <legend>{legend}</legend>
      <div className="fp-choice-list">
        {options.map((option) => (
          <label key={option.value} className={value === option.value ? 'active' : ''}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
      {error && <p className="fp-error" id={`${name}-error`}>{error}</p>}
    </fieldset>
  );
}

export function Field({ label, id, error, children }) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <p className="fp-error" id={`${id}-error`}>{error}</p>}
    </div>
  );
}

/** Campo trampa contra bots: invisible para personas y lectores de pantalla. */
export function Honeypot({ value, onChange }) {
  return (
    <div className="fp-hp" aria-hidden="true">
      <label htmlFor="company">Company</label>
      <input id="company" tabIndex={-1} autoComplete="off" value={value} onChange={onChange} />
    </div>
  );
}
