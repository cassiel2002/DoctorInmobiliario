"use client";

import Reveal from '../Reveal';
import { rentalProcess } from '../../data/rentals';

export default function RentalsProcess() {
  return (
    <section id="process" className="rentals-alt">
      <Reveal>
        <div className="section-label">How it works</div>
        <h2>Renting with <em>a diagnosis first.</em></h2>
        <div className="gold-rule" />
        <p className="section-intro">
          The same rigor Augusto used as an ophthalmologist, applied to the home you will live in.
        </p>
      </Reveal>

      <ol className="rentals-steps">
        {rentalProcess.map((step, i) => (
          <Reveal as="li" key={step.num} delay={i * 0.06} className="rentals-step">
            <span className="rentals-step-num">{step.num}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
