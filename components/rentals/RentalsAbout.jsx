"use client";

import Image from 'next/image';
import Reveal from '../Reveal';
import { img } from '../../data/images';

// Solo datos publicados por Augusto en el sitio. AMPI y CONOCER se agregan
// cuando estén los comprobantes.
export default function RentalsAbout() {
  return (
    <section id="about" className="rentals-about">
      <Reveal direction="left" className="rentals-about-photo">
        <Image
          src={img('augusto-aboutme.jpeg')}
          alt="Augusto Lascano"
          fill
          sizes="(max-width: 768px) 100vw, 40vw"
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
        />
      </Reveal>
      <Reveal direction="right">
        <div className="section-label">Who you will deal with</div>
        <h2>From ophthalmologist <em>to advisor.</em></h2>
        <div className="gold-rule" />
        <p className="section-intro">
          Augusto Lascano trained as an ophthalmologist. Five years ago he arrived in Quintana Roo
          on vacation with his wife and stayed. Today he applies the same habit — listen first,
          diagnose before recommending — to the homes he rents and sells in Tulum.
        </p>
      </Reveal>
    </section>
  );
}
