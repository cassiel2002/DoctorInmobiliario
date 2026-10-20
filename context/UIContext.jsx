"use client";

import { createContext, useCallback, useContext, useRef, useState } from 'react';

/**
 * UIContext centraliza el estado de todos los modales / paneles
 * que en el HTML original se manejaban con funciones globales
 * (openModal, openVideoModal, openPDF, openGallery, openEnclave,
 * openLeadModal, toggleAboutMe, etc).
 */
const UIContext = createContext(null);

export function UIProvider({ children }) {
  const savedScrollY = useRef(0);

  // Modal genérico (video / PDF credenciales)
  const [modal, setModal] = useState({ open: false, title: '', src: '' });

  // Galería de fotos de propiedades del portfolio
  const [gallery, setGallery] = useState({ open: false, title: '', images: [], index: 0 });

  // Lightbox de enclaves (Gamma embed)
  const [enclave, setEnclave] = useState({ open: false, title: '', url: '' });

  // Modal de captura de lead (descarga de guías)
  const [leadModal, setLeadModal] = useState({ open: false, guideName: '' });

  // Panel "About Me"
  const [aboutMeOpen, setAboutMeOpen] = useState(false);

  const lockScroll = useCallback(() => {
    savedScrollY.current = window.scrollY;
    document.body.style.overflow = 'hidden';
  }, []);

  const unlockScroll = useCallback(() => {
    document.body.style.overflow = '';
  }, []);

  const openModal = useCallback((title, src) => {
    lockScroll();
    setModal({ open: true, title, src });
  }, [lockScroll]);

  const closeModal = useCallback(() => {
    setModal((m) => ({ ...m, open: false }));
    unlockScroll();
    window.scrollTo(0, savedScrollY.current);
  }, [unlockScroll]);

  const openVideoModal = useCallback(() => {
    openModal(
      'The Truth About Tulum: Risks & Opportunities',
      'https://www.youtube.com/embed/EDm29GCcy0A?autoplay=1&rel=0&modestbranding=1'
    );
  }, [openModal]);

  const openPDF = useCallback(() => {
    openModal(
      'Professional Credentials — Augusto Lascano · CONOCER · Gobierno de México',
      'credencial-augusto-lascano.pdf'
    );
  }, [openModal]);

  const openGallery = useCallback((title, images) => {
    lockScroll();
    setGallery({ open: true, title, images, index: 0 });
  }, [lockScroll]);

  const setGalleryIndex = useCallback((index) => {
    setGallery((g) => ({ ...g, index }));
  }, []);

  const closeGallery = useCallback(() => {
    setGallery((g) => ({ ...g, open: false }));
    unlockScroll();
  }, [unlockScroll]);

  const openEnclave = useCallback((title, url) => {
    lockScroll();
    setEnclave({ open: true, title, url });
  }, [lockScroll]);

  const closeEnclave = useCallback(() => {
    setEnclave({ open: false, title: '', url: '' });
    unlockScroll();
  }, [unlockScroll]);

  const openLeadModal = useCallback((guideName) => {
    lockScroll();
    setLeadModal({ open: true, guideName });
  }, [lockScroll]);

  const closeLeadModal = useCallback(() => {
    setLeadModal((m) => ({ ...m, open: false }));
    unlockScroll();
  }, [unlockScroll]);

  const toggleAboutMe = useCallback(() => {
    setAboutMeOpen((open) => !open);
  }, []);

  const closeAboutMe = useCallback(() => setAboutMeOpen(false), []);

  const value = {
    modal, openModal, closeModal, openVideoModal, openPDF,
    gallery, openGallery, setGalleryIndex, closeGallery,
    enclave, openEnclave, closeEnclave,
    leadModal, openLeadModal, closeLeadModal,
    aboutMeOpen, toggleAboutMe, closeAboutMe,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
}
