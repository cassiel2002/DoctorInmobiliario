"use client";

import Image from 'next/image';
import Reveal from '../Reveal';
import { useUI } from '../../context/UIContext';
import { img } from '../../data/images';
import { villas } from '../../data/villas';
import { track } from '../../lib/track';

function VillaCard({ villa, index, onInquire }) {
  const { openGallery } = useUI();
  const hasPhotos = villa.images.length > 0;

  const openPhotos = () => {
    if (!hasPhotos) return;
    track('property_click', { property_id: villa.id, property_type: 'villa', action: 'photos' });
    openGallery(villa.name, villa.images);
  };

  return (
    <Reveal delay={(index % 3) * 0.08}>
      <article className="rental-card villa-card">
        <button
          type="button"
          className="rental-card-media"
          onClick={openPhotos}
          disabled={!hasPhotos}
          aria-label={hasPhotos ? `See photos of ${villa.name}` : `${villa.name}: photos coming soon`}
        >
          {hasPhotos ? (
            <Image
              src={img(villa.images[0])}
              alt={`${villa.name}, ${villa.style.toLowerCase()} villa in Tulum`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <span className="rental-card-placeholder">Photos coming soon</span>
          )}
          {hasPhotos && <span className="rental-card-photos">{villa.images.length} photos</span>}
        </button>

        <div className="rental-card-body">
          <div className="rental-card-zone">{villa.style}</div>
          <h3 className="rental-card-name">{villa.name}</h3>
          <div className="villa-stats">
            <span><strong>{villa.guests}</strong> guests</span>
            <span><strong>{villa.suites}</strong> suites</span>
            <span><strong>{villa.bathrooms}</strong> baths</span>
          </div>
          <p className="villa-summary">{villa.summary}</p>
          <ul className="villa-amenities">
            {villa.amenities.map((item) => <li key={item}>{item}</li>)}
          </ul>
          {villa.services && <p className="villa-services">{villa.services}</p>}
          <div className="villa-tags">
            {villa.goodFor.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
          <button
            type="button"
            className="btn-primary rental-card-cta"
            onClick={() => {
              track('property_click', { property_id: villa.id, property_type: 'villa', action: 'inquire' });
              onInquire(villa);
            }}
          >
            Ask about this villa
          </button>
        </div>
      </article>
    </Reveal>
  );
}

export default function VillasGrid({ onInquire }) {
  return (
    <section id="villas" className="rentals-alt">
      <Reveal>
        <div className="section-label">Short stays, events & groups</div>
        <h2>Villas for <em>the occasions that matter.</em></h2>
        <div className="gold-rule" />
        <p className="section-intro">
          Not staying a year? Fully staffed villas for families, retreats, weddings and celebrations.
          Rates depend on dates and group size — ask and Augusto replies with availability.
        </p>
      </Reveal>

      <div className="rentals-grid">
        {villas.map((villa, i) => (
          <VillaCard key={villa.id} villa={villa} index={i} onInquire={onInquire} />
        ))}
      </div>
    </section>
  );
}
