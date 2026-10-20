"use client";

import { useRef } from 'react';
import { metricsData } from '../data/content';
import { useCounter } from '../hooks/useCounter';

function MetricItem({ target, suffix, label }) {
  const ref = useRef(null);
  const value = useCounter(target, ref);

  return (
    <div className="metric-item" ref={ref}>
      <span className="metric-num">{value}{suffix || ''}</span>
      <div className="metric-label">
        {label[0]}<br />{label[1]}
      </div>
    </div>
  );
}

export default function Metrics() {
  return (
    <section id="metrics">
      <div className="metrics-grid">
        {metricsData.map((m) => (
          <MetricItem key={m.label.join('-')} {...m} />
        ))}
      </div>
    </section>
  );
}
