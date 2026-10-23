"use client";

import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useUI } from '../context/UIContext';
import { img } from '../data/images';

export default function GalleryModal() {
  const { gallery, setGalleryIndex, closeGallery } = useUI();
  const reduceMotion = useReducedMotion();

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) closeGallery();
  };

  return (
    <AnimatePresence>
      {gallery.open && (
        <motion.div
          className="gallery-modal-overlay open"
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="gallery-modal"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            exit={{ y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="gallery-header">
              <span className="gallery-title">{gallery.title}</span>
              <button className="gallery-close" onClick={closeGallery}>✕</button>
            </div>
            {/* Todas las fotos se montan apiladas al abrir la galería: el navegador las
                descarga en paralelo y al tocar una miniatura ya está lista. Antes se
                cargaba una sola imagen y se reemplazaba, por eso cada clic esperaba la
                descarga. El cambio es un fundido entre fotos (Framer Motion). */}
            <div className="gallery-main-img-wrap">
              {gallery.images.map((src, i) => {
                const active = i === gallery.index;
                return (
                  <motion.div
                    key={src}
                    aria-hidden={!active}
                    style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
                    initial={false}
                    animate={{ opacity: active ? 1 : 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.35, ease: 'easeOut' }}
                  >
                    <Image
                      src={img(src)}
                      alt={active ? `${gallery.title} – photo ${i + 1} of ${gallery.images.length}` : ''}
                      fill
                      sizes="(max-width: 1111px) 90vw, 1000px"
                      fetchPriority={active ? 'high' : 'auto'}
                      style={{ objectFit: 'cover' }}
                    />
                  </motion.div>
                );
              })}
            </div>
            <div className="gallery-thumbs">
              {gallery.images.map((src, i) => (
                <div
                  key={src}
                  className={`gallery-thumb ${i === gallery.index ? 'active' : ''}`}
                  onClick={() => setGalleryIndex(i)}
                >
                  <Image
                    src={img(src)}
                    alt=""
                    fill
                    sizes="100px"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
            <div className="gallery-counter">
              {gallery.images.length ? `${gallery.index + 1} / ${gallery.images.length}` : ''}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
