"use client";

import Image from 'next/image';
import Reveal from '../Reveal';
import { useUI } from '../../context/UIContext';
import { img } from '../../data/images';
import { rentalProperties } from '../../data/rentals';
import { track } from '../../lib/track';

const mxn = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

function yesNo(value) {
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  return 'To confirm';
}

function RentalCard({ property, index, onInquire }) {
  const { openGallery } = useUI();
  const hasPhotos = property.images.length > 0;

  const facts = [
    ['Bedrooms', property.bedrooms],
    ['Bathrooms', property.bathrooms],
    property.areaM2 ? ['Area', `${property.areaM2} m²`] : null,
    ['Minimum lease', property.minTermMonths ? `${property.minTermMonths} months` : 'To confirm'],
    ['Furnished', yesNo(property.furnished)],
    ['Pets', yesNo(property.petsAllowed)],
    ['Available', property.availableFrom || 'To confirm'],
  ].filter(Boolean);

  const openPhotos = () => {
    if (!hasPhotos) return;
    track('property_click', { property_id: property.id, action: 'photos' });
    openGallery(property.name, property.images);
  };

  return (
    <Reveal delay={index * 0.08}>
      <article className="rental-card">
        <button
          type="button"
          className="rental-card-media"
          onClick={openPhotos}
          disabled={!hasPhotos}
          aria-label={hasPhotos ? `See photos of ${property.name}` : `${property.name}: photos coming soon`}
        >
          {property.cover ? (
            <Image
              src={img(property.cover)}
              alt={`${property.name}, long-term rental in ${property.zone}`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <span className="rental-card-placeholder">Photos coming soon</span>
          )}
          {property.sample && <span className="rental-card-sample">Sample</span>}
          {hasPhotos && <span className="rental-card-photos">{property.images.length} photos</span>}
        </button>

        <div className="rental-card-body">
          <div className="rental-card-zone">{property.zone}</div>
          <h3 className="rental-card-name">{property.name}</h3>
          <div className="rental-card-price">
            MXN {mxn.format(property.monthlyRentMXN)}
            <span> / month</span>
          </div>
          <dl className="rental-card-facts">
            {facts.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <button
            type="button"
            className="btn-primary rental-card-cta"
            onClick={() => {
              track('property_click', { property_id: property.id, action: 'inquire' });
              onInquire(property);
            }}
          >
            Ask about this home
          </button>
        </div>
      </article>
    </Reveal>
  );
}

export default function RentalsGrid({ onInquire }) {
  return (
    <section id="homes">
      <Reveal>
        <div className="section-label">Available now</div>
        <h2>Homes for <em>long-term living.</em></h2>
        <div className="gold-rule" />
        <p className="section-intro">
          Annual leases only. Each home listed here was visited and reviewed before it reached you.
        </p>
      </Reveal>

      <div className="rentals-grid">
        {rentalProperties.map((property, i) => (
          <RentalCard key={property.id} property={property} index={i} onInquire={onInquire} />
        ))}
      </div>
    </section>
  );
}
