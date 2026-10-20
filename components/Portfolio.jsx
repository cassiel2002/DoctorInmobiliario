"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Reveal from './Reveal';
import { portfolioData } from '../data/content';
import { img } from '../data/images';

function PropertyCard({ property, index }) {
  const [carouselMode, setCarouselMode] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [fading, setFading] = useState(false);

  // Precarga todas las fotos de la propiedad apenas se abre el carrusel,
  // así al navegar con las flechas la imagen ya está en caché del navegador
  // y aparece al instante en vez de mostrar el fondo vacío mientras carga.
  useEffect(() => {
    if (!carouselMode) return;
    property.images.forEach((filename) => {
      const preloadImg = new window.Image();
      preloadImg.src = img(filename);
    });
  }, [carouselMode, property.images]);

  const goTo = (idx) => {
    setFading(true);
    setTimeout(() => {
      setImgIndex(idx);
      setFading(false);
    }, 400);
  };

  const handleOpen = () => {
    if (carouselMode) return;
    setCarouselMode(true);
    setImgIndex(0);
  };

  const handleClose = () => {
    setFading(true);
    setTimeout(() => {
      setCarouselMode(false);
      setImgIndex(0);
      setFading(false);
    }, 400);
  };

  const move = (dir, e) => {
    e.stopPropagation();
    const total = property.images.length;
    goTo((imgIndex + dir + total) % total);
  };

  const currentSrc = carouselMode ? img(property.images[imgIndex]) : img(property.cover);

  return (
    <Reveal delay={index * 0.08}>
      <div className="prop-card">
        <div
          className={`prop-img-area ${carouselMode ? 'carousel-mode' : ''}`}
          onClick={handleOpen}
        >
          <Image
            key={currentSrc}
            className="prop-main-img"
            src={currentSrc}
            alt={`${property.name} – ${property.location} investment property`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={index === 0}
            style={{
              objectFit: 'cover',
              opacity: fading ? 0 : 1,
              objectPosition: property.coverPosition || 'center center',
            }}
          />
          <div className="prop-type-badge">{property.badge}</div>

          {carouselMode && (
            <div className="carousel-controls" style={{ display: 'block' }}>
              <button className="car-arrow car-prev" onClick={(e) => move(-1, e)}>&#8249;</button>
              <button className="car-arrow car-next" onClick={(e) => move(1, e)}>&#8250;</button>
              <div className="car-dots">
                {property.images.map((_, i) => (
                  <button
                    key={i}
                    className={`car-dot ${i === imgIndex ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); goTo(i); }}
                  />
                ))}
              </div>
              <div className="car-counter">{imgIndex + 1} / {property.images.length}</div>
            </div>
          )}

          {!carouselMode && (
            <div className="prop-cover-cta">
              <div className="prop-cover-name">{property.name}</div>
              <div className="prop-cover-sub">{property.location}</div>
              <button
                className="prop-cover-btn"
                onClick={(e) => { e.stopPropagation(); handleOpen(); }}
              >
                + More Photos
              </button>
            </div>
          )}
        </div>

        <div className={`prop-body ${carouselMode ? 'visible' : ''}`}>
          <div className="prop-name">{property.name}</div>
          <div className="prop-location">{property.location}</div>
          <div className="prop-profit-label">Annual Net Profit</div>
          <div className="prop-profit-value">{property.profit}</div>
          <div className="prop-btns">
            <button
              className="prop-gallery-btn"
              style={{ width: '100%' }}
              onClick={handleClose}
            >
              ✕ Close Gallery
            </button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function Portfolio() {
  const gridRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const total = portfolioData.length;

  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth > 768) return;
    const grid = gridRef.current;
    if (!grid) return;
    const onScroll = () => {
      const cards = grid.querySelectorAll('.prop-card');
      const cardWidth = cards[0] ? cards[0].offsetWidth : window.innerWidth;
      setCurrentPage(Math.round(grid.scrollLeft / cardWidth));
    };
    grid.addEventListener('scroll', onScroll, { passive: true });
    return () => grid.removeEventListener('scroll', onScroll);
  }, []);

  const portNav = (dir) => {
    const grid = gridRef.current;
    if (!grid) return;
    const next = Math.max(0, Math.min(total - 1, currentPage + dir));
    const cards = grid.querySelectorAll('.prop-card');
    const target = cards[next];
    if (target) grid.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
    setCurrentPage(next);
  };

  return (
    <section id="portfolio">
      <Reveal>
        <div className="section-label">Curated Portfolio</div>
        <h2>Investment-Grade <em>Assets.</em></h2>
        <div className="gold-rule" />
        <p className="section-intro">Every opportunity has cleared our 5-point due diligence audit.</p>
      </Reveal>

      <div className="portfolio-grid" ref={gridRef}>
        {portfolioData.map((property, i) => (
          <PropertyCard property={property} index={i} key={property.id} />
        ))}
      </div>

      {/* Mobile portfolio nav — hidden on desktop, shown via CSS media query on mobile */}
      <div className="portfolio-mobile-nav" style={{ display: 'none' }}>
        <button className="port-arrow" onClick={() => portNav(-1)}>&#8249;</button>
        <span className="port-page-indicator">{currentPage + 1} / {total}</span>
        <button className="port-arrow" onClick={() => portNav(1)}>&#8250;</button>
      </div>
    </section>
  );
}
