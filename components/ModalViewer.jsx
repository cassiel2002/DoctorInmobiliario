"use client";

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useUI } from '../context/UIContext';

export default function ModalViewer() {
  const { modal, closeModal } = useUI();
  const [loading, setLoading] = useState(true);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) closeModal();
  };

  return (
    <AnimatePresence>
      {modal.open && (
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
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            exit={{ y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="modal-header">
              <span className="modal-title">{modal.title}</span>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-iframe-wrap">
              {loading && <div className="modal-loading">Loading content…</div>}
              <iframe
                key={modal.src}
                src={modal.src}
                title={modal.title}
                style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                allow="autoplay; fullscreen; picture-in-picture"
                onLoad={() => setLoading(false)}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
