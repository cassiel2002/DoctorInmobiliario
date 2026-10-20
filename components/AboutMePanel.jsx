"use client";

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useUI } from '../context/UIContext';
import { aboutCredentials, aboutPillars } from '../data/content';
import { img } from '../data/images';

export default function AboutMePanel() {
  const { aboutMeOpen, toggleAboutMe, closeAboutMe, openPDF } = useUI();

  return (
    <AnimatePresence initial={false}>
      {aboutMeOpen && (
        <motion.div
          id="about-me-panel"
          className="about-panel open"
          style={{ maxHeight: 'none', overflow: 'visible' }}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="about-panel-inner">
            <div className="about-close-row">
              <button className="about-close-btn" onClick={toggleAboutMe}>✕ Close</button>
            </div>

            <div className="about-grid">
              {/* Left: photo + credentials */}
              <div className="about-left">
                <div className="about-photo-wrap">
                  <Image
                    src={img('augusto-aboutme.jpeg')}
                    alt="Augusto Lascano – El Doctor Inmobiliario"
                    fill
                    sizes="340px"
                    className="about-photo"
                    style={{ objectFit: 'cover', objectPosition: 'center top' }}
                  />
                  <div className="about-photo-overlay" />
                </div>
                <div className="about-credentials">
                  {aboutCredentials.map((cred) => (
                    <div className="about-cred-item" key={cred}>
                      <span className="about-cred-icon">◈</span>
                      <span>{cred}</span>
                    </div>
                  ))}
                  <button
                    className="btn-ghost"
                    style={{ marginTop: '1.5rem', fontSize: '0.82rem' }}
                    onClick={openPDF}
                  >
                    View Credentials →
                  </button>
                </div>
              </div>

              {/* Right: bio content */}
              <div className="about-right">
                <div className="about-block">
                  <div className="about-block-label">01 · Who I Am</div>
                  <h3 className="about-block-title">Precision <em>Diagnostics</em></h3>
                  <p className="about-block-text">
                    My international professional career began in medicine as a Board-Certified
                    Ophthalmologist. For years, my work was defined by rigorous listening and
                    precise diagnostics to restore clarity to my patients.
                  </p>
                  <p className="about-block-text">
                    Today, I apply that same clinical ethics of honesty and surgical rigor to
                    diagnose the health of your investments. I don&apos;t just look at properties
                    — I analyze the financial anatomy and legal security of every asset.
                  </p>
                </div>

                <div className="about-divider" />

                <div className="about-block">
                  <div className="about-block-label">02 · Where I Come From</div>
                  <h3 className="about-block-title">The Strategic <em>Pivot</em></h3>
                  <p className="about-block-text">
                    Five years ago, my wife and I arrived in Quintana Roo for a vacation before
                    heading to Europe. The potential of this region captured my attention through
                    a scientific lens.
                  </p>
                  <p className="about-block-text">
                    I identified a booming market that lacked the transparency and certainty that
                    serious investors demand. I chose to become certified and merge my professional
                    ability to build trust with the local real estate dynamics — successfully
                    closing numerous operations based on total honesty.
                  </p>
                </div>

                <div className="about-divider" />

                <div className="about-block">
                  <div className="about-block-label">03 · Where We Are Going</div>
                  <h3 className="about-block-title">The 2026 <em>Vision</em></h3>
                  <div className="about-pillars">
                    {aboutPillars.map((pillar) => (
                      <div className="about-pillar" key={pillar.name}>
                        <div className="about-pillar-icon">⬡</div>
                        <div className="about-pillar-name">{pillar.name}</div>
                        <div className="about-pillar-desc">{pillar.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="about-thesis">
                  <div className="about-thesis-mark">&quot;</div>
                  <p className="about-thesis-text">
                    Honesty is the foundation of any prosperous operation. Whether in the operating
                    room or in Real Estate, the right diagnosis changes everything.
                  </p>
                  <div className="about-thesis-author">— Augusto Lascano · El Doctor Inmobiliario</div>
                </div>

                <a
                  href="#cta"
                  className="btn-primary"
                  style={{ display: 'inline-block', marginTop: '2rem', fontSize: '0.78rem' }}
                  onClick={closeAboutMe}
                >
                  Request a Portfolio Diagnosis →
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
