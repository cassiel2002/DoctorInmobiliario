"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Reveal from './Reveal';
import { enclavesData } from '../data/content';
import { useUI } from '../context/UIContext';
import { img } from '../data/images';

export default function Enclaves() {
  const { openEnclave } = useUI();
  const gridRef = useRef(null);
  const [activeDot, setActiveDot] = useState(0);
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || !isMobile) return;
    const onScroll = () => {
      const card = grid.querySelector('.enclave-card');
      const cardWidth = card ? card.offsetWidth + 12.8 : window.innerWidth;
      const idx = Math.round(grid.scrollLeft / cardWidth);
      setActiveDot(Math.min(idx, enclavesData.length - 1));
    };
    grid.addEventListener('scroll', onScroll, { passive: true });
    return () => grid.removeEventListener('scroll', onScroll);
  }, [isMobile]);

  const scrollToIndex = (idx) => {
    const grid = gridRef.current;
    if (!grid) return;
    const card = grid.querySelectorAll('.enclave-card')[idx];
    if (card) grid.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
  };

  return (
    <section id="enclaves">
      <Reveal>
        <div className="section-label">Strategic Enclaves</div>
        <h2>High-Performance <em>Locations.</em></h2>
        <div className="gold-rule" />
        <p className="section-intro">
          We only present communities that meet our strict criteria for infrastructure autonomy
          and title security.
        </p>
      </Reveal>

      <div className="enclaves-grid" ref={gridRef}>
        {enclavesData.map((enclave, i) => (
          <Reveal key={enclave.name} delay={i * 0.06} amount={0.15}>
            <div
              className="enclave-card"
              onClick={() => openEnclave(enclave.name, enclave.url)}
            >
              <Image
                className="enclave-img"
                src={img(enclave.img)}
                alt={`${enclave.name} – ${enclave.tag} in Tulum`}
                fill
                sizes="(max-width: 768px) 85vw, 33vw"
                style={{ objectFit: 'cover', objectPosition: 'center center' }}
              />
              <div className="enclave-overlay">
                <div className="enclave-name">{enclave.name}</div>
                <div className="enclave-tag">{enclave.tag}</div>
                <button
                  className="enclave-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEnclave(enclave.name, enclave.url);
                  }}
                >
                  Access Technical Thesis
                </button>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Carousel hint - mobile only */}
      <div className="carousel-hint">
        <div className="carousel-hint-arrow">&#8249;</div>
        <span className="carousel-hint-text">Swipe to explore</span>
        <div className="carousel-hint-arrow">&#8250;</div>
      </div>

      <div className="carousel-dots">
        {enclavesData.map((enclave, i) => (
          <button
            key={enclave.name}
            className={`carousel-dot ${activeDot === i ? 'active' : ''}`}
            onClick={() => scrollToIndex(i)}
            aria-label={`Go to ${enclave.name}`}
          />
        ))}
      </div>
    </section>
  );
}
