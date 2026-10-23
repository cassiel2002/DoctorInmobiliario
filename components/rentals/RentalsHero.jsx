"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import WhatsAppButton from '../WhatsAppButton';
import { img } from '../../data/images';
import { rentalProperties } from '../../data/rentals';
import { WHATSAPP_MESSAGES } from '../../lib/site';
import { track } from '../../lib/track';

// Botón secundario. Sin propiedades reales de renta anual, lleva a las villas.
const hasHomes = rentalProperties.some((p) => !p.sample);
const seeHref = hasHomes ? '#homes' : '#villas';
const seeLabel = hasHomes ? 'See available homes' : 'See available villas';

export default function RentalsHero() {
  const onCta = (id) => () => track('cta_click', { cta_id: id, cta_location: 'hero' });

  return (
    <section id="hero" className="rentals-hero" style={{ padding: 0 }}>
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className="hero-label">Tulum · Rentals</div>
        <h1>
          <span className="h1-line1">Live in Tulum,</span>
          <span className="h1-line2"> <em>for a year or more.</em></span>
        </h1>
        <p className="hero-sub">
          Homes chosen with a doctor&apos;s eye: we check the house, the street and the
          lease before you see them — so you move in without surprises. Staying shorter? See our villas
          for stays, events and groups.
        </p>
        <div className="gold-rule" />
        <div className="hero-btns">
          <WhatsAppButton className="btn-primary" message={WHATSAPP_MESSAGES.rentals} location="hero">
            Chat on WhatsApp
          </WhatsAppButton>
          <a href={seeHref} className="btn-ghost" onClick={onCta('hero_see_properties')}>{seeLabel}</a>
        </div>
      </motion.div>

      <div className="hero-photo">
        <Image
          src={img('augusto-hero.png')}
          alt="Augusto Lascano – El Doctor Inmobiliario"
          fill
          priority
          sizes="50vw"
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
        />
        <div className="photo-overlay" />
        <div className="photo-credit">Augusto Lascano · El Doctor Inmobiliario</div>
      </div>

      <div className="hero-btns-mobile">
        <WhatsAppButton className="btn-primary" message={WHATSAPP_MESSAGES.rentals} location="hero">
          Chat on WhatsApp
        </WhatsAppButton>
        <a href={seeHref} className="btn-ghost" onClick={onCta('hero_see_properties')}>{seeLabel}</a>
      </div>
    </section>
  );
}
