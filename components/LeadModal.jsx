"use client";

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useUI } from '../context/UIContext';

const guideFiles = {
  'Mexico Investment Guide': '/Mexico-Real-Estate-Investment-Guide.pdf',
  'MoXi Mortgage Solutions': '/MoXi-Mortgage-Solutions.pdf',
};

export default function LeadModal() {
  const { leadModal, closeLeadModal } = useUI();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [sent, setSent] = useState(false);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) closeLeadModal();
  };

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) {
      alert('Please enter your name and email.');
      return;
    }
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

    setSent(true);
    setTimeout(() => {
      closeLeadModal();
      setSent(false);
      setName('');
      setEmail('');
      setCountry('');
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
                Enter your details and we&apos;ll send the guide directly to your inbox.
              </p>
              <div className="form-field">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Country of Residence</label>
                <input
                  type="text"
                  placeholder="United States"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
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
              <p style={{
                fontSize: '0.7rem', color: 'var(--white-muted)', marginTop: '1rem',
                textAlign: 'center', letterSpacing: '0.05em',
              }}>
                No spam. Your information is strictly confidential.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
