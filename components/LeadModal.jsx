"use client";

import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useUI } from '../context/UIContext';
import { submitLead } from '../lib/submitLead';
import { trackFormStart } from '../lib/track';

const guideFiles = {
  'Mexico Investment Guide': '/Mexico-Real-Estate-Investment-Guide.pdf',
  'MoXi Mortgage Solutions': '/MoXi-Mortgage-Solutions.pdf',
};

export default function LeadModal() {
  const { leadModal, closeLeadModal } = useUI();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const startedAt = useRef(null);

  const onFieldFocus = () => {
    if (!startedAt.current) startedAt.current = Date.now();
    trackFormStart('guide_download');
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) closeLeadModal();
  };

  const handleSubmit = () => {
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      alert('Please enter your name and a valid email.');
      return;
    }
    if (!consent) {
      setError('We need your consent to send you this guide.');
      return;
    }
    setError('');
    const file = guideFiles[leadModal.guideName];
    if (!file) return;

    // Abrir el PDF inmediatamente (síncrono, evita bloqueadores de popups en móvil)
    const a = document.createElement('a');
    a.href = file;
    a.target = '_blank';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Registrar la descarga en la planilla (no bloquea: el PDF ya se abrió).
    submitLead(
      'guide_download',
      {
        name: name.trim(), email: email.trim(), country: country.trim(), guide: leadModal.guideName,
        interest: 'buy', consent: true,
      },
      { startedAt: startedAt.current }
    );
    startedAt.current = null;

    setSent(true);
    setTimeout(() => {
      closeLeadModal();
      setSent(false);
      setName('');
      setEmail('');
      setCountry('');
      setConsent(false);
      setError('');
    }, 1500);
  };

  return (
    <AnimatePresence>
      {leadModal.open && (
        <motion.div
          className="modal-overlay open"
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="modal-container"
            style={{ maxWidth: 480, height: 'auto', maxHeight: '90vh' }}
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            exit={{ y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="modal-header">
              <span className="modal-title">Access: {leadModal.guideName}</span>
              <button className="modal-close" onClick={closeLeadModal}>✕</button>
            </div>
            <div style={{ padding: '2rem 2rem 2.5rem' }}>
              <p style={{
                fontSize: '0.9rem', color: 'var(--white-dim)', marginBottom: '1.8rem',
                fontFamily: "'Libre Baskerville',serif", lineHeight: 1.7,
              }}>
                Enter your details to open the guide. Augusto may follow up by email if you have questions.
              </p>
              <div className="form-field">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onFocus={onFieldFocus}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onFocus={onFieldFocus}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Country of Residence</label>
                <input
                  type="text"
                  placeholder="United States"
                  value={country}
                  onFocus={onFieldFocus}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
              <label className="rentals-consent" style={{ marginTop: '1rem' }}>
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => {
                    setConsent(e.target.checked);
                    if (e.target.checked) setError('');
                  }}
                />
                <span>
                  I agree that El Doctor Inmobiliario uses my details to send me this guide, as described
                  in the <a href="/privacy" target="_blank" rel="noopener">privacy notice</a>.
                </span>
              </label>
              {error && <p className="rentals-field-error">{error}</p>}
              <button
                className="form-submit"
                style={{
                  marginTop: '1rem',
                  background: sent ? 'rgba(197,160,89,0.3)' : undefined,
                  color: sent ? 'var(--gold)' : undefined,
                }}
                onClick={handleSubmit}
              >
                {sent ? '✓ Guide opened!' : 'Send Me The Guide →'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
