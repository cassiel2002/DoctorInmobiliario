"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Reveal from './Reveal';
import Expand from './Expand';
import { resilienceData } from '../data/content';

export default function Resilience() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="resilience">
      <Reveal>
        <div className="section-label">Risk Management</div>
        <h2>Strategic Resilience: <em>The Honest Edge.</em></h2>
        <div className="gold-rule" />
        <p className="section-intro">
          We address every market objection with data — not marketing language.
          Click the concern that matters to you.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="accordion">
          {resilienceData.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div className="accordion-item" key={item.title}>
                <motion.button
                  className={`accordion-trigger ${isOpen ? 'active' : ''}`}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  whileTap={{ scale: 0.985 }}
                  transition={{ duration: 0.15 }}
                >
                  {item.title}
                  <motion.span
                    className="accordion-icon"
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    +
                  </motion.span>
                </motion.button>
                <Expand isOpen={isOpen} paddingTop="0" paddingBottom="0">
                  <span style={{ fontSize: '1.02rem', color: 'var(--white-dim)', lineHeight: 1.8, display: 'block', padding: '0 2rem 1.5rem' }}>
                    {item.text}
                  </span>
                </Expand>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
