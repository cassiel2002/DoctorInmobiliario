"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Reveal from './Reveal';
import Expand from './Expand';
import { macroData } from '../data/content';

export default function Macro() {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => setOpenId((cur) => (cur === id ? null : id));

  return (
    <section id="macro">
      <Reveal>
        <div className="section-label">Federal Infrastructure</div>
        <h2>Macro Fundamentals &amp; <em>Regional Growth.</em></h2>
        <div className="gold-rule" />
      </Reveal>
      <div className="macro-grid">
        {macroData.map((item, i) => {
          const isOpen = openId === item.id;
          return (
            <Reveal key={item.id} delay={i * 0.08}>
              <motion.div
                className="macro-card"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <div className="macro-number">
                  {item.number}
                  {item.numberSuffix && <span style={{ fontSize: '1.5rem' }}>{item.numberSuffix}</span>}
                </div>
                <div className="macro-title">{item.title}</div>

                <Expand isOpen={isOpen} className="macro-expandable-motion">
                  <p style={{ fontSize: '1.04rem', color: 'var(--white-muted)', lineHeight: 1.7, margin: 0 }}>
                    {item.text}
                  </p>
                </Expand>

                <motion.button
                  className="macro-link"
                  onClick={() => toggle(item.id)}
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                >
                  {isOpen ? '− ' : '+ '}{item.linkText}
                </motion.button>
              </motion.div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
