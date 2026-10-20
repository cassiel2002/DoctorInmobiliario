"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { navLinks as salesNavLinks } from '../data/content';
import { CALENDLY_URL, INSTAGRAM_URL } from '../lib/site';
import { track } from '../lib/track';

const DEFAULT_CTA = { href: CALENDLY_URL, label: 'Schedule Call', external: true, id: 'nav_schedule_call' };

/**
 * links:     anclas del menú de la página
 * cta:       botón principal { href, label, external, id }
 * crossLink: botón para cambiar entre ventas y rentas { href, label, id }
 */
export default function Nav({ links = salesNavLinks, cta = DEFAULT_CTA, crossLink }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      className={crossLink ? 'has-cross' : undefined}
      style={{ borderBottomColor: scrolled ? 'rgba(197,160,89,0.25)' : 'rgba(197,160,89,0.15)' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="nav-logo">
        El Doctor Inmobiliario
        <span>Augusto Lascano</span>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener" className="nav-ig-handle">
          @eldoctor.inmobiliario
        </a>
      </div>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
      <div className="nav-actions">
        {crossLink && (
          <a
            href={crossLink.href}
            className="nav-cross"
            onClick={() => track('cta_click', { cta_id: crossLink.id, cta_location: 'nav' })}
          >
            {crossLink.label}
          </a>
        )}
        <motion.a
          href={cta.href}
          {...(cta.external ? { target: '_blank', rel: 'noopener' } : {})}
          className="nav-cta"
          onClick={() => track('cta_click', { cta_id: cta.id, cta_location: 'nav' })}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.2 }}
        >
          {cta.label}
        </motion.a>
      </div>
    </motion.nav>
  );
}
