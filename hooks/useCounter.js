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
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    let raf;
    // El primer setValue se dispara en un requestAnimationFrame, no de forma
    // síncrona al entrar al efecto (evita el re-render en cascada que marca
    // react-hooks/set-state-in-effect). target === 0 también pasa por acá:
    // el valor sigue siendo 0 en la pantalla, solo se fija un frame después.
    if (target === 0) {
      raf = requestAnimationFrame(() => setValue(0));
      return () => cancelAnimationFrame(raf);
    }
    const start = performance.now();
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
