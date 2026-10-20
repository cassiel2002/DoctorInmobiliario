"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { navLinks } from '../data/content';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      style={{ borderBottomColor: scrolled ? 'rgba(197,160,89,0.25)' : 'rgba(197,160,89,0.15)' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="nav-logo">
        El Doctor Inmobiliario
        <span>Augusto Lascano</span>
        <a
          href="https://www.instagram.com/eldoctor.inmobiliario"
          target="_blank"
          rel="noopener"
          className="nav-ig-handle"
        >
          @eldoctor.inmobiliario
        </a>
      </div>
      <ul>
        {navLinks.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
      <motion.a
        href="https://calendly.com/ogostlascan/30min"
        target="_blank"
        rel="noopener"
        className="nav-cta"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.2 }}
      >
        Schedule Call
      </motion.a>
    </motion.nav>
  );
}
