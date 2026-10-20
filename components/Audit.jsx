"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Reveal from './Reveal';
import Expand from './Expand';
import { auditData } from '../data/content';

export default function Audit() {
  const [openId, setOpenId] = useState(null);

  return (
    <section id="audit">
      <Reveal>
        <div className="section-label">Due Diligence</div>
        <h2>A Fiduciary Approach <em>to Risk.</em></h2>
        <div className="gold-rule" />
        <p className="section-intro">
          Every asset in our portfolio has cleared five non-negotiable checkpoints before it
          reaches your desk.
        </p>
      </Reveal>

      <div className="audit-grid">
        {auditData.map((point, i) => {
          const isOpen = openId === point.id;
          const isLast = i === auditData.length - 1;
          return (
            <Reveal key={point.id} delay={i * 0.06} amount={0.15}>
              <div className="audit-point" style={isLast ? { borderRight: 'none' } : undefined}>
                <span className="due-num-style">{point.num}</span>
                <div className="due-icon-wrap">
                  <svg viewBox="0 0 24 24" strokeWidth="1.5" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d={point.icon} />
                  </svg>
                </div>
                <div className="audit-point-name">{point.name}</div>

                <Expand isOpen={isOpen} paddingTop="0.8rem" paddingBottom="0">
                  <span style={{ fontSize: '1.08rem', color: 'var(--white-muted)', lineHeight: 1.8 }}>
                    {point.text}
                  </span>
                </Expand>

                <motion.button
                  className={`audit-toggle ${isOpen ? 'active' : ''}`}
                  onClick={() => setOpenId(isOpen ? null : point.id)}
                  whileTap={{ scale: 0.9 }}
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  +
                </motion.button>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Carousel hint - mobile only */}
      <div className="carousel-hint">
        <div className="carousel-hint-arrow">&#8249;</div>
        <span className="carousel-hint-text">Swipe all 5 points</span>
        <div className="carousel-hint-arrow">&#8250;</div>
      </div>
    </section>
  );
}
