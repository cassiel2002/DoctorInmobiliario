"use client";

import Reveal from './Reveal';
import { toolkitData } from '../data/content';
import { useUI } from '../context/UIContext';

// Solo se muestran las guías que ya tienen su PDF en public/ (ver data/content.js).
const availableGuides = toolkitData.filter((item) => item.available !== false);

export default function Toolkit() {
  const { openLeadModal } = useUI();

  return (
    <section id="toolkit">
      <Reveal>
        <div className="section-label">Investor&apos;s Toolkit</div>
        <h2>Strategic <em>Safeguards.</em></h2>
        <div className="gold-rule" />
        <p className="section-intro">
          Download the frameworks used by institutional investors to navigate the Mexican market.
        </p>
      </Reveal>

      <div className="toolkit-grid-new">
        {availableGuides.map((item, i) => (
          <Reveal key={item.id} delay={i * 0.1}>
            <div className="toolkit-card-new">
              <div className="toolkit-card-top-bar" />
              <div className="toolkit-doc-icon-new">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                <span className="toolkit-doc-type-new">{item.docType}</span>
              </div>
              <div className="toolkit-card-title">{item.title}</div>
              <div className="toolkit-card-desc">{item.desc}</div>
              <button className="btn-download-new" onClick={() => openLeadModal(item.guideName)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download Free Guide
              </button>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
