"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Reveal from './Reveal';
import { useUI } from '../context/UIContext';

// Miniatura oficial de YouTube para el video (siempre coincide con el video real).
const VIDEO_THUMBNAIL = 'https://i.ytimg.com/vi/EDm29GCcy0A/maxresdefault.jpg';

export default function Truth() {
  const { openVideoModal } = useUI();
  const sectionRef = useRef(null);
  const [autoPlayed, setAutoPlayed] = useState(false);

  // Autoplay del video al hacer scroll (solo desktop), igual que el original
  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth <= 768) return;
    const el = sectionRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !autoPlayed) {
            setAutoPlayed(true);
            setTimeout(() => openVideoModal(), 1500);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.6 }
    );
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="truth" ref={sectionRef}>
      <div className="truth-inner">
        <Reveal direction="left">
          <div className="section-label">Transparency</div>
          <h2>Real Market <em>Intelligence.</em></h2>
          <div className="gold-rule" />
          <p className="section-intro">
            Addressing market complexities through a transparent, institutional lens.
            We prioritize capital preservation in every asset.
          </p>
        </Reveal>
        <Reveal direction="right">
          <div className="video-wrapper">
            <div className="video-frame desktop-only" onClick={openVideoModal}>
              <Image
                src={VIDEO_THUMBNAIL}
                alt="The Truth About Tulum: Risks & Opportunities – video preview"
                fill
                sizes="50vw"
                style={{ objectFit: 'cover' }}
              />
              <div className="video-frame-overlay" />
              <div className="play-btn" />
              <div className="video-label">The Truth About Tulum: Risks &amp; Opportunities · 60 sec</div>
            </div>
            <div className="video-inline mobile-only">
              <iframe
                src="https://www.youtube.com/embed/EDm29GCcy0A?playsinline=1&rel=0&modestbranding=1"
                title="The Truth About Tulum"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                playsInline
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
