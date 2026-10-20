"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useUI } from '../context/UIContext';
import { img } from '../data/images';

export default function Hero() {
  const { toggleAboutMe } = useUI();

  return (
    <section id="hero" style={{ padding: 0 }}>
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className="hero-label">Mexican Caribbean · Tulum</div>
        <h1>
          <span className="h1-line1">Strategic Capital Allocation</span>
          <span className="h1-line2"> in the <em>Mexican Caribbean.</em></span>
        </h1>
        <p className="hero-sub">
          Institutional-grade real estate intelligence for the discerning global investor.
          We navigate Tulum&apos;s complexity through a rigorous fiduciary lens.
        </p>
        <div className="gold-rule" />
        <div className="hero-btns">
          <a
            href="https://calendly.com/ogostlascan/30min"
            target="_blank"
            rel="noopener"
            className="btn-primary"
          >
            Schedule Strategy Call
          </a>
          <button className="btn-ghost" onClick={toggleAboutMe}>About Me</button>
        </div>
      </motion.div>

      <div className="hero-photo">
        <Image
          src={img('augusto-hero.png')}
          alt="Augusto Lascano – El Doctor Inmobiliario"
          fill
          priority
          sizes="50vw"
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
        />
        <div className="photo-overlay" />
        <motion.div
          className="hero-roi-overlay"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          <div className="hero-roi-pct">7–12%</div>
          <div className="hero-roi-label">Stabilized ROI</div>
          <div className="hero-roi-sub">on Curated Assets</div>
        </motion.div>
        <div className="photo-credit">Augusto Lascano · El Doctor Inmobiliario</div>
      </div>

      {/* Mobile-only buttons below photo */}
      <div className="hero-btns-mobile">
        <a
          href="https://calendly.com/ogostlascan/30min"
          target="_blank"
          rel="noopener"
          className="btn-primary"
        >
          Schedule Strategy Call
        </a>
        <button className="btn-ghost" onClick={toggleAboutMe}>About Me</button>
      </div>
    </section>
  );
}
