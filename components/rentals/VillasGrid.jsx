"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Reveal from '../Reveal';
import Expand from '../Expand';
import SectionBlend from './SectionBlend';
import WhatsAppButton from '../WhatsAppButton';
import { useUI } from '../../context/UIContext';
import { img } from '../../data/images';
import { villas } from '../../data/villas';
import { interestMessage } from '../../lib/site';
import { track } from '../../lib/track';

// Las primeras villas (en el orden de la descripción de Augusto) se muestran
// como portadas a todo el ancho; el resto queda en la pestaña "More properties".
const FEATURED_COUNT = 3;
const featuredVillas = villas.slice(0, FEATURED_COUNT);
const moreVillas = villas.slice(FEATURED_COUNT);

function VillaStats({ villa }) {
  return (
    <div className="villa-stats">
      <span><strong>{villa.guests}</strong> guests</span>
      <span><strong>{villa.suites}</strong> suites</span>
      <span><strong>{villa.bathrooms}</strong> baths</span>
    </div>
  );
}

function VillaDetails({ villa, onInquire }) {
  return (
    <>
      <p className="villa-summary">{villa.summary}</p>
      <ul className="villa-amenities">
        {villa.amenities.map((item) => <li key={item}>{item}</li>)}
      </ul>
      {villa.services && <p className="villa-services">{villa.services}</p>}
      <div className="villa-tags">
        {villa.goodFor.map((tag) => <span key={tag}>{tag}</span>)}
      </div>
      <WhatsAppButton
        className="btn-primary villa-cta"
        message={interestMessage(villa.name)}
        propertyId={villa.id}
        location="card"
      >
        Ask on WhatsApp
      </WhatsAppButton>
      <p className="villa-email">
        or{' '}
        <button
          type="button"
          className="rentals-link-button"
          onClick={() => {
            track('property_click', { property_id: villa.id, property_type: 'villa', action: 'inquire_email' });
            onInquire(villa);
          }}
        >
          by email
        </button>
      </p>
    </>
  );
}

/** Foto de la villa: botón que abre la galería, o aviso si todavía no hay fotos. */
function VillaMedia({ villa, className, sizes }) {
  const { openGallery } = useUI();
  const hasPhotos = villa.images.length > 0;

  const openPhotos = () => {
    if (!hasPhotos) return;
    track('property_click', { property_id: villa.id, property_type: 'villa', action: 'photos' });
    openGallery(villa.name, villa.images);
  };

  return (
    <button
      type="button"
      className={className}
      onClick={openPhotos}
      disabled={!hasPhotos}
      aria-label={hasPhotos ? `See ${villa.images.length} photos of ${villa.name}` : `${villa.name}: photos coming soon`}
    >
      {hasPhotos ? (
        <Image
          src={img(villa.images[0])}
          alt={`${villa.name}, ${villa.style.toLowerCase()} villa in Tulum`}
          fill
          sizes={sizes}
          style={{ objectFit: 'cover' }}
        />
      ) : (
        <span className="rental-card-placeholder">Photos coming soon</span>
      )}
      {hasPhotos && <span className="rental-card-photos">{villa.images.length} photos</span>}
    </button>
  );
}

/** Portada grande a todo el ancho, con el nombre y los datos sobre la foto. */
function FeaturedVilla({ villa, onInquire }) {
  return (
    <Reveal>
      <article className="villa-feature">
        <div className="villa-feature-cover">
          <VillaMedia villa={villa} className="villa-feature-media" sizes="(max-width: 768px) 100vw, 1200px" />
          <div className="villa-feature-caption">
            <div className="villa-feature-style">{villa.style}</div>
            <h3 className="villa-feature-name">{villa.name}</h3>
            <VillaStats villa={villa} />
          </div>
        </div>
        <div className="villa-feature-body">
          <VillaDetails villa={villa} onInquire={onInquire} />
        </div>
      </article>
    </Reveal>
  );
}

/** Fila horizontal: foto a la izquierda, descripción a la derecha. */
function VillaRow({ villa, onInquire }) {
  return (
    <article className="villa-row">
      <VillaMedia villa={villa} className="villa-row-media" sizes="(max-width: 768px) 100vw, 40vw" />
      <div className="villa-row-body">
        <div className="rental-card-zone">{villa.style}</div>
        <h3 className="rental-card-name">{villa.name}</h3>
        <VillaStats villa={villa} />
        <VillaDetails villa={villa} onInquire={onInquire} />
      </div>
    </article>
  );
}

export default function VillasGrid({ onInquire }) {
  const [moreOpen, setMoreOpen] = useState(false);

  const toggleMore = () => {
    track('cta_click', { cta_id: moreOpen ? 'villas_less' : 'villas_more', cta_location: 'villas' });
    setMoreOpen((open) => !open);
  };

  return (
    <SectionBlend id="villas">
      <Reveal>
        <div className="section-label">Short stays, events & groups</div>
        <h2>Villas for <em>the occasions that matter.</em></h2>
        <div className="gold-rule" />
        <p className="section-intro">
          Not staying a year? Fully staffed villas for families, retreats, weddings and celebrations.
          Rates depend on dates and group size — ask and Augusto replies with availability.
        </p>
      </Reveal>

      <div className="villa-features">
        {featuredVillas.map((villa) => (
          <FeaturedVilla key={villa.id} villa={villa} onInquire={onInquire} />
        ))}
      </div>

      {moreVillas.length > 0 && (
        <div className="villas-more">
          <button
            type="button"
            className="villas-more-toggle"
            aria-expanded={moreOpen}
            aria-controls="villas-more-panel"
            onClick={toggleMore}
          >
            <span>{moreOpen ? 'Fewer properties' : 'More properties'}</span>
            <span className="villas-more-count">{moreVillas.length}</span>
            <motion.span className="villas-more-icon" aria-hidden="true" animate={{ rotate: moreOpen ? 45 : 0 }}>+</motion.span>
          </button>

          <Expand isOpen={moreOpen} paddingTop="1.5rem" paddingBottom="0">
            <div id="villas-more-panel" className="villas-more-list">
              {moreVillas.map((villa) => (
                <VillaRow key={villa.id} villa={villa} onInquire={onInquire} />
              ))}
            </div>
          </Expand>
        </div>
      )}
    </SectionBlend>
  );
}
