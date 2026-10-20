"use client";

import Image from 'next/image';
import Reveal from './Reveal';
import { img } from '../data/images';

export default function CTA() {
  return (
    <section id="cta" style={{ padding: 0 }}>
      <div className="cta-img-area">
        <Image
          src={img('apretonmanos.png')}
          alt="Private Investment Briefing – Schedule a strategy call"
          fill
          sizes="50vw"
          style={{ objectFit: 'cover' }}
        />
        <div className="cta-img-overlay" />
      </div>
      <Reveal direction="right" className="cta-content">
        <div className="section-label">Private Access</div>
        <h2>Private Investment <em>Briefing.</em></h2>
        <div className="gold-rule" />
        <p className="section-intro">
          Book a direct 20-minute strategy call to discuss your portfolio allocation in the
          Mexican Caribbean.
        </p>
        <a
          href="https://calendly.com/ogostlascan/30min"
          target="_blank"
          rel="noopener"
          className="btn-primary"
          style={{ fontSize: '0.8rem', padding: '1rem 2.5rem' }}
        >
          Schedule Strategy Call
        </a>
        <div className="cta-steps">
          <div className="cta-step">
            <div className="step-num">1</div>
            <div className="step-text">Complete calendar booking</div>
          </div>
          <div className="cta-step">
            <div className="step-num">2</div>
            <div className="step-text">Receive confirmation email with curated portfolio materials</div>
          </div>
          <div className="cta-step">
            <div className="step-num">3</div>
            <div className="step-text">Complete pre-call questionnaire to customize discussion</div>
          </div>
        </div>
        <div className="cta-note">
          All consultations are strictly confidential. No obligation — our role is to provide
          clarity, not pressure.
        </div>
      </Reveal>
    </section>
  );
}
