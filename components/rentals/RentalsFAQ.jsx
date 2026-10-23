"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Reveal from '../Reveal';
import Expand from '../Expand';
import SectionBlend from './SectionBlend';
import { rentalFaq } from '../../data/rentals';

// Solo se muestran las preguntas que ya tienen respuesta de Augusto.
const answered = rentalFaq.filter((item) => item.answer);

export default function RentalsFAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  if (answered.length === 0) return null;

  return (
    <SectionBlend id="faq">
      <Reveal>
        <div className="section-label">Tulum, unfiltered</div>
        <h2>The questions <em>everyone asks.</em></h2>
        <div className="gold-rule" />
      </Reveal>
      <div className="accordion">
        {answered.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div className="accordion-item" key={item.question}>
              <button
                type="button"
                className={`accordion-trigger ${isOpen ? 'active' : ''}`}
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : i)}
              >
                {item.question}
                <motion.span className="accordion-icon" animate={{ rotate: isOpen ? 45 : 0 }}>+</motion.span>
              </button>
              <Expand isOpen={isOpen} paddingTop="0" paddingBottom="0">
                <p className="rentals-faq-answer">{item.answer}</p>
              </Expand>
            </div>
          );
        })}
      </div>
    </SectionBlend>
  );
}
