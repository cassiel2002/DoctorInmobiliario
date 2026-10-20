"use client";

import { useEffect, useState } from 'react';
import { useInView } from 'framer-motion';

/**
 * Replica la animación de contadores del script original (animateCounter).
 * Usa easing cúbico sobre 1800ms, disparado cuando el elemento entra en el
 * viewport (igual que el IntersectionObserver original, threshold 0.3).
 */
export function useCounter(target, ref) {
  const [value, setValue] = useState(0);
  const inView = useInView(ref, { amount: 0.3, once: true });

  useEffect(() => {
    if (!inView) return;
    if (target === 0) {
      setValue(0);
      return;
    }
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    let raf;
    function update(now) {
      const progress = Math.min((now - start) / 1800, 1);
      setValue(Math.round(ease(progress) * target));
      if (progress < 1) raf = requestAnimationFrame(update);
    }
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return value;
}
