"use client";

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useUI } from '../context/UIContext';
import { img } from '../data/images';

export default function GalleryModal() {
  const { gallery, setGalleryIndex, closeGallery } = useUI();

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
            <div className="gallery-main-img-wrap">
              <Image
                src={img(gallery.images[gallery.index])}
                alt={`${gallery.title} – photo ${gallery.index + 1} of ${gallery.images.length}`}
                fill
                sizes="90vw"
                style={{ objectFit: 'cover' }}
              />
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
